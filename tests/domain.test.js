import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CATEGORIES, ZONES, INITIAL_SCORES, SAMPLE_SCORES, CLINIC_TREATMENTS, CLINIC_PROTOCOL, PROFILE_FIELDS, SUBTYPE_FIELDS, normalizeScore, normalizeLiftingCauses, buildPlans,
} from '../src/domain.js';

test('category anchors and zone references are complete and unique', () => {
  const zoneIds = new Set(ZONES.map(({ id }) => id));
  assert.equal(CATEGORIES.length, 9);
  assert.equal(new Set(CATEGORIES.map(({ id }) => id)).size, 9);
  for (const category of CATEGORIES) {
    assert.equal(category.anchors.length, 5);
    assert.ok(category.anchors.every((anchor) => typeof anchor === 'string' && anchor.length > 0));
    assert.ok(category.zones.every((zone) => zoneIds.has(zone)));
  }
});

test('unassessed values remain distinct from explicitly assessed zero', () => {
  assert.ok(Object.values(INITIAL_SCORES).every((score) => score === null));
  for (const missing of [null, undefined, '', ' ', NaN, Infinity, {}, false]) {
    assert.equal(normalizeScore(missing), null);
  }
  assert.equal(normalizeScore(0), 0);
  assert.equal(normalizeScore('0'), 0);
  assert.deepEqual(buildPlans(INITIAL_SCORES).summary, {
    assessedCount: 0, concernCount: 0, average: 0, max: 0,
  });
  assert.deepEqual(buildPlans({ pigment: 0 }).summary, {
    assessedCount: 1, concernCount: 0, average: 0, max: 0,
  });
});

test('valid numerical scores clamp to the ordinal scale and exclude unknown keys', () => {
  assert.equal(normalizeScore(-2), 0);
  assert.equal(normalizeScore(9), 4);
  assert.equal(normalizeScore(2.4), 2);
  const plans = buildPlans({ pigment: -1, redness: 7, acne: NaN, unknown: 4 });
  assert.deepEqual(plans.summary, { assessedCount: 2, concernCount: 1, average: 2, max: 4 });
  assert.deepEqual(plans.basic.map(({ categoryId }) => categoryId), ['redness']);
});

test('average uses assessed items only, including explicitly assessed zeros', () => {
  const plans = buildPlans({ pigment: 4, redness: 0, acne: null });
  assert.equal(plans.summary.average, 2);
  assert.equal(plans.summary.assessedCount, 2);
});

test('every positive score produces a basic candidate; zero and unassessed produce none', () => {
  for (const category of CATEGORIES) {
    for (let score = 0; score <= 4; score += 1) {
      const plans = buildPlans({ [category.id]: score });
      assert.equal(plans.basic.length, score > 0 ? 1 : 0);
      assert.equal(plans.extended.length + plans.deferred.length, score >= 2 && category.id !== 'lifting' ? 1 : 0);
      if (score > 0) assert.equal(plans.basic[0].categoryId, category.id);
    }
  }
});

test('extended candidates have distinct clinical content and always require review', () => {
  const scores = Object.fromEntries(CATEGORIES.map(({ id }) => [id, id === 'acne' ? 2 : 3]));
  const plans = buildPlans(scores);
  assert.equal(plans.basic.length, 9);
  assert.equal(plans.extended.length, 8);
  for (const item of plans.extended) {
    const base = plans.basic.find(({ categoryId }) => categoryId === item.categoryId);
    assert.notEqual(item.title, base.title);
    assert.notEqual(item.detail, base.detail);
    assert.equal(item.requiresReview, true);
  }
});

test('severe active acne defers elective procedures while keeping acne treatment review', () => {
  const plans = buildPlans({ acne: 3, texture: 3, volume: 2, pigment: 2 });
  assert.deepEqual(plans.extended.map(({ categoryId }) => categoryId), ['acne']);
  assert.deepEqual([...new Set(plans.deferred.map(({ categoryId }) => categoryId))], ['pigment', 'texture', 'volume']);
  assert.ok(plans.deferred.some(({ id }) => id === 'volume-basic'));
  assert.ok(plans.basic.some(({ id }) => id === 'volume-assessment'));
  assert.ok(plans.deferred.every(({ reason }) => reason.includes('활동성 염증')));
  assert.equal(plans.basic.length, 4);
});

test('explicit inflammation defers procedures even when acne is unassessed', () => {
  const plans = buildPlans({ wrinkles: 3, barrier: 2 }, [], { activeInflammation: true }, { subtypes: { wrinkles: 'static' } });
  assert.deepEqual(plans.extended.map(({ categoryId }) => categoryId), ['barrier']);
  assert.deepEqual(plans.deferred.map(({ categoryId }) => categoryId), ['wrinkles', 'wrinkles']);
  assert.ok(plans.deferred.every(({ reason }) => reason.includes('활동성 염증')));
});

test('pregnancy defers uncertain elective and prescription options, preserving clinical reviews', () => {
  const plans = buildPlans({ acne: 2, volume: 2, barrier: 3 }, [], { pregnancy: true });
  assert.deepEqual(plans.extended.map(({ categoryId }) => categoryId), ['barrier']);
  assert.deepEqual([...new Set(plans.deferred.map(({ categoryId }) => categoryId))], ['acne', 'volume']);
  assert.ok(plans.deferred.every(({ reason }) => reason.includes('안전성')));
  assert.equal(plans.basic.length, 3);
});

