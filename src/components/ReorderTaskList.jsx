import { useT } from '../theme';
import { T, STATUSES } from '../constants';
import { daysUntil } from '../utils';
import DueBadge from './DueBadge';
import DragList from './DragList';
import ConfirmBtn from './ConfirmBtn';

export default function ReorderTaskList({ tasks: rawTasks, dealId, expTask, setExpTask, onCycle, onSetStatus, onEdit, onDel, onReorder }) {
  const t = useT(); const isDark = t.bg===T.dark.bg;
  const sorted = [...rawTasks].sort((a,b)=>(a.order||0)-(b.order||0));

  const handleReorder = (fromIdx, toIdx) => {
    const newArr = [...sorted];
    const [moved] = newArr.splice(fromIdx, 1);
    newArr.splice(toIdx, 0, moved);
    onReorder(dealId, newArr.map(t=>t.id));
  };

  return (
    <DragList items={sorted} onReorder={handleReorder} renderItem={(task, idx, onDragStart) => {
      const sts=STATUSES[task.status];
      const late=task.status!=="complete"&&daysUntil(task.deadline)!==null&&daysUntil(task.deadline)<0;
      const isExp=expTask===task.id;
      const flagged=task.flagged&&task.status!=="complete";
      return (
        <div style={{ borderBottom:`1px solid ${t.brd2}`,opacity:task.status==="complete"?.5:1,background:flagged?(isDark?"#1A0A10":"#FFF0F0"):late?t.overdue:t.card,borderLeft:flagged?`3px solid #FF3B30`:"none" }}>
          <div style={{ display:"flex",alignItems:"center",padding:"0" }}>
            <div onClick={()=>setExpTask(isExp?null:task.id)} style={{ flex:1,padding:"12px 12px 12px 16px",display:"flex",alignItems:"center",gap:10,cursor:"pointer",WebkitTapHighlightColor:"transparent" }}>
              <button onClick={e=>{e.stopPropagation();onCycle(task.id);}} style={{ background:"none",border:"none",fontSize:22,cursor:"pointer",color:sts.color,padding:0,flexShrink:0,minWidth:36,minHeight:36,display:"flex",alignItems:"center",justifyContent:"center" }}>{sts.icon}</button>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:14,fontWeight:600,color:flagged?"#FF3B30":t.tx,textDecoration:task.status==="complete"?"line-through":"none", }}>{flagged?"🚩 ":""}{task.title}</div>
                <div style={{ display:"flex",gap:8,alignItems:"center",marginTop:3,flexWrap:"wrap" }}>
                  {task.assignee!=="Unassigned"&&<span style={{ fontSize:11,color:t.tx2 }}>{task.assignee}</span>}
                </div>
              </div>
              <div style={{ flexShrink:0 }}><DueBadge date={task.deadline}/></div>
            </div>
            {sorted.length>1&&<div onTouchStart={e=>{e.stopPropagation();onDragStart(e);}} onMouseDown={e=>{e.stopPropagation();onDragStart(e);}} style={{
              flexShrink:0,padding:"12px 12px 12px 4px",cursor:"grab",touchAction:"none",userSelect:"none",WebkitUserSelect:"none",
              display:"flex",flexDirection:"column",gap:2,alignItems:"center",
            }}>
              <div style={{ display:"flex",gap:2 }}><div style={{ width:3,height:3,borderRadius:2,background:t.tx3 }}/><div style={{ width:3,height:3,borderRadius:2,background:t.tx3 }}/></div>
              <div style={{ display:"flex",gap:2 }}><div style={{ width:3,height:3,borderRadius:2,background:t.tx3 }}/><div style={{ width:3,height:3,borderRadius:2,background:t.tx3 }}/></div>
              <div style={{ display:"flex",gap:2 }}><div style={{ width:3,height:3,borderRadius:2,background:t.tx3 }}/><div style={{ width:3,height:3,borderRadius:2,background:t.tx3 }}/></div>
            </div>}
          </div>
          {isExp&&<div style={{ padding:"0 16px 12px" }}>
            {task.notes&&<p style={{ fontSize:13,color:t.tx2,lineHeight:1.5,margin:"4px 0 10px" }}>{task.notes}</p>}
            <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:12 }}>
              {Object.entries(STATUSES).map(([k,v])=>(
                <button key={k} onClick={()=>onSetStatus(task.id,k)} style={{
                  padding:"6px 12px",borderRadius:8,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",
                  fontFamily:"'DM Sans',sans-serif",minHeight:32,display:"flex",alignItems:"center",gap:5,
                  background:task.status===k?`${v.color}20`:t.chip,color:task.status===k?v.color:t.tx3,
                  outline:task.status===k?`2px solid ${v.color}`:"none",
                }}><span style={{ fontSize:14 }}>{v.icon}</span>{v.label}</button>
              ))}
            </div>
            <div style={{ display:"flex",gap:8,justifyContent:"flex-end" }}>
              <button onClick={()=>onEdit(task)} style={{ background:t.btn2,border:"none",borderRadius:10,padding:"10px 18px",fontSize:14,fontWeight:600,color:t.btn2Tx,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",minHeight:40 }}>Edit</button>
              <button onClick={()=>onDel(task.id)} style={{ background:t.danger,border:"none",borderRadius:10,padding:"10px 18px",fontSize:14,fontWeight:600,color:t.dangerTx,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",minHeight:40 }}>Delete</button>
            </div>
          </div>}
        </div>
      );
    }}/>
  );
}
