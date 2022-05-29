import './App.css';
import 'antd/dist/antd.css';


import React, {useEffect, useState} from 'react'

import LoginForm from './components/LoginForm';
import MainPanel from './components/MainPanel';
import TopMenu from './components/TopMenu';

const App = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    document.title = 'nu-gu-se-yo';
  }, []);

  const handleLogin = () => {
    setModalShow(true);
  };

  const handleLogout = () => {
    setUserInfo(null);
  }
  const onFinish = (values) => {
    setUserInfo(values);
    setModalShow(false);
    console.log('Success:', values);
    };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className='App'>
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
      <MainPanel userInfo={userInfo}/>
    </div>
    );
}

export default App;
