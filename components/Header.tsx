import AccountInfo from './AccountInfo'
import Image from 'next/image'
export default function Header() {
    return (<>
        <header>
            <div id='upper-side-header'>
                <a id="logo-icon" href=""><Image src="/logo.png" width="300" height="135"></Image></a>
                <input type="text" placeholder="Pesquisa" id="search-input"></input>
                <button id="search-btn">Pesquisar</button>
                <AccountInfo/>
            </div>
            <div id='nav-bar'>
                <tr id='nav-bar-tr'>
                    <ul id='nav-bar-ul'>Item 1</ul>
                    <ul id='nav-bar-ul'>Item 2</ul>
                    <ul id='nav-bar-ul'>Item 3</ul>
                    <ul id='nav-bar-ul'>Item 4</ul>
                    <ul id='nav-bar-ul'>Item 5</ul>
                </tr>
            </div>
        </header>
    </>)

}