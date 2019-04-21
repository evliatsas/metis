import { notification } from 'antd';

const api = 'http://localhost:50971/api/'
export const callFetch = async (url, method, data) => {
    const result = await (await fetch(api + url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : null
    }).then(res => {
        return res.json();
    }).catch(() => {
        // to do error handling
    }));

    return result;
}