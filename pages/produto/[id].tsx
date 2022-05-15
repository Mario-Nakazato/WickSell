import { useRouter } from 'next/router'
import useSWR from 'swr'
import Header from '../../components/Header'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
}

export default function Discipline() {
  const { query } = useRouter()
  const { data, error } = useSWR(
    () => query.id && `/api/disciplines/${query.id}`,
    fetcher
  )

  if (error) return <div>{error.message}</div>
  if (!data) return <div>Loading...</div>

  return (
    <>
      <Header />
      <table>
        <thead>
          <tr>
            <th>Disciplina</th>
            <th>Descrição</th>
            <th>Quantidade de conteúdos</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data.name}</td>
            <td>{data.description}</td>
            <td>{data.length}</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}
