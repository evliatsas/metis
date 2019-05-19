import React from 'react';
import { List, Icon, Popconfirm, message } from 'antd';

const confirm = () => {
    message.info('Συντομα κοντά σας')
}

const BookMembers = props => {
    return (
        <List style={{ padding: 10 }}
            itemLayout="horizontal"
            dataSource={props.members}
            renderItem={item => (
                <List.Item 
                // actions={[<Popconfirm title="Θέλετε σίγουρα να αφαιρέσετε τον χρήστη?"
                //  onConfirm={confirm} onCancel={null} okText="Ναι" cancelText="Όχι">
                //     <span className="is-danger">διαγραφή</span>
                // </Popconfirm>
                // ]}
                >
                    <List.Item.Meta
                        avatar={<Icon type="user" style={{ fontSize: 40 }} />}
                        title={<span className="has-text-primary">{item.name}</span>}
                        description={item.email} />

                </List.Item>
            )}
        />
    );
};

export default BookMembers;