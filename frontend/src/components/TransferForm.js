import {Button, Form, InputNumber, Segmented, Select, Space, Radio, Card} from 'antd';
import {useState} from 'react';
const {Option} = Select;
const TransferForm = ({balance, form, onTransfer}) => {
    // const [inputMax, setInputMax] = useState(balance.wallet);
    // const [disable, setDisable] = useState((balance.wallet > 1)? true:false);

    // const onValuesChange = (value) => {
    //     if (value?.dir) {
    //         console.log('dir change');
    //         if (value.dir === '>>>') {
    //             setInputMax(balance.wallet)
    //             form.setFields({
    //                 amount: balance.wallet
    //             })
    //         }
    //         else {
    //             setInputMax(balance.bank)
    //             form.setFieldsValue({
    //                 amount: balance.bank
    //             })
    //         }
            
    //     }
    //     else {
    
    //     }
    //     console.log(value)
    // }
    const maxVal = (form.getFieldsValue("dir") === '>>>')? balance.wallet: balance.bank
    return (
        <Card style={{
            height: 250
        }}>
            <Form form={form} name="transfer" onFinish={onTransfer}>
                <Form.Item name="dir" label="Transfer Direction" rules={[
                    {
                        required: true,
                        message: 'please select direction'
                    }
                ]}>
                <Radio.Group block>
                        <Radio.Button value=">>>">{'>>>'}</Radio.Button>
                        <Radio.Button value="<<<">{'<<<'}</Radio.Button>
                </Radio.Group>
                </Form.Item>
                <Form.Item name="amount" label="Amount"
                    rules={[
                        {
                            required: true,
                            message: 'please set amount'
                        }
                    ]}
                    // rules={[
                    // {
                    //     max: maxVal,
                    //     message: `maxium value: ${maxVal}`
                    // }
                    // ]}
                >
                    <InputNumber
                    addonAfter="ether"
                    precision={4}
                    step={0.01}
                    min={0}
                    />
                </Form.Item>
                <Form.Item>
                    <Button block type="primary" htmlType="submit">transfer</Button>
                </Form.Item>
        </Form>
        
        
        
            
        </Card>
    );
}
export default TransferForm;