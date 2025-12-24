import { combineReducers, CombinedState, AnyAction, Reducer } from 'redux'
import RtkQueryService from '@/services/RtkQueryService'
import authReducer from './auth/authSlice'
import agentReducer from './agent/agentSlice'
export type RootState = CombinedState<{
    auth: ReturnType<typeof authReducer>
    agent: ReturnType<typeof agentReducer>
    /* eslint-disable @typescript-eslint/no-explicit-any */
    [RtkQueryService.reducerPath]: any
}>

export interface AsyncReducers {
    [key: string]: Reducer<any, AnyAction>
}

const staticReducers = {
    auth : authReducer,
    agent : agentReducer,
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
