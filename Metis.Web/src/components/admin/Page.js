import React from 'react';
import {
    Typography, Button as AntdButton, List, Popconfirm as AntdPopconfirm
} from 'antd'
const { Text } = Typography
const Page = ({ site, removePage, siteHandler }) => {

    const editHandler = (value, index, field) => {
        console.log()
        site.pages[index][field] = value
        siteHandler(site)
    }

    const editExceptionsHandler = (value, index, field, exIndex) => {
        site.pages[index].exceptions[exIndex][field] = value
        siteHandler(site)
    }

    const EditableField = ({ text, size, index, field, exIndex }) => (
        <Text style={{ color: 'white', width: size + '%' }}
            editable={{ onChange: (v) => editExceptionsHandler(v, index, field, exIndex) }}>{text}</Text>
    )

    const addException = (index) => {
        site.pages[index].exceptions.push({ type: 'new type', attribute: 'new attribute', value: 'new value' })
        siteHandler(site)
    }

    const removeException = (index, exIndex) => {
        site.pages[index].exceptions.splice(exIndex, 1)
        siteHandler(site)
    }

    return (
        <List
            itemLayout="vertical"
            bordered={true}
            size="small"
            dataSource={site.pages}
            renderItem={(item, i) => (
                <List.Item
                    key={i}
                    actions={[
                        <AntdPopconfirm
                            title='Είσται σίγουρος για την αφαίρεση'
                            onConfirm={() => removePage(i)}
                            onCancel={null}
                            okText="Ναι"
                            cancelText="Όχι">
                            <AntdButton
                                size="small"
                                type="ghost" >αφαίρεση</AntdButton>
                        </AntdPopconfirm>,
                        <AntdButton onClick={() => addException(i)}
                            size="small"
                            type="ghost" >Νέα εξαίρεση</AntdButton>
                    ]}>
                    <List.Item.Meta
                        title={<div>
                            <div><Text editable={{ onChange: (v) => editHandler(v, i, 'title') }}>{item.title}</Text></div>
                            <div><Text editable={{ onChange: (v) => editHandler(v, i, 'uri') }}>{item.uri}</Text></div></div>
                        }
                        description={item.exceptions.map((ex, exI) => (
                            <div key={ex.attribute + exI} style={{ color: 'white', display: 'flex' }}>
                                <span>{exI + 1}. &nbsp;</span>
                                <EditableField size={15} text={ex.type} index={i} exIndex={exI} field="type" /> &nbsp;
                                <EditableField size={20} text={ex.attribute} index={i} exIndex={exI} field="attribute" />&nbsp;
                                <EditableField size={55} text={ex.value} index={i} exIndex={exI} field="value" />
                                <AntdPopconfirm
                                    title='Είσται σίγουρος για την αφαίρεση'
                                    onConfirm={() => removeException(i, exI)}
                                    onCancel={null}
                                    okText="Ναι"
                                    cancelText="Όχι">
                                    <AntdButton
                                        size="small"
                                        type="ghost"
                                        shape="circle"
                                        icon="delete"
                                    />
                                </AntdPopconfirm>
                            </div>
                        ))}
                    />
                </List.Item >
            )}
        />
    );
};

export default Page;