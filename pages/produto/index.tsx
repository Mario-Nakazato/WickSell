import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import DefaultHead from '../../components/DefaultHead'
import Header from '../../components/Header'
import ProductCase from '../../components/ProductCase'
import styles from '../../styles/Produto.module.css'


const fetcher = async (url: string) => {
    const res = await fetch(url)
    const data = await res.json()

    if (res.status !== 200) {
        throw new Error(data.message)
    }
    return data
}

export default function Create() {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [promotion, setPromotion] = useState("")
    const [imageInput, setImageInput] = useState("")
    const [image, setImage] = useState("")
    return (
        <>
            <DefaultHead />
            <Header />
            <div className={styles.Container}>
                <div style={{ textAlign: 'center' }}>
                    <form action='/api/produto' method='post' className={styles.Form}>
                        <div className={styles.InputBox}>
                            <label>Nome do Produto</label>
                            <input type="text" name='name' placeholder={"Nome do Produto"} className={styles.Input} value={name} onChange={e => setName(e.target.value)} required></input>
                        </div>
                        <div className={styles.InputBox}>
                            <label>Descrição</label>
                            <input type="text" name='description' placeholder={"Descrição"} className={styles.Input} value={description} onChange={e => setDescription(e.target.value)} required></input>
                        </div>
                        <div className={styles.InputBox}>
                            <label>Preço</label>
                            <input type="number" min='0' step='0.01' name='price' placeholder={"Preço"} className={styles.Input} value={price} onChange={e => setPrice(e.target.value)} required></input>
                        </div>
                        <div className={styles.InputBox}>
                            <label>Promoção</label>
                            <input type="number" min='0' step='0.01' name='promotion' placeholder={"Promoção"} className={styles.Input} value={promotion} onChange={e => setPromotion(e.target.value)} required></input>
                        </div>
                        <div className={styles.InputBox}>
                            <label>Imagem do Produto</label>
                            <input type="file" name='image' accept='image/*' className={styles.InputImage} value={imageInput} onChange={e => {
                                setImageInput(e.target.value)
                                let formData = new FormData();
                                if (e.target.files) {
                                    formData.append('image', e.target.files[0]);
                                    fetch('api/image', { method: 'post', body: formData })
                                        .then(res => res.json())
                                        .then(res => {
                                            setImage('uploads/' + res.content.filename)
                                            console.log(image)
                                            console.log(res.content.filename)
                                        })
                                }
                            }} required></input>
                        </div>
                        <button type="submit" className={styles.SubmitButton}>Salvar</button>
                    </form>
                    <br></br>
                </div>
                <ProductCase name={name} description={description} price={price} promotion={promotion} image={image} />
            </div >
        </>
    )
}
