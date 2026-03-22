import { useState } from 'react';
import { useT } from '../theme';
import { useInp, useSel } from '../hooks/useInputStyles';
import Label from './Label';

export default function AssocForm({ onAdd, onClose }) {
  const t = useT(); const inp = useInp(); const sel = useSel();
  const [name, setN] = useState("");
  const [role, setRole] = useState("Associate");
  return <div>
    <Label text="Attorney Name"><input style={inp} placeholder="e.g. Sarah Chen" value={name} onChange={e=>setN(e.target.value)} autoFocus/></Label>
    <Label text="Designation"><select style={sel} value={role} onChange={e=>setRole(e.target.value)}>
      <option value="Partner">Partner</option>
      <option value="Counsel">Counsel</option>
      <option value="Associate">Associate</option>
    </select></Label>
    <div style={{ display:"flex",gap:10 }}>
      <button onClick={onClose} style={{ flex:1,padding:14,background:t.btn2,border:"none",borderRadius:12,fontSize:15,fontWeight:600,color:t.btn2Tx,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",minHeight:48 }}>Done</button>
      <button onClick={()=>{if(name.trim()){onAdd(name.trim(),role);setN("");setRole("Associate");}}} style={{ flex:1,padding:14,background:t.btn,border:"none",borderRadius:12,fontSize:15,fontWeight:600,color:t.btnTx,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",minHeight:48,opacity:name.trim()?1:.4 }}>Add</button>
    </div>
  </div>;
}
