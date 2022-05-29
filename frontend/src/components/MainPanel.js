import {useEffect, useState} from 'react';
import Web3 from 'web3';
import TransferForm from './TransferForm.js';
import {MainContract} from '../contracts/MainContract.js';
import {getWeb3} from '../utils';
import { Space, Card, Form } from 'antd';
import AddressTable from './AddressTable.js';
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
  
      return (
        <Space direction='vertical'>
          <Space direction='horizontal'>
          <Card
            
            size="small"
            style={{
              minWidth: 400,
              background: '#ececec'
            }}
          >
            <p>錢包地址:</p>
            <p>{account}</p>
            <p>目前錢包餘額: {balance}</p>
          </Card>
          <TransferForm balance={{ wallet: balance, bank: 3 }} form={form}/>
          <Card
            size="small"
            style={{
              minWidth: 400,
              background: '#ececec'
            }}
          >
            <p>保險錢包餘額: {3}</p>
          </Card>
          </Space>
          <AddressTable addressData={addressData} setAddressData={setAddressData}></AddressTable>
        </Space>
      );
        // <>{account}<p>目前錢包餘額：{
        //   balance}</p>
        //     <p>保險錢包餘額：{}</p>
        //       <button onClick = {deployContract}>部署</button>
        // </>);
    }

export default MainPanel;
