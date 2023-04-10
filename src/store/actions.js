import axios from 'axios'

export async function checkAuth({ state }) {

    try {
        if (state.accessToken == "") {
            return false
        }

        let result = await axios({
            method: 'get',
            timeout: 2000,
            url: "http://" + state.serverIp + "/auth",
            params: {
                'accessToken': state.accessToken,
                'userId': state.id
            }
        });
        if (result.status == 304 || result.status == 200) {
            return true
        }

    } catch (error) {
        console.log(error['response']['data']['message'])
        return false
    }

}

export async function logIn({ commit, state }, values) {

    try {
        const result = await axios.post('http://' + state.serverIp + '/login', {
            username: values[0],
            password: values[1],
        });

        console.log(result);
        if (result.status == 200) {
            commit('setLoginInfo', {
                id: result.data.userId,
                firstName: result.data.first_name,
                lastName: result.data.last_name,
                accessToken: result.data.accessToken,
                role: result.data.role
            })
            return true
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function fetchMessages({ state }) {

    try {
        let result = await axios({
            method: 'get',
            timeout: 2000,
            url: "http://"+state.serverIp+"/messages",
            params: {
                'accessToken': state.accessToken,
                'userId': state.id
            }
        })
        if (result.status == 200)
            return result.data.messages;
    } catch (error) {
        console.log(error)
        return []
    }
}

