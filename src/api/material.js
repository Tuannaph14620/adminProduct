import instance from "./instance";

export const listMaterial = (params) => {
    const url = `/api/v1/admin/material/search`
    return instance.post(url, params)
}
export const addMaterial = (materials) => {
    const url = `/api/v1/admin/material/create`
    return instance.post(url, materials)
}
export const removeMaterial = (id) => {
    const url = `/api/v1/admin/material/delete`
    return instance.post(url, id)
}
export const updateMaterial = (materials) => {
    const url = `/api/v1/admin/material/update`
    return instance.post(url, materials)
}