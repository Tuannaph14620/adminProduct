import axios from "axios";
const address = axios.create({
    baseURL: 'https://online-gateway.ghn.vn/shiip/public-api/',
    headers: {
        'token': '1356329a-0133-11ed-8636-7617f3863de9'
    }
})
export default address