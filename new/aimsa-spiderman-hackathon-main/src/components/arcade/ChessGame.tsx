import { useEffect, useMemo, useState } from 'react'
import { Chess, type Square } from 'chess.js'
import { Button } from '@/components/ui/Button'

const UNICODE: Record<string, string> = {
  wp: '♙', wn: '♘', wb: '♗', wr: '♖', wq: '♕', wk: '♔',
  bp: '♟', bn: '♞', bb: '♝', br: '♜', bq: '♛', bk: '♚',
}

const VALUES: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }

function evaluate(game: Chess): number {
  let score = 0
  for (const row of game.board()) {
    for (const piece of row) {
      if (!piece) continue
      const v = VALUES[piece.type]
      score += piece.color === 'w' ? v : -v
    }
  }
  return score
}

function bestMove(game: Chess, aiColor: 'w' | 'b'): string | null {
  const moves = game.moves({ verbose: true })
  if (moves.length === 0) return null
  let best = moves[0]
  let bestScore = aiColor === 'w' ? -Infinity : Infinity
  for (const move of moves) {
    game.move(move.san)
    const score = evaluate(game)
    game.undo()
    if (aiColor === 'w' ? score > bestScore : score < bestScore) {
      bestScore = score
      best = move
    }
  }
  return best.san
}

export function ChessGame() {
  const [game] = useState(() => new Chess())
  const [, forceUpdate] = useState(0)
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w')
  const [selected, setSelected] = useState<Square | null>(null)
  const [status, setStatus] = useState('')

  const aiColor = playerColor === 'w' ? 'b' : 'w'

  function refresh() {
    forceUpdate((n) => n + 1)
  }

  useEffect(() => {
    if (game.turn() === aiColor && !game.isGameOver()) {
      const timer = setTimeout(() => {
        const san = bestMove(game, aiColor)
        if (san) game.move(san)
        refresh()
      }, 400)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.fen()])

  useEffect(() => {
    if (game.isCheckmate()) setStatus(`Checkmate — ${game.turn() === 'w' ? 'Black' : 'White'} wins.`)
    else if (game.isDraw()) setStatus('Draw.')
    else if (game.isCheck()) setStatus('Check!')
    else setStatus('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.fen()])

  const board = useMemo(() => game.board(), [game.fen()])
  const legalTargets = selected
    ? game.moves({ square: selected, verbose: true }).map((m) => m.to)
    : []

  function reset(color: 'w' | 'b' = playerColor) {
    game.reset()
    setPlayerColor(color)
    setSelected(null)
    refresh()
  }

  function onSquareClick(square: Square) {
    if (game.turn() !== playerColor || game.isGameOver()) return
    if (selected) {
      const move = game.moves({ square: selected, verbose: true }).find((m) => m.to === square)
      if (move) {
        game.move({ from: selected, to: square, promotion: 'q' })
        setSelected(null)
        refresh()
        return
      }
      setSelected(null)
    }
    const piece = game.get(square)
    if (piece && piece.color === playerColor) setSelected(square)
  }

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const displayBoard = playerColor === 'w' ? board : [...board].reverse().map((row) => [...row].reverse())

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        You are {playerColor === 'w' ? 'White' : 'Black'}. Buddy AI is {aiColor === 'w' ? 'White' : 'Black'}.
      </p>

      <div className="grid grid-cols-8 overflow-hidden rounded-xl border border-neutral-300 dark:border-neutral-700 shadow-sm">
        {displayBoard.map((row, ri) =>
          row.map((piece, fi) => {
            const rank = playerColor === 'w' ? 8 - ri : ri + 1
            const file = playerColor === 'w' ? files[fi] : files[7 - fi]
            const square = `${file}${rank}` as Square
            const dark = (ri + fi) % 2 === 1
            const isSelected = selected === square
            const isTarget = legalTargets.includes(square)
            return (
              <button
                key={square}
                onClick={() => onSquareClick(square)}
                className={`relative flex h-11 w-11 items-center justify-center text-3xl leading-none sm:h-14 sm:w-14 ${
                  dark ? 'bg-brand-100 dark:bg-brand-900/50' : 'bg-white dark:bg-neutral-800'
                } ${isSelected ? 'ring-2 ring-inset ring-brand-500' : ''}`}
              >
                {piece && <span className={piece.color === 'w' ? 'text-neutral-50 [text-shadow:0_0_1px_#000,0_0_1px_#000]' : 'text-neutral-900'}>{UNICODE[`${piece.color}${piece.type}`]}</span>}
                {isTarget && <span className="absolute h-2.5 w-2.5 rounded-full bg-brand-500/70" />}
              </button>
            )
          }),
        )}
      </div>

      <p className="h-5 text-sm font-medium text-brand-600">{status || (game.turn() === playerColor ? 'Your turn' : "Buddy's turn")}</p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button variant={playerColor === 'w' ? 'primary' : 'secondary'} onClick={() => reset('w')}>
          Play White
        </Button>
        <Button variant={playerColor === 'b' ? 'primary' : 'secondary'} onClick={() => reset('b')}>
          Play Black
        </Button>
        <Button variant="ghost" onClick={() => reset()}>
          Reset board
        </Button>
      </div>
      <p className="max-w-md text-center text-xs text-neutral-400">
        Current chess mode supports castling, core movement, captures, and pawn promotion to queen.
      </p>
    </div>
  )
}
