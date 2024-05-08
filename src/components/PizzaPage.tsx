import React, { useContext, useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"

import "./PizzaPage.scss"
import api from "api"

import { PizzaItem } from "types"
import { UsrContext } from "./PageBase"

interface PizzaPageProps {}

const PizzaPage: React.FC<PizzaPageProps> = () => {
    const user = useContext(UsrContext)

    const bgRef = useRef<HTMLDivElement | null>(null)
    const ratingRef = useRef<HTMLSpanElement | null>(null)
    const ratingErrRef = useRef<HTMLParagraphElement | null>(null)
    const popupRef = useRef<HTMLDivElement | null>(null)
    const loadingPopupRef = useRef<HTMLDivElement | null>(null)

    const { pathname } = useLocation()

    const [pizza, setPizza] = useState<PizzaItem | undefined>(undefined)
    const [enabled, setEnabled] = useState<boolean>(true)

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get<PizzaItem>(pathname)
                setPizza(data)
            } catch (err) {}
        })()
    }, [pathname])

    const popup = (): void => {
        const curPopup = popupRef.current as HTMLDivElement
        const curLoadingPopup = loadingPopupRef.current as HTMLDivElement

        curPopup.style.animation = "0.7s ease 0s 1 normal forwards running show"
        curLoadingPopup.style.animation = "4.7s ease 0s 1 normal none running loading"

        setTimeout(() => {
            curPopup.style.animation = "0.7s ease 0s 1 normal forwards running hide"
            setTimeout(() => { curLoadingPopup.style.animation = "" }, 600)
        }, 2600)
    }

    const selectRating = (event: React.MouseEvent<HTMLButtonElement>): void => {
        const rect = event.currentTarget.getBoundingClientRect()
        const x = (Math.floor(event.clientX - rect.left) / event.currentTarget.clientWidth) * 100;
        
        (ratingRef.current as HTMLSpanElement).textContent = (x / 20).toFixed(1);
        (bgRef.current as HTMLDivElement).style.width = `${x ? x : 0}%`
    }

    const clearRating = (): void => {
        (ratingRef.current as HTMLSpanElement).textContent = (pizza as PizzaItem).rating.toFixed(1);
        (bgRef.current as HTMLDivElement).style.width = `${(pizza as PizzaItem).rating * 20}%`
    }

    const rate = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        setEnabled(false)

        const rect = event.currentTarget.getBoundingClientRect()
        const x = (Math.floor(event.clientX - rect.left) / event.currentTarget.clientWidth) * 100

        try {
            let token = ""
            for(const cookie of document.cookie.split(";")) {
                if(cookie.startsWith("token=")) token = cookie.split("token=")[1]
            }

            if(user)
                await api.post<{ token: string, rating: number, pizza: number }>(
                    `/usr/${user.id}/rating`,
                    {
                        token,
                        rating: Number((x / 20).toFixed(1)),
                        pizza: (pizza as PizzaItem).id
                    }
                )
            else throw new Error("Not Logged")
        } catch (err: any) {
            setTimeout(() => setEnabled(true), 3000)

            if(err.message === "Not Logged") (ratingErrRef.current as HTMLParagraphElement).style.display = "block"

            return
        }

        popup()

        setTimeout(() => {
            setEnabled(true)
        }, 3000)
    }

    return pizza ?
        <section id="pizza-page">
            <div>
                <div id="popup" ref={popupRef}>
                    <div id="loading-popup" ref={loadingPopupRef}></div>
                    <p id="popup-title">Thanks for your feedback!</p>
                    <p>See all your ratings in your profile</p>
                </div>
                <img src={pizza.img} alt={`${pizza.topping} Pizza`} />
                <div id="division-pizza"></div>
                <div id="pizza-content">
                    <h1>{pizza.topping} Pizza</h1>
                    <p id="ingredients">{pizza.ingredients}</p>
                    <div id="price-rating">
                        <p id="price">$ {pizza.price}</p>
                        <div id="rating">
                            <span ref={ratingRef}>{pizza.rating.toFixed(1)}</span>
                            <p ref={ratingErrRef}>You must be logged to <br />rate a pizza</p>
                            <button aria-label="Rate Pizza" title="Rate Pizza" id="rate-low-width"><i className="bx bxs-star"></i></button>
                            <button
                                id="rate"
                                onMouseMove={selectRating}
                                onMouseLeave={clearRating}
                                onClick={rate}
                                disabled={!enabled}
                            >
                                <div id="bg-1">
                                    <div id="bg-2" ref={bgRef} style={{ width: `${pizza.rating ? pizza.rating * 20: 0}%` }}>
                                        <i className="bx bxs-star"></i>
                                        <i className="bx bxs-star"></i>
                                        <i className="bx bxs-star"></i>
                                        <i className="bx bxs-star"></i>
                                        <i className="bx bxs-star"></i>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    :
        <section id="pizza-page">
            <div></div>
        </section>
}

export default PizzaPage