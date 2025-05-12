package com.moemhub.moem.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class FileService {
    @Value("${file.path}")
    private String fileDir;

    public String upload(MultipartFile file, Long clubID) throws IOException {
        Path path = Path.of(fileDir, clubID.toString());
        if(!Files.exists(path)) {
            Files.createDirectories(path);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String filename = UUID.randomUUID().toString() + extension;
        Path uploadPath = Path.of(fileDir, clubID.toString(), filename);
        file.transferTo(uploadPath);

        return filename;
    }

    public Resource download(Long clubID, String fileName) throws IOException {
        Path path = Path.of(fileDir, clubID.toString(), fileName);
        if(!Files.exists(path)){
            return null;
        }
        return new UrlResource(path.toUri());
    }
    
    public String uploadProfile(MultipartFile file) throws IOException {
        Path path = Path.of(fileDir, "profile");
        if(!Files.exists(path)) {
            Files.createDirectories(path);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String filename = UUID.randomUUID().toString() + extension;
        Path uploadPath = Path.of(fileDir, "profile", filename);
        file.transferTo(uploadPath);

        return filename;
    }

    public Resource downloadProfile(String fileName) throws IOException {
        Path path = Path.of(fileDir, "profile", fileName);
        if(!Files.exists(path)){
            return null;
        }
        return new UrlResource(path.toUri());
    }
}
