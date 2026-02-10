package com.writeit.rest.content;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    List<Chapter> findByDocumentIdOrderByPositionAsc(Long documentId);
}
