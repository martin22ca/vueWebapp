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
            const rollCall = response.data.rollCall

            return [attendances, rollCall];
        } else {
            throw new Error('Failed to fetch Msgs');
        }
    } catch (error) {
        throw error;
    }
}

export async function updateAttendance(accessToken, idAtt, arrival, present, late, observation) {
    try {
        const response = await axiosExpressClient({
            method: 'put',
            timeout: 5000,
            url: baseUrl + '/update',
            headers: { 'Authorization': accessToken },
            data: {
                'idAtt': idAtt,
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

export async function closeAttendance(accessToken, idRoll, idUser, observation) {
    try {
        const response = await axiosExpressClient({
            method: 'put',
            timeout: 5000,
            url: baseUrl + '/close',
            headers: { 'Authorization': accessToken },
            params: {
                'idRoll': idRoll,
                'idUser': idUser,
                'observation': observation
            }
        });
        if (response.status === 200) {
            return response.data.newRoll
        } else {
            throw new Error('Failed to get grade Status');
        }
    } catch (error) {
        throw error;
    }
}