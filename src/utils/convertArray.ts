export const parseStringArray = (value: string | null): string[] =>
  value ? value.split(',') : [];

export const parseNumberArray = (value: string | null): number[] =>
  value ? value.split(',').map(Number) : [];