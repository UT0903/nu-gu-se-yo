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
      const [deployedContract, setDeployedContract] = useState(null);

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
        .then(_deployedContract => {
          const _contractAddress = _deployedContract.options.address;
          console.log(`Contract deployed at ${_contractAddress}`);
          setContractAddress(_contractAddress);
          setDeployedContract(_deployedContract);
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

      const fetchContractInfo = async () => {
        console.log(contractAddress);
        const _contractBalance = await web3.eth.getBalance(contractAddress);
        setContractBalance(_contractBalance / 1e18);
        const _contract = new web3.eth.Contract(MainContract.abi, contractAddress);
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
          fetchContractInfo();
      }, [contractAddress, web3]);

      useEffect(() => {
        if (userInfo?.contract_address) {
          setContractAddress(userInfo.contract_address);
          const _contract = new web3.eth.Contract(MainContract.abi, userInfo.contract_address);
          setDeployedContract(_contract);
        } else {
          setContractAddress(null);
          setDeployedContract(null);
        }
      }, [userInfo]);
  
      const onTransfer = (value) => {
        console.log('onTransfer:')
        console.log(value)
        if (value.dir === '>>>') {
          deployedContract.methods.deposit().send({
            from: walletAddress,
            value: web3.utils.toWei(value.amount.toString(), 'ether')
          })
          .then(notification.open({
            message: 'Deposit Successfully'
          }))
          .catch(message.error('Failed to Deposit'));
        } else if (value.dir === '<<<') {
          deployedContract.methods.withdraw(web3.utils.toWei(value.amount.toString(), 'ether')).send({
            from: walletAddress,
          })
          .then(notification.open({
            message: 'Withdraw Successfully'
          }))
          .catch(message.error('Failed to Withdraw'));
        }
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
          <AddressTable addressData={addressData} setAddressData={setAddressData} walletAddress={walletAddress} fetchContractInfo={fetchContractInfo} deployedContract={deployedContract}></AddressTable>
        </Space>
      );
    }

export default MainPanel;
