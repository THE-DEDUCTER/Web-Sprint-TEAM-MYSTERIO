import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { Card } from '@/components/ui/Card'
import { ChessGame } from '@/components/arcade/ChessGame'
import { TicTacToe } from '@/components/arcade/TicTacToe'
import { Sudoku } from '@/components/arcade/Sudoku'

type GameKey = 'chess' | 'ttt' | 'sudoku'

const games: { key: GameKey; title: string; caption: string }[] = [
  { key: 'chess', title: 'Chess', caption: 'You vs Buddy AI' },
  { key: 'ttt', title: 'Tic-Tac-Toe', caption: 'Play against Buddy AI' },
  { key: 'sudoku', title: 'Sudoku', caption: 'Fill the 9x9 grid' },
]

export default function Arcade() {
  const [active, setActive] = useState<GameKey>('chess')

  return (
    <div>
      <PageHeader title="arcade" subtitle="Quick browser games you can play inside cohort." />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {games.map((g) => (
          <button key={g.key} onClick={() => setActive(g.key)}>
            <Card className={`p-4 text-left transition ${active === g.key ? 'border-brand-400 ring-1 ring-brand-400' : ''}`}>
              <p className="font-bold">{g.title}</p>
              <p className="text-xs text-neutral-400">{g.caption}</p>
            </Card>
          </button>
        ))}
        <Card className="flex flex-col items-center justify-center gap-1 p-4 text-center opacity-60">
          <Sparkles size={16} className="text-neutral-300" />
          <p className="text-xs font-semibold text-neutral-400">More games coming soon!</p>
        </Card>
      </div>

      <Card className="p-6">
        {active === 'chess' && <ChessGame />}
        {active === 'ttt' && <TicTacToe />}
        {active === 'sudoku' && <Sudoku />}
      </Card>
    </div>
  )
}
