// Journal storage. This replaces Base44's JournalEntry entity.
//
// Entries are saved in the browser (localStorage) on the device. Every function
// is async and mirrors a typical database API (list / create / update / remove),
// so moving to a real backend later — Supabase, Firebase, your own API — only
// means rewriting this one file.

const KEY = "zadex_journal_v1";

const uid = () =>
  (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(entries) {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries));
  } catch (e) {
    // Most likely the storage quota (photos are the usual cause).
    console.error("Could not save journal", e);
    throw new Error("Storage is full. Try removing a photo or an old entry.");
  }
}

const byDateDesc = (a, b) =>
  `${b.entry_date || ""} ${b.entry_time || ""}`.localeCompare(`${a.entry_date || ""} ${a.entry_time || ""}`);

export const journalStore = {
  /** Returns entries newest-first, or null if nothing has ever been saved. */
  async list() {
    const all = read();
    return all ? [...all].sort(byDateDesc) : null;
  },

  async bulkCreate(items) {
    const now = new Date().toISOString();
    const created = items.map((x) => ({ ...x, id: uid(), created_date: now }));
    write([...(read() || []), ...created]);
    return created;
  },

  async create(item) {
    const entry = { ...item, id: uid(), created_date: new Date().toISOString() };
    write([entry, ...(read() || [])]);
    return entry;
  },

  async update(id, patch) {
    let updated = null;
    const all = (read() || []).map((e) => (e.id === id ? (updated = { ...e, ...patch }) : e));
    write(all);
    return updated;
  },

  async remove(id) {
    write((read() || []).filter((e) => e.id !== id));
  },
};

// Photos: shrunk to ~800px JPEG and stored inline with the entry.
export function compressImage(file, maxSize = 800, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    img.src = url;
  });
}
