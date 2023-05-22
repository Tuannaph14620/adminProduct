import instance from "./instance";

export const listColor = (params) => {
    const url = `/api/v1/admin/color/search`
    return instance.post(url, params)
}
export const listOneColor = (id) => {
    const url = `Colorgorys/${id}`
    return instance.get(url)
}
export const addColor = (colors) => {
    const url = `/api/v1/admin/color/create`
    return instance.post(url, colors)
}
export const removeColor = (id) => {
    const url = `/api/v1/admin/color/delete`
    return instance.post(url, id)
}
export const updateColor = (category) => {
    const url = `categorys/${category.id}`
    return instance.put(url, category)
}