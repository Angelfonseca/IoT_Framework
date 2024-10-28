import { AxiosResponse } from 'axios';
import { api } from "./api.config";

interface ApiService {
    get<T>(url: string): Promise<T>;
    post<T>(url: string, data: Record<string, unknown> | FormData, config?: object): Promise<T>;
    put<T>(url: string, data: Record<string, unknown> | FormData): Promise<T>;
    delete<T>(url: string): Promise<T>;
    patch<T>(url: string, data: Record<string, unknown> | FormData): Promise<T>;
}

const apiService: ApiService = {
    get<T>(url: string): Promise<T> {
        return api.get(url).then((response: AxiosResponse<T>) => response.data);
    },
    post<T>(url: string, data: Record<string, unknown> | FormData, config = {}): Promise<T> {
        return api.post(url, data, config).then((response: AxiosResponse<T>) => response.data);
    },
    put<T>(url: string, data: Record<string, unknown> | FormData): Promise<T> {
        return api.put(url, data).then((response: AxiosResponse<T>) => response.data);
    },
    delete<T>(url: string): Promise<T> {
        return api.delete(url).then((response: AxiosResponse<T>) => response.data);
    },
    patch<T>(url: string, data: Record<string, unknown> | FormData): Promise<T> {
        return api.patch(url, data).then((response: AxiosResponse<T>) => response.data);
    }
}

export default apiService;
