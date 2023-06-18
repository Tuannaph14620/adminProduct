import instance from "./instance";

export const listOrder = (params) => {
    const url = `/api/v1/admin/order/search`
    return instance.post(url, params)
}
export const listOneOrder = (id) => {
    const url = `/api/v1/admin/order/detail`
    return instance.get(url)
}
export const addOrder = (order) => {
    const url = `/api/v1/admin/order/create`
    return instance.post(url, order)
}
export const removeOrder = (id) => {
    const url = `/api/v1/admin/order/delete`
    return instance.post(url, id)
}
export const updateOrder = (order) => {
    const url = `/api/v1/admin/order/update`
    return instance.post(url, order)
}
export const listOrderStatus = () => {
    const url = `/api/v1/admin/order/listOrderStatus`
    return instance.get(url)
}
