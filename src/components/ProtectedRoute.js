import React, { useEffect } from 'react'
import {message} from 'antd'
import { GetUserInfo } from '../apicalls/Users'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { SetUser } from '../redux/usersSlice'
import DefaultLayout from './DefaultLayout'

function ProtectedRoute(props) {
  const {user} = useSelector(state=>state.users)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const getData = async () =>{
    try {
      const response = await GetUserInfo()
      if(response.success){
        dispatch(SetUser(response.data))
      }else if(response.message && response.message.toLowerCase().includes('expired')){
        localStorage.removeItem('token')
        message.error('Session expired, please login again')
        navigate('/login')
      }else{
        localStorage.removeItem('token')
        message.error(response.message)
        navigate('/login')
      }
    } catch (error) {
      localStorage.removeItem('token')
      navigate('/login')
      message.error(error.message || 'Session expired, please login again')
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if(token){
      if(!user){
        getData()
      }
    }else{
      navigate("/login")
    }
  }, [])

  return user && <div>
      <DefaultLayout>
        {props.children}
      </DefaultLayout>
    </div>

}

export default ProtectedRoute