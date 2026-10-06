/**
 * Consultation aids, not validated diagnostic scores or automatic prescriptions.
 * Null means not assessed; an explicit zero means assessed with no visible concern.
 */
export const SCORE_LABELS = ['관찰되지 않음', '경미', '보통', '뚜렷함', '매우 뚜렷함'];

export const ZONES = [
  { id: 'forehead', label: '이마' },
  { id: 'eyes', label: '눈가' },
  { id: 'nose', label: '코' },
  { id: 'cheeks', label: '양 볼' },
  { id: 'mouth', label: '입가' },
  { id: 'chin', label: '턱끝' },
  { id: 'jaw', label: '턱선' },
  { id: 'neck', label: '목' },
  { id: 'fullFace', label: '얼굴 전체' },
];

export const CATEGORIES = [
  {
    id: 'pigment', label: '잡티·색소', shortLabel: '색소', group: 'skin', color: '#BE9464',
    description: '기미·잡티 등 색 변화의 정도. 색소 유형은 진찰로 구분합니다.',
    anchors: ['뚜렷한 색소 변화 없음', '옅은 색소가 일부 관찰됨', '국소 색소가 분명하게 관찰됨', '여러 부위의 진한 색소가 눈에 띔', '넓고 진한 색소 변화가 매우 뚜렷함'],
    zones: ['forehead', 'cheeks', 'nose'],
  },
  {
    id: 'redness', label: '붉은기', shortLabel: '붉은기', group: 'skin', color: '#D78283',
    description: '홍조·지속적 발적·혈관의 관찰 정도. 원인과 활동성 염증을 따로 확인합니다.',
    anchors: ['뚜렷한 붉은기 없음', '옅은 국소 붉은기', '국소 붉은기가 분명함', '지속되는 붉은기 또는 혈관이 여러 부위에서 뚜렷함', '광범위하거나 강한 붉은기가 매우 뚜렷함'],
    zones: ['cheeks', 'nose', 'chin'],
  },
  {
    id: 'acne', label: '활성 여드름', shortLabel: '여드름', group: 'skin', color: '#C78470',
    description: '현재 보이는 면포·구진·농포 등. 과거 흉터와 구분해 기록합니다.',
    anchors: ['활성 병변이 관찰되지 않음', '소수의 국소 면포 또는 작은 병변', '여러 면포·구진이 분명하게 관찰됨', '여러 부위의 염증성 병변이 뚜렷함', '광범위한 염증 또는 깊고 통증 있는 병변이 매우 뚜렷함'],
    zones: ['forehead', 'cheeks', 'chin', 'jaw'],
  },
  {
    id: 'texture', label: '흉터·모공', shortLabel: '피부결', group: 'skin', color: '#A98CBB',
    description: '흉터·모공·피부결의 관찰 정도. 흉터 형태와 현재 염증을 먼저 구분합니다.',
    anchors: ['뚜렷한 흉터·모공 변화 없음', '국소 모공 또는 얕은 결 변화', '모공·얕은 흉터가 분명하게 관찰됨', '여러 부위의 함몰·불균일한 피부결이 뚜렷함', '깊거나 넓은 흉터·결 변화가 매우 뚜렷함'],
    zones: ['cheeks', 'nose', 'forehead'],
  },
  {
    id: 'wrinkles', label: '탄력·잔주름', shortLabel: '잔주름', group: 'structure', color: '#7D9EBD',
    description: '진피의 피부 탄력과 잔주름 변화. 표정 주름·정적 주름을 구조적 처짐과 구분합니다.',
    anchors: ['뚜렷한 탄력·주름 변화 없음', '표정에서만 가벼운 잔주름', '잔주름 또는 탄력 변화가 분명함', '안정 시에도 주름·탄력 변화가 뚜렷함', '깊고 넓은 주름·탄력 변화가 매우 뚜렷함'],
    zones: ['forehead', 'eyes', 'mouth', 'neck'],
  },
  {
    id: 'lifting', label: '처짐·리프팅', shortLabel: '처짐', group: 'structure', color: '#6BADA2',
    description: '볼·입가·턱선의 처짐 정도를 기록하고 근막층·유지인대·지방 볼륨·지지 부족을 의사 진찰로 구분합니다. 피부 탄력은 별도 항목에서 평가합니다.',
    anchors: ['뚜렷한 처짐 없음', '국소 윤곽 경계가 약간 흐려짐', '볼·입가·턱선 처짐이 분명함', '여러 부위의 처짐과 접힘이 뚜렷함', '넓고 큰 처짐·윤곽 변화가 매우 뚜렷함'],
    zones: ['cheeks', 'mouth', 'jaw', 'neck'],
  },
  {
    id: 'contour', label: '윤곽', shortLabel: '윤곽', group: 'structure', color: '#7D9E85',
    description: '환자가 개선을 원하는 윤곽 특성. 점수로 지방·근육·골격 원인을 판정하지 않습니다.',
    anchors: ['개선하려는 윤곽 특성이 없음', '국소 윤곽 특성이 경미함', '개선하려는 윤곽 특성이 분명함', '여러 부위의 윤곽 특성이 뚜렷함', '개선하려는 윤곽 특성이 매우 뚜렷함'],
    zones: ['cheeks', 'chin', 'jaw'],
  },
  {
    id: 'volume', label: '볼륨', shortLabel: '볼륨', group: 'structure', color: '#C598AB',
    description: '꺼짐·볼륨 불균형의 관찰 정도. 해부학적 위치와 원인을 확인합니다.',
    anchors: ['뚜렷한 꺼짐·불균형 없음', '국소 꺼짐이 경미함', '국소 꺼짐·불균형이 분명함', '여러 부위의 꺼짐·불균형이 뚜렷함', '깊거나 넓은 꺼짐·불균형이 매우 뚜렷함'],
    zones: ['forehead', 'eyes', 'cheeks', 'mouth', 'chin'],
  },
  {
    id: 'barrier', label: '장벽·건조·기타', shortLabel: '장벽', group: 'care', color: '#C6AB72',
    description: '건조·각질·당김·자극의 관찰 정도. 기타 불편은 상담 메모로 보완합니다.',
    anchors: ['뚜렷한 건조·자극 없음', '국소 건조 또는 가벼운 당김', '건조·각질·자극이 분명함', '여러 부위의 건조·각질·자극이 뚜렷함', '광범위하거나 심한 건조·자극이 매우 뚜렷함'],
    zones: ['fullFace', 'mouth', 'cheeks'],
  },
];

export const INITIAL_SCORES = Object.fromEntries(CATEGORIES.map(({ id }) => [id, null]));
export const SAMPLE_SCORES = {
  pigment: 3, redness: 1, acne: 0, texture: 2, wrinkles: 2,
  lifting: 3, contour: 1, volume: 2, barrier: 1,
};

