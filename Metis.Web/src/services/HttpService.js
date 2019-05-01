import { notification } from 'antd';
import LocalStorage from '../services/LocalStorage';
const api = process.env.REACT_APP_API_URL + 'api/'

export const callFetch = async (url, method, data) => {

    const result = await (await fetch(api + url, {
        method: method,
        headers: headers(),
        body: data ? JSON.stringify(data) : null
    }).then(async res => {
        if (res.ok) {
            return res.json();
        } else {
            const message = await res.json();
            notification['error']({
                placement:'bottomRight',
                message: 'Σφάλμα',
                description: message.Message
            });
            return null;
        }
    }).catch(() => {
        // to do error handling
    }));

    return result;
}

const headers = () => {
    const h = new Headers();
    h.append('Content-Type', 'application/json');
    const token = LocalStorage.get('token');
    if (token) {
        h.append('Authorization', `Bearer ${token}`);
    }
    return h;
}
