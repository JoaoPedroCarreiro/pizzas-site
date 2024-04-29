import React, { forwardRef } from "react"

import "./Input.scss"

function capitalize(str: string): string {
    return str[0].toUpperCase() + str.slice(1)
}

interface InputProps {
    id: "email" | "username" | "password",
    type: "email" | "text" | "password",
    maxLength: number,
    invalidMessage: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ id, type, maxLength, invalidMessage, onChange }, ref) => {
    type Icon = {
        [id: string]: string
    }
    
    const icons: Icon = {
        "email": "envelope",
        "username": "user",
        "password": "lock"
    }
    
    return (
        <>
            <label className="label-form" htmlFor={id}>{capitalize(id)}</label>
            <div className="div-form">
                <i className={`input-icon bx bxs-${icons[id]}`}></i>
                <input
                    className="input-form"
                    ref={ref}
                    id={id}
                    name={id}
                    type={type}
                    placeholder={`Enter your ${id}`}
                    maxLength={maxLength}
                    onChange={onChange}
                />
                <span className="span-form">{invalidMessage}</span>
                {
                    type === "password" ? 
                        <button aria-label="Show Password" title="Show Password" onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                            event.preventDefault()
                            event.stopPropagation()

                            const input = document.getElementById(id) as HTMLInputElement

                            (event.currentTarget.firstChild as HTMLElement).className = 
                                input.type === "text" ?
                                    "bi bi-eye-fill"
                                :
                                    "bi bi-eye-slash-fill"

                            event.currentTarget.setAttribute("aria-label", input.type === "text" ? "Show Password" : "Hide Password")
                            event.currentTarget.setAttribute("title", input.type === "text" ? "Show Password" : "Hide Password")

                            input.type = input.type === "text" ? "password" : "text"
                        }}>
                            <i className="bi bi-eye-fill"></i>
                        </button>
                    :
                        <></>
                }
            </div>
        </>
    )
})

export default Input