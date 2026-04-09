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


