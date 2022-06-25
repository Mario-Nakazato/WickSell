import { useRouter } from 'next/router'
import InfinityLoading from '../components/InfinityLoading'
import styles from '../styles/SearchPage.module.css'
import useSWR from 'swr'
import ProductCase from '../components/ProductCase'
import { useState } from 'react'
import { brlMonetary, percentage } from '../utils/valuesUtils'

const fetcher = (url: any) => fetch(url).then((res) => res.json())

export default function Home() {
    const [minValue, setMinValue] = useState(0)
    const [maxValue, setMaxValue] = useState(0)
    const [search, setSearch] = useState('')
    const [useDescription, setUseDescription] = useState(false)
    const { query } = useRouter()
    const { name, description, discount, price } = query
    const queryName = name !== '' && name ? `name=${name}` : undefined
    const queryDescription = description !== '' && description ? `description=${description}` : undefined
    const queryDiscount = discount !== '' && discount ? `discount=${discount}` : undefined
    const queryPrice = price !== '' && price ? `price=${price}` : undefined
    const querySearch: string = [queryName!, queryDescription!, queryDiscount!, queryPrice!].filter((item) => item).join('&')
    const { data, error } = useSWR(`/api/produto?${querySearch}`, fetcher)
console.log(error)
    return (<>
        <InfinityLoading active={!data ? true : false} />
        <div className={styles.Container}>
            <div className={styles.SearchContainer}>
                <div>
                    <input type="text" className={styles.InputSearch} placeholder="Buscar" value={search} onChange={e => setSearch(e.target.value)} />
                    <button type="button" onClick={() => {
                        console.log(search, minValue, maxValue)
                        window.location.href = `/search?name=${search}&description=${useDescription ? search : ''}&discount=${minValue > 0 ? minValue : ''}&price=${maxValue > 0 ? maxValue : ''}`
                    }}><img className={styles.SearchIcon} src='/lupa-icon.svg' alt="Search Icon"></img></button>
                </div>
                <div>
                    <input type="checkbox" onClick={() => { setUseDescription(!useDescription) }} />
                    <span>Usar descrição</span>
                </div>
                <div>
                    <label>Min: {minValue.toFixed(2).replace('.',',')}%</label>
                    <input type="range" min="0" max="100" step={0.01} onChange={e => setMinValue(Number(e.target.value))} />
                </div>
                <div>
                    <label>Max: {brlMonetary(maxValue == 0 ? '0' : maxValue)}</label>
                    <input type="range" min="0" max="100" onChange={e => setMaxValue(Math.round(Math.exp((Math.log(1000) / 100) * Number(e.target.value))) * Number(e.target.value))} />
                </div>
            </div>
            <div className={styles.ProductsContainer}>
                {data?.map((product: any, i: number) => { return <ProductCase key={i} props={data[i]}></ProductCase> })}
            </div>
        </div>
    </>)
}