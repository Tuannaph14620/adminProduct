import instance from "./instance";

export const listSize = (params) => {
    const url = `/api/v1/admin/size/search`
    return instance.post(url, params)
}
export const addSize = (sizes) => {
    const url = `/api/v1/admin/size/create`
    return instance.post(url, sizes)
}
export const removeSize = (id) => {
    const url = `/api/v1/admin/size/delete`
    return instance.post(url, id)
}
export const updateSize = (sizes) => {
    const url = `/api/v1/admin/size/update`
    return instance.post(url, sizes)
}