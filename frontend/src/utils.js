import Web3 from 'web3';

export const getWeb3 = () =>
new Promise((resolve, reject) => {
  window.addEventListener("load", async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Accounts now exposed
        resolve(web3);
      } catch (error) {
        reject(error);
      }
    }
  });
})

export const BASE_URL = 'http://10.5.5.174:3002';
