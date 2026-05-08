function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export async function getItems<T extends { id: string }>(key: string): Promise<T[]> {
  const storage = useStorage('data')
  const items = await storage.getItem<T[]>(key)
  return items || []
}

export async function setItems<T>(key: string, items: T[]): Promise<void> {
  const storage = useStorage('data')
  await storage.setItem(key, items)
}

export async function addItem<T extends { id: string }>(key: string, item: Omit<T, 'id'>): Promise<T> {
  const items = await getItems<T>(key)
  const newItem = { ...item, id: generateId() } as unknown as T
  items.push(newItem)
  await setItems(key, items)
  return newItem
}

export async function updateItem<T extends { id: string }>(key: string, id: string, updates: Partial<T>): Promise<T | null> {
  const items = await getItems<T>(key)
  const index = items.findIndex(item => item.id === id)
  if (index === -1) return null
  items[index] = { ...items[index], ...updates } as T
  await setItems(key, items)
  return items[index] ?? null
}

export async function deleteItem<T extends { id: string }>(key: string, id: string): Promise<boolean> {
  const items = await getItems<T>(key)
  const filtered = items.filter(item => item.id !== id)
  if (filtered.length === items.length) return false
  await setItems(key, filtered)
  return true
}
