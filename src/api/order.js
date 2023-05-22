import instance from "./instance";

export const addOrder = (order)=>{
    const url = `/orders`
    return instance.post(url, order)
}
export const listOrder = ()=>{
    const url = `/orders`
    return instance.get(url)
}
export const listOneOrder = (idOrder)=>{
    const url = `/orders/${idOrder}`
    return instance.get(url)
}
export const removeOrder = (idOrder)=>{
    const url = `/orders/${idOrder}`
    return instance.delete(url)
}