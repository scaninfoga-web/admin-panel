// // import { get } from "@/lib/api"
// // import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
// // import axios from "axios"

// // interface ApiItem {
// //   label: string
// //   value: string
// // }

// // const initialState: ApiItem[] = []

// // export const getApiList = createAsyncThunk("apiList/fetch", async () => {
// //   const res = await get("/api/admin/get-all-apis")
// //   return res.responseData as ApiItem[]
// // })

// // export const apiListSlice = createSlice({
// //   name: "apiList",
// //   initialState,
// //   reducers: {
// //     setList: (state, action: PayloadAction<ApiItem[]>) => {
// //       return action.payload
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder.addCase(getApiList.fulfilled, (state, action: PayloadAction<ApiItem[]>) => {
// //         console.log("Action payload: ", action.payload);
// //       return action.payload
// //     })
// //   },
// // })

// // export const { setList } = apiListSlice.actions
// // export default apiListSlice.reducer


// import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
// import { get } from "@/lib/api"

// export interface ApiItem {
//   label: string
//   value: string
// }

// interface ApiListState {
//   data: ApiItem[]
//   loading: boolean
//   error: string | null
// }

// const initialState: ApiListState = {
//   data: [],
//   loading: false,
//   error: null,
// }

// // Async thunk to fetch API list
// export const getApiList = createAsyncThunk("apiList/fetch", async () => {
//   console.log("GET API LIST CALLED");
//   const res = await get("/api/admin/get-all-apis")
//   return res.responseData as ApiItem[]
// })

// export const apiListSlice = createSlice({
//   name: "apiList",
//   initialState,
//   reducers: {
//     setList: (state, action: PayloadAction<ApiItem[]>) => {
//       state.data = action.payload
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(getApiList.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(getApiList.fulfilled, (state, action: PayloadAction<ApiItem[]>) => {
//         console.log("Fulfilleddd", action.payload);
//         state.data = action.payload
//         state.loading = false
//       })
//       .addCase(getApiList.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.error.message ?? "Failed to fetch API list"
//       })
//   },
// })

// export const { setList } = apiListSlice.actions
// export default apiListSlice.reducer



import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { get } from "@/lib/api"

console.log("SLICE LOADED");

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
  console.log("GET API LIST CALLED")
  const res = await get("/api/admin/get-all-apis")
  console.log("RES RETURNED: ", res.responseData);
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
        console.log("PEnding");
        state.loading = true
        state.error = null
      })
      .addCase(getApiList.fulfilled, (state, action: PayloadAction<ApiItem[]>) => {
        console.log("Fulfilled");
        state.data = action.payload
        state.loading = false
      })
      .addCase(getApiList.rejected, (state, action) => {
        console.log(":Rehected");
        state.loading = false
        state.error = action.error.message ?? "Failed to fetch API list"
      })
  },
})

export const { setList } = apiListSlice.actions
export default apiListSlice.reducer
