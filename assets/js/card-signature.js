/* Bounded vector ink. The share link carries coordinates, never user SVG/HTML. */
(() => {
  'use strict';
  const ns='http://www.w3.org/2000/svg',alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
  const maxPoints=400,maxStrokes=16,rendered=new WeakMap();
  function decode(value=''){
    if(typeof value!=='string'||value.length>1215)throw new Error('Invalid signature');
    if(!value)return [];
    const chunks=value.split('.');let total=0;
    if(chunks.length>maxStrokes)throw new Error('Too many signature strokes');
    return chunks.map(chunk=>{
      if(chunk.length<6||chunk.length%3||!/^[A-Za-z0-9_-]+$/.test(chunk))throw new Error('Invalid signature stroke');
      const points=[];
      for(let i=0;i<chunk.length;i+=3){
        const code=alphabet.indexOf(chunk[i])*4096+alphabet.indexOf(chunk[i+1])*64+alphabet.indexOf(chunk[i+2]);
        const x=code>>8,y=code&255;if(x>600||y>180||++total>maxPoints)throw new Error('Invalid signature point');points.push([x,y]);
      }
      return points;
    });
  }
  function encode(strokes){return strokes.map(stroke=>stroke.map(([x,y])=>{const n=(Math.round(x)<<8)+Math.round(y);return alphabet[(n>>12)&63]+alphabet[(n>>6)&63]+alphabet[n&63];}).join('')).join('.');}
  function pathData(points){
    if(!points.length)return '';
    let d=`M${points[0][0]} ${points[0][1]}`;
    for(let i=1;i<points.length-1;i++){const a=points[i],b=points[i+1];d+=`Q${a[0]} ${a[1]} ${(a[0]+b[0])/2} ${(a[1]+b[1])/2}`;}
    const last=points.at(-1);return d+`L${last[0]} ${last[1]}`;
  }
  function path(points){const node=document.createElementNS(ns,'path');node.setAttribute('d',pathData(points));node.setAttribute('pathLength','1');return node;}
  function render(host,value){
    if(rendered.get(host)===value)return;const strokes=decode(value);host.replaceChildren(...strokes.map(path));host.toggleAttribute('hidden',!strokes.length);rendered.set(host,value);
  }
  function simplify(points){
    if(points.length<3)return points;
    const output=[points[0]];
    for(let i=1;i<points.length-1;i++){
      const [a,b,c]=[output.at(-1),points[i],points[i+1]];
      const length=Math.hypot(c[0]-a[0],c[1]-a[1]);
      const distance=length?Math.abs((c[1]-a[1])*b[0]-(c[0]-a[0])*b[1]+c[0]*a[1]-c[1]*a[0])/length:Math.hypot(b[0]-a[0],b[1]-a[1]);
      if(distance>1.25||Math.hypot(b[0]-a[0],b[1]-a[1])>18)output.push(b);
    }
    output.push(points.at(-1));return output;
  }
  function mount(svg,{onChange=()=>{}}={}){
    let strokes=[],active=null,points=[],strokeNode=null;
    const undo=document.getElementById('signature-undo'),clear=document.getElementById('signature-clear'),status=document.getElementById('signature-status');
    function sync(){
      svg.replaceChildren(...strokes.map(path));undo.disabled=clear.disabled=!strokes.length;
      status.textContent=strokes.length?`${strokes.length} nét ký · chữ ký sẽ đi cùng thiệp.`:'Dùng ngón tay hoặc chuột để ký. Bạn cũng có thể nhập lời ký ở trên.';
    }
    function emit(){onChange(encode(strokes));}
    function finish(event){
      if(active===null||(event&&event.pointerId!==active))return;
      const id=active;active=null;
      if(!event||event.type==='pointercancel'||event.type==='lostpointercapture'){points=[];sync();}
      else{if(points.length===1)points.push([...points[0]]);if(points.length>=2)strokes.push(simplify(points));points=[];sync();emit();}
      if(svg.hasPointerCapture(id))svg.releasePointerCapture(id);
    }
    function add(event){
      const r=svg.getBoundingClientRect(),x=Math.round(Math.max(0,Math.min(600,(event.clientX-r.left)/r.width*600))),y=Math.round(Math.max(0,Math.min(180,(event.clientY-r.top)/r.height*180)));
      const previous=points.at(-1);if(previous&&Math.hypot(previous[0]-x,previous[1]-y)<1.5)return;
      if(strokes.reduce((n,s)=>n+s.length,0)+points.length>=maxPoints){status.textContent='Nét ký đã đủ dài. Nhấc tay, hoàn tác hoặc ký lại nếu muốn.';return;}
      points.push([x,y]);strokeNode.setAttribute('d',pathData(points));
    }
    function down(event){
      if(active!==null||event.button!==0)return;
      if(strokes.length>=maxStrokes||strokes.reduce((n,s)=>n+s.length,0)>=maxPoints-1){status.textContent='Đã đủ nét ký. Hoàn tác hoặc xóa để ký lại.';return;}
      if(event.cancelable)event.preventDefault();active=event.pointerId;points=[];strokeNode=path([]);svg.append(strokeNode);svg.setPointerCapture(active);add(event);
    }
    function move(event){if(event.pointerId!==active)return;if(event.cancelable)event.preventDefault();add(event);}
    function undoInk(){finish();strokes.pop();sync();emit();}
    function clearInk(){finish();strokes=[];sync();emit();}
    svg.addEventListener('pointerdown',down);svg.addEventListener('pointermove',move);
    for(const type of ['pointerup','pointercancel','lostpointercapture'])svg.addEventListener(type,finish);
    const hiddenHandler=()=>{if(document.hidden)finish();},exitHandler=()=>finish();
    document.addEventListener('visibilitychange',hiddenHandler);window.addEventListener('pagehide',exitHandler);
    undo.addEventListener('click',undoInk);clear.addEventListener('click',clearInk);sync();
    return {setValue(value){if(value===encode(strokes)&&active===null)return;finish();strokes=decode(value);sync();},destroy(){finish();document.removeEventListener('visibilitychange',hiddenHandler);window.removeEventListener('pagehide',exitHandler);svg.removeEventListener('pointerdown',down);svg.removeEventListener('pointermove',move);for(const type of ['pointerup','pointercancel','lostpointercapture'])svg.removeEventListener(type,finish);undo.removeEventListener('click',undoInk);clear.removeEventListener('click',clearInk);}};
  }
  window.CardSignature=Object.freeze({decode,encode,render,mount});
})();