export const CLINIC_TREATMENTS = [
  { id: 'ultherapy-prime', label: '울쎄라피 프라임', type: 'device', description: '근막층 처짐·이완 진찰 소견에 따른 병원 설정 후보. 얼굴의 지방 분포·피부 두께·지지 구조와 해당 장비·부위의 허가·적응증을 확인합니다.' },
  { id: 'thermage-flx', label: '써마지 FLX', type: 'device', description: '진피의 피부 탄력·잔주름 항목에서 검토하는 고주파 기반 후보. 피부 상태·두께와 해당 장비·부위의 허가·적응증을 확인합니다.' },
  { id: 'sofwave', label: '소프웨이브', type: 'device', description: '피부 탄력·잔주름의 초음파 기반 후보. 의사가 더 짙은 정적 주름으로 구분하면 병원 선호 기준상 우선 검토하며 비교 효과를 보장하지 않습니다. 적용 부위와 적응증을 확인합니다.' },
  { id: 'onda', label: '온다', type: 'device', description: '지방 관련 윤곽 치료 후보. 원인이 지방인지와 해당 부위의 허가·적응증을 먼저 확인합니다.' },
  { id: 'titanium', label: '티타늄', type: 'device', description: '유지인대 지지 저하 소견의 병원 상담 기준상 후보. 이 연결은 장비의 유지인대 치료 기전이나 효과를 확정하지 않습니다. 색소·혈관 전용 치료로 대체 해석하지 않고 피부 두께·지방 분포와 정확한 장비·부위의 허가·적응증을 확인합니다.' },
  { id: 'potenza', label: '포텐자', type: 'device', description: '피부결·모공·흉터 치료 후보. 현재 염증, 피부 특성과 해당 모드의 적응증을 확인합니다.' },
  { id: 'filler', label: '필러', type: 'injectable', description: '얼굴·바디 볼륨과 지지 보완에 사용하는 후보. 리프팅 필러도 위치·해부학·제품 적응증을 평가합니다. 얼굴 평가 점수로 바디 치료를 추천하지 않습니다.' },
  { id: 'botox', label: '보톡스', type: 'injectable', description: '표정 주름 또는 확인된 근육성 윤곽의 치료 후보. 원인과 적용 부위를 확인합니다.' },
  { id: 'rejuran', label: '리쥬란', type: 'injectable', description: '피부 상태에 따른 주입 치료 후보. 실제 보유 제품의 허가·적응증·주의사항을 확인합니다.' },
  { id: 'rituo', label: '리투오', type: 'injectable', description: '피부 상태에 따른 주입 치료 후보. 정확한 제품 정보와 허가·적응증·주의사항을 확인합니다.' },
  { id: 'gouri', label: '고우리', type: 'injectable', description: '볼륨·피부 상태에 따른 주입 치료 후보. 정확한 제품 정보와 허가·적응증·주의사항을 확인합니다.' },
  { id: 'hilo-wave', label: '힐로웨이브', type: 'injectable', description: '피부 상태에 따른 주입 치료 후보. 정확한 제품 정보와 허가·적응증·주의사항을 확인합니다.' },
  { id: 'radiesse', label: '레디어스', type: 'injectable', description: '볼륨·지지 보완의 대체 후보. 제품 허가·적응증, 해부학적 위치와 주의사항을 확인합니다.' },
];

/** Clinic-defined consultation mapping; not a universal treatment guideline. */
export const CLINIC_PROTOCOL = {
  label: '병원 상담 기준',
  description: '의사가 확인한 원인에 연결하는 병원 설정입니다. 점수만으로 원인을 판정하거나 장비 기전을 확정하지 않습니다.',
  lifting: [
    { subtype: 'fascia', label: '근막층 처짐·이완', treatment: '울쎄라피 프라임' },
    { subtype: 'ligament', label: '유지인대 지지 저하', treatment: '티타늄' },
    { subtype: 'fat', label: '지방 볼륨 과다', treatment: '온다' },
  ],
  dermal: { categoryId: 'wrinkles', subtype: 'laxity', label: '피부 탄력·잔주름', treatment: '써마지 FLX', treatments: ['써마지 FLX', '소프웨이브'] },
  pronounced: { categoryId: 'wrinkles', subtype: 'pronounced', label: '더 짙은 정적 주름', treatment: '소프웨이브', treatments: ['소프웨이브', '써마지 FLX'], preference: '병원 선호 기준: 소프웨이브 우선 검토' },
};

export const PROFILE_FIELDS = [
  { id: 'sensitivity', label: '피부 반응', options: [
    { value: 'unknown', label: '미확인' }, { value: 'normal', label: '뚜렷한 민감 반응 없음' }, { value: 'reactive', label: '민감 반응 이력 있음' },
  ] },
  { id: 'downtime', label: '회복 여유', options: [
    { value: 'unknown', label: '미확인' }, { value: 'minimal', label: '회복 부담 최소화' }, { value: 'flexible', label: '회복 기간 협의 가능' },
  ] },
  { id: 'approach', label: '시술 선호', options: [
    { value: 'unknown', label: '미확인' }, { value: 'noninvasive', label: '비침습 우선' }, { value: 'open', label: '주입·미세침도 상담 가능' },
  ] },
];

const subtypeOptions = (...pairs) => [
  { value: 'unknown', label: '원인·유형 미확인' },
  ...pairs.map(([value, label]) => ({ value, label })),
];

export const SUBTYPE_FIELDS = {
  pigment: { label: '색소 유형', options: subtypeOptions(['melasma', '기미 양상'], ['spots', '국소 잡티 양상'], ['pih', '염증 후 색소 양상'], ['mixed', '복합 색소']) },
  redness: { label: '붉은기 유형', options: subtypeOptions(['vascular', '혈관성 양상'], ['inflammatory', '염증성 양상']) },
  texture: { label: '피부결 유형', options: subtypeOptions(['pores', '모공 중심'], ['atrophic', '위축성 흉터 중심'], ['mixed', '모공·흉터 복합']) },
  wrinkles: { label: '주름·탄력 유형', options: subtypeOptions(['dynamic', '표정 주름'], ['static', '정적 잔주름'], ['laxity', '탄력 저하'], ['pronounced', '더 짙은 정적 주름']) },
  lifting: { label: '진찰로 확인한 처짐 원인', options: subtypeOptions(['fascia', '근막층 처짐·이완'], ['ligament', '유지인대 지지 저하'], ['fat', '지방 볼륨 과다'], ['volume', '볼륨·지지 부족 동반']) },
  contour: { label: '윤곽 관련 요소', options: subtypeOptions(['muscle', '근육 관련'], ['fat', '지방 관련'], ['skeletal', '골격 관련']) },
  volume: { label: '볼륨 변화 범위', options: subtypeOptions(['localized', '국소 꺼짐'], ['diffuse', '넓은 볼륨·지지 변화']) },
};

/** Explicit empty selections clear legacy single-cause values. Never infer causes from scores. */
export function normalizeLiftingCauses(profile = {}) {
  const input = profile && typeof profile === 'object' ? profile : {};
  const chosen = Array.isArray(input.liftingCauses) ? input.liftingCauses : [input.subtypes?.lifting];
  return SUBTYPE_FIELDS.lifting.options
    .filter(({ value }) => value !== 'unknown' && chosen.includes(value))
    .map(({ value }) => value);
}

