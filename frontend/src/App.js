import './App.css';
import 'antd/dist/antd.css';

import { BASE_URL } from './utils';
import React, {useEffect, useState} from 'react'
import { Card, message } from 'antd';
import LoginForm from './components/LoginForm';
import MainPanel from './components/MainPanel';
import TopMenu from './components/TopMenu';

const App = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  console.log('userInfo')
  console.log(userInfo)
  useEffect(() => {
    document.title = 'nu-gu-se-yo';
  }, []);

  const handleLogin = () => {
    setModalShow(true);
  };

  const handleLogout = () => {
    setUserInfo(null);
  }
  const onFinish = async (values) => {
    const res = await fetch(BASE_URL + "/api/login", {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
          'id': values.id,
          'password': values.password
      })
    });
    const data = await res.json();
    if (data.status === 'ok') {
      setUserInfo({
        id: values.id,
        contract_address: data.address
      });
      setModalShow(false);
      // console.log('Success:', values);
    }
    else {
      message.error('Login Failed');
    }
    
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    // message.error('Login Failed' + errorInfo);
  };
  return (
    <div className='App' style={{
      backgroundImage: `url(background.jpg)`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      width: '100vw',
      height: '100vh',
    }}>
      
      <TopMenu userInfo={userInfo}
          onLogin={handleLogin}
        onLogout={handleLogout} />
        <LoginForm
            modalShow={modalShow}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            setModalShow={setModalShow}
            setUserInfo={setUserInfo}
            userInfo={userInfo}
        />
      <MainPanel userInfo={userInfo} visibility={userInfo === null? "hidden": "visible"}/>
    </div>
    );
}

export default App;
