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
            setName(data.name ? data.name : 'Nome do Produto')
            setDescription(data.description ? data.description : 'Descrição do Produto')
            setPrice(data.price ? data.price : '')
            setDiscount(data.discount ? data.discount : '')
            setImage(data.image ? server + '/api/image/files/' + data.image[0] : '/product-placeholder.png')
            setDataSet(true)
            //{brlMonetary(oldPrice == currentPrice ? '' : oldPrice)}
            // {brlMonetary(currentPrice || '0')}
            //{data.description || 'Detalhes sobre o produto'}
        }
        var currentPrice = data.discount > 0 ? (data.price - (data.price * data.discount) / 100).toFixed(2) : data.price
        var oldPrice = data.discount > 0 ? data.price : undefined


        // if (status === 'loading') { return <InfinityLoading active={true} /> }
        // else if (status === "unauthenticated") { window.location.href = "/"; return <InfinityLoading active={true} /> }
        // else if (status === 'authenticated') {
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
                                }}></input>
                                <input className={styles.Price} value={price} onChange={e => {
                                    const temp = e.target.value.replace(/\D/g, '')
                                    if (temp.length <= 12)
                                        setPrice(currency(e))
                                }}></input>
                            </div>
                        </div>
                        <button className={styles.Buy}>Salvar</button>
                    </div>


                </div>
                <br></br>
                <div className={styles.DescriptionContainer}>
                    <h1>Descrição</h1>
                    <hr></hr>
                    <textarea className={styles.Description} value={description} onChange={e => { setDescription(e.target.value) }}></textarea>
                </div>
            </section>
        </>
    }
}
// }
