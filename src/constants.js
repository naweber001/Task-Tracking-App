export const STATUSES = {
  active:   { label: "Active",   color: "#FF3B30", icon: "○" },
  hold:     { label: "Hold",     color: "#FFCC00", icon: "◷" },
  complete: { label: "Complete", color: "#30D158", icon: "●" },
};

export const T = {
  light: {
    bg:"#F4F5F0", card:"#fff", card2:"#FAFAF8", hdr:"#2E3650",
    tx:"#1A1A2E", tx2:"#7A7F94", tx3:"#A8ACBA",
    brd:"#E2E4EA", brd2:"#EDEDEB", brd3:"#E6E7E3",
    cardShadow:"0 2px 8px rgba(0,0,0,0.07)", cardShadowOverdue:"0 2px 8px rgba(255,59,48,0.12)",
    cardBorder:"1px solid #DCDEE4",
    chip:"#E8E9EE", chipA:"#1A1A2E", chipTx:"#666", chipTxA:"#fff",
    tab:"#fff", tabBrd:"#E2E4EA", tabA:"#1A1A2E", tabI:"#A8ACBA",
    inp:"#DCDEE4", inpBg:"#fff",
    btn:"#2E3650", btnTx:"#fff", btn2:"#EDEEF2", btn2Tx:"#555",
    sheet:"#fff", overlay:"rgba(0,0,0,0.4)",
    accent:"#4A5580",
    hdrSub:"#8B8FB0", hdrNum:"#fff",
    danger:"#FFF0F0", dangerTx:"#FF3B30",
    togOff:"#D0D3DA", togOn:"#30D158", togThumb:"#fff",
    overdue:"#FFF5F5",
  },
  dark: {
    bg:"#0C1021", card:"#141830", card2:"#181C38", hdr:"#0C1021",
    tx:"#D8DCED", tx2:"#6E78A0", tx3:"#4A5278",
    brd:"#1E2440", brd2:"#1A1E38", brd3:"#161A32",
    cardShadow:"0 0 0 1px rgba(100,130,255,0.08)", cardShadowOverdue:"0 0 0 1px rgba(217,79,67,0.3)",
    cardBorder:"1px solid #222848",
    chip:"#181C38", chipA:"#8B9AE0", chipTx:"#6E78A0", chipTxA:"#fff",
    tab:"#101428", tabBrd:"#1E2440", tabA:"#D8DCED", tabI:"#4A5278",
    inp:"#1E2440", inpBg:"#141830",
    btn:"#8B9AE0", btnTx:"#0C1021", btn2:"#181C38", btn2Tx:"#8B9AE0",
    sheet:"#141830", overlay:"rgba(0,0,0,0.6)",
    accent:"#8B9AE0",
    hdrSub:"#4A5278", hdrNum:"#D8DCED",
    danger:"#1A0A10", dangerTx:"#FF3B30",
    togOff:"#1E2440", togOn:"#30D158", togThumb:"#D8DCED",
    overdue:"#1A0A10",
  },
};

export { default as LOGO_LIGHT } from './assets/logo-light.png';
export { default as LOGO_DARK } from './assets/logo-dark.png';
