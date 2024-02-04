import axios from 'axios';
import {ref} from "vue";
import {apiTimeoutInMs} from "@/appSettings.js";
import {Loading} from "quasar";


export function getBaseUrl() {
    if (import.meta.env.PROD) {
        return import.meta.env.VITE_PROD_BACKEND_URL;
    }
    return import.meta.env.VITE_DEV_BACKEND_URL;
}

const showLoading = function () {
    Loading.show();
};
const hideLoading = function () {
    Loading.hide();
};

export class MyFetch {
    constructor(baseUrl, options = {}) {
        this.baseUrl = baseUrl;
        this.axiosInstance = axios.create({
            baseURL: baseUrl,
            timeout: apiTimeoutInMs,
            ...options,
        });
        this.isFetching = ref(false);
    }

    errorHandling(error, statusCode) {
        // TODO: add error handling

    }

    static generateUrl(url, params = {}) {
        const query = new URLSearchParams(params).toString();
        return url + '?' + query;
    }

    async get(url, options = {}) {
        try {
            this.isFetching.value = true;
            showLoading();
            const response = await this.axiosInstance.get(url, options);
            return {
                error: null,
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            this.errorHandling(error, error.response?.status);
            return {
                error: error,
                data: null,
                status: error.response?.status,
            };
        } finally {
            hideLoading();
            this.isFetching.value = false;
        }
    }


    async post(url, data = {}, options = {}) {
        try {
            this.isFetching.value = true;
            showLoading();
            const response = await this.axiosInstance.post(url, data, options);
            return {
                error: null,
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            this.errorHandling(error, error.response?.status);
            return {
                error: error,
                data: null,
                status: error.response?.status,
            };
        } finally {
            hideLoading();
            this.isFetching.value = false;
        }
    }

}

export const BASE_URL_NODE = getBaseUrl();
export const apiAx = () => new MyFetch(BASE_URL_NODE);
export const myFetch = new MyFetch(BASE_URL_NODE);