import faceIllustration from '../assets/consultation-face.webp?inline';

// Regions follow this reference illustration's landmarks. They navigate the
// assessment and do not measure patients or mark procedure placement.
const REGIONS = {
  forehead: { number: '1', point: [160, 113], marker: [29, 106], paths: ['M96 85Q157 69 225 85L229 131Q160 144 94 131Z'] },
  eyes: { number: '2', point: [223, 174], marker: [291, 156], paths: ['M80 150Q111 141 146 153L149 181Q116 194 78 184Z', 'M176 153Q210 141 242 150L246 184Q209 194 172 181Z'] },
  nose: { number: '3', point: [160, 211], marker: [29, 201], paths: ['M148 163Q161 158 174 163L184 227Q160 243 138 227Z'] },
  cheeks: { number: '4', point: [222, 228], marker: [291, 223], paths: ['M74 193Q96 184 118 195L138 250Q121 275 94 263Q79 232 74 193Z', 'M203 195Q225 184 246 193Q242 232 227 263Q198 275 182 250Z'] },
  mouth: { number: '5', point: [160, 263], marker: [29, 256], paths: ['M129 242Q160 229 192 242L199 272Q162 291 124 272Z'] },
  chin: { number: '6', point: [160, 303], marker: [291, 299], paths: ['M132 282Q160 291 188 282L198 309Q160 332 122 309Z'] },
  jaw: { number: '7', point: [103, 294], marker: [29, 311], paths: ['M78 251Q92 281 125 309L121 330Q85 302 78 260Z', 'M242 251Q228 281 195 309L199 330Q235 302 242 260Z'] },
  neck: { number: '8', point: [160, 364], marker: [291, 369], paths: ['M113 322Q160 344 207 322L230 389Q160 410 90 389Z'] },
};

export const FACE_ZONE_NUMBERS = Object.fromEntries(Object.entries(REGIONS).map(([id, region]) => [id, region.number]));

export default function FaceMap({ zones, selectedZone, onSelect }) {
  return (
    <svg className="face-map" viewBox="0 0 320 426.6667" role="group" aria-label="상담 부위 선택용 얼굴 그림">
      <title>정면 얼굴의 부위 선택</title>
      <desc>눈가, 양볼, 턱선은 좌우가 함께 선택됩니다. 얼굴 영역이나 번호를 눌러 관련 평가 항목을 볼 수 있습니다.</desc>
      <image className="face-image" href={faceIllustration} x="0" y="0" width="320" height="426.6667" preserveAspectRatio="xMidYMid meet" aria-hidden="true"/>
      {zones.filter(zone => REGIONS[zone.id]).map(zone => {
        const region = REGIONS[zone.id];
        const active = selectedZone === zone.id;
        const [x, y] = region.marker;
        return <g key={zone.id} className={`face-point face-zone ${active ? 'active' : ''}`} role="button" tabIndex="0" aria-label={`${zone.label} 선택`} aria-pressed={active} onClick={() => onSelect(zone.id)} onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(zone.id); }
        }}>
          <title>{zone.label}</title>
          {region.paths.map((path, index) => <path key={index} className="face-zone-shape" d={path} fill="transparent" stroke="transparent"/>)}
          <path className="face-zone-connector" d={`M${x} ${y}L${region.point[0]} ${region.point[1]}`} fill="none" pointerEvents="none"/>
          <circle cx={x} cy={y} r="14" fill="transparent"/>
          <circle className="face-zone-marker" cx={x} cy={y} r="8.5" fill="#fff" stroke="#526d64" strokeWidth=".85"/>
          <text className="face-zone-number" x={x} y={y + .4} textAnchor="middle" dominantBaseline="middle" fontSize="7.5" pointerEvents="none">{region.number}</text>
        </g>;
      })}
    </svg>
  );
}
