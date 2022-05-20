import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import DefaultHead from '../components/DefaultHead'
import Header from '../components/Header'
import styles from '../styles/Perfil.module.css'
import useSWR from 'swr'
import { useState } from 'react'

const fetcher = (url: any) => fetch(url).then((res) => res.json())

const Home: NextPage = () => {
	const { data: session, status } = useSession()
	const { data, error } = useSWR('/api/perfil', fetcher)
	const [name, setName] = useState("")
	const [birthDate, setBirthDate] = useState("")
	const [cpf, setCPF] = useState("")
	const [phone, setPhone] = useState("")
	if (data && !data.name && session && status == "authenticated") {
		return (
			<>
				<DefaultHead></DefaultHead>
				<Header></Header>
				<div className={styles.Container}>
					<form action='/api/perfil' method='post' className={styles.Form}>
						<br></br>
						<div className={styles.InputBox}>
							<img className={styles.ProfileImg} alt="Profile" src={session?.user?.image!}></img>
						</div>
						<br></br>
						<div className={styles.InputBox}>
							<label className={styles.Label}>Email</label>
							<input type='text' name='email' className={styles.Input} value={data.email} onChange={() => { }}></input>
						</div>
						<br></br>
						<div className={styles.InputBox}>
							<label>Nome Completo</label>
							<input type="text" name='name' placeholder={"Nome Completo"} className={styles.Input} required contentEditable></input>
						</div>
						<div className={styles.InputBox}>
							<label>Data de Nascimento</label>
							<input type="date" name='birthDate' placeholder={"Data de Nascimento"} required className={styles.Input}></input>
						</div>
						<div className={styles.InputBox}>
							<label>CPF</label>
							<input type="text" name='cpf' placeholder={"111.222.333-99"} className={styles.Input} required contentEditable></input>
						</div>
						<div className={styles.InputBox}>
							<label>Telefone | Celular</label>
							<input type="tel" name='phone' placeholder={"(11) 91234-5678"} className={styles.Input}></input>
						</div>
						<button type="submit" className={styles.SubmitButton}>Salvar</button>
					</form>
				</div>
			</>
		)
	} else if (!data || status == "loading") {
		return (
			<>
				<DefaultHead></DefaultHead>
				<Header></Header>
				<div className={styles.Container}>
					<form action='/api/perfil' method='PATCH' className={styles.Form}>
						<br></br>
						<div className={styles.InputBox}>
							<img className={styles.ProfileImg} alt="Profile" src={session?.user?.image!}></img>
						</div>
						<br></br>
						<div className={styles.InputBox}>
							<label className={styles.Label}>Email</label>
							<input type='text' name='email' className={styles.Input} value='Loading...' onChange={() => { }} ></input>
						</div>
						<br></br>
						<div className={styles.InputBox}>
							<label>Nome Completo</label>
							<input type="text" name='name' placeholder={"Nome Completo"} className={styles.Input} value={name} onChange={e => { setName(e.target.value) }} required></input>
						</div>
						<div className={styles.InputBox}>
							<label>Data de Nascimento</label>
							<input type="date" name='birthDate' placeholder={"Data de Nascimento"} className={styles.Input} value={birthDate} onChange={e => { setBirthDate(e.target.value) }} required></input>
						</div>
						<div className={styles.InputBox}>
							<label>CPF</label>
							<input type="text" name='cpf' placeholder={"111.222.333-99"} value={cpf} className={styles.Input} onChange={e => { setCPF(e.target.value) }} required></input>
						</div>
						<div className={styles.InputBox}>
							<label>Telefone | Celular</label>
							<input type="tel" name='phone' placeholder={"(11) 91234-5678"} value={phone} className={styles.Input} onChange={e => { setPhone(e.target.value) }}></input>
						</div>
						<button type="submit" className={styles.SubmitButton}>Salvar</button>
					</form>
				</div >
			</>
		)
	} else if (data && data.name) {
		if (data.name != name) setName(data.name)
		if (data.birthDate != birthDate) setBirthDate(data.birthDate)
		if (data.cpf != cpf) setCPF(data.cpf)
		if (data.phone != phone) setPhone(data.phone)

		return (
			<>
				<DefaultHead></DefaultHead>
				<Header></Header>
				<div className={styles.Container}>

					<form onSubmit={async () => {
						const response = await fetch('/api/perfil', {
							method: 'PATCH',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ 'email': data.email, 'name': name, 'birthDate': birthDate, 'cpf': cpf, 'phone': phone })
						})
					}} className={styles.Form}>
						<br></br>
						<div className={styles.InputBox}>
							<img className={styles.ProfileImg} alt="Profile" src={session?.user?.image!}></img>
						</div>
						<br></br>
						<div className={styles.InputBox}>
							<label className={styles.Label}>Email</label>
							<input type='text' name='email' className={styles.Input} value={data.email} onChange={() => { }} ></input>
						</div>
						<br></br>
						<div className={styles.InputBox}>
							<label>Nome Completo</label>
							<input type="text" name='name' placeholder={"Nome Completo"} className={styles.Input} value={name} onChange={e => { setName(e.target.value); data.name = e.target.value }} required></input>
						</div>
						<div className={styles.InputBox}>
							<label>Data de Nascimento</label>
							<input type="date" name='birthDate' placeholder={"Data de Nascimento"} className={styles.Input} value={birthDate} onChange={e => { setBirthDate(e.target.value); data.birthDate = e.target.value }} required></input>
						</div>
						<div className={styles.InputBox}>
							<label>CPF</label>
							<input type="text" name='cpf' placeholder={"111.222.333-99"} value={cpf} className={styles.Input} onChange={e => { setCPF(e.target.value); data.cpf = e.target.value }} required></input>
						</div>
						<div className={styles.InputBox}>
							<label>Telefone | Celular</label>
							<input type="tel" name='phone' placeholder={"(11) 91234-5678"} value={phone} className={styles.Input} onChange={e => { setPhone(e.target.value); data.phone = e.target.value }}></input>
						</div>
						<button type="submit" className={styles.SubmitButton}>Salvar</button>
					</form>
				</div >
			</>
		)
	} else {
		return <></>
	}
}

export default Home