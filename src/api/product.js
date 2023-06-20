import instance from "./instance";

export const listProduct = (params) => {
    const url = `/api/v1/admin/product/search`
    return instance.post(url, params)
}
export const listOneProduct = (id) => {
    const url = `/api/v1/admin/product/detail/${id}`
    return instance.get(url)
}
export const addProduct = (product) => {
    const url = `/api/v1/admin/product/create`
    return instance.post(url, product)
}
export const removeProduct = (id) => {
    const url = `/api/v1/admin/product/delete/${id}`
    return instance.post(url, id)
}
export const updateProduct = (product) => {
    const url = `/api/v1/admin/product/update`
    return instance.post(url, product)
}
export const listProductOption = (params) => {
    const url = `/api/v1/admin/productOption/search`
    return instance.post(url, params)
}
export const addProductOption = (productOption) => {
    const url = `/api/v1/admin/productOption/create`
    return instance.post(url, productOption)
}
export const removeProductOption = (id) => {
    const url = `/api/v1/admin/productOption/delete/${id}`
    return instance.post(url, id)
}
export const updateProductOption = (productOption) => {
    const url = `/api/v1/admin/productOption/update`
    return instance.post(url, productOption)
}
export const listProductByName = (name) => {
    const url = `/api/v1/admin/productOption/findByName`
    return instance.post(url, name)
}
