package com.moemhub.moem.controller;

import com.moemhub.moem.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileController {
    private final FileService fileService;

    @PostMapping("/upload/{clubID}")
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file, @PathVariable(name="clubID") Long clubID) {
        if(file.isEmpty()){
            return ResponseEntity.badRequest().body("file is empty");
        }
        try {
            String fileName = fileService.upload(file, clubID);
            return ResponseEntity.ok(fileName);
        }
        catch (IOException e) {
            return ResponseEntity.internalServerError().body("IO error");
        }
    }

    @GetMapping("/download/{clubID}/{fileName}")
    public ResponseEntity<Resource> download(@PathVariable(name="clubID") Long clubID, @PathVariable(name="fileName") String fileName) throws IOException {
        try{
            Resource resource = fileService.download(clubID, fileName);
            if(resource == null){
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok().body(resource);
        }
        catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/upload/profile")
    public ResponseEntity<String> uploadProfile(@RequestParam("file") MultipartFile file) {
        if(file.isEmpty()){
            return ResponseEntity.badRequest().body("file is empty");
        }
        try {
            String fileName = fileService.uploadProfile(file);
            return ResponseEntity.ok(fileName);
        }
        catch (IOException e) {
            return ResponseEntity.internalServerError().body("IO error");
        }
    }
    @GetMapping("/download/profile/{fileName}")
    public ResponseEntity<Resource> downloadProfile(@PathVariable(name="fileName") String fileName) throws IOException {
        try{
            Resource resource = fileService.downloadProfile(fileName);
            if(resource == null){
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok().body(resource);
        }
        catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    @GetMapping("/download/{clubID}/activity/{fileName}")
    public ResponseEntity<Resource> downloadActivityImage(@PathVariable(name="clubID") Long clubID, @PathVariable(name="fileName") String fileName) throws IOException {
    		return download(clubID, fileName);
    }
}
