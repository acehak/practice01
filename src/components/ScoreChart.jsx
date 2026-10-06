export default function ScoreChart({ categories, scores }) {
  const cx = 145, cy = 112, radius = 72;
  const at = (index, r) => {
    const angle = -Math.PI / 2 + index * 2 * Math.PI / categories.length;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
  };
  const path = r => categories.map((_, i) => at(i, r).join(',')).join(' ');
  const complete = categories.every(c => Number.isFinite(scores[c.id]));
  return <svg className="score-chart" viewBox="0 0 290 226" role="img" aria-label="항목별 관찰 점수 차트. 미평가 항목은 표시하지 않습니다.">
    {[1, 2, 3, 4].map(n => <polygon key={n} points={path(radius * n / 4)} fill={n === 4 ? '#f6f8f3' : 'none'} stroke="#e5eae2" strokeWidth="1"/>).reverse()}
    {categories.map((c, i) => {
      const [x, y] = at(i, radius), [lx, ly] = at(i, radius + 23);
      return <g key={c.id}><line x1={cx} y1={cy} x2={x} y2={y} stroke="#e5eae2"/><text x={lx} y={ly + 4} textAnchor="middle" fill="#848d82" fontSize="10">{c.shortLabel}</text></g>;
    })}
    {complete && <polygon points={categories.map((c, i) => at(i, radius * scores[c.id] / 4).join(',')).join(' ')} fill="#688c79" fillOpacity=".17" stroke="#52796f" strokeWidth="1.7"/>}
    {categories.filter(c => Number.isFinite(scores[c.id])).map(c => {
      const i = categories.indexOf(c), [x, y] = at(i, radius * scores[c.id] / 4);
      return <g key={c.id}><title>{c.label}: {scores[c.id]}점</title>{!complete && <line x1={cx} y1={cy} x2={x} y2={y} stroke="#7a9c8a" strokeWidth="2"/>}<circle cx={x} cy={y} r="3" fill="#52796f" stroke="#fff" strokeWidth="1.5"/></g>;
    })}
  </svg>;
}
