import { useT } from '../theme';

export default function Label({ text, children }) {
  const t = useT();
  return <div style={{ marginBottom:16 }}><label style={{ display:"block",fontSize:11,fontWeight:700,color:t.tx2,marginBottom:6,textTransform:"uppercase",letterSpacing:".06em" }}>{text}</label>{children}</div>;
}
