/** Map punctuation to WinAnsi / ASCII so the standard Helvetica font stays selectable text. */
export function pdfSafe(input: string): string {
  return input
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201C|\u201D/g, '"')
    .replace(/\u2013|\u2014/g, '-')
    .replace(/\u00B7/g, '|');
}
