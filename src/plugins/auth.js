import store from 'storejs';
import { useRouter } from 'vue-router'
import axiosClient from './axiosClient';

export async function checkAuth(reqRole = []) {
    const router = useRouter()

    try {

        const token = store.get('accessToken');
        const id = store.get('userId')

        if (token == undefined) {
            router.push({ name: "Login" })
            return null
        }

        let result = await axiosClient({
            method: 'get',
            timeout: 5000,
            url: "/auth",
            crossDomain: true,
            params: {
                'accessToken': token,
                'userId': id,
            }
        });
        if (result.status == 304 || result.status == 200) {
            const userRole = result.data.userRole
            for (let item of reqRole) {
                if (userRole == item){
                    return null
                }
            }
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
    const router = useRouter()

    try {

        const token = store.get('accessToken');
        const id = store.get('userId')

        if (token == undefined) {
            return null
        }

        let result = await axiosClient({
            method: 'get',
            timeout: 5000,
            crossDomain: true,
            url: "/auth",
            params: {
                'accessToken': token,
                'userId': id
            }
        });
        if (result.status == 200) {
            router.push({
                name: 'Home',
            })
        }

    } catch (error) {
        router.push({ name: "Login" })
    }
}

