import { Table, Button, Modal, Form, Input, Space } from 'antd';
import { useState } from 'react';
const AddressTable = ({ addressData, setAddressData}) => {
    const [modalShow, setModalShow] = useState(false);
    const delRecord = (record) => (_) => {
        const _addressData = addressData.filter((x) => (x?.address !== record?.address));
        console.log(_addressData);
        setAddressData(_addressData);
    };
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button onClick={delRecord(record)}>Delete</Button>
            ),
        }
    ]
    const showAddForm = () => {
        setModalShow(true);
    }
    const addData = (value) => {
        console.log(value)
        const _addressData = addressData.concat({
            name: value?.name,
            address: value?.address
        })
        setAddressData(_addressData);
        setModalShow(false);
    }
    return <Space direction='vertical'>
        <Modal
            visible={modalShow}
            footer={null}
            onCancel={() => { setModalShow(false) }}
        >
            <Form onFinish={addData} name="addAddressData">
            <Form.Item name="name" label="Name" style={{ paddingRight: 30 }}>
                    <Input></Input>
                </Form.Item>
                <Form.Item name="address" label="Address" style={{ paddingRight: 30 }}>
                    <Input></Input>
                </Form.Item>
                <Form.Item name="submit" style={{textAlign: 'center'}}>
                    <Button type="primary" htmlType='submit'>Submit</Button>
                </Form.Item>
            </Form>
        </Modal>
        <Button type="primary" onClick={showAddForm}>Add address</Button>
        <Table columns={columns} dataSource={addressData} />
        </Space>;
}
export default AddressTable;