import { axiosExpressClient } from '@/plugins/axiosClient';

const baseUrl = '/students'

export async function fetchStudents(accessToken, idGrade) {
    try {
        const response = await axiosExpressClient({
            method: 'get',
            timeout: 5000,
            url: baseUrl + '/',
            headers: { 'Authorization': accessToken },
            params: {
                'idGrade': idGrade
            }
        });
        if (response.status === 200) {
            return response.data.students;
        } else {
            throw new Error('Failed to fetch Students');
        }
    } catch (error) {
        throw error;
    }
}

export async function registerStudent(accessToken, values) {
    try {
        const response = await axiosExpressClient({
            method: 'POST',
            timeout: 5000,
            url: baseUrl + '/register',
            headers: { 'Authorization': accessToken },
            data: {
                'accessToken': accessToken,
                'school_number': values.ledger,
                'firstName': values.firstName,
                'lastName': values.lastName,
                'dni': values.dni,
                'email': values.email,
                'idGrade': values.select,
            }
        });
        if (response.status === 200) {
            return [true, null];
        } else {
            return [false, response.data];
        }
    } catch (error) {
        console.log(error);
        return [false, error.response.data];
    }
}

export async function deleteMsg(accessToken, idStudent) {
    try {
        const response = await axiosExpressClient({
            method: 'put',
            timeout: 5000,
            url: baseUrl + '/remove',
            headers: { 'Authorization': accessToken },
            params: {
                'idStudent': idStudent,
            }
        });
        if (response.status === 200) {
            return true;
        } else {
            throw new Error('Failed to delete the Msg');
        }
    } catch (error) {
        throw error;
    }
}