import axios, { AxiosInstance, AxiosResponse } from "axios"

type ApiRes<T> = AxiosResponse<T>

let ENV = "production"

const api: AxiosInstance = axios.create({
    baseURL: ENV === "production" ? "https://api-pizzas-production.up.railway.app" : "http://localhost:8080",
    withCredentials: true
})

export default api
export type { ApiRes }