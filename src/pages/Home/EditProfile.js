import React, { useState } from 'react';
import { Modal, Form, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateProfile, UpdatePassword, SendOTP, VerifyOTP } from '../../apicalls/Users';
import { SetUser } from '../../redux/usersSlice';
import { motion } from 'framer-motion';

function EditProfile({ showEditProfile, setShowEditProfile }) {
    const { user } = useSelector(state => state.users);
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [activeTab, setActiveTab] = useState('profile');
    const [saving, setSaving] = useState(false);
    const [otpStep, setOtpStep] = useState('send'); // 'send' | 'verify' | 'verified'
    const [otpLoading, setOtpLoading] = useState(false);
    const [tempToken, setTempToken] = useState(null);
    const [otpValue, setOtpValue] = useState('');

    React.useEffect(() => {
        if (user) {
            form.setFieldsValue({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                identificationType: user.identificationType,
                identificationNumber: user.identificationNumber,
                address: user.address
            });
        }
    }, [user, form]);

    const handleProfileUpdate = async (values) => {
        try {
            setSaving(true);
            const response = await UpdateProfile({
                userId: user._id,
                ...values
            });
            if (response.success) {
                dispatch(SetUser(response.data));
                message.success('Profile updated successfully');
                setShowEditProfile(false);
            } else {
                message.error(response.message);
            }
        } catch (error) {
            message.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSendOTP = async () => {
        try {
            setOtpLoading(true);
            const response = await SendOTP({
                userId: user._id
            });
            if (response.success) {
                message.success('OTP sent successfully! Check your email/phone');
                setOtpStep('verify');
                // For testing - remove in production
                console.log('OTP (for testing):', response.otp);
            } else {
                message.error(response.message);
            }
        } catch (error) {
            message.error(error.message);
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            if (!otpValue || otpValue.length !== 6) {
                message.error('Please enter a valid 6-digit OTP');
                return;
            }
            setOtpLoading(true);
            const response = await VerifyOTP({
                userId: user._id,
                otp: otpValue
            });
            if (response.success) {
                message.success('OTP verified successfully');
                setTempToken(response.tempToken);
                setOtpStep('verified');
            } else {
                message.error(response.message);
                setOtpValue('');
            }
        } catch (error) {
            message.error(error.message);
        } finally {
            setOtpLoading(false);
        }
    };

    const handleResendOTP = async () => {
        await handleSendOTP();
    };

    const handlePasswordUpdate = async (values) => {
        try {
            if (values.newPassword !== values.confirmPassword) {
                message.error('New passwords do not match');
                return;
            }
            if (otpStep !== 'verified' || !tempToken) {
                message.error('Please verify OTP first');
                return;
            }
            setSaving(true);
            const response = await UpdatePassword({
                userId: user._id,
                newPassword: values.newPassword,
                tempToken: tempToken
            });
            if (response.success) {
                message.success('Password updated successfully');
                passwordForm.resetFields();
                setActiveTab('profile');
                setOtpStep('send');
                setTempToken(null);
                setOtpValue('');
            } else {
                message.error(response.message);
            }
        } catch (error) {
            message.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            title={
                <div className="modal-title">
                    <i className="ri-user-settings-line"></i>
                    <span>Edit Profile</span>
                </div>
            }
            open={showEditProfile}
            onCancel={() => setShowEditProfile(false)}
            footer={null}
            width={500}
            className="edit-profile-modal"
        >
            <div className="edit-profile-modal-body">
                <div className="profile-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <i className="ri-user-line"></i>
                        Profile Info
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
                        onClick={() => setActiveTab('password')}
                    >
                        <i className="ri-lock-line"></i>
                        Change Password
                    </button>
                </div>

                {activeTab === 'profile' && (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleProfileUpdate}
                        className="profile-form"
                    >
                        <div className="form-row">
                            <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
                                <input type="text" placeholder="First name" className="modal-input" />
                            </Form.Item>
                            <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
                                <input type="text" placeholder="Last name" className="modal-input" />
                            </Form.Item>
                        </div>

                        <Form.Item label="Email" name="email">
                            <input type="email" disabled placeholder="Email cannot be changed" className="modal-input disabled-input" />
                        </Form.Item>

                        <Form.Item label="Phone Number" name="phoneNumber" rules={[{ required: true }]}>
                            <input type="tel" placeholder="Phone number" className="modal-input" />
                        </Form.Item>

                        <div className="form-row">
                            <Form.Item label="ID Type" name="identificationType" rules={[{ required: true }]}>
                                <select className="modal-input">
                                    <option value="NATIONAL ID">National ID</option>
                                    <option value="PASSPORT">Passport</option>
                                    <option value="DRIVING LICENSE">Driving License</option>
                                </select>
                            </Form.Item>
                            <Form.Item label="ID Number" name="identificationNumber" rules={[{ required: true }]}>
                                <input type="text" placeholder="ID number" className="modal-input" />
                            </Form.Item>
                        </div>

                        <Form.Item label="Address" name="address" rules={[{ required: true }]}>
                            <textarea rows={2} placeholder="Full address" className="modal-input" />
                        </Form.Item>

                        <div className="modal-actions">
                            <motion.button
                                type="button"
                                className="modal-cancel-btn"
                                onClick={() => setShowEditProfile(false)}
                                disabled={saving}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                type="submit"
                                className="modal-confirm-btn"
                                disabled={saving}
                            >
                                {saving ? (
                                    <span className="btn-spinner">
                                        <i className="ri-loader-4-line spin"></i>
                                        Saving...
                                    </span>
                                ) : (
                                    <>
                                        <i className="ri-save-line mr-1"></i>
                                        Save Changes
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </Form>
                )}

                {activeTab === 'password' && (
                    <div className="password-change-container">
                        {/* OTP Verification Section */}
                        <div className="otp-section">
                            <div className="otp-header">
                                <i className="ri-shield-key-line"></i>
                                <h3>Verify Your Identity</h3>
                            </div>

                            {otpStep === 'send' && (
                                <motion.div
                                    className="otp-content"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <p className="otp-description">
                                        We'll send a 6-digit OTP to your registered email/phone for verification.
                                    </p>
                                    <motion.button
                                        className="otp-send-btn"
                                        onClick={handleSendOTP}
                                        disabled={otpLoading}
                                        whileHover={{ scale: otpLoading ? 1 : 1.02 }}
                                        whileTap={{ scale: otpLoading ? 1 : 0.98 }}
                                    >
                                        {otpLoading ? (
                                            <span className="btn-spinner">
                                                <i className="ri-loader-4-line spin"></i>
                                                Sending...
                                            </span>
                                        ) : (
                                            <>
                                                <i className="ri-mail-send-line"></i>
                                                Send OTP
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            )}

                            {otpStep === 'verify' && (
                                <motion.div
                                    className="otp-content"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <p className="otp-description">
                                        Enter the 6-digit OTP sent to your registered email/phone.
                                    </p>
                                    <div className="otp-input-wrapper">
                                        <input
                                            type="text"
                                            className="otp-input"
                                            placeholder="Enter OTP"
                                            value={otpValue}
                                            onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            maxLength={6}
                                        />
                                    </div>
                                    <div className="otp-actions">
                                        <motion.button
                                            className="otp-verify-btn"
                                            onClick={handleVerifyOTP}
                                            disabled={otpLoading || otpValue.length !== 6}
                                            whileHover={{ scale: otpLoading || otpValue.length !== 6 ? 1 : 1.02 }}
                                        >
                                            {otpLoading ? (
                                                <span className="btn-spinner">
                                                    <i className="ri-loader-4-line spin"></i>
                                                    Verifying...
                                                </span>
                                            ) : (
                                                <>
                                                    <i className="ri-check-line"></i>
                                                    Verify OTP
                                                </>
                                            )}
                                        </motion.button>
                                        <motion.button
                                            className="otp-resend-btn"
                                            onClick={handleResendOTP}
                                            disabled={otpLoading}
                                            whileHover={{ scale: otpLoading ? 1 : 1.05 }}
                                        >
                                            Resend OTP
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}

                            {otpStep === 'verified' && (
                                <motion.div
                                    className="otp-content otp-verified"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="otp-success-icon">
                                        <i className="ri-checkbox-circle-fill"></i>
                                    </div>
                                    <p className="otp-success-text">Identity Verified Successfully!</p>
                                    <p className="otp-subtext">You can now change your password.</p>
                                </motion.div>
                            )}
                        </div>

                        {/* Password Change Form */}
                        <Form
                            form={passwordForm}
                            layout="vertical"
                            onFinish={handlePasswordUpdate}
                            className="profile-form"
                            disabled={otpStep !== 'verified'}
                        >
                            <div className={`password-form-wrapper ${otpStep !== 'verified' ? 'disabled' : ''}`}>
                                <Form.Item
                                    label="New Password"
                                    name="newPassword"
                                    rules={[
                                        { required: true, message: 'Please enter new password' },
                                        { min: 6, message: 'Password must be at least 6 characters' }
                                    ]}
                                >
                                    <input type="password" placeholder="Enter new password" className="modal-input" />
                                </Form.Item>

                                <Form.Item
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    rules={[{ required: true, message: 'Please confirm password' }]}
                                >
                                    <input type="password" placeholder="Confirm password" className="modal-input" />
                                </Form.Item>

                                <div className="modal-actions">
                                    <motion.button
                                        type="button"
                                        className="modal-cancel-btn"
                                        onClick={() => {
                                            setShowEditProfile(false);
                                            setOtpStep('send');
                                            setTempToken(null);
                                            setOtpValue('');
                                        }}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        className="modal-confirm-btn"
                                        disabled={saving || otpStep !== 'verified'}
                                    >
                                        {saving ? (
                                            <span className="btn-spinner">
                                                <i className="ri-loader-4-line spin"></i>
                                                Updating...
                                            </span>
                                        ) : (
                                            <>
                                                <i className="ri-lock-unlock-line mr-1"></i>
                                                Update Password
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </Form>
                    </div>
                )}
            </div>
        </Modal>
    );
}

export default EditProfile;
