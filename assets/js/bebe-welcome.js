/* Original light-character welcome, inspired by the supplied timing/reference.
   No reference-page resources or extra audio players; sound uses CardMusic. */
(() => {
  'use strict';
  let current=null;
  const clean=value=>typeof value==='string'?value.trim().normalize('NFC'):'';
  const nameFor=settings=>clean(settings?.welcomeName)||'bé B';
  const capital=value=>value.charAt(0).toLocaleUpperCase('vi-VN')+value.slice(1);
  function linesFor(settings={}){
    const actor=nameFor(settings),Actor=capital(actor);
    const target=settings.target||'women',variant=settings.variant||'';
    const name=clean(settings.recipientName),sender=clean(settings.senderName);
    const defaults={mom:'mẹ',grandma:'bà',teacher:'cô',sister:variant==='younger'?'em':'chị',women:variant==='group'?'mọi người':'bạn',friend:'bạn',lover:'em'};
    const you=clean(settings.recipientPronoun)||defaults[target]||'bạn';
    const address=name||you;
    const openingAddress=address.charAt(0).toLocaleUpperCase('vi-VN')+address.slice(1);
    const greetings={
      mom:`${openingAddress} ơi, ${actor} đến rồi đây!`,
      grandma:`${Actor} chào ${address} ạ. Có một món quà dành riêng cho ${you}.`,
      teacher:`${Actor} chào ${address} ạ. Có một món quà 20/10 muốn gửi đến ${you}.`,
      sister:`${openingAddress} ơi, có một bất ngờ nhỏ đang đợi!`,
      women:variant==='group'?`${Actor} chào ${name||'mọi người'}! Một chút dịu dàng dành cho ngày 20/10.`:`Chào ${address}! ${Actor} mang đến một chút bất ngờ.`,
      friend:`Chào ${address}! ${Actor} có một món quà muốn chuyển đến ${you}.`,
      lover:`${openingAddress} ơi, có người muốn làm ${you} mỉm cười hôm nay.`
    };
    const wishes={
      mom:`${Actor} chúc ${you} luôn khỏe, được nghỉ ngơi và có thật nhiều ngày vui.`,
      grandma:`${Actor} chúc ${you} khỏe mạnh, ăn ngon, ngủ ngon và luôn có người bên cạnh chuyện trò.`,
      teacher:`${Actor} chúc ${you} mạnh khỏe, giữ niềm vui với nghề và nhận thật nhiều yêu thương.`,
      sister:variant==='younger'?`${Actor} chúc ${you} nhiều niềm vui, những ước mơ đẹp và luôn được thương yêu.`:`${Actor} chúc ${you} luôn rạng rỡ, vững vàng và có thời gian làm điều mình thích.`,
      women:variant==='group'?`${Actor} chúc ${you} một ngày thật vui, luôn được trân trọng và có nhiều điều để tự hào.`:`${Actor} chúc ${you} một ngày vui, được lắng nghe và luôn tự tin là chính mình.`,
      friend:`${Actor} chúc ${you} một ngày vui, được lắng nghe và luôn tự tin là chính mình.`,
      lover:`Có một người gửi đến ${you} thật nhiều thương nhớ. ${Actor} chúc ${you} luôn được yêu thương bằng những điều dịu dàng.`
    };
    return [
      greetings[target]||greetings.friend,
      sender?`${sender} nhờ ${actor} mang món quà này đến ${you}.`:`Có một lời chúc được chuẩn bị riêng, và ${actor} được nhờ mang đến ${you}.`,
      wishes[target]||wishes.friend,
      clean(settings.welcomeText)||`Đợi ${actor} một chút nhé… Một bó hoa thật lớn đang được chuẩn bị!`,
      `Bó hoa này dành cho ${you}. Chạm vào bó hoa để nhận lời chúc nhé!`
    ];
  }
  class Welcome{
    constructor(host,{onFlowers=()=>{},onSkip=()=>{},onSound=()=>{},onGreet=()=>{}}={}){
      this.host=host;this.onFlowers=onFlowers;this.onSkip=onSkip;this.onSound=onSound;this.onGreet=onGreet;
      this.timer=0;this.visible=false;this.offered=false;this.opened=false;this.finished=false;this.elapsed=0;this.started=0;this.beat=-1;
      this.motion=matchMedia('(prefers-reduced-motion: reduce)');
      host.innerHTML=`<div class="bb-root" data-phase="sleep" data-mood="sleep"><div class="bb-nebula" aria-hidden="true"></div><div class="bb-meteors" aria-hidden="true"><i></i><i></i></div><div class="bb-stars" aria-hidden="true">${Array.from({length:18},(_,i)=>`<i style="--x:${5+i*47%91}%;--y:${8+i*31%83}%;--delay:-${i%7}s"></i>`).join('')}</div><div class="bb-stage"><div class="bb-brand"><span class="bb-brand-dot" aria-hidden="true"></span><strong id="bebe-name"></strong><span>người đưa quà nhỏ</span></div><button type="button" class="bb-skip" id="bebe-skip">Mở thiệp ngay <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button><div class="bb-sound"><button type="button" id="welcome-music-toggle" aria-pressed="false">Bật nhạc chào ♫</button><span id="welcome-audio-status" role="status"></span></div><button type="button" class="bb-character" aria-label="Nhân vật đang ngủ"><span class="bb-wake-ring" aria-hidden="true"></span><span class="bb-magic" aria-hidden="true">✧ <i>✦</i> ✧</span><span class="bb-sleep" aria-hidden="true">z<span>z</span></span><div class="bb-eye-pair" aria-hidden="true"><div class="bb-eye-slot left"><div class="bb-blink"><div class="bb-eye-light"><i></i></div></div></div><div class="bb-eye-slot right"><div class="bb-blink"><div class="bb-eye-light"><i></i></div></div></div></div><span class="bb-cheek left" aria-hidden="true"></span><span class="bb-cheek right" aria-hidden="true"></span><span class="bb-mouth" aria-hidden="true"></span><div class="bb-hands" aria-hidden="true"><i></i><i></i></div></button><div class="bb-dialogue"><p id="bebe-dialogue" role="status" aria-live="polite" aria-atomic="true"></p><p class="bb-footnote">Chạm vào đôi mắt để chào lại người đưa quà nhỏ.</p></div></div></div>`;
      this.node=host.firstElementChild;this.caption=host.querySelector('#bebe-dialogue');this.character=host.querySelector('.bb-character');
      this.soundHandler=()=>{if(this.visible)this.onSound();};host.querySelector('#welcome-music-toggle').addEventListener('click',this.soundHandler);
      this.greetHandler=()=>{if(!this.visible||this.opened)return;this.onGreet();if(this.motion.matches||this.settings?.intensity==='off')return;this.character.classList.remove('bb-coucou');void this.character.offsetWidth;this.character.classList.add('bb-coucou');};this.character.addEventListener('click',this.greetHandler);
      this.lookHandler=event=>{if(!this.visible||this.opened||this.motion.matches||this.settings?.intensity==='off'||document.hidden)return;const now=performance.now();if(now-(this.lastLook||0)<40)return;this.lastLook=now;const r=this.character.getBoundingClientRect();this.character.style.setProperty('--look-x',`${Math.max(-7,Math.min(7,(event.clientX-r.x-r.width/2)*.035))}px`);this.character.style.setProperty('--look-y',`${Math.max(-5,Math.min(5,(event.clientY-r.y-r.height/2)*.025))}px`);};
      this.lookReset=()=>{this.character.style.removeProperty('--look-x');this.character.style.removeProperty('--look-y');};this.node.addEventListener('pointermove',this.lookHandler);this.node.addEventListener('pointerleave',this.lookReset);
      this.skipHandler=()=>{if(this.visible&&!this.opened)this.onSkip();};host.querySelector('#bebe-skip').addEventListener('click',this.skipHandler);
      this.visibilityHandler=()=>{if(document.hidden)this.pause();else this.resume();};
      this.motionHandler=()=>{this.node.classList.toggle('bb-motion-off',this.motion.matches||this.settings?.intensity==='off');if(this.visible&&this.motion.matches)this.finish();};
      document.addEventListener('visibilitychange',this.visibilityHandler);this.motion.addEventListener('change',this.motionHandler);
      host.hidden=true;
    }
    say(text,mood,phase){
      this.node.dataset.mood=mood;this.node.dataset.phase=phase;
      const names={sleep:'đang ngủ',awake:'vừa thức dậy',curious:'đang tò mò',happy:'đang vui',shy:'hơi ngại ngùng',offering:'đang trao hoa',waiting:'đang đợi bạn nhận hoa'};
      this.character.setAttribute('aria-label',`${capital(nameFor(this.settings))} ${names[mood]||'đang vui'}. Chạm để chào lại.`);
      if(this.caption.textContent!==text){const fragment=document.createDocumentFragment();let word=0;for(const part of text.split(/(\s+)/)){if(!part)continue;if(/^\s+$/.test(part)){fragment.append(document.createTextNode(part));continue;}const span=document.createElement('span');span.className='bb-word';span.textContent=part;span.style.setProperty('--word-delay',`${Math.min(word++*.035,1.1)}s`);fragment.append(span);}this.caption.replaceChildren(fragment);this.caption.classList.remove('bb-line-in');void this.caption.offsetWidth;this.caption.classList.add('bb-line-in');}
    }
    show(settings={}){
      this.hide();this.settings={...settings};this.lines=linesFor(settings);this.actor=nameFor(settings);this.host.querySelector('#bebe-name').textContent=this.actor;this.character.classList.remove('bb-coucou');this.lookReset();this.node.dataset.relationship=settings.target||'women';this.visible=true;this.host.hidden=false;
      this.offered=false;this.opened=false;this.finished=false;this.elapsed=0;this.started=performance.now();this.beat=-1;
      this.node.dataset.palette=settings.theme||'rose';this.node.classList.toggle('bb-motion-off',this.motion.matches||settings.intensity==='off');
      this.node.classList.remove('bb-paused');
      this.steps=[
        [0,'sleep','sleep',`Suỵt… ${capital(this.actor)} đang thức dậy để mang quà đến.`],
        [900,'awake','story',this.lines[0]],
        [3400,'curious','story',this.lines[1]],
        [6200,'happy','story',this.lines[2]],
        [9200,'shy','story',this.lines[3]],
        [12000,'offering','flowers',this.lines[4]],
        [15000,'waiting','flowers',this.lines[4]]
      ];
      if(this.motion.matches||settings.intensity==='off')this.finish();else if(document.hidden){this.say(this.steps[0][3],'sleep','sleep');this.pause();}else this.advance();
      return this;
    }
    clock(){return this.elapsed+(this.started?performance.now()-this.started:0);}
    advance(){
      clearTimeout(this.timer);this.timer=0;
      if(!this.visible||this.opened||document.hidden||!this.started)return;
      const time=this.clock();let index=0;
      for(let i=1;i<this.steps.length;i++)if(time>=this.steps[i][0])index=i;
      if(index!==this.beat){this.beat=index;const step=this.steps[index];this.say(step[3],step[1],step[2]);if(step[2]==='flowers')this.offer();}
      if(index<this.steps.length-1)this.timer=setTimeout(()=>this.advance(),Math.max(16,this.steps[index+1][0]-this.clock()));
      else this.finished=true;
    }
    offer(){if(this.offered||!this.visible)return;this.offered=true;this.onFlowers();}
    finish(){
      clearTimeout(this.timer);this.timer=0;if(!this.visible||this.opened)return;
      this.finished=true;this.beat=this.steps.length-1;
      this.say(`${this.lines[0]} ${this.lines[2]}${clean(this.settings.welcomeText)?' '+this.lines[3]:''} Chạm bó hoa để nhận lời chúc nhé!`,'waiting','flowers');this.offer();
    }
    setSound(state={}){const button=this.host.querySelector('#welcome-music-toggle');button.hidden=!state.active||!state.enabled;button.setAttribute('aria-pressed',String(Boolean(state.playing)));button.textContent=state.playing?'Tắt nhạc chào ♫':state.pending?'Đang mở nhạc…':'Bật nhạc chào ♫';this.host.querySelector('#welcome-audio-status').textContent=state.active&&state.enabled?state.status||'':'';this.node.classList.toggle('bb-music-on',Boolean(state.playing));}
    open(){if(!this.visible||this.opened)return;this.opened=true;clearTimeout(this.timer);this.timer=0;this.say(`${capital(this.actor)} chuyển món quà đến rồi. Một lời chúc thật ấm lòng đang mở ra!`,'happy','flowers');}
    pause(){if(this.started){this.elapsed=this.clock();this.started=0;}clearTimeout(this.timer);this.timer=0;this.node.classList.add('bb-paused');}
    resume(){if(!this.visible)return;this.node.classList.remove('bb-paused');if(!this.finished&&!this.opened){this.started=performance.now();this.advance();}}
    hide(){clearTimeout(this.timer);this.timer=0;this.visible=false;this.started=0;this.lookReset();this.character.classList.remove('bb-coucou');if(this.node)this.node.classList.add('bb-paused');this.host.hidden=true;}
    metrics(){return{visible:this.visible,offered:this.offered,opened:this.opened,pendingTimer:Boolean(this.timer),phase:this.node.dataset.phase,mood:this.node.dataset.mood,elapsed:Math.round(this.clock())};}
    destroy(){this.hide();document.removeEventListener('visibilitychange',this.visibilityHandler);this.motion.removeEventListener('change',this.motionHandler);this.host.querySelector('#bebe-skip').removeEventListener('click',this.skipHandler);this.host.querySelector('#welcome-music-toggle').removeEventListener('click',this.soundHandler);this.character.removeEventListener('click',this.greetHandler);this.node.removeEventListener('pointermove',this.lookHandler);this.node.removeEventListener('pointerleave',this.lookReset);this.host.replaceChildren();}
  }
  window.BebeWelcome=Object.freeze({nameFor,linesFor,mount(host,options){if(!host)return null;current?.destroy();current=new Welcome(host,options);return current;},metrics:()=>current?.metrics()||{visible:false,pendingTimer:false}});
})();
