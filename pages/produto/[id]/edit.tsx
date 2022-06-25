import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import InfinityLoading from '../../../components/InfinityLoading'
import styles from '../../../styles/Produto.module.css'
import { percentage, currency } from '../../../utils/valuesUtils'

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
    const [promotion, setPromotion] = useState("")
    const [imageInput, setImageInput] = useState("")
    const [imageFiles, setImageFiles] = useState<FileList>()
    const [image, setImage] = useState("")
    const { data: session, status } = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { query } = router
    const { data, error } = useSWR(
        () => query.id && `/api/produto/?_id=${query.id}`,
        fetcher
    )
    if (error) {
        return (<>
            {error.message}
        </>)
    }
    else if (!data) {
        return (<>
            <InfinityLoading active={true} />
        </>)
    }
    else if (data) {
        if (!data.image) {
            data.image = ['']
        }
        if (!dataSet) {
            setName(data.name)
            setDescription(data.description)
            setPrice(data.price)
            setPromotion(data.promotion)
            // setImage(data.image[0])
            setDataSet(true)
        }
        if (status === 'loading') { return <InfinityLoading active={true} /> }
        else if (status === "unauthenticated") { window.location.href = "/"; return <InfinityLoading active={true} /> }
        else if (status === 'authenticated') {
            return <>
                <InfinityLoading active={isLoading} />
                <section className={styles.Section}>
                    <div className={styles.Container}>
                        <div className={styles.Product}>
                            <h1 className={styles.Name}>{data.name || 'Nome do Produto'}</h1>
                            <div className={styles.ImageContainer}>
                                {/* <img className={styles.Image} src={data.image ? server + '/api/image/files/' + data.image[0] : '/product-placeholder.png'} alt="ProductCase" ></img> */}
                            </div>
                        </div>

                        <div className={styles.InfoContainer}>
                            <div className={styles.CurrencyContainer} >
                                <div>
                                    {/* <h3 className={styles.Promotion}>{brlMonetary(oldPrice == currentPrice ? '' : oldPrice)}</h3> */}
                                    {/* <h4 className={styles.Price}>{brlMonetary(currentPrice || '0')}</h4> */}
                                </div>
                            </div>
                            <button className={styles.Buy}>Adicionar ao Carrinho</button>
                        </div>
                    </div>

                    <div className={styles.DescriptionContainer}>
                        <h1>Descrição</h1>
                        <p className={styles.Description}>{data.description || 'Detalhes sobre o produto'}</p>
                    </div>
                </section>
                <button type='button' onClick={async () => {
                    // try {
                    //     var formData = new FormData()
                    //     for (let i = 0; imageFiles && i < imageFiles.length; i++) {
                    //         formData.append('file', imageFiles[i])
                    //     }
                    //     setIsLoading(true)
                    //     fetch('api/image/upload', {
                    //         method: "POST",
                    //         body: formData,
                    //     }).then(res => res.json())
                    //         .then(res => {
                    //             setImage(res.files[0].host + res.files[0].filename)
                    //             const data: any = { name, description, price, promotion }
                    //             const formBody = [];
                    //             for (var property in data) {
                    //                 var encodedKey = encodeURIComponent(property);
                    //                 var encodedValue = encodeURIComponent(data[property]);
                    //                 formBody.push(encodedKey + "=" + encodedValue);
                    //             }
                    //             for (let i = 0; res.files && i < res.files.length; i++) {
                    //                 var encodedKey = encodeURIComponent('imageFilesName');
                    //                 var encodedValue = encodeURIComponent(res.files[i].filename);
                    //                 formBody.push(encodedKey + "=" + encodedValue);
                    //             }
                    //             const encodedBody = formBody.join("&");
                    //             console.log(data)
                    //             fetch('api/produto/', {
                    //                 method: "POST",
                    //                 redirect: 'follow',
                    //                 headers: {
                    //                     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    //                 },
                    //                 body: encodedBody,
                    //             }).then(res => {
                    //                 if (res.url) window.location.href = res.url
                    //             }).catch(error => {
                    //                 console.log(error)
                    //             });
                    //         }).catch(error => {
                    //             console.log(error)
                    //         }).finally(() => setIsLoading(false));
                    // } catch (err) {
                    //     console.log(err);
                    // }
                }} className={styles.SubmitButton}>Salvar</button>

            </>
        }
    }
}
