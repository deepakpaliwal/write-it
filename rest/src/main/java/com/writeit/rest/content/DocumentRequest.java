package com.writeit.rest.content;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DocumentRequest(
    @NotBlank String title,
    @NotNull DocumentType type,
    String content,
    @NotNull Long userId
) {
}
