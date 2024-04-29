import React, { useState } from "react"

import "./Pizza.scss"

import { PizzaItem } from "types"

interface PizzaProps {
    item?: PizzaItem,
}

const Pizza: React.FC<PizzaProps> = ({ item }) => {
    const [loaded, setLoaded] = useState<boolean>(false)

    return item && loaded ?
        <a href={`pizzas/${item.id}`} className="pizza">
            <img src={item.img} alt={`${item.topping} Pizza`} />
            <div className="info">
                <div className="top">
                    <p title={`${item.topping} Pizza`} aria-label={`${item.topping} Pizza`}>{item.topping} Pizza</p>
                    <span>${item.price}</span>
                </div>
                <div className="bottom">
                    <i className="bx bxs-star"></i>
                    <p>{item.rating.toFixed(1)}</p>
                </div>
            </div>
        </a>
    :
        <div className="pizza-unloaded">
            <img style={{ opacity: "0" }} loading="lazy" onLoad={() => setLoaded(true)} src={item?.img} alt={`Pizza Loading`} />
        </div>
}

export default Pizza