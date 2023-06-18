import axios from "axios";
const user = JSON.parse(localStorage.getItem('user'))
console.log(user);
const instance = axios.create({
    baseURL: 'https://datn-su2023.herokuapp.com',
    headers: {
        "Authorization": `Bearer ${user?.accessToken}`
    }
})
export default instance