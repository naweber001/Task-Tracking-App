import { useT } from '../theme';
import { T } from '../constants';

export default function MonthCal({ year, month, onPrev, onNext, tasks, reminders=[], selDate, onSelect }) {
  const t = useT();
  const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const today = new Date(); today.setHours(0,0,0,0);
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();

  const deadlineMap = {};
  tasks.forEach(tk => {
    if (!tk.deadline || tk.status==="complete") return;
    const [y,m] = tk.deadline.split("-").map(Number);
    if (y===year && m===month+1) {
      deadlineMap[tk.deadline] = (deadlineMap[tk.deadline]||0) + 1;
    }
  });

  const reminderMap = {};
  reminders.forEach(r => {
    const [y,m] = r.date.split("-").map(Number);
    if (y===year && m===month+1) {
      reminderMap[r.date] = (reminderMap[r.date]||0) + 1;
    }
  });

  const cells = [];
  for (let i=0; i<firstDay; i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(d);

  return (
    <div style={{ padding:"12px 16px 8px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
        <button onClick={onPrev} style={{ background:"none",border:"none",fontSize:18,color:t.tx2,cursor:"pointer",padding:"4px 12px",minHeight:36,minWidth:36,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8 }}>‹</button>
        <div style={{ fontSize:15,fontWeight:700,color:t.tx,fontFamily:"'DM Sans',sans-serif" }}>{MONTHS[month]} {year}</div>
        <button onClick={onNext} style={{ background:"none",border:"none",fontSize:18,color:t.tx2,cursor:"pointer",padding:"4px 12px",minHeight:36,minWidth:36,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8 }}>›</button>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,textAlign:"center" }}>
        {DAYS.map(d=>(
          <div key={d} style={{ fontSize:10,fontWeight:700,color:t.tx3,padding:"4px 0",textTransform:"uppercase",letterSpacing:".04em" }}>{d}</div>
        ))}
        {cells.map((day,i) => {
          if (day===null) return <div key={`e${i}`}/>;
          const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          const count = deadlineMap[dateStr]||0;
          const remCount = reminderMap[dateStr]||0;
          const isToday = dateStr===todayStr;
          const isSel = dateStr===selDate;
          const hasDeadlines = count>0;
          const hasReminders = remCount>0;

          return (
            <button key={dateStr} onClick={()=>onSelect(isSel?null:dateStr)} style={{
              background: isSel ? t.accent : isToday ? (t===T.dark?"rgba(123,147,255,.15)":"rgba(26,26,46,.08)") : "none",
              border:"none", borderRadius:8, padding:"6px 2px 4px", cursor:"pointer",
              display:"flex", flexDirection:"column", alignItems:"center", gap:1,
              minHeight:36, justifyContent:"center", position:"relative",
              WebkitTapHighlightColor:"transparent",
            }}>
              <span style={{
                fontSize:13, fontWeight:isToday||isSel?700:400,
                color: isSel ? "#fff" : isToday ? t.accent : (hasDeadlines||hasReminders) ? t.tx : t.tx3,
                fontFamily:"'JetBrains Mono',monospace",
              }}>{day}</span>
              {(hasDeadlines||hasReminders) && (
                <div style={{ display:"flex",gap:2,alignItems:"center",height:6 }}>
                  {hasDeadlines && (count<=3 ? Array.from({length:count}).map((_,j)=>(
                    <div key={`t${j}`} style={{ width:4,height:4,borderRadius:2,background:isSel?"rgba(255,255,255,.7)":"#FF3B30" }}/>
                  )) : (
                    <span style={{ fontSize:8,fontWeight:700,color:isSel?"rgba(255,255,255,.8)":"#FF3B30",fontFamily:"'JetBrains Mono',monospace" }}>{count}</span>
                  ))}
                  {hasReminders && <div style={{ width:4,height:4,borderRadius:2,background:isSel?"rgba(255,255,255,.7)":"#B8860B" }}/>}
                </div>
              )}
            </button>
          );
        })}
      </div>
      {selDate && (
        <button onClick={()=>onSelect(null)} style={{
          display:"block",margin:"8px auto 0",background:"none",border:"none",
          fontSize:12,color:t.accent,fontWeight:600,cursor:"pointer",padding:"4px 12px",
          fontFamily:"'DM Sans',sans-serif",
        }}>Clear date filter</button>
      )}
    </div>
  );
}
