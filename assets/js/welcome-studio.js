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
  function helper(){
    const host=$('studio-helper'),bubble=$('studio-helper-message'),toggle=$('studio-helper-toggle');
    let dismissed=false;
    const lines=['Chào bạn! Mình là bé B. Cùng làm một tấm thiệp thật riêng nhé.','Chọn một thế giới bạn thích. Sau bó hoa, thế giới ấy vẫn ở lại cùng lời chúc.','Bạn có thể đặt tên cho mình và viết từng câu mình nói với người nhận.','Thêm một chữ ký nhỏ, nghe thử nhạc, rồi xem trọn món quà trước khi gửi nhé.'];
    let line=0;
    toggle.addEventListener('click',()=>{dismissed=false;host.classList.remove('studio-helper-quiet');line=(line+1)%lines.length;bubble.textContent=lines[line];toggle.setAttribute('aria-expanded','true');});
    $('studio-helper-close').addEventListener('click',()=>{dismissed=true;host.classList.add('studio-helper-quiet');toggle.setAttribute('aria-expanded','false');});
    return {show(visible){host.hidden=!visible;if(visible&&!dismissed)bubble.textContent=lines[line];}};
  }
  window.WelcomeStudio=Object.freeze({mount,helper,scriptFor});
})();
