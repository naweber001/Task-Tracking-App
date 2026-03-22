import { useState } from 'react';
import { useT } from '../theme';
import { useInp } from '../hooks/useInputStyles';
import Label from './Label';

export default function ClientForm({ client, onSave, onCancel }) {
  const t = useT(); const inp = useInp();
  const [name, setN] = useState(client?.name||"");
  return <div>
    <Label text="Client Name"><input style={inp} placeholder="e.g. Acme Corp" value={name} onChange={e=>setN(e.target.value)} autoFocus/></Label>
    <div style={{ display:"flex",gap:10,marginTop:8 }}>
      <button onClick={onCancel} style={{ flex:1,padding:14,background:t.btn2,border:"none",borderRadius:12,fontSize:15,fontWeight:600,color:t.btn2Tx,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",minHeight:48 }}>Cancel</button>
      <button onClick={()=>name.trim()&&onSave(name.trim())} style={{ flex:1,padding:14,background:t.btn,border:"none",borderRadius:12,fontSize:15,fontWeight:600,color:t.btnTx,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",minHeight:48,opacity:name.trim()?1:.4 }}>{client?"Save":"Add Client"}</button>
    </div>
  </div>;
}
