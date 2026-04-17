import { axiosInstance } from ".";

// verify receiver account

export const VerifyAccount = async (payload) => {
    try {
        const {data} = await axiosInstance.post('/api/transactions/verify-account',payload)
        return data;
    } catch (error) {
        return error.response.data;
    }
}


// transfer Funds

export const TransferFunds = async(payload) => {
    try {
        const {data} = await axiosInstance.post('/api/transactions/transfer-funds',payload)
        return data;
    } catch (error) {
        return error.response.data;
    }
}


// get all transaction for user
 

export const GetTransactionsOfUser = async() => {

    try {
        const {data} = await axiosInstance.post('/api/transactions/get-all-transactions-by-user')
        return data;
    } catch (error) {
        return error.response.data;
    }
}


// deposite funds using stripe

export const DepositeFunds = async(payload) => {
    try {
        const {data} = await axiosInstance.post('/api/transactions/deposite-funds',payload)
        return data;
    } catch (error) {
        return error.response.data;
    } 
}