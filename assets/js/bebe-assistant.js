/* A private, local guide to this card studio. No remote model or chat requests. */
(() => {
  'use strict';
  const clean=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[đĐ]/g,'d').toLowerCase().trim();
  const groups={mom:'Mẹ',grandma:'Bà',teacher:'Cô giáo',sister:'Chị / em gái',women:'Bạn nữ / nhóm phụ nữ',lover:'Người thương'};
  function targetFor(q){return [[/nguoi thuong|nguoi yeu|tinh yeu/,'lover'],[/co giao|giao vien|(?:cho|gui|tang|den|loi chuc)\s+co\b|^co$/,'teacher'],[/\bme\b/,'mom'],[/\bba\b/,'grandma'],[/chi gai|em gai|chi em/,'sister'],[/ban nu|ban be|phu nu|nhom/,'women']].find(([r])=>r.test(q))?.[1];}
  const faq=[
    [/thiep cua (toi|minh)|dang chon gi|tom tat thiep|nhac dang chon/,'help',c=>`Thiệp hiện gửi ${groups[c.target]||'người nhận'}, xưng ${c.pronoun||'mình'} – ${c.recipientPronoun||'bạn'}. Mẫu: ${CardThemes.catalog[c.experience]?.name||'thiệp cổ điển'}. Nhạc gửi: ${groups[c.musicGroup||c.target]||'theo người nhận'} · bài ${Number(c.musicId?.split(':')[1]||0)+1}. Nhạc lúc viết vẫn theo nhóm người nhận. Bạn có thể chỉnh từng mục hoặc cùng mình tạo một bản nháp mới.`],
    [/mon qua dau|dau tien|mo lien ket|mo link|trinh tu|hanh trinh|sau bo hoa|khi mo thiep/,'journey',c=>c.welcome==='none'?`Với thiết lập hiện tại, người nhận thấy ${c.arrival==='classic'?'cảnh mở của mẫu thiệp':'bó hoa '+(c.arrival==='stardust'?'kết từ hạt sáng':'mọc lên rồi nở')+' trước'}. Sau khi chạm mở, cảnh của mẫu chạy rồi lời chúc hiện ra; cảnh và hiệu ứng vẫn ở lại cạnh thiệp.`:'Với thiết lập hiện tại: bé B chào trước → trao bó hoa → người nhận chạm hoa → cảnh mở của mẫu đã chọn → đọc thiệp. Cảnh và hiệu ứng vẫn ở lại cùng lời chúc. Bạn có thể tắt màn chào hoặc đổi kiểu hoa ở phần màn chào và bó hoa.'],
    [/nhac.*(mat|thieu|khong nghe|khong co)|khong.*nhac/,'music','Nếu thiếu bài, web sẽ báo ngay trong danh sách. Thêm đúng tệp assets/music/0me.mp3…5me.mp3 (ba, co, chi, nu, yeu cho các nhóm khác), rồi chọn kiểm tra lại nhạc. Điện thoại có thể yêu cầu người nhận chạm Bật nhạc; web không thể vượt quyền tự phát của trình duyệt.'],
    [/doi nhom.*nhac|nhom nhac|nhac.*nhom|nhac cho nguoi nhan|chon bai/,'music','Ngay tại “Nhạc cho người nhận”, mở “Chọn nhóm nhạc cho tấm thiệp”. Chỉ chọn nhóm khác khi bạn muốn tìm bài ngoài nhóm của người nhận. Chọn một trong sáu bài rồi Nghe thử. Nhóm, bài và âm lượng được gửi cùng thiệp; người nhận và cách xưng hô vẫn giữ nguyên.'],
    [/nhac lam thiep|ngau nhien|random/,'studio','Nhạc làm thiệp chọn ngẫu nhiên trong nhóm người nhận hiện tại, chỉ phát khi bạn bấm bật. Đổi bài ngẫu nhiên tránh lặp ngay bài vừa nghe. Đây là nhạc lúc viết, không thay bài bạn chọn để gửi.'],
    [/nhac chao|hop nhac|nhac.*be b/,'welcome','Bật “Nhạc hộp nhạc cho màn chào” để dùng nhạc chào riêng. Khi bé B trao hoa, âm thanh chuyển sang bản bạn chọn cho người nhận. Trên máy chặn tự phát, người nhận chạm nút bật nhạc nhé.'],
    [/am luong|to qua|nho qua/,'music','Âm lượng nhạc lúc viết có thanh riêng. Âm lượng gửi cho người nhận nằm trong phần nhạc của thiệp. Khi đổi bản nghe thử, web chỉ dùng một trình phát để tránh chồng nhạc.'],
    [/nhac|bai hat|am nhac/,'music','Có ba phần: nhạc làm thiệp ngẫu nhiên theo người nhận; nhạc hộp nhạc cho màn chào; và bài bạn chọn gửi cùng thiệp. Ngay “Nhạc cho người nhận” có bộ đổi nhóm độc lập, sáu bài mỗi nhóm và nút nghe thử.'],
    [/lien ket|duong dan|url|rut ngan|link dai|sao chep|chia se|gui thiep/,'share','Liên kết chứa nội dung và tùy chỉnh để người khác mở được, nên lời dài hoặc chữ ký vẽ sẽ làm link dài hơn. Web tự nén và bỏ dữ liệu mặc định. Sau khi mở thiệp, dùng Chia sẻ hoặc Sao chép liên kết. Muốn ngắn hơn nữa, mở hướng dẫn rút gọn rồi tự dùng dịch vụ rút gọn; web không tự gửi nội dung riêng tư sang đó.'],
    [/rieng tu|bao mat|luu o dau|may chu|mat khau|ai doc/,'privacy','Thiệp và câu hỏi bé B được xử lý ngay trên trình duyệt, không gửi tới dịch vụ AI. Liên kết chia sẻ chứa nội dung thiệp: ai có link cũng đọc được, kể cả lời nhắn ẩn; không có mật khẩu. Đổi thiết bị cần gửi cả liên kết; trang này không có tài khoản hay kho lưu thiệp trên máy chủ.'],
    [/cay hoa|loi nhan.*hoa|bong hoa|sach|buc giang/,'themes','Gửi cô, mình gợi ý Cây hoa tri ân (chạm năm bông đọc lời nhắn), Trang sách biết ơn (sách mở thành vườn giấy), Bảng phấn ngân hà và Bài giảng nở hoa. Cây hoa mang lời nhắn và Cuốn sách cổ tích cũ vẫn còn trong thư viện. Các lời nhắn trên hoa sửa được ở “Chi tiết riêng của món quà”.'],
    [/bo hoa|hat sang|bung no|hoa moc|canh mo/,'arrival','“Bó hoa từ ngàn hạt sáng” gom hạt thành hoa; “Bó hoa mọc lên và bung nở” cho cành hoa vươn lên. Nút xem thử từng kiểu chạy đúng cảnh người nhận sẽ thấy. Sau khi chạm hoa, cảnh mở riêng của mẫu tiếp nối rồi ở lại bên lời chúc.'],
    [/be b|loi thoai|nhan vat|loi chao|nguoi dua qua|noi nhanh/,'welcome','Trong màn chào, bạn đổi tên người đưa quà và chọn Tự viết từng câu: 2–8 câu, mỗi câu tối đa 160 ký tự. Câu cuối đi cùng bó hoa. Người nhận có thể dừng, đọc tiếp hoặc quay lại; câu dài được giữ lâu hơn. Bạn có thể xem thử hoặc bỏ qua màn chào.'],
    [/ky ten|chu ky|ky tay|chu viet tay/,'signature','Phần chữ ký cho viết tên/lời ký hoặc vẽ bằng chuột, ngón tay. Có kiểu chữ ký để chọn, nút xóa nét và lựa chọn hiện chữ ký trên giấy. Chữ ký vẽ nhiều nét làm liên kết dài hơn một chút.'],
    [/xung ho|anh chuc ban|chi gai|em gai|doi nguoi|doi doi tuong/,'recipient','Đổi người nhận ở đầu trang để chọn đúng nhóm. Chị / em gái có lựa chọn riêng; bạn nữ có một người hoặc nhóm. Trong lời chúc, chọn cặp xưng hô hoặc sửa cả cách tự xưng và gọi người nhận. Lời mẫu đổi theo cặp đó; lời bạn tự viết cần tự kiểm tra lại.'],
    [/ten nguoi|ten toi|ten gui|ten nhan|nguoi gui/,'names','Tên người gửi để trống mặc định, không tự gợi tên chủ web. Bạn điền tên người gửi và tên người nhận ở phần lời chúc; tên nhân vật đưa quà là một ô riêng trong màn chào.'],
    [/loi chuc|viet gi|cam dong|lang man|tinh cam/,'words','Mỗi nhóm có lời gợi ý riêng và các giọng phù hợp. Người thương có lời tình cảm; mẹ, bà, cô dùng cách xưng hô riêng. Dùng nút trước/sau để đổi lời, viết lời nhắn riêng hoặc thay toàn bộ nội dung ở phần tự thiết kế. Muốn mình hỏi từng bước, bấm Cùng tạo thiệp; mình sẽ dùng đúng nhóm bạn đã chọn.'],
    [/loi nhan rieng|noi dung|tu viet|viet loi|chinh chu/,'words','Bạn có thể thêm lời nhắn riêng bên dưới lời mẫu, hoặc thay toàn bộ lời chúc bằng nội dung tự viết. Khi đổi mẫu, phần bạn đã tự viết được giữ; dùng Quay về lời chúc gợi ý để dùng lời mẫu lại.'],
    [/bi mat|an loi|dieu muon noi|loi nhan an/,'secret','“Một điều muốn nói” tạo nút riêng trong thiệp, chạm mới hiện lời nhắn. Đây là cách mở bất ngờ, không có mật khẩu: ai có liên kết đều có thể mở.'],
    [/mau sac|bang mau|doi mau|phong chu|co chu|bo cuc|giay|diem xuyet|ngay 20|hien ngay/,'design','Phần tùy chỉnh giấy có bảng màu, phông và cỡ chữ, bố cục, điểm xuyết, hiện ngày 20.10 và chữ ký. Bản xem trước cập nhật ngay. Mẫu không gian quyết định cảnh bên ngoài; các nút này đổi phần giấy và chữ.'],
    [/hieu ung|lap lanh|buom|trai tim|cuong do|chuyen dong|lag|muot/,'effects','Hiệu ứng có cánh hoa, bướm, đom đóm, trái tim, bong bóng và sao, cùng mức nhẹ/vừa/điện ảnh/tắt. Cảnh mở chạy một lần, rồi chuyển sang chuyển động nhẹ khi đọc. Máy chậm nên chọn Nhẹ; cài đặt giảm chuyển động của thiết bị cũng được tôn trọng. Có nút xem thử để so sánh.'],
    [/xem thu|xem truoc|thu thiep|mo thiep ngay|xem lai|lam lai/,'preview','Xem cảnh mở cho xem đúng mẫu đang cân nhắc; Xem thử màn chào hoặc Mở thiệp yêu thương cho xem cả hành trình. Trong trang nhận thiệp có nút xem lại và Tạo một tấm thiệp để quay về làm thiệp mới.'],
    [/mau|chu de|khong gian|loc|goi y/,'themes',c=>`Có ${Object.keys(CardThemes.catalog).length} không gian. Với ${groups[c.target]||'người nhận'}, mình gợi ý ${CardRecommendations.idsFor(c.target).slice(0,3).map(id=>CardThemes.catalog[id].name).join(', ')}. Bộ lọc có từng nhóm người nhận và cảm xúc. Lọc chỉ đổi các mẫu đang xem; những mẫu cũ vẫn ở Tất cả không gian.`],
    [/dien thoai|iphone|android|man hinh|ban phim/,'mobile','Thiệp dùng được trên điện thoại: chạm hoa để mở, chạm hoa có số để đọc lời nhắn, dùng ngón tay ký tên. Bé B nằm ở góc và có thể thu gọn. Nếu máy chậm, chọn hiệu ứng Nhẹ; nếu nhạc chưa phát, chạm bật nhạc.'],
    [/github|pages|trien khai|phien ban cu/,'deploy','Website chạy trên GitHub Pages. Mã mới chỉ lên trang chính sau khi nhánh được merge vào main và Pages triển khai xong. Nếu còn bản cũ, tải lại trang hoặc mở cửa sổ riêng tư. Nội dung từng thiệp nằm trong link bạn gửi.'],
    [/xoa|khoi phuc|mac dinh|dat lai/,'design','Nút khôi phục tùy chỉnh đưa giấy và hiệu ứng về mẫu đã chọn, giữ nội dung cá nhân và chữ ký. Đổi mẫu cũng giữ lời bạn đã viết. Nếu muốn thay lời riêng bằng gợi ý, chọn Quay về lời chúc gợi ý.'],
    [/huong dan|giup gi|lam duoc gi|toan bo|cach dung/,'help','Mình hướng dẫn ngay trên trang: người nhận, lời chúc/xưng hô, mẫu/cảnh mở, hoa, nhạc, lời nhân vật, chữ ký, hiệu ứng và chia sẻ. Mình còn hỏi từng bước và điền bản nháp thiệp cho bạn. Bấm Cùng tạo thiệp theo người nhận đang chọn, hoặc hỏi “Món quà đầu tiên khi mở liên kết là gì?”.']
  ];
  function resolveTheme(text,target){
    const q=clean(text).replace(/[.!?]/g,'').trim(),ids=Object.keys(CardThemes.catalog);
    const exact=ids.find(id=>clean(CardThemes.catalog[id].name)===q||id===q);
    if(exact)return exact;
    const named=ids.find(id=>q.includes(clean(CardThemes.catalog[id].name)));
    if(named)return named;
    const aliases=[[/ngan ha|vu tru|mau den|nen den|^den$/ ,target==='lover'?'lovegalaxy':'galaxy'],[/sach|trang giay/,target==='teacher'?'teachingbook':'storybook'],[/cay hoa|cay loi nhan/,target==='teacher'?'teacherbloom':'wishtree'],[/bang phan|buc giang|giang bai/,'classroom'],[/om con|me om|vong tay/,'motherhug'],[/tra.*ba|ba.*tra/,'grandmatea'],[/xanh|vuon/,'garden'],[/hoa hong|mau hong/,'rose'],[/sen/,'lotus'],[/khinh khi cau/,'balloon'],[/tim pha le/,'crystal']];
    const alias=aliases.find(([pattern])=>pattern.test(q));if(alias)return alias[1];
    const mood=[[/lang man|tinh cam/,'romantic'],[/lap lanh|ky ao/,'fantasy'],[/diu dang|am ap|nhe nhang/,'gentle'],[/vui|ruc ro|tuoi sang/,'bright'],[/thanh nha|trang nha/,'elegant']].find(([r])=>r.test(q))?.[1];
    return mood?CardRecommendations.idsFor(target).find(id=>(CardThemes.catalog[id].moods||[]).includes(mood)):null;
  }
  function mount({getContext=()=>({}),onAction=()=>{}}={}){
    const $=id=>document.getElementById(id),host=$('studio-helper'),panel=$('studio-helper-copy'),toggle=$('studio-helper-toggle'),log=$('studio-helper-log'),input=$('studio-helper-input');
    const replies=document.createElement('div');replies.className='helper-replies';replies.setAttribute('aria-label','Gợi ý trả lời bé B');$('studio-helper-chat').before(replies);
    const example=document.createElement('p');example.id='helper-step-example';example.className='helper-step-example';example.hidden=true;replies.after(example);input.setAttribute('aria-describedby',example.id);
    const preview=document.createElement('section');preview.className='helper-draft-preview';preview.id='helper-draft-preview';preview.hidden=true;preview.setAttribute('aria-label','Thiệp nháp đang tạo');
    preview.innerHTML='<div class="helper-draft-art" aria-hidden="true"></div><div class="helper-preview-paper"><p class="helper-preview-kicker">THIỆP NHÁP · CHƯA ÁP DỤNG</p><strong class="helper-preview-recipient"></strong><p class="helper-preview-body"></p><p class="helper-preview-message"></p><em class="helper-preview-signature"></em><p class="helper-preview-meta"></p></div><details class="helper-preview-details"><summary>Đọc đủ lời trên thiệp nháp</summary><p></p></details>';
    log.before(preview);const picture=preview.querySelector('.helper-draft-art');let pictured='';
    const progress=document.createElement('p');progress.className='helper-step-title';progress.hidden=true;progress.setAttribute('role','status');preview.before(progress);
    const submit=$('studio-helper-chat').querySelector('button[type=submit],button:not([type])');
    const nudge=document.createElement('div');nudge.className='helper-nudge';nudge.hidden=true;
    const greeting=document.createElement('button');greeting.type='button';greeting.className='helper-nudge-message';
    const dismiss=document.createElement('button');dismiss.type='button';dismiss.className='helper-nudge-close';dismiss.textContent='×';dismiss.setAttribute('aria-label','Ẩn lời chào và trò vui chủ động của bé B');nudge.append(greeting,dismiss);host.append(nudge);
    for(const face of host.querySelectorAll('.helper-face')){
      const glasses=document.createElementNS('http://www.w3.org/2000/svg','svg');glasses.classList.add('helper-glasses');glasses.setAttribute('viewBox','0 0 100 60');glasses.setAttribute('aria-hidden','true');
      glasses.innerHTML='<path class="helper-shade-frame" d="M3 13Q23 8 44 13L50 17 56 13Q77 8 97 13L95 20H91L86 36Q70 44 59 34L55 21Q50 18 45 21L41 34Q28 44 13 36L8 20H4Z"/><path class="helper-shade-glint" d="m15 17 10 15m-3-16 10 15m32-15 10 15"/>';
      const ball=document.createElement('span');ball.className='helper-toy-ball';ball.setAttribute('aria-hidden','true');ball.innerHTML='<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#f2b3c6" stroke="#fff3d5" stroke-width="2"/><path d="M3 20h34M20 2c-13 10-13 26 0 36M20 2c13 10 13 26 0 36" fill="none" stroke="#fff3d5" stroke-width="2"/><ellipse cx="14" cy="10" rx="7" ry="3" fill="#fff" opacity=".45"/></svg>';
      const stars=document.createElement('span');stars.className='helper-dizzy-stars';stars.textContent='✦  ✧';stars.setAttribute('aria-hidden','true');const phone=document.createElement('span');phone.className='helper-selfie-phone';phone.setAttribute('aria-hidden','true');
      phone.innerHTML='<svg viewBox="0 0 90 110"><path d="M3 89Q19 68 36 75" fill="none" stroke="#86ecd7" stroke-width="8" stroke-linecap="round"/><g transform="rotate(-9 57 49)"><rect x="33" y="6" width="47" height="83" rx="9" fill="#bda9d0" stroke="#efe1f9" stroke-width="2"/><rect x="37" y="10" width="39" height="75" rx="6" fill="#d7c6e2"/><rect x="39" y="14" width="18" height="24" rx="5" fill="#9987b2"/><circle cx="45" cy="21" r="4" fill="#27344d"/><circle cx="51" cy="31" r="4" fill="#27344d"/><circle cx="53" cy="18" r="2" fill="#fff0b2"/><path d="M57 66C37 54 46 43 57 52C68 43 77 54 57 66Z" fill="#fbebed"/><path d="M44 80h25" stroke="#a38db7" stroke-width="2" stroke-linecap="round"/></g><ellipse cx="34" cy="76" rx="7" ry="10" fill="#b1ffe7"/></svg>';
      const flash=document.createElement('span');flash.className='helper-selfie-flash';flash.setAttribute('aria-hidden','true');
      const sparkle=document.createElement('span');sparkle.className='helper-selfie-sparkle';sparkle.textContent='✧';sparkle.setAttribute('aria-hidden','true');face.append(glasses,ball,stars,phone,flash,sparkle);
    }
    let opened=false,visible=false,expression=0,idle=0,nudgeTimer=0,nudges=0,acts=0,dismissed=false,draft=null,step=0,lastApplied=false,applying=false,baseTarget='',otherMusic=false,drawing=false;
    const fullStages=['recipient','recipientName','senderName','theme','words','message','arrival','music','signature'];
    const quickStages=['recipient','senderName','theme','message'];let stages=fullStages,quick=false,startOffset=0,composing=false,logFrame=0;
    const moods=['happy','curious','shy','love','wink','sleep'];let moodIndex=0;
    const labelFor=target=>groups[CardRecommendations.groupFor(target)]||'người nhận';
    const scopedTarget=()=>draft?.target||getContext().target||'mom';
    function append(text,user=false){
      const p=document.createElement('p');p.className='helper-bubble'+(user?' helper-user':'');p.textContent=text;log.append(p);
      while(log.children.length>12)log.firstElementChild.remove();log.scrollTop=log.scrollHeight;
    }
    function choices(items){
      replies.replaceChildren();replies.scrollLeft=0;
      const answers=document.createElement('div');answers.className='helper-answer-options';
      const tools=document.createElement('div');tools.className='helper-step-tools';
      for(const [label,fn] of items){
        const button=document.createElement('button');button.type='button';button.textContent=label;button.addEventListener('click',fn);
        if(['Bỏ qua','Quay lại','Hủy bản nháp'].includes(label)){
          button.dataset.stepAction=label==='Bỏ qua'?'skip':label==='Quay lại'?'back':'cancel';tools.append(button);
        }else answers.append(button);
      }
      if(answers.children.length)replies.append(answers);if(tools.children.length)replies.append(tools);updateStep();scrollConversation();
    }
    function scrollConversation(){
      if(logFrame)cancelAnimationFrame(logFrame);logFrame=requestAnimationFrame(()=>{log.scrollTop=log.scrollHeight;logFrame=0;});
    }
    function updateStep(){
      progress.hidden=!draft;
      if(!draft){submit.textContent='Gửi';submit.setAttribute('aria-label','Gửi câu hỏi cho bé B');input.enterKeyHint='send';return;}
      const key=stages[step],first=startOffset,total=stages.length-first;
      progress.textContent=key?`${quick?'Tạo nhanh':'Cùng tạo thiệp'} · ${Math.max(1,step-first+1)} / ${total}`:'Xem lại thiệp · sẵn sàng gửi';
      submit.textContent=key?'Tiếp':'Gửi';submit.setAttribute('aria-label',key?'Tiếp tục tạo thiệp':'Gửi yêu cầu chỉnh bản nháp');input.enterKeyHint=key?'next':'send';
    }
    function contextExample(){
      const data=onAction('preview-draft',{target:scopedTarget(),variant:draft?.variant||getContext().variant});
      return {you:data?.recipient?.replace(/,$/,'')||labelFor(scopedTarget()),greeting:data?.greeting||'Chúc người nhận một ngày thật vui.'};
    }
    function setExample(text,placeholder='Bạn muốn hỏi hoặc chỉnh điều gì?'){
      example.textContent=text;example.hidden=!text;input.placeholder=placeholder;
    }
    function syncPreview(typing=false){
      if(!draft){preview.hidden=true;return;}
      const tentative={...draft},key=stages[step],value=input.value.normalize('NFC').trim();
      if(typing&&value){
        const name={recipientName:'recipientName',senderName:'senderName',words:'body',message:'message',signature:'signatureText'}[key];
        if(name)tentative[name]=value.slice(0,key==='signature'?80:key==='words'||key==='message'?1000:100);
        else if(key==='theme'){const theme=resolveTheme(value,tentative.target);if(theme)tentative.theme=theme;}
      }
      const card=onAction('preview-draft',tentative);if(!card)return;
      preview.hidden=false;preview.dataset.palette=card.palette;preview.dataset.theme=card.theme;
      if(pictured!==card.theme){pictured=card.theme;picture.innerHTML=CardThemes.renderArt(card.theme,'thumb');}
      for(const [selector,text] of [['.helper-preview-recipient',card.recipient],['.helper-preview-body',card.greeting],['.helper-preview-message',card.message],['.helper-preview-signature',card.signature],['.helper-preview-meta',`${CardThemes.catalog[card.theme].name} · Nhạc ${labelFor(card.musicGroup)} ${card.track+1}`]])preview.querySelector(selector).textContent=text;
      preview.querySelector('.helper-preview-details p').textContent=[card.recipient,card.greeting,card.message,card.signature].filter(Boolean).join('\n\n');
    }
    function clearPose(){host.dataset.expression='idle';host.dataset.outfit='';host.dataset.act='';}
    function react(mood){
      clearTimeout(expression);host.dataset.expression=mood;
      if(visible&&!document.hidden)expression=setTimeout(()=>{clearPose();expression=0;},5500);
    }
    function play(kind){
      react(kind==='ball'?'shy':kind==='heart'?'love':kind==='selfie'?'happy':'wink');host.dataset.outfit=kind==='glasses'?'glasses':'';host.dataset.act=kind;
      return kind==='selfie'?'Một, hai, ba… cười xinh nè! 📸 Tớ chụp một tấm làm kỷ niệm nha!':kind==='ball'?'Tớ tung bóng nè… úi, trúng đầu rồi! Vẫn ngầu, vẫn ngầu mà!':kind==='heart'?'Tặng bạn một trái tim nhỏ. Hôm nay bạn cũng xứng đáng được yêu thương ♡':'Thấy tớ ngầu hông? 😎';
    }
    function syncViewport(){
      const v=window.visualViewport,inset=opened&&visible&&v?Math.max(0,innerHeight-v.height-v.offsetTop):0;
      host.style.setProperty('--helper-keyboard',`${inset}px`);host.style.setProperty('--helper-visible-height',`${v?.height||innerHeight}px`);const keyboard=String(inset>100),compact=String(Boolean(opened&&v&&v.height<360)),changed=host.dataset.keyboard!==keyboard||host.dataset.compact!==compact;host.dataset.keyboard=keyboard;host.dataset.compact=compact;if(opened&&changed)scrollConversation();
    }
    function eligible(){return visible&&!document.hidden&&!opened&&!draft&&!drawing&&!dismissed&&acts<6&&!/INPUT|TEXTAREA|SELECT|CANVAS/.test(document.activeElement?.tagName||'');}
    function stopTimers(){if(logFrame)cancelAnimationFrame(logFrame);logFrame=0;clearTimeout(idle);clearTimeout(expression);clearTimeout(nudgeTimer);idle=expression=nudgeTimer=0;nudge.hidden=true;clearPose();}
    function schedule(){
      clearTimeout(idle);idle=0;if(!eligible())return;
      idle=setTimeout(()=>{
        idle=0;if(!eligible())return;
        const line=acts===0?'Hello! Mình là bé B. Mình có thể giúp gì cho bạn?':play(['glasses','selfie','ball','heart','selfie'][acts-1]);
        if(acts===0)react('happy');acts++;
        if(nudges<4){greeting.textContent=line;nudge.hidden=false;nudges++;}
        nudgeTimer=setTimeout(()=>{nudge.hidden=true;nudgeTimer=0;schedule();},5500);
      },acts===0?2400:acts<4?3000:12000);
    }
    function setOpen(value,focus=false){
      opened=value;nudge.hidden=true;clearTimeout(idle);idle=0;clearTimeout(nudgeTimer);nudgeTimer=0;
      panel.hidden=!value;host.classList.toggle('helper-open',value);toggle.setAttribute('aria-expanded',String(value));syncViewport();
      if(value){react('happy');log.scrollTop=log.scrollHeight;if(focus)input.focus({preventScroll:true});}
      else{if(panel.contains(document.activeElement))document.activeElement.blur();if(focus)toggle.focus({preventScroll:true});schedule();}
    }
    function navigate(topic){setOpen(false);onAction('focus',topic);}
    function starter(){setExample('','Ví dụ: giúp tạo thiệp cho '+labelFor(scopedTarget()).toLocaleLowerCase('vi')+'…');choices([['Tạo nhanh',()=>startQuick('')],['Cùng tạo thiệp',()=>start('')],['Các mục trên web',()=>info('hướng dẫn toàn bộ')],['Chơi với bé B',toys]]);}
    function toys(){
      append('Bạn chọn một trò nhé. Mình không bật âm thanh đâu, chỉ nghịch một chút thôi ♡');
      choices([['Kính đen 😎',()=>append(play('glasses'))],['Tự sướng 📸',()=>append(play('selfie'))],['Tung bóng',()=>append(play('ball'))],['Thả tim ♡',()=>append(play('heart'))],['Làm thiệp tiếp',()=>draft?ask():starter()]]);
    }
    function info(text,quick=false){
      const q=clean(text),context={...getContext(),target:scopedTarget()},match=faq.find(([r])=>r.test(q));
      if(draft){const card=onAction('preview-draft',draft);Object.assign(context,{pronoun:card.pronoun,recipientPronoun:card.recipientPronoun,welcome:'bebe',arrival:card.arrival,experience:card.theme,musicGroup:card.musicGroup,musicId:`${card.musicGroup}:${card.track}`});}
      if(!match){append('Mình có thể chọn mẫu theo màu/cảm xúc, đổi bài nhạc, chỉnh hiệu ứng, sửa tên và hướng dẫn từng mục trên web. Bạn thử “đổi mẫu sang ngân hà”, “chọn bài 3”, “tắt hiệu ứng” hoặc cùng mình tạo thiệp từng bước nhé.');react('curious');if(!draft)starter();return;}
      const [,topic,value]=match;if(topic==='themes'&&targetFor(q))context.target=targetFor(q);append(typeof value==='function'?value(context):value);react('curious');
      if(topic==='themes'&&quick)onAction('themes',targetFor(q)||context.target);
      if(!draft)choices([[topic==='help'?'Cùng tạo thiệp':'Đến mục này',()=>topic==='help'?start(''):navigate(topic)],['Cùng tạo thiệp',()=>start('')]]);
    }
    function startQuick(text){setOpen(true);start(text,{fast:true});}
    function start(text,{fast=false}={}){
      const q=clean(text),context=getContext(),target=targetFor(q)||(context.screen==='editor'?context.target:'');
      quick=fast;stages=fast?quickStages:fullStages;
      draft={target:target||'',variant:/em gai/.test(q)?'younger':/ban nu|ban be/.test(q)?'friend':target===context.target?context.variant||'':'',recipientName:'',senderName:'',theme:'',body:'',message:'',arrival:'growing',musicGroup:'',track:0,signatureText:''};
      if(fast){draft.recipientName=target===context.target?context.recipientName||'':'';draft.tone=target==='lover'?'romantic':'warm';}
      step=target?1:0;startOffset=step;input.value='';baseTarget=`${context.target}:${context.variant||''}`;lastApplied=false;otherMusic=false;host.dataset.wizard='true';
      append(fast?'Tớ lo phần phối thiệp nhé! Bạn chỉ cần tên người gửi, chọn cảnh và thêm một lời riêng nếu muốn. Thiệp nháp ở phía trên, xong rồi vẫn sửa được mọi chi tiết.':'Mình cùng tạo thiệp nhé! Thiệp nháp ngay phía trên sẽ đổi theo câu trả lời, chưa sửa thiệp chính. Bạn có thể bỏ qua, quay lại, nhờ mình sửa một mục hoặc hủy bất cứ lúc nào.');ask();
    }
    function musicOptions(){
      const target=draft.musicGroup||draft.target,label=labelFor(target);
      return [...Array.from({length:6},(_,i)=>[`${label} · Bài ${i+1}`,()=>receive(`bài ${i+1}`)]),['Chọn nhóm nhạc khác',()=>{
        otherMusic=true;append(`Đang chọn nhạc cho ${label}. Chỉ đổi nhóm nếu bạn muốn; người nhận thiệp vẫn là ${labelFor(draft.target)}.`);
        setExample(`Ví dụ: “nhạc cho ${labelFor(draft.target).toLocaleLowerCase('vi')} bài 3”.`);
        choices([...Object.entries(groups).map(([id,name])=>[name,()=>{draft.musicGroup=id===draft.target?'':id;otherMusic=false;ask();}]),['Giữ nhóm hiện tại',()=>{otherMusic=false;ask();}]]);
      }]];
    }
    function ask(){
      react('curious');otherMusic=false;const key=stages[step],target=scopedTarget(),label=labelFor(target),small=label.toLocaleLowerCase('vi');let prompt='',hint='',placeholder='',options=[];
      const examples={mom:{name:'Mẹ',signature:'Thương mẹ, An'},grandma:{name:'Ngoại',signature:'Cháu thương bà · An'},teacher:{name:'Cô Lan',signature:'Học trò của cô · An'},sister:{name:draft?.variant==='younger'?'Em Linh':'Chị Linh',signature:'Thương thật nhiều · An'},women:{name:draft?.variant==='group'?'Những người bạn quý mến':'Linh',signature:'Gửi một chút niềm vui · An'},lover:{name:'Em thương',signature:'Thương em · An'}}[CardRecommendations.groupFor(target)];
      if(key==='recipient'){prompt='Bạn muốn làm thiệp cho ai?';hint='Ví dụ: “Mẹ”, “Bà”, “Cô giáo”, “Em gái” hoặc “Người thương”.';options=Object.entries(groups).map(([,name])=>[name,()=>receive(name)]);}
      else if(key==='recipientName'){prompt=`Thiệp dành cho ${label}. Bạn muốn ghi tên hoặc gọi thân mật thế nào?`;hint=`Ví dụ: “${examples.name}”. Bỏ qua để giữ cách gọi theo nhóm.`;placeholder=`Ví dụ: ${examples.name}`;}
      else if(key==='senderName'){prompt=quick?'Tớ nên ghi tên người gửi là gì?':'Bạn muốn ghi tên người gửi là gì?';hint='Ví dụ: “An” hoặc “Hai chị em”. Bỏ qua nếu không muốn ghi tên.';placeholder='Ví dụ: An';}
      else if(key==='theme'){
        const themes=CardRecommendations.idsFor(target).slice(0,3);prompt=`Bạn thích khung cảnh nào cho ${small}?`;
        hint=`Ví dụ: “${CardThemes.catalog[themes[0]].name}”, “màu xanh dịu dàng” hoặc “nền đen ngân hà”.`;placeholder='Ví dụ: nền đen ngân hà';
        options=themes.map(id=>[CardThemes.catalog[id].name,()=>receive(CardThemes.catalog[id].name)]);
      }
      else if(key==='words'){prompt='Bạn tự viết lời chúc hay để mình chọn lời phù hợp?';hint=`Ví dụ: “${contextExample().greeting.slice(0,110)}…” Hoặc chọn lời gợi ý đúng cách xưng hô.`;placeholder='Viết lời chúc hoặc gõ “gợi ý”';options=[['Để bé B chọn lời gợi ý',()=>receive('gợi ý')]];}
      else if(key==='message'){prompt=quick?`Thêm một lời riêng cho ${small}, hay dùng lời tớ đã chọn nhé?`:`Có điều riêng muốn nhắn thêm cho ${small} không?`;if(quick)options=[['Dùng lời bé B đã chọn',()=>receive('gợi ý')]];hint=`Ví dụ: “Cảm ơn ${draft.target==='grandma'?'bà':draft.target==='teacher'?'cô':draft.target==='mom'?'mẹ':'người nhận'} đã luôn ở bên và lắng nghe.” Bỏ qua nếu đã đủ ý.`;placeholder='Một điều bạn muốn gửi riêng…';}
      else if(key==='arrival'){prompt='Bạn muốn bó hoa xuất hiện theo kiểu nào?';hint='Hạt sáng: các đốm sáng hội tụ thành hoa. Mọc nở: cành lớn dần rồi hoa hé cánh. Sau đó mới mở cảnh và lời chúc.';options=[['Hoa từ hạt sáng',()=>receive('hạt sáng')],['Hoa mọc rồi nở',()=>receive('mọc lên')]];}
      else if(key==='music'){const musicLabel=labelFor(draft.musicGroup||target);prompt=`Chọn một trong sáu bài nhạc cho ${musicLabel.toLocaleLowerCase('vi')} nhé.`;hint=`Ví dụ: “bài 3”. Mặc định dùng nhạc ${small}; mở “Chọn nhóm nhạc khác” nếu muốn lấy bài từ nhóm khác.`;placeholder='Ví dụ: bài 3';options=musicOptions();}
      else if(key==='signature'){prompt='Bạn muốn ký lời gì cuối thiệp?';hint=`Ví dụ: “${examples.signature}” (tối đa 80 ký tự). Có thể bỏ qua và ký tay sau.`;placeholder=`Ví dụ: ${examples.signature}`;}
      else return review();
      if(['recipient','theme','arrival','music'].includes(key)&&matchMedia('(max-width:620px)').matches)input.blur();
      append(prompt);setExample(hint,placeholder||'Nhập câu trả lời hoặc chọn bên dưới…');
      choices([...options,['Bỏ qua',()=>receive('bỏ qua')],...(step?[['Quay lại',back]]:[]),['Hủy bản nháp',cancel]]);syncPreview();
    }
    function back(){if(step>0){step--;startOffset=Math.min(startOffset,step);ask();}}
    function cancel(){draft=null;preview.hidden=true;host.dataset.wizard='false';append('Mình đã bỏ bản nháp. Tấm thiệp đang làm vẫn được giữ. Cứ gọi mình khi cần nhé.');react('shy');starter();}
    function review(){
      if(matchMedia('(max-width:620px)').matches)input.blur();
      draft.theme=draft.theme||CardRecommendations.idsFor(draft.target)[0];const effective=draft.musicGroup||draft.target;
      append(`BẢN NHÁP CỦA BẠN\nGửi: ${labelFor(draft.target)}${draft.recipientName?' · '+draft.recipientName:''}\nNgười gửi: ${draft.senderName||'(để trống)'}\nMẫu: ${CardThemes.catalog[draft.theme].name}\nLời chúc: ${draft.body||'Gợi ý đúng cách xưng hô của nhóm'}\nLời thêm: ${draft.message||'(không)'}\nNhạc: ${labelFor(effective)} · bài ${draft.track+1}\nChữ ký: ${draft.signatureText||draft.senderName||'(không ký)'}\nChưa đổi thiệp chính. Áp dụng sẽ tạo thiệp theo bản nháp; bạn có thể hoàn tác.`);
      setExample('Muốn sửa một mục, gõ ví dụ “đổi mẫu sang ngân hà” hoặc “đổi nhạc bài 2”.');choices([[quick?'Dùng thiệp này':'Áp dụng bản nháp',apply],...(quick?[['Chỉnh thêm nhạc / chữ ký',()=>{quick=false;stages=fullStages;step=stages.indexOf('music');ask();}]]:[]),['Quay lại',back],['Hủy bản nháp',cancel]]);syncPreview();react('love');
    }
    function apply(){
      if(!draft)return;applying=true;let ok;try{ok=onAction('apply-draft',{...draft});}finally{applying=false;}
      if(ok===false){append('Bản nháp chưa áp dụng được. Bạn thử chọn lại mẫu hoặc người nhận nhé.');return;}
      draft=null;preview.hidden=true;example.hidden=true;lastApplied=true;host.dataset.wizard='false';append('Mình đã điền thiệp cho bạn rồi! Bạn có thể nghe thử, sửa thêm hoặc xem toàn bộ hành trình trước khi gửi.');
      choices([['Xem thiệp vừa tạo',()=>{setOpen(false);onAction('preview');}],['Hoàn tác bản nháp',undo],['Đến phần nhạc',()=>navigate('music')]]);react('happy');
    }
    function undo(){if(lastApplied&&onAction('undo-draft')!==false){lastApplied=false;append('Đã khôi phục tấm thiệp trước lần chỉnh vừa rồi.');starter();}}
    function editCommand(text){
      const q=clean(text),target=scopedTarget();let edit=null,description='';
      if(/lam sao|the nao|o dau|la gi[?!.]*$/.test(q))return false;
      const theme=q.match(/^(?:hay |giup (?:toi|minh) )?(?:doi|chon|dung) (?:mau|chu de|khung canh)\s+(.+)/);
      if(theme){const id=resolveTheme(theme[1],target);if(!id){append('Mình chưa nhận ra mẫu đó. Bạn thử tên mẫu trong thư viện hoặc “ngân hà”, “màu xanh”, “quyển sách”, “mẹ ôm con” nhé.');return true;}edit={kind:'theme',value:id};description=`mẫu ${CardThemes.catalog[id].name}`;}
      const music=q.match(/^(?:(?:doi|chon|dung|lay)\s+)?(?:nhac\s+)?(?:bai\s+([1-6])|nhac\s+(?:cho\s+)?(.+?)(?:\s+bai\s+([1-6]))?)$/);
      if(!edit&&music&&(music[1]||music[3]||targetFor(q))){const group=targetFor(q)||draft?.musicGroup||getContext().musicGroup||target,index=Number(music[1]||music[3]||1)-1;edit={kind:'music',value:group,track:index};description=`nhạc ${labelFor(group)} · bài ${index+1}`;}
      if(!edit&&/^(tat|bo) hieu ung/.test(q)){edit={kind:'effect',value:'none'};description='tắt hiệu ứng hạt khi đọc';}
      if(!edit&&/^(giam hieu ung|hieu ung nhe hon|chuyen dong nhe hon)/.test(q)){edit={kind:'intensity',value:'gentle'};description='chuyển động mức nhẹ';}
      if(!edit&&/^(doi|chon|dung) hieu ung/.test(q)){
        const effect=[[/buom/,'butterflies'],[/trai tim/,'hearts'],[/sao|ngan ha/,'constellation'],[/dom dom/,'fireflies'],[/bong bong/,'bubbles'],[/canh hoa/,'petals']].find(([r])=>r.test(q));if(effect){edit={kind:'effect',value:effect[1]};description=`hiệu ứng ${q.replace(/^(doi|chon|dung) hieu ung\s*/,'')}`;}
      }
      const name=text.match(/^(?:đổi |đặt |sửa )?(tên người gửi|tên người nhận|tên bé B|tên nhân vật|chữ ký)\s*(?:(?:là|thành|sang)\s+|:\s*)(.+)$/iu);
      if(!edit&&name){const kind={'ten nguoi gui':'senderName','ten nguoi nhan':'recipientName','ten be b':'welcomeName','ten nhan vat':'welcomeName','chu ky':'signatureText'}[clean(name[1])],limit=kind==='welcomeName'?30:kind==='signatureText'?80:100;if(name[2].length>limit){append(`Phần này tối đa ${limit} ký tự nhé.`);return true;}edit={kind,value:name[2]};description=`${name[1]}: ${name[2]}`;}
      if(!edit)return false;
      if(draft){
        if(edit.kind==='theme')draft.theme=edit.value;
        else if(edit.kind==='music'){draft.musicGroup=edit.value===draft.target?'':edit.value;draft.track=edit.track;}
        else if(['senderName','recipientName','signatureText'].includes(edit.kind))draft[edit.kind]=edit.value;
        else{append('Bạn áp dụng bản nháp trước, rồi mình giúp chỉnh mục này trên thiệp chính nhé.');return true;}
        append(`Đã đổi ${description} trong bản nháp. Thiệp chính vẫn giữ nguyên.`);syncPreview();if(step>=stages.length)review();return true;
      }
      if(onAction('edit-card',edit)===false){append('Mình chưa chỉnh được mục này. Bạn thử lại bằng một tên mẫu hoặc số bài cụ thể nhé.');return true;}
      lastApplied=true;append(`Đã ${description}. Bạn có thể xem trên thiệp hoặc hoàn tác lần chỉnh này.`);react('happy');choices([['Hoàn tác thay đổi',undo],['Xem thiệp',()=>{setOpen(false);onAction('preview');}],['Chỉnh thêm',()=>info('hướng dẫn toàn bộ')]]);return true;
    }
    function receive(text){
      append(text,true);const q=clean(text);if(!draft)return answer(text);
      if(/^(huy|huy ban nhap|dung lai|thoat)$/.test(q))return cancel();if(/^(quay lai|cau truoc|tro lai)$/.test(q))return back();
      const key=stages[step],skip=/^(bo qua|khong|khong can|tuy be|goi y|de be b chon loi goi y|de be b chon|tuy ban|cho dep)$/.test(q);
      if(!skip&&!(key==='music'&&/\bbai\b/.test(q)&&!/\bmau\b/.test(q))&&editCommand(text))return;
      if(!key)return review();
      if(!skip&&/la gi|tai sao|the nao|cach .*|lam sao|co the giup gi|thiep cua (toi|minh)|dang chon gi|tom tat thiep|nhac dang chon/.test(q)){info(text);return;}
      let value=skip?'':text.trim(),limit=100;
      if(key==='recipient'){
        const target=targetFor(q)||Object.keys(groups).find(id=>clean(groups[id])===q);
        if(!target&&!skip){append('Bạn chọn một trong sáu nhóm bên dưới nhé.');return;}
        draft.target=target||getContext().target||'mom';if(quick)draft.tone=draft.target==='lover'?'romantic':'warm';draft.variant=/em gai/.test(q)?'younger':/ban nu|ban be/.test(q)?'friend':draft.variant;
      }else if(key==='theme'){
        const theme=skip?CardRecommendations.idsFor(draft.target)[0]:resolveTheme(text,draft.target);
        if(!theme){append('Mình chưa nhận ra khung cảnh đó. Bạn thử tên mẫu, màu sắc hoặc cảm xúc trong ví dụ phía dưới nhé.');return;}draft.theme=theme;if(quick)draft.arrival=['galaxy','lovegalaxy','aurora','moonlake','ocean','lantern','lightbridge','crystal','lotusmoon'].includes(theme)?'stardust':'growing';
      }else if(key==='arrival')draft.arrival=/hat|sao|lap lanh/.test(q)?'stardust':'growing';
      else if(key==='music'){
        const target=targetFor(q),num=q.match(/(?:bai\s*|^)([1-6])\b/);
        if(!skip&&!target&&!num&&!/theo nguoi nhan/.test(q)){append(`Bạn thử “bài 2” để dùng nhạc ${labelFor(draft.target)}, hoặc mở Chọn nhóm nhạc khác nhé.`);return;}
        if(target)draft.musicGroup=target===draft.target?'':target;else if(/theo nguoi nhan/.test(q))draft.musicGroup='';draft.track=num?Number(num[1])-1:0;
      }else{
        if(key==='words'||key==='message')limit=1000;else if(key==='signature')limit=80;
        if(['recipientName','senderName'].includes(key))value=value.replace(/^(?:(?:tên (?:tôi|mình|người gửi|người nhận)|tôi|mình) là|ghi là)\s+/iu,'');
        if(value.length>limit){append(`Phần này tối đa ${limit} ký tự. Bạn rút gọn một chút rồi gửi lại nhé; mình chưa chuyển câu hỏi.`);return;}
        draft[key==='words'?'body':key==='signature'?'signatureText':key]=value;
      }
      step++;ask();
    }
    function answer(text){
      const q=clean(text);
      if(/hoan tac/.test(q)&&lastApplied)return undo();
      if(/tu suong|selfie|chup anh|chup hinh|lay dien thoai/.test(q)){append(play('selfie'));return;}
      if(/tung bong|choi bong|nem bong/.test(q)){append(play('ball'));return;}
      if(/deo kinh|kinh den|dep trai|dep gai/.test(q)){append(play('glasses'));return;}
      if(/chan qua|lam tro|choi|choc|vui vui/.test(q)){toys();return;}
      if(/ngu ngon|buon ngu/.test(q)){react('sleep');append('Mình chợp mắt một chút thôi… bạn cứ thong thả viết nhé.');return;}
      if(/trai tim|thuong be/.test(q)&&!/hieu ung/.test(q)){append(play('heart'));return;}
      if(editCommand(text))return;
      if(/(?:tao|lam|can|muon).*(?:web|thiep)|(?:web|thiep).*giup/.test(q)&&!/cach |la gi|nhac|lien ket|hieu ung/.test(q))return /nhanh|don gian|de nhat/.test(q)?startQuick(text):start(text);
      if(/^(chao|hello|hi\b)/.test(q)){append(`Chào bạn! Hello, mình có thể giúp gì cho bạn? ${getContext().screen==='editor'?'Mình đang cùng bạn làm thiệp cho '+labelFor(scopedTarget())+'.':'Cùng chọn người nhận rồi làm thiệp nhé.'}`);react('happy');starter();return;}
      const target=targetFor(q);
      if(target&&target!==getContext().target&&/loi chuc|xung ho/.test(q)){append(`Bạn đang làm thiệp cho ${labelFor(getContext().target)}. Đổi người nhận ở đầu trang nếu muốn dùng lời chúc và cách xưng hô cho ${labelFor(target)}; lời riêng của bạn được giữ. Hoặc nhắn “Tạo thiệp cho ${labelFor(target)}” để mình hỏi từng bước.`);react('curious');return;}
      if(target&&/mau|goi y/.test(q)){info(`mẫu cho ${labelFor(target)}`,true);return;}info(text);
    }
    function contextChanged(){
      if(applying)return;
      const context=getContext();
      if(draft&&baseTarget!==`${context.target}:${context.variant||''}`&&context.screen==='editor'){
        append(`Bạn vừa chuyển sang ${labelFor(context.target)}. Mình bắt đầu lại phần hỏi cho đúng nhóm; thiệp chính và nội dung bạn đã nhập trên trang vẫn được giữ.`);start('',{fast:quick});return;
      }
      if(!draft&&!lastApplied)input.placeholder='Ví dụ: giúp tạo thiệp cho '+labelFor(context.target).toLocaleLowerCase('vi')+'…';
    }
    toggle.addEventListener('click',()=>setOpen(!opened));$('studio-helper-close').addEventListener('click',()=>setOpen(false,true));greeting.addEventListener('click',()=>setOpen(true));dismiss.addEventListener('click',()=>{dismissed=true;stopTimers();});
    host.addEventListener('click',e=>{
      const b=e.target.closest('[data-helper-topic]');if(!b)return;const topic=b.dataset.helperTopic;
      if(topic==='quick')return startQuick('');if(topic==='create')return start('');if(topic==='play'){react(moods[moodIndex++%moods.length]);toys();return;}
      const queries={themes:'mẫu gợi ý',words:'lời chúc',music:'nhạc làm thiệp',welcome:'lời thoại bé B',signature:'chữ ký'};info(queries[topic]||'hướng dẫn',true);if(topic!=='themes')onAction(topic);
    });
    input.addEventListener('input',()=>{if(draft)syncPreview(true);});
    input.addEventListener('compositionstart',()=>{composing=true;});input.addEventListener('compositionend',()=>{composing=false;});
    input.addEventListener('keydown',event=>{if(event.key==='Enter'&&(event.isComposing||composing))event.preventDefault();});
    $('studio-helper-chat').addEventListener('submit',e=>{e.preventDefault();if(composing)return;const text=input.value.normalize('NFC').trim();if(draft){const key=stages[step],limit={recipientName:100,senderName:100,words:1000,message:1000,signature:80}[key];if(limit&&text.length>limit){append(`Phần này tối đa ${limit} ký tự. Bạn rút ngắn rồi bấm Tiếp nhé.`);return;}}if(!text){if(draft&&stages[step]){if(stages[step]==='recipient')append('Bạn chọn người nhận bằng một nút bên trên nhé.');else receive('bỏ qua');}return;}input.value='';if(draft)receive(text);else{append(text,true);answer(text);}});
    host.addEventListener('keydown',e=>{if(e.key==='Escape'&&opened){e.preventDefault();setOpen(false,true);}});
    document.addEventListener('pointerdown',e=>{drawing=Boolean(e.target.closest('#signature-pad'));if(!host.contains(e.target)){nudge.hidden=true;clearTimeout(nudgeTimer);nudgeTimer=0;schedule();}},{passive:true});document.addEventListener('keydown',()=>{if(!opened)schedule();});
    for(const type of ['pointerup','pointercancel','lostpointercapture'])document.addEventListener(type,()=>{if(drawing){drawing=false;schedule();}},{passive:true});
    document.addEventListener('focusin',()=>{if(!opened)schedule();});document.addEventListener('focusout',()=>queueMicrotask(()=>{if(!opened)schedule();}));
    document.addEventListener('visibilitychange',()=>{if(document.hidden){drawing=false;stopTimers();}else schedule();});window.addEventListener('pagehide',stopTimers);
    window.visualViewport?.addEventListener('resize',syncViewport);window.visualViewport?.addEventListener('scroll',syncViewport);window.addEventListener('resize',syncViewport);starter();
    return {show(value){visible=value;host.hidden=!value;syncViewport();if(value){contextChanged();schedule();}else stopTimers();},contextChanged,createQuick:()=>startQuick(''),react,close:()=>setOpen(false),metrics:()=>({timers:Number(Boolean(idle))+Number(Boolean(expression))+Number(Boolean(nudgeTimer)),draft:Boolean(draft),nudges,acts,opened,otherMusic})};
  }
  window.BebeAssistant=Object.freeze({mount,targetFor,topics:faq.length});
})();
