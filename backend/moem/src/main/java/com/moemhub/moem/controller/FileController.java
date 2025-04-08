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
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file, @PathVariable Long clubID) {
        if(file.isEmpty()){
            return ResponseEntity.badRequest().body("file is empty");
        }
        try {
            String fileName = fileService.upload(file, clubID);
            return ResponseEntity.ok("/files/download/"+clubID+"/"+ fileName);
        }
        catch (IOException e) {
            return ResponseEntity.internalServerError().body("IO error");
        }
    }

    @GetMapping("/download/{clubID}/{fileName}")
    public ResponseEntity<Resource> download(@PathVariable Long clubID, @PathVariable String fileName) throws IOException {
        System.out.println("come here");
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
}
