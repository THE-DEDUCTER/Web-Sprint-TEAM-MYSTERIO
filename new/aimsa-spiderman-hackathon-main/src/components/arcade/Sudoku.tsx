import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { generatePuzzle, findConflicts, isComplete, type Grid } from '@/lib/sudoku'

export function Sudoku() {
  const [{ puzzle, solution }, setGame] = useState(() => generatePuzzle())
  const [grid, setGrid] = useState<Grid>(() => puzzle.map((r) => [...r]))
  const fixed = useMemo(() => puzzle.map((row) => row.map((c) => c !== 0)), [puzzle])
  const conflicts = useMemo(() => findConflicts(grid), [grid])
  const solved = useMemo(() => isComplete(grid), [grid])

  function setCell(row: number, col: number, value: string) {
    if (fixed[row][col]) return
    const num = value.replace(/[^1-9]/g, '').slice(-1)
    const next = grid.map((r) => [...r])
    next[row][col] = num ? Number(num) : 0
    setGrid(next)
  }

  function newGame() {
    const g = generatePuzzle()
    setGame(g)
    setGrid(g.puzzle.map((r) => [...r]))
  }

  function reset() {
    setGrid(puzzle.map((r) => [...r]))
  }

  function revealSolution() {
    setGrid(solution.map((r) => [...r]))
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">Fill the 9x9 grid</p>

      <div className="grid grid-cols-9 overflow-hidden rounded-xl border-2 border-neutral-400 dark:border-neutral-600">
        {grid.map((row, ri) =>
          row.map((val, ci) => {
            const key = `${ri}-${ci}`
            const isFixed = fixed[ri][ci]
            const hasConflict = conflicts.has(key)
            return (
              <input
                key={key}
                value={val || ''}
                onChange={(e) => setCell(ri, ci, e.target.value)}
                disabled={isFixed}
                inputMode="numeric"
                className={`h-8 w-8 border border-neutral-200 dark:border-neutral-700 text-center text-sm font-semibold outline-none sm:h-9 sm:w-9
                  ${isFixed ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200' : 'bg-white dark:bg-neutral-900 text-brand-600'}
                  ${hasConflict ? '!bg-red-50 dark:!bg-red-950 !text-red-600' : ''}
                  ${ci % 3 === 0 ? 'border-l-2 border-l-neutral-400 dark:border-l-neutral-600' : ''}
                  ${ri % 3 === 0 ? 'border-t-2 border-t-neutral-400 dark:border-t-neutral-600' : ''}
                `}
              />
            )
          }),
        )}
      </div>

      <p className="text-sm font-medium text-brand-600">
        {solved ? 'Solved! 🎉' : conflicts.size > 0 ? `${conflicts.size} conflicting cell(s)` : 'Keep going'}
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="secondary" onClick={reset}>
          Clear my entries
        </Button>
        <Button variant="ghost" onClick={revealSolution}>
          Reveal solution
        </Button>
        <Button onClick={newGame}>New puzzle</Button>
      </div>
    </div>
  )
}
