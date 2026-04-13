'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/home/stars', label: 'rating', icon: '⭐' },
  { href: '/home/traffic', label: 'behavior', icon: '🚦' },
  { href: '/home/journal', label: 'journal', icon: '📓' },
  { href: '/home/settings', label: 'settings', icon: '⚙️' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-100 safe-area-bottom">
      <div className="flex max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-1 py-3 transition-colors ${
                active ? 'text-pink-400' : 'text-stone-400'
              }`}
            >
              <span className={`text-2xl leading-none ${active ? 'scale-110' : ''} transition-transform`}>
                {tab.icon}
              </span>
              <span className={`text-[10px] font-medium ${active ? 'text-pink-500' : ''}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
      {/* iOS safe area padding */}
      <div className="h-safe-area-inset-bottom" />
    </nav>
  )
}
