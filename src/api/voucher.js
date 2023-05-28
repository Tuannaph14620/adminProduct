import instance from "./instance";

export const listVoucher = (params) => {
    const url = `/api/v1/admin/voucher/search`
    return instance.post(url, params)
}
export const addVoucher = (vouchers) => {
    const url = `/api/v1/admin/voucher/create`
    return instance.post(url, vouchers)
}
export const removeVoucher = (id) => {
    const url = `/api/v1/admin/voucher/delete/${id}`
    return instance.post(url, id)
}
export const updateVoucher = (vouchers) => {
    const url = `/api/v1/admin/voucher/update`
    return instance.post(url, vouchers)
}