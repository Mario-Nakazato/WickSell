import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import styles from '../../styles/Perfil.module.css'
import useSWR from 'swr'
import { useState } from 'react'

const fetcher = (url: any) => fetch(url).then((res) => res.json())

const Home: NextPage = () => {
	const { data: session, status } = useSession()
	const { data } = useSWR('/api/perfil', fetcher)
	const [name, setName] = useState("")
	const [birthDate, setBirthDate] = useState("")
	const [cpf, setCPF] = useState("")
	const [phone, setPhone] = useState("")
	const [loaded, setLoaded] = useState(false)

	if (data && session && status == "authenticated") {
		if (!loaded) {
			setName(data.name ? data.name : "")
			setBirthDate(data.birthDate ? data.birthDate : "")
			setCPF(data.cpf ? data.cpf : "")
			setPhone(data.phone ? data.phone : "")
			setLoaded(true)
		}
		return (<>
			<div className={styles.Container}>
				<div className={styles.Form}>
					<div className={styles.InputBox}>
						<img className={styles.ProfileImg} alt="Profile" src={session?.user?.image!}></img>
					</div>
					<br></br>
					<div className={styles.InputBox}>
						<label className={styles.Label}>Email</label>
						<label className={styles.InputLabel}>{data.email}</label>
					</div>
					<br></br>
					<div className={styles.InputBox}>
						<label>Nome Completo</label>
						<input type="text" name='name' placeholder={"Nome Completo"} className={styles.Input} value={name} onChange={e => { setName(e.target.value) }} required ></input>
					</div>
					<div className={styles.InputBox}>
						<label>Data de Nascimento</label>
						<input type="date" name='birthDate' placeholder={"Data de Nascimento"} className={styles.Input} value={birthDate} onChange={e => { setBirthDate(e.target.value) }} required></input>
					</div>
					<div className={styles.InputBox}>
						<label>CPF</label>
						<input type="text" name='cpf' placeholder={"111.222.333-99"} className={styles.Input} value={cpf} onChange={e => {
							if (e.target.value.length <= 14 && e.target.value.length > 0) {
								var temp = e.target.value
								temp = temp.replace(/\D/g, '')
								if (temp.length < 4) {
									temp = temp.replace(/^(\d{0,3})/g, '$1')
								} else if (temp.length < 7) {
									temp = temp.replace(/^(\d{3})(\d{0,3})/g, '$1.$2')
								} else if (temp.length < 10) {
									temp = temp.replace(/^(\d{3})(\d{3})(\d{0,3})/g, '$1.$2.$3')
								} else {
									temp = temp.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})/g, '$1.$2.$3-$4')
								}
								setCPF(temp)
							} else if (e.target.value.length <= 14) {
								setCPF(e.target.value)
							}
						}} required ></input>
					</div>
					<div className={styles.InputBox}>
						<label>Telefone | Celular</label>
						<input type="text" name='phone' placeholder={"+55 (11) 91234-5678"} value={phone} onChange={e => {
							console.log(e.target.value.length)
							if (e.target.value.length < 20) {
								var temp = e.target.value
								temp = temp.replace(/\D/g, '')
								if (temp.length <= 2) {
									temp = temp.replace(/^(\d{1,2})/g, '+$1')
								} else if (temp.length <= 4) {
									temp = temp.replace(/^(\d{2})(\d{1,2})/g, '+$1 ($2')
								} else if (temp.length <= 9) {
									temp = temp.replace(/^(\d{2})(\d{2})(\d{1,4})/g, '+$1 ($2) $3')
								} else if (temp.length <= 12) {
									temp = temp.replace(/^(\d{2})(\d{2})(\d{4})(\d{1,4})/g, '+$1 ($2) $3-$4')
								} else {
									temp = temp.replace(/^(\d{2})(\d{2})(\d{4,5})(\d{4})/g, '+$1 ($2) $3-$4')
								}
								setPhone(temp)
							}
						}} className={styles.Input}></input>
					</div>
					<button type="button" className={styles.SubmitButton} onClick={async () => {
						if (cpf.length != 14) { alert("CPF inválido"); return }
						if (phone.length != 0 && phone.length < 18) { alert("Telefone inválido"); return }
						if (name.length == 0) { alert("Nome inválido"); return }
						const dataBody: any = { email: data.email, name, birthDate, cpf, phone }
						const formBody = []
						for (var property in dataBody) {
							var encodedKey = encodeURIComponent(property);
							var encodedValue = encodeURIComponent(dataBody[property]);
							formBody.push(encodedKey + "=" + encodedValue);
						}
						const encodedBody = formBody.join("&");
						await fetch('/api/perfil', {
							method: data.name ? 'PATCH' : 'POST',
							headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
							body: encodedBody
						}).finally(() => { window.location.reload() })
					}}>Salvar</button>
				</div>
			</div>
		</>)
	} else if (!data || status == "loading") {
		return (<>
			<div className={styles.Container}>
				<div className={styles.Form}>

					<div className={styles.InputBox}>
						<img className={styles.ProfileImg} alt="Profile" src={session?.user?.image!}></img>
					</div>
					<br></br>
					<div className={styles.InputBox}>
						<label className={styles.Label}>Email</label>
						<label className={styles.InputLabel}></label>
					</div>
					<br></br>
					<div className={styles.InputBox}>
						<span></span>
						<label>Nome Completo</label>
						<input disabled type="text" className={styles.Input} value={name} onChange={e => { setName(e.target.value) }} required></input>
					</div>
					<div className={styles.InputBox}>
						<label>Data de Nascimento</label>
						<input disabled type="date" className={styles.Input} value={birthDate} onChange={e => { setBirthDate(e.target.value) }} required></input>
					</div>
					<div className={styles.InputBox}>
						<label>CPF</label>
						<input disabled type="text" className={styles.Input} value={cpf} onChange={e => { setCPF(e.target.value) }} required></input>
					</div>
					<div className={styles.InputBox}>
						<label>Telefone ou Celular</label>
						<input disabled type="text" className={styles.Input} value={phone} onChange={e => { setPhone(e.target.value) }} ></input>
					</div>
					<button disabled type="submit" className={styles.SubmitButton}>Salvar</button>
				</div >
			</div>
		</>)
	} else return <></>
}
export default Home