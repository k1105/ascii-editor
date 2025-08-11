export type NewlineType = 'lf' | 'crlf';

export interface GridToTextOptions {
  newline?: NewlineType;
  bom?: boolean;
  asciiMode?: boolean;
  darkChar?: string;
  lightChar?: string;
}

export function gridToText(
  grid: string[][],
  opts: GridToTextOptions = {}
): string {
  const {
    newline = 'lf',
    asciiMode = false,
    darkChar = '@',
    lightChar = ' '
  } = opts;

  // 改行文字の選択
  const lineEnding = newline === 'crlf' ? '\r\n' : '\n';

  // 各行を処理
  const lines = grid.map(row => {
    if (asciiMode) {
      // ASCII等幅モード：dark/lightのみを置換、他の文字はそのまま
      return row.map(cell => {
        if (cell === '█') return darkChar;
        if (cell === ' ') return lightChar;
        return cell; // 任意文字はそのまま
      }).join('');
    } else {
      // 通常モード：スペースをem spaceに置換して幅を調整
      return row.map(cell => {
        if (cell === ' ') return '\u2003'; // em space for better width matching
        return cell;
      }).join('');
    }
  });

  // 行を結合
  return lines.join(lineEnding);
}

export function getTextStats(text: string): {
  lines: number;
  chars: number;
  charsWithoutNewlines: number;
} {
  const lines = text.split(/\r\n|\n|\r/).length;
  const chars = text.length;
  const charsWithoutNewlines = text.replace(/\r\n|\n|\r/g, '').length;

  return {
    lines,
    chars,
    charsWithoutNewlines
  };
}

export function generateFilename(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  
  return `ascii-${year}${month}${day}-${hour}${minute}.txt`;
}