package com.writeit.rest.content;

import jakarta.validation.constraints.NotNull;

public record ChapterReorderItem(
    @NotNull Long chapterId,
    @NotNull Integer position
) {
}
