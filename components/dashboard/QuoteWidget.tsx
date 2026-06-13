"use client";

import { useEffect, useState } from "react";
import { LuQuote } from "react-icons/lu";
import { Quote } from "@/types/quote";
import { fetchQuote } from "@/services/quotes.service";

export default function QuoteWidget() {
    const [quote, setQuote] = useState<Quote | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuoteData = async () => {
            try {
                const data = await fetchQuote();
                setQuote(data);
            } catch (error) {
                console.error("Failed to fetch quote:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuoteData();
    }, []);

    if (isLoading) {
        return (
            <div className="w-full rounded-2xl border border-border-card bg-bg-card p-6 animate-pulse flex flex-col gap-3">
                <div className="h-4 w-3/4 bg-bg-main rounded"></div>
                <div className="h-3 w-1/4 bg-bg-main rounded self-end"></div>
            </div>
        );
    }

    if (!quote) return null;

    return (
        <div className="relative w-full rounded-2xl border border-border-card bg-bg-card p-6 overflow-hidden group">
            {/* Background Icon Decoration */}
            <LuQuote size={120} className="absolute -top-4 -right-4 text-bg-main opacity-50 rotate-12 transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110" />

            <div className="relative z-10 flex flex-col gap-3">
                <p className="text-lg font-medium text-text-primary italic leading-relaxed">
                    "{quote.texto}"
                </p>
                <div className="flex items-center gap-2 self-end">
                    <div className="w-6 h-px bg-accent"></div>
                    <span className="text-sm font-semibold text-text-secondary">{quote.autor}</span>
                </div>
            </div>
        </div>
    );
}
