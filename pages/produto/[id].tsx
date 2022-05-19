import { useRouter } from 'next/router'
import useSWR from 'swr'
import DefaultHead from '../../components/DefaultHead'
import Header from '../../components/Header'
import styles from '../../styles/ProductPage.module.css'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const dataTemp = await res.json()
  const data = dataTemp[0]
  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
}

export default function Produto() {
  const { query } = useRouter()
  const { data, error } = useSWR(
    () => query.id && `/api/produto/?_id=${query.id}`,
    fetcher
  )
  if (error) {
    return (<>
      <DefaultHead />
      <Header />
      {error.message}
    </>)
  }
  else if (!data) {
    return (<>
      <DefaultHead />
      <Header />
    </>)
  }
  else if (data) {

    return (
      <>
        <DefaultHead />
        <Header />
        <section className={styles.Section}>
          <div className={styles.Container}>
            <div className={styles.ImageContainer}>
              <img className={styles.Image} src={window.location.origin + '/api/image/files/' + data.image[0]}  ></img>
            </div>
            <div className={styles.InfoContainer}>
              <h1 className={styles.Name}>{data.name}</h1>
              <h3 className={styles.Promotion}>R$ {data.promotion}</h3>
              <h4 className={styles.Price}>R$ {data.price}</h4>
              <button className={styles.Buy}>Comprar</button>
            </div>
          </div>
          <div className={styles.DescriptionContainer}>
            <p className={styles.Description}>{data.description}</p>
          </div>
        </section>
        {/* {JSON.stringify(data)} */}
      </>
    )
  }
}
