import React, { useState, useEffect, useRef, createContext } from "react"

import "./PageBase.scss"

import { UsrGet } from "types"

import api from "api"
import moon from "../assets/moon.png"

export const UsrContext = createContext<UsrGet | null>(null)

interface PageBaseProps {
    children: React.ReactNode
}

const PageBase: React.FC<PageBaseProps> = ({ children }) => {
	const floatingMenuRef = useRef<HTMLDivElement | null>(null)

	const [id, setId] = useState<number>(-1)
    const [user, setUser] = useState<UsrGet | null>(null)

    useEffect(() => {
        window.addEventListener("resize", (): void => {
            if(window.innerWidth > 490) (floatingMenuRef.current as HTMLDivElement).removeAttribute("data-show")
        });

        (async () => {
			let id: number = 0
            let usr: UsrGet | null = null

			for(const cookie of document.cookie.split(";")) {
				if(cookie.startsWith("token=")) {
					try {
                        id = (await api.post<{ id: number }>("/", cookie.split("token=")[1])).data.id
					} catch {} finally {
                        try {
                            usr = (await api.get<UsrGet>(`/usr/${id}`)).data
                        } catch (err: any) {}
                    }

					break
				}
			}

			setId(id)
            setUser(usr)
		})()
    }, [])

    return (
        <UsrContext.Provider value={user}>
            <div ref={floatingMenuRef} id="floating-menu">
				<button onClick={() => (floatingMenuRef.current as HTMLDivElement).toggleAttribute("data-show")}>
					<i className="bx bx-x"></i>
				</button>
				<ul>
					<li><a href="/#section-home"><i className="bx bxs-home"></i>HOME</a></li>
					<li><a href="/#section-menu"><i className="bx bxs-food-menu"></i>MENU</a></li>
					<li><a href="#section-contact"><i className="bx bxs-user"></i>CONTACT</a></li>
				</ul>
			</div>
			<div id="nav-box"></div>
            <nav>
                {
                    id > -1 ?
                        <>
                            <button onClick={() => (floatingMenuRef.current as HTMLDivElement).toggleAttribute("data-show")}>
                                <i className="bx bx-menu"></i>
                            </button>
                            <a id="lua" href="/"><img src={moon} alt="Lua Pizzas" /></a>
                            <ul>
                                <li><a href="/#section-home">HOME</a></li>
                                <li><a href="/#section-menu">MENU</a></li>
                                <li><a href="#section-contact">CONTACT</a></li>
                                {
                                    id === 0 || !user ?
                                        <>
                                            <li id="li-login"><a href="/login">LOG-IN</a></li>
                                            <li id="li-signup"><a href="/signup">SIGN-UP</a></li>
                                        </>
                                    :
                                        <li id="li-user">
                                            <a href={`/usr/${id}`}><img src={(user as UsrGet).img} alt={(user as UsrGet).username} /></a>
                                        </li>
                                }
                            </ul>
                        </>
                    :
                        <></>
                }
            </nav>
            {children}
            <footer id="contact">
                <div id="section-contact"></div>
                <a id="footer-logo" href="/">
                    <img src={moon} alt="Lua Pizzas" />
                    <p>Lua Pizzas</p>
                </a>
                <div id="contacts">
                    <ul>
                        <li><a href="#"><i className="bx bxs-phone"></i>(99) 98765-4321</a></li>
                        <li><a href="#"><i className="bx bxs-envelope"></i>fakeemail@luapizzas.com</a></li>
                        <li><a href="#"><i className="bx bxl-instagram-alt" ></i>@luapizzas</a></li>
                    </ul>
                </div>
            </footer>
        </UsrContext.Provider>
    )
}

export default PageBase