'use strict';

// Run with: node tests/test_links.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../assets/js/card-links.js'), 'utf8');
const context = vm.createContext({});
// Expose only the existing compressor for malformed wire fixtures. Production
// exports stay limited to encode/decode.
vm.runInContext(source.replace('return Object.freeze({ encode, decode });',
  'return Object.freeze({ encode, decode, raw: source => "#c=" + compress(source, 6, n => alphabet.charAt(n)) });') +
  '\nglobalThis.codec = CardLinks;', context);
const { codec } = context;
const plain = value => JSON.parse(JSON.stringify(value));
const roundtrip = payload => plain(codec.decode(codec.encode(payload)));
let checks = 0;

// These links were generated before adding gift fields or scene enum values.
// Re-encoding as well as decoding proves existing indexes did not shift.
const previousV4 = [
  ['#c=NoFgukA', {}],
  ['#c=NoFgNAbGB2CuA28wCICC1koHIHNANgILt4AlgAQAuAFnoIWA0OmciMCSjSArGMG80z_y16tBARhFCJPMZMECmyLBUDbeCQCmAWwCEyALooNmKGmgUSAYwoAvs2vUkARgBuTJAJ4Ar6GBIVAhXguABysbEwBLkkATckB4P90gA',
    { target: 'lover', senderName: 'Người thương', recipientName: 'An', pronoun: 'anh', recipientPronoun: 'em', greeting: 'Anh chúc em bình yên, hạnh phúc nhé ❤️', musicId: 'lover:5', tone: 'romantic', design: { scene: 'orbits', experience: 'lovegalaxy', secret: 'Nhớ em!' } }],
  ['#c=NoFgNOB2CuA2thvRcFLalz1mAZjAIEYwAmQsAIgGEALAL4GMACAI0EK8SZgN2gEtKVADLQAL1wC2gSbwJzRoAbAQLt4AsEQIFyxAAxldJEpUoBdI0A',
    { target: 'friend', design: { theme: 'midnight', font: 'handwriting', layout: 'centered', decoration: 'minimal', effect: 'none', dedication: 'Chúc bạn vui', body: 'Luôn mỉm cười', scene: 'galaxy', structure: 'folded', ornament: 'pressed', intensity: 'off', experience: 'crystal', size: 'large', reveal: 'slow', showDate: 'off', showSignature: 'off', secret: '' } }]
];
for (const [hash, payload] of previousV4) {
  assert.equal(codec.encode(payload), hash);
  const decoded = plain(codec.decode(hash));
  for (const [key, value] of Object.entries(payload)) assert.deepEqual(decoded[key], value);
  assert.ok(!Object.hasOwn(decoded.design, 'giftIntro'));
  assert.ok(!Object.hasOwn(decoded.design, 'flowerNotes'));
  assert.ok(!Object.hasOwn(decoded.design, 'arrival'));
  checks++;
}

const gifts = ['umbrella', 'storybook', 'island', 'ocean', 'balloon', 'lantern', 'wishtree', 'silk', 'lightbridge', 'musicbox'];
const targets = ['mom', 'grandma', 'teacher', 'sister', 'friend', 'women', 'lover'];
for (const target of targets) for (const gift of gifts) for (const unicodeForm of ['NFC', 'NFD']) {
  const greeting = 'Chúc em luôn có những ngày dịu dàng, có anh ở bên ❤️ 🌷'.normalize(unicodeForm);
  const design = {
    scene: gift, experience: gift, giftIntro: 'Món quà nhỏ, gửi trọn thương yêu'.normalize(unicodeForm),
    flowerNotes: JSON.stringify(['Mỗi cánh hoa là một lời thương 🌸', 'Thương bạn thật nhiều', 'Cảm ơn nhé', 'Một ngày bình yên', 'Luôn mỉm cười'].map(note => note.normalize(unicodeForm)))
  };
  const decoded = roundtrip({ target, musicId: `${target}:5`, greeting, design });
  assert.equal(decoded.target, target);
  assert.equal(decoded.musicId, `${target}:5`);
  assert.equal(decoded.greeting, greeting);
  assert.deepEqual(decoded.design, design);
  checks++;
}

// New fields remain optional; explicit empty values retain their meaning.
for (const design of [{}, { giftIntro: '' }, { flowerNotes: '[]' }, { secret: '', giftIntro: '', flowerNotes: '[]' }]) {
  assert.deepEqual(roundtrip({ design }).design, design);
  checks++;
}
const edgeNotes = JSON.stringify(Array(5).fill('\u0000'.repeat(160)));
assert.equal(roundtrip({ greeting: 'á'.repeat(3000), design: { giftIntro: 'ậ'.repeat(160), flowerNotes: edgeNotes } }).design.flowerNotes, edgeNotes);
checks++;

const invalidDesigns = [
  { giftIntro: 'x'.repeat(161) }, { giftIntro: null }, { giftIntro: 9 }, { giftIntro: [] },
  { flowerNotes: null }, { flowerNotes: [] }, { flowerNotes: '' }, { flowerNotes: 'not JSON' },
  { flowerNotes: '{}' }, { flowerNotes: '[[]]' }, { flowerNotes: '[null]' }, { flowerNotes: '[false]' },
  { flowerNotes: '[{"constructor":"x"}]' }, { flowerNotes: JSON.stringify(Array(6).fill('')) },
  { flowerNotes: JSON.stringify(['á'.repeat(161)]) }, { flowerNotes: ' '.repeat(5000) + '[]' }
];
for (const design of invalidDesigns) {
  assert.throws(() => codec.encode({ design }));
  const packedDesign = Array(19).fill(null);
  for (const [key, value] of Object.entries(design)) packedDesign[key === 'giftIntro' ? 17 : 18] = value;
  // null in positional schemas deliberately means an omitted optional value.
  if (!Object.values(design).includes(null)) {
    assert.throws(() => codec.decode(codec.raw(JSON.stringify([4, null, null, null, null, null, null, null, null, packedDesign]))));
  }
  checks++;
}
assert.throws(() => codec.encode({ greeting: 'x'.repeat(3001) }));
assert.throws(() => codec.decode(codec.raw('x'.repeat(1000000))));
assert.equal({}.polluted, undefined);
checks += 3;

// Bouquet reception is appended after the existing v4 gift fields; older
// payloads must remain byte-identical and carry no implicit arrival default.
for (const arrival of ['stardust', 'growing', 'classic']) for (const target of targets) {
  const design = { scene: 'musicbox', experience: 'musicbox', giftIntro: 'Mở một điều dịu dàng 🌸',
    flowerNotes: JSON.stringify(['Cảm ơn bạn', 'Mãi thương nhé ❤️']), arrival };
  assert.deepEqual(roundtrip({ target, musicId: `${target}:5`, design }).design, design);
  checks++;
}
for (const value of ['', 'unknown', null, false, {}, [], 3, -1]) {
  assert.throws(() => codec.encode({ design: { arrival: value } }));
  if (value !== null) {
    const packedDesign = Array(20).fill(null);
    packedDesign[19] = value;
    assert.throws(() => codec.decode(codec.raw(JSON.stringify([4, null, null, null, null, null, null, null, null, packedDesign]))));
  }
  checks++;
}
const explicitArrival = plain(codec.decode(codec.raw(JSON.stringify([4, null, null, null, null, null, null, null, null,
  [...Array(19).fill(null), 0]]))));
assert.equal(explicitArrival.design.arrival, 'stardust');
checks++;

console.log(`CardLinks: ${checks} compatibility, Unicode, gift, arrival and malformed-input checks passed.`);
