import React, { useState, useEffect } from "react"

import "./App.scss"

import Pizza from "./Pizza/Pizza"

import api from "api"
import { PizzaItem } from "types"

import moon from "../assets/moon.png"
import pizza from "../assets/pizza.jpg"

interface AppProps {}

const App: React.FC<AppProps> = () => {
	const [pizzas, setPizzas] = useState<PizzaItem[] | undefined[]>([undefined, undefined, undefined, undefined])

	useEffect(() => {
		(async () => {
			try {
				const { data } = await api.get<PizzaItem[]>("/pizzas?amount=4")
				setPizzas(data)
			} catch (err) {}
		})()
	}, [])

	return (
		<>
			<section id="home">
				<div id="section-home"></div>
				<div id="banner">
					<h1>YOUR FAVORITE PIZZAS IN ONE PLACE</h1>
					<img src={pizza} alt="Pizza" />
				</div>
				<div id="about">
					<img src={moon} alt="moon-logo" />
					<p>Welcome to Lua Pizzas, where we bring the taste of Italy under the enchanting glow of the moon.</p>
					<p>At Lua Pizzas, we make each pizza with passion and precision, using only the freshest ingredients to ensure every bite is a delightful experience. Our dough is made from scratch daily, our sauces are simmered to perfection, and our toppings are carefully selected to tantalize your taste buds.</p>
					<p>But Lua Pizzas is more than just a pizzeria, it's a place where friends and families come together to share laughter, stories, and, of course, delicious pizza. Our warm and inviting atmosphere coupled with our friendly staff creates a dining experience that feels like home.</p>
				</div>
			</section>
			<section id="menu">
				<div id="section-menu"></div>
				<ul className="pizzas-wrapper">
					{ pizzas.map<React.ReactNode>((pizza, index) => <li key={`pizza-item-${index}`}><Pizza item={pizza} /></li>) }
				</ul>
				<a href="/menu" id="full-menu">VIEW MORE</a>
			</section>
		</>
	)
}

export default App