import { GetStaticPaths, GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import DefaultHead from '../../../components/DefaultHead'
import Header from '../../../components/Header'
import InfinityLoading from '../../../components/InfinityLoading'
import { server } from '../../../config'
import styles from '../../../styles/ProductPage.module.css'
import { brlMonetary } from '../../../utils/valuesUtils'

export default function Produto({ data }: { data: any }) {
    const { data: session, status } = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    if (data) {
        var currentPrice = data.discount > 0 ? (data.price - (data.price * data.discount) / 100).toFixed(2) : data.price
        var oldPrice = data.discount > 0 ? data.price : undefined

        if (!data.image) {
            data.image = ['']
        }
        const control = (
            <>
                <div className={styles.Controls}>
                    <div className={styles.Dropdown}>
                        <button className={styles.DropButton}>
                            <img src='/gear.png' alt='Opções'></img>
                        </button>
                        <div className={styles.DropdownContent}>
                            <a onClick={() => router.push(router.asPath + '/edit')}>Editar</a>
                            <a onClick={() => {
                                const modal = document.getElementById('DeleteModal')
                                modal!.style.display = "block"
                            }}>Excluir</a>
                        </div>
                    </div>
                </div>
                <div id='DeleteModal' className={styles.DeleteModal}>
                    <div className={styles.DeleteModalContent}>
                        <span className={styles.Close} onClick={() => {
                            const modal = document.getElementById('DeleteModal')
                            modal!.style.display = "none"
                        }}>&times;</span>
                        <p>Confirmar exclusão?</p>
                        <div className={styles.Buttons}>
                            <a className={styles.Confirmar} onClick={() => {
                                const modal = document.getElementById('DeleteModal')
                                modal!.style.display = "none"
                                setIsLoading(true); deleteProduto(data).then(() => { router.push('/') })
                            }}>Excluir</a>
                            <a className={styles.Cancelar} onClick={() => {
                                const modal = document.getElementById('DeleteModal')
                                modal!.style.display = "none"
                            }}>Cancelar</a>
                        </div>
                    </div>
                </div>
            </>
        )
        if (status === 'authenticated') {
            return <>
                <DefaultHead />
                <Header />
                <InfinityLoading active={isLoading} />
                <section className={styles.Section}>
                    <div className={styles.UpperContainer}>
                        <h1 className={styles.Name}>{data.name}</h1>
                        {control}
                    </div>
                    <div className={styles.Container}>


                        <div className={styles.Product}>
                            <div className={styles.ImageContainer}>
                                <img className={styles.Image} src={server + '/api/image/files/' + data.image[0]} alt="ProductCase" ></img>
                            </div>
                        </div>

                        <div className={styles.InfoContainer}>
                            <div className={styles.CurrencyContainer} >
                                <h3 className={styles.Promotion}>{brlMonetary(oldPrice)}</h3>
                                <h4 className={styles.Price}>{brlMonetary(currentPrice)}</h4>
                            </div>
                            <button className={styles.Buy}>Adicionar ao Carrinho</button>
                        </div>


                    </div>
                    <br></br>
                    <div className={styles.DescriptionContainer}>
                        <h1>Descrição</h1>
                        <hr></hr>
                        <p className={styles.Description}>{data.description}</p>
                    </div>
                </section>
            </>
        } else {
            return <>
                <DefaultHead />
                <Header />
                <InfinityLoading active={isLoading} />
                <section className={styles.Section}>
                    <div className={styles.Container}>
                        <div className={styles.Product}>
                            <h1 className={styles.Name}>{data.name}</h1>
                            <div className={styles.ImageContainer}>
                                <img className={styles.Image} src={server + '/api/image/files/' + data.image[0]} alt="ProductCase" ></img>
                            </div>
                        </div>

                        <div className={styles.InfoContainer}>
                            <h3 className={styles.Promotion}>{brlMonetary(oldPrice)}</h3>
                            <h4 className={styles.Price}>{brlMonetary(currentPrice)}</h4>
                            <button className={styles.Buy}>Adicionar ao Carrinho</button>
                        </div>
                    </div>

                    <div className={styles.DescriptionContainer}>
                        <h1>Descrição</h1>
                        <p className={styles.Description}>{data.description}</p>
                    </div>
                </section>
            </>
        }
    }
}

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: [],
        fallback: true
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { id } = context.params!
    const data = await fetch(`${server}/api/produto/?_id=${id}`).then((res) => res.json())
    return {
        props: {
            data: data[0],
        },
        revalidate: 8
    }
}

const deleteProduto = async (produto: any) => {
    try {
        produto.image.forEach(async (element: any) => {
            try {
                const res = await fetch(`/api/image/files/${element}/delete`)
                const data = await res.json()
                if (res.status !== 200) {
                    console.log(data.message)
                }
                console.log(data)
            } catch (err) {
                console.log(err)
            }
        });
    } catch (err) {
        console.log(err)
    }
    try {
        const res = await fetch(`/api/produto/?_id=${produto._id}`, {
            method: 'DELETE',
        })
        const data = await res.json()
        if (res.status !== 200) {
            console.log(data.message)
        }
        return data
    } catch (err) {
        console.log(err)
    }
}