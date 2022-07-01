import { GetStaticPaths, GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import InfinityLoading from '../../../components/InfinityLoading'
import { server } from '../../../config'
import styles from '../../../styles/ProductPage.module.css'
import { brlMonetary } from '../../../utils/valuesUtils'
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default function Produto({ data }: { data: any }) {
    const { data: session, status } = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    if (data) {
        var currentPrice = data.discount > 0 ? (data.price - (data.price * data.discount) / 100).toFixed(2) : data.price
        var oldPrice = data.discount > 0 ? data.price : undefined
        const control = (
            <>
                <div className={styles.Controls}>
                    <div className={styles.Dropdown}>
                        <button className={styles.DropButton} onClick={() => {
                            const dropdown = document.getElementById('dropdown')
                            dropdown!.addEventListener('focusout', (e) => {
                                dropdown!.style.display = 'none';
                            });
                            dropdown!.style.display = 'block';
                            dropdown!.focus()
                        }}>
                            <img src='/gear.png' alt='Opções'></img>
                        </button>
                        <div tabIndex={0} id='dropdown' className={styles.DropdownContent}>
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
        if (status === 'authenticated' && session.user?.email === data.email) {
            return <>
                <InfinityLoading active={isLoading} />
                <section className={styles.Section}>
                    <div className={styles.UpperContainer}>
                        <h1 className={styles.Name}>{data.name || 'Nome do Produto'}</h1>
                        {control}
                    </div>
                    <div className={styles.Container}>


                        <div className={styles.Product}>
                            <div className={styles.ImageContainer}>
                                <img className={styles.Image} src={data.image ? server + '/api/image/files/' + data.image[0] : '/product-placeholder.png'} alt="ProductCase" ></img>
                            </div>
                        </div>

                        <div className={styles.InfoContainer}>
                            <div className={styles.CurrencyContainer} >
                                <div>
                                    <h3 className={styles.Promotion}>{brlMonetary(oldPrice == currentPrice ? '' : oldPrice)}</h3>
                                    <h4 className={styles.Price}>{brlMonetary(currentPrice || '0')}</h4>
                                </div>
                            </div>
                            <button className={styles.Buy} onClick={async () => {
                                if (data && session) {
                                    setIsLoading(true);
                                    await buyButtonHandler(data, session, router)
                                    setIsLoading(false);
                                }
                            }}>Adicionar ao Carrinho</button>
                        </div>
                    </div>
                    <br></br>
                    <div className={styles.DescriptionContainer}>
                        <h1>Descrição</h1>
                        <hr></hr>
                        <p className={styles.Description}>{data.description || 'Detalhes sobre o produto'}</p>
                    </div>
                </section>
            </>
        } else {
            return <>
                <InfinityLoading active={isLoading} />
                <section className={styles.Section}>
                    <div className={styles.UpperContainer}>
                        <h1 className={styles.Name}>{data.name || 'Nome do Produto'}</h1>
                    </div>
                    <div className={styles.Container}>


                        <div className={styles.Product}>
                            <div className={styles.ImageContainer}>
                                <img className={styles.Image} src={data.image ? server + '/api/image/files/' + data.image[0] : '/product-placeholder.png'} alt="ProductCase" ></img>
                            </div>
                        </div>

                        <div className={styles.InfoContainer}>
                            <div className={styles.CurrencyContainer} >
                                <div>
                                    <h3 className={styles.Promotion}>{brlMonetary(oldPrice == currentPrice ? '' : oldPrice)}</h3>
                                    <h4 className={styles.Price}>{brlMonetary(currentPrice || '0')}</h4>
                                </div>
                            </div>
                            <button className={styles.Buy} onClick={async () => {
                                setIsLoading(true);
                                if (data && session) {
                                    await buyButtonHandler(data, session, router)
                                }
                                setIsLoading(false);
                            }}>Adicionar ao Carrinho</button>
                        </div>
                    </div>
                    <br></br>
                    <div className={styles.DescriptionContainer}>
                        <h1>Descrição</h1>
                        <hr></hr>
                        <p className={styles.Description}>{data.description || 'Detalhes sobre o produto'}</p>
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
    const { _id } = context.params!
    const data = await fetch(`${server}/api/produto/?_id=${_id}`).then((res) => res.json())
    return {
        props: {
            data: data[0],
        },
        revalidate: 8
    }
}

const deleteProduto = async (produto: any) => {
    try {
        if (produto.image && produto.image?.length > 0) {
            produto.image.forEach(async (element: any) => {
                try {
                    const res = await fetch(`/api/image/files/${element}/delete`)
                    const data = await res.json()
                    if (res.status !== 200) {
                        console.log(data.message)
                    }
                } catch (err) {
                    console.log(err)
                }
            });
        }
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

async function buyButtonHandler(data: any, session: any, router: any) {
    const transaction = await fetch(`/api/transacao?comprador=${session?.user?.email}&estado=Carrinho`).then(res => res.json())
    if (transaction && transaction.length > 0) {
        var stocked = false
        transaction[0].carrinho.forEach((item: any) => {
            if (item.produto._id === data._id) {
                item.quantidade += 1
                stocked = true
            }
        })
        var dataBody: any
        if (stocked) {
            dataBody = { _id: transaction[0]._id, carrinho: transaction[0].carrinho, estado: 'Carrinho' }
        } else {
            dataBody = { _id: transaction[0]._id, carrinho: [...transaction[0].carrinho, { produto: { ...data }, quantidade: 1 }], estado: 'Carrinho' }
        }
        await fetch(`/api/transacao`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataBody)
        }).then(res => { if (res.status !== 200) alert('Falha ao adicionar ao carrinho'); else router.push('/carrinho') })
    } else if (transaction && transaction.length === 0) {
        const dataBody = { carrinho: [{ produto: { ...data }, quantidade: 1 }], estado: 'Carrinho' }
        await fetch(`/api/transacao`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataBody)
        }).then(res => { if (res.status !== 200) alert('Falha ao adicionar ao carrinho'); else router.push('/carrinho') })
    }
}