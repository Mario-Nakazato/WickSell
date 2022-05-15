import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import DefaultHead from '../components/DefaultHead'
import Header from '../components/Header'
import style from '../styles/Perfil.module.css'
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
				<div className={style.Container}>
					<form action='/api/perfil' method='post' className={style.Form}>
						<br></br>
						<div className={style.InputBox}>
							<img className={style.ProfileImg} alt="Profile" src={session?.user?.image!}></img>
						</div>
						<br></br>
						<div className={style.InputBox}>
							<label className={style.Label}>Email</label>
							<input type='text' name='email' className={style.Input} value={data.email} onChange={() => { }}></input>
						</div>
						<br></br>
						<div className={style.InputBox}>
							<label>Nome Completo</label>
							<input type="text" name='name' placeholder={"Nome Completo"} className={style.Input} required contentEditable></input>
						</div>
						<div className={style.InputBox}>
							<label>Data de Nascimento</label>
							<input type="date" name='birthDate' placeholder={"Data de Nascimento"} required className={style.Input}></input>
						</div>
						<div className={style.InputBox}>
							<label>CPF</label>
							<input type="text" name='cpf' placeholder={"111.222.333-99"} className={style.Input} required contentEditable></input>
						</div>
						<div className={style.InputBox}>
							<label>Telefone | Celular</label>
							<input type="tel" name='phone' placeholder={"(11) 91234-5678"} className={style.Input}></input>
						</div>
						<button type="submit" className={style.SubmitButton}>Salvar</button>
					</form>
				</div>
			</>
		)
	} else if (!data || status == "loading") {
		return (
			<>
				<DefaultHead></DefaultHead>
				<Header></Header>
				<div className={style.Container}>
					<form action='/api/perfil' method='PATCH' className={style.Form}>
						<br></br>
						<div className={style.InputBox}>
							<img className={style.ProfileImg} alt="Profile" src={session?.user?.image!}></img>
						</div>
						<br></br>
						<div className={style.InputBox}>
							<label className={style.Label}>Email</label>
							<input type='text' name='email' className={style.Input} value='Loading...' onChange={() => { }} ></input>
						</div>
						<br></br>
						<div className={style.InputBox}>
							<label>Nome Completo</label>
							<input type="text" name='name' placeholder={"Nome Completo"} className={style.Input} value={name} onChange={e => { setName(e.target.value) }} required></input>
						</div>
						<div className={style.InputBox}>
							<label>Data de Nascimento</label>
							<input type="date" name='birthDate' placeholder={"Data de Nascimento"} className={style.Input} value={birthDate} onChange={e => { setBirthDate(e.target.value) }} required></input>
						</div>
						<div className={style.InputBox}>
							<label>CPF</label>
							<input type="text" name='cpf' placeholder={"111.222.333-99"} value={cpf} className={style.Input} onChange={e => { setCPF(e.target.value) }} required></input>
						</div>
						<div className={style.InputBox}>
							<label>Telefone | Celular</label>
							<input type="tel" name='phone' placeholder={"(11) 91234-5678"} value={phone} className={style.Input} onChange={e => { setPhone(e.target.value) }}></input>
						</div>
						<button type="submit" className={style.SubmitButton}>Salvar</button>
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
				<div className={style.Container}>

					<form onSubmit={async () => {
						console.log('patch')
						const response = await fetch('/api/perfil', {
							method: 'PATCH',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ 'email': data.email, 'name': name, 'birthDate': birthDate, 'cpf': cpf, 'phone': phone })
						})
					}} className={style.Form}>
						<br></br>
						<div className={style.InputBox}>
							<img className={style.ProfileImg} alt="Profile" src={session?.user?.image!}></img>
						</div>
						<br></br>
						<div className={style.InputBox}>
							<label className={style.Label}>Email</label>
							<input type='text' name='email' className={style.Input} value={data.email} onChange={() => { }} ></input>
						</div>
						<br></br>
						<div className={style.InputBox}>
							<label>Nome Completo</label>
							<input type="text" name='name' placeholder={"Nome Completo"} className={style.Input} value={name} onChange={e => { setName(e.target.value); data.name = e.target.value }} required></input>
						</div>
						<div className={style.InputBox}>
							<label>Data de Nascimento</label>
							<input type="date" name='birthDate' placeholder={"Data de Nascimento"} className={style.Input} value={birthDate} onChange={e => { setBirthDate(e.target.value); data.birthDate = e.target.value }} required></input>
						</div>
						<div className={style.InputBox}>
							<label>CPF</label>
							<input type="text" name='cpf' placeholder={"111.222.333-99"} value={cpf} className={style.Input} onChange={e => { setCPF(e.target.value); data.cpf = e.target.value }} required></input>
						</div>
						<div className={style.InputBox}>
							<label>Telefone | Celular</label>
							<input type="tel" name='phone' placeholder={"(11) 91234-5678"} value={phone} className={style.Input} onChange={e => { setPhone(e.target.value); data.phone = e.target.value }}></input>
						</div>
						<button type="submit" className={style.SubmitButton}>Salvar</button>
					</form>
				</div >
			</>
		)
	} else {
		return <></>
	}
}

export default Home