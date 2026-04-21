import React from 'react'
import {useSelector} from 'react-redux'
import { motion } from 'framer-motion'
import AnimatedNumber from '../../components/AnimatedNumber'
import EditProfile from './EditProfile'

function Home() {
  const {user} = useSelector(state => state.users)
  const [showEditProfile, setShowEditProfile] = React.useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="home-page"
    >
      <motion.div className="welcome-section mb-4" variants={itemVariants}>
        <div className="welcome-text">
          <motion.h1
            className="text-2xl text-primary mb-1"
            whileHover={{ scale: 1.01 }}
          >
            Welcome, {user.firstName}!
          </motion.h1>
          <p className="text-secondary">Here's your account overview</p>
        </div>
        <motion.button
          className="edit-profile-btn"
          onClick={() => setShowEditProfile(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className="ri-edit-line"></i>
          <span>Edit Profile</span>
        </motion.button>
      </motion.div>

      <motion.div
        className="balance-cards-section"
        variants={containerVariants}
      >
        <motion.div
          className="balance-card balance-card-horizontal bg-ter p-3 br-3 interactive-card"
          variants={itemVariants}
          whileHover={{ y: -3, boxShadow: "0 8px 16px -4px rgba(0, 0, 0, 0.15)" }}
        >
          <div className="balance-icon">
            <i className="ri-wallet-3-line"></i>
          </div>
          <div className="balance-info">
            <div className="balance-label">Current Balance</div>
            <div className="balance-value">
              <AnimatedNumber value={user.balance || 0} prefix="$" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="account-number-card bg-ter p-3 br-3"
          variants={itemVariants}
        >
          <div className="account-icon">
            <i className="ri-bank-line"></i>
          </div>
          <div className="account-info">
            <div className="account-label">Account Number</div>
            <div className="account-value font-mono">{user._id?.substring(0, 12)}...</div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="card personal-info-card p-3 mt-3 br-3"
        variants={itemVariants}
        whileHover={{ boxShadow: "0 6px 12px -4px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="info-card-header">
          <h2 className="text-lg text-primary">
            <i className="ri-user-line mr-2"></i>
            Personal Information
          </h2>
        </div>
        <div className="info-grid-mobile">
          <div className="info-row">
            <span className="info-label">Full Name</span>
            <span className="info-value">{user.firstName} {user.lastName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Mobile</span>
            <span className="info-value">{user.phoneNumber}</span>
          </div>
          <div className="info-row">
            <span className="info-label">ID Type</span>
            <span className="info-value">{user.identificationType}</span>
          </div>
          <div className="info-row full-width">
            <span className="info-label">Address</span>
            <span className="info-value">{user.address}</span>
          </div>
        </div>
      </motion.div>

      <EditProfile
        showEditProfile={showEditProfile}
        setShowEditProfile={setShowEditProfile}
      />
    </motion.div>
  )
}

export default Home
