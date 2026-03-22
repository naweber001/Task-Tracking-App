import { useT } from '../theme';
import { uid } from '../utils';
import DragList from './DragList';

export default function SubItems({ items, onUpdate }) {
  const t = useT();
  const subs = items||[];
  const toggle = (idx) => { const n=[...subs]; n[idx]={...n[idx],done:!n[idx].done}; onUpdate(n); };
  const add = (text) => { onUpdate([...subs, {id:uid(),text,done:false}]); };
  const remove = (idx) => { onUpdate(subs.filter((_,i)=>i!==idx)); };
  const reorder = (from, to) => { const n=[...subs]; const [moved]=n.splice(from,1); n.splice(to,0,moved); onUpdate(n); };
  return <div style={{ padding:"6px 14px 10px",borderTop:`1px solid ${t.brd2}` }}>
    <DragList items={subs.map((s,i)=>({...s,_idx:i}))} onReorder={reorder} renderItem={(s, idx, onDragStart) => (
      <div style={{ display:"flex",alignItems:"center",gap:5,padding:"4px 0" }}>
        <button onClick={()=>toggle(s._idx)} style={{ background:"none",border:"none",fontSize:12,cursor:"pointer",color:s.done?"#30D158":"#999",padding:0,flexShrink:0,minWidth:20,minHeight:20,display:"flex",alignItems:"center",justifyContent:"center" }}>{s.done?"●":"○"}</button>
        <span style={{ fontSize:11,color:s.done?t.tx3:t.tx,textDecoration:s.done?"line-through":"none",flex:1 }}>{s.text}</span>
        <button onClick={()=>remove(s._idx)} style={{ background:"none",border:"none",color:t.tx3,fontSize:10,cursor:"pointer",padding:"2px 4px",flexShrink:0 }}>×</button>
        {onDragStart&&<div onTouchStart={e=>{e.stopPropagation();onDragStart(e);}} onMouseDown={e=>{e.stopPropagation();onDragStart(e);}} style={{
          flexShrink:0,padding:"3px 2px",cursor:"grab",touchAction:"none",userSelect:"none",WebkitUserSelect:"none",
          display:"flex",flexDirection:"column",gap:1,alignItems:"center",
        }}>
          <div style={{ display:"flex",gap:1.5 }}><div style={{ width:2,height:2,borderRadius:1,background:t.tx3 }}/><div style={{ width:2,height:2,borderRadius:1,background:t.tx3 }}/></div>
          <div style={{ display:"flex",gap:1.5 }}><div style={{ width:2,height:2,borderRadius:1,background:t.tx3 }}/><div style={{ width:2,height:2,borderRadius:1,background:t.tx3 }}/></div>
        </div>}
      </div>
    )}/>
    <div style={{ marginTop:4 }}>
      <input placeholder="+ Add sub-item" onKeyDown={e=>{if(e.key==="Enter"&&e.target.value.trim()){add(e.target.value.trim());e.target.value="";}}} style={{ width:"100%",padding:"6px 8px",borderRadius:6,border:`1px solid ${t.brd}`,background:t.inpBg||t.card,color:t.tx,fontSize:11,fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box",outline:"none" }}/>
    </div>
  </div>;
}
