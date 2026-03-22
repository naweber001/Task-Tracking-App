import { useT } from '../theme';
import { T, STATUSES } from '../constants';
import { daysUntil } from '../utils';
import DueBadge from './DueBadge';
import ConfirmBtn from './ConfirmBtn';
import SubItems from './SubItems';

export default function FlatTaskRow({ task, clientName, dealName, exp, onTog, menu, onTogMenu, onSetStatus, onToggleFlag, onEdit, onDel, onDragStart, hideDue, onUpdateSubs }) {
  const t = useT(); const isDark = t.bg===T.dark.bg;
  const sts = STATUSES[task.status];
  const late = task.status!=="complete"&&daysUntil(task.deadline)!==null&&daysUntil(task.deadline)<0;
  const done = task.status==="complete";
  const flagged = task.flagged&&!done;
  const subs = task.subItems||[];
  const subProgress = subs.length>0?`${subs.filter(s=>s.done).length}/${subs.length}`:"";

  return (
    <div style={{ background:flagged?(isDark?"#1A0A10":"#FFF0F0"):late?(isDark?"#1A0A10":"#FFF0F0"):t.card,borderRadius:8,marginBottom:4,border:late?`1.5px solid ${isDark?"#FF3B30":"#1A1A2E"}`:flagged?`1px solid #FF3B30`:t.cardBorder,boxShadow:late?t.cardShadowOverdue:t.cardShadow,opacity:done?.45:1,overflow:"hidden",transition:"all .2s",borderLeft:flagged?`3px solid #FF3B30`:late?`3px solid #FF3B30`:undefined }}>
      <div onClick={onTog} style={{ padding:"7px 8px 7px 10px",display:"flex",alignItems:"center",gap:4,cursor:"pointer",WebkitTapHighlightColor:"transparent" }}>
        <button onClick={e=>{e.stopPropagation();onSetStatus(done?"active":"complete");}} style={{ background:"none",border:"none",fontSize:14,cursor:"pointer",color:done?"#30D158":flagged?"#FF3B30":"#999",padding:0,flexShrink:0,minWidth:24,minHeight:24,display:"flex",alignItems:"center",justifyContent:"center" }}>{done?"●":"○"}</button>
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ fontSize:12,fontWeight:600,color:done?t.tx3:flagged?"#FF3B30":t.tx,textDecoration:done?"line-through":"none",transition:"color .2s" }}>{flagged?"🚩 ":""}{clientName?`${clientName} - `:""}{task.title}{subProgress&&<span style={{ fontSize:10,color:t.tx3,marginLeft:4 }}>({subProgress})</span>}</div>
        </div>
        {!hideDue&&<div style={{ flexShrink:0,marginLeft:2 }}><DueBadge date={task.deadline}/></div>}
        {onToggleFlag&&<button onClick={e=>{e.stopPropagation();onToggleFlag();}} style={{ background:"none",border:"none",fontSize:12,cursor:"pointer",color:task.flagged?"#FF3B30":t.tx3,padding:"2px 4px",flexShrink:0,minWidth:22,minHeight:24,display:"flex",alignItems:"center",justifyContent:"center" }}>{task.flagged?"🚩":"🏳"}</button>}
        {onTogMenu&&<button onClick={e=>{e.stopPropagation();onTogMenu();}} style={{ background:"none",border:"none",fontSize:11,cursor:"pointer",color:t.tx3,padding:"2px 4px",flexShrink:0,minWidth:22,minHeight:24,display:"flex",alignItems:"center",justifyContent:"center" }}>🖊️</button>}
        {onDragStart&&<div onTouchStart={e=>{e.stopPropagation();onDragStart(e);}} onMouseDown={e=>{e.stopPropagation();onDragStart(e);}} style={{
          flexShrink:0,marginLeft:1,padding:"4px 2px",cursor:"grab",touchAction:"none",userSelect:"none",WebkitUserSelect:"none",
          display:"flex",flexDirection:"column",gap:1,alignItems:"center",
        }}>
          <div style={{ display:"flex",gap:1.5 }}><div style={{ width:2,height:2,borderRadius:1,background:t.tx3 }}/><div style={{ width:2,height:2,borderRadius:1,background:t.tx3 }}/></div>
          <div style={{ display:"flex",gap:1.5 }}><div style={{ width:2,height:2,borderRadius:1,background:t.tx3 }}/><div style={{ width:2,height:2,borderRadius:1,background:t.tx3 }}/></div>
          <div style={{ display:"flex",gap:1.5 }}><div style={{ width:2,height:2,borderRadius:1,background:t.tx3 }}/><div style={{ width:2,height:2,borderRadius:1,background:t.tx3 }}/></div>
        </div>}
      </div>
      {menu&&<div style={{ padding:"6px 12px 10px",borderTop:`1px solid ${t.brd2}` }}>
        {task.notes&&<p style={{ fontSize:11,color:t.tx2,lineHeight:1.4,margin:"4px 0 8px" }}>{task.notes}</p>}
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {Object.entries(STATUSES).map(([k,v])=>(
            <button key={k} onClick={()=>onSetStatus(k)} style={{
              padding:"5px 10px",borderRadius:6,border:"none",fontSize:11,fontWeight:600,cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:4,
              background:task.status===k?`${v.color}20`:t.chip,
              color:task.status===k?v.color:t.tx3,
              outline:task.status===k?`2px solid ${v.color}`:"none",
            }}><span style={{ fontSize:12 }}>{v.icon}</span>{v.label}</button>
          ))}
          <button onClick={onEdit} style={{ padding:"5px 10px",borderRadius:6,border:"none",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:t.btn2,color:t.btn2Tx }}>Edit</button>
          <ConfirmBtn label="Delete" confirmLabel="Sure?" onConfirm={onDel} style={{ padding:"5px 10px",borderRadius:6,border:"none",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:t.danger,color:t.dangerTx }}/>
        </div>
      </div>}
      {exp&&onUpdateSubs&&<SubItems items={subs} onUpdate={onUpdateSubs}/>}
    </div>
  );
}
