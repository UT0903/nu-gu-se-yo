import './App.css';
import 'antd/dist/antd.css';

import {Modal} from 'antd'
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

  return (
    <div className='App'>
      <TopMenu data={userInfo}
          onLogin={handleLogin}
          onLogout={handleLogout} />
      <Modal 
        title="Basic Modal"
        visible={modalShow}
        footer={[]}
        onCancel={() => { setModalShow(false) }}
      >
        <LoginForm
            backdrop={true}
            show={modalShow}
            onHide={() => {
              setModalShow(false);
            }}
            setUserInfo={setUserInfo}
            otherOption='Cancel'
        />
      </Modal>
      <MainPanel userInfo={userInfo}/>
    </div>
    );
}

export default App;
