import React from 'react';
import { Typography, Icon, Drawer, List } from 'antd';
const { Paragraph } = Typography;

const MapDrawer = props => {
    const isOpen = props.selected ? true : false
    const title = isOpen ? <span className="has-text-white title-flex">
        <Icon type="security-scan" style={{ fontSize: 24 }} /> {props.selected.name}</span> : null
    const statusColor = (s) => {
        switch (s) {
            case 'Alarm':
                return '#ff5d5d';
            case 'Ok':
                return 'green';
            default:
                return 'white';
        }
    }

    const content = !isOpen ? null : <div>
        <Paragraph>
            <List itemLayout="horizontal" split={false}   >
                <List.Item className="pb-0 pt-0">
                    <List.Item.Meta style={{ fontWeight: 500, }}  description="Site Status" />
                    <div style={{ color: statusColor(props.selected.status) }}>{props.selected.status}</div>
                </List.Item>
            </List>
            <List header={<div style={{ fontSize: 20 }} className="has-text-primary mb-0">
                    <Icon type="environment" style={{ fontSize: 20 }} /> Location</div>}
                itemLayout="horizontal" split={false}   >
                <List.Item className="pb-0 pt-0">
                    <List.Item.Meta style={{ fontWeight: 500 }}  description="Latitude:" />
                    <div>{props.selected.latitude}</div>
                </List.Item>
                <List.Item>
                    <List.Item.Meta style={{ fontWeight: 500 }} description="Longitude:" />
                    <div>{props.selected.longitude}</div>
                </List.Item>
            </List>
            <List
                header={<div style={{ fontSize: 20 }} className="has-text-primary mb-0">
                    <Icon type="global" style={{ fontSize: 18 }} /> Pages</div>}
                itemLayout="horizontal" split={false}
                dataSource={props.selected.pages}
                renderItem={(item, i) => (
                    <List.Item key={i} className="pb-0 pt-0">
                        <List.Item.Meta
                            description={<a target="_blank" rel="noopener noreferrer" className="has-text-white"
                                href={item.url}>{item.name}</a>}
                        />
                        <div style={{ color: statusColor(item.status) }}>{item.status}</div>
                    </List.Item>
                )}>
            </List>
        </Paragraph>
    </div>
    return (
        <Drawer
            placement="right"
            closable={true}
            title={title}
            onClose={props.close}
            visible={isOpen}
            mask={false}
            width='400px'
        >{content} </Drawer>
    );
};

export default MapDrawer;