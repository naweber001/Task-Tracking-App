import { useState } from 'react';
import { useT } from '../theme';
import { useInp, useSel } from '../hooks/useInputStyles';
import Label from './Label';

export default function DealForm({ deal, clients, defClient, onSave, onCancel }) {
  const t = useT(); const inp = useInp(); const sel = useSel();
  const [name, setN] = useState(deal?.name||"");
  const [cid, setCid] = useState(deal?.clientId||defClient||clients[0]?.id||"");
  return <div>
    {!deal&&<Label text="Client"><select style={sel} value={cid} onChange={e=>setCid(e.target.value)}>{clients.length===0&&<option value="">No clients</option>}{[...clients].sort((a,b)=>{if(a.isAdmin&&!b.isAdmin)return -1;if(!a.isAdmin&&b.isAdmin)return 1;return a.name.localeCompare(b.name);}).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Label>}
    <Label text="Matter Name"><input style={inp} placeholder="e.g. Series B Financing" value={name} onChange={e=>setN(e.target.value)} autoFocus/></Label>
    <div style={{ display:"flex",gap:10,marginTop:8 }}>
      <button onClick={onCancel} style={{ flex:1,padding:14,background:t.btn2,border:"none",borderRadius:12,fontSize:15,fontWeight:600,color:t.btn2Tx,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",minHeight:48 }}>Cancel</button>
      <button onClick={()=>name.trim()&&(deal||cid)&&onSave(name.trim(),cid)} style={{ flex:1,padding:14,background:t.btn,border:"none",borderRadius:12,fontSize:15,fontWeight:600,color:t.btnTx,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",minHeight:48,opacity:name.trim()?1:.4 }}>{deal?"Save":"Add Matter"}</button>
    </div>
  </div>;
}
