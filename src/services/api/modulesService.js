import { axiosExpressClient } from '@/plugins/axiosClient';

const baseUrl = '/modules'

export async function fetchModules(accessToken) {
    try {
        let response = await axiosExpressClient({
            method: 'get',
            timeout: 5000,
            url: baseUrl + "/",
            headers: { 'Authorization': accessToken },
        });
        if (response.status === 200) {
            return response.data.modules;
        } else {
            throw new Error('Failed to fetch Ai Modules');
        }
    } catch (error) {
        throw error
    }
}

export async function moduleStatus(accessToken, ip) {

    try {
        const response = await axiosExpressClient({
            method: 'get',
            timeout: 2000,
            url: baseUrl + "/status",
            headers: { 'Authorization': accessToken },
            params: {
                'clientIp': ip
            }
        });
        if (response.status == 200) {
            const installed = response.data.daemonInstalled;
            const working = response.data.daemonWorking;
            return [installed, working]
        }
        else {
            throw new Error('Failed to fetch Ai Status');
        }
    } catch (error) {
        throw error
    }
}
