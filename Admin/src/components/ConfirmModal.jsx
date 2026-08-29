import React from 'react'
import { AlertTriangle } from 'lucide-react'

const ConfirmModal = ({ open, title, message, confirmLabel = "Delete", onConfirm, onCancel, loading }) => {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-rose-100 text-rose-600">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 rounded-full text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 transition disabled:opacity-60"
                    >
                        {loading ? "Deleting..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal
