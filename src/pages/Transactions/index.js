import React, { useEffect } from 'react'
import { message, Table } from 'antd'
import TransferFundsModels from './TransferFundsModels';
import { useDispatch, useSelector } from 'react-redux';
import { HideLoading, ShowLoading } from '../../redux/loadersSlice';
import { GetTransactionsOfUser } from '../../apicalls/transactions';
import moment from 'moment';
import DepositeModel from './DepositeModel';
import { motion } from 'framer-motion';
import { SkeletonTable } from '../../components/SkeletonLoader';

function Transactions() {
  const [data,setData] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const dispatch = useDispatch()
  const {user} = useSelector(state => state.users)
  const [showTransferFundsModel, setShowTransferFundsModel] = React.useState(false)
  const [showDepositeModel, setShowDepositeModel] = React.useState(false)

  const columns = [
    {
      title: "Date",
      dataIndex: 'date',
      render: (text,record) => {
        return <span className="text-muted">{moment(record.createdAt).format("DD-MM-YYYY hh:mm A")}</span>
      }
    },
    {
      title: "Transaction ID",
      dataIndex: '_id',
      render: (text) => <span className="font-mono text-sm">{text.substring(0, 8)}...</span>
    },
    {
      title: "Amount",
      dataIndex: 'amount',
      render: (text, record) => {
        const isCredit = record.sender._id !== user._id && record.type !== 'Deposit';
        return (
          <motion.span
            className={`font-bold ${isCredit ? 'text-success' : 'text-danger'}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            {isCredit ? '+' : '-'}${text}
          </motion.span>
        )
      }
    },
    {
      title: "Type",
      dataIndex: 'type',
      render: (text,record) => {
        let badgeClass = 'transaction-deposit';
        let label = 'Deposit';

        if(record.sender._id !== record.receiver._id){
          if(record.sender._id === user._id) {
            badgeClass = 'transaction-debit';
            label = 'Debit';
          } else {
            badgeClass = 'transaction-credit';
            label = 'Credit';
          }
        }
        return <span className={`status-badge ${badgeClass}`}>{label}</span>
      }
    },
    {
      title: "Reference Account",
      dataIndex: '',
      render: (text,record) => {
        const name = record.sender._id === user._id
          ? `${record.receiver.firstName} ${record.receiver.lastName}`
          : `${record.sender.firstName} ${record.sender.lastName}`;
        return (
          <div className="flex align-center gap-2">
            <motion.div
              className="avatar-circle bg-primary flex align-center justify-center text-white"
              whileHover={{ scale: 1.1 }}
            >
              {name.charAt(0).toUpperCase()}
            </motion.div>
            <span className="text-sm font-medium">{name}</span>
          </div>
        )
      }
    },
    {
      title: "Reference",
      dataIndex: 'reference',
      render: (text) => <span className="text-muted">{text}</span>
    },
    {
      title: "Status",
      dataIndex: 'status',
      render: (text) => {
        let badgeClass = 'status-pending';
        if(text === 'Success' || text === 'Completed') badgeClass = 'status-success';
        if(text === 'Failed') badgeClass = 'status-error';
        return (
          <motion.span
            className={`status-badge ${badgeClass}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            {text}
          </motion.span>
        )
      }
    },
  ]

  const getData = async() => {
    try {
      dispatch(ShowLoading())
      setLoading(true)
      const response = await GetTransactionsOfUser()
      if(response.success){
        setData(response.data)
      }
      dispatch(HideLoading())
      setLoading(false)
    } catch (error) {
      dispatch(HideLoading())
      setLoading(false)
      message.error(error.message)
    }
  }

  useEffect(()=>{
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
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
      <motion.div className="transactions-header flex justify-between items-center mb-4" variants={itemVariants}>
        <div>
          <motion.h1
            className="text-2xl text-primary"
            whileHover={{ x: 2 }}
          >
            Transactions
          </motion.h1>
          <p className="text-secondary text-sm">View and manage your transactions</p>
        </div>

        <motion.div className="flex gap-2" variants={itemVariants}>
          <motion.button
            className="primary-outlined-btn"
            onClick={() => setShowDepositeModel(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <i className="ri-download-line mr-2"></i>Deposit
          </motion.button>
          <motion.button
            className="primary-contained-btn"
            onClick={()=> setShowTransferFundsModel(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <i className="ri-exchange-dollar-line mr-2"></i>Transfer
          </motion.button>
        </motion.div>
      </motion.div>

      {loading ? (
        <motion.div variants={itemVariants}>
          <SkeletonTable rows={5} />
        </motion.div>
      ) : (
        <motion.div variants={itemVariants}>
          <Table
            columns={columns}
            dataSource={data}
            className='mt-2'
            pagination={{ pageSize: 10 }}
            rowKey="_id"
            rowClassName={(record, index) => `stagger-item`}
          />
        </motion.div>
      )}

      {showTransferFundsModel && <TransferFundsModels
        setShowTransferFundsModel={setShowTransferFundsModel}
        showTransferFundsModel={showTransferFundsModel}
        reloadData={getData}
      />}
      {showDepositeModel && <DepositeModel
        showDepositeModal={showDepositeModel}
        setShowDepositeModal={setShowDepositeModel}
        reloadData={getData}
      />}
    </motion.div>
  )
}

export default Transactions
