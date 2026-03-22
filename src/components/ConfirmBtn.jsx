import { useState, useEffect, useRef } from 'react';

export default function ConfirmBtn({ label, confirmLabel, onConfirm, style: s }) {
  const [armed, setArmed] = useState(false);
  const timer = useRef(null);
  const arm = (e) => {
    if (e) e.stopPropagation();
    if (armed) { onConfirm(); setArmed(false); clearTimeout(timer.current); }
    else { setArmed(true); timer.current = setTimeout(()=>setArmed(false), 3000); }
  };
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  return <button onClick={arm} style={{ ...s, ...(armed ? { background: s?.dangerBg || "#FFF0F0", color: s?.dangerTx || "#FF3B30" } : {}) }}>{armed ? (confirmLabel||"Confirm?") : label}</button>;
}
