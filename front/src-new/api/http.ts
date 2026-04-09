import axios from "axios";

export type ResponseEntity<T> = {
    code: string;
    message: string;
    data: T;
};

export const getHttp = async <T>(url:string, params?: object): Promise<T> => {
    const res = await axios.get(url , {params});
    return res.data as T;
};

export const postHttp = async <T>(url: string, data: object): Promise<T> => {
    const res = await axios.post(url, data);
    return res.data as T;
};

export const putHttp = async <T>(url: string, data: object): Promise<T> => {
    const res = await axios.put(url, data);
    return res.data as T;
};

export const deleteHttp = async <T>(url: string): Promise<T> => {
    const res = await axios.delete(url);
    return res.data as T;
};
