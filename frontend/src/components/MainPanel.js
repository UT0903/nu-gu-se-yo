import {useEffect, useState} from 'react';
import Web3 from 'web3';

import {MainContract} from '../contracts/MainContract.js';
import {getWeb3} from '../utils';

const MainPanel =
    ({userInfo}) => {
      const [account, setAccount] = useState(null);
      const [balance, setBalance] = useState(0.0);
      const [web3, setWeb3] = useState(null);

      useEffect(() => {
        loadWeb3();
      });

      const loadWeb3 =
          async () => {
        const _web3 = await getWeb3();
        setWeb3(_web3);
        const accounts = await _web3.eth.getAccounts();
        setAccount(accounts[0]);
        const _balance = await _web3.eth.getBalance(accounts[0]) / 1e18;
        console.log(_balance)
        setBalance(_balance);
      }

      const deployContract =
          async () => {
        const contract = new web3.eth.Contract(MainContract);
        contract.deploy().send();
      }

      return (<>{account}<p>目前錢包餘額：{
          balance}</p>
            <p>保險錢包餘額：{}</p>
              <button onClick = {deployContract}>部署</button>
        </>);
    }

export default MainPanel;
