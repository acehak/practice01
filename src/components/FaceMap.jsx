const points = {
  forehead: [150, 99], eyes: [186, 143], nose: [150, 174], cheeks: [109, 189],
  mouth: [150, 219], chin: [150, 254], jaw: [196, 231], neck: [150, 310],
};

export default function FaceMap({ zones, selectedZone, onSelect }) {
  const selected = points[selectedZone];
  return (
    <svg className="face-map" viewBox="0 0 300 370" role="group" aria-label="상담 부위 선택용 얼굴 그림">
      <defs>
        <linearGradient id="consult-face-skin" x1="0" y1="0" x2="1" y2=".9"><stop stopColor="#fdf8f3"/><stop offset=".45" stopColor="#f3e5dc"/><stop offset="1" stopColor="#dce5f3"/></linearGradient>
        <linearGradient id="consult-face-neck" x1=".1" y1="0" x2=".85" y2="1"><stop stopColor="#f0ded2"/><stop offset=".65" stopColor="#e5dddf"/><stop offset="1" stopColor="#d9e4f4"/></linearGradient>
        <radialGradient id="consult-face-light"><stop stopColor="#ffffffbd"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></radialGradient>
        <radialGradient id="consult-face-cheek"><stop stopColor="#e6b9b2" stopOpacity=".42"/><stop offset="1" stopColor="#e6b9b2" stopOpacity="0"/></radialGradient>
        <linearGradient id="consult-face-rim" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffffff"/><stop offset="1" stopColor="#bacbeb"/></linearGradient>
        <pattern id="consult-map-grid" width="23" height="23" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".65" fill="#b9c9e2"/></pattern>
        <filter id="consult-face-shadow" x="-30%" y="-20%" width="160%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#829bbc" floodOpacity=".10"/></filter>
      </defs>
      <rect x="17" y="30" width="266" height="309" fill="url(#consult-map-grid)" opacity=".65"/>
      <ellipse cx="150" cy="176" rx="105" ry="139" fill="none" stroke="#e4ecf9" strokeWidth="1"/>
      <ellipse cx="150" cy="176" rx="115" ry="147" fill="none" stroke="#e5eefb" strokeWidth=".8" strokeDasharray="2 6"/>
      <path d="M150 31V343M40 172h220" fill="none" stroke="#cddcf0" strokeWidth=".65" strokeDasharray="3 7"/>
      <path d="M31 74V59h15m223 15V59h-15M31 293v15h15m223-15v15h-15" fill="none" stroke="#b6cae8" strokeWidth="1"/>
      <g filter="url(#consult-face-shadow)">
        <path d="M51 336c15-26 34-24 57-35 14-7 19-21 18-48h48c-1 27 4 41 18 48 23 11 42 9 57 35" fill="url(#consult-face-neck)" stroke="#bcc5d1" strokeWidth="1"/>
        <path d="M93 142c-8-11-18-2-15 14 1 8 4 17 12 21m117-35c8-11 18-2 15 14-1 8-4 17-12 21" fill="#e9ddd9" stroke="#c0bbbe" strokeWidth=".85"/>
        <path d="M86 129c-3-59 23-86 64-87 41 1 67 28 64 87l-5 48c-3 23-13 49-29 67-12 14-23 23-30 23s-18-9-30-23c-16-18-26-44-29-67Z" fill="url(#consult-face-skin)" stroke="#aab8cc" strokeWidth="1.1"/>
        <path d="M91 129c-2-53 22-79 59-82 37 3 61 29 59 82" fill="none" stroke="url(#consult-face-rim)" strokeWidth="2.2"/>
        <ellipse cx="138" cy="110" rx="51" ry="58" fill="url(#consult-face-light)"/>
        <ellipse cx="106" cy="185" rx="29" ry="29" fill="url(#consult-face-cheek)"/>
        <ellipse cx="193" cy="185" rx="27" ry="29" fill="url(#consult-face-cheek)" opacity=".75"/>
        <path d="M102 118c13-9 26-10 37-6m59 6c-13-9-26-10-37-6" fill="none" stroke="#d7c3bb" strokeWidth=".85"/>
        <path d="M101 140c9-7 20-9 33-4m65 4c-9-7-20-9-33-4" fill="none" stroke="#8b8b99" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M105 151c8-7 18-7 26-1-8 6-18 6-26 1Zm90 0c-8-7-18-7-26-1 8 6 18 6 26 1Z" fill="#fff9f5" stroke="#a6a1ab" strokeWidth=".75"/>
        <circle cx="118" cy="150" r="2.5" fill="#919aaa"/>
        <circle cx="182" cy="150" r="2.5" fill="#919aaa"/>
        <circle cx="117.3" cy="149.3" r=".6" fill="#fff"/>
        <circle cx="181.3" cy="149.3" r=".6" fill="#fff"/>
        <path d="M106 164c7 5 16 6 26 1m36 0c10 5 19 4 26-1" fill="none" stroke="#d1c6c6" strokeWidth=".75"/>
        <path d="M147 146c-1 15-5 28-6 39m12-39c1 15 5 28 6 39m-21 2c5 6 19 6 24 0" fill="none" stroke="#bdafa9" strokeWidth=".95" strokeLinecap="round"/>
        <path d="M149 154v26" fill="none" stroke="#fffcfa" strokeWidth="2.1" strokeLinecap="round" opacity=".7"/>
        <path d="M99 180c12-4 27-2 39 7m24 0c12-9 27-11 39-7" fill="none" stroke="#d5bdba" strokeWidth=".85"/>
        <path d="M96 186c5 17 12 29 24 36m84-36c-5 17-12 29-24 36" fill="none" stroke="#d8c7c4" strokeWidth=".7"/>
        <path d="M132 215c7-1 12-5 18-3 6-2 11 2 18 3-6 7-12 9-18 9s-12-2-18-9Z" fill="#dcbabc" stroke="#c7a7ab" strokeWidth=".65"/>
        <path d="M133 215c10 2 24 2 34 0" fill="none" stroke="#b798a0" strokeWidth=".8"/>
        <path d="M138 218c7 1 17 1 24 0" fill="none" stroke="#f7e6e5" strokeWidth=".65"/>
        <path d="M132 241c9 4 27 4 36 0M128 264c4 15 5 28-2 37m46-37c-4 15-5 28 2 37" fill="none" stroke="#c5b7b9" strokeWidth=".8"/>
        <path d="M108 302c10 7 26 15 42 16s32-9 42-16" fill="none" stroke="#beb8c7" strokeWidth=".95"/>
        <path d="M80 328c23-8 39-7 51-1m89 1c-23-8-39-7-51-1" fill="none" stroke="#c9c6d0" strokeWidth=".8"/>
      </g>
      <path d="M51 336h198" stroke="#c9d8ee" strokeWidth=".9"/>
      {selected && <ellipse cx={selected[0]} cy={selected[1]} rx={selectedZone === 'forehead' ? 33 : 24} ry={selectedZone === 'jaw' ? 27 : 20} fill="#7196e3" fillOpacity=".11" stroke="#7196e3" strokeOpacity=".7" strokeWidth=".9" strokeDasharray="3 4"/>}
      {zones.filter(z => points[z.id]).map(zone => {
        const [x, y] = points[zone.id];
        const active = selectedZone === zone.id;
        return <g key={zone.id} className={`face-point ${active ? 'active' : ''}`} role="button" tabIndex="0" aria-label={`${zone.label} 선택`} aria-pressed={active} onClick={() => onSelect(zone.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(zone.id); } }}>
          <title>{zone.label}</title>
          <circle cx={x} cy={y} r="16" fill="transparent"/>
          <circle cx={x} cy={y} r={active ? 8 : 6} fill={active ? '#6384d5' : '#ffffffeb'} stroke={active ? '#5475cb' : '#8aa6d1'} strokeWidth="1.1"/>
          <circle cx={x} cy={y} r={active ? 2.5 : 1.6} fill={active ? '#fff' : '#7897c8'}/>
        </g>;
      })}
      <text x="150" y="356" textAnchor="middle" fill="#9eb2d1" fontSize="7" letterSpacing="3.2">FACIAL OBSERVATION</text>
    </svg>
  );
}
