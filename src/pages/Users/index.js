import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageTitle from '../../components/PageTitle';
import { HideLoading, ShowLoading } from '../../redux/loadersSlice';
import { message, Table } from 'antd';
import { GetAllUsers } from '../../apicalls/Users';

const Users = () => {
  const [data, setUsers] = React.useState([]);
  const dispatch = useDispatch();

  const columns = [
    {
      title: "User",
      dataIndex: 'firstName',
      render: (text, record) => (
        <div className="flex align-center gap-2">
          <div className="avatar-circle bg-primary flex align-center justify-center text-white">
            {record.firstName?.charAt(0)}{record.lastName?.charAt(0)}
          </div>
          <div>
            <div className="font-medium">{record.firstName} {record.lastName}</div>
            <div className="text-sm text-muted">{record.email}</div>
          </div>
        </div>
      )
    },
    {
      title: "Mobile",
      dataIndex: 'phoneNumber',
      render: (text) => <span className="font-mono">{text}</span>
    },
    {
      title: "Role",
      dataIndex: 'isAdmin',
      render: (isAdmin) => (
        <span className={`status-badge ${isAdmin ? 'status-success' : 'status-pending'}`}>
          {isAdmin ? 'Admin' : 'User'}
        </span>
      )
    },
  ];

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllUsers();
      dispatch(HideLoading());
      if (response.success) {
        setUsers(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl text-primary">Users Management</h1>
        <p className="text-secondary text-sm">View and manage all registered users</p>
      </div>
      <Table columns={columns} dataSource={data} className='mt-2' pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default Users;
