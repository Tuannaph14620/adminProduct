import instance from "./instance";

export const ListNew =()=>{
    const url = `/posts`
    return instance.get(url)
}
export const ListNewOne =(id)=>{
    const url = `/posts/${id}`
    return instance.get(url)
}
export const AddNew =(post)=>{
    const url = `/posts`
    return instance.post(url, post)
}
export const UpdateNew =(post)=>{
    const url = `/posts/${post.id}`
    return instance.put(url, post)
}
export const RemoveNew =(id)=>{
    const url = `/posts/${id}`
    return instance.delete(url)
}