/** Clamp valid numeric input to the available ordinal scale; preserve missingness. */
export function normalizeScore(value) {
  if (value === null || value === undefined || typeof value === 'boolean') return null;
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(4, Math.max(0, Math.round(number))) : null;
}

const OPTIONS = {
  pigment: {
    basic: ['색소 진단 + 자외선 차단 관리', '기미·잡티·염증 후 색소 등 유형과 변화 양상을 진찰로 구분하고 자외선 차단·저자극 관리를 상담합니다. 복합 색소는 진단을 먼저 합니다.'],
    extended: ['색소 전용 치료 옵션 확인', '현재 보유 목록에는 색소 전용 장비가 확인되지 않습니다. 색소 진단 후 별도 치료 옵션 또는 외부 진료를 확인합니다. 티타늄 등 탄력 장비를 색소 전용 치료로 대체하지 않습니다.'],
    treatments: [],
    risk: 'procedure',
  },
  redness: {
    basic: ['붉은기 원인 평가 + 유발 요인 관리', '홍조·주사·피부염·혈관성 변화를 구분하고 현재 활동성 염증과 자극 요인을 확인합니다. 자극을 줄이는 피부 관리를 상담합니다.'],
    extended: ['혈관·홍조 전용 치료 옵션 확인', '현재 보유 목록에는 혈관 전용 장비가 확인되지 않습니다. 홍조 원인과 활동성 염증을 구분한 뒤 별도 치료 옵션 또는 외부 진료를 확인합니다.'],
    treatments: [],
    risk: 'procedure',
  },
  acne: {
    basic: ['활성 여드름 진료 + 기초 관리', '면포·염증성 병변·깊은 병변을 구분하고 피부 장벽을 고려한 세안·보습 관리를 상담합니다. 흉터 시술보다 현재 여드름의 평가와 치료를 우선합니다.'],
    extended: ['여드름 처방 치료 범위 검토', '병변 형태, 증상, 기존 치료와 금기사항을 확인하고 외용·경구 치료의 필요성을 진료에서 검토합니다. 점수만으로 약물이나 치료 강도를 결정하지 않습니다.'],
    treatments: [],
    risk: 'prescription',
  },
  texture: {
    basic: ['흉터·모공 유형 평가 + 피부결 관리', '흉터 형태와 모공·피지 특성, 활동성 여드름을 구분합니다. 자극을 줄이는 관리와 염증 조절을 먼저 상담합니다.'],
    extended: ['포텐자 피부결·흉터 치료 검토', '흉터 형태·모공·피부 상태에 따라 포텐자의 적합성을 검토합니다. 현재 활동성 염증을 먼저 확인하고 해당 모드의 허가·적응증과 색소침착 위험을 확인합니다.'],
    treatments: ['포텐자'],
    risk: 'procedure',
  },
  wrinkles: {
    basic: ['보습·자외선 차단 + 주름 유형 평가', '표정 주름과 정적 주름, 건조에 따른 잔주름을 구분하고 보습·자외선 차단 관리를 상담합니다.'],
    extended: ['진찰로 주름·탄력 유형 확인', '유형이 미확인이므로 표정 주름·정적 잔주름·피부 탄력 저하·더 짙은 정적 주름을 의사가 먼저 구분합니다. 점수만으로 주름의 깊이나 원인을 추론하거나 장비·주입 시술을 연결하지 않습니다. 유형 확인 후 해당 원인의 기본 후보를 검토합니다.'],
    treatments: [],
    risk: 'clinical-review',
  },
  lifting: {
    basic: ['처짐 원인 확인 후 후보 선택', '근막층 처짐·이완, 유지인대 지지 저하, 지방 볼륨 과다와 볼륨·지지 부족을 진찰로 구분합니다. 원인이 미확인이므로 개별 시술 후보를 연결하지 않습니다. 점수는 관찰 정도이며 원인이나 장비 선택을 결정하지 않습니다.'],
    extended: ['동반 요소 평가 후 플랜 구성', '원인과 적용 부위, 지방 분포·피부 두께·지지 구조를 확인한 후 병원 상담 기준에 맞는 기본 후보를 선택합니다. 복합 원인은 항목별로 추가 평가하며 장비를 일괄 추천하거나 점수에 따라 강도를 높이지 않습니다.'],
    treatments: [],
    risk: 'clinical-review',
  },
  contour: {
    basic: ['윤곽 원인·목표 확인', '지방·근육·골격·비대칭·처짐을 임상적으로 구분하고 원하는 변화와 현실적인 범위를 상담합니다. 윤곽 점수로 원인을 자동 진단하지 않습니다.'],
    extended: ['원인별 윤곽 시술·전문 진료 검토', '근육성 원인이 확인되면 보톡스, 지방 관련 원인이 확인되고 해당 부위의 적응증에 맞으면 온다, 골격 관련이면 전문 진료를 논의합니다. 타입 확인 전 시술을 정하지 않습니다. 점수로 지방·근육·골격 원인을 자동 판정하지 않습니다.'],
    treatments: ['보톡스', '온다'],
    risk: 'procedure',
  },
  volume: {
    basic: ['얼굴 필러 적합성 검토', '얼굴의 꺼짐 위치·원인·기존 주입 시술 이력과 혈관 관련 위험을 평가한 뒤 필러의 적합성을 검토합니다. 부종·처짐을 볼륨 부족과 구분하고 리프팅 필러는 지지 구조까지 확인합니다.'],
    basicTreatments: ['필러'],
    basicRisk: 'procedure',
    fallback: ['꺼짐 위치·원인 확인 + 목표 설정', '볼륨 부족과 처짐·부종·비대칭을 구분하고 기존 주입 시술 이력과 원하는 변화 범위를 확인합니다. 시술은 안전 조건 검토 후 다시 논의합니다.'],
    extended: ['볼륨·지지 보완의 대체 주입 옵션', '고우리·레디어스는 필러와 모두 병합하는 필수 단계가 아니라 개별 평가에 따른 대체 후보입니다. 정확한 제품 정보, 해부학적 위치, 허가·적응증과 위험을 확인한 후 의사가 선택합니다. 얼굴 점수로 바디 시술을 추천하지 않습니다.'],
    treatments: ['고우리', '레디어스'],
    risk: 'procedure',
  },
  barrier: {
    basic: ['장벽 회복을 위한 저자극 관리', '건조·각질·당김·자극 양상을 확인하고 순한 세안, 보습과 자외선 차단을 상담합니다. 불편을 유발한 제품·시술도 확인합니다.'],
    extended: ['동반 피부염·건조 원인 진료', '지속되거나 뚜렷한 증상은 접촉성 피부염 등 원인 질환 가능성을 진료에서 평가하고 필요 시 치료를 검토합니다. 추가 미용 시술보다 원인 평가를 우선합니다.'],
    treatments: [],
    risk: 'clinical-review',
  },
};

