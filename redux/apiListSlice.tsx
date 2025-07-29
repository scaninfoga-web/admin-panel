import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { get } from "@/lib/api"

export interface ApiItem {
  label: string
  value: string
}

interface ApiListState {
  data: ApiItem[]
  loading: boolean
  error: string | null
}

const initialState: ApiListState = {
  data: [],
  loading: false,
  error: null,
}

export const getApiList = createAsyncThunk("apiList/fetch", async () => {
  const res = await get("/api/admin/get-all-apis")
  return res.responseData as ApiItem[]
})

export const apiListSlice = createSlice({
  name: "apiList",
  initialState,
  reducers: {
    setList: (state, action: PayloadAction<ApiItem[]>) => {
      state.data = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getApiList.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getApiList.fulfilled, (state, action: PayloadAction<ApiItem[]>) => {
        state.data = action.payload
        state.loading = false
      })
      .addCase(getApiList.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? "Failed to fetch API list"
      })
  },
})

export const { setList } = apiListSlice.actions
export default apiListSlice.reducer
