export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};

export function daysUntil(d) {
  if (!d || d === "N/A") return null;
  const now = new Date(); now.setHours(0,0,0,0);
  return Math.ceil((new Date(d+"T00:00:00") - now) / 86400000);
}
