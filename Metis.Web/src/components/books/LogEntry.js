import React from 'react';
import { Form, Tooltip, Input, Icon } from 'antd';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
const LogEntry = () => {
    return (
        <Form {...formItemLayout} >
            <Form.Item
                label={(
                    <span>Τίτλος &nbsp;
                <Tooltip title="What do you want others to call you?">
                            <Icon type="question-circle-o" />
                        </Tooltip>
                    </span>)}>
                <Input />
            </Form.Item>
            <Form.Item
                label={(
                    <span> Περιγραφή &nbsp;
                <Tooltip title="What do you want others to call you?">
                            <Icon type="question-circle-o" />
                        </Tooltip>
                    </span>)}>
                <Input />
            </Form.Item>
        </Form>
    );
};

export default LogEntry;