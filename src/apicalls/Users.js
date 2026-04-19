import { axiosInstance } from ".";

// login user 
export const LoginUser = async (payload) =>{
    try {
        const {data} = await axiosInstance.post('/api/users/login',payload);
        return data
    } catch (error) {
        return error.response.data;
    }
}


// register user

export const RegisterUser = async (payload) =>{
    try {
        const {data} = await axiosInstance.post('/api/users/register',payload);
        return data
    } catch (error) {
        return error.response.data;
    }
}


// get user info

export const GetUserInfo = async () =>{
    try {
        const { data } = await axiosInstance.post("/api/users/get-user-info");
        return data
    } catch (error) {
        return error.response.data   
    }
}


// get all users

export const GetAllUsers = async() => {
    try {
        const { data } =await axiosInstance.post("/api/users/get-all-users")
        return data
    } catch (error) {
        return error.response.data;
    }
}

// search users by name, email, or phone
export const SearchUsers = async(query) => {
    try {
        const { data } = await axiosInstance.post("/api/users/search-users", { query });
        return data
    } catch (error) {
        return error.response.data;
    }
}

// update user profile
export const UpdateProfile = async(payload) => {
    try {
        const { data } = await axiosInstance.post("/api/users/update-profile", payload);
        return data
    } catch (error) {
        return error.response.data;
    }
}

// update user password
export const UpdatePassword = async(payload) => {
    try {
        const { data } = await axiosInstance.post("/api/users/update-password", payload);
        return data
    } catch (error) {
        return error.response.data;
    }
}