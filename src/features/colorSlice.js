import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addColor, listColor, removeColor, updateColor } from "../api/color";

export const listColors = createAsyncThunk(
    "color/listColor",
    async (params) => {
        const { data } = await listColor(params)
        return data
    }
)

export const addColors = createAsyncThunk(
    "color/addColors",
    async (color) => {
        const { data } = await addColor(color)
        return data
    }
)
export const editColors = createAsyncThunk(
    "color/editColors",
    async (id) => {
        const { data } = await updateColor(id)
        return data
    }
)
export const removeColors = createAsyncThunk(
    "color/removeColors",
    async (id) => {
        console.log(id);
        const { data } = await removeColor(id)
        return data
    }

)

const ColorSlider = createSlice({
    name: "color",
    initialState: {
        value: []
    },
    extraReducers: (builder) => {
        builder.addCase(addColors.fulfilled, (state, actions) => {
            state.value.push(actions.payload)
        })
        builder.addCase(listColors.fulfilled, (state, actions) => {
            state.value = actions.payload
        })
        builder.addCase(removeColors.fulfilled, (state, actions) => {
            state.value = state.value.filter(item => item.id !== actions.meta.arg)
        })
        builder.addCase(editColors.fulfilled, (state, actions) => {
            state.value.push(actions.payload)
        })
    }

})

export default ColorSlider.reducer