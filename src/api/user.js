import instance from "./instance";

export const listUser = (params) => {
    const url = `/api/v1/admin/user/search`
    return instance.post(url, params)
}
export const listOneCate = (id) => {
    const url = `/api/v1/admin/user/detail`
    return instance.get(url)
}
export const addUser = (user) => {
    const url = `/api/v1/admin/user/create`
    return instance.post(url, user)
}
export const removeCate = (id) => {
    const url = `/api/v1/admin/user/delete`
    return instance.post(url, id)
}
export const updateCate = (user) => {
    const url = `/api/v1/admin/user/update`
    return instance.post(url, user)
}