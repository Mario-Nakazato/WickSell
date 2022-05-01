import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import DefaultHead from '../components/DefaultHead'
import Footer from '../components/Footer'
import Header from '../components/Header'

const Home: NextPage = () => {
  const { data: session, status } = useSession()

  if (session && status == "authenticated") {
    return (
      <>
        <DefaultHead></DefaultHead>
          <Header></Header>
          <h1>Produtos perfil [Promoção, similares, novidades ...]</h1>
          <ul>
            <li><a href='./auth'>Produto exemplo</a></li>
            <li>Produto 1</li>
            <li>Produto 2</li>
            <li>Produto 3</li>
            <li>Produto 4</li>
          </ul>
      </>
    )
  } else if (status == "loading") {
    return (
      <>
        <DefaultHead></DefaultHead>

          <Header></Header>
          <h1>Carregando...</h1>
      </>
    )
  } else {
    return (
      <>
        <DefaultHead></DefaultHead>
          <Header></Header>
          <h1>Produtos geral [Estrategias mais comprado, promoção ...]</h1>
          <ul>
            <li><a href='./auth'>Produto exemplo</a></li>
            <li>Produto 1</li>
            <li>Produto 2</li>
            <li>Produto 3</li>
            <li>Produto 4</li>
          </ul>
      </>
    )
  }
}

export default Home