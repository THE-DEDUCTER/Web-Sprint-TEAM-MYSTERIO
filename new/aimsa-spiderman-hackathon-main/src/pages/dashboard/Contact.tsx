import { useState } from 'react'
import { Send } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/contexts/AuthContext'
import { submitContactMessage } from '@/lib/db'

const TEAM = [
  { name: 'Chirag Ferwani', role: 'Co-founder & Engineering' },
  { name: 'Vrushabh Hirap', role: 'Co-founder & Engineering' },
  { name: 'Anushka Shinde', role: 'Co-founder & Design' },
]

export default function Contact() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.displayName ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  async function submit() {
    if (!name || !email || !message) return
    setSending(true)
    await submitContactMessage({ userId: user?.id, name, email, message })
    setSending(false)
    setSent(true)
    setMessage('')
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <div>
      <PageHeader
        title="contact"
        subtitle="Have a question, suggestion, or just want to say hello? We'd love to hear from you."
      />

      <Card className="p-6">
        <div className="space-y-4">
          <Field label="NAME">
            <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
          </Field>
          <Field label="EMAIL">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input" />
          </Field>
          <Field label="MESSAGE">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
              rows={5}
              className="input resize-none"
            />
            <p className="mt-1 text-right text-xs text-neutral-400">{message.length}/1000</p>
          </Field>
          <Button variant="gradient" onClick={submit} disabled={!name || !email || !message || sending} className="gap-2 px-6 py-2.5">
            <Send size={14} /> Send Message
          </Button>
          {sent && <p className="text-sm font-medium text-green-600">Message sent — thanks for reaching out!</p>}
        </div>
      </Card>

      <div className="mt-10">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-neutral-400">Meet the Team</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {TEAM.map((t) => (
            <Card key={t.name} className="flex flex-col items-center gap-2 p-5 text-center">
              <Avatar name={t.name} size={56} />
              <p className="font-semibold">{t.name}</p>
              <p className="text-xs text-neutral-400">{t.role}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold tracking-wide text-neutral-400">{label}</span>
      {children}
    </label>
  )
}
