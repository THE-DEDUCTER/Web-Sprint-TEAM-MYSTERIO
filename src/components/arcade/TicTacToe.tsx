import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'

type Cell = 'X' | 'O' | null

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function winner(board: Cell[]): Cell {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]
  }
  return null
}

function isFull(board: Cell[]) {
  return board.every((c) => c !== null)
}

function minimax(board: Cell[], player: 'X' | 'O', ai: 'X' | 'O'): number {
  const w = winner(board)
  if (w === ai) return 10
  if (w && w !== ai) return -10
  if (isFull(board)) return 0

  const scores: number[] = []
  board.forEach((cell, i) => {
    if (cell) return
    const next = [...board]
    next[i] = player
    scores.push(minimax(next, player === 'X' ? 'O' : 'X', ai))
  })
  return player === ai ? Math.max(...scores) : Math.min(...scores)
}

function bestMove(board: Cell[], ai: 'X' | 'O'): number {
  let best = -Infinity
  let move = 0
  board.forEach((cell, i) => {
    if (cell) return
    const next = [...board]
    next[i] = ai
    const score = minimax(next, ai === 'X' ? 'O' : 'X', ai)
    if (score > best) {
      best = score
      move = i
    }
  })
  return move
}

export function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const human: 'X' | 'O' = 'X'
  const ai: 'X' | 'O' = 'O'
  const w = winner(board)
  const full = isFull(board)

  useEffect(() => {
    if (!w && !full && board.filter((c) => c).length % 2 === 1) {
      const timer = setTimeout(() => {
        const move = bestMove(board, ai)
        setBoard((b) => {
          const next = [...b]
          next[move] = ai
          return next
        })
      }, 350)
      return () => clearTimeout(timer)
    }
  }, [board, w, full])

  function play(i: number) {
    if (board[i] || w || board.filter((c) => c).length % 2 === 1) return
    const next = [...board]
    next[i] = human
    setBoard(next)
  }

  function reset() {
    setBoard(Array(9).fill(null))
  }

  const status = w ? (w === human ? 'You win! 🎉' : 'Buddy AI wins.') : full ? "It's a draw." : board.filter((c) => c).length % 2 === 1 ? "Buddy's turn…" : 'Your turn'

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">Play against Buddy AI</p>
      <div className="grid grid-cols-3 gap-1.5">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            className="flex h-20 w-20 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-4xl font-bold hover:border-brand-300"
          >
            <span className={cell === 'X' ? 'text-brand-600' : 'text-pink-500'}>{cell}</span>
          </button>
        ))}
      </div>
      <p className="text-sm font-medium text-brand-600">{status}</p>
      <Button variant="secondary" onClick={reset}>
        Reset
      </Button>
    </div>
  )
}