test('recent procedures defer overlapping elective candidates and combine reasons', () => {
  const plans = buildPlans({ volume: 3, acne: 2 }, [], {
    pregnancy: true, activeInflammation: true, recentProcedure: true,
  });
  const volume = plans.deferred.find(({ categoryId }) => categoryId === 'volume');
  assert.match(volume.reason, /임신/);
  assert.match(volume.reason, /활동성 염증/);
  assert.match(volume.reason, /최근 시술/);
  assert.ok(!plans.deferred.find(({ categoryId }) => categoryId === 'acne').reason.includes('최근 시술'));
});

test('patient priorities reorder candidates stably without duplicates or extra categories', () => {
  const scores = { pigment: 2, redness: 2, texture: 2, volume: 2 };
  const plans = buildPlans(scores, ['volume', 'texture', 'volume', 'invalid']);
  assert.deepEqual(plans.basic.map(({ categoryId }) => categoryId), ['volume', 'texture', 'pigment', 'redness']);
  assert.deepEqual(plans.extended.map(({ categoryId }) => categoryId), ['volume', 'texture', 'pigment', 'redness']);
});

test('score alone does not diagnose contour anatomy and null inputs are safe', () => {
  const plans = buildPlans({ contour: 4 });
  assert.match(plans.basic[0].detail, /자동 진단하지 않습니다/);
  assert.match(plans.extended[0].detail, /타입 확인 전 시술을 정하지 않습니다/);
  assert.equal(buildPlans(null, null, null).basic.length, 0);
  assert.equal(buildPlans(SAMPLE_SCORES).summary.assessedCount, 9);
});

test('clinic treatments remain distinct candidates and do not invent missing pigment devices', () => {
  const clinicLabels = new Set(CLINIC_TREATMENTS.map(({ label }) => label));
  assert.equal(CLINIC_TREATMENTS.length, 13);
  const plans = buildPlans({ pigment: 2, redness: 2, volume: 2, lifting: 2, texture: 2 });
  for (const item of [...plans.basic, ...plans.extended, ...plans.deferred]) {
    assert.ok(Array.isArray(item.treatments));
    assert.ok(item.treatments.every((label) => clinicLabels.has(label)));
  }
  assert.deepEqual(plans.basic.find(({ categoryId }) => categoryId === 'volume').treatments, ['필러']);
  assert.deepEqual(plans.extended.find(({ categoryId }) => categoryId === 'volume').treatments, ['고우리', '레디어스']);
  assert.deepEqual(plans.extended.find(({ categoryId }) => categoryId === 'texture').treatments, ['포텐자']);
  for (const categoryId of ['pigment', 'redness']) {
    const option = plans.extended.find((item) => item.categoryId === categoryId);
    assert.deepEqual(option.treatments, []);
    assert.match(option.detail, /전용 장비가 확인되지 않습니다/);
  }
});

test('basic filler candidate is deferred at score one when safety requires review', () => {
  const plans = buildPlans({ volume: 1 }, [], { recentProcedure: true });
  assert.equal(plans.extended.length, 0);
  assert.equal(plans.deferred.length, 1);
  assert.deepEqual(plans.deferred[0].treatments, ['필러']);
  assert.deepEqual(plans.basic[0].treatments, []);
  assert.equal(plans.basic[0].categoryId, 'volume');
});

test('planning leaves caller data intact', () => {
  const scores = Object.freeze({ volume: 2, pigment: 3 });
  const priorities = Object.freeze(['volume', 'pigment']);
  const safety = Object.freeze({ pregnancy: true });
  assert.doesNotThrow(() => buildPlans(scores, priorities, safety));
  const result = buildPlans(scores, priorities, safety);
  result.deferred.find(({ categoryId }) => categoryId === 'volume').treatments.push('mutated');
  assert.deepEqual(buildPlans(scores).basic.find(({ categoryId }) => categoryId === 'volume').treatments, ['필러']);
});

test('profile metadata includes an explicit unknown option and unique values', () => {
  assert.deepEqual(PROFILE_FIELDS.map(({ id }) => id), ['sensitivity', 'downtime', 'approach']);
  for (const field of [...PROFILE_FIELDS, ...Object.values(SUBTYPE_FIELDS)]) {
    assert.ok(field.options.some(({ value }) => value === 'unknown'));
    assert.equal(new Set(field.options.map(({ value }) => value)).size, field.options.length);
  }
});

test('same wrinkle score maps clinical subtypes to different treatment subsets', () => {
  const dynamic = buildPlans({ wrinkles: 2 }, [], {}, { subtypes: { wrinkles: 'dynamic' } });
  const staticLines = buildPlans({ wrinkles: 2 }, [], {}, { subtypes: { wrinkles: 'static' } });
  const laxity = buildPlans({ wrinkles: 2 }, [], {}, { subtypes: { wrinkles: 'laxity' } });
  assert.deepEqual(dynamic.basic[0].treatments, ['보톡스']);
  assert.deepEqual(dynamic.extended[0].treatments, []);
  assert.deepEqual(staticLines.extended[0].treatments, ['리쥬란', '리투오', '힐로웨이브']);
  assert.deepEqual(staticLines.basic[0].treatments, ['써마지 FLX', '소프웨이브']);
  assert.deepEqual(laxity.basic[0].treatments, ['써마지 FLX', '소프웨이브']);
  assert.deepEqual(laxity.extended[0].treatments, []);
  assert.ok(dynamic.basic[0].personalization.some((line) => line.includes('표정 주름')));
});

test('same contour score does not confuse muscle, fat and skeletal causes', () => {
  const muscle = buildPlans({ contour: 3 }, [], {}, { subtypes: { contour: 'muscle' } });
  const fat = buildPlans({ contour: 3 }, [], {}, { subtypes: { contour: 'fat' } });
  const skeletal = buildPlans({ contour: 3 }, [], {}, { subtypes: { contour: 'skeletal' } });
  assert.deepEqual(muscle.basic[0].treatments, ['보톡스']);
  assert.deepEqual(fat.extended[0].treatments, ['온다']);
  assert.deepEqual(skeletal.basic[0].treatments, []);
  assert.deepEqual(skeletal.extended[0].treatments, []);
  assert.match(skeletal.extended[0].title, /전문 진료/);
});

