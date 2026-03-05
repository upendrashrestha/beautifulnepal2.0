'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/trek', icon: '🏔️', label: 'Treks' },
  { href: '/trek/language', icon: '💬', label: 'Language' },
  { href: '/trek/emergency', icon: '🆘', label: 'Emergency' },
  { href: '/trek/downloads', icon: '📥', label: 'Downloads' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-stone-950/95 backdrop-blur-xl border-t border-stone-800 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/trek' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive ? 'text-orange-400' : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className={`text-[10px] font-semibold tracking-wide uppercase ${isActive ? 'text-orange-400' : 'text-stone-500'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-orange-400" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
