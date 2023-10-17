import { axiosExpressClient } from '@/plugins/axiosClient';

const baseUrl = '/attendances'

export async function fetchAttendances(accessToken, idGrade, currentDate) {


    try {
        const response = await axiosExpressClient({
            method: 'get',
            timeout: 5000,
            url: baseUrl + '/',
            headers: { 'Authorization': accessToken },
            params: {
                'idGrade': idGrade,
                'attDate': currentDate
            }
        });
        if (response.status === 200) {
            const attendances = response.data.attendances

            for (const row in attendances) {
                const arrival = attendances[row].arrival
                const imgBuffer = attendances[row].img_encoded
                const present = attendances[row].present

                if (imgBuffer != null) {
                    attendances[row].img_encoded = Buffer.from(imgBuffer).toString('base64')
                }
                if (arrival != null) {
                    const words = arrival.split(':');
                    attendances[row].arrival = words[0] + ":" + words[1]
                }
                if (present == null) {
                    attendances[row].present = false
                    attendances[row].late = false
                }
            }
            return attendances;
        } else {
            throw new Error('Failed to fetch Msgs');
        }
    } catch (error) {
        throw error;
    }
}

export async function updateAttendance(accessToken, idAtt, idStud, attDate, arrival, present, late, observation) {
    try {
        const response = await axiosExpressClient({
            method: 'put',
            timeout: 5000,
            url: baseUrl + '/update',
            headers: { 'Authorization': accessToken },
            data: {
                'idAtt': idAtt,
                'idStud': idStud,
                'attDate': attDate,
                'arrival': arrival,
                'present': present,
                'late': late,
                'observation': observation
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