import { useT } from '../theme';

export default function Toggle({ on, set }) {
  const t = useT();
  return (
    <button onClick={()=>set(!on)} style={{ width:52,height:30,borderRadius:15,border:"none",padding:2,cursor:"pointer",background:on?t.togOn:t.togOff,transition:"background .2s",display:"flex",alignItems:"center",flexShrink:0 }}>
      <div style={{ width:26,height:26,borderRadius:13,background:t.togThumb,boxShadow:"0 1px 4px rgba(0,0,0,.2)",transition:"transform .2s",transform:on?"translateX(22px)":"translateX(0)" }}/>
    </button>
  );
}
