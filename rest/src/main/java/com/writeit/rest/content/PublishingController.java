package com.writeit.rest.content;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/publishing")
public class PublishingController {

    private final DocumentRepository documentRepository;

    public PublishingController(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    @PostMapping("/medium")
    public ResponseEntity<PublishResponse> publishToMedium(@RequestBody MediumPublishRequest request) {
        if (!documentRepository.existsById(request.documentId())) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new PublishResponse(
            "MEDIUM",
            "QUEUED",
            "https://medium.com/@writeit/mock-" + request.documentId(),
            Instant.now().toString()
        ));
    }

    @PostMapping("/kdp")
    public ResponseEntity<PublishResponse> publishToKdp(@RequestBody KdpPublishRequest request) {
        if (!documentRepository.existsById(request.documentId())) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new PublishResponse(
            "KDP",
            "READY_FOR_UPLOAD",
            "https://kdp.amazon.com/en_US/title-setup/mock-" + request.documentId(),
            Instant.now().toString()
        ));
    }

    public record MediumPublishRequest(@NotNull Long documentId, List<String> tags, String canonicalUrl) {}

    public record KdpPublishRequest(@NotNull Long documentId, String description, List<String> keywords,
                                    List<String> categories, String coverUrl) {}

    public record PublishResponse(String channel, String status, String externalUrl, String generatedAt) {}
}
