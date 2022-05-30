import {useEffect, useState} from 'react';
import Web3 from 'web3';
import TransferForm from './TransferForm.js';
import {MainContract} from '../contracts/MainContract.js';
import {getWeb3} from '../utils';
import { Space, Card, Form, Typography } from 'antd';
import AddressTable from './AddressTable.js';
const { Text, Title } = Typography;

const MainPanel =
    ({userInfo}) => {
      const [account, setAccount] = useState(null);
      const [balance, setBalance] = useState(0.0);
      const [web3, setWeb3] = useState(null);
      const [addressData, setAddressData] = useState([]);
      const [form] = Form.useForm();
      useEffect(() => {
        loadWeb3();
      }, []);

      const loadWeb3 =
          async () => {
        const _web3 = await getWeb3();
        setWeb3(_web3);
        const accounts = await _web3.eth.getAccounts();
        setAccount(accounts[0]);
        const _balance = await _web3.eth.getBalance(accounts[0]) / 1e18;
        console.log(_balance)
            setBalance(_balance);
            // form.setFieldsValue({
            //   dir: '>>>',
            //   amount: _balance
            // });
      }

      const deployContract =
          async () => {
        const contract = new web3.eth.Contract(MainContract);
        contract.deploy().send();
      }
      const onTransfer = (value) => {
        console.log('onTransfer:')
        console.log(value)
      }
      return (
        <Space direction='vertical' style={{
          paddingTop:100
        }}>
          <Space direction='horizontal'>
          <Card
            
            size="small"
            style={{
              minWidth: 400,
              background: '#ececec',
              height: 250
            }}
          >
              <Title level={5}>Wallet Address:</Title>
              <Title level={5}>{account}</Title>
              <Title level={5}>Wallet Remain: {balance}</Title>
          </Card>
            <TransferForm balance={{ wallet: balance, bank: 3 }} form={form} onTransfer={onTransfer}/>
          <Card
            size="small"
            style={{
              minWidth: 400,
              background: '#ececec',
              height: 250
            }}
            >
              <Title level={5}>Insurance Address:</Title>
              <Title level={5}>{"0xblablablabla"}</Title>
              <Title level={5}>Insurance Remain: {3}</Title>
          </Card>
          </Space>
          <AddressTable addressData={addressData} setAddressData={setAddressData} ></AddressTable>
        </Space>
      );
    }

export default MainPanel;