function normalizeProfile(profile) {
  const input = profile && typeof profile === 'object' ? profile : {};
  const clinicLabels = new Set(CLINIC_TREATMENTS.map(({ label }) => label));
  const result = {
    subtypes: {}, liftingCauses: normalizeLiftingCauses(input),
    combinationTreatments: Array.isArray(input.combinationTreatments)
      ? [...new Set(input.combinationTreatments.filter((label) => clinicLabels.has(label)))] : [],
    invalidCombinationSelection: Array.isArray(input.combinationTreatments)
      && input.combinationTreatments.some((label) => !clinicLabels.has(label)),
  };
  for (const field of PROFILE_FIELDS) {
    result[field.id] = field.options.some(({ value }) => value === input[field.id]) ? input[field.id] : 'unknown';
  }
  for (const [id, field] of Object.entries(SUBTYPE_FIELDS)) {
    const chosen = input.subtypes?.[id];
    result.subtypes[id] = field.options.some(({ value }) => value === chosen) ? chosen : 'unknown';
  }
  return result;
}

function personalizedOptions(categoryId, profile) {
  const result = { ...OPTIONS[categoryId] };
  const subtype = profile.subtypes[categoryId];
  const chosenLabel = SUBTYPE_FIELDS[categoryId]?.options.find(({ value }) => value === subtype)?.label;
  result.personalization = [];
  if (chosenLabel) result.personalization.push(subtype === 'unknown'
    ? '유형 미확인: 원인 구분 전에는 개별 시술을 확정하지 않습니다.'
    : `의사 선택 유형: ${chosenLabel}. 이 임상 분류에 맞춰 후보를 좁혔습니다.`);

  if (categoryId === 'pigment') {
    const pigmentOptions = {
      melasma: ['기미 양상 평가 + 자외선·자극 관리', '기미 양상과 복합 색소 여부를 진찰로 확인하고 자외선·자극 관리부터 상담합니다.', '기미 치료 옵션 개별 확인', '기미의 악화·재발과 염증 후 색소침착 가능성을 고려해 치료 옵션을 확인합니다. 현재 보유 목록에는 색소 전용 장비가 확인되지 않아 별도 옵션 또는 외부 진료를 논의합니다.'],
      spots: ['국소 잡티 병변 진찰', '잡티로 보이는 개별 병변의 종류와 변화 양상을 확인한 뒤 관리 방향을 상담합니다.', '국소 병변별 치료 옵션 확인', '병변의 진단과 위치에 따라 별도 색소 치료 옵션을 확인합니다. 변화하는 병변은 미용 시술보다 진단을 우선합니다. 현재 보유 목록에는 색소 전용 장비가 확인되지 않습니다.'],
      pih: ['염증 후 색소의 원인·활동성 확인', '선행 염증·자극·시술 이력과 현재 활동성 염증을 확인하고 자극을 줄이는 관리부터 상담합니다.', '염증 조절 후 색소 치료 재평가', '원인 염증과 장벽 상태를 먼저 평가합니다. 색소 치료는 진단 후 별도 옵션 또는 외부 진료를 확인하며 현재 보유 목록에는 색소 전용 장비가 확인되지 않습니다.'],
      mixed: ['복합 색소의 유형별 진찰', '기미·잡티·염증 후 색소를 부위별로 구분하고 하나의 시술로 모두 해결된다고 가정하지 않습니다.', '복합 색소의 단계별 옵션 확인', '색소 유형별로 우선순위와 치료 범위를 진찰로 결정합니다. 현재 보유 목록에는 색소 전용 장비가 확인되지 않아 별도 옵션 또는 외부 진료를 확인합니다.'],
    };
    const matched = pigmentOptions[subtype];
    if (matched) {
      result.basic = matched.slice(0, 2);
      result.extended = matched.slice(2, 4);
    }
  }
  if (categoryId === 'redness' && subtype === 'inflammatory') {
    result.basic = ['염증성 붉은기 원인 진료', '주사·피부염·자극 등 원인과 현재 활동성 염증을 진찰로 확인합니다. 원인 조절과 장벽 관리를 먼저 상담합니다.'];
    result.extended = ['지속되는 염증·자극 원인 재평가', '증상·유발 요인·기존 치료를 확인하고 원인 진료에서 필요한 치료를 검토합니다. 염증성 양상만으로 현재 염증의 활동성을 단정하지 않습니다.'];
    result.risk = 'clinical-review';
    result.treatments = [];
  } else if (categoryId === 'redness' && subtype === 'vascular') {
    result.basic = ['혈관성 붉은기·홍조 원인 확인', '혈관성 요소와 주사·피부염의 동반 여부를 확인하고 홍조 유발 요인 관리를 상담합니다.'];
    result.extended = ['혈관 전용 치료의 별도 옵션 확인', '혈관성 양상이 확인되어도 현재 보유 목록에는 혈관 전용 장비가 확인되지 않습니다. 허가·적응증에 맞는 별도 옵션 또는 외부 진료를 논의합니다.'];
  }
  if (categoryId === 'texture' && subtype === 'pores') {
    result.basic = ['모공·피지 특성 확인 + 기초 관리', '모공이 도드라지는 위치, 피지와 장벽 상태, 활동성 여드름을 구분하고 저자극 관리를 상담합니다.'];
    result.extended = ['모공 중심 포텐자 적합성 검토', '모공 중심의 피부 상태에 포텐자의 해당 모드가 적합한지 검토합니다. 현재 염증과 허가·적응증을 확인하며 흉터 치료로 자동 확대하지 않습니다.'];
  } else if (categoryId === 'texture' && subtype === 'atrophic') {
    result.basic = ['위축성 흉터 형태별 평가', '흉터의 깊이·형태·위치와 유착 여부, 활동성 여드름을 진찰로 확인합니다.'];
    result.extended = ['흉터 형태에 따른 포텐자·별도 옵션 확인', '포텐자가 적합한 흉터 유형인지 검토하고, 적합하지 않은 형태에는 별도 치료 옵션이나 전문 진료를 논의합니다. 모든 위축성 흉터에 같은 장비를 적용하지 않습니다.'];
  }
  if (categoryId === 'wrinkles' && subtype === 'dynamic') {
    result.basic = ['표정 주름의 보톡스 적합성 검토', '표정과 근육 작용, 주름 위치·비대칭·기존 시술을 진찰로 확인한 뒤 보톡스 후보를 검토합니다. 정적 주름이나 탄력 저하 치료로 자동 대체하지 않습니다.'];
    result.basicTreatments = ['보톡스'];
    result.basicRisk = 'procedure';
    result.extended = ['동반 정적 주름·피부 상태 재평가', '보톡스의 추가 병합을 자동 제안하지 않습니다. 동반 건조·정적 잔주름·탄력 변화가 확인되면 해당 항목을 별도로 평가합니다.'];
    result.treatments = [];
    result.risk = 'clinical-review';
  } else if (categoryId === 'wrinkles' && subtype === 'static') {
    result.basic = ['정적 잔주름의 써마지 FLX·소프웨이브 후보 선택', '안정 시 잔주름과 건조·피부결·꺼짐을 구분하고 병원 상담 기준에 따라 써마지 FLX와 소프웨이브 중 적합한 후보를 선택합니다. 두 장비는 이 원인에 대한 대안이며 동시 시행을 자동 제안하지 않습니다. 보습·자외선 차단과 피부 두께·부위별 허가·적응증을 확인합니다.'];
    result.basicTreatments = ['써마지 FLX', '소프웨이브'];
    result.basicRisk = 'procedure';
    result.extended = ['잔주름에 동반된 피부 상태의 추가 후보 검토', '동반 건조·피부결 소견과 환자의 목표에 추가 치료가 필요한지 먼저 확인합니다. 리쥬란·리투오·힐로웨이브 중 실제 제품 허가·적응증에 맞는 후보를 선택할 수 있으며 기본 기기와의 병합 여부·순서·간격은 의사가 결정합니다. 모든 주입 후보를 함께 시행하는 플랜이 아닙니다.'];
    result.treatments = ['리쥬란', '리투오', '힐로웨이브'];
    result.risk = 'procedure';
  } else if (categoryId === 'wrinkles' && subtype === 'laxity') {
    result.basic = ['피부 탄력 저하의 써마지 FLX·소프웨이브 후보 선택', '진피의 피부 탄력 변화와 피부 두께·지방 분포·자극 여부를 진찰로 확인하고 병원 상담 기준에 따라 써마지 FLX와 소프웨이브 중 적합한 후보를 선택합니다. 두 장비는 이 원인에 대한 대안이며 동시 시행을 자동 제안하지 않습니다. 구조적 처짐과 구분하고 장비·부위의 허가·적응증을 확인합니다.'];
    result.basicTreatments = ['써마지 FLX', '소프웨이브'];
    result.basicRisk = 'procedure';
    result.extended = ['탄력 저하에 동반된 다른 원인 재평가', '피부 탄력 외 근막층·유지인대·지방 볼륨·꺼짐 또는 피부결 변화가 함께 있는지 각각 평가합니다. 복수 원인이 확인되면 해당 원인별 기본 후보와 조합 필요성을 검토합니다. 단일 탄력 소견만으로 기기를 추가하지 않습니다.'];
    result.treatments = [];
    result.risk = 'clinical-review';
  } else if (categoryId === 'wrinkles' && subtype === 'pronounced') {
    result.basic = ['더 짙은 정적 주름의 소프웨이브 우선 검토', '의사가 더 짙은 정적 주름으로 구분한 경우 병원 선호 기준에 따라 소프웨이브를 우선 검토하고 써마지 FLX를 대안으로 남깁니다. 이는 장비 간 비교 효과를 확정하거나 보장하는 기준이 아닙니다. 깊은 접힘의 구조·꺼짐·근육 기여도를 구분하고 피부 두께·적용 부위·허가·적응증을 확인합니다. 두 장비를 함께 시행하는 기본 플랜이 아닙니다.'];
    result.basicTreatments = ['소프웨이브', '써마지 FLX'];
    result.preferredTreatment = '소프웨이브';
    result.basicRisk = 'procedure';
    result.extended = ['짙은 주름의 동반 구조·볼륨 요소 재평가', '짙은 주름에 동반된 꺼짐·표정 작용·처짐을 진찰로 별도 평가합니다. 추가 원인이 확인되면 각 원인의 기본 후보와 조합 필요성을 상담하며 점수만으로 주입이나 다른 기기를 자동 추가하지 않습니다.'];
    result.treatments = [];
    result.risk = 'clinical-review';
    result.personalization.push('병원 선호 기준: 더 짙은 정적 주름에서는 소프웨이브를 우선 검토합니다.');
  }
  if (categoryId === 'lifting' && subtype === 'fascia') {
    result.basic = ['근막층 처짐의 울쎄라피 프라임 후보 검토', '의사가 근막층 처짐·이완 소견을 확인했을 때 병원 상담 기준에 따라 울쎄라피 프라임을 후보로 연결합니다. 지방 분포·피부 두께·지지 구조, 적용 부위와 장비의 허가·적응증을 확인합니다. 점수만으로 원인·시술 강도·샷 수를 결정하지 않습니다.'];
    result.basicTreatments = ['울쎄라피 프라임'];
    result.basicRisk = 'procedure';
    result.extended = ['근막층 외 동반 요소 추가 평가', '유지인대 지지 저하·지방 볼륨 과다·꺼짐이나 피부 탄력 변화가 함께 있는지 따로 평가합니다. 동반 소견을 확인하기 전 다른 장비나 주입을 자동 추가하거나 기본 후보를 점수에 따라 대체하지 않습니다.'];
    result.treatments = [];
    result.risk = 'clinical-review';
  } else if (categoryId === 'lifting' && subtype === 'ligament') {
    result.basic = ['유지인대 지지 저하의 티타늄 후보 검토', '의사가 유지인대 지지 저하·늘어짐 소견을 확인했을 때 병원 상담 기준상 티타늄을 후보로 연결합니다. 이 연결은 유지인대 치료 기전이나 효과를 확정하는 의미가 아닙니다. 지방 분포·피부 두께·지지 구조, 적용 부위와 정확한 장비의 허가·적응증을 확인합니다. 점수만으로 원인이나 시술 강도를 결정하지 않습니다.'];
    result.basicTreatments = ['티타늄'];
    result.basicRisk = 'procedure';
    result.extended = ['유지인대 외 동반 요소 추가 평가', '근막층 이완·지방 볼륨 과다·꺼짐이나 피부 탄력 변화의 동반 여부를 따로 확인합니다. 다른 원인이 확인되기 전 다른 장비나 주입을 자동 추가하거나 기본 후보를 대체하지 않습니다.'];
    result.treatments = [];
    result.risk = 'clinical-review';
  } else if (categoryId === 'lifting' && subtype === 'volume') {
    result.basic = ['볼륨·지지 부족의 필러 후보 검토', '처짐과 꺼짐의 기여도를 구분하고 해부학·기존 주입 이력·혈관 관련 위험을 확인한 뒤 얼굴 필러 또는 리프팅 필러의 적합성을 검토합니다.'];
    result.basicTreatments = ['필러'];
    result.basicRisk = 'procedure';
    result.extended = ['지지 부족과 피부 이완의 동반 평가', '볼륨 보완이 처짐을 모두 해결한다고 가정하지 않습니다. 피부 이완의 동반 여부를 별도로 평가한 후 추가 치료 필요성을 판단합니다.'];
    result.treatments = [];
    result.risk = 'clinical-review';
  } else if (categoryId === 'lifting' && subtype === 'fat') {
    result.basic = ['지방 볼륨 과다의 온다 후보 검토', '의사가 지방 볼륨 과다가 처짐에 기여하는 소견을 확인했을 때 병원 상담 기준에 따라 온다를 후보로 연결합니다. 지방 분포·피부 두께·지지 구조와 꺼짐 위험을 평가하고 실제 적용 부위의 허가·적응증을 먼저 확인합니다. 얼굴 점수로 바디 치료를 추천하거나 점수만으로 원인·지방 감소량·강도를 정하지 않습니다.'];
    result.basicTreatments = ['온다'];
    result.basicRisk = 'procedure';
    result.extended = ['지방 외 동반 처짐 요소 추가 평가', '근막층·유지인대 지지 변화와 지방 감소 시 꺼짐 가능성, 피부 탄력 변화를 따로 평가합니다. 지방 관련 소견만으로 다른 장비를 자동 병합하거나 부위·허가·적응증 확인 전에 시술을 확정하지 않습니다.'];
    result.treatments = [];
    result.risk = 'clinical-review';
  }
  if (categoryId === 'contour' && subtype === 'muscle') {
    result.basic = ['근육성 윤곽의 보톡스 후보 검토', '관련 근육의 작용·비대칭과 환자의 목표를 진찰로 확인한 뒤 보톡스 적합성을 검토합니다. 골격·지방성 윤곽에 자동 적용하지 않습니다.'];
    result.basicTreatments = ['보톡스'];
    result.basicRisk = 'procedure';
    result.extended = ['동반 비대칭·교합·구조 평가', '근육 외 골격·교합·비대칭 요소가 함께 있는지 확인하고 필요 시 전문 진료를 논의합니다. 추가 기기를 자동 병합하지 않습니다.'];
    result.treatments = [];
    result.risk = 'clinical-review';
  } else if (categoryId === 'contour' && subtype === 'fat') {
    result.basic = ['지방성 윤곽의 위치·목표 평가', '지방 분포와 피부 이완, 해당 얼굴 부위와 원하는 변화를 확인합니다. 볼륨이 줄면 꺼짐이 생길 가능성도 함께 평가합니다.'];
    result.extended = ['지방성 윤곽의 온다 적합성 검토', '온다 후보는 적용 부위의 지방·피부 상태와 장비의 허가·적응증을 확인한 뒤 검토합니다. 얼굴 점수로 바디 치료를 제안하지 않습니다.'];
    result.treatments = ['온다'];
  } else if (categoryId === 'contour' && subtype === 'skeletal') {
    result.basic = ['골격 관련 윤곽의 전문 평가', '골격·교합·비대칭과 환자의 목표를 임상적으로 확인합니다. 보톡스나 온다로 골격 원인을 해결한다고 제안하지 않습니다.'];
    result.extended = ['골격·교합 전문 진료 옵션 확인', '필요한 경우 적합한 전문 진료와 치료 범위를 논의합니다. 현재 보유 미용 장비를 자동 연결하지 않습니다.'];
    result.treatments = [];
    result.risk = 'clinical-review';
  }
  if (categoryId === 'volume' && subtype === 'localized') {
    result.basic = ['국소 꺼짐의 얼굴 필러 후보 검토', '국소 꺼짐의 위치·원인·해부학·기존 주입 이력과 혈관 위험을 확인하고 필러의 적합성을 검토합니다. 넓은 부위 보완으로 자동 확대하지 않습니다.'];
  } else if (categoryId === 'volume' && subtype === 'diffuse') {
    result.basic = ['넓은 볼륨·지지 변화의 부위별 평가', '부위별 꺼짐과 피부 이완을 구분하고 필러 적합성을 각각 확인합니다. 넓은 변화라는 이유로 많은 주입이나 일괄 치료를 제안하지 않습니다.'];
    result.extended = ['넓은 볼륨·지지 변화의 대체 후보 확인', '고우리·레디어스의 정확한 제품 정보와 허가·적응증을 확인하고 적합한 대체 후보를 검토합니다. 제품을 모두 병합하지 않으며 부위별 위험과 목표를 먼저 평가합니다.'];
  }
  if (profile.sensitivity === 'reactive') result.personalization.push('민감 반응 이력: 장벽과 현재 자극을 먼저 확인합니다. 민감 이력만으로 모든 시술을 금기로 판단하지 않습니다.');
  if (profile.downtime === 'minimal') result.personalization.push('회복 부담 최소화 선호: 주입·미세침 후보는 개별 회복 협의 후 재검토합니다. 기기 후보도 실제 회복 부담을 확인합니다.');
  if (profile.approach === 'noninvasive') result.personalization.push('비침습 우선 선호: 주입·미세침은 보류하고 적응증에 맞는 비침습 후보를 남깁니다.');
  return result;
}

