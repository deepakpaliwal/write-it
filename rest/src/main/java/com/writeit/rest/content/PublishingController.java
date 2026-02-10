package com.writeit.rest.content;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
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

    @PostMapping("/write-it")
    public ResponseEntity<PublishResponse> publishToWriteIt(@RequestBody WriteItPublishRequest request) {
        return documentRepository.findById(request.documentId())
            .map(document -> {
                String slug = toSlug(document.getTitle(), document.getId());
                document.setPublishedToWriteIt(true);
                document.setWriteItSlug(slug);
                document.setPublishedAt(Instant.now());
                documentRepository.save(document);
                return ResponseEntity.ok(new PublishResponse(
                    "WRITE_IT",
                    "PUBLISHED",
                    "/blog/" + slug,
                    document.getPublishedAt().toString()
                ));
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private String toSlug(String title, Long id) {
        String base = (title == null ? "post" : title)
            .toLowerCase(Locale.ROOT)
            .replaceAll("[^a-z0-9]+", "-")
            .replaceAll("(^-|-$)", "");
        if (base.isBlank()) {
            base = "post";
        }
        return base + "-" + id;
    }

    public record MediumPublishRequest(@NotNull Long documentId, List<String> tags, String canonicalUrl) {}

    public record KdpPublishRequest(@NotNull Long documentId, String description, List<String> keywords,
                                    List<String> categories, String coverUrl) {}

    public record WriteItPublishRequest(@NotNull Long documentId) {}

    public record PublishResponse(String channel, String status, String externalUrl, String generatedAt) {}
}
