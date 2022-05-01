import type { NextPage } from 'next'

import AccountInfo from '../../components/AccountInfo'

const AuthError: NextPage = () => {
  return (
    <>
      Verifique o seu email<br/>
      <AccountInfo/>
    </>
  )
}

export default AuthError
