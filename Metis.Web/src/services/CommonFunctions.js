import React from 'react';
import { Tag } from 'antd';
import storage from './LocalStorage';
export const calculateStatus = (date) => {
    const _d = new Date(date);
    const d = new Date();
    return _d.getTime() > d.getTime() ? <Tag color="#40861d">Ενεργό</Tag> :
        <Tag color="red">Ανενεργό</Tag>;
}

export const getCurrentMember = () => {
    const user = storage.get('auth');
    return user ? { userId: user.userid, email: user.email, name: user.title } : null;
}
