import React from 'react'
import { useEditorStore } from '../store/useEditorStore'
import { ArrowUp, X, Check } from 'lucide-react'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'

export function SuggestionCard() {
    const { suggestion, promoteSuggestion, discardSuggestion } = useEditorStore()

    return (
        <AnimatePresence>
            {suggestion && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className="w-full max-w-3xl mx-auto mb-6"
                >
                    <div
                        onClick={promoteSuggestion}
                        className="group relative bg-primary/5 border border-primary/10 rounded-xl p-6 cursor-pointer hover:bg-primary/10 transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
                    >
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    discardSuggestion()
                                }}
                                className="p-1.5 hover:bg-background/50 rounded-full text-muted-foreground hover:text-destructive transition-colors"
                                title="Discard"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <button
                                className="p-1.5 hover:bg-background/50 rounded-full text-muted-foreground hover:text-primary transition-colors"
                                title="Promote to Main"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-1 p-1.5 bg-primary/10 rounded-lg text-primary">
                                <ArrowUp className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xs font-semibold text-primary/70 uppercase tracking-wider mb-2">
                                    Suggested Edit
                                </h3>
                                <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
                                    {suggestion}
                                </p>
                            </div>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                            <span className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium shadow-sm text-primary flex items-center gap-2">
                                Click to Promote or press <kbd className="px-1.5 py-0.5 bg-primary/10 rounded text-[10px] font-mono">⌘↑</kbd><span className="text-muted-foreground">/</span><kbd className="px-1.5 py-0.5 bg-primary/10 rounded text-[10px] font-mono">Ctrl↑</kbd>
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
