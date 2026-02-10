package com.writeit.rest.content;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class WritingToolsControllerTests {

    private final WritingToolsController controller = new WritingToolsController();

    @Test
    void spellCheckShouldReturnSuggestionsForKnownIssues() {
        WritingToolsController.SpellCheckResponse response = controller.spellCheck(new WritingToolsController.TextPayload("teh text  with double space"));
        assertFalse(response.suggestions().isEmpty());
    }

    @Test
    void seoShouldReportWordCount() {
        WritingToolsController.SeoSuggestionResponse response = controller.seo(new WritingToolsController.SeoSuggestionRequest("short", "tiny content"));
        assertTrue(response.wordCount() >= 0);
        assertFalse(response.suggestions().isEmpty());
    }
}
