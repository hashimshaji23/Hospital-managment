import React from 'react'

const StatCard = ({ icon: Icon, label, value, accent = "emerald" }) => {
    const accents = {
        emerald: "from-emerald-100 to-emerald-200 border-emerald-200 text-emerald-900",
        amber: "from-amber-100 to-amber-200 border-amber-200 text-amber-900",
        rose: "from-rose-100 to-rose-200 border-rose-200 text-rose-900",
        blue: "from-blue-100 to-blue-200 border-blue-200 text-blue-900",
    }
    return (
        <div className="rounded-2xl p-4 bg-white/70 backdrop-blur-sm border border-emerald-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                    <p className="text-sm font-medium text-emerald-800/80">{label}</p>
                    <p className="mt-2 text-2xl font-extrabold text-emerald-900 tracking-tight">{value}</p>
                </div>
                <div className={`p-3 rounded-full bg-linear-to-br border shadow-sm ${accents[accent]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    )
}

export default StatCard
