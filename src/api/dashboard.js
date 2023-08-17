import instance from "./instance";

export const listDashboard = () => {
    const url = `/api/v1/dashboard`
    return instance.get(url)
}
export const orderStatus = () => {
    const url = `api/v1/dashboard/getOrderStatus`
    return instance.get(url)
}
export const revenueWeek = () => {
    const url = `/api/v1/dashboard/getRevenueByWeek`
    return instance.get(url)
}
export const revenueYear = () => {
    const url = `/api/v1/dashboard/getRevenueInYear`
    return instance.get(url)
}
export const orderStatusV2 = () => {
    const url = `/api/v1/dashboard/getOrderStatusV2`
    return instance.get(url)
}
