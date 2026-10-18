/* One renderer and lifecycle for the gift worlds, recipient view and full previews. */
(() => {
  'use strict';
  const parts = window.GiftArtParts || {};
  const palettes = ['rose','sage','champagne','midnight','teal','lilac'];
  const catalog = Object.freeze(Object.fromEntries(Object.entries(parts).map(([id,part]) => [id,Object.freeze({
    ...part.meta,id,palette:palettes.includes(part.meta.palette)?part.meta.palette:id==='ocean'?'teal':'champagne',
    opening:id,compatibleOpenings:[id],ornament:['umbrella','ocean','lantern','lightbridge'].includes(id)?'orbit':'botanical',
    effect:part.meta.effect||(['umbrella','ocean','lantern','lightbridge'].includes(id)?'constellation':'petals'),
    invitation:'Một món quà đang đợi bạn tự tay mở.',interaction:'Chạm để món quà sáng lên',
    duration:4200,moods:part.meta.moods || ['gentle','fantasy']
  })])));
  const contexts = new Set();
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const lowPower = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
  let serial=0, main=null, reading=null, mainScreen='home', preview=null, previewTimer=0;
  const $=id=>document.getElementById(id);
  const has=id=>Object.hasOwn(parts,id);
  const art=(id,mode='stage')=>has(id)?parts[id].render(`gs-${++serial}-`,mode):'';
  const getNotes=design=>{
    try{const n=JSON.parse(design.flowerNotes || '[]');return Array.isArray(n)?n.slice(0,5).map(x=>typeof x==='string'?x.slice(0,160):''):[];}catch(_){return [];}
  };
  class Scene {
    constructor(host,id,design={},kind='main'){
      this.host=host;this.id=id;this.design={...design};this.kind=kind;this.phase='initial';this.held=false;this.timer=0;
      this.node=document.createElement('div');this.node.className=`gift-scene gift-${id}`;this.node.dataset.gift=id;this.node.dataset.phase='initial';
      this.node.style.setProperty('--gift-bg',catalog[id].background || '#f7eedf');this.node.style.setProperty('--gift-color',catalog[id].color || '#c5a16a');
      const picture=document.createElement(kind==='reading'?'div':'button');picture.className='gift-object';
      if(kind!=='reading'){picture.type='button';picture.setAttribute('aria-label',`Mở ${catalog[id].name}`);if(kind==='main')picture.id='open-theme-card';}
      picture.innerHTML=art(id,kind==='reading'?'reading':'stage');this.node.append(picture);
      this.noteLayer=document.createElement('div');this.noteLayer.className='gift-flower-notes';this.node.append(this.noteLayer);
      this.note=document.createElement('p');this.note.className='gift-note-content';this.note.hidden=true;this.note.setAttribute('role','status');this.node.append(this.note);
      this.particles=document.createElement('div');this.particles.className='gift-particles';this.particles.setAttribute('aria-hidden','true');this.node.append(this.particles);
      this.caption=document.createElement('span');this.caption.className='gift-object-caption';this.caption.textContent='Chạm để mở món quà';this.node.append(this.caption);
      host.replaceChildren(this.node);contexts.add(this);this.update(design);
      this.onClick=event=>{
        const flower=event.target.closest('.gift-flower-note');
        if(flower){this.note.textContent=getNotes(this.design)[Number(flower.dataset.noteIndex)] || '';this.note.hidden=false;return;}
        if(event.target.closest('.gift-touch-zone'))this.touch(event);
        if(kind==='preview'&&event.target.closest('.gift-object'))startPreview();
      };
      this.node.addEventListener('click',this.onClick);
      if(id==='ocean'){
        const touch=document.createElement('button');touch.type='button';touch.className='gift-touch-zone';touch.textContent='Chạm mặt nước';touch.setAttribute('aria-label','Tạo gợn nước và phù du phát sáng');this.node.append(touch);
      }
      if(kind==='reading'){const welcome=document.createElement('div');welcome.className='tx-interaction-layer';welcome.setAttribute('aria-hidden','true');this.node.append(welcome);this.setPhase('reading');}
    }
    update(design){
      this.design={...design};this.node.dataset.intensity=design.intensity || 'cinematic';this.node.classList.toggle('gift-low-power',lowPower);
      this.noteLayer.replaceChildren();
      if(this.id==='wishtree'||catalog[this.id].supportsNotes){
        const positions=catalog[this.id].notePositions || [[34,36],[44,26],[58,29],[66,42],[45,46]];
        getNotes(design).forEach((value,index)=>{
          if(!value.trim())return;const button=document.createElement('button');button.type='button';button.className='gift-flower-note';button.dataset.noteIndex=String(index);
          button.style.left=`${positions[index][0]}%`;button.style.top=`${positions[index][1]}%`;button.setAttribute('aria-label',`Mở lời nhắn trên bông hoa ${index+1}`);
          button.innerHTML='<svg viewBox="0 0 44 44" aria-hidden="true"><path d="M22 22C-3 14 5-5 20 8C19-9 44-1 31 17C53 10 55 37 33 30C45 49 15 54 17 34C-5 44-7 17 22 22Z" fill="currentColor"/><circle cx="23" cy="24" r="6" fill="#fff6c7"/></svg><span>'+(index+1)+'</span>';
          this.noteLayer.append(button);
        });
      }
      this.motionState();
    }
    setPhase(phase){this.phase=phase;this.node.dataset.phase=phase;this.note.hidden=true;this.caption.textContent=phase==='initial'?'Chạm để mở món quà':phase==='opening'?'Một điều đẹp đang thành hình…':phase==='ready'?'Món quà đã sẵn sàng · chạm để đọc lời chúc':'';this.motionState();}
    motionState(){
      const off=motion.matches || this.design.intensity==='off';
      const inactive=this.kind==='main'?mainScreen!=='envelope':this.kind==='reading'?mainScreen!=='letter':!$('gift-preview-dialog')?.open;
      const paused=document.hidden || this.held || inactive;
      this.node.classList.toggle('gift-motion-off',off);this.node.classList.toggle('gift-paused',paused);this.node.classList.toggle('gift-held',this.held);this.node.dataset.paused=String(paused);
    }
    touch(){
      clearTimeout(this.timer);this.particles.replaceChildren();
      const count=motion.matches||this.design.intensity==='off'?1:lowPower?4:7;
      for(let i=0;i<count;i++){
        const particle=document.createElement('span');particle.className=i?'gift-particle':'gift-ripple';particle.style.cssText=`--x:${35+i*5}%;--y:${70-i%3*7}%;--delay:${i*.08}s`;this.particles.append(particle);
      }
      this.timer=setTimeout(()=>this.particles.replaceChildren(),2600);
    }
    destroy(){clearTimeout(this.timer);this.node.removeEventListener('click',this.onClick);this.node.remove();contexts.delete(this);}
  }
  function clearMain(){
    if(main){main.destroy();main=null;}if(reading){reading.destroy();reading=null;}
    $('theme-stage')?.classList.remove('gift-host');$('theme-backdrop')?.classList.remove('gift-reading-backdrop');
    $('letter-screen')?.removeAttribute('data-gift-dark');
  }
  function applyMain(refs,design){
    const id=design.experience;if(!has(id)){clearMain();return;}
    if(!main || main.id!==id){clearMain();main=new Scene(refs.stage,id,design,'main');reading=new Scene(refs.backdrop,id,design,'reading');}
    else{main.update(design);reading.update(design);}
    refs.stage.classList.add('gift-host');refs.backdrop.classList.add('gift-reading-backdrop');
    refs.stage.style.setProperty('--tx-bg',catalog[id].background);refs.stage.style.setProperty('--tx-color',catalog[id].color);
    refs.backdrop.style.setProperty('--tx-bg',catalog[id].background);refs.backdrop.style.setProperty('--tx-color',catalog[id].color);
    refs.backdrop.closest('#letter-screen').dataset.experience=id;refs.backdrop.closest('#letter-screen').classList.add('has-theme-experience');
    refs.backdrop.closest('#letter-screen').dataset.giftDark=String(catalog[id].dark===true||['umbrella','ocean','lantern','lightbridge'].includes(id)||catalog[id].palette==='midnight');
    document.querySelectorAll('.paper .paper-heading').forEach(heading=>{
      let mark=heading.querySelector('.tx-paper-mark');if(!mark){mark=document.createElement('span');mark.className='tx-paper-mark';mark.setAttribute('aria-hidden','true');heading.prepend(mark);}
      if(mark.dataset.experience!==id){mark.dataset.experience=id;mark.classList.add('gift-scene','gift-motion-off');mark.dataset.phase='ready';mark.innerHTML=art(id,'reading');}
    });
    $('gift-freeze').hidden=main.phase!=='ready';setScreen(mainScreen);
  }
  function open(){if(!main)return 0;main.held=false;main.node.classList.remove('gift-held');main.setPhase('opening');return motion.matches||main.design.intensity==='off'?0:main.design.intensity==='gentle'?3200:catalog[main.id].duration;}
  function complete(){if(main){main.setPhase('ready');const button=main.node.querySelector('#open-theme-card');if(button){button.disabled=false;button.setAttribute('aria-label',main.id==='umbrella'?'Có lời nhắn dành cho bạn':'Đọc lời chúc đầy đủ');}}}
  function reset(){if(main){main.held=false;main.setPhase('initial');}if(reading){reading.held=false;reading.setPhase('reading');}$('gift-freeze')?.setAttribute('aria-pressed','false');if($('gift-freeze')){$('gift-freeze').hidden=true;$('gift-freeze').textContent='Giữ lại khoảnh khắc';}}
  function setScreen(screen){mainScreen=screen;for(const context of [main,reading])context?.motionState();}
  function toggleHold(){
    const context=mainScreen==='letter'?reading:main;if(!context)return;
    context.held=!context.held;context.motionState();$('gift-freeze').setAttribute('aria-pressed',String(context.held));$('gift-freeze').textContent=context.held?'Tiếp tục chuyển động':'Giữ lại khoảnh khắc';
  }
  function closePreview(){
    clearTimeout(previewTimer);previewTimer=0;
    if(preview?.context)preview.context.destroy();preview=null;$('preview-scene-host')?.replaceChildren();$('gift-preview-body')?.replaceChildren();
    const dialog=$('gift-preview-dialog');if(dialog?.open)dialog.close();
    $('preview-scene-host')?.removeAttribute('data-experience');
  }
  function previewPhase(phase){
    if(!preview)return;clearTimeout(previewTimer);previewTimer=0;
    const read=phase==='reading';$('gift-preview-body').hidden=!read;$('preview-scene-host').hidden=read;
    document.querySelectorAll('[data-preview-jump]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.previewJump===phase)));
    if(preview.context)preview.context.setPhase(phase);
    else{preview.legacy.classList.toggle('is-opening',phase!=='initial');preview.legacy.classList.toggle('gift-held',phase==='ready');}
    $('preview-play').textContent=phase==='opening'?'Mở lại từ đầu':'Xem trọn cảnh mở';
  }
  function startPreview(){
    if(!preview)return;previewPhase('initial');
    // Force the same initial computed state before CSS begins its transformation.
    void $('preview-scene-host').offsetWidth;previewPhase('opening');
    const duration=preview.context?(motion.matches||preview.design.intensity==='off'?0:catalog[preview.id].duration):motion.matches?0:2800;
    previewTimer=setTimeout(()=>previewPhase('ready'),duration);
  }
  function openPreview(id,options){
    closePreview();const dialog=$('gift-preview-dialog');dialog.showModal();
    const host=$('preview-scene-host');host.hidden=false;host.dataset.experience=id;
    if(has(id))preview={id,design:options.design,context:new Scene(host,id,options.design,'preview'),select:options.onSelect};
    else{
      const legacy=document.createElement('div');legacy.className='theme-stage gift-legacy-preview';legacy.dataset.experience=id;legacy.dataset.opening=options.design.scene;legacy.dataset.intensity=options.design.intensity;
      legacy.style.setProperty('--tx-bg',options.meta.background);legacy.style.setProperty('--tx-color',options.meta.color);legacy.innerHTML=window.CardThemes.renderArt(id,'stage');host.append(legacy);
      preview={id,design:options.design,legacy,select:options.onSelect};
    }
    $('gift-preview-title').textContent=options.meta.name;
    $('gift-preview-intro').textContent=options.intro || '';
    $('gift-preview-intro').hidden=!options.intro;$('gift-preview-body').replaceChildren(options.readingNode);previewPhase('initial');
    $('preview-play').focus();
  }
  document.addEventListener('visibilitychange',()=>{for(const context of contexts){context.motionState();if(document.hidden){clearTimeout(context.timer);context.particles.replaceChildren();}}if(document.hidden&&preview)previewPhase('ready');});
  motion.addEventListener('change',()=>{for(const context of contexts)context.motionState();if(motion.matches&&preview)previewPhase('ready');});
  // The script is loaded after the document, so handlers are installed once.
  $('preview-close')?.addEventListener('click',closePreview);
  $('gift-preview-dialog')?.addEventListener('cancel',event=>{event.preventDefault();closePreview();});
  $('gift-preview-dialog')?.addEventListener('close',()=>{if(preview)closePreview();});
  $('preview-play')?.addEventListener('click',startPreview);
  document.querySelectorAll('[data-preview-jump]').forEach(button=>button.addEventListener('click',()=>previewPhase(button.dataset.previewJump)));
  $('preview-select')?.addEventListener('click',()=>{if(!preview)return;const select=preview.select;const id=preview.id;closePreview();select(id);});
  $('gift-freeze')?.addEventListener('click',toggleHold);
  window.addEventListener('pagehide',()=>{closePreview();for(const context of contexts){clearTimeout(context.timer);context.particles.replaceChildren();context.node.classList.add('gift-paused');}});
  window.GiftScenes=Object.freeze({catalog,has,art,applyMain,clearMain,open,complete,reset,setScreen,toggleHold,openPreview,closePreview,activeCount:()=>contexts.size,phase:()=>main?.phase || 'initial'});
})();
