package com.writeit.rest.content;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {
    List<MediaFile> findByDocumentId(Long documentId);
}
