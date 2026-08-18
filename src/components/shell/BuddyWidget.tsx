import { useState, useRef, useEffect } from 'react'
import { Send, X } from 'lucide-react'
import { LogoMark } from '@/components/ui/Spinner'
import { askBuddy } from '@/lib/buddy'

interface Msg {
  from: 'buddy' | 'me'
  text: string
}

export function BuddyWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    { from: 'buddy', text: "Hey, I'm Buddy — your campus assistant for Cohort. I can search users, communities, and features live. 👀" },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, open])

  async function send() {
    const text = input.trim()
    if (!text) return
    setMessages((m) => [...m, { from: 'me', text }])
    setInput('')
    setThinking(true)
    const reply = await askBuddy(text)
    setThinking(false)
    setMessages((m) => [...m, { from: 'buddy', text: reply }])
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-40 flex h-[440px] w-[340px] flex-col overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl">
          <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
            <LogoMark size={24} />
            <p className="font-bold">Buddy</p>
            <button onClick={() => setOpen(false)} className="ml-auto text-neutral-400 hover:text-neutral-600">
              <X size={16} />
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  m.from === 'buddy'
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100'
                    : 'ml-auto bg-brand-600 text-white'
                }`}
              >
                {m.text}
              </div>
            ))}
            {thinking && <div className="w-fit rounded-2xl bg-neutral-100 dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-400">…</div>}
          </div>
          <div className="flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800 p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask Buddy anything…"
              className="flex-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3.5 py-2 text-sm outline-none"
            />
            <button onClick={send} className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white">
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-xl ring-4 ring-white dark:ring-neutral-950"
      >
        <LogoMark size={40} />
      </button>
    </>
  )
}
