import axios from "axios";
const user = JSON.parse(localStorage.getItem('user'))
const instance = axios.create({
    baseURL: 'https://datn-backend-2023-fd234f87eb7e.herokuapp.com',
    headers: {
        "Authorization": `Bearer ${user?.accessToken}`
    }
})
export default instance