package com.writeit.rest.content;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class ChapterController {

    private final ChapterRepository chapterRepository;

    public ChapterController(ChapterRepository chapterRepository) {
        this.chapterRepository = chapterRepository;
    }

    @GetMapping("/documents/{documentId}/chapters")
    public List<Chapter> list(@PathVariable Long documentId) {
        return chapterRepository.findByDocumentIdOrderByPositionAsc(documentId);
    }

    @PostMapping("/documents/{documentId}/chapters")
    public Chapter create(@PathVariable Long documentId, @RequestBody @Valid Chapter chapter) {
        chapter.setId(null);
        chapter.setDocumentId(documentId);
        return chapterRepository.save(chapter);
    }

    @PatchMapping("/documents/{documentId}/chapters/reorder")
    public ResponseEntity<List<Chapter>> reorder(
        @PathVariable Long documentId,
        @RequestBody @Valid List<ChapterReorderItem> reorderItems
    ) {
        List<Chapter> chapters = chapterRepository.findByDocumentIdOrderByPositionAsc(documentId);
        if (chapters.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        for (ChapterReorderItem item : reorderItems) {
            chapters.stream()
                .filter(chapter -> chapter.getId().equals(item.chapterId()))
                .findFirst()
                .ifPresent(chapter -> chapter.setPosition(item.position()));
        }
        return ResponseEntity.ok(chapterRepository.saveAll(chapters));
    }
}
