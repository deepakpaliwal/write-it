package com.writeit.rest.content;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentVersionRepository versionRepository;

    public DocumentService(DocumentRepository documentRepository, DocumentVersionRepository versionRepository) {
        this.documentRepository = documentRepository;
        this.versionRepository = versionRepository;
    }

    @Transactional
    public Document create(DocumentRequest request) {
        Document document = new Document();
        applyRequest(document, request);
        return documentRepository.save(document);
    }

    @Transactional
    public Document update(Long id, DocumentRequest request) {
        Document document = documentRepository.findById(id).orElseThrow();
        applyRequest(document, request);
        return documentRepository.save(document);
    }

    @Transactional
    public SnapshotResponse createSnapshot(Long documentId) {
        Document document = documentRepository.findById(documentId).orElseThrow();
        int lastVersion = versionRepository.findTopByDocumentIdOrderByVersionNumberDesc(documentId)
            .map(DocumentVersion::getVersionNumber)
            .orElse(0);

        DocumentVersion version = new DocumentVersion();
        version.setDocumentId(documentId);
        version.setVersionNumber(lastVersion + 1);
        version.setTitle(document.getTitle());
        version.setContent(document.getContent());

        versionRepository.save(version);
        return new SnapshotResponse(documentId, version.getVersionNumber());
    }

    public List<DocumentVersion> listVersions(Long documentId) {
        return versionRepository.findByDocumentIdOrderByVersionNumberDesc(documentId);
    }

    public List<Document> listByUser(Long userId, String query, String tag) {
        if (query != null && !query.isBlank()) {
            return documentRepository.findByUserIdAndTitleContainingIgnoreCase(userId, query.trim());
        }
        if (tag != null && !tag.isBlank()) {
            return documentRepository.findByUserIdAndTagsContainingIgnoreCase(userId, tag.trim());
        }
        return documentRepository.findByUserId(userId);
    }

    private void applyRequest(Document document, DocumentRequest request) {
        document.setTitle(request.title());
        document.setType(request.type());
        document.setContent(request.content());
        document.setUserId(request.userId());
        document.setTags(request.tags());
        document.setCategory(request.category());
        recalculateMetrics(document);
    }

    private void recalculateMetrics(Document document) {
        int words = ContentMetrics.countWords(document.getContent());
        document.setWordCount(words);
        document.setReadingTimeMinutes(ContentMetrics.estimateReadingTimeMinutes(words));
    }
}
