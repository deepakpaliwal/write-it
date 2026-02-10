package com.writeit.rest.content;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/documents")
public class DocumentExportController {

    private final DocumentRepository documentRepository;

    public DocumentExportController(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    @GetMapping("/{id}/export")
    public ResponseEntity<ExportResponse> export(@PathVariable("id") Long id, @RequestParam("format") ExportFormat format) {
        return documentRepository.findById(id)
            .map(document -> ResponseEntity.ok(buildResponse(document, format)))
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private ExportResponse buildResponse(Document document, ExportFormat format) {
        String safeTitle = document.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-");
        String content = document.getContent() == null ? "" : document.getContent();
        return switch (format) {
            case MARKDOWN -> new ExportResponse(
                safeTitle + ".md",
                "text/markdown",
                Base64.getEncoder().encodeToString(("# " + document.getTitle() + "\n\n" + content).getBytes(StandardCharsets.UTF_8))
            );
            case HTML -> new ExportResponse(
                safeTitle + ".html",
                "text/html",
                Base64.getEncoder().encodeToString(("<h1>" + document.getTitle() + "</h1>" + content).getBytes(StandardCharsets.UTF_8))
            );
            case PDF -> new ExportResponse(
                safeTitle + ".pdf",
                "application/pdf",
                Base64.getEncoder().encodeToString(("PDF export placeholder for: " + document.getTitle()).getBytes(StandardCharsets.UTF_8))
            );
            case EPUB -> new ExportResponse(
                safeTitle + ".epub",
                "application/epub+zip",
                Base64.getEncoder().encodeToString(("EPUB export placeholder for: " + document.getTitle()).getBytes(StandardCharsets.UTF_8))
            );
        };
    }

    public enum ExportFormat { MARKDOWN, HTML, PDF, EPUB }

    public record ExportResponse(String fileName, String mimeType, String contentBase64) {}
}
