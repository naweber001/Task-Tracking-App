const STORE_KEY = "counseltrack_data";

export async function storageSet(data) {
  const json = JSON.stringify(data);
  try { localStorage.setItem(STORE_KEY, json); return true; } catch(e) {}
  return false;
}

export async function storageGet() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return null;
}
