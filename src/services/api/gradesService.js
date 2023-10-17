import { axiosExpressClient } from '@/plugins/axiosClient';

const baseUrl = '/grades'

export async function ferchGrades(accessToken) {
    try {
        const response = await axiosExpressClient({
            method: 'get',
            timeout: 5000,
            url: baseUrl + '/',
            headers: { 'Authorization': accessToken },
        });
        if (response.status === 200) {
            return response.data.grades;
        } else {
            throw new Error('Failed to fetch Grades');
        }
    } catch (error) {
        throw error;
    }
}

export async function ferchGradesUser(accessToken, idUser) {
    try {
        const response = await axiosExpressClient({
            method: 'get',
            timeout: 5000,
            url: baseUrl + '/user',
            headers: { 'Authorization': accessToken },
            params: {
                'idUser': idUser
            }
        });
        if (response.status === 200) {
            return response.data.grades;
        } else {
            throw new Error('Failed to fetch Grades');
        }
    } catch (error) {
        throw error;
    }
}

export async function registerGrade(accessToken, year, section, idUser) {
    try {
        const response = await axiosExpressClient({
            method: 'POST',
            timeout: 2000,
            url: baseUrl + "/register",
            headers: { 'Authorization': accessToken },
            data: {
                'year': year,
                'section': section,
                'idUser': idUser,
            }
        });
        if (response.status === 200) {
            return [true, null];
        } else {
            return [false, response.data];
        }
    } catch (error) {
        return [false, error.response.data];
    }
}

export async function updateGrade(accessToken, idGrade, year, section, idUser) {
    try {
        const response = await axiosExpressClient({
            method: 'PUT',
            timeout: 2000,
            url: baseUrl + "/update",
            headers: { 'Authorization': accessToken },
            data: {
                'idGrade': idGrade,
                'year': year,
                'section': section,
                'idUser': idUser,
            }
        });
        if (response.status === 200) {
            return [true, null];
        } else {
            return [false, response.data];
        }
    } catch (error) {
        return [false, error.response.data];
    }
}

export async function deleteGrade(accessToken, idGrade) {
    try {
        const response = await axiosExpressClient({
            method: 'put',
            timeout: 5000,
            url: baseUrl + '/remove',
            headers: { 'Authorization': accessToken },
            params: {
                'idGrade': idGrade,
            }
        });
        if (response.status === 200) {
            return true;
        } else {
            throw new Error('Failed to delete the Grade');
        }
    } catch (error) {
        throw error;
    }
}