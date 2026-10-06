import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, CheckCheck, ChevronDown, CircleDot, CirclePlus, Copy, Droplets, Focus, HeartPulse, Info, Layers, Leaf, ListChecks, MoveUpRight, Printer, RotateCcw, ScanFace, ShieldCheck, SlidersHorizontal, Sparkles, Star, Sun, Waves, X } from 'lucide-react';
import { CATEGORIES, CLINIC_PROTOCOL, CLINIC_TREATMENTS, INITIAL_SCORES, PROFILE_FIELDS, SAMPLE_SCORES, SCORE_LABELS, SUBTYPE_FIELDS, ZONES, buildPlans, normalizeLiftingCauses } from './domain.js';
import FaceMap from './components/FaceMap.jsx';
import ScoreChart from './components/ScoreChart.jsx';
import ClinicProtocol from './components/ClinicProtocol.jsx';

const ICONS = { pigment: Sun, redness: HeartPulse, acne: CircleDot, texture: Focus, wrinkles: Waves, lifting: MoveUpRight, contour: ScanFace, volume: CirclePlus, barrier: Droplets };
const GROUPS = [{ id: 'all', label: '전체' }, { id: 'skin', label: '피부' }, { id: 'structure', label: '탄력·구조' }, { id: 'care', label: '장벽' }];
const SAFETY = [{ id: 'pregnancy', label: '임신·수유 중' }, { id: 'activeInflammation', label: '시술 부위에 활동성 염증' }, { id: 'recentProcedure', label: '최근 시술·회복 중' }];
const EMPTY_PROFILE = { subtypes: {}, liftingCauses: [], combinationTreatments: [], sensitivity: 'unknown', downtime: 'unknown', approach: 'unknown' };
const liftingLabel = value => SUBTYPE_FIELDS.lifting.options.find(option => option.value === value)?.label;
const observationLabels = (profile, categoryId) => categoryId === 'lifting'
  ? normalizeLiftingCauses(profile).map(liftingLabel)
  : SUBTYPE_FIELDS[categoryId]?.options.filter(option => option.value !== 'unknown' && option.value === profile.subtypes[categoryId]).map(option => option.label) || [];
const dateLabel = value => new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(value);

function PlanCard({ item, index, scores, priorities, deferred = false }) {
  const [open, setOpen] = useState(false);
  const category = CATEGORIES.find(c => c.id === item.categoryId);
  const targetCategories = (item.categoryIds || [item.categoryId]).map(id => CATEGORIES.find(c => c.id === id)).filter(Boolean);
  return <article className={`plan-card ${item.kind === 'combination' ? 'combination-card' : ''} ${deferred ? 'deferred-card' : ''}`} data-kind={item.kind || 'candidate'}>
    <div className="plan-card-meta"><span className="plan-category" style={{ '--category-color': category?.color }}>{targetCategories.map(c => c.label).join(' · ')} <b>{targetCategories.map(c => `${scores[c.id]}점`).join(' / ')}</b></span>{targetCategories.some(c => priorities.includes(c.id)) && <span className="priority-tag"><Star size={10}/> 우선</span>}</div>
    <button className="plan-card-heading" aria-expanded={open} onClick={() => setOpen(!open)}><span className="plan-number">{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><ChevronDown size={15} className={open ? 'rotated' : ''}/></button>
    <p className="plan-rationale">{deferred ? item.reason : item.rationale}</p>
    {!!item.treatments?.length && <><div className="treatment-chips">{item.treatments.map((t, i) => <span key={t}>{item.kind === 'combination' && i > 0 && <b aria-hidden="true">＋ </b>}{t}</span>)}</div>{item.kind === 'combination' && <p className="candidate-hint">{item.combinationSource === 'confirmed-causes' ? '복수 원인에 대한 조합 후보' : '의료진이 선택한 시술 조합'} · 시행 순서는 진찰 후 결정</p>}{item.kind === 'alternatives' && item.categoryId === 'wrinkles' && item.treatments.length > 1 && <p className="candidate-hint">대안 후보 중 선택 · 표시 순서는 병원 상담 기준</p>}</>}
    {!!item.personalization?.length && <p className="personalization-reason"><SlidersHorizontal size={10}/>{item.personalization[0]}</p>}
    {open && <div className="plan-detail"><p>{item.detail}</p>{item.requiresReview && <span><Info size={12}/> 진찰 후 적응증과 적용 부위 확인</span>}</div>}
  </article>;
}

function Modal({ kind, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => { const dialog = ref.current; dialog.showModal(); return () => { if (dialog.open) dialog.close(); }; }, []);
  return <dialog ref={ref} className={`modal modal-${kind}`} aria-labelledby="modal-title" onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}><button className="modal-close icon-button" onClick={onClose} aria-label="닫기"><X size={20}/></button>{children}</dialog>;
}

