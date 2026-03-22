import { useState } from 'react';
import { useT } from '../theme';
import { T, STATUSES } from '../constants';

export default function SearchPanel({ clients, deals, tasks, associates, onSelectTask, onSelectClient, onSelectAssociate }) {
  const t = useT(); const isDark = t.bg===T.dark.bg;
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const matchedTasks = query ? tasks.filter(tk => {
    const cl = clients.find(c=>c.id===tk.clientId)?.name||"";
    const dl = deals.find(d=>d.id===tk.dealId)?.name||"";
    return tk.title.toLowerCase().includes(query) || tk.notes?.toLowerCase().includes(query) ||
      cl.toLowerCase().includes(query) || dl.toLowerCase().includes(query) ||
      tk.assignee?.toLowerCase().includes(query);
  }).slice(0, 15) : [];

  const matchedClients = query ? clients.filter(c => c.name.toLowerCase().includes(query)).slice(0, 5) : [];
  const matchedDeals = query ? deals.filter(d => !d.isMisc && d.name.toLowerCase().includes(query)).slice(0, 5) : [];
  const matchedAssoc = query ? associates.filter(a => a !== "Unassigned" && a.toLowerCase().includes(query)).slice(0, 5) : [];

  const noResults = query && matchedTasks.length === 0 && matchedClients.length === 0 && matchedDeals.length === 0 && matchedAssoc.length === 0;

  return (
    <div>
      <input value={q} onChange={e=>setQ(e.target.value)} autoFocus placeholder="Search tasks, clients, matters..."
        style={{ width:"100%",padding:"11px 14px",border:`1.5px solid ${t.inp}`,borderRadius:10,fontSize:16,fontFamily:"'DM Sans',sans-serif",color:t.tx,background:t.inpBg,outline:"none",boxSizing:"border-box",WebkitAppearance:"none",marginBottom:12 }}/>

      {!query&&<div style={{ textAlign:"center",padding:"20px 0",color:t.tx3,fontSize:13 }}>Type to search across everything.</div>}
      {noResults&&<div style={{ textAlign:"center",padding:"20px 0",color:t.tx3,fontSize:13 }}>No results for "{q}"</div>}

      {matchedClients.length>0&&<div style={{ marginBottom:12 }}>
        <div style={{ fontSize:10,fontWeight:700,color:t.tx3,textTransform:"uppercase",letterSpacing:".05em",marginBottom:6 }}>Clients</div>
        {matchedClients.map(cl=>(
          <div key={cl.id} onClick={()=>onSelectClient(cl.id)} style={{ padding:"10px 12px",marginBottom:4,background:t.card,borderRadius:10,cursor:"pointer",boxShadow:t.cardShadow }}>
            <div style={{ fontSize:14,fontWeight:600,color:t.tx }}>{cl.name}</div>
            {cl.isAdmin&&<div style={{ fontSize:11,color:t.tx3,fontStyle:"italic" }}>Administrative</div>}
          </div>
        ))}
      </div>}

      {matchedDeals.length>0&&<div style={{ marginBottom:12 }}>
        <div style={{ fontSize:10,fontWeight:700,color:t.tx3,textTransform:"uppercase",letterSpacing:".05em",marginBottom:6 }}>Matters</div>
        {matchedDeals.map(dl=>{
          const cl=clients.find(c=>c.id===dl.clientId);
          return (
            <div key={dl.id} onClick={()=>onSelectClient(dl.clientId)} style={{ padding:"10px 12px",marginBottom:4,background:t.card,borderRadius:10,cursor:"pointer",boxShadow:t.cardShadow }}>
              <div style={{ fontSize:14,fontWeight:600,color:t.tx }}>{dl.name}</div>
              {cl&&<div style={{ fontSize:11,color:t.tx2 }}>{cl.name}</div>}
            </div>
          );
        })}
      </div>}

      {matchedAssoc.length>0&&<div style={{ marginBottom:12 }}>
        <div style={{ fontSize:10,fontWeight:700,color:t.tx3,textTransform:"uppercase",letterSpacing:".05em",marginBottom:6 }}>Associates</div>
        {matchedAssoc.map(name=>(
          <div key={name} onClick={()=>onSelectAssociate(name)} style={{ padding:"10px 12px",marginBottom:4,background:t.card,borderRadius:10,cursor:"pointer",boxShadow:t.cardShadow }}>
            <div style={{ fontSize:14,fontWeight:600,color:t.tx }}>{name}</div>
          </div>
        ))}
      </div>}

      {matchedTasks.length>0&&<div>
        <div style={{ fontSize:10,fontWeight:700,color:t.tx3,textTransform:"uppercase",letterSpacing:".05em",marginBottom:6 }}>Tasks</div>
        {matchedTasks.map(task=>{
          const cl=clients.find(c=>c.id===task.clientId);
          const dl=deals.find(d=>d.id===task.dealId);
          const sts=STATUSES[task.status];
          const done=task.status==="complete";
          return (
            <div key={task.id} onClick={()=>onSelectTask(task)} style={{ padding:"10px 12px",marginBottom:4,background:task.flagged&&!done?(isDark?"#1A0A10":"#FFF0F0"):t.card,borderRadius:10,cursor:"pointer",boxShadow:t.cardShadow,opacity:done?.5:1,border:task.flagged&&!done?"1px solid #FF3B30":t.cardBorder,borderLeft:task.flagged&&!done?`3px solid #FF3B30`:undefined }}>
              <div style={{ fontSize:14,fontWeight:600,color:done?t.tx3:task.flagged?"#FF3B30":t.tx,textDecoration:done?"line-through":"none" }}>{task.flagged&&!done?"🚩 ":""}{cl?`${cl.name} - `:""}{task.title}</div>
              <div style={{ fontSize:11,color:t.tx2,marginTop:2,display:"flex",gap:6,alignItems:"center",flexWrap:"wrap" }}>
                {dl&&!dl.isMisc&&<span>{dl.name}</span>}
                <span style={{ color:sts?.color }}>{sts?.icon}</span>
                {task.deadline&&task.deadline!=="N/A"&&<span>· {task.deadline.slice(5)}</span>}
              </div>
            </div>
          );
        })}
      </div>}
    </div>
  );
}
