import { useSession } from 'next-auth/react'
import { useState } from 'react'
import InfinityLoading from '../../components/InfinityLoading'
import ProductCase from '../../components/ProductCase'
import styles from '../../styles/Produto.module.css'
import { currency, percentage } from '../../utils/valuesUtils'


export default function Create() {
    const [statusLoading, setStatusLoading] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [discount, setDiscount] = useState("")
    const [amount, setAmount] = useState(0)
    const [imageInput, setImageInput] = useState("")
    const [imageFiles, setImageFiles] = useState<FileList>()
    const [image, setImage] = useState("")
    const { status } = useSession()
    if (status === 'loading') { return <InfinityLoading active={true} /> }
    else if (status === "unauthenticated") { window.location.href = "/"; return <InfinityLoading active={true} /> }
    else
        return (
            <>
                <InfinityLoading active={statusLoading} />
                <div className={styles.Container}>
                    <div style={{ textAlign: 'center' }}>
                        <form className={styles.Form}>
                            <div className={styles.InputBox}>
                                <label className={styles.Label}>Nome do Produto</label>
                                <input type="text" name='ProductName' placeholder={"Nome do Produto"} className={styles.Input} value={name} onChange={e => setName(e.target.value)} ></input>
                            </div>
                            <div className={styles.InputBox}>
                                <label className={styles.Label}>Descrição</label>
                                <textarea name='ProductDescription' placeholder={"Descrição"} rows={5} className={styles.InputDescription} value={description} onChange={e => setDescription(e.target.value)} ></textarea>
                            </div>
                            <div className={styles.InputBox}>
                                <label className={styles.Label}>Preço</label>
                                <div className={styles.InputMonetary}>
                                    <label className={styles.LabelCifra}>R$</label>
                                    <input type="text" min='0' step='0.01' name='ProductPrice' placeholder={"0,00"} className={styles.Input} value={price} onChange={e => {
                                        const temp = e.target.value.replace(/\D/g, '')
                                        console.log(temp)
                                        if (temp.length <= 12)
                                            setPrice(currency(e))
                                    }} ></input>
                                </div>
                            </div>
                            <div className={styles.QtdContainer}>
                                <div className={styles.InputBox}>
                                    <label className={styles.Label}>Promoção</label>
                                    <input type="text" min='0' max='100' step='0.01' name='ProductDiscount' placeholder={"0,00%"} className={styles.Input} value={discount} onChange={e => {
                                        if (e.target.value.length < discount.length && e.target.value[e.target.value.length - 1] !== '%') {
                                            if (e.target.value.length === 0) {
                                                setDiscount(percentage(e))
                                            } else {
                                                const value = e.target.value.substring(0, e.target.value.length - 1)
                                                setDiscount(percentage(value) + '%')
                                            }
                                        } else {
                                            setDiscount(percentage(e) + '%')
                                        }
                                    }} ></input>
                                </div>
                                <div className={styles.InputBox}>
                                    <label className={styles.Label}>Quantidade</label>
                                    <input type="number" min='0' step='1' name='ProductAmount' placeholder={"0"} className={styles.Input} value={amount} onChange={e => setAmount(Number(e.target.value))} ></input>
                                </div>
                            </div>
                            <div className={styles.InputBox}>
                                <label className={styles.Label}>Imagens do Produto</label>
                                <input type="file" name='image' accept='image/png, image/jpeg, image/jpg' className={styles.InputImage} multiple value={imageInput} onChange={e => {
                                    setImageInput(e.target.value)
                                    if (e.target.files) {
                                        setImageFiles(e.target.files)
                                        setImage(URL.createObjectURL(e.target.files[0]));
                                    }
                                }} ></input>
                            </div>
                            <button type='button' onClick={async () => {
                                try {
                                    var formData = new FormData()
                                    for (let i = 0; imageFiles && i < imageFiles.length; i++) {
                                        formData.append('file', imageFiles[i])
                                    }
                                    setStatusLoading(true)
                                    fetch('api/image/upload', {
                                        method: "POST",
                                        body: formData,
                                    }).then(res => res.json())
                                        .then(res => {
                                            if (res.files) setImage(res.files[0].host + res.files[0].filename)
                                            var numberPrice = price.replaceAll('.', '').replace(',', '.').replace('R$ ', '')
                                            var numberDiscount = discount.replace(',', '.').replace('%', '')
                                            const data: any = { name, description, price: numberPrice, discount: numberDiscount, amount }
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
                                            setStatusLoading(false)
                                        })
                                } catch (err) {
                                    console.log(err);
                                    setStatusLoading(false)
                                }
                            }} className={styles.SubmitButton}>Salvar</button>
                        </form>
                        <br></br>
                    </div>
                    <ProductCase name={name} description={description} price={price} discount={discount} image={image} isPreview={true} />
                </div >
            </>
        )
}
