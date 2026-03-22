import { daysUntil } from '../utils';

export default function DueBadge({ date }) {
  if (date==="N/A") return <span style={{ color:"#999",fontWeight:500,fontSize:10,fontFamily:"'JetBrains Mono',monospace" }}>N/A</span>;
  const d = daysUntil(date);
  if (d === null) return null;
  let c = "#6B7C8A";
  let l;
  if (d < 0) { c = "#FF3B30"; l = `${Math.abs(d)}d ago`; }
  else if (d === 0) { c = "#FF3B30"; l = "Today"; }
  else if (d === 1) { c = "#B8860B"; l = "Tmrw"; }
  else { l = new Date(date+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"}); }
  return <span style={{ color: c, fontWeight: d <= 1 ? 700 : 500, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }}>{l}</span>;
}
