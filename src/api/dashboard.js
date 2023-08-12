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
