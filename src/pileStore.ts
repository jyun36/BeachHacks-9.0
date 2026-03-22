import AsyncStorage from "@react-native-async-storage/async-storage";

export type PileItem = {
  id: string;
  item: string;
  cn_ratio: number;
  decomp_weeks: number;
  methane: string;
  reason: string;
  addedAt: string;
};

const KEY = "compost_pile";

// Get all items in the pile
export async function getPile(): Promise<PileItem[]> {
  try {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Add one item to the pile
export async function addToPile(item: Omit<PileItem, "id" | "addedAt">): Promise<void> {
  try {
    const pile = await getPile();
    const newItem: PileItem = {
      ...item,
      id: Date.now().toString(),
      addedAt: new Date().toISOString(),
    };
    pile.push(newItem);
    await AsyncStorage.setItem(KEY, JSON.stringify(pile));
  } catch (e) {
    console.error("Failed to add to pile:", e);
  }
}

// Remove one item by id
export async function removeFromPile(id: string): Promise<void> {
  try {
    const pile = await getPile();
    const updated = pile.filter(item => item.id !== id);
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to remove from pile:", e);
  }
}

// Clear the entire pile
export async function clearPile(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {
    console.error("Failed to clear pile:", e);
  }
}

// Get pile stats
export async function getPileStats() {
  const pile = await getPile();
  if (pile.length === 0) return null;

  const avgCN = pile.reduce((s, i) => s + i.cn_ratio, 0) / pile.length;
  const avgWeeks = pile.reduce((s, i) => s + i.decomp_weeks, 0) / pile.length;

  return {
    totalItems: pile.length,
    avgCN: Math.round(avgCN),
    avgWeeks: Math.round(avgWeeks),
  };
}