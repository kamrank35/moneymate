import React from 'react'
import { Modal,Form, message } from 'antd'
import { useDispatch,useSelector } from 'react-redux'
import { TransferFunds } from '../../apicalls/transactions'
import { ShowLoading, HideLoading } from "../../redux/loadersSlice"
import { motion } from 'framer-motion'
import UserSearch from '../../components/UserSearch'

function TransferFundsModels( {showTransferFundsModel, setShowTransferFundsModel,reloadData} ) {
    const {user} = useSelector(state => state.users)
    const [selectedReceiver, setSelectedReceiver] = React.useState(null)
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const [transferring, setTransferring] = React.useState(false)

    const handleUserSelect = (user) => {
        setSelectedReceiver(user)
    }

    const onFinish = async(values) => {
        if (!selectedReceiver) {
            message.error('Please select a recipient');
            return;
        }
        try {
            setTransferring(true)
            dispatch(ShowLoading())
            const payload = {
                sender: user._id,
                receiver: selectedReceiver._id,
                amount: parseFloat(values.amount),
                reference: values.reference || "no reference",
                status: "success",
                type: "transfer"
            }
            const response = await TransferFunds(payload)
            if(response.success){
                reloadData();
                setShowTransferFundsModel(false)
                setSelectedReceiver(null)
                form.resetFields()
                message.success(response.message)
            }
            else{
                message.error(response.message)
            }
            dispatch(HideLoading())
            setTransferring(false)
        } catch (error) {
            message.error(error.message)
            dispatch(HideLoading())
            setTransferring(false)
        }
    }

    const handleClose = () => {
        setShowTransferFundsModel(false)
        setSelectedReceiver(null)
        form.resetFields()
    }

  return (
        <Modal
            title={
                <div className="modal-title">
                    <i className="ri-send-plane-line"></i>
                    <span>Transfer Funds</span>
                </div>
            }
            open={showTransferFundsModel}
            onCancel={handleClose}
            footer={null}
            closable={!transferring}
            maskClosable={!transferring}
            width={480}
            className="transfer-modal"
        >
            <div className="modal-content-wrapper">
                <Form layout='vertical' form={form} onFinish={onFinish}>
                    <Form.Item label="Select Recipient">
                        <UserSearch
                            onSelect={handleUserSelect}
                            disabled={transferring}
                        />
                    </Form.Item>

                    {selectedReceiver && (
                        <motion.div
                            className='selected-user-badge'
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                        >
                            <i className="ri-check-line"></i>
                            Sending to: {selectedReceiver.firstName} {selectedReceiver.lastName}
                        </motion.div>
                    )}

                    <Form.Item
                        label="Amount"
                        name="amount"
                        rules={[
                            {
                                required: true,
                                message: "Please enter amount!"
                            },
                            {
                                validator: (_, value) => {
                                    if (value && parseFloat(value) <= 0) {
                                        return Promise.reject('Amount must be greater than 0');
                                    }
                                    if (value && parseFloat(value) > user.balance) {
                                        return Promise.reject('Insufficient Balance');
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <input
                            type="number"
                            disabled={transferring}
                            placeholder="Enter amount"
                            min="1"
                            className="modal-input"
                        />
                    </Form.Item>

                    <Form.Item label="Reference (Optional)" name="reference">
                        <textarea
                            type="text"
                            disabled={transferring}
                            placeholder="Add a note for this transfer"
                            rows={2}
                            className="modal-input"
                        />
                    </Form.Item>

                    <div className="modal-actions">
                        <motion.button
                            className="modal-cancel-btn"
                            onClick={handleClose}
                            disabled={transferring}
                            type='button'
                            whileHover={{ scale: transferring ? 1 : 1.02 }}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            className="modal-confirm-btn"
                            type='submit'
                            disabled={transferring || !selectedReceiver}
                            whileHover={{ scale: (transferring || !selectedReceiver) ? 1 : 1.02 }}
                            whileTap={{ scale: (transferring || !selectedReceiver) ? 1 : 0.98 }}
                        >
                            {transferring ? (
                                <span className="btn-spinner">
                                    <i className="ri-loader-4-line spin"></i>
                                    Transferring...
                                </span>
                            ) : (
                                <>
                                    <i className="ri-send-plane-line mr-1"></i>
                                    Transfer Now
                                </>
                            )}
                        </motion.button>
                    </div>
                </Form>
            </div>
        </Modal>
  )
}

export default TransferFundsModels