test('same lifting score follows the physician-selected clinic mapping without adding other devices', () => {
  const fascia = buildPlans({ lifting: 3 }, [], {}, { subtypes: { lifting: 'fascia' } });
  const ligament = buildPlans({ lifting: 3 }, [], {}, { subtypes: { lifting: 'ligament' } });
  const volume = buildPlans({ lifting: 3 }, [], {}, { subtypes: { lifting: 'volume' } });
  const fat = buildPlans({ lifting: 3 }, [], {}, { subtypes: { lifting: 'fat' } });
  assert.deepEqual(fascia.basic[0].treatments, ['울쎄라피 프라임']);
  assert.deepEqual(ligament.basic[0].treatments, ['티타늄']);
  assert.deepEqual(fat.basic[0].treatments, ['온다']);
  assert.deepEqual(volume.basic[0].treatments, ['필러']);
  for (const plans of [fascia, ligament, fat, volume]) {
    assert.equal(plans.extended.length, 0);
    assert.equal(plans.deferred.length, 0);
    assert.doesNotMatch(JSON.stringify(plans), /써마지|소프웨이브/);
    assert.match(plans.basic[0].detail, /허가·적응증|혈관 관련 위험/);
  }
  assert.match(fat.basic[0].detail, /적용 부위/);
  assert.match(ligament.basic[0].detail, /기전이나 효과를 확정.*아닙니다/);
});

test('clinic protocol is explicit, uses available treatments, and distinguishes structural and skin concerns', () => {
  assert.equal(CLINIC_PROTOCOL.label, '병원 상담 기준');
  assert.match(CLINIC_PROTOCOL.description, /점수만으로 원인을 판정/);
  assert.deepEqual(CLINIC_PROTOCOL.lifting, [
    { subtype: 'fascia', label: '근막층 처짐·이완', treatment: '울쎄라피 프라임' },
    { subtype: 'ligament', label: '유지인대 지지 저하', treatment: '티타늄' },
    { subtype: 'fat', label: '지방 볼륨 과다', treatment: '온다' },
  ]);
  assert.deepEqual(CLINIC_PROTOCOL.dermal, { categoryId: 'wrinkles', subtype: 'laxity', label: '피부 탄력·잔주름', treatment: '써마지 FLX', treatments: ['써마지 FLX', '소프웨이브'] });
  assert.equal(CLINIC_PROTOCOL.pronounced.subtype, 'pronounced');
  assert.equal(CLINIC_PROTOCOL.pronounced.treatment, '소프웨이브');
  assert.deepEqual(SUBTYPE_FIELDS.lifting.options.map(({ value }) => value), ['unknown', 'fascia', 'ligament', 'fat', 'volume']);
  const treatmentLabels = new Set(CLINIC_TREATMENTS.map(({ label }) => label));
  for (const entry of CLINIC_PROTOCOL.lifting) assert.ok(treatmentLabels.has(entry.treatment));
  const mixed = buildPlans({ wrinkles: 3, lifting: 3 }, [], {}, { subtypes: { wrinkles: 'laxity', lifting: 'fascia' } });
  assert.ok(mixed.basic.find(({ categoryId }) => categoryId === 'wrinkles').treatments.includes('써마지 FLX'));
  assert.deepEqual(mixed.basic.find(({ categoryId }) => categoryId === 'lifting').treatments, ['울쎄라피 프라임']);
  assert.ok(mixed.basic.find(({ categoryId }) => categoryId === 'wrinkles').treatments.includes('소프웨이브'));
});

test('skin elasticity and each structural lifting cause keep separate device subsets at the same score', () => {
  const expected = { fascia: ['울쎄라피 프라임'], ligament: ['티타늄'], fat: ['온다'] };
  for (const [subtype, treatments] of Object.entries(expected)) {
    const plans = buildPlans({ wrinkles: 2, lifting: 2 }, [], {}, { subtypes: { wrinkles: 'laxity', lifting: subtype } });
    const wrinkleCards = [...plans.basic, ...plans.extended, ...plans.deferred].filter(({ categoryId }) => categoryId === 'wrinkles');
    const liftingCards = [...plans.basic, ...plans.extended, ...plans.deferred].filter(({ categoryId }) => categoryId === 'lifting');
    assert.deepEqual(wrinkleCards.flatMap(({ treatments: labels }) => labels), ['써마지 FLX', '소프웨이브']);
    assert.deepEqual(liftingCards.flatMap(({ treatments: labels }) => labels), treatments);
    assert.doesNotMatch(JSON.stringify(wrinkleCards), /티타늄|울쎄라피|온다/);
    assert.doesNotMatch(JSON.stringify(liftingCards), /써마지|소프웨이브/);
  }
  const unknownWrinkles = buildPlans({ wrinkles: 2 });
  assert.doesNotMatch(JSON.stringify(unknownWrinkles), /티타늄/);
});

test('unconfirmed or legacy lifting types never infer a device from the observed score', () => {
  for (const subtype of ['unknown', 'laxity', 'invalid', undefined]) {
    for (const lifting of [0, 1, 2, 3, 4]) {
      const plans = buildPlans({ lifting }, [], {}, { subtypes: { lifting: subtype } });
      const candidates = [...plans.basic, ...plans.extended, ...plans.deferred];
      assert.ok(candidates.every(({ treatments }) => treatments.length === 0));
      assert.equal(plans.basic.length, lifting > 0 ? 1 : 0);
      assert.equal(plans.extended.length, 0);
      if (lifting > 0) assert.match(plans.basic[0].detail, /원인이 미확인/);
      assert.doesNotMatch(JSON.stringify(candidates), /써마지|소프웨이브|울쎄라피|티타늄|온다|필러/);
    }
  }
});