/**
 * Build physician-review candidates using observed scores and patient priorities.
 * Safeguards defer elective procedures; they do not diagnose contraindications.
 */
export function buildPlans(scores = {}, priorities = [], safety = {}, profile = {}) {
  const input = scores && typeof scores === 'object' ? scores : {};
  const safetyInput = safety && typeof safety === 'object' ? safety : {};
  const normalized = Object.fromEntries(CATEGORIES.map(({ id }) => [id, normalizeScore(input[id])]));
  const normalizedProfile = normalizeProfile(profile);
  const assessed = Object.values(normalized).filter((score) => score !== null);
  const validPriorities = Array.isArray(priorities) ? [...new Set(priorities)] : [];
  const priorityIndex = new Map(validPriorities.map((id, index) => [id, index]));
  const ordered = CATEGORIES.map((category, index) => ({ ...category, index })).sort((a, b) => {
    if (normalizedProfile.sensitivity === 'reactive' && normalized.barrier > 0) {
      if (a.id === 'barrier' && b.id !== 'barrier') return -1;
      if (b.id === 'barrier' && a.id !== 'barrier') return 1;
    }
    const aRank = priorityIndex.get(a.id) ?? Number.POSITIVE_INFINITY;
    const bRank = priorityIndex.get(b.id) ?? Number.POSITIVE_INFINITY;
    return aRank - bRank || a.index - b.index;
  });
  const basic = [];
  const extended = [];
  const deferred = [];
  const inflammationNeedsReview = Boolean(safetyInput.activeInflammation) || normalized.acne >= 3;

  const deferralReasons = (risk) => {
    const reasons = [];
    if (safetyInput.pregnancy && ['procedure', 'prescription'].includes(risk)) {
      reasons.push('임신·수유 관련 안전성 및 개별 치료의 적용 가능성을 먼저 확인해야 합니다.');
    }
    if (inflammationNeedsReview && risk === 'procedure') {
      reasons.push('현재 활동성 염증 여부와 조절 필요성을 먼저 평가한 뒤 선택 시술을 다시 검토합니다.');
    }
    if (safetyInput.recentProcedure && risk === 'procedure') {
      reasons.push('최근 시술의 종류·부위·회복 상태와 중복 치료 가능성을 먼저 확인해야 합니다.');
    }
    return reasons;
  };

  const injectableLabels = new Set(CLINIC_TREATMENTS.filter(({ type }) => type === 'injectable').map(({ label }) => label));
  const preferenceReasons = [];
  if (normalizedProfile.approach === 'noninvasive') preferenceReasons.push('비침습 우선 선호에 따라 주입·미세침 후보는 보류합니다.');
  if (normalizedProfile.downtime === 'minimal') preferenceReasons.push('회복 부담 최소화 선호에 따라 주입·미세침의 실제 회복 범위를 협의한 후 재검토합니다.');
  const subsetDetail = (candidate, treatments, isDeferred) => {
    const contexts = {
      pigment: '색소 유형과 변화 양상, 현재 염증을 먼저 진찰로 구분합니다.',
      redness: '홍조·혈관성 변화·피부염과 현재 활동성 염증을 먼저 구분합니다.',
      texture: '흉터 형태·깊이·모공·피부 상태와 현재 활동성 염증을 진찰로 확인합니다.',
      wrinkles: '표정 주름·정적 주름·건조·탄력 저하를 구분하고 부위·피부 두께·기존 시술을 진찰로 확인합니다.',
      lifting: '지방 분포·피부 두께·지지 구조와 꺼짐·처짐의 동반 여부를 진찰로 확인합니다.',
      contour: '근육·지방·골격·비대칭 요소와 적용 부위를 진찰로 구분합니다.',
      volume: '꺼짐·부종·처짐을 구분하고 해부학적 위치·기존 주입 이력·혈관 관련 위험을 확인합니다.',
      barrier: '현재 건조·자극과 장벽 상태, 동반 피부염 가능성을 확인합니다.',
    };
    const subtype = normalizedProfile.subtypes[candidate.categoryId];
    const subtypeLabel = SUBTYPE_FIELDS[candidate.categoryId]?.options.find(({ value }) => value === subtype)?.label;
    const sentences = [contexts[candidate.categoryId]];
    if (subtypeLabel && subtype !== 'unknown') sentences.push(`의사가 선택한 ${subtypeLabel}에 맞는 후보인지 평가합니다.`);
    sentences.push(`${isDeferred ? '환자 선호로 보류한 후보' : '환자 선호를 반영해 남은 후보'}는 ${treatments.join('·')}입니다.`);
    if (treatments.includes('온다')) sentences.push('지방 관련 원인과 해당 부위의 허가·적응증이 확인된 경우에 한해 검토합니다.');
    if (treatments.includes('보톡스')) sentences.push('표정 주름 또는 근육성 원인이 확인된 경우에 한해 검토합니다.');
    if (treatments.some((label) => injectableLabels.has(label))) sentences.push('주입 후보는 해부학적 위치·기존 주입 이력·혈관 관련 위험과 실제 제품 정보를 확인합니다.');
    if (isDeferred) sentences.push('비침습·회복 선호와 개별 후보의 허가·적응증·주의사항·회복 범위를 협의한 뒤 다시 검토합니다. 남은 기기에 자동 병합하지 않습니다.');
    else sentences.push('허가·적응증·부위를 확인한 뒤 의사가 선택합니다. 주입·미세침 후보는 보류했으며 남은 후보도 모두 병합하지 않습니다.');
    return sentences.filter(Boolean).join(' ');
  };
  const placeCandidate = (candidate, risk, destination, preconditions = []) => {
    const safetyReasons = [...new Set([...deferralReasons(risk), ...preconditions])];
    const restricted = preferenceReasons.length ? candidate.treatments.filter((label) => injectableLabels.has(label) || label === '포텐자') : [];
    if (candidate.kind === 'combination' && restricted.length) {
      deferred.push({
        ...candidate,
        reason: [...safetyReasons, ...preferenceReasons, `조합 구성인 ${restricted.join('·')}의 검토가 필요해 전체 조합을 보류합니다. 허용된 일부 시술만 남겨 다른 조합으로 바꾸지 않습니다.`].join(' '),
      });
      return false;
    }
    if (restricted.length) {
      const allowed = candidate.treatments.filter((label) => !restricted.includes(label));
      deferred.push({
        ...candidate,
        id: allowed.length ? `${candidate.id}-preference` : candidate.id,
        treatments: restricted,
        detail: allowed.length ? subsetDetail(candidate, restricted, true) : candidate.detail,
        reason: [...safetyReasons, ...preferenceReasons].join(' '),
      });
      if (!allowed.length) return false;
      candidate = {
        ...candidate, treatments: allowed,
        detail: subsetDetail(candidate, allowed, false),
        personalization: [...candidate.personalization, `선호를 반영해 ${restricted.join('·')}는 보류 목록으로 분리했습니다.`],
      };
    }
    if (safetyReasons.length) {
      deferred.push({ ...candidate, reason: safetyReasons.join(' ') });
      return false;
    }
    destination.push(candidate);
    return true;
  };

  const placeBasic = (category, rationale, options, suffix = '') => {
    const candidate = {
      id: `${category.id}-basic${suffix}`, categoryId: category.id, title: options.basic[0],
      rationale, detail: options.basic[1], requiresReview: true,
      treatments: options.basicTreatments ? [...options.basicTreatments] : [],
      personalization: [...options.personalization],
      ...(suffix ? { kind: 'cause', causeIds: [suffix.slice(1)] } : {}),
      ...(options.basicTreatments?.length > 1 ? { kind: 'alternatives' } : {}),
      ...(options.preferredTreatment ? { preferredTreatment: options.preferredTreatment } : {}),
    };
    if (placeCandidate(candidate, options.basicRisk, basic)) return;
    const fallback = options.fallback ?? [`${category.label} 원인 평가·보수적 관리`, '관찰 소견, 목표와 기존 치료를 확인하고 관리 가능한 요인을 상담합니다. 시술 후보는 개별 안전 조건과 선호를 검토한 뒤 다시 논의합니다.'];
    const causeLabel = suffix && SUBTYPE_FIELDS.lifting.options.find(({ value }) => value === suffix.slice(1))?.label;
    basic.push({
      id: `${category.id}-assessment${suffix}`, categoryId: category.id,
      title: causeLabel ? `${causeLabel} 평가·관리 상담` : fallback[0], rationale, detail: fallback[1],
      requiresReview: true, treatments: [],
      personalization: [...options.personalization, '시술 후보 보류 후 임상 평가·관리 상담을 기본 플랜에 유지했습니다.'],
      ...(suffix ? { kind: 'cause', causeIds: [suffix.slice(1)] } : {}),
    });
  };

  for (const category of ordered) {
    const score = normalized[category.id];
    if (score === null || score === 0) continue;
    const options = personalizedOptions(category.id, normalizedProfile);
    const rationale = `${category.label} ${score}단계 · ${category.anchors[score]}`;
    if (category.id === 'lifting') {
      const causes = normalizedProfile.liftingCauses;
      if (!causes.length) {
        const unconfirmed = personalizedOptions('lifting', { ...normalizedProfile, subtypes: { ...normalizedProfile.subtypes, lifting: 'unknown' } });
        placeBasic(category, rationale, unconfirmed);
        continue;
      }
      const components = causes.map((causeId) => {
        const causeOptions = personalizedOptions('lifting', { ...normalizedProfile, subtypes: { ...normalizedProfile.subtypes, lifting: causeId } });
        placeBasic(category, rationale, causeOptions, `-${causeId}`);
        return {
          causeId,
          label: SUBTYPE_FIELDS.lifting.options.find(({ value }) => value === causeId).label,
          treatment: causeOptions.basicTreatments[0],
        };
      });
      if (components.length > 1) {
        const treatments = [...new Set(components.map(({ treatment }) => treatment))];
        const detail = [
          `진찰로 함께 확인한 ${components.map(({ label }) => label).join('·')}에 각각 대응하는 ${components.map(({ label, treatment }) => `${label} → ${treatment}`).join('; ')}를 조합 후보로 검토합니다.`,
          '각 원인의 기본 후보를 먼저 평가하고 함께 치료할 필요가 있을 때만 확장 플랜으로 선택합니다. 동시 시행을 의미하지 않으며 적용 부위·순서·간격·중복 열손상 가능성과 기존 시술 이력을 의사가 판단합니다.',
          treatments.includes('티타늄') ? '티타늄 연결은 병원 상담 기준이며 유지인대 치료 기전이나 효과를 확정하는 의미가 아닙니다.' : '',
          treatments.includes('온다') ? '지방 볼륨과 적용 부위의 허가·적응증, 지방 감소 시 꺼짐 가능성을 확인합니다.' : '',
          treatments.includes('필러') ? '필러 구성은 해부학적 위치·기존 주입 이력·혈관 관련 위험과 실제 제품 정보를 확인합니다.' : '',
          '점수로 장비 강도·용량·시술 횟수를 결정하지 않습니다.',
        ].filter(Boolean).join(' ');
        placeCandidate({
          id: `lifting-combination-${causes.join('-')}`, categoryId: 'lifting',
          kind: 'combination', causeIds: [...causes], components,
          combinationSource: 'confirmed-causes', categoryIds: ['lifting'],
          title: `${treatments.join(' + ')} 조합 검토`, rationale, detail,
          requiresReview: true, treatments,
          personalization: [
            `의사가 확인한 복수 원인: ${components.map(({ label }) => label).join(' + ')}.`,
            ...options.personalization.filter((line) => !line.startsWith('유형 미확인:') && !line.startsWith('의사 선택 유형:')),
          ],
        }, 'procedure', extended);
      }
      continue;
    }
    placeBasic(category, rationale, options);
    if (score < 2) continue;
    const candidate = {
      id: `${category.id}-extended`, categoryId: category.id, title: options.extended[0],
      rationale, detail: options.extended[1], requiresReview: true,
      treatments: [...options.treatments],
      personalization: [...options.personalization],
    };
    placeCandidate(candidate, options.risk, extended, options.extendedPreconditions);
  }

  // Physician-selected combinations use current basic and extended candidates. A stale
  // selection is never silently shortened into a different advertised combination.
  const requested = normalizedProfile.combinationTreatments;
  const activeSources = [...basic, ...extended].filter(({ kind }) => kind !== 'combination');
  const deferredSources = deferred.filter(({ kind }) => kind !== 'combination');
  const currentSourceLabels = new Set([...activeSources, ...deferredSources].flatMap(({ treatments }) => treatments));
  const duplicateCauseCombination = [...extended, ...deferred].some((candidate) =>
    candidate.kind === 'combination'
    && candidate.treatments.length === requested.length
    && requested.every((label) => candidate.treatments.includes(label)));
  if (!normalizedProfile.invalidCombinationSelection && requested.length >= 2 && requested.every((label) => currentSourceLabels.has(label)) && !duplicateCauseCombination) {
    const sourcesByTreatment = requested.map((treatment) => {
      const active = activeSources.filter(({ treatments }) => treatments.includes(treatment));
      return {
        treatment,
        sources: active.length ? active : deferredSources.filter(({ treatments }) => treatments.includes(treatment)),
        deferred: active.length === 0,
      };
    });
    const sources = [...new Set(sourcesByTreatment.flatMap(({ sources: linked }) => linked))];
    const sourceDeferrals = [...new Set(sourcesByTreatment
      .filter(({ deferred: blocked }) => blocked)
      .flatMap(({ sources: linked }) => linked.map(({ reason }) => reason).filter(Boolean)))];
    const categoryIds = [...new Set(requested.flatMap((label) => sources.filter(({ treatments }) => treatments.includes(label)).map(({ categoryId }) => categoryId)))];
    const categoryNames = categoryIds.map((id) => CATEGORIES.find((category) => category.id === id).label);
    const components = sourcesByTreatment.map(({ treatment, sources: matched }) => {
      const related = [...new Set(matched.map(({ categoryId }) => categoryId))];
      return {
        treatment, categoryIds: related,
        label: related.map((id) => CATEGORIES.find((category) => category.id === id).label).join('·'),
        causeIds: [...new Set(matched.flatMap(({ causeIds }) => causeIds ?? []))],
      };
    });
    const detail = [
      `의사가 현재 기본·확장 후보에서 선택한 ${requested.join(' + ')}의 조합입니다. ${components.map(({ treatment, label }) => `${label} → ${treatment}`).join('; ')}의 목표와 추가 치료 필요성을 함께 검토합니다.`,
      '한 원인에 대한 대안 장비를 함께 선택한 경우에도 각각의 필요성을 다시 확인합니다. 자동 병합이나 동시 시행을 의미하지 않습니다. 해부학적 위치·허가·적응증·순서·간격·중복 열손상 가능성과 기존 시술 이력을 의사가 판단합니다.',
      requested.includes('티타늄') ? '티타늄 연결은 병원 상담 기준이며 유지인대 치료 기전이나 효과를 확정하는 의미가 아닙니다.' : '',
      requested.includes('온다') ? '온다는 지방 관련 원인과 적용 부위의 허가·적응증, 꺼짐 가능성을 확인합니다.' : '',
      requested.some((label) => injectableLabels.has(label)) ? '주입 구성은 실제 제품 정보·해부학적 위치·기존 주입 이력·혈관 관련 위험을 확인합니다.' : '',
      '점수로 강도·용량·시술 횟수를 결정하지 않습니다.',
    ].filter(Boolean).join(' ');
    placeCandidate({
      id: 'physician-combination', categoryId: categoryIds[0], categoryIds,
      kind: 'combination', combinationSource: 'physician', components,
      causeIds: [...new Set(components.flatMap(({ causeIds }) => causeIds))],
      title: `${requested.join(' + ')} · 의사 선택 조합`,
      rationale: `의사 선택 · ${categoryNames.join(' + ')}`, detail,
      requiresReview: true, treatments: [...requested],
      personalization: ['의사가 선택한 현재 시술 후보의 조합입니다. 각 구성의 필요성과 병합 적합성을 확인합니다.'],
    }, 'procedure', extended, sourceDeferrals);
  }

  return {
    basic, extended, deferred,
    summary: {
      assessedCount: assessed.length,
      concernCount: assessed.filter((score) => score > 0).length,
      average: assessed.length ? assessed.reduce((sum, score) => sum + score, 0) / assessed.length : 0,
      max: assessed.length ? Math.max(...assessed) : 0,
    },
  };
}
