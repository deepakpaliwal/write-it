package com.writeit.rest.content;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SnippetRepository extends JpaRepository<Snippet, Long> {
    List<Snippet> findByUserIdOrderByIdDesc(Long userId);
}
