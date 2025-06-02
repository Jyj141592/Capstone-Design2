
export const FILE_API = {
    UPLOAD_FILE: (club_id)=>"/files/upload/"+club_id,
    DOWNLOAD_FILE: (club_id, filename)=>"/files/download/"+club_id+"/"+filename,
    UPLOAD_PROFILE: "/files/upload/profile",
    DOWNLOAD_PROFILE: (filename)=>"/files/download/profile/"+filename,
    DOWNLOAD_ACTIVITY_IMAGE: (club_id, filename)=>`/files/download/${club_id}/activity/${filename}`
}