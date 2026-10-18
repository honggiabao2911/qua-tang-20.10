/* Dialogue editor and an independent, silent helper for the creator. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  function scriptFor(source=''){
    if(!source)return null;
    if(typeof source!=='string'||source.length>8000)throw new Error('Invalid welcome script');
    const lines=JSON.parse(source);
    if(!Array.isArray(lines)||lines.length<2||lines.length>8||lines.some(line=>typeof line!=='string'||!line.trim()||line.length>160))throw new Error('Invalid welcome script');
    return lines;
  }
  function mount({onChange}){
    const mode=$('welcome-script-mode'),list=$('welcome-script-list'),panel=$('welcome-script-panel');
    let settings={},value='',enabled=true;
    function read(){try{const a=JSON.parse(value);return Array.isArray(a)?a:[];}catch(_){return [];}}
    function commit(lines,focus){value=JSON.stringify(lines);onChange(value);draw();if(focus!==undefined)list.querySelectorAll('textarea')[focus]?.focus({preventScroll:true});}
    function draw(){
      mode.value=value?'custom':'auto';mode.disabled=!enabled;panel.hidden=!value;
      const lines=read(),key=JSON.stringify(lines.map((_,i)=>i));
      if(list.dataset.rows!==key){
        list.replaceChildren();list.dataset.rows=key;
        lines.forEach((_,i)=>{
          const row=document.createElement('div');row.className='welcome-script-row';
          const label=document.createElement('label');label.htmlFor=`welcome-line-${i}`;label.textContent=`Câu ${i+1}${i===lines.length-1?' · Khi trao bó hoa':''}`;
          const field=document.createElement('textarea');field.id=label.htmlFor;field.rows=2;field.maxLength=160;field.dataset.line=String(i);field.placeholder='Viết điều bạn muốn nhân vật nói…';field.setAttribute('aria-describedby','welcome-script-help');
          const count=document.createElement('span');count.className='welcome-line-count';count.setAttribute('aria-hidden','true');
          const tools=document.createElement('div');tools.className='welcome-line-tools';
          for(const [action,title,caption] of [['up','Đưa câu lên trước','↑'],['down','Đưa câu xuống sau','↓'],['remove','Xóa câu','Xóa']]){const b=document.createElement('button');b.type='button';b.dataset.action=action;b.dataset.index=String(i);b.setAttribute('aria-label',`${title}: câu ${i+1}`);b.textContent=caption;tools.append(b);}
          row.append(label,field,count,tools);list.append(row);
        });
      }
      [...list.children].forEach((row,i)=>{
        const field=row.querySelector('textarea');if(field.value!==lines[i])field.value=lines[i];field.disabled=!enabled;
        row.querySelector('label').textContent=`Câu ${i+1}${i===lines.length-1?' · Khi trao bó hoa':''}`;
        row.querySelector('.welcome-line-count').textContent=`${lines[i].length}/160`;
        row.querySelector('[data-action=up]').disabled=!enabled||i===0;row.querySelector('[data-action=down]').disabled=!enabled||i===lines.length-1;row.querySelector('[data-action=remove]').disabled=!enabled||lines.length<=2;
      });
      $('welcome-line-add').disabled=!enabled||lines.length>=8;$('welcome-script-defaults').disabled=!enabled;
    }
    mode.addEventListener('change',()=>{if(mode.value==='custom')commit(BebeWelcome.linesFor({...settings,welcomeLines:''}));else{value='';onChange('');draw();}});
    list.addEventListener('input',event=>{if(!event.target.matches('textarea'))return;const lines=read();lines[Number(event.target.dataset.line)]=event.target.value.normalize('NFC');value=JSON.stringify(lines);onChange(value);draw();});
    list.addEventListener('click',event=>{const b=event.target.closest('[data-action]');if(!b||b.disabled)return;const lines=read(),i=Number(b.dataset.index),a=b.dataset.action;let focus=i;
      if(a==='remove'){lines.splice(i,1);focus=Math.min(i,lines.length-1);}else{const j=i+(a==='up'?-1:1);[lines[i],lines[j]]=[lines[j],lines[i]];focus=j;}commit(lines,focus);
    });
    $('welcome-line-add').addEventListener('click',()=>{const lines=read();if(lines.length>=8)return;lines.splice(lines.length-1,0,'');commit(lines,lines.length-2);});
    $('welcome-script-defaults').addEventListener('click',()=>commit(BebeWelcome.linesFor({...settings,welcomeLines:''})));
    return {render(source,nextSettings,active){value=source;settings=nextSettings;enabled=active;draw();},validate(){if(!value)return true;try{scriptFor(value);return true;}catch(_){const fields=[...list.querySelectorAll('textarea')];(fields.find(f=>!f.value.trim()||f.value.length>160)||fields[0])?.focus();return false;}}};
  }
  function helper({getContext=()=>({}),onAction=()=>{}}={}){
    const host=$('studio-helper'),panel=$('studio-helper-copy'),toggle=$('studio-helper-toggle'),log=$('studio-helper-log');
    let opened=false,visible=false,expression=0;
    const moods=['happy','curious','shy','love','wink','sleep'];let moodIndex=0;
    function react(mood){clearTimeout(expression);host.dataset.expression=mood;if(!document.hidden&&visible)expression=setTimeout(()=>{host.dataset.expression='idle';expression=0;},4200);}
    function append(text,user=false){
      const p=document.createElement('p');p.className='helper-bubble'+(user?' helper-user':'');p.textContent=text;log.append(p);
      while(log.children.length>12)log.firstElementChild.remove();log.scrollTop=log.scrollHeight;
    }
    function syncViewport(){
      const viewport=window.visualViewport;const inset=opened&&visible&&viewport?Math.max(0,window.innerHeight-viewport.height-viewport.offsetTop):0;
      host.style.setProperty('--helper-keyboard',`${inset}px`);host.style.setProperty('--helper-visible-height',`${viewport?.height||window.innerHeight}px`);host.dataset.keyboard=String(inset>100);
    }
    window.visualViewport?.addEventListener('resize',syncViewport);window.visualViewport?.addEventListener('scroll',syncViewport);
    window.addEventListener('resize',syncViewport);
    function setOpen(value,focus=false){opened=value;syncViewport();panel.hidden=!opened;toggle.setAttribute('aria-expanded',String(opened));host.classList.toggle('helper-open',opened);if(value){react('happy');log.scrollTop=log.scrollHeight;if(focus)$('studio-helper-input').focus({preventScroll:true});}else if(focus)toggle.focus({preventScroll:true});}
    function advice(topic,target){
      const context=getContext(),group=CardRecommendations.groupFor(target||context.target),label=CardRecommendations.labels[group];
      if(topic==='themes'){
        const names=CardRecommendations.idsFor(group).slice(0,3).map(id=>CardThemes.catalog[id].name);
        append(`Gửi ${label}, mình gợi ý ${names.join(', ')}. Mẫu khác vẫn nằm trong “Tất cả không gian” nhé.`);react('curious');onAction('themes',group);
      }else if(topic==='words'){
        const current=CardRecommendations.groupFor(context.target);
        if(target&&group!==current){append(`Bạn đang làm thiệp cho ${CardRecommendations.labels[current]}. Muốn dùng cách xưng hô cho ${label}, hãy chọn Đổi người nhận ở đầu trang nhé. Lời bạn tự viết sẽ được giữ.`);react('curious');onAction('recipient');return;}
        append(`Lời gửi ${label} sẽ tự dùng đúng cách xưng hô bạn chọn. Bạn có thể viết lời riêng hoặc chọn giọng ấm áp, ngắn gọn, tình cảm ở phần lời chúc.`);react('shy');onAction('words');
      }else if(topic==='music'){
        append('Nhạc lúc làm thiệp chọn ngẫu nhiên trong nhóm người nhận. Chạm “Bật nhạc làm thiệp” hoặc “Đổi bài ngẫu nhiên” để nghe; bản nhạc gửi trong thiệp vẫn do bạn chọn riêng.');react('happy');onAction('music');
      }else if(topic==='welcome'){
        append('Bạn đặt tên cho người đưa quà và tự viết 2–8 câu theo thứ tự nhé. Câu cuối đi cùng bó hoa; nhấn Xem thử để đọc chậm cùng biểu cảm.');react('wink');onAction('welcome');
      }else if(topic==='signature'){
        append('Một nét ký nhỏ làm tấm thiệp rất riêng đó! Bạn có thể viết tên, lời ký hoặc dùng ngón tay ký trực tiếp trên điện thoại.');react('love');onAction('signature');
      }else{react(moods[moodIndex++%moods.length]);append(['Mình nhận một cái chạm dễ thương rồi nè!','Gửi bạn một chút lấp lánh trước khi viết lời thương.','Mình ở góc này, bạn cứ thong thả làm thiệp nhé.'][moodIndex%3]);}
    }
    function answer(text){
      const q=text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase();
      const targets=[[/\bme\b/,'mom'],[/\bba\b/,'grandma'],[/\bco\b|giao vien|buc giang/,'teacher'],[/chi gai|em gai|chi em/,'sister'],[/nguoi thuong|tinh yeu|nguoi yeu/,'lover'],[/ban nu|ban be|nhom/,'women']];
      const target=targets.find(([pattern])=>pattern.test(q))?.[1];
      if(/ngu ngon|buon ngu/.test(q)){append('Mình chợp mắt một chút thôi… Bạn cứ thong thả viết, mình vẫn ở đây nhé.');react('sleep');return;}
      if(/trai tim|thuong be b/.test(q)){append('Một trái tim nhỏ gửi đến bạn nè. Mong hôm nay bạn cũng nhận thật nhiều dịu dàng ♡');react('love');return;}
      if(/^(chao|hi\b|hello|be b oi)/.test(q)){append('Chào bạn! Muốn mình gợi ý mẫu, giúp chọn lời chúc hay tìm phần chữ ký nào?');react('happy');return;}
      if(/nhac|bai hat|am nhac/.test(q))advice('music');
      else if(/ky ten|chu ky|ky tay/.test(q))advice('signature');
      else if(/loi thoai|be b|nhan vat|loi chao/.test(q))advice('welcome');
      else if(/loi chuc|viet gi|xung ho|loi rieng/.test(q))advice('words',target);
      else if(target||/mau|chu de|goi y|thiep/.test(q))advice('themes',target);
      else if(/chao|de thuong|trai tim|ngu ngon|cuoi/.test(q))advice('play');
      else{append('Mình có mẹo về mẫu thiệp, lời chúc, nhạc, lời bé B nói và chữ ký. Bạn thử hỏi “mẫu cho mẹ” hoặc chọn một nút bên dưới nhé.');react('curious');}
    }
    toggle.addEventListener('click',()=>setOpen(!opened));
    $('studio-helper-close').addEventListener('click',()=>setOpen(false,true));
    host.addEventListener('click',event=>{const b=event.target.closest('[data-helper-topic]');if(b)advice(b.dataset.helperTopic);});
    $('studio-helper-chat').addEventListener('submit',event=>{event.preventDefault();const field=$('studio-helper-input'),text=field.value.trim().slice(0,160);if(!text)return;append(text,true);field.value='';answer(text);});
    host.addEventListener('keydown',event=>{if(event.key==='Escape'&&opened){event.preventDefault();setOpen(false,true);}});
    document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(expression);expression=0;}});
    window.addEventListener('pagehide',()=>{clearTimeout(expression);expression=0;});
    return {show(value){visible=value;host.hidden=!value;syncViewport();if(!value){clearTimeout(expression);expression=0;host.dataset.expression='idle';}},react,close:()=>setOpen(false)};
  }
  window.WelcomeStudio=Object.freeze({mount,helper,scriptFor});
})();
