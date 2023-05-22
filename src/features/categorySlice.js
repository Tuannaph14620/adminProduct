import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addCate, listCate, removeCate, updateCate } from "../api/category";



export const listCategory = createAsyncThunk(
    "category/listCategory",
    async (params) => {
        const { data } = await listCate(params)
        return data
    }
)

export const addCategory = createAsyncThunk(
    "category/addCategory",
    async (category) => {
        const { data } = await addCate(category)
        return data
    }
)
export const editCategory = createAsyncThunk(
    "category/editCategory",
    async (id) => {
        const { data } = await updateCate(id)
        return data
    }
)
export const removeCategory = createAsyncThunk(
    "category/removeCategory",
    async (id) => {
        const { data } = await removeCate(id)
        return data
    }

)

const CategorySlice = createSlice({
    name: "category",
    initialState: {
        value: []
    },
    extraReducers: (builder) => {
        builder.addCase(addCategory.fulfilled, (state, actions) => {
            state.value.push(actions.payload)
        })
        builder.addCase(listCategory.fulfilled, (state, actions) => {
            state.value = actions.payload
        })
        builder.addCase(removeCategory.fulfilled, (state, actions) => {
            state.value = state.value.filter(item => item.id !== actions.meta.arg)
        })
        builder.addCase(editCategory.fulfilled, (state, actions) => {
            state.value.push(actions.payload)
        })
    }

})

export default CategorySlice.reducer