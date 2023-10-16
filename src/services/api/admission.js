import { axiosExpressClient } from '@/plugins/axiosClient';
import router from '@/router/index'
import store from 'storejs';

const baseUrl = '/admission'

export async function login(username, password) {
    try {
        let response = await axiosExpressClient({
            method: 'POST',
            timeout: 5000,
            crossDomain: true,
            url: baseUrl + "/login",
            data: {
                'username': username,
                'password': password,
            }
        });
        if (response.status === 200) {
            return [response.data,, null];
        } else {
            return [false, response.data];
        }
    } catch (error) {
        console.log(error);
        return [false, error.response.data];
    }
}

export async function checkAuth(reqRole = []) {

    try {
        const accessToken = store.get('accessToken');
        const id = store.get('userId')

        if (accessToken == undefined) {
            router.push({ name: "Login" })
            return null
        }

        const response = await axiosExpressClient({
            method: 'get',
            timeout: 5000,
            url: baseUrl + "/auth",
            crossDomain: true,
            headers: { 'Authorization': accessToken },
            params: { 'userId': id, }
        });
        if (response.status == 200) {
            const userRole = response.data.userRole
            for (let item of reqRole) { if (userRole == item) { return null } }
            router.push({ name: "Home", forceReload: true })
            return null
        }
    } catch (error) {
        router.push({ name: "Login", forceReload: true })
        console.log(error)
        console.log(error['response']['data']['message'])
    }
}

export async function checkLoged() {
    try {
        const accessToken = store.get('accessToken');
        const id = store.get('userId')

        if (accessToken == undefined) {
            return null
        }

        let response = await axiosExpressClient({
            method: 'get',
            timeout: 5000,
            crossDomain: true,
            url: baseUrl + "/auth",
            headers: { 'Authorization': accessToken },
            params: { 'userId': id }
        });
        if (response.status == 200) {
            router.push({ name: 'Home', })
        }
    } catch (error) {
        store.clear()
        router.push({ name: "Login" })
    }
}

