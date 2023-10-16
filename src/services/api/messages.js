import { axiosExpressClient } from '@/plugins/axiosClient';

const baseUrl = '/messages'

export async function fetchMessages(accessToken, idUser) {
    try {
        const response = await axiosExpressClient({
            method: 'get',
            timeout: 5000,
            url: baseUrl + '',
            headers: { 'Authorization': accessToken },
            params: {
                'idUser': idUser
            }
        });
        if (response.status === 200) {
            return response.data.messages;
        } else {
            throw new Error('Failed to fetch Msgs');
        }
    } catch (error) {
        throw error;
    }
}

export async function markAsRead(accessToken, idMessage, idUser) {
    try {
        const response = await axiosExpressClient({
            method: 'put',
            timeout: 5000,
            url: baseUrl + '/viewd',
            headers: { 'Authorization': accessToken },
            params: {
                'idMessage': idMessage,
                'idUser': idUser,
            }
        });
        if (response.status === 200) {
            return true;
        } else {
            throw new Error('Failed to read Msgs');
        }
    } catch (error) {
        throw error;
    }
}

export async function deleteMsg(accessToken, idMessage, idUser) {
    try {
        const response = await axiosExpressClient({
            method: 'put',
            timeout: 5000,
            url: baseUrl + '/remove',
            headers: { 'Authorization': accessToken },
            params: {
                'idMessage': idMessage,
                'idUser': idUser,
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