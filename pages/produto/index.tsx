import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import DefaultHead from '../../components/DefaultHead'
import Header from '../../components/Header'
import InfinityLoading from '../../components/InfinityLoading'
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
    const [status, setStatus] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [promotion, setPromotion] = useState("")
    const [imageInput, setImageInput] = useState("")
    const [imageFiles, setImageFiles] = useState<FileList>()
    const [image, setImage] = useState("")
    return (
        <>
            <DefaultHead />
            <Header />
            <InfinityLoading active={status} />
            <div className={styles.Container}>
                <div style={{ textAlign: 'center' }}>
                    <form className={styles.Form}>
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
                            <input type="file" name='image' accept='image/*' className={styles.InputImage} multiple value={imageInput} onChange={e => {
                                setImageInput(e.target.value)
                                if (e.target.files) {
                                    setImageFiles(e.target.files)
                                    setImage(URL.createObjectURL(e.target.files[0]));
                                }
                            }} required></input>
                        </div>
                        <button type='button' onClick={async () => {
                            try {
                                var formData = new FormData()
                                for (let i = 0; imageFiles && i < imageFiles.length; i++) {
                                    formData.append('file', imageFiles[i])
                                }
                                setStatus(true)
                                fetch('api/image/upload', {
                                    method: "POST",
                                    body: formData,
                                }).then(res => res.json())
                                    .then(res => {
                                        setImage(res.files[0].host + res.files[0].filename)
                                        var data: any = { name, description, price, promotion }
                                        data.imageFilesName = {}
                                        for (let i = 0; res.files && i < res.files.length; i++) {
                                            data.imageFilesName[i] = res.files[i].filename
                                        }
                                        console.log(data)
                                        //ativar trava visual
                                        fetch('api/produto/', {
                                            method: "POST",
                                            redirect: 'follow',
                                            body: JSON.stringify(data),
                                        }).then(res => {
                                            if (res.url) window.location.href = res.url
                                        }).catch(error => {
                                            console.log(error)
                                            setStatus(false)
                                        });
                                    }).catch(error => {
                                        console.log(error)
                                        setStatus(false)
                                    });
                            } catch (err) {
                                console.log(err);
                                setStatus(false)

                            }
                        }} className={styles.SubmitButton}>Salvar</button>
                    </form>
                    <br></br>
                </div>
                <ProductCase name={name} description={description} price={price} promotion={promotion} image={image} />
            </div >
        </>
    )
}
