import { apiClient } from "../api/ApiClient";
import { FILE_API } from "../api/FileApi";

export async function fetchImageUrl(clubId, fileName){
    try {
        const response = await apiClient.get(FILE_API.DOWNLOAD_FILE(clubId, fileName), {
            responseType: 'blob'
        });

        const contentType = response.headers['content-type'] || 'image/png';
        const blob = new Blob([response.data], { type: contentType });
        const url = URL.createObjectURL(blob);
        return url;
    } catch (error) {
        console.error('이미지 다운로드 실패:', error);
        return null;
    }
}

export async function fetchProfileImageUrl(fileName){
    try {
        const response = await apiClient.get(FILE_API.DOWNLOAD_PROFILE(fileName), {
            responseType: 'blob'
        });

        const contentType = response.headers['content-type'] || 'image/png';
        const blob = new Blob([response.data], { type: contentType });
        const url = URL.createObjectURL(blob);
        return url;
    } catch (error) {
        console.error('이미지 다운로드 실패:', error);
        return null;
    }
}

export async function fetchActivityImage(clubId, filename){
    try {
        const response = await apiClient.get(FILE_API.DOWNLOAD_ACTIVITY_IMAGE(clubId, filename), {
            responseType: 'blob'
        });

        const contentType = response.headers['content-type'] || 'image/png';
        const blob = new Blob([response.data], { type: contentType });
        const url = URL.createObjectURL(blob);
        return url;
    } catch (error) {
        console.error('이미지 다운로드 실패:', error);
        return null;
    }
}

export async function uploadImage(clubId, formData){
    try{
        const response = await apiClient.post(FILE_API.UPLOAD_FILE(clubId), formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
    catch (error) {
        console.error('이미지 업로드 실패: ', error);
        return null;
    }
}

export async function uploadProfileImage(formData){
    try{
        const response = await apiClient.post(FILE_API.UPLOAD_PROFILE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
    catch (error) {
        console.error('이미지 업로드 실패: ', error);
        return null;
    }
}