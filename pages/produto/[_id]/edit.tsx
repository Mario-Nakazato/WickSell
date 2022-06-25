import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import InfinityLoading from '../../../components/InfinityLoading'
import { server } from '../../../config'
import styles from '../../../styles/ProductPage.module.css'
import { percentage, currency, brlMonetary } from '../../../utils/valuesUtils'

const fetcher = async (url: string) => await fetch(url).then(async (res) => {
    const dataTemp = await res.json()
    const data = dataTemp[0]
    if (res.status !== 200) {
        console.log(data.message)
    }
    return data
}).catch((err) => { console.log(err) })

const fetcherN = async (url: string) => await fetch(url).then(async (res) => {
    const data = await res.json()
    if (res.status !== 200) {
        console.log(data.message)
    }
    return data
}).catch((err) => { console.log(err) })

export default function Produto() {
    const [dataSet, setDataSet] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [discount, setDiscount] = useState("")
    const [imageInput, setImageInput] = useState("")
    const [imageFiles, setImageFiles] = useState<FileList>()
    const [image, setImage] = useState("")
    const { data: session, status } = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { query } = router
    const { data, error } = useSWR(() => query._id && `/api/produto/?_id=${query._id}`, fetcher)
    if (!data) {
        return (<>
            <InfinityLoading active={true} />
        </>)
    }
    else if (data) {
        if (!dataSet) {
            const empty = 0
            setName(data.name ? data.name : 'Nome do Produto')
            setDescription(data.description ? data.description : 'Descrição do Produto')
            setPrice(data.price ? data.price : 'R$ ' + currency(empty.toFixed(2)))
            setDiscount(data.discount ? data.discount : percentage(empty.toFixed(2)) + '%')
            setImage(data.image ? server + '/api/image/files/' + data.image[0] : '/product-placeholder.png')
            setDataSet(true)
        }

        if (status === 'loading') { window.location.href = "/"; return <InfinityLoading active={true} /> }
        else if (status === "unauthenticated") { return <InfinityLoading active={true} /> }
        else if (status === 'authenticated') {
            if (session.user!.email !== data.email) {
                window.location.href = "/"; return <InfinityLoading active={true} />
            }
            return <>
                <InfinityLoading active={isLoading} />
                <section className={styles.Section}>
                    <div className={styles.UpperContainer}>
                        <input className={styles.Name} value={name} onChange={e => setName(e.target.value)}></input>
                    </div>
                    <div className={styles.Container}>
                        <div className={styles.Product}>
                            <div className={styles.ImageContainer}>
                                <img className={styles.Image} src={image} alt="ProductCase" ></img>
                            </div>
                        </div>
                        <div className={styles.InfoContainer}>
                            <div className={styles.CurrencyContainer} >
                                <div>
                                    <input className={styles.Promotion} value={discount} onChange={e => {
                                        var temp = e.target.value
                                        if (temp.includes('0,00%')) {
                                            temp = temp.replace('0,00%', '')
                                        }
                                        if (e.target.value.length < discount.length && e.target.value[e.target.value.length - 1] !== '%') {
                                            if (e.target.value.length === 0) {
                                                setDiscount(percentage(temp))
                                            } else {
                                                const value = temp.substring(0, temp.length - 1)
                                                setDiscount(percentage(value) + '%')
                                            }
                                        } else {
                                            setDiscount(percentage(temp) + '%')
                                        }
                                    }}></input>
                                    <input className={styles.Price} value={price} onChange={e => {
                                        var temp = e.target.value
                                        if (temp.includes('R$ 0,00')) {
                                            temp = temp.replace('R$ 0,00', '')
                                        }
                                        temp = temp.replace(/\D/g, '')
                                        if (temp.length <= 12)
                                            setPrice('R$ ' + currency(temp))
                                    }}></input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <div className={styles.DescriptionContainer}>
                        <h1>Descrição</h1>
                        <hr></hr>
                        <textarea className={styles.Description} value={description} onChange={e => { setDescription(e.target.value) }}></textarea>
                    </div>
                    <button className={styles.Save} onClick={async () => {
                        try {
                            var formData = new FormData()
                            for (let i = 0; imageFiles && i < imageFiles.length; i++) {
                                formData.append('file', imageFiles[i])
                            }
                            setIsLoading(true)
                            fetch('api/image/upload', {
                                method: "PATCH",
                                body: formData,
                            }).then(res => res.json())
                                .then(res => {
                                    if (res.files) setImage(res.files[0].host + res.files[0].filename)
                                    var numberPrice = price.replaceAll('.', '').replace(',', '.').replace('R$ ', '')
                                    var numberDiscount = discount.replace(',', '.').replace('%', '')
                                    const data: any = { name, description, price: numberPrice, discount: numberDiscount, }
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
                                        method: "PATCH",
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
                                    setIsLoading(false)
                                })
                        } catch (err) {
                            console.log(err);
                            setIsLoading(false)
                        }
                    }}>Salvar</button>

                </section>
            </>
        }
    }
}
