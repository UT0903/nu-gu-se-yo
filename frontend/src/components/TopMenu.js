import React, { useState } from "react";
import { Menu, Button } from "antd";

const TopMenu = ({userInfo, onLogin, onLogout }) => {
  const [selected, setSelected] = useState("home");
  const onClick = (e) => {
    if (e.key === "log") return;
    setSelected(e.key)
  };
  return (
    <Menu onClick={onClick} selectedKeys={[selected]} mode="horizontal" style={{
      background: "#FFFFE8"
    }}>
      <Menu.Item key="log">
        {userInfo !== null ? (
          <div onClick={onLogout}>{userInfo.id} 登出</div>
        ) : (
          <div onClick={onLogin}>登入</div>
        )}
      </Menu.Item>
    </Menu>
  );
};

export default TopMenu;
