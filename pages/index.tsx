import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import Nav from '../components/nav'
import { useSession } from "next-auth/react"

const Home: NextPage = () => {
  const { data: session, status } = useSession()

  if (session && status == "authenticated") {
    return (
      <>
        <Head>
          <title>Wicksell $</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <header>
            <a id="logo-icon" href=""><Image src="/logo.png" width="300" height="135"></Image></a>
            <input type="text" placeholder="Pesquisa" id="search-input"></input>
            <button id="search-btn">Pesquisar</button>
            <Nav />
          </header>
          <h1>Produtos perfil [Promoção, similares, novidades ...]</h1>
          <ul>
            <li><a href='/auth'>Produto exemplo</a></li>
            <li>Produto 1</li>
            <li>Produto 2</li>
            <li>Produto 3</li>
            <li>Produto 4</li>
          </ul>
        </body>
      </>
    )
  } else if (status == "loading") {
    return (
      <>
        <Head>
          <title>Carregando...</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <header>
            <a id="logo-icon" href=""><Image src="/logo.png" width="300" height="135"></Image></a>
            <input type="text" placeholder="Pesquisa" id="search-input"></input>
            <button id="search-btn">Pesquisar</button>
            <Nav />
          </header>
          <h1>Carregando...</h1>
        </body>
      </>
    )
  } else {
    return (
      <>
        <Head>
          <title>Wicksell</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <header>
            <a id="logo-icon" href=""><Image src="/logo.png" width="300" height="135"></Image></a>
            <input type="text" placeholder="Pesquisa" id="search-input"></input>
            <button id="search-btn">Pesquisar</button>
            <Nav />
          </header>
          <h1>Produtos geral [Estrategias mais comprado, promoção ...]</h1>
          <ul>
            <li><a href='/auth'>Produto exemplo</a></li>
            <li>Produto 1</li>
            <li>Produto 2</li>
            <li>Produto 3</li>
            <li>Produto 4</li>
          </ul>
        </body>
      </>
    )
  }

}

export default Home
