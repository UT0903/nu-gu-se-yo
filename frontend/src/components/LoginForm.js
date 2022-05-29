import { Button, Checkbox, Form, Input } from 'antd';
import {Modal} from 'antd'
const App = ({ onFinish, onFinishFailed, modalShow, userInfo, setModalShow}) => {
  return (
    <Modal 
        title="Please Login"
        visible={modalShow && !userInfo}
        footer={[]}
        onCancel={() => { setModalShow(false) }}
      >
    <Form
      name="login"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="ID"
        name="id"
        rules={[
          {
            required: true,
            message: 'Please input your id!',
            },
            {
                pattern: /^[A-Z][0-9]{9}$/,
                message: "Pattern: A123456789"
            }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
            },
            {
                pattern: /^[0-9A-Za-z]+$/,
                message: 'Only Contains Alphabets and Numbers'
            },
            {
              min: 6,
              max: 12,
                message: '5 < Len < 13',
            },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      </Form>
      </Modal>
  );
};

export default App;