export type Grid = number[][]

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function isSafe(grid: Grid, row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num) return false
  }
  const br = row - (row % 3)
  const bc = col - (col % 3)
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (grid[br + r][bc + c] === num) return false
    }
  }
  return true
}

function fill(grid: Grid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (const num of shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
          if (isSafe(grid, row, col, num)) {
            grid[row][col] = num
            if (fill(grid)) return true
            grid[row][col] = 0
          }
        }
        return false
      }
    }
  }
  return true
}

export function generatePuzzle(clues = 34): { puzzle: Grid; solution: Grid } {
  const solution: Grid = Array.from({ length: 9 }, () => Array(9).fill(0))
  fill(solution)
  const puzzle = solution.map((row) => [...row])
  const cellsToRemove = 81 - clues
  const positions = shuffled(Array.from({ length: 81 }, (_, i) => i)).slice(0, cellsToRemove)
  positions.forEach((pos) => {
    puzzle[Math.floor(pos / 9)][pos % 9] = 0
  })
  return { puzzle, solution }
}

export function findConflicts(grid: Grid): Set<string> {
  const conflicts = new Set<string>()
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const val = grid[row][col]
      if (!val) continue
      for (let i = 0; i < 9; i++) {
        if (i !== col && grid[row][i] === val) conflicts.add(`${row}-${col}`)
        if (i !== row && grid[i][col] === val) conflicts.add(`${row}-${col}`)
      }
      const br = row - (row % 3)
      const bc = col - (col % 3)
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const rr = br + r
          const cc = bc + c
          if ((rr !== row || cc !== col) && grid[rr][cc] === val) conflicts.add(`${row}-${col}`)
        }
      }
    }
  }
  return conflicts
}

export function isComplete(grid: Grid): boolean {
  return grid.every((row) => row.every((cell) => cell !== 0)) && findConflicts(grid).size === 0
}
