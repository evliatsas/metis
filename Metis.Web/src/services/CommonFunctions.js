import React from 'react';
import { Tag } from 'antd';

export const calculateStatus = (date) => {
    const _d = new Date(date);
    const d = new Date();
    return _d.getTime() > d.getTime() ? <Tag color="#40861d">Ενεργό</Tag> :
        <Tag color="red">Ανενεργό</Tag>;
}