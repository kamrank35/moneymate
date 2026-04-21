import React, { useState, useEffect } from 'react'
import {Form,Col,Row, message} from 'antd'
import {useNavigate} from 'react-router-dom'
import { RegisterUser } from '../../apicalls/Users'
import { motion } from 'framer-motion'

function Register() {
    const [loading, setLoading] = React.useState(false)
    const navigate = useNavigate()
    const [isDarkTheme, setIsDarkTheme] = useState(() => {
        const saved = localStorage.getItem('theme')
        return saved === 'dark'
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light')
    }, [isDarkTheme])

    const toggleTheme = () => {
        const newTheme = !isDarkTheme
        setIsDarkTheme(newTheme)
        localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    }
    const onFinish = async(values) => {
        try {
            setLoading(true)
            const response = await RegisterUser(values)
            setLoading(false)
            if(response.success){
                message.success(response.message)
                navigate("/login")
            }else{
                message.error(response.message)
            }
        } catch (error) {
            setLoading(false)
            message.error(error.message)
        }
    }

    return (
        <motion.div
            className='register-page'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <button className="theme-toggle-login" onClick={toggleTheme}>
                <i className={isDarkTheme ? "ri-sun-line" : "ri-moon-line"}></i>
            </button>
            <motion.div
                className="register-card card"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
            >
                <div className="register-header">
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
                    <p className="text-secondary">Create your account</p>
                </div>
                <div className="register-nav">
                    <motion.button
                        className="text-sm text-primary primary-outlined-btn"
                        onClick={()=>navigate("/login")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Already have an account? Sign In
                    </motion.button>
                </div>
                <hr />
                <Form layout='vertical' onFinish={onFinish} className='register-form'>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label="First Name" name='firstName' rules={[{ required: true, message: 'Please enter first name' }]}>
                                <input type="text" placeholder="First name" disabled={loading} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Last Name" name='lastName' rules={[{ required: true, message: 'Please enter last name' }]}>
                                <input type="text" placeholder="Last name" disabled={loading} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Email" name='email' rules={[
                                { required: true, message: 'Please enter email' },
                                { type: 'email', message: 'Please enter a valid email' }
                            ]}>
                                <input type="email" placeholder="Email address" disabled={loading} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Mobile" name='phoneNumber' rules={[
                                { required: true, message: 'Please enter mobile number' },
                                { pattern: /^[0-9]+$/, message: 'Mobile number must contain only digits' },
                                { len: 10, message: 'Mobile number must be exactly 10 digits' }
                            ]}>
                                <input type="tel" placeholder="Mobile number" disabled={loading} maxLength={10} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="ID Type" name='identificationType' rules={[{ required: true, message: 'Please select ID type' }]}>
                                <select disabled={loading}>
                                    <option value="">Select ID type</option>
                                    <option value="NATIONAL ID">National Id</option>
                                    <option value="PASSPORT">Passport</option>
                                    <option value="DRIVING LICENSE">Driving License</option>
                                </select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="ID Number" name='identificationNumber' rules={[{ required: true, message: 'Please enter ID number' }]}>
                                <input type="text" placeholder="ID number" disabled={loading} />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item label="Address" name='address' rules={[{ required: true, message: 'Please enter address' }]}>
                                <textarea rows={3} placeholder="Full address" disabled={loading} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Password" name='password' rules={[
                                { required: true, message: 'Please enter password' },
                                { min: 6, message: 'Password must be at least 6 characters' }
                            ]}>
                                <input type="password" placeholder="Password" disabled={loading} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Confirm Password" name='confirmPassword' rules={[
                                { required: true, message: 'Please confirm password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match'));
                                    },
                                }),
                            ]}>
                                <input type="password" placeholder="Confirm password" disabled={loading} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div className="register-footer">
                        <motion.button
                            className='primary-contained-btn'
                            type='submit'
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                        >
                            {loading ? (
                                <span className="btn-spinner">
                                    <i className="ri-loader-4-line spin"></i>
                                    Creating Account...
                                </span>
                            ) : (
                                <>
                                    <i className="ri-user-add-line mr-1"></i>
                                    Create Account
                                </>
                            )}
                        </motion.button>
                    </div>
                </Form>
            </motion.div>
        </motion.div>
    )
}

export default Register
