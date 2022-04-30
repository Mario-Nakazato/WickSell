import type { NextPage } from 'next'
import DefaultHead from '../components/DefaultHead'
import Footer from '../components/Footer'
import Header from '../components/Header'

const Home: NextPage = () => {
  return (
    <>
      <DefaultHead></DefaultHead>
      <Header></Header>
      <h1>Hello world</h1>
      <Footer></Footer>
    </>
  )
}

export default Home
