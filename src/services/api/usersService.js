import { axiosExpressClient } from '@/plugins/axiosClient';
import { capitalizeFirstLetter } from '@/services/utils'

const baseUrl = '/users'

export async function fetchUsers(accessToken) {
    try {
        const response = await axiosExpressClient({
            method: 'get',
            timeout: 5000,
            url: baseUrl + "/",
            headers: { 'Authorization': accessToken }
        });
        if (response.status === 200) {
            return response.data.users;
        } else {
            throw new Error('Failed to fetch Users');
        }
    } catch (error) {
        throw error;
    }
}

export async function fetchUsersRole(accessToken, role) {
    try {
        const response = await axiosExpressClient({
            method: 'get',
            timeout: 5000,
            url: baseUrl + "/role",
            headers: { 'Authorization': accessToken },
            params: {
                'role': role,
            }
        });
        if (response.status === 200) {
            return response.data.userRoles;
        } else {
            throw new Error('Failed to fetch of role' + role);
        }
    } catch (error) {
        throw error;
    }
}

export async function changeState(accessToken, idUser, status) {
    try {
        const response = await axiosExpressClient({
            method: 'put',
            timeout: 5000,
            url: baseUrl + '/state',
            headers: { 'Authorization': accessToken },
            params: {
                'idUser': idUser,
                'status': status,
            }
        });
        if (response.status === 200) {
            return true;
        } else {
            throw new Error('Failed to Change State');
        }
    } catch (error) {
        throw error;
    }
}

export async function registerUser(accessToken, values) {
    try {
        const response = await axiosExpressClient({
            method: 'post',
            timeout: 5000,
            url: baseUrl + "/register",
            headers: { 'Authorization': accessToken },
            data: {
                'firstName': capitalizeFirstLetter(values.firstName),
                'lastName': capitalizeFirstLetter(values.lastName),
                'dni': values.dni,
                'email': values.email,
                'username': values.username,
                'password': values.password,
                'role': values.select,
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
export async function updateUser(accessToken, idUser, values) {
    try {
        const response = await axiosExpressClient({
            method: 'put',
            timeout: 5000,
            url: baseUrl + "/update",
            headers: { 'Authorization': accessToken },
            data: {
                'idUser': idUser,
                'firstName': capitalizeFirstLetter(values.firstName),
                'lastName': capitalizeFirstLetter(values.lastName),
                'dni': values.dni,
                'email': values.email,
                'username': values.username,
                'password': values.password,
                'role': values.select,
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

export async function deleteUser(accessToken, idUser) {
    try {
        const response = await axiosExpressClient({
            method: 'DELETE',
            timeout: 5000,
            url: baseUrl + '/remove',
            headers: { 'Authorization': accessToken },
            params: {
                'idUser': idUser,
            }
        });
        if (response.status === 200) {
            return true;
        } else {
            throw new Error('Failed to delete the User');
        }
    } catch (error) {
        throw error;
    }
}