package com.writeit.rest.content;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/snippets")
public class SnippetController {

    private final SnippetRepository snippetRepository;

    public SnippetController(SnippetRepository snippetRepository) {
        this.snippetRepository = snippetRepository;
    }

    @GetMapping
    public List<Snippet> list(@RequestParam("userId") Long userId) {
        return snippetRepository.findByUserIdOrderByIdDesc(userId);
    }

    @PostMapping
    public Snippet create(@RequestBody @Valid Snippet snippet) {
        snippet.setId(null);
        return snippetRepository.save(snippet);
    }

    @PostMapping("/{snippetId}/drop-in/{documentId}")
    public String dropIntoDocument(@PathVariable("snippetId") Long snippetId, @PathVariable("documentId") Long documentId) {
        return "Snippet " + snippetId + " is ready to be inserted into document " + documentId;
    }
}
