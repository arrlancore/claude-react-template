import React from 'react'
import { X } from 'lucide-react'
import { CustomData } from './hooks/usePatternGeneration'

interface SettingsModalProps {
  isOpen: boolean
  currentPattern: string
  customData: CustomData
  onClose: () => void
  onCustomDataChange: (field: string, value: string) => void
  onApply: () => void
}

export function SettingsModal({
  isOpen,
  currentPattern,
  customData,
  onClose,
  onCustomDataChange,
  onApply,
}: SettingsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-purple-900 rounded-2xl p-8 max-w-md w-full border border-white/10 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <h3 className="text-2xl font-bold text-white mb-6">
          Customize Data
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-purple-200 mb-2 font-medium">
              Array (comma-separated)
            </label>
            <input
              type="text"
              value={customData[currentPattern as keyof CustomData]?.array || ''}
              onChange={(e) => onCustomDataChange('array', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., 1,3,6,8,11,15"
            />
          </div>

          {currentPattern === 'pair-sum' && (
            <div>
              <label className="block text-purple-200 mb-2 font-medium">
                Target Sum
              </label>
              <input
                type="number"
                value={customData[currentPattern as keyof CustomData]?.target || ''}
                onChange={(e) => onCustomDataChange('target', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., 14"
              />
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={onApply}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Apply Changes
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
