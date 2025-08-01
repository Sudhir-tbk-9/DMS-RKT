import AxiosBase from './axios/AxiosBase'
import  AxiosBaseBackend from './axios/AxiosBaseBackend'

import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

const ApiService = {
    fetchDataWithAxios<Response = unknown, Request = Record<string, unknown>>(
        param: AxiosRequestConfig<Request>,
    ) {
        return new Promise<Response>((resolve, reject) => {
            AxiosBase(param)
                .then((response: AxiosResponse<Response>) => {
                    resolve(response.data)
                })
                .catch((errors: AxiosError) => {
                    reject(errors)
                })
        })
    },

    backendApiWithAxios<Response = unknown, Request = Record<string, unknown>>(
        param: AxiosRequestConfig<Request >,
    ) {
        return new Promise<Response>((resolve, reject) => {
            AxiosBaseBackend(param)
                .then((response: AxiosResponse<Response>) => {
                    resolve(response.data);
                })
                .catch((errors: AxiosError) => {
                    reject(errors);
                });
        });
        
    },
}

export default ApiService
