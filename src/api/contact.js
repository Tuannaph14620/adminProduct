import instance from "./instance";

export const AddContact = (user)=>{
    const url = `/contact`
    return instance.post(url,user)
}
export const ListContact = ()=>{
    const url = `/contact`
    return instance.get(url)
}
export const ListOnContact = (id)=>{
    const url = `/contact/${id}`
    return instance.get(url)
}

export const RemoveContact = (id)=>{
    const url = `/contact/${id}`
    return instance.delete(url)
}