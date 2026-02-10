package com.writeit.rest.content;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/documents/{documentId}/media")
public class MediaController {

    private final MediaFileRepository mediaFileRepository;

    public MediaController(MediaFileRepository mediaFileRepository) {
        this.mediaFileRepository = mediaFileRepository;
    }

    @GetMapping
    public List<MediaFile> list(@PathVariable Long documentId) {
        return mediaFileRepository.findByDocumentId(documentId);
    }

    @PostMapping
    public MediaFile add(@PathVariable Long documentId, @RequestBody @Valid MediaFile mediaFile) {
        mediaFile.setId(null);
        mediaFile.setDocumentId(documentId);
        return mediaFileRepository.save(mediaFile);
    }
}
