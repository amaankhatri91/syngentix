import axios from 'axios';
import appConfig from '@/configs/app.config';
import { REQUEST_HEADER_AUTH_KEY, TOKEN_TYPE } from '@/constants/api.constant';
import { PERSIST_STORE_NAME } from '@/constants/app.constant';
import deepParseJson from '@/utils/deepParseJson';
import store from '@/store';

const unauthorizedCode = [401];

const BaseService = axios.create({
    timeout: 60000,
    baseURL: appConfig.apiPrefix,
    // Ensure headers are sent with redirects
    maxRedirects: 5,
    validateStatus: (status) => status < 500, // Don't throw on 4xx errors
});

// Request interceptor
BaseService.interceptors.request.use(
    (config) => {
        // Ensure headers object exists
        if (!config.headers) {
            config.headers = {} as any;
        }
        // Try to get token from Redux store first (most reliable)
        const state = store.getState();
        let accessToken = state?.auth?.token;

        // Fallback to persisted localStorage if not found in store
        if (!accessToken) {
            try {
                const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME);
                if (rawPersistData) {
                    const persistData = deepParseJson(rawPersistData);
                    accessToken = (persistData as any)?.auth?.token;
                }
            } catch (error) {
                console.error('Error reading persisted data:', error);
            }
        }
       
        // Set Authorization header if token exists and is a valid string
        if (accessToken && typeof accessToken === 'string' && accessToken.trim() !== '') {
            // Ensure header is set correctly for axios
            const authHeaderValue = `${TOKEN_TYPE} ${accessToken.trim()}`;
            // Set header using direct assignment (standard way)
            config.headers[REQUEST_HEADER_AUTH_KEY] = authHeaderValue;
        } else {
            console.warn('❌ No access token found for request:', config.url, {
                stateToken: state?.auth?.token,
                stateAuthExists: !!state?.auth,
                persistDataExists: !!localStorage.getItem(PERSIST_STORE_NAME)
            });
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
BaseService.interceptors.response.use(
    (response) => {
        // Logging response data
        console.log('Response:', response.status, response.data);
        return response;
    },
    (error) => {
        const { response } = error;

        // Logging response error
        console.error('Response error:', error?.message, response?.status, response?.data);

        if (response && unauthorizedCode.includes(response.status)) {
            // You can dispatch an action to log the user out, etc.
            // store.dispatch(signOutSuccess())
            console.warn('Unauthorized access - logging out');
        }

        return Promise.reject(error);
    }
);

export default BaseService;