function ConsultationReport({ scores, priorities, plans, createdAt, isSample, note, clinician, profile, safety }) {
  return <div className="report-body">
    <div className="report-heading"><Leaf size={23}/><span>결 · 상담 요약</span>{isSample && <b>예시 상담</b>}</div>
    <div className="report-meta"><span>평가일 {dateLabel(createdAt)}</span><span>평가자 {clinician.trim() || '미입력'}</span><span>얼굴 상담 · 관찰 점수 0–4</span></div>
    {note.trim() && <p className="report-note"><b>상담 목표</b> {note}</p>}
    <div className="report-context">{PROFILE_FIELDS.filter(f => profile[f.id] !== 'unknown').map(f => <span key={f.id}>{f.label}: {f.options.find(o => o.value === profile[f.id])?.label}</span>)}{SAFETY.filter(f => safety[f.id]).map(f => <span key={f.id}>확인: {f.label}</span>)}</div>
    <h3>항목별 관찰</h3>
    <div className="report-scores">{CATEGORIES.map(c => <div key={c.id}><span>{c.label}{priorities.includes(c.id) ? ' ★' : ''}</span><b>{scores[c.id] === null ? '미평가' : `${scores[c.id]} / 4`}</b><small>{scores[c.id] === null ? '아직 평가하지 않았습니다.' : c.anchors[scores[c.id]]}</small>{observationLabels(profile, c.id).length > 0 && <small>진찰 소견: {observationLabels(profile, c.id).join(' · ')}</small>}</div>)}</div>
    <div className="report-plans">{[{ title: '기본 플랜 · 우선 고려', items: plans.basic }, { title: '확장 플랜 · 조합·추가 후보', items: plans.extended }].map(({ title, items }) => <section key={title}><h3>{title}</h3>{items.length ? items.map(item => <div className="report-plan" key={item.id}><b>{item.title}</b>{!!item.treatments?.length && <p>{item.treatments.join(item.kind === 'combination' ? ' ＋ ' : ' · ')}</p>}<small>{item.detail}</small></div>) : <p className="muted">현재 추천 후보 없음</p>}</section>)}</div>
    {!!plans.deferred.length && <section className="report-deferred"><h3>우선 확인·보류</h3>{plans.deferred.map(item => <p key={item.id}><b>{item.title}</b> — {item.reason}</p>)}</section>}
    <p className="report-footnote">점수는 상담을 위한 의사 관찰 기록입니다. 원인별 시술 연결은 병원에서 설정한 상담 기준이며 검증된 진단 지표나 보편적인 치료 지침이 아닙니다. 기본 플랜은 원인별 후보, 확장 플랜은 복합 원인에 대한 조합·추가 후보입니다. 조합의 적합성·부위·시행 순서는 진찰 후 결정합니다.</p>
  </div>;
}

