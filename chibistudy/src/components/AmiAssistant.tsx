import { useState } from 'react'

export default function AmiAssistant() {
  const [open, setOpen] = useState(true)
  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open && (
        <div className="mb-2 max-w-xs rounded-2xl border border-pink-300 bg-white p-3 text-sm shadow-lg">
          <div className="mb-1 font-semibold text-pink-700">Ami (AI Hầu gái)</div>
          <div className="text-slate-700">Mình có thể giúp gợi ý lịch và chia nhỏ nhiệm vụ nhé ♡</div>
        </div>
      )}
      <button
        onClick={() => setOpen((x) => !x)}
        className="flex items-center gap-2 rounded-full border border-pink-300 bg-pink-100 px-3 py-2 shadow"
        title="Ami — tóc trắng, mắt đỏ, đồ hầu gái chibi"
      >
        <span className="inline-block size-8 rounded-full bg-gradient-to-br from-pink-200 via-white to-pink-300 border border-pink-300 shadow-inner" />
        <span className="text-pink-700 text-sm font-medium">Ami</span>
      </button>
    </div>
  )}

