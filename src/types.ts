interface UsrInfo {
    email?: string,
    username: string,
    password: string
}

interface UsrGet {
    id: number,
    username: string,
    img: string
}

interface PizzaItem {
    id: number,
    topping: string,
    price: number,
    ingredients: string,
    img: string,
    rating: number
}

interface NewPizzaItem extends Omit<PizzaItem, "id" | "rating"> {
    id_pizza: number,
    pizza_rating: number
}

interface UsrRating extends NewPizzaItem {
    rating: number
}

interface PageUsr {
    usr: UsrGet,
    ratings: UsrRating[]
}

export type { UsrInfo, UsrGet, PizzaItem, UsrRating, PageUsr }