export default function App() {
  const [scores, setScores] = useState({ ...INITIAL_SCORES });
  const [priorities, setPriorities] = useState([]);
  const [safety, setSafety] = useState({ pregnancy: false, activeInflammation: false, recentProcedure: false });
  const [selectedZone, setSelectedZone] = useState('fullFace');
  const [selectedCategory, setSelectedCategory] = useState('pigment');
  const [group, setGroup] = useState('all');
  const [planTab, setPlanTab] = useState('basic');
  const [isSample, setIsSample] = useState(false);
  const [createdAt, setCreatedAt] = useState(() => new Date());
  const [note, setNote] = useState('');
  const [clinician, setClinician] = useState('');
  const [profile, setProfile] = useState({ ...EMPTY_PROFILE, subtypes: {} });
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');
  const plans = useMemo(() => buildPlans(scores, priorities, safety, profile), [scores, priorities, safety, profile]);
  const eligibleCombinationItems = [...plans.basic, ...plans.extended].filter(item => item.kind !== 'combination');
  const combinationChoices = [...new Set([...eligibleCombinationItems.flatMap(item => item.treatments || []), ...profile.combinationTreatments])];
  const availableCombinationChoices = new Set(eligibleCombinationItems.flatMap(item => item.treatments || []));
  const assessedCount = CATEGORIES.filter(c => Number.isFinite(scores[c.id])).length;
  const concernCount = CATEGORIES.filter(c => scores[c.id] > 0).length;
  const current = CATEGORIES.find(c => c.id === selectedCategory);
  const CurrentIcon = ICONS[current.id];
  const visible = CATEGORIES.filter(c => (group === 'all' || c.group === group) && (selectedZone === 'fullFace' || c.zones.includes(selectedZone)));
  const zoneLabel = ZONES.find(z => z.id === selectedZone)?.label;
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 2800); return () => clearTimeout(timer); }, [toast]);

  function selectZone(id) {
    setSelectedZone(id); setGroup('all');
    const related = CATEGORIES.filter(c => id === 'fullFace' || c.zones.includes(id));
    if (!related.some(c => c.id === selectedCategory) && related.length) setSelectedCategory(related[0].id);
  }
  function setScore(id, value) { setSelectedCategory(id); setScores(previous => ({ ...previous, [id]: value })); }
  function togglePriority(id) { setPriorities(previous => previous.includes(id) ? previous.filter(p => p !== id) : [...previous, id]); }
  function reset() {
    setScores({ ...INITIAL_SCORES }); setPriorities([]); setSafety({ pregnancy: false, activeInflammation: false, recentProcedure: false });
    setSelectedZone('fullFace'); setSelectedCategory('pigment'); setGroup('all'); setPlanTab('basic'); setIsSample(false); setNote(''); setProfile({ ...EMPTY_PROFILE, subtypes: {} }); setCreatedAt(new Date()); setToast('새 상담을 시작합니다.');
  }
  function loadSample() {
    setScores({ ...SAMPLE_SCORES }); setPriorities(['lifting', 'pigment']); setSafety({ pregnancy: false, activeInflammation: false, recentProcedure: false });
    setSelectedZone('fullFace'); setSelectedCategory('lifting'); setGroup('all'); setPlanTab('basic'); setIsSample(true); setNote('턱선을 정돈하고 피부 톤을 균일하게 개선하고 싶어요.'); setCreatedAt(new Date()); setToast('가상의 예시 상담을 불러왔습니다.');
    setProfile({ sensitivity: 'normal', downtime: 'minimal', approach: 'noninvasive', combinationTreatments: [], liftingCauses: ['fascia', 'ligament'], subtypes: { pigment: 'melasma', wrinkles: 'pronounced', texture: 'pores', contour: 'fat', volume: 'localized' } });
  }
  function selectFinding(categoryId, subtype) {
    setSelectedCategory(categoryId); setSelectedZone('fullFace'); setGroup('all');
    if (categoryId === 'lifting') {
      setProfile(previous => {
        const causes = normalizeLiftingCauses(previous);
        return { ...previous, liftingCauses: causes.includes(subtype) ? causes.filter(cause => cause !== subtype) : [...causes, subtype] };
      });
    } else {
      setProfile(previous => ({ ...previous, subtypes: { ...previous.subtypes, [categoryId]: subtype } }));
    }
  }
  function toggleCombination(treatment) {
    setProfile(previous => ({ ...previous, combinationTreatments: previous.combinationTreatments.includes(treatment)
      ? previous.combinationTreatments.filter(label => label !== treatment)
      : [...previous.combinationTreatments, treatment] }));
  }
  async function copySummary() {
    const categoryText = CATEGORIES.map(c => `${c.label}: ${scores[c.id] === null ? '미평가' : `${scores[c.id]}/4 (${c.anchors[scores[c.id]]})`}${priorities.includes(c.id) ? ' · 우선 상담' : ''}`).join('\n');
    const list = items => items.length ? items.map(item => `• ${item.title}${item.treatments?.length ? ` [${item.treatments.join(', ')}]` : ''}\n  ${item.detail}`).join('\n') : '현재 추천 후보 없음';
    const contextText = [...PROFILE_FIELDS.filter(f => profile[f.id] !== 'unknown').map(f => `${f.label}: ${f.options.find(o => o.value === profile[f.id])?.label}`), ...CATEGORIES.filter(c => observationLabels(profile, c.id).length > 0).map(c => `${c.label} 소견: ${observationLabels(profile, c.id).join(' · ')}`), ...SAFETY.filter(f => safety[f.id]).map(f => `확인: ${f.label}`)].join('\n');
    const text = `${isSample ? '[예시 상담]\n' : ''}결 · 상담 요약\n평가일: ${dateLabel(createdAt)}\n평가자: ${clinician.trim() || '미입력'}\n상담 부위: 얼굴\n${note.trim() ? `상담 목표: ${note}\n` : ''}${contextText ? `\n개인별 상담 조건\n${contextText}\n` : ''}\n의사 관찰 점수 (0–4)\n${categoryText}\n\n기본 플랜 · 우선 고려\n${list(plans.basic)}\n\n확장 플랜 · 조합·추가 후보\n${list(plans.extended)}${plans.deferred.length ? `\n\n우선 확인·보류\n${plans.deferred.map(i => `${i.title}: ${i.reason}`).join('\n')}` : ''}\n\n점수는 상담용 관찰 기록이며 검증된 진단 지표가 아닙니다. 원인별 시술 연결은 병원에서 설정한 상담 기준입니다. 기본 플랜은 원인별 후보, 확장 플랜은 조합·추가 후보입니다. 적합성·부위·시행 순서는 진찰 후 결정합니다.`;
    try { await navigator.clipboard.writeText(text); setToast('상담 요약을 복사했습니다.'); } catch { setToast('복사 권한을 확인해 주세요. 인쇄로도 요약을 남길 수 있어요.'); }
  }

  return <>
    <header className="topbar"><div className="topbar-inner"><a className="brand" href="#" aria-label="결 상담 워크스페이스"><span className="brand-symbol"><Leaf size={22}/></span><span className="brand-name">결<span>GYEOL</span></span></a><span className="brand-divider"/><span className="workspace-name">피부 상담 워크스페이스</span><div className="header-actions"><button className="text-button" onClick={() => setModal('guide')}><Info size={15}/><span>사용 가이드</span></button><span className="session-pill"><span/>{isSample ? '예시 상담' : assessedCount ? '상담 중' : '새 상담'}</span><button className="summary-button" onClick={() => setModal('summary')}><ListChecks size={16}/>상담 요약<ArrowUpRight size={14}/></button></div></div></header>

    <main className="workspace">
      <section className="hero" aria-label="개인별 피부 상담">
        <div className="hero-copy"><span className="hero-eyebrow">EVERY FACE, ITS OWN STORY</span><h1 className="hero-title">당신의 피부에,<br/>가장 어울리는 변화.</h1><p>관찰은 섬세하게. 선택은 당신에게 맞게.</p></div>
        <div className="hero-metrics"><div className="hero-stat"><b>09</b><span>피부 관찰 항목</span></div><div className="hero-stat"><b>13</b><span>병원 시술 선택지</span></div><div className="hero-stat"><b>1 : 1</b><span>개인별 플랜 설계</span></div></div>
      </section>
      <section className="page-intro"><div><div className="eyebrow"><span/> A MORE THOUGHTFUL CONSULTATION</div><h2 className="page-title">오늘의 피부 상담</h2><p>원인을 구분하고, 필요한 시술과 조합을 함께 살펴봅니다.</p></div><div className="intro-actions">{isSample && <span className="sample-notice">가상 데이터 · 예시 상담</span>}<button className="sample-button" onClick={loadSample}><Sparkles size={15}/>예시 상담 보기</button><button className="icon-button reset-button" onClick={reset} aria-label="새 상담 시작" title="새 상담 시작"><RotateCcw size={16}/></button></div></section>

      <div className="workflow-strip"><div className="workflow-steps"><span className="workflow-step"><b>01</b>부위 관찰</span><ArrowRight size={12}/><span className="workflow-step"><b>02</b>점수 평가</span><ArrowRight size={12}/><span className="workflow-step"><b>03</b>플랜 설계</span></div><div className="progress-label"><span className="progress-track"><span style={{ width: `${assessedCount / 9 * 100}%` }}/></span><b>{assessedCount}</b> / 9 항목 평가</div></div>
      <section className="personalization-bar"><div className="personalization-title"><span className="mini-icon"><SlidersHorizontal size={17}/></span><div><h3>같은 점수, 다른 선택지</h3><p>개인별 조건에 따라 후보를 조정합니다.</p></div></div><div className="profile-fields">{PROFILE_FIELDS.map(field => <label key={field.id}>{field.label}<select value={profile[field.id]} onChange={e => setProfile(previous => ({ ...previous, [field.id]: e.target.value }))} aria-label={field.label}>{field.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>)}</div></section>

      <div className="consultation-grid">
        <aside className="observation-column">
          <section className="card face-card"><div className="section-title"><div><span className="section-kicker">OBSERVE</span><h2>어디가 고민인가요?</h2></div><span className="step-dot">01</span></div><p className="section-caption">부위를 선택해 관련 항목을 살펴보세요.</p><div className="face-canvas"><span className="map-label"><span/>{zoneLabel}</span><FaceMap zones={ZONES} selectedZone={selectedZone} onSelect={selectZone}/></div><div className="zone-buttons">{[ZONES.find(z => z.id === 'fullFace'), ...ZONES.filter(z => z.id !== 'fullFace')].map(zone => <button key={zone.id} onClick={() => selectZone(zone.id)} className={selectedZone === zone.id ? 'selected' : ''} aria-pressed={selectedZone === zone.id}>{zone.label}</button>)}</div></section>
          <ClinicProtocol protocol={CLINIC_PROTOCOL} profile={profile} onSelect={selectFinding}/>
          <section className="card chart-card"><div className="compact-card-title"><h3>관찰 프로필</h3><span>0–4 척도</span></div><ScoreChart categories={CATEGORIES} scores={scores}/><div className="chart-legend"><span/><span>{assessedCount ? '평가한 항목만 표시됩니다' : '점수를 입력하면 프로필이 그려집니다'}</span></div></section>
        </aside>

        <section className="card assessment-card" id="assessment"><div className="section-title"><div><span className="section-kicker">ASSESS</span><h2>항목별 관찰 점수</h2></div><span className="step-dot">02</span></div><p className="section-caption">의사가 관찰한 정도를 같은 기준으로 기록합니다.</p><div className="category-tabs" role="group" aria-label="항목 분류">{GROUPS.map(tab => <button className={group === tab.id ? 'active' : ''} aria-pressed={group === tab.id} key={tab.id} onClick={() => setGroup(tab.id)}>{tab.label}{tab.id === 'all' && <span>9</span>}</button>)}</div>{selectedZone !== 'fullFace' && <div className="zone-filter"><ScanFace size={13}/>{zoneLabel} 관련 {visible.length}개 항목<button aria-label="부위 필터 해제" onClick={() => selectZone('fullFace')}><X size={12}/></button></div>}
          <div className="score-scale-legend"><span>관찰 항목</span><span>없음 <span>0 — 4</span> 매우 뚜렷</span></div>
          <div className="category-list">{visible.map(category => {
            const Icon = ICONS[category.id]; const value = scores[category.id]; const active = category.id === selectedCategory;
            return <div key={category.id} className="category-item"><div className={`category-row ${active ? 'current' : ''}`} style={{ '--category-color': category.color }}><button className="category-label" onClick={() => setSelectedCategory(category.id)} aria-label={`${category.label} 항목 선택`}><span className="category-icon"><Icon size={17}/></span><span><strong>{category.label}</strong><small>{value === null ? '미평가' : SCORE_LABELS[value]}</small></span></button><div className="score-buttons" role="group" aria-label={`${category.label} 점수`}>{[0, 1, 2, 3, 4].map(n => <button key={n} className={value === n ? 'selected' : ''} aria-pressed={value === n} aria-label={`${category.label} ${n}점: ${category.anchors[n]}`} title={category.anchors[n]} onClick={() => setScore(category.id, n)}>{n}</button>)}</div><button className={`priority-button ${priorities.includes(category.id) ? 'selected' : ''}`} aria-label={`${category.label} 우선 상담`} aria-pressed={priorities.includes(category.id)} title="환자가 원하는 우선 상담 항목" onClick={() => togglePriority(category.id)}><Star size={15}/></button></div>{active && category.id === 'lifting' ? <fieldset className="cause-field"><legend>진찰로 확인한 처짐 원인 <span>복수 선택</span></legend><div className="cause-options">{SUBTYPE_FIELDS.lifting.options.filter(option => option.value !== 'unknown').map(option => <label className={`cause-option ${normalizeLiftingCauses(profile).includes(option.value) ? 'selected' : ''}`} key={option.value}><input type="checkbox" aria-label={`처짐 원인: ${option.label}`} checked={normalizeLiftingCauses(profile).includes(option.value)} onChange={() => selectFinding('lifting', option.value)}/><span>{option.label}<small className="cause-target">{CLINIC_PROTOCOL.lifting.find(item => item.subtype === option.value)?.treatment || '필러 · 지지 보완 평가'}</small></span></label>)}</div><p className="cause-helper">{value === null ? '점수 미평가 · 원인과 별도로 관찰 점수를 기록하세요.' : value === 0 ? '0점은 시술 후보에서 제외됩니다. 선택한 원인은 기록에만 남습니다.' : normalizeLiftingCauses(profile).length > 1 ? '각 원인의 기본 후보와 함께, 확장 플랜에 조합을 제시합니다.' : normalizeLiftingCauses(profile).length === 1 ? '원인별 기본 후보를 제시합니다. 다른 원인이 함께 확인되면 추가 선택하세요.' : '원인 미확인 · 점수만으로 시술을 정하지 않습니다.'}</p></fieldset> : active && SUBTYPE_FIELDS[category.id] && <label className="inline-subtype"><span>진찰 소견</span><select aria-label={`${category.label} 진찰 소견`} value={profile.subtypes[category.id] || 'unknown'} onChange={e => selectFinding(category.id, e.target.value)}>{SUBTYPE_FIELDS[category.id].options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>}{active && value !== null && <p className="score-anchor-row"><Check size={11}/>{category.anchors[value]}</p>}</div>;
          })}{!visible.length && <div className="filter-empty"><Focus size={24}/><p>이 부위에 해당하는 분류 항목이 없어요.</p><button onClick={() => setGroup('all')}>관련 항목 전체 보기</button></div>}</div>
          <details className="criteria-box" key={current.id}><summary className="criteria-heading"><span><CurrentIcon size={14}/>{current.label} · 관찰 기준</span><ChevronDown size={15}/></summary><p>{current.description}</p><div className="criteria-options">{current.anchors.map((anchor, index) => <button key={index} className={scores[current.id] === index ? 'active' : ''} onClick={() => setScore(current.id, index)} aria-pressed={scores[current.id] === index}><b>{index}</b><span>{anchor}</span>{scores[current.id] === index && <Check size={13}/>}</button>)}</div>{scores[current.id] !== null && <button className="clear-assessment" onClick={() => setScore(current.id, null)}>이 항목 평가 취소</button>}</details>
          <div className="assessment-footnote"><Star size={12}/><span>별표로 환자의 상담 우선순위를 따로 표시해요.</span></div>
        </section>

        <aside className="plan-column"><section className="card plan-panel"><div className="section-title"><div><span className="section-kicker">PLAN</span><h2>함께 만드는 시술 플랜</h2></div><span className="step-dot">03</span></div><p className="section-caption">평가 항목과 우선순위에 맞춘 상담 후보입니다.</p><div className="plan-tabs" role="tablist" aria-label="상담 플랜">{[{ id: 'basic', label: '기본 플랜' }, { id: 'extended', label: '확장 플랜' }].map(tab => <button role="tab" aria-selected={planTab === tab.id} aria-controls={`plan-${tab.id}`} id={`tab-${tab.id}`} className={planTab === tab.id ? 'active' : ''} key={tab.id} onClick={() => setPlanTab(tab.id)}>{tab.label}<span>{plans[tab.id].length}</span></button>)}</div><div className="plan-intent"><span className={`intent-icon ${planTab === 'extended' ? 'extended' : ''}`}>{planTab === 'basic' ? <Leaf size={16}/> : <Layers size={16}/>}</span><div><b>{planTab === 'basic' ? '원인마다, 필요한 선택지' : '함께 해결할 원인이 있다면'}</b><p>{planTab === 'basic' ? '확인된 원인별 평가·시술 후보' : '복수 원인에 맞춘 조합·추가 후보'}</p></div></div>{planTab === 'extended' && (combinationChoices.length > 1 || profile.combinationTreatments.length > 0) && <details className="combination-builder"><summary><CirclePlus size={14}/><span>의료진이 직접 조합하기</span>{profile.combinationTreatments.length > 0 && <b>{profile.combinationTreatments.length}개 선택</b>}<ChevronDown size={14}/></summary><p>현재 기본·확장 후보 중 함께 검토할 시술을 2개 이상 선택하세요.</p><div className="combination-options">{combinationChoices.map(treatment => <button key={treatment} className={`combination-choice ${profile.combinationTreatments.includes(treatment) ? 'selected' : ''} ${availableCombinationChoices.has(treatment) ? '' : 'unavailable'}`} aria-label={`직접 조합: ${treatment}`} aria-pressed={profile.combinationTreatments.includes(treatment)} onClick={() => toggleCombination(treatment)}>{profile.combinationTreatments.includes(treatment) ? <Check size={12}/> : <CirclePlus size={12}/>}<span>{treatment}</span>{!availableCombinationChoices.has(treatment) && <small>재확인</small>}</button>)}</div><small>{profile.combinationTreatments.some(treatment => !availableCombinationChoices.has(treatment)) ? '일부 선택 시술을 재확인해야 합니다. 보류 사유를 확인하거나 바뀐 소견에 맞춰 다시 선택하세요.' : '같은 목표의 대안도 포함됩니다. 병합 필요성은 진찰 후 판단하세요.'}</small></details>}<div className="plan-list" role="tabpanel" id={`plan-${planTab}`} aria-labelledby={`tab-${planTab}`}>
            {plans[planTab].length ? plans[planTab].map((item, index) => <PlanCard key={item.id} item={item} index={index} scores={scores} priorities={priorities}/>) : <div className="plan-empty"><div className="empty-illustration"><span/><Layers size={36} strokeWidth={1.25}/><i/><b/></div><h3>{assessedCount === 0 ? '관찰이 플랜으로 이어집니다' : planTab === 'extended' ? '지금은 기본 플랜에 집중해요' : concernCount === 0 ? '관찰된 고민이 없어요' : '진찰 후 후보를 확인해요'}</h3><p>{assessedCount === 0 ? '고민 항목의 점수를 입력하면\n기본·확장 플랜을 함께 제안해요.' : planTab === 'extended' ? '함께 확인된 처짐 원인이 있으면\n각 원인에 맞는 조합을 제안해요.\n시술 후보로 직접 조합할 수도 있어요.' : '다른 항목도 평가하거나\n유지·관리 목표를 함께 이야기해 보세요.'}</p>{assessedCount === 0 && <button onClick={loadSample}>예시로 살펴보기 <ArrowRight size={13}/></button>}</div>}
          </div>{!!plans.deferred.length && <details className="deferred-plans"><summary><ShieldCheck size={14}/>우선 확인·보류 {plans.deferred.length}건<ChevronDown size={14}/></summary><div>{plans.deferred.map((item, index) => <PlanCard key={item.id} item={item} index={index} scores={scores} priorities={priorities} deferred/>)}</div></details>}<div className="plan-panel-note"><Info size={13}/><p>기본은 원인별 후보, 확장은 조합·추가 후보.<br/>부위와 시행 순서는 진찰 후 결정합니다.</p></div></section>
          <section className="card safety-card"><div className="compact-card-title"><h3><ShieldCheck size={15}/>진찰 전 확인</h3><span>플랜에 반영</span></div>{SAFETY.map(item => <label className="check-row" key={item.id}><input type="checkbox" checked={safety[item.id]} onChange={e => setSafety(previous => ({ ...previous, [item.id]: e.target.checked }))}/><span>{item.label}</span></label>)}<p>관련 후보는 보류하고 우선 확인 항목으로 표시합니다.</p></section>
        </aside>
      </div>

      <section className="consultation-bottom"><div className="note-card"><div className="note-title"><span className="mini-icon"><Sparkles size={16}/></span><div><h3>환자가 원하는 변화</h3><p>점수에 담기지 않는 고민도 기록해 보세요.</p></div></div><textarea value={note} maxLength={500} onChange={e => setNote(e.target.value)} placeholder="예: 자연스러운 표정은 유지하면서 눈가 잔주름을 개선하고 싶어요." aria-label="환자가 원하는 변화 및 기타 상담 메모" rows={2}/></div><button className="inventory-card" onClick={() => setModal('inventory')}><span className="inventory-icon"><Layers size={22}/></span><div><span className="section-kicker">YOUR CLINIC</span><h3>우리 병원 시술 라이브러리</h3><p>보유 장비·주사 시술 {CLINIC_TREATMENTS.length}종 연결</p></div><ArrowUpRight size={19}/></button></section>
      <footer className="workspace-footer"><span><Leaf size={12}/>결 · 더 나은 상담의 시작</span><p>상담 내용은 이 화면에서만 유지되며, 새로고침하면 초기화됩니다.</p><button onClick={() => setModal('guide')}>점수와 추천 기준 <ArrowUpRight size={11}/></button></footer>
    </main>

    {modal && <Modal kind={modal} onClose={() => setModal(null)}>{modal === 'summary' ? <><div className="modal-intro"><span className="section-kicker">CONSULTATION SUMMARY</span><h2 id="modal-title">오늘의 상담을 정리해요.</h2><p>환자와 함께 확인하고, 필요한 내용을 남겨 보세요.</p></div><div className="summary-toolbar"><label>평가자<input value={clinician} onChange={e => setClinician(e.target.value)} maxLength={40} placeholder="담당 의료진 이름"/></label><button onClick={copySummary}><Copy size={15}/>요약 복사</button><button className="print-button" onClick={() => window.print()}><Printer size={15}/>인쇄 / PDF</button></div><ConsultationReport {...{ scores, priorities, plans, createdAt, isSample, note, clinician, profile, safety }}/></> : modal === 'inventory' ? <><div className="modal-intro"><span className="section-kicker">YOUR CLINIC</span><h2 id="modal-title">우리 병원의 선택지</h2><p>보유 시술을 관련 항목의 상담 후보로 연결했습니다.</p></div><div className="inventory-list">{CLINIC_TREATMENTS.map(t => <div key={t.id}><span className="mini-icon">{t.type === 'device' ? <Focus size={17}/> : <Droplets size={17}/>}</span><div><h3>{t.label}</h3><p>{t.description}</p></div><span className="inventory-type">{t.type === 'device' ? '장비' : '주사'}</span></div>)}</div><p className="modal-footnote">현재 화면은 얼굴 상담을 기준으로 합니다. 바디·리프팅 필러는 부위와 해부학적 적응증을 별도로 평가합니다. 색소·혈관 전용 장비는 등록되지 않아 추가 적합성 확인으로 표시합니다.</p></> : <><div className="modal-intro"><span className="section-kicker">QUICK GUIDE</span><h2 id="modal-title">좋은 상담을 위한 세 단계</h2><p>관찰 기록을 정리하고, 시술 선택을 함께 논의하는 도구입니다.</p></div><div className="guide-steps">{[{ icon: ScanFace, title: '01  얼굴 부위 선택', text: '얼굴 그림이나 부위 버튼을 누르면 관련 평가 항목을 확인할 수 있습니다. 부위 선택은 점수를 바꾸지 않습니다.' }, { icon: ListChecks, title: '02  같은 기준으로 평가', text: '각 항목의 구체적인 관찰 기준을 보고 0–4점을 입력합니다. 미평가와 0점은 구분합니다. 별표는 환자의 관심 우선순위입니다.' }, { icon: Layers, title: '03  기본·확장 플랜 검토', text: '0점은 추천에서 제외하고, 1점 이상에서는 확인한 원인별 기본 후보를 제시합니다. 처짐 원인이 여러 개 확인되면 확장 플랜에 대응 시술의 조합을 제시합니다. 다른 항목은 소견과 점수에 따라 추가 후보를 검토합니다. 확장 플랜에서 현재 기본·확장 시술 후보를 직접 골라 조합할 수도 있습니다. 조합의 부위와 시행 순서는 의료진이 결정합니다.' }].map(({ icon: Icon, title, text }) => <div key={title}><span className="mini-icon"><Icon size={22}/></span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div><div className="guide-callout"><ShieldCheck size={19}/><p>원인별 연결은 병원에서 설정한 상담 기준입니다. 진찰로 확인한 소견에 따라 후보를 검토하며 점수만으로 원인·기전을 판정하지 않습니다. 관찰 점수는 진단 검사나 검증된 척도를 대체하지 않습니다. 얼굴 부위는 항목을 찾기 위한 안내이며 점수와 시술 후보는 항목 단위로 기록됩니다. 시술 부위·방식·횟수는 진찰 후 별도로 결정합니다.</p></div><p className="modal-footnote">환자 식별정보·사진 업로드·서버 저장 기능은 포함하지 않았습니다. 화면을 닫거나 새로고침하면 상담 내용이 초기화됩니다.</p></>}</Modal>}
    <div className="print-report"><ConsultationReport {...{ scores, priorities, plans, createdAt, isSample, note, clinician, profile, safety }}/></div>
    <div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite"><CheckCheck size={15}/>{toast}</div>
  </>;
}
