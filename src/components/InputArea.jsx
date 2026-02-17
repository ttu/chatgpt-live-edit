import React, { useEffect, useRef } from 'react'
import { useEditorStore } from '../store/useEditorStore'
import { Send, Sparkles } from 'lucide-react'
import { cn } from '../lib/utils'

export function InputArea() {
    const {
        input,
        setInput,
        guidance,
        setGuidance,
        language,
        setLanguage,
        getDefaultGuidance,
        generateSuggestion,
        isProcessing,
        autoProcessEnabled,
        toggleAutoProcess,
        suggestion,
        history,
        apiKey,
        lastFailedApiKey,
        hasApiError
    } = useEditorStore()

    const textareaRef = useRef(null)

    // Auto-resize textarea based on content
    useEffect(() => {
        const textarea = textareaRef.current
        if (textarea) {
            // Reset height to auto to get the correct scrollHeight
            textarea.style.height = 'auto'
            // Set height based on scrollHeight, with min and max constraints
            const newHeight = Math.min(Math.max(textarea.scrollHeight, 192), 600) // min 192px (h-48), max 600px
            textarea.style.height = `${newHeight}px`
        }
    }, [input])

    // Auto-processing interval
    useEffect(() => {
        if (!autoProcessEnabled) return

        // Check if we're in mock mode (for testing)
        const useMockAI = import.meta.env.VITE_USE_MOCK_AI === "true"

        // Don't auto-process if there's an API error or failed API key
        if (!useMockAI && (hasApiError || (lastFailedApiKey && lastFailedApiKey === apiKey))) {
            return
        }

        const timer = setInterval(() => {
            // Check current state before each call to prevent retries with API errors
            const currentState = useEditorStore.getState()
            const currentUseMockAI = import.meta.env.VITE_USE_MOCK_AI === "true"
            if (!currentUseMockAI && (currentState.hasApiError || (currentState.lastFailedApiKey && currentState.lastFailedApiKey === currentState.apiKey))) {
                return
            }
            generateSuggestion()
        }, 3000)

        return () => clearInterval(timer)
    }, [autoProcessEnabled, generateSuggestion, apiKey, lastFailedApiKey, hasApiError])

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            generateSuggestion()
        }
    }

    const guidancePlaceholder = language === "fi" 
        ? "Ohje (esim. 'Tee siitä ammattimaisempi')"
        : "Guidance (e.g., 'Make it more professional')"

    return (
        <div className="w-full max-w-3xl mx-auto space-y-4">
            {/* Language Selector and Guidance Input */}
            <div className="flex items-center gap-3">
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-2 bg-secondary/50 rounded-lg border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-xl shrink-0 w-16 text-center appearance-none"
                    title={language === "fi" ? "Finnish" : "English"}
                >
                    <option value="fi">🇫🇮</option>
                    <option value="en">🇬🇧</option>
                </select>
                <input
                    type="text"
                    value={guidance}
                    onChange={(e) => setGuidance(e.target.value)}
                    placeholder={guidancePlaceholder}
                    className="flex-1 px-4 py-2 bg-secondary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
            </div>

            {/* Main Input */}
            <div className="relative group">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Start typing..."
                    className="w-full min-h-[192px] max-h-[600px] p-6 bg-card rounded-xl shadow-sm border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-lg leading-relaxed transition-all overflow-y-auto"
                    style={{ height: '192px' }}
                />

                <div className="absolute bottom-4 right-4 flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors">
                        <input
                            type="checkbox"
                            checked={autoProcessEnabled}
                            onChange={toggleAutoProcess}
                            className="w-3.5 h-3.5 rounded border-primary/20 text-primary focus:ring-offset-0 focus:ring-1 focus:ring-primary/20"
                        />
                        Auto-process (3s)
                    </label>

                    <button
                        onClick={generateSuggestion}
                        disabled={isProcessing || !input.trim()}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground font-medium text-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed",
                            isProcessing && "animate-pulse"
                        )}
                    >
                        {isProcessing ? (
                            <>
                                <Sparkles className="w-4 h-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Process
                            </>
                        )}
                    </button>
                </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
                Press <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">Cmd + Enter</kbd> to process
                {suggestion && (
                    <span className="ml-2">
                        • Press <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">⌘↑</kbd> or <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">Ctrl↑</kbd> to promote
                    </span>
                )}
                {history.length > 0 && (
                    <span className="ml-2">
                        • Press <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">⌘↓</kbd> or <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">Ctrl↓</kbd> to restore from history
                    </span>
                )}
            </p>
        </div>
    )
}