test('lifting mapping stays exact through every score, preference, and safety combination', () => {
  const expected = { unknown: [], fascia: ['울쎄라피 프라임'], ligament: ['티타늄'], fat: ['온다'], volume: ['필러'] };
  const preferences = PROFILE_FIELDS.map(({ options }) => options.map(({ value }) => value));
  for (const [subtype, treatments] of Object.entries(expected)) {
    for (let lifting = 0; lifting <= 4; lifting += 1) {
      for (const sensitivity of preferences[0]) {
        for (const downtime of preferences[1]) {
          for (const approach of preferences[2]) {
            for (let flags = 0; flags < 8; flags += 1) {
              const safety = { pregnancy: Boolean(flags & 1), activeInflammation: Boolean(flags & 2), recentProcedure: Boolean(flags & 4) };
              const plans = buildPlans({ lifting }, [], safety, { sensitivity, downtime, approach, subtypes: { lifting: subtype } });
              const all = [...plans.basic, ...plans.extended, ...plans.deferred];
              const context = `${subtype}/${lifting}/${sensitivity}/${downtime}/${approach}/${flags}`;
              assert.doesNotMatch(JSON.stringify(all), /써마지|소프웨이브/, context);
              assert.equal(new Set(all.map(({ id }) => id)).size, all.length, context);
              assert.ok(all.every(({ treatments: labels }) => labels.every((label) => treatments.includes(label))), context);
              assert.deepEqual(plans.extended.flatMap(({ treatments: labels }) => labels), [], context);
              if (lifting === 0) {
                assert.equal(all.length, 0, context);
                continue;
              }
              const blocked = flags > 0 || (subtype === 'volume' && (approach === 'noninvasive' || downtime === 'minimal'));
              const activeLabels = plans.basic.flatMap(({ treatments: labels }) => labels);
              assert.deepEqual(activeLabels, blocked ? [] : treatments, context);
              assert.deepEqual(plans.deferred.flatMap(({ treatments: labels }) => labels), blocked ? treatments : [], context);
              assert.equal(plans.basic.length, 1, context);
              assert.equal(plans.extended.length, 0, context);
              if (treatments.length && blocked) assert.ok(plans.deferred[0].reason.length > 0, context);
            }
          }
        }
      }
    }
  }
});

test('severe active acne defers each structural lifting candidate and keeps assessment', () => {
  for (const subtype of ['fascia', 'ligament', 'fat', 'volume']) {
    const plans = buildPlans({ acne: 3, lifting: 3 }, [], {}, { subtypes: { lifting: subtype } });
    const basic = plans.basic.find(({ categoryId }) => categoryId === 'lifting');
    const deferred = plans.deferred.find(({ categoryId }) => categoryId === 'lifting');
    assert.deepEqual(basic.treatments, []);
    assert.equal(deferred.treatments.length, 1);
    assert.match(deferred.reason, /활동성 염증/);
    assert.doesNotMatch(JSON.stringify([basic, deferred]), /써마지|소프웨이브/);
  }
});

test('noninvasive preference keeps appropriate device alternatives and defers injections', () => {
  const plans = buildPlans({ wrinkles: 3, lifting: 3, texture: 3, contour: 3 }, [], {}, { approach: 'noninvasive', subtypes: { wrinkles: 'laxity', contour: 'muscle' } });
  const active = [...plans.basic, ...plans.extended];
  assert.ok(active.some(({ treatments }) => treatments.includes('써마지 FLX')));
  const injectables = new Set(CLINIC_TREATMENTS.filter(({ type }) => type === 'injectable').map(({ label }) => label));
  assert.ok(active.every(({ treatments }) => treatments.every((label) => !injectables.has(label) && label !== '포텐자')));
  assert.ok(plans.deferred.some(({ treatments }) => treatments.includes('포텐자')));
  assert.ok(plans.deferred.some(({ treatments }) => treatments.includes('보톡스')));
  assert.ok(plans.deferred.every(({ reason }) => reason.includes('비침습')));
  assert.equal(new Set([...active, ...plans.deferred].map(({ id }) => id)).size, active.length + plans.deferred.length);
});

test('noninvasive preference does not replace dynamic wrinkles with an unrelated device', () => {
  const plans = buildPlans({ wrinkles: 2 }, [], {}, { subtypes: { wrinkles: 'dynamic' }, approach: 'noninvasive' });
  assert.ok(plans.basic.every(({ treatments }) => treatments.length === 0));
  assert.ok(plans.extended.every(({ treatments }) => treatments.length === 0));
  assert.deepEqual(plans.deferred[0].treatments, ['보톡스']);
  assert.match(plans.deferred[0].reason, /비침습/);
});

test('minimal downtime defers recovery discussion without claiming zero recovery for devices', () => {
  const plans = buildPlans({ texture: 2, volume: 1, lifting: 2 }, [], {}, { downtime: 'minimal', subtypes: { lifting: 'fascia' } });
  assert.ok(plans.deferred.some(({ treatments }) => treatments.includes('포텐자')));
  assert.ok(plans.deferred.some(({ treatments }) => treatments.includes('필러')));
  assert.ok(plans.basic.some(({ treatments }) => treatments.includes('울쎄라피 프라임')));
  assert.ok(plans.deferred.every(({ reason }) => reason.includes('회복')));
  assert.ok(plans.extended.every(({ personalization }) => personalization.some((line) => line.includes('실제 회복'))));
});

