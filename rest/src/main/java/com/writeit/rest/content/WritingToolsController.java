package com.writeit.rest.content;

import java.util.ArrayList;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/writing-tools")
public class WritingToolsController {

    @PostMapping("/spell-check")
    public SpellCheckResponse spellCheck(@RequestBody TextPayload payload) {
        String text = payload.text() == null ? "" : payload.text();
        List<String> suggestions = new ArrayList<>();
        if (text.contains(" teh ") || text.startsWith("teh ") || text.endsWith(" teh")) {
            suggestions.add("Replace 'teh' with 'the'.");
        }
        if (text.contains("  ")) {
            suggestions.add("Remove double spaces.");
        }
        if (!text.isBlank() && !text.trim().endsWith(".") && !text.trim().endsWith("!") && !text.trim().endsWith("?")) {
            suggestions.add("Consider ending the paragraph with punctuation.");
        }
        return new SpellCheckResponse(suggestions);
    }

    @PostMapping("/seo-suggestions")
    public SeoSuggestionResponse seo(@RequestBody SeoSuggestionRequest payload) {
        String title = payload.title() == null ? "" : payload.title();
        String content = payload.content() == null ? "" : payload.content();
        List<String> suggestions = new ArrayList<>();
        if (title.length() < 20) {
            suggestions.add("Use a longer title (20-60 chars) for better discoverability.");
        }
        if (ContentMetrics.countWords(content) < 300) {
            suggestions.add("Add more depth; SEO content typically performs better beyond 300 words.");
        }
        if (!content.toLowerCase().contains("introduction")) {
            suggestions.add("Consider adding an introduction heading for structure.");
        }
        return new SeoSuggestionResponse(ContentMetrics.countWords(content), suggestions);
    }

    @PostMapping("/ai-verify")
    public AiVerificationResponse aiVerify(@RequestBody TextPayload payload) {
        String text = payload.text() == null ? "" : payload.text();
        List<String> suggestions = new ArrayList<>();
        suggestions.add("Tone check: keep sentence length varied for readability.");
        if (text.length() > 500) {
            suggestions.add("Fact-check recommendation: verify all numeric claims with references.");
        }
        suggestions.add("Style check: use active voice where possible.");
        return new AiVerificationResponse("MOCKED", suggestions);
    }

    public record TextPayload(String text) {}
    public record SeoSuggestionRequest(String title, String content) {}
    public record SpellCheckResponse(List<String> suggestions) {}
    public record SeoSuggestionResponse(int wordCount, List<String> suggestions) {}
    public record AiVerificationResponse(String provider, List<String> suggestions) {}
}
