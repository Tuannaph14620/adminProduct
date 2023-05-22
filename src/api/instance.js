import axios from "axios";
const user = JSON.parse(localStorage.getItem('user'))
const instance = axios.create({
    baseURL: 'https://datn-springboot.herokuapp.com',
    headers: {
        "Authorization": `Bearer ${user?.accessToken}`
    }
})
export default instance