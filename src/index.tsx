import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import "styles/pizzas-wrapper.scss"

import App from "components/App"
import Sign from "components/Sign"
import Usr from "components/Usr"
import PageBase from "components/PageBase"
import PizzaPage from "components/PizzaPage"
import Menu from "components/Menu"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/">
                <Route index element={<PageBase><App /></PageBase>} />
                <Route path="login" element={<Sign type="in" />} />
                <Route path="signup" element={<Sign type="up" />} />
                <Route path="menu" element={<PageBase><Menu /></PageBase>} />
                <Route path="usr/:usr" element={<PageBase><Usr /></PageBase>} />
                <Route path="pizzas">
                    <Route path=":pizza" element={<PageBase><PizzaPage /></PageBase>}/>
                </Route>
            </Route>
        </Routes>
    </BrowserRouter>
)