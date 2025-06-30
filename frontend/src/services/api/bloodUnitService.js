import { data } from 'react-router';
import AxiosClient from './axiosClient';

// add volume of donate request
export const addBloodUnit = async (data) => {
    try{
        const response = await AxiosClient.post('/bloodUnit', data);
        return response
    }catch (error) {
        console.error(
            error?.response?.message || 'Error adding blood unit'
        );
        throw error;
    }
}