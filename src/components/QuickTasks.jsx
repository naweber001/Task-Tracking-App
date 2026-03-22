import { useState } from 'react';
import { useT } from '../theme';
import { todayStr } from '../utils';

export default function QuickTasks({ allItems, viewDate, onViewDateChange, onAdd, onToggle, onDelete, onClear }) {
  const t = useT();
  const [val, setVal] = useState("");
  const today = todayStr();
  const isToday = viewDate===today;
  const items = allItems.filter(q=>q.date===viewDate);
  const carriedOver = items.filter(i=>!i.done&&i.carriedOver);

  const allDates = [...new Set(allItems.map(q=>q.date))].sort();
  const curIdx = allDates.indexOf(viewDate);
  const hasPrev = curIdx>0 || (curIdx===-1 && allDates.length>0 && allDates[allDates.length-1]<viewDate);
  const hasNext = !isToday;

  const goPrev = () => { if (curIdx>0) onViewDateChange(allDates[curIdx-1]); else if (curIdx===-1 && allDates.length>0) { const prev = allDates.filter(d=>d<viewDate); if (prev.length) onViewDateChange(prev[prev.length-1]); }};
  const goNext = () => { if (curIdx>=0 && curIdx<allDates.length-1) onViewDateChange(allDates[curIdx+1]); else onViewDateChange(today); };
  const add = () => { if(val.trim()){ onAdd(val.trim()); setVal(""); }};
  const fmtDate = (d) => new Date(d+"T00:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});

  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,padding:"4px 0" }}>
        <button onClick={goPrev} disabled={!hasPrev} style={{ background:"none",border:"none",fontSize:18,color:hasPrev?t.tx2:t.tx3,cursor:hasPrev?"pointer":"default",padding:"4px 10px",opacity:hasPrev?1:.3,minWidth:36,minHeight:36,display:"flex",alignItems:"center",justifyContent:"center" }}>‹</button>
        <div style={{ textAlign:"center" }}>
          <span style={{ fontSize:13,fontWeight:600,color:isToday?t.accent:t.tx2 }}>{fmtDate(viewDate)}</span>
          {isToday&&<span style={{ fontSize:10,color:t.accent,marginLeft:6 }}>Today</span>}
          {!isToday&&<button onClick={()=>onViewDateChange(today)} style={{ background:`${t.accent}18`,border:"none",borderRadius:6,fontSize:10,fontWeight:600,color:t.accent,cursor:"pointer",padding:"2px 8px",marginLeft:6,fontFamily:"'DM Sans',sans-serif" }}>Go to today</button>}
        </div>
        <button onClick={goNext} disabled={!hasNext} style={{ background:"none",border:"none",fontSize:18,color:hasNext?t.tx2:t.tx3,cursor:hasNext?"pointer":"default",padding:"4px 10px",opacity:hasNext?1:.3,minWidth:36,minHeight:36,display:"flex",alignItems:"center",justifyContent:"center" }}>›</button>
      </div>

      {isToday&&<div style={{ display:"flex",gap:8,marginBottom:12 }}>
        <input value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")add();}}
          placeholder="Add a quick task..." autoFocus
          style={{ flex:1,padding:"10px 12px",border:`1.5px solid ${t.inp}`,borderRadius:10,fontSize:14,fontFamily:"'DM Sans',sans-serif",color:t.tx,background:t.inpBg,outline:"none",boxSizing:"border-box",WebkitAppearance:"none" }}/>
        <button onClick={add} style={{ background:t.accent,border:"none",borderRadius:10,color:"#fff",fontSize:13,fontWeight:700,padding:"10px 16px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",flexShrink:0 }}>Add</button>
      </div>}

      {items.length===0&&<div style={{ fontSize:13,color:t.tx3,textAlign:"center",padding:"16px 0" }}>{isToday?"Jot down quick to-dos for today.":"No quick tasks on this day."}</div>}

      {isToday&&carriedOver.length>0&&<div style={{ fontSize:10,fontWeight:700,color:"#B8860B",textTransform:"uppercase",letterSpacing:".05em",padding:"4px 0 4px" }}>Carried over</div>}
      {isToday&&carriedOver.map(item=>(
        <div key={item.id} style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:`1px solid ${t.brd2}` }}>
          <button onClick={()=>onToggle(item.id)} style={{ background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#999",padding:0,flexShrink:0,minWidth:32,minHeight:32,display:"flex",alignItems:"center",justifyContent:"center" }}>○</button>
          <span style={{ flex:1,fontSize:14,color:"#B8860B" }}>{item.text}</span>
          <button onClick={()=>onDelete(item.id)} style={{ background:"none",border:"none",color:t.tx3,fontSize:15,cursor:"pointer",padding:"4px 8px",borderRadius:4 }}>×</button>
        </div>
      ))}

      {isToday&&carriedOver.length>0&&items.filter(i=>!i.carriedOver||i.done).length>0&&<div style={{ fontSize:10,fontWeight:700,color:t.tx3,textTransform:"uppercase",letterSpacing:".05em",padding:"8px 0 4px" }}>Today</div>}
      {(isToday?items.filter(i=>!i.carriedOver||i.done):items).map(item=>(
        <div key={item.id} style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:`1px solid ${t.brd2}` }}>
          {isToday?<button onClick={()=>onToggle(item.id)} style={{ background:"none",border:"none",fontSize:18,cursor:"pointer",color:item.done?"#30D158":"#999",padding:0,flexShrink:0,minWidth:32,minHeight:32,display:"flex",alignItems:"center",justifyContent:"center" }}>{item.done?"●":"○"}</button>
          :<span style={{ fontSize:18,color:item.done?"#30D158":"#999",flexShrink:0,minWidth:32,textAlign:"center" }}>{item.done?"●":"○"}</span>}
          <span style={{ flex:1,fontSize:14,color:item.done?t.tx3:t.tx,textDecoration:item.done?"line-through":"none" }}>{item.text}</span>
          {isToday&&<button onClick={()=>onDelete(item.id)} style={{ background:"none",border:"none",color:t.tx3,fontSize:15,cursor:"pointer",padding:"4px 8px",borderRadius:4 }}>×</button>}
        </div>
      ))}

      {isToday&&items.length>0&&items.every(i=>i.done)&&(
        <button onClick={onClear} style={{ width:"100%",padding:"10px",marginTop:10,background:"none",border:`1px dashed ${t.brd}`,borderRadius:10,fontSize:12,fontWeight:600,color:t.tx3,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>Clear completed</button>
      )}
    </div>
  );
}
