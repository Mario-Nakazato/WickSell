export default function AccountInfo(): JSX.Element {
    var accountInfoLogged = false;
    if (!accountInfoLogged) {
        return (<>
            <div id="accountInfo">
                <div id="account-btn">
                    <a id="login-btn" onClick={() => { }}>Entrar</a>
                    <div id="btn-separator" >|</div>
                    <a id="register-btn" onClick={() => { }}>Registrar-se</a>
                </div>
                <div>
                    <img id="profile-img" src="/profile-placeholder.png"></img>
                </div>
            </div>
        </>)
    } else {
        return <></>
    }
}