import { useState, useRef } from 'react';
import { useT } from '../theme';

export default function DragList({ items, renderItem, onReorder }) {
  const t = useT();
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const [dragDelta, setDragDelta] = useState(0);
  const rowRefs = useRef([]);
  const dragState = useRef(null);

  const handleDragStart = (idx, e) => {
    e.preventDefault();
    const el = rowRefs.current[idx];
    if (!el) return;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const rowHeight = el.getBoundingClientRect().height + 8;

    const positions = rowRefs.current.map(r => {
      if (!r) return { top: 0, bottom: 0, mid: 0 };
      const rr = r.getBoundingClientRect();
      return { top: rr.top, bottom: rr.bottom, mid: rr.top + rr.height / 2 };
    });

    setDragIdx(idx);
    setOverIdx(idx);
    setDragDelta(0);
    dragState.current = { idx, startY: y, rowHeight, positions };

    const move = (ev) => {
      ev.preventDefault();
      const cy = ev.touches ? ev.touches[0].clientY : ev.clientY;
      setDragDelta(cy - y);
      const pos = dragState.current.positions;
      let target = dragState.current.idx;
      for (let i = 0; i < pos.length; i++) {
        if (i === dragState.current.idx) continue;
        if (cy >= pos[i].top && cy < pos[i].mid) { target = i; break; }
        if (cy >= pos[i].mid && cy <= pos[i].bottom) { target = i; break; }
      }
      if (pos.length > 0) {
        if (cy < pos[0].mid) target = 0;
        if (cy > pos[pos.length - 1].mid) target = pos.length - 1;
      }
      setOverIdx(target);
    };
    const up = () => {
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", up);
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      const from = dragState.current?.idx;
      dragState.current = null;
      setDragDelta(0);
      setDragIdx(null);
      setOverIdx(prev => {
        if (prev !== null && prev !== from && from !== null) {
          setTimeout(() => onReorder(from, prev), 0);
        }
        return null;
      });
    };
    document.addEventListener("touchmove", move, { passive: false });
    document.addEventListener("touchend", up);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  return <div style={{ position:"relative" }}>
    {items.map((item, idx) => {
      const isDragging = dragIdx === idx;
      const dragging = dragIdx !== null;
      let shift = 0;
      if (dragging && !isDragging && overIdx !== null && dragIdx !== null) {
        const rh = dragState.current?.rowHeight || 0;
        if (dragIdx < overIdx && idx > dragIdx && idx <= overIdx) shift = -rh;
        if (dragIdx > overIdx && idx < dragIdx && idx >= overIdx) shift = rh;
      }
      return <div key={item.id || idx} ref={el => rowRefs.current[idx] = el} style={{
        position: "relative",
        zIndex: isDragging ? 50 : 1,
        transform: isDragging
          ? `translateY(${dragDelta}px) scale(1.02)`
          : shift ? `translateY(${shift}px)` : "none",
        transition: isDragging ? "transform 0s, box-shadow 0.2s" : dragging ? "transform 0.25s cubic-bezier(.2,.8,.4,1)" : "none",
        boxShadow: isDragging ? "0 12px 40px rgba(0,0,0,0.25)" : "none",
        borderRadius: 12,
        opacity: isDragging ? 0.95 : 1,
        outline: isDragging ? `2px solid ${t.accent}` : "none",
        outlineOffset: isDragging ? -1 : 0,
      }}>
        {renderItem(item, idx, (e) => handleDragStart(idx, e))}
      </div>;
    })}
  </div>;
}
