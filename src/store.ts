import { configureStore } from "@reduxjs/toolkit";

import accountReducer from "./slices/AccountSlice";
import appReducer from "./slices/AppSlice";
import bondingReducer from "./slices/BondSlice";
import { bondingReducerV2 } from "./slices/BondSliceV2";
import burnReducer from "./slices/burn/reducer";
import farmsReducer from "./slices/farms";
import infoReducer from "./slices/info";
import limitOrdersReducer from "./slices/limitOrders/reducer";
import listsReducer from "./slices/lists/reducer";
import messagesReducer from "./slices/MessagesSlice";
import mintReducer from "./slices/mint/reducer";
import multicallReducer from "./slices/multicall/reducer";
import pendingTransactionsReducer from "./slices/PendingTxnsSlice";
import poolsReducer from "./slices/pools";
import poolDataReducer from "./slices/PoolThunk";
import swapReducer from "./slices/swap/reducer";
import transactionsReducer from "./slices/transactions/reducer";
import userReducer from "./slices/user/slice";
import zapReducer from "./slices/ZapSlice";
// reducers are named automatically based on the name field in the slice
// exported in slice files by default as nameOfSlice.reducer

const store = configureStore({
  reducer: {
    //   we'll have state.account, state.bonding, etc, each handled by the corresponding
    // reducer imported from the slice file
    account: accountReducer,
    bonding: bondingReducer,
    bondingV2: bondingReducerV2,
    app: appReducer,
    pendingTransactions: pendingTransactionsReducer,
    poolData: poolDataReducer,
    messages: messagesReducer,
    zap: zapReducer,
    user: userReducer,
    swap: swapReducer,
    lists: listsReducer,
    multicall: multicallReducer,
    transactions: transactionsReducer,
    burn: burnReducer,
    mint: mintReducer,
    limitOrders: limitOrdersReducer,
    farms: farmsReducer,
    info: infoReducer,
    pools: poolsReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
