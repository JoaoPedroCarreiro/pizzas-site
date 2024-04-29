import React from "react"

import { PageUsr } from "types"

function capitalize(str: string): string {
    return str[0].toUpperCase() + str.slice(1)
}

interface UsrNotLoggedProps {
    pageUser: PageUsr | null
}

const UsrNotLogged: React.FC<UsrNotLoggedProps> = ({ pageUser }) => {
    return pageUser ?
            <>
                <section id="user-content">
                    <div id="img-input">
                        <div id="label-not-logged">
                            <img src={pageUser.usr.img} alt={pageUser.usr.username} />
                        </div>
                    </div>
                    <div id="username-input">
                        <h1>{pageUser.usr.username}</h1>
                    </div>
                </section>
                <section id="see-ratings">
                    <h2><i className="bx bxs-star"></i>Ratings</h2>
                    <div id="usr-ratings">
                        { pageUser.ratings.map((pizza, index) => 
                            <div className="pizza-rating" key={`rating-${index}`}>
                                <img src={pizza.img} alt={pizza.topping} />
                                <div className="pizza-rating-left">
                                    <div>
                                        <h3>{pizza.topping} Pizza</h3>
                                        <p className="ingredients">{pizza.ingredients}</p>
                                        <p className="your-rating">{capitalize(pageUser.usr.username)}'s Rating: <span>{pizza.rating}<i className="bx bxs-star"></i></span></p>
                                        <p className="total-rating">Total Rating: <span>{pizza.pizza_rating}<i className="bx bxs-star"></i></span></p>
                                    </div>
                                </div>
                            </div>
                        )} 
                    </div>
                </section>
            </>
        :
            <></>
}

export default UsrNotLogged