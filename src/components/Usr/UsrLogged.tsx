import React, { useEffect, useRef, useState } from "react"

import api from "api"

import { PageUsr, UsrGet } from "types"

interface UsrLoggedProps {
    pageUser: PageUsr
}

const UsrLogged: React.FC<UsrLoggedProps> = ({ pageUser }) => {
    const calcWidthRef = useRef<HTMLPreElement | null>(null)
    const errMsgUsernameRef = useRef<HTMLSpanElement | null>(null)
    const errMsgImgRef = useRef<HTMLSpanElement | null>(null)
    const darkRef = useRef<HTMLDivElement | null>(null)
    const deleteRef = useRef<HTMLDivElement | null>(null)
    const nameConfirmRef = useRef<HTMLInputElement | null>(null)
    const deleteButtonRef = useRef<HTMLButtonElement | null>(null)

    const [user, setUser] = useState<UsrGet>(pageUser.usr)
    const [initialWidth, setInitialWidth] = useState<string>("0px")

    const [errMsgUsername, setErrMsgUsername] = useState<string>("Invalid Username")
    const [errMsgImg, setErrMsgImg] = useState<string>("Invalid Image")

    useEffect(() => {
        if(calcWidthRef.current) setInitialWidth(calcWidthRef.current.clientWidth + "px")
    }, [])

    const showPopup = (): void => {
        const curDark = darkRef.current as HTMLDivElement
        const curDelete = deleteRef.current as HTMLDivElement

        curDark.style.zIndex = "9"
        curDelete.style.zIndex = "10"

        curDark.style.opacity = "1"
        curDelete.style.opacity = "1"
    }

    const hidePopup = (): void => {
        const curDark = darkRef.current as HTMLDivElement
        const curDelete = deleteRef.current as HTMLDivElement

        curDark.style.opacity = "0"
        curDelete.style.opacity = "0"

        
        setTimeout(() => {
            curDark.style.zIndex = "-10"
            curDelete.style.zIndex = "-10"
        }, 300)
    }

    const logout = (): void => {
        document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT"
        window.location.reload()
    }

    const resizeInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const calcWidth = calcWidthRef.current as HTMLPreElement
        calcWidth.textContent = event.currentTarget.value

        event.currentTarget.style.width = calcWidth.clientWidth + "px"
    }

    const changeUsername = async (event: React.FocusEvent<HTMLInputElement>): Promise<void> => {
        (errMsgUsernameRef.current as HTMLSpanElement).style.display = "none"
        
        if(!event.currentTarget.value) {
            event.currentTarget.value = (user as UsrGet).username

            const calcWidth = calcWidthRef.current as HTMLPreElement
            calcWidth.textContent = (user as UsrGet).username

            event.currentTarget.style.width = calcWidth.clientWidth + "px"

            return
        }

        if((user as UsrGet).username === event.currentTarget.value) return

        setUser({ ...user, username: event.currentTarget.value })

        try {
            let token = ""
            for(const cookie of document.cookie.split(";")) {
                if(cookie.startsWith("token=")) token = cookie.split("token=")[1]
            }

            const newUsername = event.currentTarget.value
            await api.patch<string>(`/usr/${user.id}/username`, { token, newUsername })
        } catch (err: any) {
            if(err.response.statusText === "Too Many Requests") {
                (errMsgUsernameRef.current as HTMLSpanElement).style.display = "block"
                setErrMsgUsername("Too many requests try again later")

                return
            }

            if(err.response.data.err === "Username is already taken") {
                (errMsgUsernameRef.current as HTMLSpanElement).style.display = "block"
                setErrMsgUsername("Username is already taken")

                return
            }
        }
    }

    const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        (errMsgImgRef.current as HTMLSpanElement).style.display = "none"

        const file = (event.currentTarget.files as FileList)[0]

        try {
            let token = ""
            for(const cookie of document.cookie.split(";")) {
                if(cookie.startsWith("token=")) token = cookie.split("token=")[1]
            }
            
            const image = new FormData()
            image.append("image", file)
            image.append("token", token)

            await api.patch(`/usr/${user.id}/img`, image, { headers: { "Content-Type": "multipart/form-data" }}) 
        } catch (err: any) {
            if(err.response.statusText === "Too Many Requests") {
                (errMsgImgRef.current as HTMLSpanElement).style.display = "block"
                setErrMsgImg("Too many requests try again later")

                return
            }

            if(err.response.data.err === "File too large") {
                (errMsgImgRef.current as HTMLSpanElement).style.display = "block"
                setErrMsgImg("File too large")

                return
            }

            return
        }

        setUser({ ...user, img: URL.createObjectURL(file) })
    }

    const verifyIfCanDelete = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if(event.currentTarget.value !== pageUser.usr.username) {
            (deleteButtonRef.current as HTMLButtonElement).setAttribute("data-disabled", "")
            return
        }

        (deleteButtonRef.current as HTMLButtonElement).removeAttribute("data-disabled")
    }

    const deleteAccount = async (): Promise<void> => {
        try {
            if((nameConfirmRef.current as HTMLInputElement).value === pageUser.usr.username) await api.delete(`/usr/${user.id}`)
        } catch {} finally {
            logout()
        }
    }

    return (
        <>
            <div id="popup-dark" ref={darkRef} onClick={hidePopup}></div>
            <div id="delete-account-popup" ref={deleteRef}>
                <p>Are you sure?</p>
                <p>Please type your name to confirm.</p>
                <input type="text" maxLength={32} ref={nameConfirmRef} onChange={verifyIfCanDelete} />
                <div>
                    <button onClick={hidePopup}>Cancel</button>
                    <button ref={deleteButtonRef} id="delete-button" onClick={deleteAccount} data-disabled>Delete</button>
                </div>
            </div>
            <section id="user-content">
                <button id="delete-account" onClick={showPopup}>DELETE ACCOUNT</button>
                <pre
                    ref={calcWidthRef}
                    style={{
                        width: "max-content",
                        height: "0",
                        fontSize: "1.7rem",
                        fontWeight: "600",
                        position: "absolute",
                        top: "0",
                        left: "0",
                        overflow: "hidden"
                    }}
                >{user.username}</pre>
                <input accept="image/*" type="file" id="file-upload" name="file-upload" onChange={uploadFile} />
                <div id="img-input" style={{ marginBottom: pageUser.ratings.length !== 0 ? "0px" : "" }}>
                    <label htmlFor="file-upload">
                        <img src={user.img} alt={user.username} /><i className="bx bx-edit"></i>
                    </label>
                    <span ref={errMsgImgRef}>{errMsgImg}</span>
                </div>
                <div id="username-input">
                    <div>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            defaultValue={user.username}
                            onChange={resizeInput}
                            onBlur={changeUsername}
                            maxLength={32}
                            style={{ width: initialWidth }}
                        /><label id="username-label" htmlFor="username"><i className="bx bx-edit"></i></label>
                        <span ref={errMsgUsernameRef}>{errMsgUsername}</span>
                    </div>
                    <button id="logout" onClick={logout}>LOGOUT</button>
                </div>
            </section>
            <section id="see-ratings">
                <h2><i className="bx bxs-star"></i>Ratings</h2>
                <div id="usr-ratings">
                    {
                        pageUser.ratings.length === 0 ?
                            <p>You haven't rated any pizza yet.</p>
                        :
                            pageUser.ratings.map((pizza, index) => 
                                <div className="pizza-rating" key={`rating-${index}`}>
                                    <img src={pizza.img} alt={pizza.topping} />
                                    <div className="pizza-rating-left">
                                        <div>
                                            <h3>{pizza.topping} Pizza</h3>
                                            <p className="ingredients">{pizza.ingredients}</p>
                                            <p className="your-rating">Your Rating: <span>{pizza.rating}<i className="bx bxs-star"></i></span></p>
                                            <p className="total-rating">Total Rating: <span>{pizza.pizza_rating}<i className="bx bxs-star"></i></span></p>
                                        </div>
                                        <a href={`/pizzas/${pizza.id_pizza}`}>CHANGE RATING</a>
                                    </div>
                                </div>
                            )
                    } 
                </div>
            </section>
        </>
    )
}

export default UsrLogged