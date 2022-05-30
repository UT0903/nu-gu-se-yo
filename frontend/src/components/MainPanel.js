import {useEffect, useState} from 'react';
import TransferForm from './TransferForm.js';
import MainContract from '../contracts/MainContract.json';
import {getWeb3, BASE_URL} from '../utils';
import { Space, Card, Form, Typography, Spin } from 'antd';
import { message, notification } from 'antd';
import AddressTable from './AddressTable.js';
const { Title } = Typography;

const MainPanel = ({userInfo}) => {
      const [walletAddress, setWalletAddress] = useState(null);
      const [balance, setBalance] = useState(0.0);

      const [contractAddress, setContractAddress] = useState(null);
      const [contractBalance, setContractBalance] = useState(0.0);

      const [web3, setWeb3] = useState(null);
      const [addressData, setAddressData] = useState([]);
      const [form] = Form.useForm();

      const [deploying, setDeploying] = useState(false);

      useEffect(() => {
        loadWeb3();
      }, []);

      const loadWeb3 = async () => {
        const _web3 = await getWeb3();
        setWeb3(_web3);
        const accounts = await _web3.eth.getAccounts();
        setWalletAddress(accounts[0]);
        const _balance = await _web3.eth.getBalance(accounts[0]) / 1e18;
        console.log(_balance)
        setBalance(_balance);
      }

      const deployContract = async () => {
        if (!userInfo) {
          message.warn('Please log in first');
          return;
        }
        const _contract = new web3.eth.Contract(MainContract.abi);
        setDeploying(true);
        _contract.deploy({
          data: MainContract.bytecode,
          arguments: [walletAddress]
        })
        .send({
          from: walletAddress
        })
        .then(deployedContract => {
          const _contractAddress = deployedContract.options.address;
          console.log(`Contract deployed at ${_contractAddress}`);
          setContractAddress(_contractAddress);
          notification.open({
            message: 'Contract Deployed',
            description: `Contract deployed at ${_contractAddress}`
          });
          setDeploying(false);
          return fetch(BASE_URL + '/api/setContract', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                'id': userInfo.id,
                'contract_address': _contractAddress
            })
          });
        })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'ok')
            notification.open({
              message: 'Contract address saved'
            });
          else
            message.error('Failed to save contract address');
        })
        .catch(err => {
          message.error('Failed to deploy contact:', err);
        });
      }

      const fetchContractInfo = async (address) => {
        console.log(address);
        const _contractBalance = await web3.eth.getBalance(address);
        setContractBalance(_contractBalance);
        const _contract = new web3.eth.Contract(MainContract.abi, address);
        const numBeneficiaries = await _contract.methods.getNumBeneficiaries().call({
          from: walletAddress
        });
        console.log(numBeneficiaries);
        const beneficiaries = [];
        for (let i = 0; i < numBeneficiaries; i++) {
          const result = await _contract.methods.getBeneficiary(i).call({
            from: walletAddress
          });
          beneficiaries.push({
            address: result[0],
            ratio: result[1]
          });
        }
        console.log(beneficiaries);
        setAddressData(beneficiaries);
      }

      useEffect(() => {
        if (web3 && contractAddress)
          fetchContractInfo(contractAddress);
      }, [contractAddress, web3]);

      useEffect(() => {
        if (userInfo?.contract_address) {
          setContractAddress(userInfo.contract_address);
        } else {
          setContractAddress(null);
        }
      }, [userInfo]);
  
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
              <Title level={5}>{walletAddress}</Title>
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
              {
                (contractAddress) ?
                <div>
                  <Title level={5}>Insurance Address:</Title>
                  <Title level={5}>{contractAddress}</Title>
                  <Title level={5}>Insurance Remain: {contractBalance}</Title>
                </div> :
                <div>
                  {deploying ? <Spin /> : <button onClick={deployContract}>Deploy contract</button>}
                </div>
              }
          </Card>
          </Space>
          <AddressTable addressData={addressData} setAddressData={setAddressData} ></AddressTable>
        </Space>
      );
    }

export default MainPanel;
