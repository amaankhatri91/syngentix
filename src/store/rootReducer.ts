import { combineReducers, CombinedState, AnyAction, Reducer } from 'redux'
import RtkQueryService from '@/services/RtkQueryService'
import authReducer from './auth/authSlice'
import productReducer from './product/productSlice'
export type RootState = CombinedState<{
    auth: ReturnType<typeof authReducer>
    product: ReturnType<typeof productReducer>
    /* eslint-disable @typescript-eslint/no-explicit-any */
    [RtkQueryService.reducerPath]: any
}>

export interface AsyncReducers {
    [key: string]: Reducer<any, AnyAction>
}

const staticReducers = {
    auth : authReducer,
    product : productReducer,
}

const rootReducer =
    (asyncReducers?: AsyncReducers) =>
    (state: RootState, action: AnyAction) => {
        const combinedReducer = combineReducers({
            ...staticReducers,
            ...asyncReducers,
        })
        return combinedReducer(state, action)
    }

export default rootReducer
