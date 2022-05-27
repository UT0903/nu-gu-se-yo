import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Select } from "antd";
const { Option } = Select;
const RegisterForm = () => {
  // const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log('Success:', values);
  };
  // const [, forceUpdate] = useState({});
  // useEffect(() => {
  //   forceUpdate({});
  // }, []);
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  // const prefixSelector = (
  //   <Form.Item name="prefix" noStyle>
  //     <Select style={{ width: 100 }}>
  //       <Option value="">Some</Option>
  //       <Option value="all">All</Option>
  //     </Select>
  //   </Form.Item>
  // );
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      // form={form}
    >
      <Form.Item
        label="ID"
        name="id"
        rules={[{ required: true, message: "Wrong ID Format", pattern: /[A-Z]\d{9}/ }]}
      >
        <Input placeholder="A123456789"/>
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Wrong Password Format", pattern: /[a-zA-Z0-9]{6, }/ }]}
      >
        <Input.Password placeholder="len > 5 with upper case / lower case / numbers"/>
      </Form.Item>
      {/* <Form.Item
        label="Amount"
        name="amount"
        rules={[{ type: 'number', required: true, message: "" }]}
        shouldUpdate
      >
        <Input addonBefore={prefixSelector} placeholder="" disabled={form.getFieldValue }/>
      </Form.Item> */}
      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
