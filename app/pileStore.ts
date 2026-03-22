// Global pile store — import this in any screen to read or add items

export type PileItem = {
  name: string;
  compostable: boolean;
  cn_ratio: number; // numeric C:N ratio from Gemini
  addedAt: number;
};

// The pile — lives in memory for the session
let pile: PileItem[] = [];

export function getPile(): PileItem[] {
  return pile;
}

export function addToPile(item: PileItem) {
  pile = [item, ...pile];
}

export function clearPile() {
  pile = [];
}

export function getAvgCN(): number {
  const compostable = pile.filter((i) => i.compostable && i.cn_ratio > 0);
  if (compostable.length === 0) return 27.5;
  return compostable.reduce((sum, i) => sum + i.cn_ratio, 0) / compostable.length;
}

export function getHealthScore(): number {
  const avgCN = getAvgCN();
  return Math.max(0, Math.round(100 - Math.abs(avgCN - 27.5) * 1.5));
}
