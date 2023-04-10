import store from 'storejs';
import { useRouter } from 'vue-router'
import axios from 'axios'

export async function checkAuth() {
    const router = useRouter()

    try {

        const token = store.get('accessToken');
        const id = store.get('userId')

        if (token == undefined) {
            router.push({ name: "Login" })
            return null
        }

        let result = await axios({
            method: 'get',
            timeout: 2000,
            url: "http://192.168.0.62:3001/auth",
            params: {
                'accessToken': token,
                'userId': id
            }
        });
        if (result.status == 304 || result.status == 200 ) {
            return null
        }
        

    } catch (error) {
        router.push({ name: "Login" ,forceReload: true})
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

        let result = await axios({
            method: 'get',
            timeout: 2000,
            url: "http://192.168.0.62:3001/auth",
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

