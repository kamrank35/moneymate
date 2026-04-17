import React from 'react'
import { Modal,Form, message } from 'antd'
import StripeCheckout from 'react-stripe-checkout'
import { useDispatch } from 'react-redux'
import { HideLoading, ShowLoading } from '../../redux/loadersSlice'
import { DepositeFunds } from '../../apicalls/transactions'
import { motion } from 'framer-motion'

function DepositeModel({showDepositeModal,setShowDepositeModal,reloadData}) {

    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const [depositing, setDepositing] = React.useState(false)

    const onToken = async(token) => {
        try {
            setDepositing(true)
            dispatch(ShowLoading())
            const response = await DepositeFunds({ token , amount : form.getFieldValue("amount") });
            dispatch(HideLoading())
            setDepositing(false)
            if (response.success) {
                reloadData()
                setShowDepositeModal(false)
                message.success(response.message)
            }
            else{
            message.error(response.message)
            }
        } catch (error) {
            dispatch(HideLoading())
            setDepositing(false)
            message.error(error.message)
        }
    }

  return (
    <Modal
        title="Deposit Funds"
        open={showDepositeModal}
        onCancel={() => setShowDepositeModal(false)}
        footer={null}
        closable={!depositing}
        maskClosable={!depositing}
    >
        <div className="flex flex-col gap-1">
            <Form layout='vertical'
                form={form}
            >
                <Form.Item label="Amount"
                name='amount' rules={[{
                    required: true,
                    message: 'Please input your amount',
                }]}>
                    <input type='number' disabled={depositing} />
                </Form.Item>

                <div className="flex justify-end gap-1">
                    <motion.button
                        className='primary-outlined-btn'
                        onClick={() => setShowDepositeModal(false)}
                        disabled={depositing}
                        type='button'
                        whileHover={{ scale: depositing ? 1 : 1.02 }}
                    >
                        Cancel
                    </motion.button>
                    <StripeCheckout
                        token={onToken}
                        currency='USD'
                        amount={ form.getFieldValue("amount") * 100 }
                        shippingAddress
                        disabled={depositing}
                        stripeKey="pk_test_51Q1p4nRriCsWZztNI0ZAN0BCfmkndN4JahXkFveiKBWR80mP6jnHpyzn5e1dc0pb9FHitCGgmrSbOhBoeUfAVFR900x5obW6LT"
                    >
                        <motion.button
                            className='primary-contained-btn'
                            disabled={depositing}
                            whileHover={{ scale: depositing ? 1 : 1.02 }}
                            whileTap={{ scale: depositing ? 1 : 0.98 }}
                        >
                            {depositing ? (
                                <span className="btn-spinner">
                                    <i className="ri-loader-4-line spin"></i>
                                    Processing...
                                </span>
                            ) : (
                                <>
                                    <i className="ri-bank-line mr-1"></i>
                                    Deposit
                                </>
                            )}
                        </motion.button>
                    </StripeCheckout>
                </div>

            </Form>
        </div>
    </Modal>
  )
}

export default DepositeModel