test('reactive skin prioritizes assessed barrier concerns without declaring all procedures contraindicated', () => {
  const scores = { barrier: 2, wrinkles: 2 };
  const profile = { sensitivity: 'reactive', subtypes: { wrinkles: 'laxity' } };
  const plans = buildPlans(scores, ['wrinkles'], {}, profile);
  assert.equal(plans.basic[0].categoryId, 'barrier');
  assert.ok(plans.basic.some(({ treatments }) => treatments.includes('써마지 FLX')));
  assert.equal(plans.deferred.length, 0);
  assert.ok(plans.basic.every(({ personalization }) => personalization.some((line) => line.includes('금기로 판단하지'))));
  const inflamed = buildPlans(scores, ['wrinkles'], { activeInflammation: true }, profile);
  assert.ok(inflamed.deferred.some(({ categoryId }) => categoryId === 'wrinkles'));
});

test('same pigment score retains diagnostic distinctions without inventing targeted equipment', () => {
  const melasma = buildPlans({ pigment: 2 }, [], {}, { subtypes: { pigment: 'melasma' } });
  const pih = buildPlans({ pigment: 2 }, [], {}, { subtypes: { pigment: 'pih' } });
  assert.notEqual(melasma.basic[0].title, pih.basic[0].title);
  assert.match(melasma.basic[0].detail, /기미/);
  assert.match(pih.basic[0].detail, /현재 활동성 염증/);
  assert.deepEqual(melasma.extended[0].treatments, []);
  assert.deepEqual(pih.extended[0].treatments, []);
});

test('unknown profile remains backward compatible and does not alter unassessed scores', () => {
  const scores = { contour: 2 };
  const base = buildPlans(scores);
  const unknown = buildPlans(scores, [], {}, { subtypes: { contour: 'not-a-real-type' }, approach: 'invalid' });
  assert.deepEqual(unknown, base);
  assert.equal(buildPlans({}, [], {}, { subtypes: { contour: 'muscle' } }).basic.length, 0);
  assert.doesNotThrow(() => buildPlans(scores, [], {}, null));
});

for (const preference of [{ approach: 'noninvasive' }, { downtime: 'minimal' }]) {
  test(`split candidates explain only their current treatment subset for ${Object.keys(preference)[0]}`, () => {
    const plans = buildPlans({ wrinkles: 3, lifting: 3, contour: 3 }, [], {}, preference);
    for (const item of plans.extended.filter(({ treatments }) => treatments.length > 0)) {
      const deferred = plans.deferred.find(({ id }) => id === `${item.id}-preference`);
      assert.ok(deferred, `missing split candidate for ${item.id}`);
      for (const label of deferred.treatments) assert.ok(!item.detail.includes(label), `${item.id} still recommends ${label}`);
      for (const label of item.treatments) {
        assert.ok(item.detail.includes(label));
        assert.ok(!deferred.detail.includes(label), `${deferred.id} still recommends ${label}`);
      }
      for (const label of deferred.treatments) assert.ok(deferred.detail.includes(label));
      assert.match(item.detail, /진찰/);
      assert.match(deferred.detail, /진찰/);
      assert.match(item.detail, /주입·미세침 후보는 보류/);
    }
    const support = buildPlans({ lifting: 3 }, [], {}, { ...preference, subtypes: { lifting: 'volume' } });
    const filler = support.deferred.find(({ id }) => id === 'lifting-basic-volume');
    assert.match(filler.detail, /혈관 관련 위험/);
    assert.deepEqual(support.basic[0].treatments, []);
    assert.equal(support.extended.length, 0);
    assert.doesNotMatch(JSON.stringify(support), /써마지|소프웨이브/);
    // Reports consume these same serializable records; no stale broad description survives export.
    const report = JSON.parse(JSON.stringify(plans));
    for (const item of report.extended.filter(({ treatments }) => treatments.length > 0)) {
      const deferred = report.deferred.find(({ id }) => id === `${item.id}-preference`);
      assert.ok(deferred.treatments.every((label) => !item.detail.includes(label)));
      assert.ok(item.treatments.every((label) => !deferred.detail.includes(label)));
    }
  });
}

test('explicit lifting causes are normalized without inferring or reviving cleared selections', () => {
  assert.deepEqual(normalizeLiftingCauses({ liftingCauses: ['fat', 'fascia', 'fat', 'bad', 'ligament'] }), ['fascia', 'ligament', 'fat']);
  assert.deepEqual(normalizeLiftingCauses({ subtypes: { lifting: 'volume' } }), ['volume']);
  assert.deepEqual(normalizeLiftingCauses({ liftingCauses: [], subtypes: { lifting: 'fascia' } }), []);
  assert.deepEqual(normalizeLiftingCauses({ liftingCauses: ['unknown', null, 0] }), []);
  assert.deepEqual(normalizeLiftingCauses(null), []);
  const cleared = buildPlans({ lifting: 4 }, [], {}, { liftingCauses: [], subtypes: { lifting: 'fascia' } });
  assert.deepEqual(cleared.basic[0].treatments, []);
  assert.equal(cleared.extended.length, 0);
});

