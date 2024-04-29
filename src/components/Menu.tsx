import React, { useEffect, useState } from "react"

import api from "api"
import { PizzaItem } from "types"
import Pizza from "./Pizza/Pizza"

interface MenuProps {}

const Menu: React.FC<MenuProps> = () => {
    const [pizzas, setPizzas] = useState<PizzaItem[] | null>(null)

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get<PizzaItem[]>("/pizzas")
                setPizzas(data)
            } catch {}
        })()
    })

    return pizzas ?
        <section className="pizzas-wrapper" style={{ justifyContent: "center", margin: "40px 0" }}>
            { pizzas.map((item, index) => {
                return <Pizza key={"pizza" + index} item={item} />
            }) }
        </section>
    :
        <></>
}

export default Menu