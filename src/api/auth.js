import instance from "./instance";

export const signUp = (user) => {
    const url = `/signup`
    return instance.post(url, user)
}
export const signIn = (user) => {
    const formData = new FormData();
    formData.append('email', user.email);
    formData.append('password', user.password);
    const url = `https://datn-su2023.herokuapp.com/api/v1/login`
    return instance.post(url, formData)
}

export const listUser = () => {
    const url = `/users`
    return instance.get(url)
}