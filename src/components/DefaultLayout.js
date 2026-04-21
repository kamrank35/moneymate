import React, { useState } from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import { Modal, message } from 'antd'

function DefaultLayout({children}) {
    const [collapsed,setCollapsed] = React.useState(false)
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const [isDarkTheme, setIsDarkTheme] = useState(() => {
        const saved = localStorage.getItem('theme')
        return saved === 'dark'
    })
    const {user} = useSelector(state=>state.users)
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        message.success('Logged out successfully')
        navigate('/login')
    }

    const toggleTheme = () => {
        const newTheme = !isDarkTheme
        setIsDarkTheme(newTheme)
        localStorage.setItem('theme', newTheme ? 'dark' : 'light')
        document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light')
    }

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light')
    }, [isDarkTheme])

    const userMenu = [
        {
            title:'Home',
            icon:'ri-home-4-fill',
            onClick: () => navigate('/'),
            path:"/"
        },
        {
            title:'Transactions',
            icon:'ri-bank-fill',
            onClick: () => navigate('/transactions'),
            path:"/transactions"
        },
        {
            title:'Logout',
            icon:'ri-logout-box-line',
            onClick: () => setShowLogoutModal(true),
            path:"/logout"
        },
    ]

    const adminMenu = [
        {
            title:'Home',
            icon:'ri-home-4-fill',
            onClick: () => navigate('/'),
            path:"/"
        },
        {
            title:'Users',
            icon:'ri-user-settings-line',
            onClick: () => navigate('/users'),
            path:"/users"
        },
        {
            title:'Transactions',
            icon:'ri-bank-fill',
            onClick: () => navigate('/transactions'),
            path:"/transactions"
        },
        {
            title:'Logout',
            icon:'ri-logout-box-line',
            onClick: () => setShowLogoutModal(true),
            path:"/logout"
        },
    ]

    const menuToRender = user?.isAdmin ? adminMenu : userMenu

    return (
        <div className={`layout ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar">
                <div className="brand-section">
                    <div className="brand-logo bg-secondary">
                        <i className="ri-wallet-3-fill"></i>
                    </div>
                    <div className="brand-text">
                        <h1 className="brand-name">Money</h1>
                        <h1 className="brand-name brand-highlight">Mate</h1>
                    </div>
                </div>
                <div className="menu">
                    {menuToRender.map((item)=> {
                        const isActive = window.location.pathname === item.path
                        return (
                            <div
                                key={item.path}
                                className={`menu-item ${isActive ? "active-menu-item" : ""}`}
                                onClick={item.onClick}
                            >
                                <i className={item.icon}></i>
                                <span className="menu-text">{item.title}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="body">
                <div className="header flex justify-between items-center">
                    <div className='toggle-btn text-secondary' onClick={()=> setCollapsed(!collapsed)}>
                        <i className={collapsed ? "ri-menu-unfold-line" : "ri-menu-fold-line"}></i>
                    </div>
                    <div className="header-logo">
                        <i className="ri-wallet-3-line text-secondary"></i>
                        <h1 className="text-xl text-secondary">MONEY MATE</h1>
                    </div>
                    <div className="user-info flex align-center gap-2">
                        <button className="theme-toggle-btn" onClick={toggleTheme}>
                            <i className={isDarkTheme ? "ri-sun-line" : "ri-moon-line"}></i>
                        </button>
                        <div className="user-avatar bg-secondary flex align-center justify-center text-white">
                            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </div>
                        <span className="user-name text-sm text-white">
                            {user?.firstName} {user?.lastName}
                        </span>
                    </div>
                </div>
                <div className="content">{children}</div>

                {/* Mobile Bottom Navigation */}
                <div className="mobile-bottom-nav">
                    {menuToRender.map((item)=> {
                        const isActive = window.location.pathname === item.path
                        const isLogout = item.path === "/logout"
                        return (
                            <button
                                key={item.path}
                                className={`mobile-nav-item ${isActive ? 'active' : ''} ${isLogout ? 'logout-nav' : ''}`}
                                onClick={item.onClick}
                            >
                                <i className={item.icon}></i>
                                <span>{item.title}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            <Modal
                title={
                    <div className="modal-title">
                        <i className="ri-logout-box-r-line"></i>
                        <span>Confirm Logout</span>
                    </div>
                }
                open={showLogoutModal}
                onCancel={() => setShowLogoutModal(false)}
                onOk={handleLogout}
                okText="Yes, Logout"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
                width={450}
                className="logout-confirmation-modal"
            >
                <div className="modal-content">
                    <div className="logout-icon-wrapper">
                        <i className="ri-logout-box-line"></i>
                    </div>
                    <p>Are you sure you want to logout?</p>
                    <p className="modal-subtitle">You will need to sign in again to access your account.</p>
                </div>
            </Modal>
        </div>
    )
}

export default DefaultLayout
