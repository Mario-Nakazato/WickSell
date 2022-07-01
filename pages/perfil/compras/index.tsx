import { useSession } from 'next-auth/react'
import Router from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import InfinityLoading from '../../../components/InfinityLoading'

export default function Compras() {
    const { data: session, status } = useSession()
    if (status === 'loading') return <InfinityLoading active={true} />
    if (status === 'unauthenticated') Router.push('/')
    return (
        <>
            ei
        </>
    )
}
