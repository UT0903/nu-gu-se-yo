import { Table, Button, Modal, Form, Input, Space, InputNumber } from 'antd';
import { notification, message } from 'antd';
import { useState } from 'react';
const AddressTable = ({ addressData, setAddressData, walletAddress, deployedContract, fetchContractInfo}) => {
    const [modalShow, setModalShow] = useState(false);
    
    const delRecord = (record) => (_) => {
        if (record?.address) {
            deployedContract.methods.removeBeneficiary(record.address).send({
                from: walletAddress
            })
            .then(() => {
                const _addressData = addressData.filter((x) => (x?.address !== record.address));
                setAddressData(_addressData);
                console.log(`del address ${record.address}`);
                notification.open({
                    message: `Beneficiary ${record.address} Deleted`
                })
            })
            .catch(err => message.error(err.message));
        } 
    };
    const onRescue = (e) => {
        console.log(`rescue Address`)
        try {
            deployedContract.methods.execute().send({ from: walletAddress })
            notification.open({ message: 'Funds have been sent to Beneficiaries.' });
        } catch (err) {
            message.error(err.message)
        }
    }

    const columns = [
        // {
        //     title: 'Name',
        //     dataIndex: 'name',
        //     key: 'name'
        // },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Ratio (%)',
            dataIndex: 'ratio',
            key: 'ratio'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button type="primary" onClick={delRecord(record)}>Delete</Button>
                </>
            ),
        }
    ]
    const showAddForm = () => {
        setModalShow(true);
    }
    
    const addData = async (value) => {
        console.log(value)
        const _addressData = addressData.concat({
            address: value?.address,
            ratio: value?.ratio
        });
        setModalShow(false);
        await deployedContract.methods.addBeneficiary(value.address, value.ratio).send({
          from: walletAddress
        });
        notification.open({
            message: `Beneficiary ${value?.address} Added`
        })
        await fetchContractInfo();
        setAddressData(_addressData);
      }

    return <Space direction='vertical'>
        <Modal
            visible={modalShow}
            footer={null}
            onCancel={() => { setModalShow(false) }}
        >
            <Form onFinish={addData} name="addAddressData">
                {/* <Form.Item
                    name="name"
                    label="Name"
                    style={{ paddingRight: 30 }}
                    rules={[
                        {
                            required: true,
                            message: "can't be null"
                        },
                    ]}
                >
                    <Input></Input>
                </Form.Item> */}
                <Form.Item
                    name="address"
                    label="Address"
                    style={{ paddingRight: 30 }}
                    rules={[
                        {
                            required: true,
                            message: "can't be null"
                        },
                        {
                            pattern: /^0x/,
                            message: 'address should start with 0x'
                        }
                    ]}
                >
                    
                    <Input></Input>
                </Form.Item>
                <Form.Item
                    name="ratio"
                    label="Ratio"
                    style={{ paddingRight: 30 }}
                    rules={[
                        {
                            required: true,
                            message: "can't be null"
                        },
                    ]}
                ><InputNumber
                    addonAfter="%"
                    precision={0}
                    step={1}
                    min={0}
                    max={100}
                /></Form.Item>
                <Form.Item name="submit" style={{textAlign: 'center'}}>
                    <Button type="primary" htmlType='submit'>Submit</Button>
                </Form.Item>
            </Form>
        </Modal>
        <Space direction='horizontal'>
            <Button type="primary" onClick={showAddForm}>Add Beneficiary</Button>
            <Button type="primary" onClick={onRescue}>Rescue</Button>
        </Space>
        <Table style={{
            minWidth: 800
        }}
            columns={columns}
            dataSource={addressData} />
        </Space>;
}
export default AddressTable;