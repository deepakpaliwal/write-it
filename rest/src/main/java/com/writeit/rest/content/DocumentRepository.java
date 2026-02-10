package com.writeit.rest.content;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByUserId(Long userId);

    List<Document> findByUserIdAndTitleContainingIgnoreCase(Long userId, String query);

    List<Document> findByUserIdAndTagsContainingIgnoreCase(Long userId, String tag);
}
