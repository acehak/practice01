import { ArrowRight, Layers } from 'lucide-react';

function TissueTarget({ type }) {
  const selected = { fascia: 34, ligament: 25, fat: 23, dermal: 13 }[type];
  return <svg className="tissue-target" viewBox="0 0 48 46" aria-hidden="true">
    <path d="M3 10c7-5 14 5 21 0s14 5 21 0v8H3Z" fill="#efe4d9" stroke="#d5c3ad" strokeWidth=".75"/>
    <path d="M3 18h42v13H3Z" fill="#f2e8cc" stroke="#e2d6ac" strokeWidth=".75"/>
    {[8, 17, 26, 35, 42].map((x, i) => <circle key={x} cx={x} cy={i % 2 ? 22 : 27} r="3" fill="none" stroke="#d7bf80" strokeWidth=".85"/>)}
    <path d="M3 33h42v4H3Z" fill="#c4d6ce" stroke="#9db9ac" strokeWidth=".7"/>
    <path d="m16 12 2 20m13-20-3 20" stroke={type === 'ligament' ? '#325b4d' : '#c29c85'} strokeWidth={type === 'ligament' ? '2' : '1'} fill="none"/>
    {type !== 'ligament' && <path d={`M4 ${selected}h40`} stroke="#325b4d" strokeWidth="2" strokeLinecap="round"/>}
    <circle cx="43" cy={type === 'ligament' ? 23 : selected} r="3" fill="#325b4d" stroke="#fff" strokeWidth="1"/>
  </svg>;
}

export default function ClinicProtocol({ protocol, profile, onSelect }) {
  return <section className="card clinic-protocol" aria-label="원인별 병원 상담 기준">
    <div className="protocol-header"><span className="section-kicker">TARGET & TREATMENT</span><h3><Layers size={15}/>원인에서 선택지로</h3><p>진찰로 확인한 주된 원인을 선택하세요.</p></div>
    <div className="protocol-map">{protocol.lifting.map(item => <button key={item.subtype} className={`protocol-link ${profile.subtypes.lifting === item.subtype ? 'active' : ''}`} aria-label={`${item.label}: ${item.treatment} 상담 기준 선택`} aria-pressed={profile.subtypes.lifting === item.subtype} onClick={() => onSelect('lifting', item.subtype)}><TissueTarget type={item.subtype}/><span className="protocol-target"><small>처짐 · 주된 원인</small><strong>{item.label}</strong><span className="protocol-device">{item.treatment}<ArrowRight size={11}/></span></span></button>)}</div>
    {protocol.dermal && <button className={`protocol-link dermal-link ${profile.subtypes.wrinkles === protocol.dermal.subtype ? 'active' : ''}`} aria-label={`${protocol.dermal.label}: ${protocol.dermal.treatment} 상담 기준 선택`} aria-pressed={profile.subtypes.wrinkles === protocol.dermal.subtype} onClick={() => onSelect(protocol.dermal.categoryId, protocol.dermal.subtype)}><TissueTarget type="dermal"/><span className="protocol-target"><small>탄력·잔주름 · 피부</small><strong>{protocol.dermal.label}</strong><span className="protocol-device">{protocol.dermal.treatment}<ArrowRight size={11}/></span></span></button>}
    <p className="protocol-footnote">{protocol.label} · 원인 선택과 관찰 점수는 별도로 기록합니다.</p>
  </section>;
}
