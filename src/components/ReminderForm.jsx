import { useState } from 'react';
import { useT } from '../theme';
import { useInp } from '../hooks/useInputStyles';
import { todayStr } from '../utils';
import Label from './Label';

export default function ReminderForm({ onSave, onCancel }) {
  const t = useT(); const inp = useInp();
  const [text, setText] = useState("");
  const [date, setDate] = useState(todayStr());
  return <div>
    <Label text="Reminder"><input style={inp} placeholder="e.g. Follow up with counsel" value={text} onChange={e=>setText(e.target.value)} autoFocus/></Label>
    <Label text="Date"><input type="date" style={inp} value={date} onChange={e=>setDate(e.target.value)}/></Label>
    <div style={{ display:"flex",gap:10,marginTop:8 }}>
      <button onClick={onCancel} style={{ flex:1,padding:14,background:t.btn2,border:"none",borderRadius:12,fontSize:15,fontWeight:600,color:t.btn2Tx,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",minHeight:48 }}>Cancel</button>
      <button onClick={()=>text.trim()&&date&&onSave({text:text.trim(),date})} style={{ flex:1,padding:14,background:"#B8860B",border:"none",borderRadius:12,fontSize:15,fontWeight:600,color:"#fff",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",minHeight:48,opacity:text.trim()&&date?1:.4 }}>Add Reminder</button>
    </div>
  </div>;
}