test('multiple confirmed lifting causes create individual basic options and one explicit combination', () => {
  for (const [causes, treatments] of [
    [['fascia', 'ligament'], ['울쎄라피 프라임', '티타늄']],
    [['fascia', 'fat'], ['울쎄라피 프라임', '온다']],
    [['fascia', 'ligament', 'fat'], ['울쎄라피 프라임', '티타늄', '온다']],
  ]) {
    for (let lifting = 1; lifting <= 4; lifting += 1) {
      const plans = buildPlans({ lifting }, [], {}, { liftingCauses: causes });
      assert.equal(plans.basic.length, causes.length);
      assert.deepEqual(plans.basic.flatMap(({ treatments: labels }) => labels), treatments);
      assert.ok(plans.basic.every(({ causeIds, kind, treatments: labels }) => kind === 'cause' && causeIds.length === 1 && labels.length === 1));
      assert.equal(plans.extended.length, 1);
      const combined = plans.extended[0];
      assert.equal(combined.kind, 'combination');
      assert.equal(combined.combinationSource, 'confirmed-causes');
      assert.deepEqual(combined.causeIds, causes);
      assert.deepEqual(combined.treatments, treatments);
      assert.deepEqual(combined.components.map(({ treatment }) => treatment), treatments);
      assert.deepEqual(combined.categoryIds, ['lifting']);
      assert.ok(treatments.every((label) => combined.title.includes(label) && combined.detail.includes(label)));
      assert.match(combined.detail, /순서·간격/);
      assert.doesNotMatch(JSON.stringify(plans), /써마지|소프웨이브/);
    }
  }
});

test('unassessed or zero lifting creates no treatment despite multiple confirmed causes', () => {
  for (const lifting of [null, undefined, '', 0]) {
    const plans = buildPlans({ lifting }, [], {}, { liftingCauses: ['fascia', 'ligament', 'fat'] });
    assert.equal(plans.basic.length + plans.extended.length + plans.deferred.length, 0);
  }
});

test('a restricted lifting component defers the entire combination while preserving eligible basic options', () => {
  for (const preference of [{ approach: 'noninvasive' }, { downtime: 'minimal' }]) {
    const plans = buildPlans({ lifting: 3 }, [], {}, { ...preference, liftingCauses: ['fascia', 'volume'] });
    assert.deepEqual(plans.basic.flatMap(({ treatments }) => treatments), ['울쎄라피 프라임']);
    assert.equal(plans.basic.length, 2);
    assert.equal(plans.extended.length, 0);
    const combined = plans.deferred.find(({ kind }) => kind === 'combination');
    assert.deepEqual(combined.treatments, ['울쎄라피 프라임', '필러']);
    assert.match(combined.title, /울쎄라피 프라임 \+ 필러/);
    assert.match(combined.reason, /전체 조합을 보류/);
    assert.equal(plans.deferred.find(({ kind }) => kind === 'cause').treatments[0], '필러');
  }
});

test('all lifting cause subsets preserve exact combinations through safety and preference gates', () => {
  const ids = ['fascia', 'ligament', 'fat', 'volume'];
  const labels = ['울쎄라피 프라임', '티타늄', '온다', '필러'];
  for (let selected = 0; selected < 16; selected += 1) {
    const causes = ids.filter((_, index) => selected & (1 << index));
    const treatments = labels.filter((_, index) => selected & (1 << index));
    for (let flags = 0; flags < 8; flags += 1) {
      for (const preference of [{}, { approach: 'noninvasive' }, { downtime: 'minimal' }]) {
        const safety = { pregnancy: Boolean(flags & 1), activeInflammation: Boolean(flags & 2), recentProcedure: Boolean(flags & 4) };
        const plans = buildPlans({ lifting: 2 }, [], safety, { ...preference, liftingCauses: causes });
        const all = [...plans.basic, ...plans.extended, ...plans.deferred];
        assert.equal(new Set(all.map(({ id }) => id)).size, all.length);
        assert.ok(all.every(({ treatments: current }) => current.every((label) => treatments.includes(label))));
        const combination = all.find(({ kind }) => kind === 'combination');
        assert.equal(Boolean(combination), causes.length > 1);
        if (!combination) continue;
        assert.deepEqual(combination.treatments, treatments);
        const blocked = flags > 0 || (causes.includes('volume') && Object.keys(preference).length > 0);
        assert.equal(plans.deferred.includes(combination), blocked);
        assert.equal(plans.extended.includes(combination), !blocked);
        assert.equal(combination.components.length, causes.length);
        if (blocked) assert.ok(combination.reason.length > 0);
      }
    }
  }
});

test('severe active acne also defers the entire confirmed lifting combination', () => {
  const plans = buildPlans({ acne: 3, lifting: 3 }, [], {}, { liftingCauses: ['fascia', 'fat'] });
  assert.ok(plans.basic.filter(({ categoryId }) => categoryId === 'lifting').every(({ treatments }) => treatments.length === 0));
  assert.ok(!plans.extended.some(({ kind }) => kind === 'combination'));
  const combined = plans.deferred.find(({ kind }) => kind === 'combination');
  assert.deepEqual(combined.treatments, ['울쎄라피 프라임', '온다']);
  assert.match(combined.reason, /활동성 염증/);
});

test('pronounced static wrinkles use explicit clinic preference rather than the severity score', () => {
  for (let wrinkles = 1; wrinkles <= 4; wrinkles += 1) {
    for (const subtype of ['static', 'laxity', 'pronounced']) {
      const plans = buildPlans({ wrinkles }, [], {}, { subtypes: { wrinkles: subtype } });
      const basic = plans.basic[0];
      assert.equal(basic.kind, 'alternatives');
      assert.deepEqual(basic.treatments, subtype === 'pronounced' ? ['소프웨이브', '써마지 FLX'] : ['써마지 FLX', '소프웨이브']);
      assert.equal(basic.preferredTreatment, subtype === 'pronounced' ? '소프웨이브' : undefined);
      if (subtype === 'pronounced') {
        assert.match(basic.detail, /병원 선호 기준/);
        assert.match(basic.detail, /비교 효과를 확정하거나 보장하는.*아닙니다/);
      } else assert.match(basic.detail, /두 장비는 이 원인에 대한 대안/);
      assert.ok(!plans.extended.some(({ kind }) => kind === 'combination'));
    }
  }
  const blocked = buildPlans({ wrinkles: 1 }, [], { recentProcedure: true }, { subtypes: { wrinkles: 'pronounced' } });
  assert.deepEqual(blocked.basic[0].treatments, []);
  assert.deepEqual(blocked.deferred[0].treatments, ['소프웨이브', '써마지 FLX']);
});

