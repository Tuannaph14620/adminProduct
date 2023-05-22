import instance from "./instance";

export const listProduct = ()=>{
    const url = `/products`;
    return instance.get(url)
}
export const ListProductHome = () => {
    const url = `/products/?_sort=createdAt&_order=asc&_limit=5`;
    return instance.get(url);
};
export const listOneProduct = (id)=>{
    const url = `/products/${id}`;
    return instance.get(url)
}
export const addProduct = (product)=>{
    const url = `/products`;
    return instance.post(url, product)
}
export const updateProduct = (product)=>{
    const url = `/products/${product.id}`;
    return instance.put(url, product)
}
export const removeProduct = (id)=>{
    const url = `/products/${id}`;
    return instance.delete(url)
}
export const ListCateProduct = (id) => {
    const url = `categorys/${id}?_embed=products`;
    return instance.get(url);
};
export const ListCateProductLimit = (id) => {
    const url = `categorys/${id}?_embed=products`;
    return instance.get(url);
};
export const getProductSearch = (post) => {
    const url = `/products/?name_like=${post}`;
    return instance.get(url);
}
export const getProductA_Z = () => {
    const url = `/products/?_sort=price&_order=asc`;
    return instance.get(url);
}
export const getProductZ_A = () => {
    const url = `/products/?_sort=price&_order=desc`;
    return instance.get(url);
}
export const getProductNew = () => {
    const url = `/products/?_sort=createdAt&_order=asc`;
    return instance.get(url);
}