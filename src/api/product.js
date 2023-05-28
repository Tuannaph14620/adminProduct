import instance from "./instance";

export const listProduct = (params) => {
    const url = `/api/v1/admin/product/search`
    return instance.post(url, params)
}
export const addProduct = (product) => {
    const url = `/api/v1/admin/product/create`
    return instance.post(url, product)
}
export const removeProduct = (id) => {
    const url = `/api/v1/admin/product/delete`
    return instance.post(url, id)
}
export const updateProduct = (product) => {
    const url = `/api/v1/admin/product/update`
    return instance.post(url, product)
}