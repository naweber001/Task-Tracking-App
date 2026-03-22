import { useT } from '../theme';

export function useInp() {
  const t = useT();
  return {
    width:"100%", padding:"12px 14px", border:`1.5px solid ${t.inp}`,
    borderRadius:10, fontSize:16, fontFamily:"'DM Sans',sans-serif",
    color:t.tx, background:t.inpBg, outline:"none", boxSizing:"border-box",
    WebkitAppearance:"none",
  };
}

export function useSel() {
  const s = useInp();
  return {
    ...s,
    backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='10' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23888'/%3E%3C/svg%3E\")",
    backgroundRepeat:"no-repeat",
    backgroundPosition:"right 14px center",
    paddingRight:36,
  };
}