test('unconfirmed wrinkle types never infer depth or invent device candidates from scores', () => {
  for (const subtype of ['unknown', 'invalid', undefined]) {
    for (let wrinkles = 1; wrinkles <= 4; wrinkles += 1) {
      const plans = buildPlans({ wrinkles }, [], {}, { subtypes: { wrinkles: subtype }, combinationTreatments: ['써마지 FLX', '소프웨이브'] });
      assert.ok([...plans.basic, ...plans.extended, ...plans.deferred].every(({ treatments }) => treatments.length === 0));
      assert.ok(!plans.extended.some(({ kind }) => kind === 'combination'));
      if (wrinkles >= 2) assert.match(plans.extended[0].detail, /점수만으로 주름의 깊이나 원인을 추론/);
    }
  }
});

test('physician selection enables cross-category combinations of actual current basic candidates', () => {
  const profile = { liftingCauses: ['fascia'], subtypes: { wrinkles: 'laxity' }, combinationTreatments: ['울쎄라피 프라임', '소프웨이브'] };
  const plans = buildPlans({ lifting: 1, wrinkles: 1 }, [], {}, profile);
  const combined = plans.extended.find(({ combinationSource }) => combinationSource === 'physician');
  assert.equal(combined.id, 'physician-combination');
  assert.equal(combined.categoryId, 'lifting');
  assert.deepEqual(combined.categoryIds, ['lifting', 'wrinkles']);
  assert.deepEqual(combined.treatments, profile.combinationTreatments);
  assert.ok(combined.components.every(({ label, categoryIds }) => label && categoryIds.length > 0));
  assert.match(combined.detail, /의사가 현재 기본·확장 후보에서 선택/);
  assert.match(combined.detail, /순서·간격/);
  assert.ok(combined.requiresReview);
});

test('explicit physician choice is required to combine alternatives for the same wrinkle cause', () => {
  const scores = { wrinkles: 2 };
  const profile = { subtypes: { wrinkles: 'laxity' } };
  assert.ok(!buildPlans(scores, [], {}, profile).extended.some(({ kind }) => kind === 'combination'));
  const selected = buildPlans(scores, [], {}, { ...profile, combinationTreatments: ['써마지 FLX', '소프웨이브'] });
  const combination = selected.extended.find(({ kind }) => kind === 'combination');
  assert.deepEqual(combination.treatments, ['써마지 FLX', '소프웨이브']);
  assert.match(combination.detail, /한 원인에 대한 대안 장비/);
});

test('manual combinations never add absent, duplicated, or stale treatment components', () => {
  const scores = { lifting: 2 };
  const profile = { liftingCauses: ['fascia'] };
  for (const combinationTreatments of [[], ['울쎄라피 프라임'], ['울쎄라피 프라임', '울쎄라피 프라임'], ['울쎄라피 프라임', '포텐자'], ['울쎄라피 프라임', '온다', '써마지 FLX']]) {
    const plans = buildPlans(scores, [], {}, { ...profile, combinationTreatments });
    assert.ok(![...plans.extended, ...plans.deferred].some(({ combinationSource }) => combinationSource === 'physician'));
  }
  const duplicate = buildPlans(scores, [], {}, { liftingCauses: ['fascia', 'fat'], combinationTreatments: ['온다', '울쎄라피 프라임'] });
  assert.equal(duplicate.extended.filter(({ kind }) => kind === 'combination').length, 1);
  assert.equal(duplicate.extended[0].combinationSource, 'confirmed-causes');
  const stale = buildPlans({ lifting: 0, wrinkles: 2 }, [], {}, { ...profile, subtypes: { wrinkles: 'laxity' }, combinationTreatments: ['울쎄라피 프라임', '써마지 FLX', '소프웨이브'] });
  assert.ok(!stale.extended.some(({ kind }) => kind === 'combination'));
});

test('safety and preference gates atomically defer physician-selected combinations', () => {
  const scores = { lifting: 2, volume: 2 };
  const profile = { liftingCauses: ['fascia'], combinationTreatments: ['울쎄라피 프라임', '필러'] };
  for (const [safety, preferences] of [
    [{ pregnancy: true }, {}], [{ activeInflammation: true }, {}], [{ recentProcedure: true }, {}],
    [{}, { approach: 'noninvasive' }], [{}, { downtime: 'minimal' }],
  ]) {
    const plans = buildPlans(scores, [], safety, { ...profile, ...preferences });
    assert.ok(!plans.extended.some(({ combinationSource }) => combinationSource === 'physician'));
    const combined = plans.deferred.find(({ combinationSource }) => combinationSource === 'physician');
    assert.deepEqual(combined.treatments, ['울쎄라피 프라임', '필러']);
    assert.match(combined.title, /울쎄라피 프라임 \+ 필러/);
    assert.match(combined.detail, /혈관 관련 위험/);
    assert.ok(combined.reason.length > 0);
  }
});

