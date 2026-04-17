import React from 'react'
import {useNavigate} from 'react-router-dom'
import {Form,Col,Row, message} from 'antd'
import { LoginUser } from '../../apicalls/Users'
import { motion } from 'framer-motion'

function Login() {
    const navigate = useNavigate()
    const [loading, setLoading] = React.useState(false)
    const onFinish = async(values) => {
        try {
            setLoading(true)
            const response=await LoginUser(values)
            if(response.success){
                message.success(response.message)
                localStorage.setItem('token',response.data)
                window.location.href = '/';
            }else{
                message.error(response.message)
            }
            setLoading(false)
        } catch (error) {
            message.error(error.message)
            setLoading(false)
        }
    }

    return (
        <motion.div
            className='login-page'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="login-card card"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
            >
                <div className="login-header">
                    <motion.div
                        className="logo-section"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="logo-icon bg-primary">
                            <i className="ri-wallet-3-line"></i>
                        </div>
                        <h1 className="text-2xl">Money Mate</h1>
                    </motion.div>
                    <p className="text-secondary">Sign in to your account</p>
                </div>
                <hr />
                <Form layout='vertical' onFinish={onFinish} className='login-form'>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="Email" name='email' rules={[
                                { required: true, message: 'Please enter your email' },
                                { type: 'email', message: 'Please enter a valid email' }
                            ]}>
                                <input type="email" placeholder="Enter your email" className="input-interactive" />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item label="Password" name='password' rules={[
                                { required: true, message: 'Please enter your password' }
                            ]}>
                                <input type="password" placeholder="Enter your password" className="input-interactive" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <motion.button
                        className='primary-contained-btn w-100'
                        type='submit'
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                    >
                        {loading ? (
                            <span className="btn-spinner">
                                <i className="ri-loader-4-line spin"></i>
                                Signing in...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </motion.button>
                    <div className="login-footer">
                        <p className="text-sm text-muted">Don't have an account?
                            <motion.span
                                className="text-primary underline"
                                onClick={()=>navigate("/register")}
                                whileHover={{ scale: 1.05 }}
                                style={{ cursor: 'pointer' }}
                            > Register here</motion.span>
                        </p>
                    </div>
                </Form>
            </motion.div>
        </motion.div>
    )
}

export default Login
