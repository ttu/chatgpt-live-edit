
import React, { useEffect } from 'react'
import { useEditorStore } from '../store/useEditorStore'
import { InputArea } from './InputArea'
import { SuggestionCard } from './SuggestionCard'
import { HistoryItem } from './HistoryItem'
import { SettingsDialog } from './SettingsDialog'
import { Settings, Trash2 } from 'lucide-react'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'

export function EditorLayout() {
    const { history, showSettings, setShowSettings, resetState, error, setError, suggestion, promoteSuggestion, restoreHistoryItem } = useEditorStore()

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to clear all history and text? This cannot be undone.')) {
            resetState()
        }
    }

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (showSettings) return // Don't trigger shortcuts when settings dialog is open
            
            // Cmd/Ctrl + ArrowUp: Promote suggestion
            if (suggestion && e.key === 'ArrowUp' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                promoteSuggestion()
            }
            
            // Cmd/Ctrl + ArrowDown: Restore most recent history item
            if (history.length > 0 && e.key === 'ArrowDown' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                restoreHistoryItem(history[0]) // Restore the most recent (first) history item
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [suggestion, showSettings, promoteSuggestion, history, restoreHistoryItem])

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <header className="relative text-center mb-12">
                    <div className="absolute right-0 top-0 flex items-center gap-2">
                        <button
                            onClick={handleClearAll}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
                            title="Clear All Data"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setShowSettings(true)}
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-full transition-all"
                            title="Settings"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Live Edit
                    </h1>
                    <p className="text-muted-foreground">
                        AI-assisted text refinement with history
                    </p>
                </header>

                {/* Main Editor Section */}
                <main className="relative z-10">
                    {/* Error Display */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="w-full max-w-3xl mx-auto mb-4 p-4 bg-red-100 dark:bg-red-900/90 border-2 border-red-400 dark:border-red-700 rounded-lg text-red-950 dark:text-red-50 text-base font-semibold flex items-center justify-between shadow-lg"
                            >
                                <span>{error}</span>
                                <button
                                    onClick={() => setError(null)}
                                    className="hover:bg-destructive/20 dark:hover:bg-destructive/30 p-1 rounded transition-colors"
                                >
                                    <span className="sr-only">Dismiss</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <SuggestionCard />
                    <InputArea />
                </main>

                {/* History Section */}
                {history.length > 0 && (
                    <section className="mt-16 pt-8 border-t border-border/40">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
                            History
                        </h2>
                        <div className="space-y-4 opacity-80 hover:opacity-100 transition-opacity">
                            <AnimatePresence>
                                {history.map((item) => (
                                    <HistoryItem key={item.id} item={item} />
                                ))}
                            </AnimatePresence>
                        </div>
                    </section>
                )}
            </div>

            <SettingsDialog
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
            />
        </div>
    )
}