test('multi-cause and manual-combination planning cannot mutate frozen caller data', () => {
  const scores = Object.freeze({ lifting: 2, wrinkles: 2 });
  const profile = Object.freeze({
    liftingCauses: Object.freeze(['fat', 'fascia']),
    combinationTreatments: Object.freeze(['온다', '소프웨이브']),
    subtypes: Object.freeze({ wrinkles: 'pronounced' }),
  });
  const plans = buildPlans(scores, [], {}, profile);
  assert.equal(plans.basic.length, 3);
  const combined = plans.extended.find(({ combinationSource }) => combinationSource === 'physician');
  combined.treatments.push('mutated');
  combined.causeIds.push('mutated');
  assert.deepEqual(profile.liftingCauses, ['fat', 'fascia']);
  assert.deepEqual(profile.combinationTreatments, ['온다', '소프웨이브']);
  assert.deepEqual(buildPlans(scores, [], {}, profile).extended.find(({ combinationSource }) => combinationSource === 'physician').treatments, ['온다', '소프웨이브']);
});

test('physician combinations include eligible extended device and injectable options', () => {
  for (const [scores, subtypes, treatment] of [
    [{ lifting: 1, texture: 2 }, { texture: 'pores' }, '포텐자'],
    [{ lifting: 1, wrinkles: 2 }, { wrinkles: 'static' }, '리쥬란'],
    [{ lifting: 1, wrinkles: 2 }, { wrinkles: 'static' }, '리투오'],
    [{ lifting: 1, wrinkles: 2 }, { wrinkles: 'static' }, '힐로웨이브'],
    [{ lifting: 1, volume: 2 }, { volume: 'localized' }, '고우리'],
    [{ lifting: 1, volume: 2 }, { volume: 'localized' }, '레디어스'],
  ]) {
    const selected = ['울쎄라피 프라임', treatment];
    const plans = buildPlans(scores, [], {}, { liftingCauses: ['fascia'], subtypes, combinationTreatments: selected });
    assert.ok(plans.extended.some(({ kind, treatments }) => kind !== 'combination' && treatments.includes(treatment)));
    const combined = plans.extended.find(({ combinationSource }) => combinationSource === 'physician');
    assert.deepEqual(combined.treatments, selected);
    assert.equal(combined.categoryIds.length, 2);
    assert.equal(combined.categoryId, 'lifting');
    assert.ok(combined.components[1].categoryIds.some((id) => id !== 'lifting'));
    assert.equal(plans.deferred.length, 0);
  }
});

test('physician selection can explicitly combine two extended options without source recursion', () => {
  const plans = buildPlans({ texture: 2, wrinkles: 2 }, [], {}, {
    subtypes: { texture: 'pores', wrinkles: 'static' },
    combinationTreatments: ['포텐자', '리쥬란'],
  });
  const combined = plans.extended.find(({ combinationSource }) => combinationSource === 'physician');
  assert.deepEqual(combined.treatments, ['포텐자', '리쥬란']);
  assert.deepEqual(combined.categoryIds, ['texture', 'wrinkles']);
  assert.equal(plans.extended.filter(({ combinationSource }) => combinationSource === 'physician').length, 1);
  assert.equal(combined.components.length, 2);
});

test('deferred extended source reasons propagate to the whole physician combination', () => {
  for (const [scores, subtypes, treatment] of [
    [{ lifting: 2, texture: 2 }, { texture: 'pores' }, '포텐자'],
    [{ lifting: 2, wrinkles: 2 }, { wrinkles: 'static' }, '리쥬란'],
  ]) {
    for (const preference of [{ approach: 'noninvasive' }, { downtime: 'minimal' }]) {
      const selected = ['울쎄라피 프라임', treatment];
      const plans = buildPlans(scores, [], {}, { ...preference, liftingCauses: ['fascia'], subtypes, combinationTreatments: selected });
      assert.ok(plans.basic.some(({ treatments }) => treatments.includes('울쎄라피 프라임')));
      assert.ok(!plans.extended.some(({ combinationSource }) => combinationSource === 'physician'));
      const source = plans.deferred.find(({ kind, treatments }) => kind !== 'combination' && treatments.includes(treatment));
      const combined = plans.deferred.find(({ combinationSource }) => combinationSource === 'physician');
      assert.deepEqual(combined.treatments, selected);
      assert.ok(combined.reason.includes(source.reason));
      assert.match(combined.reason, /전체 조합을 보류/);
      assert.ok(selected.every((label) => combined.title.includes(label)));
    }
  }
});

test('an active source remains usable when an unrelated source component is deferred', () => {
  const plans = buildPlans({ lifting: 2, contour: 2 }, [], {}, {
    liftingCauses: ['fascia'], approach: 'noninvasive',
    combinationTreatments: ['울쎄라피 프라임', '온다'],
  });
  assert.ok(plans.deferred.some(({ treatments }) => treatments.includes('보톡스')));
  assert.ok(plans.extended.some(({ kind, treatments }) => kind !== 'combination' && treatments.includes('온다')));
  const combined = plans.extended.find(({ combinationSource }) => combinationSource === 'physician');
  assert.deepEqual(combined.treatments, ['울쎄라피 프라임', '온다']);
  assert.equal(combined.reason, undefined);
  assert.doesNotMatch(combined.detail, /보톡스/);
});

test('an unregistered selection invalidates the entire manual combination instead of silently shrinking it', () => {
  for (const invalid of ['미등록 장비', '', null, 123]) {
    const plans = buildPlans({ lifting: 2, wrinkles: 2 }, [], {}, {
      liftingCauses: ['fascia'], subtypes: { wrinkles: 'laxity' },
      combinationTreatments: ['울쎄라피 프라임', '소프웨이브', invalid],
    });
    assert.ok(![...plans.extended, ...plans.deferred].some(({ combinationSource }) => combinationSource === 'physician'));
    assert.deepEqual(plans.basic.flatMap(({ treatments }) => treatments), ['써마지 FLX', '소프웨이브', '울쎄라피 프라임']);
  }
});
