import { fetchImageUrl } from "./FileService";

export async function fetchPostHtml(clubId, boardId, postId){
    const parser = new DOMParser();
    const content = '';
    const doc = parser.parseFromString(content, 'text/html');
    const imgTags = doc.querySelectorAll('img');

    for (const img of imgTags) {
        const originalSrc = img.getAttribute('src');
        try {
            const newUrl = await fetchImageUrl(originalSrc);
            img.setAttribute('src', newUrl);
        }
        catch(err){
            console.error('Failed to load image');
        }
    }
    const ret = {id: postId, title: 'title', content: doc.body.innerHTML};
    return ret;
}