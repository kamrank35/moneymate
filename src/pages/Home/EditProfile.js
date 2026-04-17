import React, { useState } from 'react';
import { Modal, Form, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateProfile, UpdatePassword } from '../../apicalls/Users';
import { ShowLoading, HideLoading } from '../../redux/loadersSlice';
import { SetUser } from '../../redux/usersSlice';

function EditProfile({ showEditProfile, setShowEditProfile }) {
    const { user } = useSelector(state => state.users);
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [activeTab, setActiveTab] = useState('profile');
    const [saving, setSaving] = useState(false);

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

    const handlePasswordUpdate = async (values) => {
        try {
            if (values.newPassword !== values.confirmPassword) {
                message.error('New passwords do not match');
                return;
            }
            setSaving(true);
            const response = await UpdatePassword({
                userId: user._id,
                currentPassword: values.currentPassword,
                newPassword: values.newPassword
            });
            if (response.success) {
                message.success('Password updated successfully');
                passwordForm.resetFields();
                setActiveTab('profile');
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
            title="Edit Profile"
            open={showEditProfile}
            onCancel={() => setShowEditProfile(false)}
            footer={null}
            width={520}
            className="edit-profile-modal"
        >
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
                            <input type="text" placeholder="First name" />
                        </Form.Item>
                        <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
                            <input type="text" placeholder="Last name" />
                        </Form.Item>
                    </div>

                    <Form.Item label="Email" name="email">
                        <input type="email" disabled placeholder="Email cannot be changed" />
                    </Form.Item>

                    <Form.Item label="Phone Number" name="phoneNumber" rules={[{ required: true }]}>
                        <input type="tel" placeholder="Phone number" />
                    </Form.Item>

                    <div className="form-row">
                        <Form.Item label="ID Type" name="identificationType" rules={[{ required: true }]}>
                            <select>
                                <option value="NATIONAL ID">National ID</option>
                                <option value="PASSPORT">Passport</option>
                                <option value="DRIVING LICENSE">Driving License</option>
                            </select>
                        </Form.Item>
                        <Form.Item label="ID Number" name="identificationNumber" rules={[{ required: true }]}>
                            <input type="text" placeholder="ID number" />
                        </Form.Item>
                    </div>

                    <Form.Item label="Address" name="address" rules={[{ required: true }]}>
                        <textarea rows={2} placeholder="Full address" />
                    </Form.Item>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => setShowEditProfile(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="save-btn"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </Form>
            )}

            {activeTab === 'password' && (
                <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handlePasswordUpdate}
                    className="profile-form"
                >
                    <Form.Item
                        label="Current Password"
                        name="currentPassword"
                        rules={[{ required: true, message: 'Please enter current password' }]}
                    >
                        <input type="password" placeholder="Enter current password" />
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                            { required: true, message: 'Please enter new password' },
                            { min: 6, message: 'Password must be at least 6 characters' }
                        ]}
                    >
                        <input type="password" placeholder="Enter new password" />
                    </Form.Item>

                    <Form.Item
                        label="Confirm New Password"
                        name="confirmPassword"
                        rules={[{ required: true, message: 'Please confirm new password' }]}
                    >
                        <input type="password" placeholder="Confirm new password" />
                    </Form.Item>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => setShowEditProfile(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="save-btn"
                            disabled={saving}
                        >
                            {saving ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </Form>
            )}
        </Modal>
    );
}

export default EditProfile;
