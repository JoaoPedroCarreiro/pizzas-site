import React, { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import { UsrInfo } from "types"

import api from "api"

import "./Sign.scss"
import Input from "./Input"

type SignObject = {
    h1_first: string,
    h1_second: string,
    h2: string,
    submit: string,
    a: string,
    href: string
}

interface SignProps {
    type: "up" | "in"
}

const Sign: React.FC<SignProps> = ({ type }) => {
    const email = useRef<HTMLInputElement | null>(null)
    const username = useRef<HTMLInputElement | null>(null)
    const password = useRef<HTMLInputElement | null>(null)

    const manyReq = useRef<HTMLParagraphElement | null>(null)
    const errorDesc = useRef<HTMLDivElement | null>(null)

    const [emailInvalidMessage, setEmailInvalidMessage] = useState<string>("Please enter a valid email")
    const [usernameInvalidMessage, setUsernameInvalidMessage] = useState<string>("Please enter a valid username")
    const [passwordInvalidMessage, setPasswordInvalidMessage] = useState<string>("Your password must be 8-72 digits")

    const [errorMsg, setErrorMsg] = useState<string>("404 Error not found.")

    const navigate = useNavigate()
    
    type Types = {
        [type: string]: SignObject
    }

    const types: Types = {
        in: {
            h1_first: "Login into",
            h1_second: "your account",
            h2: "Log-In",
            submit: "Log In",
            a: "Not have an account yet?",
            href: "/signup"
        },
        up: {
            h1_first: "Create your",
            h1_second: "account here",
            h2: "Sign-Up",
            submit: "Create account",
            a: "Already have an account?",
            href: "/login"
        }
    }

    const submit = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault()
        event.stopPropagation()

        if(email.current) {
            email.current.removeAttribute("invalid-field-back")

            if(email.current.hasAttribute("invalid-field") || !email.current.value) {
                email.current.setAttribute("invalid-field", "")
                if(emailInvalidMessage === "Please enter a valid email") return
                setEmailInvalidMessage("Please enter a valid email")
                return
            }
        }

        (username.current as HTMLInputElement).removeAttribute("invalid-field-back")

        if((username.current as HTMLInputElement).hasAttribute("invalid-field") || !(username.current as HTMLInputElement).value) {
            (username.current as HTMLInputElement).setAttribute("invalid-field", "")
            if(usernameInvalidMessage === "Please enter a valid username") return
            setUsernameInvalidMessage("Please enter a valid username")
            return
        }

        (password.current as HTMLInputElement).removeAttribute("invalid-field-back")

        if((password.current as HTMLInputElement).hasAttribute("invalid-field") || !(password.current as HTMLInputElement).value) {
            (password.current as HTMLInputElement).setAttribute("invalid-field", "")
            if(passwordInvalidMessage === "Your password must be 8-72 digits") return
            setPasswordInvalidMessage("Your password must be 8-72 digits")
            return
        }

        if(type === "up") {
            try {
                await api.post<UsrInfo>("/signup", {
                    email: (email.current as HTMLInputElement).value,
                    username: (username.current as HTMLInputElement).value,
                    password: (password.current as HTMLInputElement).value
                })
            } catch (err: any) {
                type Err = {
                    [msg: string]: () => void
                }

                if(err.response?.statusText === "Too Many Requests") {
                    (manyReq.current as HTMLParagraphElement).removeAttribute("hidden")
                    return
                }

                const errors: Err = {
                    "Email is already registered": () => {
                        (email.current as HTMLInputElement).setAttribute("invalid-field-back", "")
                        setEmailInvalidMessage("Email is already registered")
                    },
                    "Username is already taken": () => {
                        (username.current as HTMLInputElement).setAttribute("invalid-field-back", "")
                        setUsernameInvalidMessage("Username is already taken")
                    }
                }
                
                if(errors[err.response.data.err]) {
                    errors[err.response.data.err]()
                    return
                }

                (errorDesc.current as HTMLDivElement).style.display = "flex"
                setErrorMsg(err.response.data.message + ". Details about error: " + err.response.data.err)

                return
            }

            navigate("/")

            return
        }

        try {
            await api.post<UsrInfo>("/login", {
                username: (username.current as HTMLInputElement).value,
                password: (password.current as HTMLInputElement).value
            })
        } catch (err: any) {
            if(err.response?.statusText === "Too Many Requests") {
                (manyReq.current as HTMLParagraphElement).removeAttribute("hidden")
                return
            }

            if(err.response.data.err === "User doesn't exists") {
                (username.current as HTMLInputElement).setAttribute("invalid-field-back", "")
                setUsernameInvalidMessage("User doesn't exists")
                return
            }

            if(err.response.data.err === "Incorrect Password") {
                (password.current as HTMLInputElement).setAttribute("invalid-field-back", "")
                setPasswordInvalidMessage("Incorrect Password")
                return
            }

            (errorDesc.current as HTMLDivElement).style.display = "flex"
            setErrorMsg(err.response.data.message + ". Details about error: " + err.response.data.err)

            return
        }

        const referrer = document.referrer.startsWith(window.location.origin + "/signup") ? "" : document.referrer

        navigate(referrer ? document.referrer.split(window.location.origin)[1]: "/")
    }

    const onChangeEmail = () => {
        const cur = email.current as HTMLInputElement

        if(!cur.value || !cur.checkValidity()) {
            cur.setAttribute("invalid-field", "")
            return
        }

        cur.removeAttribute("invalid-field")
    }

    const onChangeUsername = () => {
        const cur = username.current as HTMLInputElement

        if(!cur.value || !cur.checkValidity()) {
            cur.setAttribute("invalid-field", "")
            return
        }

        cur.removeAttribute("invalid-field")
    }

    const onChangePassword = () => {
        const cur = password.current as HTMLInputElement

        if(!cur.value || !cur.checkValidity() || cur.value.length < 8) {
            cur.setAttribute("invalid-field", "")
            return
        }

        cur.removeAttribute("invalid-field")
    }

    return (
        <div id="sign" onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
            if(event.key === "Enter") submit(event)
        }} tabIndex={0}>
            <div className="darker"></div>
            <div ref={errorDesc} id="error-desc">
                <p>{errorMsg}</p>
                <button onClick={(): void => { (errorDesc.current as HTMLDivElement).style.display = "none" }}>X</button>
            </div>
            <div id="content">
                <h1>{types[type].h1_first}<br />{types[type].h1_second}</h1>
                <section>
                    <h2>{types[type].h2}</h2>
                    <form>
                        {
                            type === "up" ?
                                <Input
                                    ref={email}
                                    id="email"
                                    type="email"
                                    maxLength={64}
                                    invalidMessage={emailInvalidMessage}
                                    onChange={onChangeEmail}
                                />
                            :
                                <></>
                        }
                        <Input
                            ref={username}
                            id="username"
                            type="text"
                            maxLength={32}
                            invalidMessage={usernameInvalidMessage}
                            onChange={onChangeUsername}
                        />
                        <Input
                            ref={password}
                            id="password"
                            type="password"
                            maxLength={72}
                            invalidMessage={passwordInvalidMessage}
                            onChange={onChangePassword}
                        />
                        <p ref={manyReq} hidden>Too many requests try again later.</p>
                        <input type="submit" value={types[type].submit} onClick={submit} />
                    </form>
                    <a href={types[type].href}>{types[type].a}</a>
                </section>
            </div>
        </div>
    )
}

export default Sign