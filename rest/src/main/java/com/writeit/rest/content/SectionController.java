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
@RequestMapping("/api/v1")
public class SectionController {

    private final SectionRepository sectionRepository;

    public SectionController(SectionRepository sectionRepository) {
        this.sectionRepository = sectionRepository;
    }

    @GetMapping("/chapters/{chapterId}/sections")
    public List<Section> list(@PathVariable("chapterId") Long chapterId) {
        return sectionRepository.findByChapterIdOrderByPositionAsc(chapterId);
    }

    @PostMapping("/chapters/{chapterId}/sections")
    public Section create(@PathVariable("chapterId") Long chapterId, @RequestBody @Valid Section section) {
        section.setId(null);
        section.setChapterId(chapterId);
        return sectionRepository.save(section);
    }
}
