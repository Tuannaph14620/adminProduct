import instance from "./instance";

export const listCate = (params) => {
    const url = `/api/v1/admin/category/search`
    return instance.post(url, params)
}
export const listOneCate = (id) => {
    const url = `/api/v1/admin/category/detail`
    return instance.get(url)
}
export const addCate = (category) => {
    const url = `/api/v1/admin/category/create`
    return instance.post(url, category)
}
export const removeCate = (id) => {
    const url = `/api/v1/admin/category/delete`
    return instance.post(url, id)
}
export const updateCate = (category) => {
    const url = `/api/v1/admin/category/update`
    return instance.post(url, category)
}