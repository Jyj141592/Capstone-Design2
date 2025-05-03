
export const FILE_API = {
    UPLOAD_FILE: (club_id)=>"/files/upload/"+club_id,
    DOWNLOAD_FILE: (club_id, filename)=>"files/download/"+club_id+"/"+filename,
}