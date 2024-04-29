import React, { useContext, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

import "./Usr.scss"

import { UsrContext } from "./PageBase"

import api from "api"

import { PageUsr, UsrGet, UsrRating } from "types"

import UsrNotLogged from "./Usr/UsrNotLogged"
import UsrLogged from "./Usr/UsrLogged"

interface UsrProps {}

const Usr: React.FC<UsrProps> = () => {
    const user = useContext(UsrContext)

    const [pageUser, setPageUser] = useState<PageUsr | null>(null)

    const { pathname } = useLocation()
    
    useEffect(() => {
        (async () => {
            const id = pathname.split("/")[pathname.split("/").length - 1]

            let usr: UsrGet | null = null
            let ratings: UsrRating[] | null = null

            try {
                usr = (await api.get<UsrGet>(`/usr/${id}`)).data
                ratings = (await api.get<UsrRating[]>(`/usr/${id}/ratings`)).data

                if(!usr) throw new Error("User not connected")
            } catch { return }

            setPageUser({ usr: usr as UsrGet, ratings: ratings as UsrRating[] })
        })()
    }, [pathname])

    return (
        <>
            <section id="user-wrapper">
                {
                    pageUser ?
                        user?.username === pageUser.usr.username ?
                            <UsrLogged pageUser={pageUser} />
                        :
                            <UsrNotLogged pageUser={pageUser} />
                    :
                        <></>
                }
            </section>
        </>
    )
}

export default Usr