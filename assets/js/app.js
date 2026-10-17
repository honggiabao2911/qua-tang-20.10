// 14. Tạo, thiết kế và chia sẻ thiệp.
(() => {
  'use strict';

  const CONFIG = Object.freeze({
    siteName: 'Gửi người phụ nữ tôi yêu thương',
    defaultSender: '',
    maxMessageLength: 1000,
    maxNameLength: 100,
    maxPronounLength: 30,
    maxCustomGreetingLength: 3000,
    maxDedicationLength: 100,
    maxFragmentLength: 60000,
    effects: Object.freeze({ openingMs: 2800, petalsDesktop: 14, petalsMobile: 7 })
  });

  const RECIPIENTS = Object.freeze({
    mom: { label: 'Mẹ', you: 'mẹ', pronoun: 'con', salutation: 'Mẹ thân yêu,', greetings: 'mom' },
    grandma: { label: 'Bà', you: 'bà', pronoun: 'cháu', salutation: 'Bà kính yêu,', greetings: 'grandma' },
    teacher: { label: 'Cô giáo', you: 'cô', pronoun: 'em', salutation: 'Cô kính mến,', greetings: 'teacher' },
    sister: {
      label: 'Chị / Em gái', defaultVariant: 'older', variantLabel: 'Bạn muốn gửi tới',
      variants: {
        older: { label: 'Chị gái', you: 'chị', pronoun: 'em', salutation: 'Chị thân mến,', greetings: 'sister_older' },
        younger: { label: 'Em gái', you: 'em', pronoun: 'anh', salutation: 'Em thân mến,', greetings: 'sister_younger' }
      }
    },
    lover: { label: 'Người thương', you: 'em', pronoun: 'anh', salutation: 'Em thương mến,', greetings: 'lover' },
    friend: { label: 'Bạn bè', you: 'bạn', pronoun: 'mình', salutation: 'Bạn thân mến,', greetings: 'friend' },
    women: {
      label: 'Những người phụ nữ', defaultVariant: 'group', variantLabel: 'Lời chúc này dành cho',
      variants: {
        friend: { label: 'Một người bạn nữ', you: 'bạn', pronoun: 'mình', salutation: 'Bạn thân mến,', greetings: 'friend' },
        one: { label: 'Một người phụ nữ', you: 'bạn', pronoun: 'tôi', salutation: 'Bạn thân mến,', greetings: 'women_one' },
        group: { label: 'Một nhóm phụ nữ', you: 'mọi người', pronoun: 'tôi', salutation: 'Mọi người thân mến,', greetings: 'women_group' }
      }
    }
  });

  const $ = (id) => document.getElementById(id);
  const screens = {
    home: $('home-screen'), editor: $('editor-screen'),
    envelope: $('envelope-screen'), letter: $('letter-screen')
  };
  const fields = {
    recipientName: $('recipient-name'), senderName: $('sender-name'),
    pronoun: $('sender-pronoun'), recipientPronoun: $('recipient-pronoun'), message: $('personal-message')
  };
  const recipientButtons = [...document.querySelectorAll('[data-recipient]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const variantMemory = { sister: 'older', women: 'friend' };
  CardThemes.mount({gallery: $('theme-gallery'), stage: $('theme-stage'), backdrop: $('theme-backdrop')});
  let state = makeDefaultState();
  let screen = 'home';
  let shared = false;
  let pronounEdited = false;
  let opening = false;
  let openingTimer = 0;
  let petalTimer = 0;
  let toastTimer = 0;
  BouquetArrival.mount($('bouquet-arrival'),{onOpen:openEnvelope});
  const hasArrival=()=>state.design.arrival!=='classic';
  let bebePhase='idle',arrivalEdited=false;
  const bebe=window.BebeWelcome?.mount($('bebe-welcome'),{onFlowers:presentBebeFlowers,onSkip:skipBebe});
  const hasBebe=()=>Boolean(bebe)&&state.design.welcome==='bebe'&&hasArrival();
  const flowersVisible=()=>arrivalActive()&&(!hasBebe()||bebePhase==='flowers');
  let arrivalPassed=false;
  const arrivalActive=()=>hasArrival()&&!arrivalPassed;

  const DESIGN_OPTIONS = Object.freeze({
    theme: ['rose', 'sage', 'champagne', 'midnight', 'teal', 'lilac'],
    font: ['serif', 'sans', 'italic', 'handwriting'], layout: ['classic', 'centered'],
    decoration: ['botanical', 'stars', 'minimal'], effect: ['petals', 'constellation', 'butterflies', 'none'],
    scene: ['bouquet', 'galaxy', 'envelope', 'stardust', 'aurora', 'bloom', 'rose', 'sunrise', 'lotus', 'moonlight', 'butterflies', 'layers', 'crystal', 'orbits', ...Object.keys(GiftScenes.catalog)],
    structure: ['letter', 'arch', 'postcard', 'folded'], ornament: ['botanical', 'orbit', 'pressed'],
    intensity: ['cinematic', 'medium', 'gentle', 'off'], experience: ['', ...Object.keys(CardThemes.catalog)],
    arrival:['stardust','growing','classic'],welcome:['none','bebe'],
    size: ['small', 'medium', 'large'], reveal: ['instant', 'gentle', 'slow'], showDate: ['on', 'off'], showSignature: ['on', 'off']
  });
  const TONES = { all: 'Tất cả lời gợi ý', short: 'Ngắn gọn', warm: 'Ấm áp', playful: 'Vui vẻ', moving: 'Xúc động', sweet: 'Ngọt ngào', romantic: 'Lãng mạn' };
  const OPENING_NAMES = { bouquet:'Bó hoa bung nở',galaxy:'Vườn sao',envelope:'Mở phong thư',stardust:'Bụi sao hội tụ',aurora:'Dải sáng cực quang',bloom:'Cành lá hé mở',rose:'Nụ hồng bung nở',sunrise:'Nắng qua khung cửa',lotus:'Cánh sen trên nước',moonlight:'Trăng soi mặt hồ',butterflies:'Cánh bướm hé lời thương',layers:'Các lớp ngọc trai',crystal:'Trái tim pha lê',orbits:'Hai quỹ đạo gặp nhau' };
  const DESIGN_NAMES = { structure: {letter:'Thư tay',arch:'Thiệp đứng',postcard:'Toàn cảnh',folded:'Thiệp gập'}, theme: {rose:'Hồng sương',sage:'Vườn xanh',champagne:'Champagne',midnight:'Đêm ánh kim',teal:'Ngọc xanh',lilac:'Tím thạch anh'} };
  function defaultDesign(legacy = false) {
    return { theme:'rose',font:'serif',layout:'classic',decoration:'botanical',effect:'petals',dedication:'',body:'',scene:'bouquet',structure:'arch',ornament:'botanical',intensity:'cinematic',experience:legacy?'':'sunflower',size:'medium',reveal:'gentle',showDate:'on',showSignature:'on',secret:'',giftIntro:'',flowerNotes:'[]',arrival:legacy?'classic':'growing',welcome:legacy?'none':'bebe',welcomeText:'' };
  }
  function recommendedArrival(id){return ['galaxy','lovegalaxy','aurora','moonlake','ocean','lantern','lightbridge','crystal'].includes(id)?'stardust':'growing';}
  function themeDesign(id) {
    const preset = CardThemes.catalog[id];
    const dark = ['galaxy','aurora','moonlake','lovegalaxy'].includes(id);
    return {experience:id,theme:preset.palette || (dark?'midnight':'rose'),scene:preset.opening,structure:preset.structure || 'arch',ornament:preset.ornament || (dark?'orbit':'botanical'),effect:preset.effect || (dark?'constellation':id==='butterfly'?'butterflies':'petals'),decoration:dark?'stars':id==='letter'||id==='pearl'?'minimal':'botanical',font:preset.font || 'serif',layout:id==='pearl'?'centered':'classic',intensity:'cinematic'};
  }
  function applyTheme(id) {
    if (!Object.hasOwn(CardThemes.catalog,id)) return;
    Object.assign(state.design,themeDesign(id));
    if(state.design.welcome==='bebe'&&!arrivalEdited)state.design.arrival=recommendedArrival(id);
    renderDesignControls(); renderCard();
  }
  function normalizeText(value) { return value.normalize('NFC'); }

  function makeDefaultState() {
    return {
      target: 'mom', variant: '', recipientName: '', senderName: CONFIG.defaultSender,
      pronoun: 'con', recipientPronoun: 'mẹ', tone: 'all', greeting: '', sampleIndex: 0, message: '', musicId: 'mom:0', volume:30, design: { ...defaultDesign(), ...themeDesign('sunflower') }
    };
  }

  function recipientFor(card = state) {
    const recipient = RECIPIENTS[card.target];
    return recipient.variants ? recipient.variants[card.variant] : recipient;
  }

  function samplesFor(card = state) {
    const all = CardGreetings.templates[recipientFor(card).greetings];
    const filtered = all.filter(template => card.tone === 'all' || template.tone === card.tone);
    return filtered.length ? filtered : all;
  }
  function renderPairs() {
    const pairs = CardGreetings.getPairs(recipientFor().greetings);
    const select = $('pair-field'); select.replaceChildren();
    for (const pair of pairs) select.add(new Option(pair.label, pair.id));
    select.add(new Option('Tùy chỉnh cách xưng và cách gọi', 'custom'));
    select.value = pairs.find(pair => pair.self === state.pronoun && pair.you === state.recipientPronoun)?.id || 'custom';
    $('lover-call-group').hidden = state.target !== 'lover';
    $('lover-call').value = ['em yêu','anh yêu','người thương'].includes(state.recipientPronoun) ? state.recipientPronoun : '';
    $('tone-field').replaceChildren();
    for (const [key,label] of Object.entries(TONES)) {
      if (state.target !== 'lover' && ['sweet','romantic'].includes(key)) continue;
      $('tone-field').add(new Option(label,key));
    }
    $('tone-field').value = state.tone;
  }
  function resetPair() {
    const pair = CardGreetings.defaultPair(recipientFor().greetings);
    state.pronoun = pair.self; state.recipientPronoun = pair.you;
    state.tone = 'all'; state.sampleIndex = 0; state.greeting = '';
    fields.pronoun.value = state.pronoun; fields.recipientPronoun.value = state.recipientPronoun;
    renderPairs();
    if (state.design.body.trim()) $('content-change-notice').hidden = false;
  }

  function cardText() {
    const recipient = recipientFor();
    const name = state.recipientName.trim();
    const self = state.pronoun.trim() || recipient.pronoun;
    const you = state.recipientPronoun.trim() || recipient.you;
    const template = samplesFor()[state.sampleIndex] || samplesFor()[0];
    const cap = value => value.charAt(0).toLocaleUpperCase('vi-VN') + value.slice(1);
    const salutation = state.target === 'lover' ? (['anh','em','cậu'].includes(you) ? `${cap(you)} thương mến,` : `Gửi ${you},`) : state.target === 'teacher' ? `${cap(you)} kính mến,` : ['mom','grandma'].includes(state.target) ? `${cap(you)} yêu thương,` : `${cap(you)} thân mến,`;
    return {recipient: name ? `Gửi ${name},` : salutation, envelopeRecipient:`Gửi ${name || you}`,
      greeting:state.design.body.trim() || state.greeting || CardGreetings.render(template,{self,you}),
      message:state.message.trim(), sender:state.senderName.trim(), template};
  }

  function showToast(message, persistent = false) {
    window.clearTimeout(toastTimer);
    const toast = $('toast');
    toast.textContent = message;
    toast.hidden = false;
    toast.dataset.persistent = String(persistent);
    if (!persistent) toastTimer = window.setTimeout(() => { toast.hidden = true; }, 5500);
  }

  function focusElement(element, centered = false) {
    window.requestAnimationFrame(() => {
      if (!element || element.closest('[hidden]')) return;
      element.focus({ preventScroll: true });
      if (centered) element.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'center' });
    });
  }

  function cancelOpening() {
    window.clearTimeout(openingTimer);
    openingTimer = 0;
    opening = false;
    CardThemes.reset();
    BouquetArrival.hide();bebe?.hide();
    if ($('bouquet-letter-open')) $('bouquet-letter-open').disabled=false;
    if ($('open-theme-card')) $('open-theme-card').disabled = false;
    ['envelope-stage', 'bouquet-stage', 'galaxy-stage'].forEach(id => {
      $(id).classList.remove('is-opening');
      $(id).removeAttribute('aria-busy');
    });
    $('skip-animation').hidden = true;
    ['open-envelope', 'open-bouquet', 'open-galaxy', 'envelope-open-button'].forEach(id => { $(id).disabled = false; });
  }

  function showScreen(next, focus = true) {
    cancelOpening();
    if (next !== 'letter') {
      window.clearTimeout(petalTimer);
      $('petal-burst').replaceChildren();
    }
    if ((next === 'editor' || next === 'home') && screen !== next) CardMusic.stopOnPageHide();
    if(next!=='editor')CardMusic.leaveStudio();
    screen = next;
    if(next==='envelope'){arrivalPassed=false;bebePhase=hasBebe()?'story':'idle';renderCard();}
    $('envelope-screen').dataset.journeyPhase=next==='envelope'?(hasBebe()?'bebe':arrivalActive()?'bouquet':'theme'):'idle';
    Object.entries(screens).forEach(([key, element]) => { element.hidden = key !== next; });
    document.body.dataset.screen = next;
    CardThemes.setScreen(arrivalActive() && next==='envelope'?'editor':next);
    if(next==='envelope'&&hasBebe())bebe.show(bebeSettings());
    else if(next==='envelope'&&arrivalActive())showBouquet();
    else BouquetArrival.hide();
    if(next==='editor')CardMusic.enterStudio();
    if (next !== 'letter') { $('secret-content').hidden = true; $('secret-reveal-button').setAttribute('aria-expanded','false'); }
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (focus && next !== 'home') focusElement($(`${next}-title`));
  }

  function removeFragment() {
    if (!window.location.hash) return;
    try {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    } catch (_) {
      window.location.hash = '';
    }
  }

  function resetCard() {
    state = makeDefaultState();arrivalEdited=false;
    pronounEdited = false;
    shared = false;
    variantMemory.sister = 'older';
    variantMemory.women = 'friend';
    $('manual-copy-panel').hidden = true;
    removeFragment();
    renderEditor();
    renderCard();
  }

  function goHome(anchor) {
    GiftScenes.closePreview();
    if (shared) resetCard();
    showScreen('home', false);
    if (anchor) {
      window.requestAnimationFrame(() => {
        const element = $(anchor);
        if (element) {
          const focusTarget = anchor === 'recipients' ? $('recipients-title') : element;
          focusTarget.tabIndex = -1;
          focusTarget.focus({ preventScroll: true });
          element.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
        }
      });
    }
  }

  function updateSelectedRecipients() {
    recipientButtons.forEach((button) => {
      const selected = button.dataset.recipient === state.target && (!button.dataset.variant || button.dataset.variant === state.variant);
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function renderVariants() {
    const config = RECIPIENTS[state.target];
    const select = $('variant-field');
    $('variant-group').hidden = !config.variants;
    select.replaceChildren();
    if (!config.variants) return;
    $('variant-label').textContent = config.variantLabel;
    Object.entries(config.variants).forEach(([value, variant]) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = variant.label;
      select.append(option);
    });
    select.value = state.variant;
  }

  function updateMessageCount() {
    const tooLong = state.message.length > CONFIG.maxMessageLength;
    $('message-count').textContent = `${state.message.length.toLocaleString('vi-VN')} / ${CONFIG.maxMessageLength.toLocaleString('vi-VN')}`;
    $('message-error').textContent = tooLong ? 'Lời nhắn không được vượt quá 1.000 ký tự.' : '';
    $('message-error').hidden = !tooLong;
    fields.message.setAttribute('aria-invalid', String(tooLong));
  }

  function renderEditor() {
    const recipient = recipientFor();
    $('editor-title').textContent = `Một lời chúc dành cho ${recipient.you}`;
    $('selected-recipient-label').textContent = recipient.label;
    Object.entries(fields).forEach(([key, field]) => { field.value = state[key]; });
    updateSelectedRecipients();
    renderVariants();
    renderPairs();
    renderDesignControls();
    CardMusic.setGroup(state.target, state.musicId);
    CardMusic.setVolume(state.volume);
    updateMessageCount();
    renderCard();
  }

  function renderDesignControls() {
    $('arrival-style').value=state.design.arrival;
    $('welcome-mode').value=state.design.welcome;
    $('welcome-text').value=state.design.welcomeText;
    $('card-dedication').value = state.design.dedication;
    $('custom-greeting').value = state.design.body;
    $('decoration-field').value = state.design.decoration;
    $('effect-field').value = state.design.effect;
    renderOpeningOptions();
    ['scene', 'ornament', 'intensity', 'size', 'reveal'].forEach(key => { $(`${key}-field`).value = state.design[key]; });
    $('secret-message').value = state.design.secret;
    $('gift-intro').value=state.design.giftIntro;
    const flowerNotes=JSON.parse(state.design.flowerNotes || '[]');
    for(let i=0;i<5;i++)$(`flower-note-${i}`).value=flowerNotes[i] || '';
    $('show-date').checked = state.design.showDate === 'on';
    $('show-signature').checked = state.design.showSignature === 'on';
    updateDesignCount();
    updateDesignButtons();
  }

  function updateDesignButtons() {
    for (const key of ['theme', 'font', 'layout', 'structure']) {
      document.querySelectorAll(`[data-${key}-choice]`).forEach(button => {
        button.setAttribute('aria-pressed', String(button.getAttribute(`data-${key}-choice`) === state.design[key]));
      });
    }
    document.querySelectorAll('[data-theme-preset]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.themePreset === state.design.experience)));
  }
  function renderOpeningOptions() {
    const preset = CardThemes.catalog[state.design.experience];
    const choices = preset ? preset.compatibleOpenings : ['bouquet','galaxy','envelope'];
    $('scene-field').replaceChildren(...choices.map(value => new Option(OPENING_NAMES[value] || CardThemes.catalog[value]?.name || value,value)));
    if (!choices.includes(state.design.scene)) state.design.scene = preset?.opening || 'envelope';
    const effects = preset ? (['galaxy','aurora','moonlake','lovegalaxy','crystal','pearl'].includes(state.design.experience) ? ['constellation','none'] : ['petals','butterflies','none']) : ['petals','constellation','butterflies','none'];
    if (!effects.includes(state.design.effect)) state.design.effect = effects[0];
    const labels = {petals:'Cánh hoa bay nhẹ',constellation:'Sao nhỏ lấp lánh',butterflies:'Cánh bướm bay quanh',none:'Không thêm hoa, sao hoặc bướm'};
    $('effect-field').replaceChildren(...effects.map(value => new Option(labels[value],value)));
    $('effect-field').value = state.design.effect;
  }

  function updateDesignCount() {
    const length = state.design.body.length;
    $('custom-greeting-count').textContent = `${length.toLocaleString('vi-VN')} / ${CONFIG.maxCustomGreetingLength.toLocaleString('vi-VN')}`;
    const tooLong = length > CONFIG.maxCustomGreetingLength;
    $('custom-greeting-error').hidden = !tooLong;
    $('custom-greeting-error').textContent = tooLong ? 'Lời chúc riêng không được vượt quá 3.000 ký tự.' : '';
    $('custom-greeting').setAttribute('aria-invalid', String(tooLong));
  }

  function applyDesign() {
    const design = state.design;
    const modern = Boolean(design.experience);
    document.querySelectorAll('.paper').forEach(paper => {
      ['theme','font','layout','decoration','scene','structure','ornament','intensity','experience','size','reveal'].forEach(key => {paper.dataset[key]=design[key];});
      if (!modern) delete paper.dataset.experience;
      paper.querySelectorAll('.paper-date').forEach(date => {date.hidden=design.showDate==='off';});
    });
    ['envelope','bouquet','galaxy'].forEach(scene => {
      const stage=$(`${scene}-stage`);stage.hidden=arrivalActive() || modern || scene!==design.scene;
      stage.dataset.theme=design.theme;stage.dataset.intensity=design.intensity;
    });
    $('theme-stage').hidden=arrivalActive() || !modern; $('theme-backdrop').hidden=!modern;
    $('envelope-screen').dataset.scene=design.scene; $('letter-screen').dataset.scene=design.scene;
    $('letter-screen').classList.toggle('immersive-scene',!modern && design.scene!=='envelope');
    $('cosmic-garden').hidden=modern || design.scene==='envelope';
    CardThemes.apply(design);
    $('bouquet-arrival').hidden=!flowersVisible();
    $('envelope-open-button').hidden=arrivalActive();
    $('gift-freeze').hidden=arrivalActive() || $('gift-freeze').hidden;
    $('envelope-screen').classList.toggle('has-bouquet-arrival',arrivalActive());
    $('letter-screen').dataset.fromBouquet=String(hasArrival());
    $('letter-screen').classList.toggle('has-theme-experience',modern);
    if (!modern) $('letter-screen').removeAttribute('data-experience');
    document.querySelector('.mini-stage').dataset.scene=design.scene;
    document.querySelector('.mini-stage').dataset.experience=design.experience;
    $('design-summary').textContent=`${CardThemes.catalog[design.experience]?.name || OPENING_NAMES[design.scene]} · ${DESIGN_NAMES.structure[design.structure]} · ${DESIGN_NAMES.theme[design.theme]}`;
    document.querySelector('.envelope-hint').textContent=modern?'Chạm vào món quà để mở một thế giới dành riêng.':'Chạm để mở món quà của bạn.';
    document.body.dataset.cardTheme=design.theme;
    ['preview','letter'].forEach(prefix => {$(`${prefix}-dedication`).textContent=design.dedication;});
    document.querySelectorAll('.letter-sprig').forEach(sprig => {sprig.style.visibility=!modern && design.decoration==='botanical'?'':'hidden';});
    $('use-template').hidden=!design.body;
    $('gift-configuration').hidden=!GiftScenes.has(design.experience);
    $('flower-notes-fields').hidden=design.experience!=='wishtree';
    $('secret-note').hidden=!design.secret.trim(); $('secret-content').textContent=design.secret;
    renderWelcomeGuide();
    renderEffectGuide();
    renderJourneyGuide();
    updateDesignButtons();
  }

  function setArrival(value){arrivalEdited=true;state.design.arrival=value;if(value==='classic')state.design.welcome='none';renderDesignControls();renderCard();}
  function bebeSettings(){return {target:state.target,variant:state.variant,recipientName:state.recipientName,senderName:state.senderName,recipientPronoun:state.recipientPronoun,welcomeText:state.design.welcomeText,theme:state.design.theme,intensity:state.design.intensity};}
  function showBouquet(){BouquetArrival.show({style:state.design.arrival,intensity:state.design.intensity,recipient:cardText().envelopeRecipient,sender:state.senderName.trim()});}
  function presentBebeFlowers(){
    if(screen!=='envelope'||!hasBebe()||bebePhase==='flowers')return;
    bebePhase='flowers';renderCard();$('envelope-screen').dataset.journeyPhase='bouquet';showBouquet();
  }
  function skipBebe(){if(screen!=='envelope')return;CardMusic.openGesture();revealLetter();}
  function renderWelcomeGuide(){
    const enabled=state.design.welcome==='bebe';
    $('welcome-text').disabled=!enabled;$('welcome-dialogue-sample').hidden=!enabled;
    if(enabled&&window.BebeWelcome){const lines=window.BebeWelcome.linesFor(bebeSettings());$('welcome-dialogue-sample').textContent=`Bé B sẽ nói: “${lines[0]}” “${lines[2]}”`;}
    $('preview-welcome').textContent=enabled?'Xem bé B → hoa → thiệp':'Xem cách mở thiệp đã chọn';
  }

  const EFFECT_DESCRIPTIONS={
    petals:'Khi mở phần đọc, cánh hoa bay nhẹ ở mép thiệp; vài cánh hoa tiếp tục trôi trên nền.',
    constellation:'Khi mở phần đọc, sao nhỏ lóe sáng ở mép thiệp và lấp lánh trên nền.',
    butterflies:'Khi mở phần đọc, những cánh bướm bay quanh mép thiệp; không che lời chúc.',
    none:'Không thêm hạt trang trí bay quanh chữ. Cảnh chủ đề vẫn hiện đầy đủ.'
  };
  function renderEffectGuide(replay=false){
    const demo=$('effect-preview-stage'),effect=state.design.effect;
    $('effect-description').textContent=EFFECT_DESCRIPTIONS[effect]+(state.design.intensity==='off'?' Bạn đang tắt chuyển động.':' Chọn “Xem thử” để nhìn trước; giảm chuyển động sẽ hiện bản tĩnh.');
    const key=`${effect}:${state.design.intensity}:${reducedMotion.matches}`;
    if(!replay&&demo.dataset.previewKey===key)return;
    demo.dataset.previewKey=key;demo.dataset.effect=effect;demo.dataset.intensity=state.design.intensity;
    const particles=$('effect-preview-particles');particles.replaceChildren();
    document.querySelectorAll('.reading-ambience i').forEach(node=>{node.innerHTML=effect==='butterflies'?`<svg viewBox="0 0 48 48" aria-hidden="true">${CardThemes.effectGlyph(effect)}</svg>`:'';});
    if(effect==='none')return;
    const glyph=CardThemes.effectGlyph(effect);
    for(let i=0;i<6;i++){
      const particle=document.createElement('span');particle.style.cssText=`--x:${8+i*16}%;--delay:${i*.1}s;--turn:${i%2?-30:20}deg`;
      particle.innerHTML=`<svg viewBox="0 0 48 48" aria-hidden="true">${glyph}</svg>`;particles.append(particle);
    }
  }

  const READING_NOTES={
    umbrella:'Ô vẫn che bó hoa; những hạt mưa sáng tiếp tục rơi quanh lời chúc.',
    storybook:'Cuốn sách vẫn mở với khu vườn giấy, cây và hoa ở lại cùng lời chúc.',
    island:'Hòn đảo, cây và những bông hoa vẫn lơ lửng trên mây khi đọc thiệp.',
    ocean:'Vỏ trai, ngọc và bó hoa pha lê ở lại; chạm mặt nước để tạo gợn sáng.',
    balloon:'Khinh khí cầu neo lại cùng giỏ hoa, đung đưa nhẹ khi đọc lời chúc.',
    lantern:'Đèn lồng vẫn bay và vòng hoa tiếp tục tỏa sáng cạnh tấm thiệp.',
    wishtree:'Cây giữ nguyên tán hoa; chạm các bông hoa có số để đọc lời nhắn riêng.',
    silk:'Lụa và bó hoa vẫn ở lại sau khi tháo nơ, cùng những ánh sáng dịu.',
    lightbridge:'Cây cầu và vòm hoa vẫn sáng dưới bầu trời sao khi đọc thiệp.',
    musicbox:'Hộp nhạc vẫn mở; vòng hoa tiếp tục xoay cùng bản nhạc đã chọn.',
    galaxy:'Ngân hà, quỹ đạo và sao vẫn lấp lánh; chạm để nối một chòm sao.',
    lovegalaxy:'Trái tim sao và hai quỹ đạo vẫn chuyển động quanh lời yêu thương.',
    aurora:'Dải cực quang vẫn chảy qua bầu trời; chạm để thêm một dải sáng.',
    garden:'Cành lá và hoa xanh ở lại; chạm để một cụm hoa nở thêm.',
    rose:'Vườn hồng vẫn hiện diện; chạm để thả cánh hồng bay.',
    sunflower:'Ô cửa vẫn mở đón nắng, những bông cúc ở lại bên lời chúc.',
    lotus:'Sen vẫn nở trên mặt hồ; chạm để mặt nước gợn sáng.',
    moonlake:'Ánh trăng và những gợn nước tiếp tục chuyển động trên hồ.',
    butterfly:'Hoa vẫn nở và những cánh bướm tiếp tục bay bên tấm thiệp.',
    letter:'Lá thư, dấu sáp và nhành hoa khô ở lại; chạm dấu sáp để thấy điều nhỏ xinh.',
    pearl:'Ngọc trai và lớp lụa óng ánh vẫn ở cạnh lời chúc.',
    crystal:'Trái tim pha lê giữ ánh sáng và nhịp đập dịu bên lời thương.'
  };
  function renderJourneyGuide(){
    for(const style of ['stardust','growing']){const host=$(`arrival-${style}-picture`);if(!host.firstChild)host.innerHTML=BouquetArrival.thumbnail(style);}
    const id=state.design.experience,theme=CardThemes.catalog[id];
    const description=READING_NOTES[id]||'Cảnh đã chọn ở lại cùng lời chúc.';
    $('journey-description').textContent=theme?`${hasBebe()?'bé B → Bó hoa → Lời chúc trong '+theme.name:((hasArrival()?'Bó hoa → ':'')+theme.name+' → Lời chúc')}. ${description}`:'Mở món quà rồi đọc lời chúc.';
    $('reading-world-caption').hidden=!theme;
    $('reading-world-title').textContent=theme?.name||'';
    $('reading-world-description').textContent=description;
    $('letter-screen').style.setProperty('--reading-world-bg',theme?.background||'#fff8f1');
    $('letter-screen').dataset.ambient=state.design.effect;
    $('letter-screen').dataset.intensity=state.design.intensity;
    document.querySelectorAll('[data-arrival-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.arrivalChoice===state.design.arrival)));
    const picture=$('arrival-classic-picture');
    if(theme&&picture.dataset.experience!==id){picture.dataset.experience=id;picture.style.background=theme.background;picture.innerHTML=GiftScenes.has(id)?`<span class="gift-scene gift-motion-off" data-phase="ready">${CardThemes.renderArt(id,'thumb')}</span>`:CardThemes.renderArt(id,'thumb');}
    $('arrival-classic-name').textContent=theme?`Vào thẳng ${theme.name}`:'Vào thẳng cảnh đã chọn';
  }

  // User content is always inserted as text, never HTML.

  function renderCard() {
    const text = cardText();
    applyDesign();
    $('mini-preview-recipient').textContent = text.recipient;
    const miniText = Array.from(text.greeting);
    $('mini-preview-line').textContent = miniText.slice(0, 95).join('') + (miniText.length > 95 ? '…' : '');
    $('mini-preview-sender').textContent = text.sender;
    $('mini-preview-sender').closest('.paper-sign').hidden = !text.sender || state.design.showSignature === 'off';
    ['preview', 'letter'].forEach((prefix) => {
      $(`${prefix}-recipient`).textContent = text.recipient;
      $(`${prefix}-greeting`).textContent = text.greeting;
      $(`${prefix}-message`).textContent = text.message;
      $(`${prefix}-message`).hidden = !text.message;
      $(`${prefix}-sender`).textContent = text.sender;
      $(`${prefix}-sender`).previousElementSibling.textContent = CardGreetings.render(text.template.closing, {self:state.pronoun,you:state.recipientPronoun});
      $(`${prefix}-sender`).closest('.paper-sign').hidden = !text.sender || state.design.showSignature === 'off';
    });
    $('sample-title').textContent = text.template.title;
    $('sample-counter').textContent = `${state.sampleIndex + 1} / ${samplesFor().length}`;
    $('envelope-open-button').textContent = GiftScenes.has(state.design.experience) && GiftScenes.phase()==='ready' ? 'Đọc lời chúc đầy đủ' : 'Mở lời chúc dành cho bạn';
    $('envelope-title').textContent = shared ? 'Bạn có một lời chúc 20/10' : 'Một lời thương đang chờ';
    $('envelope-subtitle').textContent = state.design.scene === 'galaxy'
      ? 'Giữa triệu vì sao, có một khu vườn dành riêng cho bạn. Chạm để bước vào nhé.'
      : state.design.scene === 'bouquet' ? 'Có một lời thương được giấu trong bó hoa này. Tự tay mở món quà của bạn nhé.'
      : shared ? 'Một tấm thiệp nhỏ được gửi đến bạn. Hãy mở để đọc nhé.' : 'Lời chúc đã nằm trong phong bì. Mở ra để xem món quà của bạn.';
    if (state.design.experience) $('envelope-subtitle').textContent = `${text.envelopeRecipient}. ${CardThemes.catalog[state.design.experience].description || 'Một món quà nhỏ, được chuẩn bị bằng sự chân thành.'}`;
    if (GiftScenes.has(state.design.experience) && state.design.giftIntro.trim()) $('envelope-subtitle').textContent=state.design.giftIntro;
    if(arrivalActive()){
      $('envelope-title').textContent=shared?'Một bó hoa dành riêng cho bạn':'Món quà người nhận sẽ thấy';
      $('envelope-subtitle').textContent='Tặng một bó hoa nhân ngày 20/10. Nhận hoa rồi mở món quà và lời chúc phía sau nhé.';
    }
    if(hasArrival()&&!arrivalActive()&&state.design.experience){$('envelope-title').textContent=CardThemes.catalog[state.design.experience].name;}
    $('envelope-recipient').textContent = text.envelopeRecipient;
    $('letter-title').textContent = 'Chúc mừng ngày 20/10';
    $('back-to-editor').hidden = shared;
    $('edit-card').hidden = shared;
  }

  function syncFields() {
    Object.entries(fields).forEach(([key, field]) => { state[key] = normalizeText(field.value); });
    updateMessageCount();
    renderCard();
  }

  function validateFields() {
    syncFields();
    const limits = { recipientName: CONFIG.maxNameLength, senderName: CONFIG.maxNameLength, pronoun: CONFIG.maxPronounLength, recipientPronoun: CONFIG.maxPronounLength, message: CONFIG.maxMessageLength };
    const labels = { recipientName: 'Tên người nhận', senderName: 'Tên người gửi', pronoun: 'Cách xưng hô', recipientPronoun: 'Cách gọi người nhận', message: 'Lời nhắn' };
    for (const [key, limit] of Object.entries(limits)) {
      if (state[key].length > limit) {
        showToast(`${labels[key]} không được vượt quá ${limit.toLocaleString('vi-VN')} ký tự.`, true);
        fields[key].focus();
        return false;
      }
    }
    const designFields = [['body', 'custom-greeting', CONFIG.maxCustomGreetingLength], ['dedication', 'card-dedication', CONFIG.maxDedicationLength], ['secret', 'secret-message', 1000], ['giftIntro', 'gift-intro', 160], ['welcomeText','welcome-text',160]];
    for (const [key, id, limit] of designFields) {
      if (state.design[key].length > limit) {
        showToast(`Nội dung thiết kế vượt ${limit.toLocaleString('vi-VN')} ký tự. Hãy rút ngắn rồi thử lại.`, true);
        $('design-panel').open = true;
        $(id).focus();
        return false;
      }
    }
    const flowerNotes=JSON.parse(state.design.flowerNotes || '[]');
    for(let i=0;i<flowerNotes.length;i++)if(flowerNotes[i].length>160){
      showToast('Mỗi lời nhắn trên hoa tối đa 160 ký tự. Hãy rút ngắn rồi mở thiệp.',true);
      $('design-panel').open=true;focusElement($(`flower-note-${i}`),true);return false;
    }
    return true;
  }

  function selectRecipient(target, requestedVariant) {
    if (!Object.hasOwn(RECIPIENTS,target)) return;
    if (shared) resetCard();
    $('toast').hidden=true;
    const changed=target!==state.target || Boolean(requestedVariant && requestedVariant!==state.variant);
    state.target=target;
    const config=RECIPIENTS[target];
    state.variant=config.variants ? requestedVariant || variantMemory[target] || config.defaultVariant : '';
    if (config.variants) variantMemory[target]=state.variant;
    if (changed) {
      resetPair(); state.musicId=`${target}:0`;
      Object.assign(state.design,themeDesign(target==='women'&&state.variant==='friend'?'garden':CardThemes.defaults[target]));
    }
    if(state.design.welcome==='bebe'&&!arrivalEdited)state.design.arrival=recommendedArrival(state.design.experience);
    renderEditor(); showScreen('editor');CardMusic.enterStudio({gesture:true});
  }

  function changeSample(direction) {
    const length = samplesFor().length;
    state.sampleIndex = (state.sampleIndex + direction + length) % length;
    state.greeting = '';
    renderCard();
    if (state.design.body.trim()) showToast('Mẫu gợi ý đã đổi. Bạn đang dùng lời tự viết; chọn “Quay về lời chúc gợi ý” nếu muốn dùng mẫu.');
  }

  function burstPetals() {
    window.clearTimeout(petalTimer);
    const container = $('petal-burst');
    container.replaceChildren();
    if (reducedMotion.matches || state.design.effect === 'none' || state.design.intensity === 'off') return;
    if (state.design.experience) { CardThemes.celebrate(state.design.effect); return; }
    const count = state.design.intensity === 'gentle' ? 5 : window.matchMedia('(max-width: 640px)').matches
      ? CONFIG.effects.petalsMobile : CONFIG.effects.petalsDesktop;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i += 1) {
      const petal = document.createElement('span');
      petal.className = state.design.effect === 'constellation' ? 'burst-star' : state.design.effect === 'butterflies' ? 'burst-butterfly' : 'burst-petal';
      petal.setAttribute('aria-hidden', 'true');
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.setProperty('--drift', `${Math.round(Math.random() * 160 - 80)}px`);
      petal.style.setProperty('--rotation', `${Math.round(Math.random() * 360)}deg`);
      petal.style.animationDelay = `${Math.random() * 0.5}s`;
      petal.style.animationDuration = `${3.5 + Math.random() * 1.5}s`;
      fragment.append(petal);
    }
    container.append(fragment);
    petalTimer = window.setTimeout(() => container.replaceChildren(), 6000);
  }

  function revealLetter() {
    if (screen !== 'envelope') return;
    renderCard();
    showScreen('letter');
    burstPetals();
  }

  // Một bộ hẹn giờ duy nhất, có thể bỏ qua và không chạy chồng khi mở lại.
  function finishBouquet() {
    if(screen!=='envelope')return;
    clearTimeout(openingTimer);openingTimer=0;opening=false;
    arrivalPassed=true;BouquetArrival.hide();
    if(hasBebe()){revealLetter();return;}
    renderCard();
    $('envelope-screen').dataset.journeyPhase='theme';
    CardThemes.setScreen('envelope');
    // Commit the selected scene's initial frame before starting its own motion.
    void $('theme-stage').offsetWidth;
    openEnvelope(false);
    focusElement($('envelope-title'));
  }

  function openEnvelope(withMusic=true) {
    if (screen !== 'envelope' || opening || (hasBebe()&&bebePhase!=='flowers')) return;
    if(arrivalActive()){
      CardMusic.openGesture();if(hasBebe())bebe.open();opening=true;
      if($('bouquet-letter-open'))$('bouquet-letter-open').disabled=true;
      $('skip-animation').hidden=false;
      const duration=BouquetArrival.open();
      if(duration===0)finishBouquet();else openingTimer=setTimeout(finishBouquet,duration);
      return;
    }
    if (GiftScenes.has(state.design.experience)) {
      if(GiftScenes.phase()==='ready'){revealLetter();return;}
      if(withMusic)CardMusic.openGesture();opening=true;
      const duration=CardThemes.open();
      $('envelope-open-button').disabled=true;$('open-theme-card').disabled=true;
      $('skip-animation').hidden=false;$('gift-freeze').hidden=true;
      if(duration===0)finishGift();else openingTimer=setTimeout(finishGift,duration);
      return;
    }
    if(withMusic)CardMusic.openGesture();
    if (reducedMotion.matches || state.design.intensity === 'off') {
      revealLetter();
      return;
    }
    opening = true;
    const stage = state.design.experience ? $('theme-stage') : $(`${state.design.scene}-stage`);
    const duration = state.design.experience ? CardThemes.open() : state.design.intensity === 'gentle' ? 2000 : CONFIG.effects.openingMs;
    if ($('open-theme-card')) $('open-theme-card').disabled = true;
    stage.classList.add('is-opening');
    stage.setAttribute('aria-busy', 'true');
    ['open-envelope', 'open-bouquet', 'open-galaxy', 'envelope-open-button'].forEach(id => { $(id).disabled = true; });
    $('skip-animation').hidden = false;
    openingTimer = window.setTimeout(revealLetter, duration);
  }

  function finishGift() {
    clearTimeout(openingTimer);openingTimer=0;opening=false;GiftScenes.complete();
    $('envelope-open-button').disabled=false;$('envelope-open-button').textContent=state.design.experience==='umbrella'?'Có lời nhắn dành cho bạn':'Đọc lời chúc đầy đủ';
    $('skip-animation').hidden=true;$('gift-freeze').hidden=false;
    focusElement($('envelope-open-button'));
  }
  function previewTheme(id) {
    if(!Object.hasOwn(CardThemes.catalog,id))return;
    const design={...state.design,...themeDesign(id)};
    const paper=document.querySelector('.letter-paper').cloneNode(true);
    paper.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
    paper.querySelectorAll('button').forEach(node=>{node.disabled=true;});
    for(const key of ['theme','font','structure','ornament','layout','decoration','experience','scene','intensity','size','reveal'])paper.dataset[key]=design[key];
    paper.querySelectorAll('.tx-paper-mark').forEach(mark=>mark.remove());
    const mark=document.createElement('span');mark.className='tx-paper-mark gift-scene gift-motion-off';mark.dataset.phase='ready';mark.setAttribute('aria-hidden','true');mark.innerHTML=CardThemes.renderArt(id,'reading');paper.querySelector('.paper-heading').prepend(mark);
    CardMusic.stopOnPageHide();CardMusic.leaveStudio();
    GiftScenes.openPreview(id,{design,meta:CardThemes.catalog[id],intro:design.giftIntro.trim() || `${cardText().envelopeRecipient}. ${CardThemes.catalog[id].description}`,readingNode:paper,onSelect:applyTheme});
  }
  function stringProperty(data, key, fallback, limit) {
    if (!Object.hasOwn(data, key)) return fallback;
    if (typeof data[key] !== 'string' || data[key].length > limit) throw new Error('Invalid text');
    return normalizeText(data[key]);
  }

  // Liên kết chỉ chứa dữ liệu văn bản; giới hạn kích thước trước khi giải mã.
  function parseCardFragment(hash) {
    if (hash.length > CONFIG.maxFragmentLength) throw new Error('Invalid fragment');
    const data = CardLinks.decode(hash);
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid card');
    if (![1,2,4].includes(data.v)) throw new Error('Unsupported version');
    const target = Object.hasOwn(data, 'target') ? data.target : 'mom';
    if (typeof target !== 'string' || !Object.hasOwn(RECIPIENTS, target)) throw new Error('Invalid target');
    const config = RECIPIENTS[target];
    const variant = Object.hasOwn(data, 'variant') ? data.variant : config.defaultVariant || '';
    if (typeof variant !== 'string') throw new Error('Invalid variant');
    if (config.variants ? !Object.hasOwn(config.variants, variant) : variant !== '') throw new Error('Invalid variant');
    const result = { target, variant };
    const recipient = recipientFor(result);
    result.recipientName = stringProperty(data, 'recipientName', '', CONFIG.maxNameLength);
    result.senderName = stringProperty(data, 'senderName', CONFIG.defaultSender, CONFIG.maxNameLength);
    result.pronoun = stringProperty(data, 'pronoun', recipient.pronoun, CONFIG.maxPronounLength);
    result.message = stringProperty(data, 'message', '', CONFIG.maxMessageLength);
    result.recipientPronoun = stringProperty(data,'recipientPronoun',recipient.you,CONFIG.maxPronounLength);
    result.tone = stringProperty(data,'tone','all',20);
    if (!Object.hasOwn(TONES,result.tone)) throw new Error('Invalid tone');
    result.greeting = stringProperty(data,'greeting','',CONFIG.maxCustomGreetingLength);
    result.volume = Object.hasOwn(data,'volume')?data.volume:30;
    if (typeof result.volume!=='number'||!Number.isFinite(result.volume)||result.volume<0||result.volume>100) throw new Error('Invalid volume');
    result.sampleIndex = Object.hasOwn(data, 'sampleIndex') ? data.sampleIndex : 0;
    if (!Number.isInteger(result.sampleIndex) || result.sampleIndex < 0 || result.sampleIndex >= (data.v === 4 ? 1001 : LEGACY_GREETINGS[recipient.greetings]?.length || 0)) {
      throw new Error('Invalid template');
    }
    result.musicId = `${target}:0`;
    result.design = defaultDesign(data.v !== 4);
    result.design.arrival='classic';result.design.welcome='none';
    if (data.v === 2 || data.v === 4) {
      if (Object.hasOwn(data, 'musicId')) {
        if (typeof data.musicId !== 'string' || !new RegExp(`^${target}:(?:[0-9]|1[0-9])$`).test(data.musicId)) throw new Error('Invalid song');
        result.musicId = data.musicId;
      }
      if (Object.hasOwn(data, 'design')) {
        const design = data.design;
        if (!design || typeof design !== 'object' || Array.isArray(design)) throw new Error('Invalid design');
        for (const [key, choices] of Object.entries(DESIGN_OPTIONS)) {
          if (Object.hasOwn(design, key)) {
            if (typeof design[key] !== 'string' || !choices.includes(design[key])) throw new Error('Invalid design choice');
            result.design[key] = design[key];
          }
        }
        result.design.dedication = stringProperty(design, 'dedication', '', CONFIG.maxDedicationLength);
        result.design.body = stringProperty(design, 'body', '', CONFIG.maxCustomGreetingLength);
        result.design.secret = stringProperty(design,'secret','',1000);
        result.design.giftIntro=stringProperty(design,'giftIntro','',160);
        result.design.welcomeText=stringProperty(design,'welcomeText','',160);
        result.design.flowerNotes=stringProperty(design,'flowerNotes','[]',5000);
        const notes=JSON.parse(result.design.flowerNotes);
        if(!Array.isArray(notes)||notes.length>5||notes.some(note=>typeof note!=='string'||note.length>160))throw new Error('Invalid flower notes');
      }
    }
    if (data.v !== 4) {
      const legacyTemplate=LEGACY_GREETINGS[recipient.greetings]?.[result.sampleIndex];
      if (legacyTemplate) result.greeting=CardGreetings.render(legacyTemplate,{self:result.pronoun,you:recipient.you});
      if (result.target==='women' && result.musicId==='women:0') result.musicId='women:1';
    } else {
      if (!result.greeting.trim()) throw new Error('Missing greeting snapshot');
      const preset=CardThemes.catalog[result.design.experience];
      if (preset && !preset.compatibleOpenings.includes(result.design.scene)) throw new Error('Incompatible opening');
    }
    return result;
  }

  function loadFragment() {
    const hash = window.location.hash;
    if (!hash || ['#main-content', '#recipients', '#how-it-works'].includes(hash)) return false;
    try {
      state = parseCardFragment(hash);arrivalEdited=true;
      shared = true;
      pronounEdited = true;
      if (RECIPIENTS[state.target].variants) variantMemory[state.target] = state.variant;
      renderEditor();
      renderCard();
      showScreen('envelope');
      return true;
    } catch (_) {
      resetCard();
      showScreen('home', false);
      showToast('Liên kết thiệp không hợp lệ hoặc quá dài. Bạn vẫn có thể tạo một tấm thiệp mới ở đây.', true);
      return false;
    }
  }

  function prepareShareLink() {
    const payload = {
      v: 4, target: state.target, variant: state.variant,
      recipientName: state.recipientName, senderName: state.senderName,
      pronoun: state.pronoun, sampleIndex: state.sampleIndex, message: state.message,
      recipientPronoun:state.recipientPronoun,tone:state.tone,greeting:cardText().greeting,volume:CardMusic.currentVolume(),
      musicId: state.musicId, design: { ...state.design }
    };
    let fragment;
    try { fragment = CardLinks.encodeCompact(payload); }
    catch (_) { showToast('Chưa thể tạo liên kết. Hãy kiểm tra độ dài lời nhắn và thử lại.', true); return null; }
    const originalLength = `#card=${encodeURIComponent(JSON.stringify(payload))}`.length;
    const savedPercent = Math.max(0, Math.round((1 - fragment.length / originalLength) * 100));
    $('link-size-status').textContent = `Liên kết tự gọn: ${fragment.length.toLocaleString('vi-VN')} ký tự · ngắn hơn ${savedPercent}%. Giữ nguyên lời chúc, thiết kế và nhạc.`;
    if (fragment.length > CONFIG.maxFragmentLength) {
      showToast('Liên kết quá dài. Hãy rút ngắn lời nhắn trước khi chia sẻ.', true);
      return null;
    }
    $('share-long-warning').hidden = fragment.length <= 12000;
    $('share-long-warning').textContent = 'Liên kết này khá dài. Một số ứng dụng có thể cắt liên kết; hãy kiểm tra lại sau khi gửi hoặc rút ngắn lời nhắn.';
    const url = new URL(window.location.href);
    url.hash = fragment;
    const link = url.href;
    $('share-link-field').value = link;
    if (window.location.protocol === 'file:') {
      showToast('Để người khác mở được thiệp, hãy đưa website lên hosting rồi chia sẻ liên kết từ địa chỉ đó.', true);
      return null;
    }
    return link;
  }

  function showManualCopy() {
    $('manual-copy-panel').hidden = false;
    const input = $('share-link-field');
    focusElement(input, true);
    window.requestAnimationFrame(() => {
      input.select();
      input.setSelectionRange(0, input.value.length);
    });
    showToast('Không thể sao chép tự động. Hãy chọn và sao chép liên kết trong ô bên dưới.', true);
  }

  async function copyPreparedLink(link) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(link);
        $('manual-copy-panel').hidden = true;
        showToast('Đã sao chép liên kết. Bạn có thể gửi tấm thiệp ngay rồi.');
        return true;
      } catch (_) { /* Thử cách sao chép dự phòng trước khi hiện ô sao chép thủ công. */ }
    }
    const panel = $('manual-copy-panel');
    const input = $('share-link-field');
    const active = document.activeElement;
    panel.hidden = false;
    input.focus({ preventScroll: true });
    input.select();
    input.setSelectionRange(0, input.value.length);
    let copied = false;
    try {
      copied = typeof document.execCommand === 'function' && document.execCommand('copy') === true;
    } catch (_) { copied = false; }
    if (copied) {
      panel.hidden = true;
      if (active && active.isConnected && typeof active.focus === 'function') active.focus({ preventScroll: true });
      showToast('Đã sao chép liên kết. Bạn có thể gửi tấm thiệp ngay rồi.');
      return true;
    }
    showManualCopy();
    return false;
  }

  async function shareCard() {
    const link = prepareShareLink();
    if (!link) return;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: CONFIG.siteName, text: 'Một lời chúc 20/10 dành riêng cho bạn.', url: link });
        showToast('Tấm thiệp đã sẵn sàng gửi đi.');
        return;
      } catch (error) {
        if (error && error.name === 'AbortError') return;
      }
    }
    await copyPreparedLink(link);
  }

  // Trình phát dùng một audio duy nhất, tự dò tệp theo nhóm và giữ lựa chọn khi chia sẻ.
  document.addEventListener('cardmusicchange', event => {
    const id = event.detail && event.detail.id;
    if (typeof id === 'string' && id.startsWith(`${state.target}:`)) state.musicId = id;
  });
  document.addEventListener('cardmusicnotice', event => {
    if (event.detail && typeof event.detail.message === 'string') showToast(event.detail.message, true);
  });

  ['theme', 'font', 'layout', 'structure'].forEach(key => {
    document.querySelectorAll(`[data-${key}-choice]`).forEach(button => {
      button.addEventListener('click', () => {
        state.design[key] = button.getAttribute(`data-${key}-choice`);
        renderCard();
      });
    });
  });
  ['decoration', 'effect', 'scene', 'ornament', 'intensity', 'size', 'reveal'].forEach(key => {
    $(`${key}-field`).addEventListener('change', event => {
      state.design[key] = event.target.value;
      renderCard();
    });
  });
  $('theme-gallery').addEventListener('click',event => {
    const button=event.target.closest('[data-theme-preset]');if(button)applyTheme(button.dataset.themePreset);
    const preview=event.target.closest('[data-preview-theme]');if(preview)previewTheme(preview.dataset.previewTheme);
  });
  const MOODS={galaxy:['fantasy','bright'],aurora:['fantasy','gentle'],garden:['gentle'],rose:['romantic'],sunflower:['bright'],lotus:['elegant','gentle'],moonlake:['gentle','fantasy'],butterfly:['bright','fantasy'],letter:['elegant'],pearl:['elegant'],crystal:['romantic'],lovegalaxy:['romantic','fantasy']};
  $('theme-filter').addEventListener('change',event=>{
    for(const entry of document.querySelectorAll('.theme-entry')){
      const moods=CardThemes.catalog[entry.dataset.entryId].moods || MOODS[entry.dataset.entryId] || [];
      entry.hidden=event.target.value!=='all'&&!moods.includes(event.target.value);
    }
  });
  $('gift-intro').addEventListener('input',event=>{state.design.giftIntro=normalizeText(event.target.value);renderCard();});
  document.querySelectorAll('[data-flower-note]').forEach(field=>field.addEventListener('input',()=>{
    const notes=[...document.querySelectorAll('[data-flower-note]')].map(node=>normalizeText(node.value));
    state.design.flowerNotes=JSON.stringify(notes);renderCard();
  }));
  $('theme-defaults').addEventListener('click',()=>applyTheme(state.design.experience || CardThemes.defaults[state.target]));
  const CURATED = {mom:['sunflower','rose','garden'],grandma:['lotus','moonlake','pearl'],teacher:['letter','pearl','aurora'],sister:['butterfly','aurora','sunflower'],friend:['garden','butterfly','sunflower'],women:['pearl','lotus','galaxy'],lover:['lovegalaxy','crystal','rose']};
  $('curate-design').addEventListener('click',()=>{const choices=CURATED[state.target];applyTheme(choices[(choices.indexOf(state.design.experience)+1)%choices.length]);});
  $('pair-field').addEventListener('change',event=>{
    const pair=CardGreetings.getPairs(recipientFor().greetings).find(pair=>pair.id===event.target.value);
    if(pair){state.pronoun=pair.self;state.recipientPronoun=pair.you;state.greeting='';fields.pronoun.value=pair.self;fields.recipientPronoun.value=pair.you;renderPairs();renderCard();}
    else focusElement(fields.pronoun,true);
  });
  $('lover-call').addEventListener('change',event=>{
    const pair=CardGreetings.defaultPair('lover');
    const value=event.target.value==='name'?state.recipientName.trim():event.target.value;
    if(event.target.value==='name'&&!value){showToast('Điền tên người nhận trước khi dùng tên để xưng hô.');return;}
    if(value)state.recipientPronoun=value;
    else state.recipientPronoun=state.pronoun==='em'?'anh':state.pronoun==='mình'?'cậu':pair.you;
    fields.recipientPronoun.value=state.recipientPronoun;state.greeting='';renderPairs();renderCard();
  });
  $('tone-field').addEventListener('change',event=>{state.tone=event.target.value;state.sampleIndex=0;state.greeting='';renderCard();});
  $('keep-custom-content').addEventListener('click',()=>{$('content-change-notice').hidden=true;});
  $('replace-custom-content').addEventListener('click',()=>{state.design.body='';state.greeting='';$('content-change-notice').hidden=true;renderDesignControls();renderCard();});
  $('secret-message').addEventListener('input',event=>{state.design.secret=normalizeText(event.target.value);renderCard();});
  for(const [id,key] of [['show-date','showDate'],['show-signature','showSignature']]) $(id).addEventListener('change',event=>{state.design[key]=event.target.checked?'on':'off';renderCard();});
  $('secret-reveal-button').addEventListener('click',()=>{const hidden=!$('secret-content').hidden;$('secret-content').hidden=hidden;$('secret-reveal-button').setAttribute('aria-expanded',String(!hidden));});
  document.addEventListener('cardmusicvolume',event=>{state.volume=event.detail.volume;});
  $('theme-stage').addEventListener('click',event=>{if(event.target.closest('#open-theme-card'))openEnvelope();});
  $('arrival-style').addEventListener('change',event=>{setArrival(event.target.value);});
  $('welcome-mode').addEventListener('change',event=>{state.design.welcome=event.target.value;arrivalEdited=false;state.design.arrival=event.target.value==='bebe'?recommendedArrival(state.design.experience):'classic';renderDesignControls();renderCard();});
  $('welcome-text').addEventListener('input',event=>{state.design.welcomeText=normalizeText(event.target.value);renderCard();});
  $('preview-welcome').addEventListener('click',()=>{if(!validateFields())return;shared=false;renderCard();showScreen('envelope');});
  document.querySelectorAll('[data-arrival-choice]').forEach(button=>button.addEventListener('click',()=>{setArrival(button.dataset.arrivalChoice);}));
  document.querySelectorAll('[data-preview-arrival]').forEach(button=>button.addEventListener('click',()=>{if(!validateFields())return;setArrival(button.dataset.previewArrival);shared=false;renderCard();showScreen('envelope');}));
  $('preview-arrival').addEventListener('click',()=>{if(!validateFields())return;shared=false;renderCard();showScreen('envelope');});
  $('preview-effect').addEventListener('click',()=>renderEffectGuide(true));
  $('jump-to-preview').addEventListener('click', () => focusElement($('preview-card'), true));
  [['card-dedication', 'dedication'], ['custom-greeting', 'body']].forEach(([id, key]) => {
    $(id).addEventListener('input', event => {
      state.design[key] = normalizeText(event.target.value);
      updateDesignCount();
      renderCard();
    });
  });
  $('use-template').addEventListener('click', () => {
    state.design.body = '';
    renderDesignControls();
    renderCard();
  });
  $('reset-design').addEventListener('click', () => {
    state.design = { ...defaultDesign(), ...themeDesign(state.design.experience || CardThemes.defaults[state.target]), body: state.design.body, dedication:state.design.dedication,secret:state.design.secret,giftIntro:state.design.giftIntro,flowerNotes:state.design.flowerNotes,arrival:state.design.arrival,welcome:state.design.welcome,welcomeText:state.design.welcomeText };
    renderDesignControls();
    renderCard();
  });
  $('custom-greeting').addEventListener('paste', event => {
    const pasted = event.clipboardData && event.clipboardData.getData('text/plain');
    const field = event.currentTarget;
    if (pasted && field.value.length - (field.selectionEnd - field.selectionStart) + pasted.length > CONFIG.maxCustomGreetingLength) {
      event.preventDefault();
      showToast('Lời chúc riêng vượt 3.000 ký tự. Hãy rút ngắn rồi dán lại; nội dung hiện tại được giữ nguyên.', true);
    }
  });

  document.querySelector('.skip-link').addEventListener('click', (event) => {
    event.preventDefault();
    const main = $('main-content');
    main.tabIndex = -1;
    main.focus({ preventScroll: true });
    main.scrollIntoView({ behavior: 'auto', block: 'start' });
  });
  $('brand-home').addEventListener('click', () => goHome());
  $('nav-create').addEventListener('click', () => goHome('recipients'));
  $('nav-about').addEventListener('click', () => goHome('how-it-works'));
  $('start-button').addEventListener('click', () => goHome('recipients'));
  document.querySelector('[data-start-create]').addEventListener('click', () => goHome('recipients'));
  $('back-to-recipients').addEventListener('click', () => goHome('recipients'));
  recipientButtons.forEach((button) => button.addEventListener('click', () => selectRecipient(button.dataset.recipient,button.dataset.variant)));
  Object.entries(fields).forEach(([key, field]) => {
    field.maxLength = key === 'message' ? CONFIG.maxMessageLength : ['pronoun','recipientPronoun'].includes(key) ? CONFIG.maxPronounLength : CONFIG.maxNameLength;
    field.addEventListener('input', () => {
      if (['pronoun','recipientPronoun'].includes(key)) state.greeting='';
      syncFields();
      if (['pronoun','recipientPronoun'].includes(key)) renderPairs();
    });
  });
  fields.message.addEventListener('paste', (event) => {
    const pasted = event.clipboardData && event.clipboardData.getData('text/plain');
    if (!pasted) return;
    const resultingLength = fields.message.value.length - (fields.message.selectionEnd - fields.message.selectionStart) + pasted.length;
    if (resultingLength > CONFIG.maxMessageLength) {
      event.preventDefault();
      showToast('Lời nhắn vượt 1.000 ký tự. Hãy rút ngắn nội dung rồi dán lại; lời nhắn hiện tại được giữ nguyên.', true);
    }
  });
  $('variant-field').addEventListener('change', (event) => {
    const config = RECIPIENTS[state.target];
    if (!config.variants || !Object.hasOwn(config.variants, event.target.value)) return;
    state.variant = event.target.value;
    variantMemory[state.target] = state.variant;
    resetPair();
    $('editor-title').textContent = `Một lời chúc dành cho ${recipientFor().you}`;
    $('selected-recipient-label').textContent = recipientFor().label;
    updateSelectedRecipients();
    renderCard();
  });
  $('prev-greeting').addEventListener('click', () => changeSample(-1));
  $('next-greeting').addEventListener('click', () => changeSample(1));
  $('preview-button').addEventListener('click', () => {
    syncFields();
    focusElement($('preview-card'), true);
  });
  $('personalize-form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateFields()) return;
    shared = false;
    $('manual-copy-panel').hidden = true;
    renderCard();
    showScreen('envelope');
  });
  ['open-envelope', 'open-bouquet', 'open-galaxy'].forEach(id => $(id).addEventListener('click', openEnvelope));
  $('envelope-open-button').addEventListener('click', openEnvelope);
  $('skip-animation').addEventListener('click',()=>!arrivalActive()&&GiftScenes.has(state.design.experience)?finishGift():revealLetter());
  $('back-to-editor').addEventListener('click', () => {
    if (shared) return;
    renderEditor();
    showScreen('editor');CardMusic.enterStudio({gesture:true});
  });
  $('edit-card').addEventListener('click', () => {
    if (shared) return;
    renderEditor();
    showScreen('editor');CardMusic.enterStudio({gesture:true});
  });
  $('replay-card').addEventListener('click', () => {
    renderCard();
    $('manual-copy-panel').hidden = true;
    showScreen('envelope');
  });
  $('create-another').addEventListener('click', () => {
    resetCard();
    goHome('recipients');
  });
  $('share-card').addEventListener('click', shareCard);
  $('copy-link').addEventListener('click', async () => {
    const link = prepareShareLink();
    if (link) await copyPreparedLink(link);
  });
  $('close-copy-panel').addEventListener('click', () => {
    $('manual-copy-panel').hidden = true;
    focusElement($('copy-link'));
  });
  window.addEventListener('hashchange', () => {
    if (window.location.hash && !['#main-content', '#recipients', '#how-it-works'].includes(window.location.hash)) loadFragment();
    else if (shared) { resetCard(); showScreen('home', false); }
  });
  const onMotionChange = () => {
    if (reducedMotion.matches) {
      $('petal-burst').replaceChildren();
      window.clearTimeout(petalTimer);
      if (opening) {if(arrivalActive())finishBouquet();else if(GiftScenes.has(state.design.experience))finishGift();else revealLetter();}
    }
  };
  if (typeof reducedMotion.addEventListener === 'function') reducedMotion.addEventListener('change', onMotionChange);
  else if (typeof reducedMotion.addListener === 'function') reducedMotion.addListener(onMotionChange);
  window.addEventListener('pagehide', () => {
    CardMusic.stopOnPageHide();BouquetArrival.hide();bebe?.hide();
    window.clearTimeout(openingTimer);
    window.clearTimeout(petalTimer);
  });

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) { cancelOpening(); CardMusic.resumeUI(); if(screen==='envelope')showScreen('envelope',false); }
  });

  document.addEventListener('visibilitychange',()=>{document.documentElement.classList.toggle('page-hidden',document.hidden);if(document.hidden&&opening&&!arrivalActive()&&GiftScenes.has(state.design.experience))finishGift();});
  document.title = CONFIG.siteName;
  $('manual-copy-panel').hidden = true;
  $('skip-animation').hidden = true;
  if (!loadFragment()) showScreen('home', false);
})();

  