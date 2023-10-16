import { axiosExpressClient } from '@/plugins/axiosClient';

const baseUrl = '/roles'

export async function fetchRoles(accessToken) {
    try {
        const response = await axiosExpressClient({
            method: 'get',
            timeout: 5000,
            url: "/roles",
            headers: { 'Authorization': accessToken }
        });
        if (response.status === 200) {
            return response.data.roles;
        } else {
            throw new Error('Failed to fetch Roles');
        }
    } catch (error) {
        throw error;
    }
}