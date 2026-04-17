import { createSlice } from '@reduxjs/toolkit'

const loadersSlice = createSlice({
  name: 'loaders',
  initialState: {
    loading: false, // initial loading state
  },
  reducers: {
    ShowLoading: (state) => {
      state.loading = true // set loading state to true
    },
    HideLoading: (state) => {
      state.loading = false // set loading state to false
    },
  },
})

export const { ShowLoading, HideLoading } = loadersSlice.actions

export default loadersSlice.reducer
