/* Original vector gift scenes. All drawing is local, deterministic and shared by previews and recipients. */
(() => {
  'use strict';
  const NS = window.GiftArtParts = window.GiftArtParts || {};
  const esc = value => String(value || 'gift').replace(/[^a-zA-Z0-9_-]/g, '');
  function defs(p, colors) {
    return `<defs>
      <linearGradient id="${p}-bg" x2="0" y2="1"><stop stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient>
      <radialGradient id="${p}-bloom"><stop stop-color="#fff8ef"/><stop offset=".42" stop-color="${colors[2]}"/><stop offset="1" stop-color="${colors[3]}"/></radialGradient>
      <radialGradient id="${p}-rose"><stop stop-color="#ffeddb"/><stop offset=".35" stop-color="#f2b8cd"/><stop offset="1" stop-color="#a75585"/></radialGradient>
      <linearGradient id="${p}-leaf" x2="1" y2="1"><stop stop-color="#b3d7a2"/><stop offset=".5" stop-color="#6b9f8c"/><stop offset="1" stop-color="#315f66"/></linearGradient>
      <linearGradient id="${p}-gold" x2="1" y2="1"><stop stop-color="#fff6cf"/><stop offset=".45" stop-color="#d4ae6b"/><stop offset=".72" stop-color="#f8df9e"/><stop offset="1" stop-color="#a77c56"/></linearGradient>
      <linearGradient id="${p}-silk" x2="0" y2="1"><stop stop-color="#f7d3bd"/><stop offset=".38" stop-color="#fff8ec"/><stop offset=".63" stop-color="#d9ab9a"/><stop offset="1" stop-color="#f7dece"/></linearGradient>
      <linearGradient id="${p}-water" x2="0" y2="1"><stop stop-color="#a4f4ed" stop-opacity=".45"/><stop offset="1" stop-color="#57dce5" stop-opacity="0"/></linearGradient>
      <radialGradient id="${p}-pearl" cx=".35" cy=".3"><stop stop-color="#fffefb"/><stop offset=".25" stop-color="#e8fff8"/><stop offset=".65" stop-color="#a9cbdc"/><stop offset="1" stop-color="#776aab"/></radialGradient>
      <linearGradient id="${p}-shell" x2="0" y2="1"><stop stop-color="#eddde8"/><stop offset=".45" stop-color="#b7a1cd"/><stop offset="1" stop-color="#6e6a9d"/></linearGradient>
      <radialGradient id="${p}-halo"><stop stop-color="${colors[2]}" stop-opacity=".44"/><stop offset="1" stop-color="${colors[2]}" stop-opacity="0"/></radialGradient>
      <filter id="${p}-shadow" x="-40%" y="-50%" width="180%" height="220%"><feDropShadow dx="0" dy="12" stdDeviation="13" flood-color="#102d45" flood-opacity=".22"/></filter>
      <filter id="${p}-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3"/></filter>
    </defs>`;
  }
  const leaves = (p, x, y, scale=1, angle=0) => `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})"><path d="M0 43Q-43 34-39 3Q-8 0 0 43M0 43Q13 6 42 10Q39 39 0 43" fill="url(#${p}-leaf)" stroke="#417a70" stroke-width="1"/><path d="M-33 9L0 43 35 16M0 43V65" fill="none" stroke="#d0e0b8" stroke-width="1.4"/></g>`;
  function flower(p,x,y,s=1,rot=0,kind='daisy',delay=0) {
    let petals='';
    if(kind==='rose') {
      for(let i=0;i<10;i++) petals+=`<ellipse cx="0" cy="-14" rx="16" ry="23" transform="rotate(${i*36})" fill="url(#${p}-rose)" stroke="#f8c8d9" stroke-width=".7"/>`;
      petals+=`<path d="M-13-5C-21-25 9-26 14-10S-8 15-10 0 8-16 9-3-3 7-3-1" fill="#efb1c9" stroke="#ae648b" stroke-width="2"/><path d="M-4-4Q6-12 8-2T-3 6" fill="none" stroke="#fff1df" stroke-width="1.3"/>`;
    } else {
      const n=kind==='crystal'?6:9;
      for(let i=0;i<n;i++) petals+=kind==='crystal'?`<path d="M0 0Q-21-26 0-48Q21-26 0 0Z" transform="rotate(${i*360/n})" fill="#bdfffa" fill-opacity=".32" stroke="#dcfff5" stroke-width="1.4"/><path d="M0-4V-42" transform="rotate(${i*360/n})" stroke="#e7fffb" stroke-opacity=".55"/>`:`<ellipse cx="0" cy="-21" rx="12" ry="24" transform="rotate(${i*360/n})" fill="url(#${p}-bloom)" stroke="#ffefdf" stroke-width=".65"/>`;
      petals+=`<circle r="10" fill="url(#${p}-gold)"/>`;
      for(let i=0;i<12;i++) petals+=`<path d="M0-6V-10" transform="rotate(${i*30})" stroke="#9c7547" stroke-width="1"/><circle cx="${Math.cos(i)*5}" cy="${Math.sin(i)*5}" r="1.1" fill="#fcf2bd"/>`;
      petals+=`<circle r="3.3" fill="#fff3b0"/>`;
    }
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><g class="ga-flower" style="--ga-delay:${delay}ms">${petals}</g></g>`;
  }
  function sparks(p,count=32) {
    let out='';
    for(let i=0;i<count;i++) { const x=85+(i*137%735),y=60+(i*79%465),r=.9+(i%3)*.7; out+=`<circle class="ga-spark" style="--ga-i:${i};--ga-delay:${i*93}ms" cx="${x}" cy="${y}" r="${r}" fill="${i%3?'#ecfff5':'#f8deb5'}" opacity="${.22+(i%5)*.13}"/>`; }
    return out;
  }
  const envelope = (p,x,y,s=1) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="ga-note"><rect x="-52" y="-32" width="104" height="65" rx="5" fill="#fff7e9" stroke="#c6a779" stroke-width="2"/><path d="M-51-30L0 8 51-30M-50 31L-15 2M50 31L15 2" fill="none" stroke="#d2b58d" stroke-width="1.6"/><circle cy="4" r="10" fill="#c98691"/><path d="M-5 1Q-6-4-1-3L0-1 2-3Q7-5 6 1L0 7Z" fill="#ffe4d8"/></g></g>`;
  function bouquet(p,cls='ga-bouquet',x=450,y=390,s=1) {
    return `<g transform="translate(${x} ${y}) scale(${s})"><g class="${cls}">
    <path d="M-122-9Q-35 34 0 146Q24 43 125-13L70 132 0 174-71 131Z" fill="url(#${p}-silk)" stroke="#d1b6ab" stroke-width="1.5"/>
    ${[-72,-36,5,42,78].map((v,i)=>`<path d="M0 132Q${v*.7} 14 ${v} ${-55-i%2*30}" fill="none" stroke="#517b63" stroke-width="3"/>`).join('')}
    ${leaves(p,-90,-76,.8,-35)}${leaves(p,58,-72,.85,30)}${leaves(p,-35,-116,.65,-12)}${leaves(p,91,-22,.65,58)}
    ${flower(p,-75,-59,.78,-12,'daisy',2600)}${flower(p,70,-51,.84,22,'daisy',2700)}${flower(p,-24,-104,.9,-8,'rose',2400)}${flower(p,38,-94,.84,17,'rose',2500)}${flower(p,0,-47,1.02,0,'rose',2800)}${flower(p,-42,-17,.64,14,'daisy',2900)}${flower(p,43,-8,.65,-15,'daisy',3000)}
    <path d="M-65 50L0 157 66 50 22 168H-22Z" fill="url(#${p}-silk)" stroke="#dfc7b4"/>
    <path d="M-24 106Q-86 65-76 105T-7 118Q75 59 76 103T14 120" fill="none" stroke="url(#${p}-gold)" stroke-width="13"/><path d="M0 117L-35 159M3 117L33 155" stroke="url(#${p}-gold)" stroke-width="12"/>
    </g></g>`;
  }
  function svg(p,id,mode,colors,content) {
    return `<svg class="ga-art ga-${id} ga-mode-${mode}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 620" role="presentation" aria-hidden="true">${defs(p,colors)}<rect width="900" height="620" fill="url(#${p}-bg)"/><ellipse cx="450" cy="315" rx="330" ry="290" fill="url(#${p}-halo)"/>${content}</svg>`;
  }
  function umbrella(prefix,mode='stage') {
    const p=esc(prefix)+'-u';
    let rain='';
    [[300,211],[370,170],[450,154],[528,170],[600,211]].forEach(([x,y],i)=>{
      rain+=`<g transform="translate(${x} ${y})"><g class="ga-rain-impact" style="--ga-delay:${850+i*190}ms"><path class="ga-raindrop" d="M0-17C-4-8-8-3-8 1A8 8 0 0 0 8 1C8-3 4-8 0-17Z" fill="#b8eaff"/><ellipse class="ga-contact-glow" rx="16" ry="7" fill="#ecf4ff" filter="url(#${p}-glow)"/><path class="ga-rain-petal" d="M0-13C-27-26-29 9-6 13C18 16 22-15 0-13Z" fill="#f6b5d8" stroke="#ffedfb" stroke-width="1.1"/></g></g>`;
    });
    return svg(p,'umbrella',mode,['#171e3e','#4b3f65','#f7d0e9','#aa81be'],`
      ${sparks(p,25)}<g class="ga-drizzle" stroke="#bdd9ef" stroke-opacity=".28" stroke-linecap="round">${[0,1,2,3,4,5,6,7,8,9].map(i=>`<path d="M${145+i*67} ${45+i%3*33}l-5 20" stroke-width="${i%2+1}"/>`).join('')}</g><path d="M450 166V450Q450 490 418 490T392 462" fill="none" stroke="url(#${p}-gold)" stroke-width="9" stroke-linecap="round"/>
      <g class="ga-umbrella-open"><path d="M236 270Q450 37 664 270Q614 239 573 272Q526 231 482 272Q442 234 399 272Q352 237 309 272Q269 246 236 270Z" fill="url(#${p}-rose)" stroke="#f4c6dd" stroke-width="2"/><path d="M450 150Q333 167 309 272M450 150Q398 198 399 272M450 150Q500 194 482 272M450 150Q566 174 573 272M450 150Q594 176 664 270" fill="none" stroke="#ffe3ec" stroke-width="1.5" opacity=".78"/><path d="M236 270Q450 37 664 270" fill="none" stroke="#ffe7f0" stroke-width="3"/><path d="M450 150V135" stroke="url(#${p}-gold)" stroke-width="5" stroke-linecap="round"/></g>
      <g class="ga-umbrella-closed"><path d="M450 145L416 353 451 380 481 353Z" fill="url(#${p}-rose)" stroke="#ffe1e8" stroke-width="2"/><path d="M450 151V368M450 160L431 353M450 160L468 353" stroke="#f0bbd9" stroke-width="1.7"/><path d="M420 327L477 334" stroke="url(#${p}-gold)" stroke-width="8"/></g>
      ${rain}${bouquet(p,'ga-bouquet',450,394,.85)}
      <g class="ga-umbrella-tag"><path d="M454 351Q516 335 548 389" fill="none" stroke="#e8cb9c" stroke-width="2"/><g transform="translate(554 416) rotate(-9)"><rect x="-64" y="-28" width="128" height="56" rx="6" fill="#fff4de" stroke="#d7b380"/><path d="M-37-8H38M-37 1H24M-37 10H34" stroke="#ae8a77" stroke-width="2"/><circle cx="-53" cy="-16" r="3" fill="#a78169"/></g></g>`);
  }
  function storybook(prefix,mode='stage') {
    const p=esc(prefix)+'-b';
    const trees=`<g class="ga-popup-trees"><path d="M289 411L273 190 286 173 301 417M613 418L620 180 632 194 627 421" fill="#947c66" stroke="#745e53" stroke-width="2"/><path d="M284 291L240 233M288 255L335 201M624 292L675 228M625 247L580 198" stroke="#8e7961" stroke-width="8" stroke-linecap="round"/>${leaves(p,245,210,1.2,-60)}${leaves(p,286,161,1.1,0)}${leaves(p,318,205,1,-10)}${leaves(p,589,186,1.2,-35)}${leaves(p,633,171,1,20)}${leaves(p,660,224,1.2,50)}${flower(p,254,204,.72,0,'rose',1400)}${flower(p,316,191,.66,10,'daisy',1600)}${flower(p,618,173,.7,0,'rose',1600)}${flower(p,663,235,.65,-10,'daisy',1750)}<path d="M266 415L293 400 307 424M605 423L626 403 644 418" fill="#dce7bc" stroke="#a8b797"/></g>`;
    return svg(p,'storybook',mode,['#f0ded0','#e9e2d5','#f9dba9','#e9ae81'],`
      <ellipse cx="450" cy="490" rx="307" ry="36" fill="#8c6b5c" opacity=".16"/>
      <g class="ga-book-open" filter="url(#${p}-shadow)"><path d="M177 431L434 383 450 408 467 385 722 434 707 489 455 501 188 482Z" fill="#826a6b" stroke="#6b555f" stroke-width="3"/>
      <path d="M189 415Q304 355 450 414Q586 354 711 416L699 474Q575 423 450 486Q320 427 200 472Z" fill="#ddd1b8" stroke="#aa9b82" stroke-width="2"/>
      <path d="M195 407Q318 339 450 410Q589 341 705 409L697 458Q572 411 450 470Q329 411 203 458Z" fill="#fff8e6" stroke="#d5c9ae" stroke-width="2"/>
      <path d="M205 432Q334 390 450 456M205 445Q330 401 450 466M450 456Q572 389 696 434M450 466Q572 400 696 448" fill="none" stroke="#c6b69b" stroke-width="1.5"/><path d="M450 410V471" stroke="#ad9882" stroke-width="5"/>
      <path d="M222 410Q333 337 447 415Q586 331 680 409L664 421Q571 373 451 440Q332 375 238 423Z" fill="#b8cb9c" stroke="#879c79" stroke-width="1.6"/>
      <path class="ga-book-path" d="M450 444C407 417 517 405 464 374S418 340 451 320" fill="none" stroke="#f4deb0" stroke-width="21"/><path class="ga-path-light" d="M450 444C407 417 517 405 464 374S418 340 451 320" fill="none" stroke="#fff7c5" stroke-width="4" stroke-linecap="round"/>
      ${trees}
      <g class="ga-popup-garden">${leaves(p,341,338,.9,-35)}${leaves(p,545,338,.9,40)}${flower(p,336,342,.56,0,'daisy',1900)}${flower(p,371,363,.43,0,'rose',2000)}${flower(p,537,355,.55,0,'rose',2050)}${flower(p,569,365,.44,0,'daisy',2150)}${flower(p,258,391,.45,0,'daisy',2300)}${flower(p,636,394,.45,0,'rose',2350)}<path d="M347 409L341 376 358 387M548 406L547 376 560 387" stroke="#699775" stroke-width="3" fill="none"/></g>
      <g class="ga-book-letter">${envelope(p,450,321,.88)}<path d="M435 355L421 378 441 368M466 355L479 378 458 367" fill="#c6cf9a" stroke="#91a077"/></g></g>
      <g class="ga-book-closed" filter="url(#${p}-shadow)"><path d="M279 240L543 214 624 432 344 474 281 451Z" fill="#6e6f83" stroke="#555c70" stroke-width="3"/><path d="M287 236L548 207 610 419 344 457Z" fill="#698f86" stroke="#deca99" stroke-width="3"/><path d="M316 253L528 232 577 402 352 432Z" fill="none" stroke="#e7d7ad" stroke-width="2"/><path d="M287 239L344 457" stroke="#d9c59d" stroke-width="9"/>${flower(p,439,319,.8,-15,'rose')}<path d="M418 357L437 386 480 350" stroke="#d0c894" stroke-width="3" fill="none"/>${leaves(p,436,347,.55,-15)}</g>
      ${sparks(p,16)}`);
  }
  function island(prefix,mode='stage') {
    const p=esc(prefix)+'-i';
    const cloud=(x,y,s,cls)=>`<g class="${cls}" transform="translate(${x} ${y}) scale(${s})"><path d="M-111 20C-131-2-109-25-81-21C-89-65-23-76 0-38C31-72 83-54 84-19C122-30 146 17 112 29L-93 30Z" fill="#fff9e9" opacity=".82"/></g>`;
    return svg(p,'island',mode,['#83c8c7','#e5dfc2','#f4de92','#e2a365'],`
      <circle cx="698" cy="116" r="66" fill="#ffedb4" opacity=".7"/>${cloud(170,200,1,'ga-cloud-back')}${cloud(750,281,.8,'ga-cloud-back')}${cloud(475,117,.55,'ga-cloud-back')}
      <g class="ga-island-journey"><ellipse cx="450" cy="528" rx="151" ry="19" fill="#468b9a" opacity=".1"/>
      <g class="ga-island-body"><path d="M229 358Q449 300 671 359L617 422 556 447 512 503 468 481 432 525 400 461 341 446 286 403Z" fill="#9b8779" stroke="#766d69" stroke-width="2"/><path d="M229 358L432 525 400 461 341 446M671 359L512 503 525 415M468 481L451 379" fill="#6b7c79" opacity=".55"/><path d="M254 371L302 409 341 416 375 440 368 398 400 382M556 387L574 416 607 397" fill="none" stroke="#beb393" stroke-width="3"/>
      <ellipse cx="450" cy="357" rx="221" ry="62" fill="#7eaa7e" stroke="#5d8e78" stroke-width="3"/><ellipse cx="449" cy="344" rx="201" ry="45" fill="#acc895"/>
      <g class="ga-island-grass"><path d="M259 357l-9-22 18 8 8-25 8 27 17-17 3 20M569 364l11-30 11 13 13-30 9 34 20-16 0 22M357 341l-5-25 16 10 15-25 5 30" fill="#5a997c" stroke="#b7d398" stroke-width="2"/>
      ${leaves(p,294,335,.6,-45)}${leaves(p,574,335,.6,45)}${leaves(p,384,297,.6,-10)}</g>
      <g class="ga-island-tree"><path d="M459 352L447 197 463 181 477 353Z" fill="#937757" stroke="#775e49" stroke-width="2"/><path d="M458 277L412 225M463 249L508 203M458 224L429 178" fill="none" stroke="#927655" stroke-width="8" stroke-linecap="round"/>
      <path d="M361 217C338 175 366 128 407 134C410 92 478 77 501 120C549 112 586 158 552 195C580 238 514 270 483 243C443 284 409 254 409 243C385 258 355 246 361 217Z" fill="#8fb58c" stroke="#5d967e" stroke-width="2"/><path d="M386 184Q430 114 489 144M475 219Q521 192 540 159" stroke="#bad6a1" stroke-width="6" fill="none" stroke-linecap="round"/>
      ${flower(p,391,178,.6,0,'daisy',1900)}${flower(p,455,137,.7,0,'rose',1950)}${flower(p,518,171,.6,0,'daisy',2100)}${flower(p,451,214,.61,0,'rose',2250)}</g>
      <g class="ga-island-flowers">${flower(p,310,325,.6,12,'daisy',2600)}${flower(p,354,346,.55,0,'rose',2700)}${flower(p,553,330,.6,-10,'rose',2750)}${flower(p,595,348,.48,0,'daisy',2850)}${flower(p,408,352,.44,0,'daisy',2900)}</g>
      <g class="ga-island-ribbon"><path d="M215 348C311 283 312 432 459 400S607 301 687 355" fill="none" stroke="#c99291" stroke-width="23"/><path d="M215 342C311 277 312 426 459 394S607 295 687 349" fill="none" stroke="url(#${p}-silk)" stroke-width="20"/><path d="M215 342L184 325 191 355 221 365M686 350L715 328 710 365 681 369" fill="#f5d6bc" stroke="#d2ab94"/>
      ${envelope(p,451,395,.88)}</g></g></g>
      ${cloud(153,490,.9,'ga-cloud-front')}${cloud(766,480,1,'ga-cloud-front')}${sparks(p,18)}`);
  }
  function ocean(prefix,mode='stage') {
    const p=esc(prefix)+'-o';
    const crystals=[[-111,-7,.52,-23],[-64,-82,.68,-13],[0,-122,.8,0],[66,-78,.65,15],[111,-8,.5,25],[-36,-23,.58,-7],[40,-16,.55,10]].map(([x,y,s,r],i)=>`${flower(p,450+x,335+y,s,r,'crystal',1800+i*140)}`).join('');
    return svg(p,'ocean',mode,['#144d65','#102d50','#b7ffee','#659fd3'],`
      <g class="ga-water-rays"><path d="M220 0L282 0 557 523 401 523Z" fill="url(#${p}-water)"/><path d="M568 0L610 0 401 521 316 521Z" fill="url(#${p}-water)"/><path d="M365 0H398L477 470H424Z" fill="url(#${p}-water)"/></g>${sparks(p,44)}
      <ellipse cx="450" cy="478" rx="248" ry="51" fill="#4d9b9d" opacity=".14"/><path d="M0 556Q202 465 387 530T900 514V620H0Z" fill="#183f57"/><path d="M0 574Q231 511 459 565T900 539V620H0Z" fill="#12334b"/>
      <g fill="none" stroke="#79b9ae" stroke-width="5" opacity=".5"><path d="M170 562Q124 500 154 444M159 513L123 482M160 498L185 467M742 565Q775 506 745 448M752 511L784 478M751 496L724 472"/></g>
      <g class="ga-clam-lid" filter="url(#${p}-shadow)"><path d="M281 401C227 372 253 318 280 312C261 273 305 241 337 251C337 215 381 196 410 215C433 179 477 185 497 215C532 193 573 224 571 252C613 239 652 280 630 314C668 327 674 378 622 405Q451 455 281 401Z" fill="url(#${p}-shell)" stroke="#e6dceb" stroke-width="3"/><path d="M450 424Q321 347 280 312M450 424Q350 292 337 251M450 424Q395 273 410 215M450 424Q456 254 497 215M450 424Q521 282 571 252M450 424Q568 340 630 314" fill="none" stroke="#ede4ed" stroke-width="2" opacity=".7"/><path d="M289 394Q448 428 615 394" stroke="#f8e7ef" stroke-width="5" fill="none"/></g>
      <g class="ga-crystal-bouquet"><ellipse cx="450" cy="347" rx="154" ry="165" fill="url(#${p}-halo)"/><g stroke="#b7fff1" fill="none" stroke-width="2.6" opacity=".9"><path d="M450 424Q423 344 339 328M450 423Q432 297 386 253M450 423V214M450 423Q469 300 516 257M450 423Q490 350 561 327"/><path d="M406 333Q373 323 378 304Q405 307 406 333M487 327Q514 300 532 311Q513 336 487 327M441 288Q411 274 417 254Q443 258 441 288M458 292Q481 270 494 282Q480 301 458 292" fill="#a8f4e0" fill-opacity=".2"/></g>${crystals}</g>
      <g class="ga-pearl"><circle cx="450" cy="398" r="58" fill="#c0fff3" opacity=".24" filter="url(#${p}-glow)"/><circle cx="450" cy="398" r="37" fill="url(#${p}-pearl)" stroke="#e8fffa" stroke-width="2"/><ellipse cx="438" cy="385" rx="10" ry="7" fill="#fff" opacity=".8"/></g>
      <g class="ga-clam-base"><path d="M273 412Q450 379 628 413Q595 484 451 505Q305 483 273 412Z" fill="url(#${p}-shell)" stroke="#d4d7e8" stroke-width="3"/><path d="M284 419Q450 452 617 419" stroke="#f6e7ee" stroke-width="7" fill="none"/><path d="M450 500L450 447M400 491L413 446M349 474L376 441M501 491L488 446M553 474L525 441" stroke="#8f8fb4" stroke-width="2" opacity=".8"/></g>
      <g class="ga-ocean-invitation"><path d="M305 531Q450 509 595 531" fill="none" stroke="#b4f4ec" stroke-width="24" opacity=".24"/><path d="M315 529Q450 510 585 529" fill="none" stroke="#ecfff4" stroke-width="2"/>${envelope(p,450,531,.52)}</g>`);
  }
  Object.assign(NS, {
    umbrella:{meta:{name:'Mưa hóa hoa',description:'Chiếc ô nở giữa mưa sáng; từng giọt chạm ô hóa thành cánh hoa, kết một bó hoa dịu dàng.',palette:'midnight',structure:'arch',font:'serif',moods:['gentle','romantic','fantasy'],color:'#dcc2e5',background:'#252340',duration:4200},render:umbrella},
    storybook:{meta:{name:'Cuốn sách cổ tích',description:'Mở trang sách, dựng khu vườn giấy; một lối sáng dẫn đến phong thư giữa hoa.',palette:'champagne',structure:'letter',font:'serif',moods:['gentle','elegant','fantasy'],color:'#d4bc91',background:'#f0e4d5',duration:4200},render:storybook},
    island:{meta:{name:'Đảo hoa trên mây',description:'Hòn đảo bay đến giữa trời ngọc, cây vươn lên và dải lụa mang thư ghé lại.',palette:'sage',structure:'postcard',font:'serif',moods:['bright','gentle','fantasy'],color:'#90bfa8',background:'#a7d5cb',duration:4200},render:island},
    ocean:{meta:{name:'Ngọc trai đại dương',description:'Vỏ trai hé mở dưới biển sâu; ánh ngọc lan thành bó hoa pha lê trong suốt.',palette:'ocean',structure:'arch',font:'serif',moods:['romantic','elegant','fantasy'],color:'#95dfdc',background:'#153e59',duration:4200},render:ocean}
  });
})();
