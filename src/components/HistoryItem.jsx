import React from 'react'
import { useEditorStore } from '../store/useEditorStore'
import { Clock, RotateCcw } from 'lucide-react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

export function HistoryItem({ item }) {
    const { restoreHistoryItem } = useEditorStore()

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative p-4 rounded-lg bg-secondary/30 border border-border/50 text-muted-foreground hover:bg-secondary/50 transition-colors"
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-medium opacity-70">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>
                <button
                    onClick={() => restoreHistoryItem(item)}
                    className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs font-medium text-primary hover:underline transition-opacity"
                >
                    <RotateCcw className="w-3 h-3" />
                    Restore
                </button>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap line-clamp-3 hover:line-clamp-none transition-all">
                {item.text}
            </p>
        </motion.div>
    )
}
