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
    >
      <motion.div className="welcome-section mb-4" variants={itemVariants}>
        <div className="flex justify-between items-center">
          <div>
            <motion.h1
              className="text-2xl text-primary mb-1"
              whileHover={{ scale: 1.01 }}
            >
              Welcome back, {user.firstName}!
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
            Edit Profile
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="account-cards-grid"
        variants={containerVariants}
      >
        <motion.div
          className="balance-card bg-ter p-4 br-3 interactive-card"
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 12px 24px -8px rgba(0, 0, 0, 0.2)" }}
        >
          <div className="card-label text-white text-sm opacity-80">Account Number</div>
          <div className="card-value text-white font-mono text-sm">{user._id}</div>
        </motion.div>
        <motion.div
          className="balance-card bg-ter p-4 br-3 interactive-card"
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 12px 24px -8px rgba(0, 0, 0, 0.2)" }}
        >
          <div className="card-label text-white text-sm opacity-80">Current Balance</div>
          <div className="card-value text-white text-3xl font-bold">
            <AnimatedNumber value={user.balance || 0} prefix="$" />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="card p-4 mt-4 br-3"
        variants={itemVariants}
        whileHover={{ boxShadow: "0 8px 16px -4px rgba(0, 0, 0, 0.1)" }}
      >
        <h2 className="text-lg text-primary mb-4 pb-2 border-bottom">Personal Information</h2>
        <motion.div
          className="info-grid"
          variants={containerVariants}
        >
          <motion.div className="info-item" variants={itemVariants}>
            <label className="info-label">First Name</label>
            <span className="info-value">{user.firstName}</span>
          </motion.div>
          <motion.div className="info-item" variants={itemVariants}>
            <label className="info-label">Last Name</label>
            <span className="info-value">{user.lastName}</span>
          </motion.div>
          <motion.div className="info-item" variants={itemVariants}>
            <label className="info-label">Email</label>
            <span className="info-value">{user.email}</span>
          </motion.div>
          <motion.div className="info-item" variants={itemVariants}>
            <label className="info-label">Mobile</label>
            <span className="info-value">{user.phoneNumber}</span>
          </motion.div>
          <motion.div className="info-item" variants={itemVariants}>
            <label className="info-label">Identification Type</label>
            <span className="info-value">{user.identificationType}</span>
          </motion.div>
          <motion.div className="info-item" variants={itemVariants}>
            <label className="info-label">Identification Number</label>
            <span className="info-value">{user.identificationNumber}</span>
          </motion.div>
          <motion.div className="info-item full-width" variants={itemVariants}>
            <label className="info-label">Address</label>
            <span className="info-value">{user.address}</span>
          </motion.div>
        </motion.div>
      </motion.div>

      <EditProfile
        showEditProfile={showEditProfile}
        setShowEditProfile={setShowEditProfile}
      />
    </motion.div>
  )
}

export default Home
