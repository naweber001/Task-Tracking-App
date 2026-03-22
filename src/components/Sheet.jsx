import { useT } from '../theme';

export default function Sheet({ open, onClose, title, children }) {
  const t = useT();
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:t.overlay,backdropFilter:"blur(4px)",display:"flex",flexDirection:"column",justifyContent:"flex-end",zIndex:1000 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:t.sheet,borderRadius:"20px 20px 0 0",maxHeight:"92vh",overflow:"auto",boxShadow:"0 -8px 40px rgba(0,0,0,.2)",paddingBottom:"max(20px,env(safe-area-inset-bottom,20px))",WebkitOverflowScrolling:"touch" }}>
        <div style={{ display:"flex",justifyContent:"center",padding:"10px 0 4px" }}><div style={{ width:36,height:5,borderRadius:3,background:t.brd }}/></div>
        <div style={{ padding:"8px 20px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${t.brd2}` }}>
          <h2 style={{ margin:0,fontSize:18,fontWeight:700,fontFamily:"'DM Sans',sans-serif",color:t.tx }}>{title}</h2>
          <button onClick={onClose} style={{ background:t.chip,border:"none",width:32,height:32,borderRadius:16,fontSize:16,color:t.tx2,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>×</button>
        </div>
        <div style={{ padding:"16px 20px 20px" }}>{children}</div>
      </div>
    </div>
  );
}
