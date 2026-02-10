package com.writeit.rest.content;

public final class ContentMetrics {

    private static final int WORDS_PER_MINUTE = 200;

    private ContentMetrics() {
    }

    public static int countWords(String content) {
        if (content == null || content.isBlank()) {
            return 0;
        }
        return content.trim().split("\\s+").length;
    }

    public static int estimateReadingTimeMinutes(int words) {
        if (words <= 0) {
            return 0;
        }
        return (int) Math.ceil((double) words / WORDS_PER_MINUTE);
    }
}
