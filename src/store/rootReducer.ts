import { combineReducers, CombinedState, AnyAction, Reducer } from 'redux'
import RtkQueryService from '@/services/RtkQueryService'
import authReducer from './auth/authSlice'
import agentReducer from './agent/agentSlice'
import workflowReducer from './workflow/workflowSlice'
export type RootState = CombinedState<{
    auth: ReturnType<typeof authReducer>
    agent: ReturnType<typeof agentReducer>
    workflow: ReturnType<typeof workflowReducer>
    /* eslint-disable @typescript-eslint/no-explicit-any */
    [RtkQueryService.reducerPath]: any
}>

export interface AsyncReducers {
    [key: string]: Reducer<any, AnyAction>
}

const staticReducers = {
    auth : authReducer,
    agent : agentReducer,
    workflow : workflowReducer,
    // Include RTK Query reducer
    [RtkQueryService.reducerPath]: RtkQueryService.reducer,
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
