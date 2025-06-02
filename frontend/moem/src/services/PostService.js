import { fetchImageUrl, fetchActivityImage } from "./FileService";
import { apiClient } from "../api/ApiClient";
import { CLUB_API } from "../api/ClubApi";

export async function fetchPostHtml(clubId, boardId, postId){
    const parser = new DOMParser();
    const response = await apiClient.get(CLUB_API.FETCH_POST(clubId, boardId, postId));

    const content = response.data;
    const doc = parser.parseFromString(content.content, 'text/html');
    const imgTags = doc.querySelectorAll('img');

    for (const img of imgTags) {
        const originalSrc = img.getAttribute('src');
        try {
            const newUrl = await fetchImageUrl(clubId, originalSrc);
            img.setAttribute('src', newUrl);
        }
        catch(err){
            console.error('Failed to load image');
        }
    }
    content.content = doc.body.innerHTML;
    return content;
}

export async function fetchActivityPostHtml(clubId, postId){
    const parser = new DOMParser();
    const response = await apiClient.get(CLUB_API.FETCH_ACTIVITY_POST(clubId, postId));

    const content = response.data;
    const doc = parser.parseFromString(content.content, 'text/html');
    const imgTags = doc.querySelectorAll('img');

    for (const img of imgTags) {
        const originalSrc = img.getAttribute('src');
        try {
            const newUrl = await fetchActivityImage(clubId, originalSrc);
            img.setAttribute('src', newUrl);
        }
        catch(err){
            console.error('Failed to load image');
        }
    }
    content.content = doc.body.innerHTML;
    return content;
}