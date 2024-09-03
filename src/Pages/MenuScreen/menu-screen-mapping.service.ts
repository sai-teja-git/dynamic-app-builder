import axios from "axios"
import { API_URL } from "../../settings/api-settings"

export const createMenuScreen = (body: any) => {
    return axios.post(`${API_URL}/menu-screen-mapping`, body)
}

export const getMenuScreens = () => {
    return axios.get(`${API_URL}/menu-screen-mapping`)
}

export const getMenuScreenById = (id: string) => {
    return axios.get(`${API_URL}/menu-screen-mapping/${id}`)
}

export const updateMenuScreen = (id: string, data: any) => {
    return axios.patch(`${API_URL}/menu-screen-mapping/${id}`, data)
}