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
        title={
            <div className="modal-title">
                <i className="ri-bank-line"></i>
                <span>Deposit Funds</span>
            </div>
        }
        open={showDepositeModal}
        onCancel={() => setShowDepositeModal(false)}
        footer={null}
        closable={!depositing}
        maskClosable={!depositing}
        width={450}
        className="deposit-modal"
        destroyOnClose={true}
        centered
    >
        <div className="modal-content-wrapper">
            <div className="deposit-icon-wrapper">
                <i className="ri-money-dollar-circle-line"></i>
            </div>
            <p className="modal-description">Enter the amount you want to deposit into your account.</p>
            <Form layout='vertical' form={form}>
                <Form.Item label="Amount"
                name='amount' rules={[{
                    required: true,
                    message: 'Please enter your amount',
                }]}>
                    <input type='number' disabled={depositing} placeholder="Enter amount" className="modal-input" />
                </Form.Item>

                <div className="modal-actions">
                    <motion.button
                        className='modal-cancel-btn'
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
                            className='modal-confirm-btn'
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
                                    Deposit Now
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