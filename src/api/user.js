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
    const url = `/api/v1/admin/user/delete/${id}`
    return instance.get(url)
}
export const activeUser = (id, e) => {
    const url = `/api/v1/admin/user/active/${id}?active=${e}`
    return instance.get(url)
}
export const myProfile = () => {
    const url = `/api/v1/user/my-profile`
    return instance.get(url)
}
export const updateProfile = (user) => {
    const url = `/api/v1/user/update-profile`
    return instance.post(url, user)
}