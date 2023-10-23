import { axiosFlaskClient} from '@/plugins/axiosClient';

const baseUrl = '/recog'

export async function pushPhotos(accessToken,images, idStud) {
    try {
        const response = await axiosFlaskClient({
            method: 'POST',
            timeout: 2000,
            url: baseUrl + "/registerAi",
            headers: { 'Authorization': accessToken },
            data: {
                'images': images, // Send the array of image sources
                'idStud': idStud
            }
        });
        if (response.status === 200) {
            return [true, null];
        } else {
            return [false, response.data];
        }
    } catch (error) {
        return [false, error.response.data];
    }
}


