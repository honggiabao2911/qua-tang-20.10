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
vm.runInContext(source.replace('return Object.freeze({ encode, decode, encodeCompact });',
  'return Object.freeze({ encode, decode, encodeCompact, raw: source => "#c=" + compress(source, 6, n => alphabet.charAt(n)) });') +
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

// v5 is optional and never longer; snapshots, Unicode and old wire formats survive.
const compactSamples=[
  '20/10, con chúc mẹ khỏe, ngủ ngon và có thật nhiều niềm vui. Hôm nay, mong mẹ dành một chút thời gian cho điều mình thích. Gửi mẹ một tấm thiệp nhỏ và thật nhiều thương.',
  'Anh chúc em bình yên, hạnh phúc nhé ❤️',
  Array.from({length:256},(_,i)=>String.fromCharCode(i)).join(''),
  'ĂăĐđĨĩŨũƠơƯư'+Array.from({length:90},(_,i)=>String.fromCharCode(0x1ea0+i)).join(''),
  'Dịu dàng, hạnh phúc, yêu thương 🌸 中文 日本語 한글 العربية'.normalize('NFD'),
  'ÿýþæç ÀÄ ß ü \" \\ \n 🧑‍🤝‍🧑'
];
for(const greeting of compactSamples){
  const payload={target:'lover',recipientName:'An',greeting,design:{arrival:'growing',scene:'orbits',experience:'lovegalaxy',body:greeting}};
  const legacy=codec.encode(payload),compact=codec.encodeCompact(payload);
  assert.ok(compact.length<=legacy.length);
  assert.deepEqual(plain(codec.decode(compact)),plain(codec.decode(legacy)));
  checks++;
}
const shorter={greeting:compactSamples[0]};
assert.ok(codec.encodeCompact(shorter).length<codec.encode(shorter).length*.9);
for(const malformed of ['[5,"ÿ"]','[5,"ÿA"]','[5,"'+'æ'.repeat(4000)+'"]'])assert.throws(()=>codec.decode(codec.raw(malformed)));
checks+=4;
const latinBoundary={greeting:'é'.repeat(3000),design:{body:'é'.repeat(3000),secret:'\u0001'.repeat(1000)},message:'\u0001'.repeat(1000)};
assert.equal(codec.encodeCompact(latinBoundary),codec.encode(latinBoundary));
assert.deepEqual(plain(codec.decode(codec.encodeCompact(latinBoundary))),plain(codec.decode(codec.encode(latinBoundary))));
checks++;
let seed=26;
const next=()=>{seed=(seed*1664525+1013904223)>>>0;return seed;};
const alphabetWide=compactSamples.join('');
for(let i=0;i<100;i++){
  let greeting='';for(let j=0;j<300;j++)greeting+=alphabetWide[next()%alphabetWide.length];
  const payload={greeting};
  assert.deepEqual(plain(codec.decode(codec.encodeCompact(payload))),plain(codec.decode(codec.encode(payload))));
  checks++;
}

// Optional bé B settings are appended after arrival, preserving all older indexes.
for(const welcome of ['none','bebe'])for(const target of targets){
  const design={arrival:'growing',welcome,welcomeText:'Bé B mang chút nắng đến nhé! 🌸'};
  const payload={target,greeting:'Chúc một ngày bình yên.',design};
  assert.deepEqual(plain(codec.decode(codec.encodeCompact(payload))).design,design);checks++;
}
for(const welcome of ['',null,[],{},false,9,'tiny']){assert.throws(()=>codec.encode({design:{welcome}}));checks++;}
assert.throws(()=>codec.encodeCompact({design:{welcomeText:'x'.repeat(161)}}));checks++;
assert.equal(plain(codec.decode(codec.encode({design:{arrival:'growing'}}))).design.welcome,undefined);checks++;

// Named characters and greeting sound append fields without changing old cards.
for(const welcomeName of ['', 'Mây nhỏ', 'Bé Mây 🌷', '<b>Mây</b>', 'a'.repeat(30)])for(const welcomeMusic of ['on','off']){
  const payload={target:'mom',greeting:'Chúc mẹ bình yên.',design:{welcome:'bebe',welcomeName,welcomeMusic}};
  assert.deepEqual(plain(codec.decode(codec.encodeCompact(payload))).design,payload.design);checks++;
}
for(const welcomeName of ['a'.repeat(31),null,[],{},4]){assert.throws(()=>codec.encode({design:{welcomeName}}));checks++;}
for(const welcomeMusic of ['',null,[],{},false,9,'auto']){assert.throws(()=>codec.encodeCompact({design:{welcomeMusic}}));checks++;}
const legacyWelcome=plain(codec.decode(codec.encode({design:{welcome:'bebe',welcomeText:'Lời riêng.'}})));
assert.equal(legacyWelcome.design.welcomeName,undefined);assert.equal(legacyWelcome.design.welcomeMusic,undefined);checks+=2;

// Six new worlds append enum indexes; vector ink stores only bounded coordinates.
const signatureContext=vm.createContext({window:{}});
vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets/js/card-signature.js'),'utf8'),signatureContext);
const signature=signatureContext.window.CardSignature;
const ink=signature.encode([[[20,100],[100,20],[140,110],[210,60]],[[230,100],[390,110],[600,180]]]);
assert.deepEqual(plain(signature.decode(ink)),[[[20,100],[100,20],[140,110],[210,60]],[[230,100],[390,110],[600,180]]]);checks++;
for(const experience of ['glassgarden','wisteria','lotusmoon','sunmail','lavender','heartgarden'])for(const signatureStyle of ['classic','script','minimal','seal']){
 const payload={target:'mom',greeting:'Chúc mẹ bình yên.',design:{scene:experience,experience,signatureStyle,signatureText:'Thương mẹ · Minh 🌷',signatureInk:ink}};
 assert.deepEqual(plain(codec.decode(codec.encodeCompact(payload))).design,payload.design);checks++;
}
for(const signatureText of ['', '<b>Minh</b>', '🖋'.repeat(40)]){assert.deepEqual(roundtrip({design:{signatureText}}).design,{signatureText});checks++;}
for(const signatureInk of ['a','AAA','AAAAAA.', '<svg/>',signature.encode([[[601,0],[0,0]]]),signature.encode([[[0,181],[0,0]]]),Array(17).fill('AAAAAA').join('.'),signature.encode([Array(401).fill([20,20])])]){
 assert.throws(()=>codec.encodeCompact({design:{signatureInk}}));assert.throws(()=>signature.decode(signatureInk));checks+=2;
}
for(const signatureStyle of ['',null,{},'fancy']){assert.throws(()=>codec.encode({design:{signatureStyle}}));checks++;}
assert.throws(()=>codec.encode({design:{signatureText:'x'.repeat(81)}}));checks++;
const oldSignature=plain(codec.decode(codec.encode({senderName:'Minh',design:{showSignature:'on'}})));
assert.equal(oldSignature.design.signatureInk,undefined);assert.equal(oldSignature.design.signatureText,undefined);checks+=2;


// All user-written sentences are preserved, independently of the live catalog.
for(const world of ['dandelion','teacup','seabottle','starcrane'])for(const effect of ['fireflies','hearts','bubbles']){
 const payload={target:'lover',pronoun:'em',recipientPronoun:'anh',greeting:'20/10, em chúc anh thật khỏe 🌷. \u0001 «ÿ»',design:{scene:world,experience:world,effect,welcomeLines:JSON.stringify(['Chào anh 🥰 <script>hi</script>','Một điều riêng từ em.','Anh nhận hoa nhé.'])}};
 assert.deepEqual(plain(codec.decode(codec.encodeCompact(payload))),roundtrip(payload));checks++;
 assert.ok(codec.encodeCompact(payload).length<=codec.encode(payload).length);checks++;
}
for(const lines of ['[]','["one"]','["a",""]',JSON.stringify(Array(9).fill('a')),JSON.stringify(['a','x'.repeat(161)]),'null','{}','[1,2]']){
 assert.throws(()=>codec.encodeCompact({design:{welcomeLines:lines}}));checks++;
}
const defaultDesign={theme:'rose',font:'serif',layout:'classic',decoration:'botanical',effect:'petals',dedication:'',body:'',scene:'bouquet',structure:'arch',ornament:'botanical',intensity:'cinematic',experience:'sunflower',size:'medium',reveal:'gentle',showDate:'on',showSignature:'on',secret:'',giftIntro:'',flowerNotes:'[]',arrival:'growing',welcome:'bebe',welcomeText:'',welcomeName:'bé B',welcomeMusic:'on',signatureText:'',signatureInk:'',signatureStyle:'script',welcomeLines:''};
const compactDefault={target:'mom',recipientPronoun:'mẹ',greeting:'20/10, con chúc mẹ khỏe, ngủ ngon và có thật nhiều niềm vui. Hôm nay, mong mẹ dành một chút thời gian cho điều mình thích. Gửi mẹ một tấm thiệp nhỏ và thật nhiều thương.',design:defaultDesign};
assert.deepEqual(plain(codec.decode(codec.encodeCompact(compactDefault))),roundtrip(compactDefault));checks++;
assert.ok(codec.encodeCompact(compactDefault).length<codec.encode(compactDefault).length*.75);checks++;
for(const value of ['\u0000','\u0001','\u001f','\n','ÿ','😀','\\u0001']){
 const p={greeting:value,design:{welcomeLines:JSON.stringify(['Tự viết '+value,'20/10, chúc mẹ 🌷'])}};
 assert.deepEqual(plain(codec.decode(codec.encodeCompact(p))),roundtrip(p));checks++;
}
for(const data of [[-1],[2**28],[1,0,3],[0,1,0,0,0],[0,0,null],[0,28,0],[0,1],[0,0,999],[0,27,'["a"]']]){
 const wire=[6,null,null,null,null,null,null,null,null,data];
 assert.throws(()=>codec.decode(codec.raw(JSON.stringify(wire))));checks++;
}
const bomb='[6,null,null,null,null,null,null,null,null,null,null,null,"'+String.fromCharCode(1).repeat(1000)+'"]';
assert.throws(()=>codec.decode(codec.raw(bomb)));checks++;

for(const scene of ['motherhug','grandmatea','classroom','sisterswing','friendpicnic','lovewaltz']){
 const p={target:'lover',greeting:'Một lời chúc giữ nguyên cho người thương.',design:{scene,experience:scene,effect:'hearts',welcomeLines:JSON.stringify(['Chào em!','Một món quà dành cho em.'])}};
 assert.equal(roundtrip(p).design.experience,scene);checks++;
 assert.deepEqual(plain(codec.decode(codec.encodeCompact(p))),roundtrip(p));checks++;
}
// Cross-group music is explicit in design; recipient grammar remains separate.
for(const target of targets)for(const musicGroup of targets){
 const p={target,musicId:`${musicGroup}:5`,greeting:'Lời chúc không đổi.',design:{musicGroup,scene:'teachingbook',experience:'teachingbook'}};
 assert.deepEqual(plain(codec.decode(codec.encodeCompact(p))),roundtrip(p));checks++;
 assert.equal(roundtrip(p).musicId,`${musicGroup}:5`);checks++;
}
assert.equal(roundtrip({target:'mom',design:{musicGroup:'teacher'}}).musicId,'teacher:0');checks++;
for(const scene of ['teacherbloom','teachingbook','chalkconstellation']){
 const p={target:'teacher',musicId:'mom:2',greeting:'Em cảm ơn cô.',design:{musicGroup:'mom',scene,experience:scene,flowerNotes:JSON.stringify(['Cảm ơn cô 🌷','<b>Riêng cô</b>'])}};
 assert.deepEqual(plain(codec.decode(codec.encodeCompact(p))),roundtrip(p));checks++;
}
for(const musicGroup of ['bad',null,{},'Mẹ']){assert.throws(()=>codec.encode({design:{musicGroup}}));checks++;}
assert.throws(()=>codec.encode({target:'mom',musicId:'lover:0',design:{musicGroup:'teacher'}}));checks++;
console.log(`CardLinks: ${checks} compatibility, Unicode, gift, arrival and malformed-input checks passed.`);
