package com.writeit.rest.content;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/blog")
public class WriteItBlogController {

    private final DocumentRepository documentRepository;

    public WriteItBlogController(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    @GetMapping("/posts")
    public List<Document> listPublishedPosts() {
        return documentRepository.findByPublishedToWriteItTrueOrderByPublishedAtDesc();
    }

    @GetMapping("/posts/{slug}")
    public ResponseEntity<Document> getPostBySlug(@PathVariable("slug") String slug) {
        return documentRepository.findByWriteItSlugAndPublishedToWriteItTrue(slug)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
