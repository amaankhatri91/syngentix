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
});

// Request interceptor
BaseService.interceptors.request.use(
    (config) => {
        const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME);
        const persistData = deepParseJson(rawPersistData);
        console.log("Verify Step 1")
        let accessToken = (persistData as any)?.auth?.token || '';
        console.log(accessToken, "verify Access Token")
        if (!accessToken) {
            const { auth } = store.getState() || "";
            accessToken = auth?.token;
        }
        console.log("Verify Step 2")
        if (accessToken) {
            config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE} ${accessToken}`;
        }

        // Logging request data
        console.log('Request:', config.url, config.method, config.headers);

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
