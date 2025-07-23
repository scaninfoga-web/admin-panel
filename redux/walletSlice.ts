import { get } from '@/lib/api';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface LastSuccessfulTransaction {
  txn_id: string;
  amount: string;
  status: string;
  created_at: string;
}

interface WalletState {
  balance: number;
  loading: boolean;
  error: any;
  lastSuccessTxnDate?: string;
  lastSuccessTxnAmount?: string;
  isPendingTxn: boolean;
}

interface WalletAPIResponse {
  balance: number | string;
  last_successful_transaction?: LastSuccessfulTransaction | null;
  isPendingTxn: boolean;
}

const initialState: WalletState = {
  loading: true,
  error: null,
  balance: 0,
  isPendingTxn: false,
};

export const fetchWalletBalance = createAsyncThunk<
  WalletAPIResponse,
  void,
  { rejectValue: any }
>('wallet/fetchBalance', async (_, thunkAPI) => {
  try {
    const balanceData = await get('/api/payments/getWalletBalance');
    const pendingData = await get('/api/payments/isTxnPending');
    return {
      ...balanceData.responseData,
      isPendingTxn: pendingData.responseData.isPendingTxn,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Unknown error');
  }
});

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWalletBalance.fulfilled,
        (state, action: PayloadAction<WalletAPIResponse>) => {
          state.loading = false;
          state.balance = Number(action.payload.balance);
          state.lastSuccessTxnDate =
            action.payload.last_successful_transaction?.created_at;
          state.lastSuccessTxnAmount =
            action.payload.last_successful_transaction?.amount;
          state.isPendingTxn = action.payload.isPendingTxn;
        },
      )
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch balance';
      });
  },
});

export const { setBalance } = walletSlice.actions;
export default walletSlice.reducer;
