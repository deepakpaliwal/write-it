package com.writeit.rest.content;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class ContentMetricsTests {

    @Test
    void shouldCountWordsAndEstimateReadingTime() {
        int words = ContentMetrics.countWords("one two three four");
        assertEquals(4, words);
        assertEquals(1, ContentMetrics.estimateReadingTimeMinutes(words));
    }

    @Test
    void shouldHandleBlankContent() {
        assertEquals(0, ContentMetrics.countWords("  \n  "));
        assertEquals(0, ContentMetrics.estimateReadingTimeMinutes(0));
    }
}
