
export const FILE_API = {
    UPLOAD_FILE: (club_id)=>"/upload/"+club_id,
    DOWNLOAD_FILE: (club_id, filename)=>"/download/"+club_id+"/"+filename,
}