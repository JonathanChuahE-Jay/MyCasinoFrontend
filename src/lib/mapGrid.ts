import placeholder from '#/assets/common/slot-machine.png'
export function mapGrid(
  grid: (number | null)[][],
  symbolMap: Map<string, string>,
  wildcardImg: string,
): string[][] {
  if (grid.length === 0) return []
  const numCols = grid[0].length
  return Array.from({ length: numCols }, (_, c) =>
    grid.map((row) =>
      row[c] == null ? wildcardImg : (symbolMap.get(row[c]!) ?? placeholder),
    ),
  )
}