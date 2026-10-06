const points = {
  forehead: [150, 99], eyes: [186, 143], nose: [150, 174], cheeks: [109, 189],
  mouth: [150, 219], chin: [150, 254], jaw: [196, 231], neck: [150, 310],
};

export default function FaceMap({ zones, selectedZone, onSelect }) {
  const selected = points[selectedZone];
  return (
    <svg className="face-map" viewBox="0 0 300 370" role="group" aria-label="상담 부위 선택용 얼굴 그림">
      <defs>
        <pattern id="consult-map-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke="#dfded4" strokeWidth=".5"/></pattern>
      </defs>
      <rect x="25" y="35" width="250" height="300" fill="url(#consult-map-grid)" opacity=".46"/>
      <ellipse cx="150" cy="178" rx="102" ry="139" fill="#f2eee5" stroke="#dcd8cc" strokeWidth=".7"/>
      <path d="M150 39V343M42 172h216" fill="none" stroke="#c9cfc0" strokeWidth=".65" strokeDasharray="3 5"/>
      <path d="M43 92h12m-12 160h12m202-160h-12m12 160h-12" stroke="#aab49f" strokeWidth="1"/>
      <path d="M55 336c14-24 31-24 53-35 14-7 19-21 18-48h48c-1 27 4 41 18 48 22 11 39 11 53 35" fill="#e7ddcd" stroke="#a29b88" strokeWidth="1.1"/>
      <path d="M93 142c-8-11-18-2-15 14 1 8 4 17 12 21m117-35c8-11 18-2 15 14-1 8-4 17-12 21" fill="#eae1d2" stroke="#b0a591" strokeWidth="1.1"/>
      <path d="M86 129c-3-59 23-86 64-87 41 1 67 28 64 87l-5 48c-3 23-13 49-29 67-12 14-23 23-30 23s-18-9-30-23c-16-18-26-44-29-67Z" fill="#eee6d8" stroke="#8b907f" strokeWidth="1.3"/>
      <path d="M93 127c0-36 17-63 40-74m74 74c0-36-17-63-40-74" fill="none" stroke="#d4c9b6" strokeWidth="1"/>
      <path d="M104 119c12-9 26-11 37-7m55 7c-12-9-26-11-37-7" fill="none" stroke="#d6cdba" strokeWidth="1"/>
      <path d="M101 139c9-7 20-9 33-4m65 4c-9-7-20-9-33-4" fill="none" stroke="#868b7c" strokeWidth="2" strokeLinecap="round"/>
      <path d="M105 151c8-7 18-7 26-1-8 6-18 6-26 1Zm90 0c-8-7-18-7-26-1 8 6 18 6 26 1Z" fill="#f5f2ea" stroke="#9b9f8e" strokeWidth=".9"/>
      <circle cx="118" cy="150" r="2.8" fill="#9a9e8d"/>
      <circle cx="182" cy="150" r="2.8" fill="#9a9e8d"/>
      <path d="M105 164c7 5 17 6 27 1m36 0c10 5 20 4 27-1" fill="none" stroke="#c9c8b5" strokeWidth=".8"/>
      <path d="M147 146c-1 15-5 28-6 39m12-39c1 15 5 28 6 39m-21 2c5 6 19 6 24 0" fill="none" stroke="#aea48e" strokeWidth="1.1" strokeLinecap="round"/>
      <path d="M99 178c12-4 28-3 39 8m24 0c11-11 27-12 39-8" fill="none" stroke="#d0c6b3" strokeWidth="1"/>
      <path d="M96 183c5 18 11 28 22 36m86-36c-5 18-11 28-22 36" fill="none" stroke="#d9cfbb" strokeWidth=".9"/>
      <path d="M132 215c7-1 12-5 18-3 6-2 11 2 18 3-6 7-12 9-18 9s-12-2-18-9Z" fill="#d7bba9" stroke="#b89b86" strokeWidth=".75"/>
      <path d="M132 215c11 2 25 2 36 0" fill="none" stroke="#a8917d" strokeWidth=".8"/>
      <path d="M133 241c8 4 26 4 34 0M128 264c4 15 5 28-2 37m46-37c-4 15-5 28 2 37" fill="none" stroke="#c8bea9" strokeWidth=".9"/>
      <path d="M108 301c9 7 25 15 42 16s33-9 42-16" fill="none" stroke="#bfb69f" strokeWidth="1"/>
      <path d="M57 336h186" stroke="#c8c5b7" strokeWidth=".8"/>
      {selected && <ellipse cx={selected[0]} cy={selected[1]} rx={selectedZone === 'forehead' ? 33 : 24} ry={selectedZone === 'jaw' ? 27 : 20} fill="#24483d" fillOpacity=".09" stroke="#24483d" strokeOpacity=".6" strokeWidth=".8" strokeDasharray="3 3"/>}
      {zones.filter(z => points[z.id]).map(zone => {
        const [x, y] = points[zone.id];
        const active = selectedZone === zone.id;
        return <g key={zone.id} className={`face-point ${active ? 'active' : ''}`} role="button" tabIndex="0" aria-label={`${zone.label} 선택`} aria-pressed={active} onClick={() => onSelect(zone.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(zone.id); } }}>
          <title>{zone.label}</title>
          <circle cx={x} cy={y} r="16" fill="transparent"/>
          <circle cx={x} cy={y} r={active ? 8 : 6} fill={active ? '#24483d' : '#fffefa'} stroke="#40674f" strokeWidth="1.3"/>
          <circle cx={x} cy={y} r={active ? 2.5 : 1.8} fill={active ? '#fffefa' : '#40674f'}/>
        </g>;
      })}
      <text x="150" y="356" textAnchor="middle" fill="#88927e" fontSize="8" letterSpacing="2.8">FACIAL OBSERVATION</text>
    </svg>
  );
}
