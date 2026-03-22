import { useState } from 'react';
import { useT } from '../theme';
import { useInp, useSel } from '../hooks/useInputStyles';
import { STATUSES } from '../constants';
import Label from './Label';

export default function TaskForm({ task, clients, deals, associates, defClient, defDeal, defDeadline, onSave, onSaveTemplate, onCancel }) {
  const t = useT(); const inp = useInp(); const sel = useSel();
  const [title, setTitle] = useState(task?.title||"");
  const [notes, setNotes] = useState(task?.notes||"");
  const [sts, setSts] = useState(task?.status||"active");
  const [who, setWho] = useState(task?.assignee||"Unassigned");
  const [due, setDue] = useState(task?.deadline||defDeadline||"");
  const [tmplSaved, setTmplSaved] = useState(false);

  const initClient = task?.clientId||defClient||clients[0]?.id||"";
  const getMiscId = (cid) => deals.find(d=>d.clientId===cid&&d.isMisc)?.id||"";
  const initDeal = task?.dealId||defDeal||(initClient?getMiscId(initClient):"");

  const [cid, setCid] = useState(initClient);
  const [did, setDid] = useState(initDeal);

  const avail = deals.filter(d=>d.clientId===cid);
  const regularDeals = avail.filter(d=>!d.isMisc).sort((a,b)=>a.name.localeCompare(b.name));
  const miscDeal = avail.find(d=>d.isMisc);
  const sortedDeals = [...regularDeals,...(miscDeal?[miscDeal]:[])];

  const chgClient = v => {
    setCid(v);
    const newMisc = deals.find(d=>d.clientId===v&&d.isMisc);
    setDid(newMisc?.id||"");
  };

  return <div>
    <Label text="Client"><select style={sel} value={cid} onChange={e=>chgClient(e.target.value)}>{clients.length===0&&<option value="">No clients</option>}{[...clients].sort((a,b)=>{if(a.isAdmin&&!b.isAdmin)return -1;if(!a.isAdmin&&b.isAdmin)return 1;return a.name.localeCompare(b.name);}).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Label>
    <Label text="Matter"><select style={sel} value={did} onChange={e=>setDid(e.target.value)}>
      {sortedDeals.map(d=><option key={d.id} value={d.id}>{d.isMisc?"Miscellaneous":d.name}</option>)}
    </select></Label>
    <Label text="Task"><input style={inp} placeholder="e.g. Draft SPA" value={title} onChange={e=>setTitle(e.target.value)}/></Label>
    <Label text="Notes"><textarea style={{...inp,minHeight:56,resize:"vertical"}} placeholder="Additional context..." value={notes} onChange={e=>setNotes(e.target.value)}/></Label>
    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
      <Label text="Status"><select style={sel} value={sts} onChange={e=>setSts(e.target.value)}>{Object.entries(STATUSES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></Label>
      <Label text="Current Owner"><select style={sel} value={who} onChange={e=>setWho(e.target.value)}>
        <option value="Unassigned">Unassigned</option>
        <option value="Client">Client</option>
        <option value="Counterparty">Counterparty</option>
        {associates.filter(a=>a!=="Unassigned").sort((a,b)=>a.localeCompare(b)).length>0&&<option disabled>──────</option>}
        {associates.filter(a=>a!=="Unassigned").sort((a,b)=>a.localeCompare(b)).map(a=><option key={a} value={a}>{a}</option>)}
      </select></Label>
      <Label text="Deadline">
        <div style={{ display:"flex",gap:8,alignItems:"center" }}>
          <input type="date" style={{...inp,flex:1,opacity:due==="N/A"?.35:1}} value={due==="N/A"?"":due} onChange={e=>{setDue(e.target.value);}} disabled={due==="N/A"}/>
          <button onClick={()=>setDue(due==="N/A"?"":"N/A")} style={{
            padding:"8px 12px",borderRadius:10,border:"none",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",flexShrink:0,minHeight:40,
            background:due==="N/A"?`${t.tx3}20`:t.chip,color:due==="N/A"?t.tx:t.tx3,
          }}>N/A</button>
        </div>
      </Label>
    </div>
    <div style={{ display:"flex",gap:10,marginTop:8 }}>
      <button onClick={onCancel} style={{ flex:1,padding:14,background:t.btn2,border:"none",borderRadius:12,fontSize:15,fontWeight:600,color:t.btn2Tx,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",minHeight:48 }}>Cancel</button>
      <button onClick={()=>title.trim()&&cid&&did&&onSave({title:title.trim(),notes:notes.trim(),status:sts,assignee:who,deadline:due,clientId:cid,dealId:did})} style={{ flex:1,padding:14,background:t.btn,border:"none",borderRadius:12,fontSize:15,fontWeight:600,color:t.btnTx,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",minHeight:48,opacity:title.trim()&&cid&&did?1:.4 }}>{task?.id?"Save":"Add Task"}</button>
    </div>
    {onSaveTemplate&&title.trim()&&<button onClick={()=>{if(!tmplSaved){onSaveTemplate({title:title.trim(),notes:notes.trim(),assignee:who,clientId:cid,dealId:did});setTmplSaved(true);}}} style={{ width:"100%",padding:"10px",marginTop:8,background:tmplSaved?"#30D15815":"none",border:`1px dashed ${tmplSaved?"#30D158":t.brd}`,borderRadius:10,fontSize:12,fontWeight:600,color:tmplSaved?"#30D158":t.tx3,cursor:tmplSaved?"default":"pointer",fontFamily:"'DM Sans',sans-serif" }}>{tmplSaved?"★ Saved to Favorites":"★ Save as Favorite"}</button>}
  </div>;
}
