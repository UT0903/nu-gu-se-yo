import React, { useState } from "react";
import { Menu, Button } from "antd";

const TopMenu = ({ data, onLogin, onLogout }) => {
  const [selected, setSelected] = useState("home");
  const onClick = (e) => {
    if (e.key === "log") return;
    setSelected(e.key)
  };
  return (
    <Menu onClick={onClick} selectedKeys={[selected]} mode="horizontal">
      <Menu.Item key="log">
        {data !== null ? (
          <a onClick={onLogout} href="/">登出</a>
        ) : (
          <a onClick={onLogin}>登入</a>
        )}
      </Menu.Item>
    </Menu>
  );
};

export default TopMenu;
