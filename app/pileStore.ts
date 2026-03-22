// Global pile store — import this in any screen to read or add items

export type PileItem = {
  name: string;
  compostable: boolean;
  cn_ratio: string;
  addedAt: number;
};

// CN ratio string from Gemini → numeric value for health calculations
const CN_MAP: Record<string, number> = {
  "high nitrogen": 15,
  "high carbon": 200,
  "balanced": 28,
  "not applicable": 0,
  "unknown": 28,
};

export function cnRatioToNumber(cn_ratio: string): number {
  return CN_MAP[cn_ratio.toLowerCase()] ?? 28;
}

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
