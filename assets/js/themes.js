/* Theme artwork is original SVG. No external images, animation libraries or canvas loops. */
(() => {
  'use strict';
  const catalog = Object.freeze({
    ...GiftScenes.catalog,
    galaxy: { name: 'Vũ trụ ngân hà', description: 'Tinh vân tím · bụi sao hội tụ', palette: 'midnight', opening: 'stardust', compatibleOpenings: ['stardust', 'orbits'], structure: 'postcard', ornament: 'orbit', effect: 'constellation', invitation: 'Một vũ trụ nhỏ đang chờ được mở.', interaction: 'Chạm để nối một chòm sao', color: '#bdb5ff', background: '#10142f' },
    aurora: { name: 'Cực quang', description: 'Dải sáng ngọc · bầu trời phương Bắc', palette: 'teal', opening: 'aurora', compatibleOpenings: ['aurora', 'stardust'], structure: 'arch', ornament: 'orbit', effect: 'constellation', invitation: 'Có một dải sáng dành riêng cho người nhận.', interaction: 'Chạm để đánh thức dải sáng', color: '#80e8ce', background: '#122e39' },
    garden: { name: 'Khu vườn xanh', description: 'Hoa xanh · lá mở · sương sớm', palette: 'sage', opening: 'bloom', compatibleOpenings: ['bloom', 'butterflies'], structure: 'arch', ornament: 'botanical', effect: 'butterflies', invitation: 'Một khu vườn nhỏ cất giữ những lời thương.', interaction: 'Chạm để một cụm hoa nở', color: '#83bb9b', background: '#edf5ec' },
    rose: { name: 'Vườn hồng', description: 'Hồng nhung · cánh hoa · giấy lụa', palette: 'rose', opening: 'rose', compatibleOpenings: ['rose', 'bloom', 'envelope'], structure: 'arch', ornament: 'botanical', effect: 'petals', invitation: 'Trong những cánh hồng là một điều muốn gửi.', interaction: 'Chạm để cánh hồng bay', color: '#c96889', background: '#f9e9ed' },
    sunflower: { name: 'Nắng trong vườn', description: 'Cửa sổ nắng · cúc mật ong', palette: 'champagne', opening: 'sunrise', compatibleOpenings: ['sunrise', 'bloom'], structure: 'folded', ornament: 'pressed', effect: 'petals', invitation: 'Mở ô cửa này, một chút nắng đang chờ.', interaction: 'Chạm để gom một vệt nắng', color: '#daa84d', background: '#fcf2db' },
    lotus: { name: 'Sen thanh nhã', description: 'Sen ngọc · gợn nước · tĩnh tại', palette: 'teal', opening: 'lotus', compatibleOpenings: ['lotus', 'moonlight'], structure: 'arch', ornament: 'botanical', effect: 'petals', invitation: 'Một đóa sen, một lời chúc thật dịu dàng.', interaction: 'Chạm để mặt nước gợn nhẹ', color: '#84afa6', background: '#e9f3ed' },
    moonlake: { name: 'Hồ trăng', description: 'Ánh bạc · mặt hồ · thư dưới trăng', palette: 'midnight', opening: 'moonlight', compatibleOpenings: ['moonlight', 'stardust'], structure: 'letter', ornament: 'orbit', effect: 'constellation', invitation: 'Dưới ánh trăng có một lời nhắn dành riêng.', interaction: 'Chạm để ánh trăng lướt trên hồ', color: '#c5ddf0', background: '#142539' },
    butterfly: { name: 'Bướm và hoa', description: 'Cánh bướm · hoa mềm · sắc pastel', palette: 'lilac', opening: 'butterflies', compatibleOpenings: ['butterflies', 'bloom'], structure: 'postcard', ornament: 'botanical', effect: 'butterflies', invitation: 'Đi theo cánh bướm, có một món quà nhỏ.', interaction: 'Chạm để thả vài cánh bướm', color: '#b394d5', background: '#f0eafb' },
    letter: { name: 'Thư tay kỷ niệm', description: 'Giấy sợi · dấu sáp · nhành hoa khô', palette: 'champagne', opening: 'envelope', compatibleOpenings: ['envelope', 'layers'], structure: 'letter', ornament: 'pressed', effect: 'none', invitation: 'Một lá thư được gói bằng sự chân thành.', interaction: 'Chạm vào dấu sáp để đọc lời nhắn', color: '#ad7855', background: '#f2e6d4' },
    pearl: { name: 'Ngọc trai', description: 'Xà cừ · lụa trắng · ánh viền champagne', palette: 'champagne', opening: 'layers', compatibleOpenings: ['layers', 'envelope'], structure: 'folded', ornament: 'pressed', effect: 'constellation', invitation: 'Một món quà nhỏ, óng ánh những điều tốt đẹp.', interaction: 'Chạm để ánh xà cừ lướt qua', color: '#c2a175', background: '#f8f2ea' },
    crystal: { name: 'Trái tim pha lê', description: 'Pha lê tím · ánh hồng · nhịp tim', palette: 'lilac', opening: 'crystal', compatibleOpenings: ['crystal', 'orbits'], structure: 'postcard', ornament: 'orbit', effect: 'constellation', invitation: 'Có một trái tim đang giữ điều muốn nói.', interaction: 'Chạm để trái tim tỏa sáng', color: '#d99bd1', background: '#f3e6f5' },
    lovegalaxy: { name: 'Dải ngân hà tình yêu', description: 'Quỹ đạo đôi · trái tim từ những vì sao', palette: 'midnight', opening: 'orbits', compatibleOpenings: ['orbits', 'crystal', 'stardust'], structure: 'arch', ornament: 'orbit', effect: 'constellation', invitation: 'Giữa muôn vì sao, có một điều muốn gửi.', interaction: 'Chạm để gửi một vệt sao thương', color: '#f1a4cb', background: '#231330' }
  });
  const defaults = Object.freeze({ mom: 'sunflower', grandma: 'lotus', teacher: 'letter', sister: 'butterfly', older: 'butterfly', younger: 'butterfly', friend: 'garden', women: 'pearl', lover: 'lovegalaxy', love: 'lovegalaxy' });
  const openingNames = Object.freeze({ stardust: 'Bụi sao hội tụ', aurora: 'Dải cực quang hé mở', bloom: 'Cành lá mở vườn', rose: 'Nụ hồng bung nở', sunrise: 'Ô cửa nắng', lotus: 'Sen mở trên mặt nước', moonlight: 'Ánh trăng soi thư', butterflies: 'Cánh bướm dẫn lối', envelope: 'Mở thư và dấu sáp', layers: 'Những lớp ngọc trai', crystal: 'Trái tim pha lê', orbits: 'Hai quỹ đạo giao nhau' });
  let serial = 0;
  let refs = {};
  let current = 'sunflower';
  let design = {};
  let screen = 'home';
  let burstTimer = 0;
  let reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const lowPower = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory && navigator.deviceMemory <= 4);
  const heart = 'M0 18C-61-22-77-57-49-78C-29-93-9-81 0-62C9-81 29-93 49-78C77-57 61-22 0 18Z';
  const use = (id, x, y, scale = 1, rotation = 0, cls = '') => `<g class="${cls}" transform="translate(${x} ${y}) rotate(${rotation}) scale(${scale})"><use href="#${id}"/></g>`;
  function definitions(p, t) {
    return `<defs>
      <radialGradient id="${p}glow"><stop stop-color="${t.color}" stop-opacity=".8"/><stop offset="1" stop-color="${t.color}" stop-opacity="0"/></radialGradient>
      <linearGradient id="${p}foil" x2="1" y2="1"><stop stop-color="#fff9e9"/><stop offset=".4" stop-color="${t.color}"/><stop offset=".68" stop-color="#fff5e8"/><stop offset="1" stop-color="${t.color}"/></linearGradient>
      <linearGradient id="${p}paper" x2=".7" y2="1"><stop stop-color="#fffef7"/><stop offset="1" stop-color="#f2e9d9"/></linearGradient>
      <linearGradient id="${p}petal" x2="1" y2="1"><stop stop-color="#fff4f4"/><stop offset=".45" stop-color="${t.color}"/><stop offset="1" stop-color="${t.color}" stop-opacity=".55"/></linearGradient>
      <linearGradient id="${p}leaf"><stop stop-color="#819c7b"/><stop offset="1" stop-color="#395d50"/></linearGradient>
      <linearGradient id="${p}aurora" x2="0" y2="1"><stop stop-color="#9ef0cb" stop-opacity=".04"/><stop offset=".38" stop-color="#68d9bb" stop-opacity=".7"/><stop offset=".75" stop-color="#b092e8" stop-opacity=".2"/><stop offset="1" stop-color="#a78de5" stop-opacity="0"/></linearGradient>
      <radialGradient id="${p}pearl" cx=".3" cy=".25"><stop stop-color="#fff"/><stop offset=".45" stop-color="#f4e7e4"/><stop offset=".65" stop-color="#d8d9e7"/><stop offset=".82" stop-color="#f0e5d0"/><stop offset="1" stop-color="#c9bfae"/></radialGradient>
      <g id="${p}star"><path d="M0-8 1.7-1.7 8 0 1.7 1.7 0 8-1.7 1.7-8 0-1.7-1.7Z" fill="#fff6df"/><circle r="2.2" fill="#fff"/></g>
      <g id="${p}leafShape"><path d="M0 0Q-45-28-57-80Q-3-69 0 0" fill="url(#${p}leaf)"/><path d="M0 0-42-62" stroke="#c9dfbc" stroke-opacity=".45" fill="none"/></g>
      <g id="${p}flower">${Array.from({ length: 9 }, (_, i) => `<ellipse cy="-23" rx="14" ry="29" fill="url(#${p}petal)" stroke="#fff" stroke-opacity=".3" transform="rotate(${i * 40})"/>`).join('')}<circle r="15" fill="#d8bd7c"/><circle r="9" fill="#f8e9b5"/><circle r="4" fill="#a68d58"/></g>
      <g id="${p}rose">${Array.from({ length: 10 }, (_, i) => `<path d="M-8 5Q-48-12-31-43Q-4-58 18-20Q43-20 30 7Q16 28-8 5" fill="url(#${p}petal)" stroke="#fff0ed" stroke-opacity=".35" transform="rotate(${i * 61}) scale(${1 - i * .065})"/>`).join('')}</g>
      <g id="${p}butterfly"><g class="tx-wing tx-wing-left"><path d="M0 1C-57-62-91-30-58 11C-79 56-31 57 0 1" fill="url(#${p}petal)" stroke="#fff"/><path d="M-4 0-48-16M-5 7-40 30" fill="none" stroke="#a18cbb" stroke-opacity=".5"/></g><g class="tx-wing tx-wing-right"><path d="M0 1C57-62 91-30 58 11C79 56 31 57 0 1" fill="url(#${p}petal)" stroke="#fff"/><path d="M4 0 48-16M5 7 40 30" fill="none" stroke="#a18cbb" stroke-opacity=".5"/></g><path d="M0-14V24M0-12-8-23M0-12 8-23" stroke="#73516e" fill="none" stroke-width="3" stroke-linecap="round"/></g>
    </defs>`;
  }
  function starfield(p, count = 46) {
    return `<g class="tx-stars">${Array.from({ length: count }, (_, i) => { const x = (i * 137 + 47) % 875 + 12; const y = (i * 89 + 31) % 575 + 10; return `<g class="tx-star" style="--delay:${-(i % 9)}s;--duration:${4 + i % 6}s;opacity:${.3 + (i % 5) * .14}">${i % 5 === 0 ? use(`${p}star`, x, y, .3 + i % 3 * .12) : `<circle cx="${x}" cy="${y}" r="${.8 + i % 4 * .38}" fill="#fff3df"/>`}</g>`; }).join('')}</g>`;
  }
  function branch(p, x, y, scale, flip = false) {
    return `<g transform="translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})"><path d="M0 0Q-85-120-55-270" fill="none" stroke="#637f68" stroke-width="5"/>${[-30, -85, -142, -197].map((v, i) => use(`${p}leafShape`, -22 - i * 12, v, .88 - i * .12, i % 2 ? -62 : 34)).join('')}${[-55, -110, -165, -220].map((v, i) => use(`${p}leafShape`, -33 - i * 7, v, .65 - i * .08, 110)).join('')}</g>`;
  }
  function floatingLetter(p) {
    return `<g class="tx-reveal"><rect x="313" y="163" width="274" height="321" rx="6" fill="url(#${p}paper)" stroke="#cfb995" stroke-width="1.5"/><rect x="325" y="175" width="250" height="297" rx="2" fill="none" stroke="#c8b18d" stroke-opacity=".55"/><path d="M420 233h60M395 346h110M377 366h146M398 386h104M417 416h66" stroke="#af8a85" stroke-opacity=".6" stroke-width="2"/><text x="450" y="309" text-anchor="middle" font-family="Lora,Georgia,serif" font-size="57" fill="#906071">20.10</text>${use(`${p}star`, 450, 211, 1.05)}</g>`;
  }
  function art(id, mode = 'stage') {
    if (GiftScenes.has(id)) return GiftScenes.art(id,mode);
    const t = catalog[id];
    const p = `tx${++serial}-`;
    const back = mode === 'backdrop';
    let shape = '';
    let environment = '';
    if (['galaxy', 'lovegalaxy', 'aurora', 'moonlake'].includes(id)) environment += `<ellipse class="tx-nebula" cx="430" cy="265" rx="470" ry="290" fill="url(#${p}glow)" opacity=".35"/>${starfield(p, mode === 'thumb' ? 24 : lowPower ? 35 : 61)}`;
    if (id === 'galaxy') {
      environment += `<g class="tx-galaxy-dust" transform="translate(450 320) rotate(-28)"><ellipse rx="320" ry="125" fill="url(#${p}glow)" opacity=".7"/><ellipse rx="284" ry="87" fill="none" stroke="#c9bff3" stroke-opacity=".35"/><ellipse rx="320" ry="105" fill="none" stroke="#af94e2" stroke-opacity=".15"/></g><circle cx="720" cy="116" r="36" fill="url(#${p}foil)" opacity=".7"/><ellipse cx="720" cy="116" rx="59" ry="12" fill="none" stroke="#c6a3df" transform="rotate(-26 720 116)"/>`;
      shape = `<g class="tx-centerpiece tx-space-core"><circle cx="450" cy="317" r="117" fill="#1e1c43" stroke="url(#${p}foil)"/><circle cx="450" cy="317" r="101" fill="url(#${p}glow)" opacity=".7"/><g class="tx-orbit"><ellipse cx="450" cy="317" rx="185" ry="60" fill="none" stroke="url(#${p}foil)" transform="rotate(-32 450 317)"/><circle cx="607" cy="222" r="8" fill="#fff2cf"/></g>${use(`${p}star`, 450, 317, 4.1)}</g>`;
    } else if (id === 'aurora') {
      environment += `<g class="tx-aurora-bands"><path d="M-40 10Q190 230 390 100T950 55V350Q720 245 490 315T-40 260Z" fill="url(#${p}aurora)"/><path d="M-60 60Q210 300 430 145T960 160V430Q620 330 390 385T-60 340Z" fill="url(#${p}aurora)" opacity=".65"/></g><path d="M0 530 95 420 151 461 243 373 332 482 438 411 558 506 675 432 795 492 900 425V620H0Z" fill="#143942"/>`;
      shape = `<g class="tx-centerpiece"><ellipse cx="450" cy="328" rx="124" ry="157" fill="#e6fff8" fill-opacity=".08" stroke="#b0f7d6" stroke-opacity=".7"/><path d="M450 194V456M340 328H560" stroke="#b6f6da" stroke-opacity=".3"/>${use(`${p}star`, 450, 324, 4.8)}</g>`;
    } else if (['garden', 'rose', 'butterfly'].includes(id)) {
      environment += `<ellipse cx="450" cy="585" rx="430" ry="105" fill="${id === 'rose' ? '#e9cdd0' : '#b7d3bc'}" opacity=".4"/><ellipse cx="450" cy="255" rx="280" ry="240" fill="url(#${p}glow)" opacity=".18"/><g class="tx-fireflies">${Array.from({ length: 12 }, (_, i) => `<circle class="tx-star" style="--delay:-${i}s;--duration:${5 + i % 3}s" cx="${65 + i * 67}" cy="${120 + (i * 97) % 360}" r="2.6" fill="#fffbe0"/>`).join('')}</g>`;
      const blooms = id === 'rose' ? 'rose' : 'flower';
      shape = `<g class="tx-curtain tx-curtain-left">${branch(p, 350, 560, 1.5)}${use(`${p}${blooms}`, 232, 263, 1.15, -25)}${use(`${p}${blooms}`, 184, 420, .82, 12)}${use(`${p}${blooms}`, 335, 168, .9, 34)}</g><g class="tx-curtain tx-curtain-right">${branch(p, 550, 560, 1.5, true)}${use(`${p}${blooms}`, 668, 263, 1.22, 29)}${use(`${p}${blooms}`, 718, 420, .85, 9)}${use(`${p}${blooms}`, 565, 168, .95, -10)}</g>`;
      if (id === 'rose') shape += `<g class="tx-centerpiece">${use(`${p}rose`, 450, 335, 2.45)}</g>`;
      if (id === 'garden') shape += `<g class="tx-centerpiece">${use(`${p}flower`, 450, 355, 1.8)}${branch(p, 450, 530, .6)}</g>`;
      if (id === 'butterfly') shape += `<g class="tx-centerpiece tx-butterfly-center">${use(`${p}butterfly`, 450, 285, 1.7, -13)}</g><g class="tx-flying">${use(`${p}butterfly`, 294, 181, .6, 24)}</g><g class="tx-flying tx-flying-two">${use(`${p}butterfly`, 643, 365, .5, -28)}</g>`;
    } else if (id === 'sunflower') {
      environment += `<circle class="tx-sun" cx="450" cy="200" r="130" fill="url(#${p}glow)"/><g fill="#ead5a6" opacity=".25"><path d="M423 175 140 620H420Z"/><path d="M470 175 500 620H800Z"/></g>`;
      shape = `<g class="tx-window-frame"><rect x="268" y="102" width="364" height="398" rx="168" fill="#fff8e4" stroke="#cbb68c" stroke-width="7"/><path d="M450 104V498M270 297H630" stroke="#cbb68c" stroke-width="7"/></g><g class="tx-curtain tx-curtain-left"><path d="M266 105Q250 297 271 497H445V105Z" fill="#e1c78b"/><path d="M290 125V475M324 125V475M360 125V475M397 125V475" stroke="#f8edcc" stroke-opacity=".55" stroke-width="5"/></g><g class="tx-curtain tx-curtain-right"><path d="M634 105Q650 297 629 497H455V105Z" fill="#e1c78b"/><path d="M610 125V475M576 125V475M540 125V475M503 125V475" stroke="#f8edcc" stroke-opacity=".55" stroke-width="5"/></g><g class="tx-flower-border">${branch(p, 256, 592, .8)}${branch(p, 650, 592, .8, true)}${[195, 276, 622, 712].map((x, i) => use(`${p}flower`, x, 480 + i % 2 * 49, .8 + i % 2 * .25)).join('')}</g>`;
    } else if (id === 'lotus') {
      environment += `<ellipse cx="450" cy="484" rx="386" ry="116" fill="#a9ccbe" opacity=".26"/><g class="tx-water" fill="none" stroke="#90bab0" opacity=".55"><ellipse cx="450" cy="478" rx="220" ry="42"/><ellipse cx="450" cy="478" rx="285" ry="66"/><ellipse cx="450" cy="478" rx="351" ry="91"/></g><path d="M125 490Q171 417 262 459Q191 532 125 490M622 507Q671 432 774 475Q694 547 622 507" fill="#91b3a0" opacity=".55"/>`;
      shape = `<g class="tx-centerpiece tx-lotus"><path d="M450 451Q322 378 450 172Q578 378 450 451" fill="url(#${p}petal)" stroke="#fff6ef"/><g class="tx-lotus-left"><path d="M450 458Q284 440 279 250Q434 289 450 458" fill="url(#${p}petal)" stroke="#fff6ef"/><path d="M450 466Q252 512 214 356Q375 344 450 466" fill="url(#${p}petal)" stroke="#fff6ef"/></g><g class="tx-lotus-right"><path d="M450 458Q616 440 621 250Q466 289 450 458" fill="url(#${p}petal)" stroke="#fff6ef"/><path d="M450 466Q648 512 686 356Q525 344 450 466" fill="url(#${p}petal)" stroke="#fff6ef"/></g><ellipse cx="450" cy="448" rx="52" ry="15" fill="#d8bd7c"/></g>`;
    } else if (id === 'moonlake') {
      environment += `<circle cx="450" cy="187" r="116" fill="url(#${p}glow)"/><circle class="tx-moon" cx="450" cy="187" r="65" fill="#e8f0e9"/><circle cx="433" cy="167" r="21" fill="#c6d6d7" opacity=".2"/><path d="M0 388Q120 331 228 380T449 384T686 374T900 388V620H0Z" fill="#193b4d"/><g class="tx-water" fill="none" stroke="#b7cedb" stroke-opacity=".33">${Array.from({ length: 12 }, (_, i) => `<path d="M${400 - i * 15} ${405 + i * 15}q${60 + i * 8}-8 ${100 + i * 28} 0"/>`).join('')}</g>`;
      shape = `<g class="tx-centerpiece"><path d="M296 377 450 351 604 377 570 470H330Z" fill="#718493" stroke="#b6ccd9"/><path d="M296 377 450 427 604 377M450 427V351" fill="none" stroke="#dde6e3" stroke-opacity=".55"/></g>`;
    } else if (id === 'letter') {
      environment += `<g opacity=".35">${branch(p, 224, 520, 1.1)}${use(`${p}flower`, 156, 285, .8, -15)}${use(`${p}flower`, 187, 207, .5, 13)}</g><path d="M664 180Q600 334 689 447" fill="none" stroke="#a79476" stroke-width="2"/><path d="M689 447Q577 373 653 228Q740 281 689 447" fill="#c6b393" opacity=".45"/>`;
      shape = `<g class="tx-centerpiece tx-envelope"><rect x="263" y="278" width="374" height="244" rx="6" fill="#ddc7a9" stroke="#bca080"/><path d="M263 278 450 438 637 278" fill="#efddc3" stroke="#bc9c78"/><path d="M263 522 420 394Q450 374 480 394L637 522" fill="#ead6b9" stroke="#c7ac89"/><g class="tx-wax"><circle cx="450" cy="418" r="38" fill="#ac5e6f" stroke="#d5979c" stroke-width="6"/>${use(`${p}flower`, 450, 418, .39)}</g></g>`;
    } else if (id === 'pearl') {
      environment += `<g class="tx-silk" fill="none" stroke="#fff" stroke-width="38" opacity=".7"><path d="M-40 190Q300 95 538 360T940 490"/><path d="M-30 550Q308 263 580 430T940 170"/></g>${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((v) => `<circle class="tx-pearl" cx="${160 + (v * 109) % 610}" cy="${105 + (v * 93) % 430}" r="${12 + v % 3 * 8}" fill="url(#${p}pearl)"/>`).join('')}`;
      shape = `<g class="tx-centerpiece tx-layers"><rect class="tx-layer tx-layer-back" x="302" y="150" width="296" height="350" rx="140" fill="#e7dfdc" stroke="#c9b48b" transform="rotate(-10 450 325)"/><rect class="tx-layer tx-layer-front" x="302" y="150" width="296" height="350" rx="140" fill="url(#${p}pearl)" stroke="#fff"/><ellipse cx="450" cy="325" rx="111" ry="145" fill="none" stroke="url(#${p}foil)" stroke-width="2"/>${use(`${p}star`, 450, 321, 3)}</g>`;
    } else if (id === 'crystal') {
      environment += `<ellipse cx="450" cy="365" rx="300" ry="210" fill="url(#${p}glow)" opacity=".4"/>${starfield(p, 22)}`;
      shape = `<g class="tx-centerpiece tx-crystal"><g transform="translate(450 385) scale(2.4)"><path d="${heart}" fill="url(#${p}petal)" stroke="#fff4ff" stroke-width=".8"/><path d="M0 18-29-38-49-78M0 18 29-38 49-78M-68-49-29-38 0-62 29-38 68-49M-29-38 0 18 29-38M0-62V18" fill="none" stroke="#fff3ff" stroke-opacity=".7" stroke-width=".8"/><path d="M-49-78-29-38 0-62Z" fill="#fff" fill-opacity=".25"/><path d="M29-38 0 18 68-49Z" fill="#977bc1" fill-opacity=".2"/></g>${use(`${p}star`, 310, 255, 1.5)}${use(`${p}star`, 574, 329, 1.1)}</g>`;
    } else if (id === 'lovegalaxy') {
      environment += `<ellipse cx="450" cy="330" rx="300" ry="210" fill="url(#${p}glow)" opacity=".33"/><g class="tx-orbit tx-orbit-one"><ellipse cx="450" cy="315" rx="255" ry="125" fill="none" stroke="#d9b0e1" stroke-opacity=".6" transform="rotate(-33 450 315)"/><circle cx="237" cy="420" r="8" fill="#ffe1d9"/></g><g class="tx-orbit tx-orbit-two"><ellipse cx="450" cy="315" rx="255" ry="125" fill="none" stroke="#ffb8cd" stroke-opacity=".6" transform="rotate(33 450 315)"/><circle cx="663" cy="420" r="8" fill="#fff0d9"/></g>`;
      shape = `<g class="tx-centerpiece tx-heart-constellation" transform="translate(450 365) scale(2.15)"><path d="${heart}" fill="#b75b95" fill-opacity=".12" stroke="url(#${p}foil)" stroke-width="1.4" stroke-dasharray="2 4"/><path d="M-47-74-57-38 0 18 52-29 47-74 0-62Z" fill="none" stroke="#e3b8e7" stroke-opacity=".4"/>${[[-47, -74], [-57, -38], [0, 18], [52, -29], [47, -74], [0, -62]].map(([x, y]) => use(`${p}star`, x, y, .65)).join('')}</g>`;
    }
    const includeLetter = !back;
    return `<svg class="tx-art tx-art-${mode}" viewBox="0 0 900 620" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">${definitions(p, t)}${environment}${includeLetter ? floatingLetter(p) : ''}<g class="tx-object">${shape}</g></svg>`;
  }
  function renderGallery() {
    if (!refs.gallery) return;
    refs.gallery.classList.add('theme-gallery');
    const entries=Object.entries(catalog).sort(([,a],[,b])=>Number(Boolean(b.fresh))-Number(Boolean(a.fresh)));
    refs.gallery.innerHTML = entries.map(([id,t]) => {
      const artwork=GiftScenes.has(id)?`<span class="gift-scene gift-motion-off" data-phase="ready">${art(id,'thumb')}</span>`:art(id,'thumb');
      return `<div class="theme-entry" data-entry-id="${id}"><button type="button" class="theme-tile" data-theme-preset="${id}" aria-pressed="false"><span class="theme-thumbnail" data-experience="${id}" style="--tx-bg:${t.background};--tx-color:${t.color}">${artwork}<span class="theme-check" aria-hidden="true">✓</span></span><span class="theme-tile-name">${t.name}${t.fresh?'<small class="theme-new">Mới</small>':''}</span><span class="theme-tile-description">${t.description}</span></button><button type="button" class="gift-preview-button" data-preview-theme="${id}" aria-label="Xem cảnh mở ${t.name}">Xem cảnh mở</button></div>`;
    }).join('');
  }
  function stopBurst() {
    clearTimeout(burstTimer);
    burstTimer = 0;
    if (refs.backdrop) { const node = refs.backdrop.querySelector('.tx-interaction-layer'); if (node) node.replaceChildren(); }
  }
  function motionState() {
    const paused = document.hidden || (screen !== 'letter' && screen !== 'envelope');
    [refs.stage, refs.backdrop].forEach(node => { if (node) { node.classList.toggle('tx-paused', paused); node.classList.toggle('tx-motion-off', reduced.matches || design.intensity === 'off'); } });
  }
  function apply(next) {
    design = next || {};
    const id = Object.hasOwn(catalog, design.experience) ? design.experience : 'sunflower';
    if (GiftScenes.has(id)) { current=id;GiftScenes.applyMain(refs,design);motionState();return; }
    GiftScenes.clearMain();
    if (document.getElementById('gift-freeze')) document.getElementById('gift-freeze').hidden=true;
    const changed = id !== current || !refs.stage?.querySelector('#open-theme-card');
    current = id;
    const theme = catalog[id];
    if (changed) {
      stopBurst();
      if (refs.stage) refs.stage.innerHTML = `<button type="button" id="open-theme-card" class="theme-open-object" aria-label="Mở thiệp ${theme.name}">${art(id)}<span class="tx-object-caption">Chạm để mở món quà</span></button><p class="theme-invitation">${theme.invitation}</p>`;
      if (refs.backdrop) refs.backdrop.innerHTML = `<div class="tx-reading-stars" aria-hidden="true">${['galaxy', 'lovegalaxy', 'aurora', 'moonlake'].includes(id) ? art(id, 'backdrop') : ''}</div><div class="tx-footer-art" aria-hidden="true">${art(id, 'backdrop')}</div><div class="tx-interaction-layer" aria-hidden="true"></div><button type="button" class="tx-interact" aria-label="${theme.interaction}"><span class="tx-interact-icon" aria-hidden="true">${id === 'letter' ? '✧' : '✦'}</span>${theme.interaction}</button><p class="tx-touch-note" aria-live="polite"></p>`;
    }
    document.querySelectorAll('.paper .paper-heading').forEach(heading => {
      let mark = heading.querySelector('.tx-paper-mark');
      if (!design.experience) { if (mark) mark.remove(); return; }
      if (mark && mark.dataset.experience === id) return;
      if (!mark) { mark = document.createElement('span'); mark.className = 'tx-paper-mark'; mark.setAttribute('aria-hidden','true'); heading.prepend(mark); }
      mark.classList.remove('gift-scene','gift-motion-off');mark.removeAttribute('data-phase');
      mark.dataset.experience = id; mark.innerHTML = art(id,'backdrop');
    });
    for (const node of [refs.stage, refs.backdrop]) if (node) {
      node.dataset.experience = id;
      node.dataset.opening = theme.compatibleOpenings.includes(design.scene) ? design.scene : theme.opening;
      node.dataset.intensity = design.intensity || 'cinematic';
      node.style.setProperty('--tx-bg', theme.background);
      node.style.setProperty('--tx-color', theme.color);
      node.classList.toggle('tx-low-power', !!lowPower);
    }
    if (refs.backdrop?.closest('#letter-screen')) {
      refs.backdrop.closest('#letter-screen').classList.add('has-theme-experience');
      refs.backdrop.closest('#letter-screen').dataset.experience = id;
    }
    refs.gallery?.querySelectorAll('[data-theme-preset]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themePreset === id)));
    motionState();
  }
  function interact(event) {
    if (!event.target.closest('.tx-interact') || !refs.backdrop) return;
    stopBurst();
    const layer = refs.backdrop.querySelector('.tx-interaction-layer');
    const button = refs.backdrop.querySelector('.tx-interact');
    const bounds = refs.backdrop.getBoundingClientRect();
    const target = button.getBoundingClientRect();
    const centerX = target.left - bounds.left + target.width / 2;
    const centerY = target.top - bounds.top - 55;
    const count = reduced.matches || design.intensity === 'off' ? 1 : design.intensity === 'gentle' ? 5 : 9;
    const kind = current === 'lotus' || current === 'moonlake' ? 'ripple' : current === 'garden' ? 'bloom' : current === 'rose' ? 'petal' : current === 'butterfly' ? 'butterfly' : current === 'crystal' || current === 'lovegalaxy' ? 'heart' : current === 'letter' ? 'note' : 'star';
    if (kind === 'note') {
      const note = refs.backdrop.querySelector('.tx-touch-note');
      note.textContent = design.secret || 'Une petite pensée pour vous.';
      if (!design.secret) note.textContent = 'Những lời chân thành luôn xứng đáng được giữ gìn.';
      note.classList.toggle('is-visible');
      return;
    }
    const glyphs = { star: '<path d="m24 2 5 16 17 6-17 5-5 17-6-17L2 24l16-6Z"/>', heart: '<path d="M24 43C-9 20 8-5 24 12 40-5 57 20 24 43Z"/>', petal: '<path d="M5 42C-2 9 24-6 43 5 49 27 31 48 5 42Z"/>', bloom: '<path d="M24 24C0 19 2-3 17 7L24 24C11 0 36-5 34 11L24 24C42 3 57 27 38 29L24 24C47 36 31 55 25 37L24 24C14 48-5 33 11 27Z"/><circle cx="24" cy="24" r="5" fill="#f4df9f"/>', butterfly: '<path d="M24 24C-8-7-4 35 18 26 0 49 23 49 24 24M24 24C56-7 52 35 30 26 48 49 25 49 24 24"/><path d="M24 14v23" stroke="currentColor" stroke-width="2"/>', ripple: '<ellipse cx="24" cy="24" rx="22" ry="11" fill="none" stroke="currentColor" stroke-width="1.5"/>' };
    for (let i = 0; i < count; i++) {
      const spark = document.createElement('span');
      spark.className = `tx-touch-particle tx-touch-${kind}`;
      spark.style.cssText = `left:${centerX}px;top:${centerY}px;--dx:${Math.cos(i / count * Math.PI * 2) * (60 + i * 5)}px;--dy:${Math.sin(i / count * Math.PI * 2) * 65 - 45}px;--rotation:${i * 47}deg;--delay:${i * .045}s`;
      spark.innerHTML = `<svg viewBox="0 0 48 48" aria-hidden="true">${glyphs[kind]}</svg>`;
      layer.append(spark);
    }
    if (current === 'galaxy') {
      const line = document.createElement('span'); line.className = 'tx-small-constellation'; line.style.cssText = `left:${centerX}px;top:${centerY}px`; line.innerHTML = '<svg viewBox="0 0 240 120"><path d="M20 85 65 25 120 65 172 18 218 81" fill="none" stroke="currentColor" stroke-width="1"/><g fill="currentColor"><circle cx="20" cy="85" r="3"/><circle cx="65" cy="25" r="3"/><circle cx="120" cy="65" r="3"/><circle cx="172" cy="18" r="3"/><circle cx="218" cy="81" r="3"/></g></svg>'; layer.append(line);
    }
    burstTimer = setTimeout(stopBurst, 3100);
  }
  function effectGlyph(effect){
    const extra={hearts:'<path d="M24 43C-9 20 8-5 24 12 40-5 57 20 24 43Z"/>',fireflies:'<circle cx="24" cy="24" r="7"/><circle cx="24" cy="24" r="17" opacity=".2"/>',bubbles:'<circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M13 22q0-10 10-11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'};
    if(extra[effect])return extra[effect];
    return effect==='butterflies' ? '<path d="M24 24C-8-7-4 35 18 26 0 49 23 49 24 24M24 24C56-7 52 35 30 26 48 49 25 49 24 24"/>' : effect==='petals' ? '<path d="M5 42C-2 9 24-6 43 5 49 27 31 48 5 42Z"/>' : '<path d="m24 2 5 16 17 6-17 5-5 17-6-17L2 24l16-6Z"/>';
  }
  function celebrate(effect) {
    if (!refs.backdrop || reduced.matches || design.intensity === 'off' || effect === 'none') return;
    stopBurst();
    const layer=refs.backdrop.querySelector('.tx-interaction-layer');
    if (!layer) return;
    const glyph=effectGlyph(effect);
    const count=design.intensity==='gentle'||lowPower?4:8;
    for(let i=0;i<count;i++){
      const particle=document.createElement('span');particle.className='tx-touch-particle tx-welcome-particle';
      particle.style.cssText=`left:${i%2?96:4}%;top:${22+i%4*16}%;--dx:${i%2?-15:15}px;--dy:-70px;--rotation:${i*47}deg;--delay:${i*.12}s`;
      particle.innerHTML=`<svg viewBox="0 0 48 48" aria-hidden="true">${glyph}</svg>`;layer.append(particle);
    }
    burstTimer=setTimeout(stopBurst,3900);
  }
  function pointer(event) {
    if (current !== 'aurora' || reduced.matches || design.intensity === 'off') return;
    const bounds = refs.stage.getBoundingClientRect();
    refs.stage.style.setProperty('--pointer-x', `${((event.clientX - bounds.left) / bounds.width - .5) * 22}px`);
  }
  function mount(containers) {
    refs.backdrop?.removeEventListener('click', interact);
    refs.stage?.removeEventListener('pointermove', pointer);
    stopBurst();
    refs = containers || {};
    renderGallery();
    if (refs.stage) { refs.stage.classList.add('theme-stage'); refs.stage.addEventListener('pointermove', pointer, { passive: true }); }
    if (refs.backdrop) { refs.backdrop.classList.add('theme-backdrop'); refs.backdrop.addEventListener('click', interact); }
    apply(design);
  }
  function open() {
    if (GiftScenes.has(design.experience)) return GiftScenes.open();
    reset();
    refs.stage?.classList.add('is-opening');
    return reduced.matches || design.intensity === 'off' ? 0 : design.intensity === 'gentle' ? 2000 : 2800;
  }
  function reset() { GiftScenes.reset();refs.stage?.classList.remove('is-opening'); stopBurst(); }
  function setScreen(value) { screen = String(value || '').replace(/-screen$/, ''); reset(); motionState();GiftScenes.setScreen(screen); }
  function destroy() {
    reset(); refs.backdrop?.removeEventListener('click', interact); refs.stage?.removeEventListener('pointermove', pointer);
    for (const node of [refs.stage, refs.backdrop]) if (node) { node.replaceChildren(); node.classList.add('tx-paused'); }
    refs = {};
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopBurst(); motionState(); });
  reduced.addEventListener('change', motionState);
  window.CardThemes = Object.freeze({ catalog, defaults, openingNames, mount, apply, open, reset, setScreen, celebrate, destroy, renderArt:art, effectGlyph });
})();
