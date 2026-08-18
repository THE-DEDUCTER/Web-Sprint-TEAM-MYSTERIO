import { useState } from 'react'
import { Save } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { DEPARTMENTS } from '@/lib/seed/communities'
import { updateUser } from '@/lib/db'
import type { AppUser } from '@/types'

export function EditProfileModal({
  open,
  onClose,
  user,
  onSaved,
}: {
  open: boolean
  onClose: () => void
  user: AppUser
  onSaved: (u: AppUser) => void
}) {
  const [displayName, setDisplayName] = useState(user.displayName)
  const [handle, setHandle] = useState(user.handle)
  const [department, setDepartment] = useState(user.department ?? '')
  const [whatsapp, setWhatsapp] = useState(user.whatsapp ?? '')
  const [linkedinUsername, setLinkedinUsername] = useState(user.linkedinUsername ?? '')
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    const patch: Partial<AppUser> = { displayName, handle, department, whatsapp, linkedinUsername }
    await updateUser(user.id, patch)
    setSaving(false)
    onSaved({ ...user, ...patch })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="border-b border-neutral-200 dark:border-neutral-800 px-5 py-4">
        <h2 className="font-bold">Edit Profile</h2>
      </div>
      <div className="space-y-4 p-5">
        <Field label="NAME">
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="input" />
        </Field>
        <Field label="USERNAME">
          <div className="flex items-center gap-1">
            <span className="text-neutral-400">@</span>
            <input value={handle} onChange={(e) => setHandle(e.target.value.replace(/\s/g, ''))} className="input" />
          </div>
        </Field>
        <Field label="DEPARTMENT">
          <select value={department} onChange={(e) => setDepartment(e.target.value)} className="input">
            <option value="">Select Dept</option>
            {DEPARTMENTS.filter((d) => d !== 'All Departments').map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>
        <Field label="WHATSAPP">
          <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="91XXXXXXXXXX" className="input" />
        </Field>
        <Field label="LINKEDIN USERNAME">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-400">linkedin.com/in/</span>
            <input value={linkedinUsername} onChange={(e) => setLinkedinUsername(e.target.value)} placeholder="your-linkedin-username" className="input" />
          </div>
        </Field>
      </div>
      <div className="flex justify-end gap-2 border-t border-neutral-200 dark:border-neutral-800 px-5 py-4">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={save} disabled={saving} className="gap-1.5">
          <Save size={14} /> Save Changes
        </Button>
      </div>
    </Modal>
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
