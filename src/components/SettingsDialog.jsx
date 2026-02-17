import React, { useState } from 'react'
import { useEditorStore } from '../store/useEditorStore'
import { X, Key, Save, AlertCircle } from 'lucide-react'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'

function SettingsForm({ onClose }) {
    const { apiKey, setApiKey } = useEditorStore()
    const [tempKey, setTempKey] = useState(apiKey || '')

    const handleSave = () => {
        setApiKey(tempKey.trim())
        onClose()
    }

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />

            {/* Dialog */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 bg-card rounded-xl shadow-lg border border-border z-50"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Key className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-semibold">API Settings</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-secondary rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            OpenAI API Key
                        </label>
                        <input
                            type="password"
                            value={tempKey}
                            onChange={(e) => setTempKey(e.target.value)}
                            placeholder="sk-..."
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <p className="text-[0.8rem] text-muted-foreground">
                            Your key is stored locally in your browser and never sent to our servers.
                        </p>
                    </div>

                    {!apiKey && (
                        <div className="flex items-center gap-2 p-3 text-sm text-warning-foreground bg-warning/10 dark:bg-warning/20 rounded-lg border border-warning/20 dark:border-warning/30">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <p>An API key is required to process text.</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            <Save className="w-4 h-4" />
                            Save Key
                        </button>
                    </div>
                </div>
            </motion.div>
        </>
    )
}

export function SettingsDialog({ isOpen, onClose }) {
    return (
        <AnimatePresence>
            {isOpen && <SettingsForm onClose={onClose} />}
        </AnimatePresence>
    )
}
