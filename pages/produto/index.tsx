import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import DefaultHead from '../../components/DefaultHead'
import Header from '../../components/Header'
import InfinityLoading from '../../components/InfinityLoading'
import ProductCase from '../../components/ProductCase'
import styles from '../../styles/Produto.module.css'
import { currency, percentage } from '../../utils/InputMask'


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
                            <label className={styles.Label}>Nome do Produto</label>
                            <input type="text" name='name' placeholder={"Nome do Produto"} className={styles.Input} value={name} onChange={e => setName(e.target.value)} required></input>
                        </div>
                        <div className={styles.InputBox}>
                            <label className={styles.Label}>Descrição</label>
                            <textarea name='description' placeholder={"Descrição"} rows={5} className={styles.InputDescription} value={description} onChange={e => setDescription(e.target.value)} required></textarea>
                        </div>
                        <div className={styles.InputBox}>
                            <label className={styles.Label}>Preço</label>
                            <div className={styles.InputMonetary}>
                                <label className={styles.LabelCifra}>R$</label>
                                <input type="text" min='0' step='0.01' name='price' placeholder={"0,00"} className={styles.Input} value={price} onChange={e => setPrice(currency(e))} required></input>
                            </div>
                        </div>
                        <div className={styles.InputBox}>
                            <label className={styles.Label}>Promoção</label>
                            <input type="text" min='0' max='100' step='0.01' name='promotion' placeholder={"0,00%"} className={styles.Input} value={promotion} onChange={e => {
                                if (e.target.value.length < promotion.length && e.target.value[e.target.value.length - 1] !== '%') {
                                    if (e.target.value.length === 0) {
                                        setPromotion(percentage(e))
                                    } else {
                                        const value = e.target.value.substring(0, e.target.value.length - 1)
                                        setPromotion(percentage(value) + '%')
                                    }
                                } else {
                                    setPromotion(percentage(e) + '%')
                                }
                            }} required></input>
                        </div>
                        <div className={styles.InputBox}>
                            <label className={styles.Label}>Imagem do Produto</label>
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
                                        const data: any = { name, description, price, promotion }
                                        const formBody = [];
                                        for (var property in data) {
                                            var encodedKey = encodeURIComponent(property);
                                            var encodedValue = encodeURIComponent(data[property]);
                                            formBody.push(encodedKey + "=" + encodedValue);
                                        }
                                        for (let i = 0; res.files && i < res.files.length; i++) {
                                            var encodedKey = encodeURIComponent('imageFilesName');
                                            var encodedValue = encodeURIComponent(res.files[i].filename);
                                            formBody.push(encodedKey + "=" + encodedValue);
                                        }
                                        const encodedBody = formBody.join("&");
                                        console.log(data)
                                        fetch('api/produto/', {
                                            method: "POST",
                                            redirect: 'follow',
                                            headers: {
                                                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                                            },
                                            body: encodedBody,
                                        }).then(res => {
                                            if (res.url) window.location.href = res.url
                                        }).catch(error => {
                                            console.log(error)
                                        });
                                    }).catch(error => {
                                        console.log(error)
                                    }).finally(() => setStatus(false));
                            } catch (err) {
                                console.log(err);
                            }
                        }} className={styles.SubmitButton}>Salvar</button>
                    </form>
                    <br></br>
                </div>
                <ProductCase name={name} description={description} price={price} promotion={promotion} image={image} isPreview={true} />
            </div >
        </>
    )
}
