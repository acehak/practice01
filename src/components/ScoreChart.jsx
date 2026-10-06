export default function ScoreChart({ categories, scores }) {
  const cx = 145, cy = 112, radius = 72;
  const at = (index, r) => {
    const angle = -Math.PI / 2 + index * 2 * Math.PI / categories.length;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
  };
  const path = r => categories.map((_, i) => at(i, r).join(',')).join(' ');
  const complete = categories.every(c => Number.isFinite(scores[c.id]));
  return <svg className="score-chart" viewBox="0 0 290 226" role="img" aria-label="항목별 관찰 점수 차트. 미평가 항목은 표시하지 않습니다.">
    <defs><linearGradient id="consult-score-fill" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#8cb0ee" stopOpacity=".28"/><stop offset="1" stopColor="#a095dd" stopOpacity=".12"/></linearGradient></defs>
    {[1, 2, 3, 4].map(n => <polygon key={n} points={path(radius * n / 4)} fill={n === 4 ? '#f7faff' : 'none'} stroke="#e1e9f6" strokeWidth=".85"/>).reverse()}
    {categories.map((c, i) => {
      const [x, y] = at(i, radius), [lx, ly] = at(i, radius + 23);
      return <g key={c.id}><line x1={cx} y1={cy} x2={x} y2={y} stroke="#e1e9f6" strokeWidth=".85"/><text x={lx} y={ly + 4} textAnchor="middle" fill="#7588a7" fontSize="9">{c.shortLabel}</text></g>;
    })}
    {complete && <polygon points={categories.map((c, i) => at(i, radius * scores[c.id] / 4).join(',')).join(' ')} fill="url(#consult-score-fill)" stroke="#7c9dd8" strokeWidth="1.5" strokeLinejoin="round"/>}
    {categories.filter(c => Number.isFinite(scores[c.id])).map(c => {
      const i = categories.indexOf(c), [x, y] = at(i, radius * scores[c.id] / 4);
      return <g key={c.id}><title>{c.label}: {scores[c.id]}점</title>{!complete && <line x1={cx} y1={cy} x2={x} y2={y} stroke="#93afe1" strokeWidth="1.8" strokeLinecap="round"/>}<circle cx={x} cy={y} r="3.2" fill="#7397d5" stroke="#fff" strokeWidth="1.4"/></g>;
    })}
    {!categories.some(c => Number.isFinite(scores[c.id])) && <circle cx={cx} cy={cy} r="2" fill="#b3c7e8"/>}
  </svg>;
}
