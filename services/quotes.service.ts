"use server";

import { Quote } from "@/types/quote";

export async function fetchQuote(): Promise<Quote> {
    try {
        // Fetch quote in English from a stable API
        const quoteRes = await fetch("https://dummyjson.com/quotes/random", { cache: 'no-store' });
        const quoteData = await quoteRes.json();

        if (!quoteData || !quoteData.quote) {
            throw new Error("Invalid quote format");
        }

        const englishText = quoteData.quote;
        const author = quoteData.author;

        // Translate to Portuguese using MyMemory API
        const translateRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(englishText)}&langpair=en|pt-br`);
        const translateData = await translateRes.json();

        const translatedText = translateData?.responseData?.translatedText || englishText;

        return {
            autor: author,
            texto: translatedText
        };
    } catch (error) {
        console.error("Quote fetch error:", error);
        return {
            autor: "Sistema",
            texto: "Grandes coisas estão por vir!"
        };
    }
}