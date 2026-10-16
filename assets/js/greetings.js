/*
 * Lời chúc và cặp xưng hô. Chỉ thay các trường được khai báo trong template;
 * tuyệt đối không tìm–thay đại từ trong nội dung người dùng tự viết.
 * Các ID là ổn định. Thiệp chia sẻ vẫn phải lưu nội dung đã render thực tế.
 */
const CardGreetings = (() => {
  'use strict';

  const tones = Object.freeze({
    short: 'Ngắn gọn', warm: 'Ấm áp', playful: 'Vui vẻ', moving: 'Xúc động',
    sweet: 'Ngọt ngào', romantic: 'Lãng mạn'
  });
  const recipients = {
    mom: { label: 'Mẹ', group: 'mom', musicGroup: 'me', plural: false },
    grandma: { label: 'Bà', group: 'grandma', musicGroup: 'ba', plural: false },
    teacher: { label: 'Cô giáo', group: 'teacher', musicGroup: 'co', plural: false },
    sister_older: { label: 'Chị gái', group: 'sister', musicGroup: 'chi', plural: false },
    sister_younger: { label: 'Em gái', group: 'sister', musicGroup: 'chi', plural: false },
    friend: { label: 'Bạn nữ', group: 'friend', musicGroup: 'nu', plural: false },
    women_one: { label: 'Người phụ nữ thân thương', group: 'women', musicGroup: 'nu', plural: false },
    women_group: { label: 'Những người phụ nữ thân thương', group: 'women', musicGroup: 'nu', plural: true },
    lover: { label: 'Người thương', group: 'lover', musicGroup: 'yeu', plural: false }
  };
  const pair = (id, self, you) => Object.freeze({ id, self, you, label: `${self} – ${you}` });
  const pairs = {
    mom: [pair('con-me', 'con', 'mẹ')],
    grandma: [pair('chau-ba', 'cháu', 'bà'), pair('con-ba', 'con', 'bà')],
    teacher: [pair('em-co', 'em', 'cô'), pair('con-co', 'con', 'cô')],
    sister_older: [pair('em-chi', 'em', 'chị')],
    sister_younger: [pair('anh-em', 'anh', 'em'), pair('chi-em', 'chị', 'em')],
    friend: [pair('minh-ban', 'mình', 'bạn'), pair('to-cau', 'tớ', 'cậu'), pair('toi-ban', 'tôi', 'bạn')],
    women_one: [pair('minh-ban', 'mình', 'bạn'), pair('toi-ban', 'tôi', 'bạn')],
    women_group: [pair('minh-moi-nguoi', 'mình', 'mọi người'), pair('toi-cac-ban', 'tôi', 'các bạn')],
    lover: [pair('anh-em', 'anh', 'em'), pair('em-anh', 'em', 'anh'), pair('minh-cau', 'mình', 'cậu')]
  };
  const affectionateCalls = Object.freeze([
    { id: '', label: 'Theo cách xưng hô đã chọn', value: '' },
    { id: 'em-yeu', label: 'Em yêu', value: 'em yêu' },
    { id: 'anh-yeu', label: 'Anh yêu', value: 'anh yêu' },
    { id: 'nguoi-thuong', label: 'Người thương', value: 'người thương' }
  ].map(Object.freeze));
  const t = (id, title, tone, body) => ({ id, title, tone, body });
  const templates = {
    mom: [
      t('mom-little-love', 'Một chút thương gửi mẹ', 'short',
        '20/10, {self} chúc {you} khỏe, ngủ ngon và có thật nhiều niềm vui. Hôm nay, mong {you} dành một chút thời gian cho điều mình thích. Gửi {you} một tấm thiệp nhỏ và thật nhiều thương.'),
      t('mom-own-day', 'Một ngày của riêng mẹ', 'warm',
        'Hôm nay, {self} mong {you} có một ngày thật dễ chịu: được ăn món mình thích, nghe một bản nhạc hay và thong thả làm điều mình muốn. Chúc {you} luôn khỏe, ngủ ngon và có nhiều chuyện vui để kể.\n\n20/10 là dịp để {self} gửi lời thương này. Nhưng mong những ngày bình thường của {you} cũng có thật nhiều sự quan tâm, những khoảng nghỉ yên lành và những niềm vui dành riêng cho mình.'),
      t('mom-small-garden', 'Một góc vườn bình yên', 'warm',
        'Gửi {you} một khu vườn nhỏ trong tấm thiệp này, để lời chúc của {self} có thêm chút màu xanh. Mong {you} có những buổi sáng khỏe khoắn, những bữa cơm ngon và những buổi tối ngủ thật yên.\n\nChúc {you} còn nhiều điều thích làm, nhiều nơi muốn đến và đủ thời gian tận hưởng từng điều một. Ngày 20/10, {self} chỉ muốn nói thật giản dị: mong {you} vui, hôm nay và cả những ngày sau.'),
      t('mom-good-mood', 'Hôm nay mẹ chọn nhé', 'playful',
        '20/10 này, {self} chúc {you} một ngày toàn chuyện dễ thương: món ngon vừa miệng, ảnh chụp thật xinh và gặp ai cũng có chuyện vui để nói. Hôm nay, muốn uống gì, nghe gì, làm gì thì {you} cứ chọn theo ý mình nhé.\n\nCòn lời chúc trong tấm thiệp này đã được chuẩn bị sẵn: thật nhiều sức khỏe, thật nhiều tiếng cười, thêm chút thảnh thơi và một ngày nhẹ tênh. Chúc {you} vui thật là vui!'),
      t('mom-simple-words', 'Một lời thương thật rõ', 'moving',
        'Có một điều {self} muốn viết thật rõ trong ngày 20/10: {you} rất đáng được yêu thương và chăm sóc. Không cần một dịp đặc biệt mới được nghỉ ngơi, cũng không cần làm thêm điều gì mới xứng đáng có một ngày vui.\n\n{Self} mong {you} khỏe mạnh, biết nói ra điều mình thích và có những người sẵn lòng lắng nghe. Tấm thiệp này nhỏ thôi, nhưng lời chúc gửi đến {you} là thật lòng: hãy luôn dành cho mình cả sự dịu dàng nữa nhé.'),
      t('mom-near-heart', 'Gửi mẹ những ngày ấm', 'moving',
        'Nhân ngày 20/10, {self} gửi {you} lời chúc bình an và một chút ấm áp trong tấm thiệp nhỏ. Mong {you} có sức khỏe tốt, những giấc ngủ đủ đầy và nhiều ngày lòng thấy nhẹ nhõm.\n\n{Self} mong chúng ta có thêm những lúc thong thả ngồi bên nhau, kể chuyện hôm nay và nghe điều {you} đang nghĩ. Không cần chuyện gì lớn lao, chỉ một khoảng thời gian gần gũi cũng thật quý. Chúc {you} luôn cảm thấy được thương.' )
    ],
    grandma: [
      t('grandma-happy-day', 'Bà vui, nhà thêm ấm', 'short',
        '20/10, {self} chúc {you} thật khỏe, ăn ngon, ngủ ngon và ngày nào cũng có chuyện vui. Mong {you} có nhiều lúc ngồi chơi thong thả, chuyện trò rôm rả. Gửi {you} thật nhiều thương mến trong tấm thiệp nhỏ này.'),
      t('grandma-tea-time', 'Một buổi sáng thảnh thơi', 'warm',
        'Hôm nay, {self} chúc {you} một buổi sáng nhẹ nhàng và cả ngày nhiều niềm vui. Mong {you} ăn ngon, ngủ yên, có sức khỏe để làm những việc mình thích và luôn có người cùng trò chuyện.\n\nNgày 20/10, {self} gửi {you} tấm thiệp này như một lời hỏi thăm thật ấm. Chúc những ngày sắp tới có thêm tiếng cười, những bữa cơm vui vẻ và những lúc cả nhà được ngồi bên nhau thật thong thả.'),
      t('grandma-little-flowers', 'Một nhành hoa nhỏ', 'warm',
        'Gửi {you} một nhành hoa nhỏ và lời chúc 20/10 của {self}. Mong mỗi ngày đều có điều khiến {you} vui: một món ăn vừa miệng, một câu chuyện hay hay một chậu cây thêm lá mới.\n\nChúc {you} khỏe mạnh, có lúc nghỉ ngơi thật thoải mái và được làm những điều mình yêu thích. Mong lời hỏi han và sự quan tâm luôn ở gần {you}, để cả những ngày bình thường cũng thật ấm lòng.'),
      t('grandma-smiles', 'Một ngày thật rôm rả', 'playful',
        '20/10 đến rồi, {self} chúc {you} có thật nhiều chuyện vui để kể và thật nhiều người ngồi nghe. Mong hôm nay bữa nào cũng ngon miệng, chuyện nào cũng có thêm một chút tiếng cười và tâm trạng cứ vui phơi phới.\n\nTrong tấm thiệp này có hoa, có lời chúc, còn điều {self} mong nhất vẫn là {you} thật khỏe. Chúc {you} một ngày rôm rả, rồi một buổi tối nghỉ ngơi thật ngon nhé!'),
      t('grandma-family-table', 'Mong những lần sum vầy', 'moving',
        'Ngày 20/10, {self} mong {you} luôn có sức khỏe và thấy lòng vui. Mong gia đình có thêm những dịp sum vầy, để câu chuyện trên bàn ăn cứ tiếp nối, để ai cũng có thời gian nghe {you} nói.\n\nCó những niềm vui rất nhỏ mà lại làm một ngày ấm hơn: một lời hỏi thăm, một lần ghé chơi, một lúc ngồi cạnh nhau. {Self} gửi những điều gần gũi ấy vào lời chúc hôm nay, mong {you} luôn được yêu thương.'),
      t('grandma-warm-words', 'Những điều bà mong', 'moving',
        'Trong lời chúc 20/10 này, {self} mong {you} không chỉ khỏe mạnh mà còn thật vui với những ngày của mình. Mong {you} có điều để háo hức, có người để chuyện trò và luôn được lắng nghe những điều mình muốn.\n\nChúc {you} ăn ngon, ngủ ngon, bước vào mỗi ngày với lòng nhẹ nhàng. {Self} gửi tấm thiệp nhỏ thay cho một lời thương chân thành, mong niềm vui và sự ấm áp luôn ở bên {you}.')
    ],
    teacher: [
      t('teacher-thank-you', 'Một lời tri ân', 'short',
        'Nhân ngày 20/10, {self} kính chúc {you} nhiều sức khỏe, niềm vui và bình an. Chúc {you} có những giờ dạy thật vui và những khoảng nghỉ thật dễ chịu. Xin gửi đến {you} lời cảm ơn và sự trân trọng.'),
      t('teacher-good-day', 'Một ngày dịu dàng', 'warm',
        'Nhân ngày 20/10, {self} kính chúc {you} một ngày thật vui và nhiều sức khỏe. Mong những giờ lên lớp có thêm nụ cười, những công việc đang làm được thuận lợi và mỗi ngày đều có một điều nhỏ đáng mừng.\n\nNgoài những trang giáo án, chúc {you} còn có thời gian cho điều mình yêu thích, cho người thân và cho những lúc nghỉ ngơi. {Self} xin gửi lời chúc chân thành này cùng sự trân trọng dành cho {you}.'),
      t('teacher-growing-light', 'Niềm vui trong lớp học', 'warm',
        '20/10, {self} chúc {you} luôn khỏe và giữ được niềm vui trong công việc dạy học. Mong lớp học có nhiều câu hỏi thú vị, nhiều ánh mắt hào hứng và những tiến bộ nhỏ khiến một ngày làm việc trở nên đáng nhớ.\n\nCông việc của {you} cần cả kiến thức lẫn sự kiên nhẫn. {Self} xin gửi một lời cảm ơn thật lòng. Chúc {you} có những ngày thuận lợi, những người đồng nghiệp dễ mến và cả thời gian chăm sóc bản thân.'),
      t('teacher-happy-lesson', 'Một tiết học đầy nụ cười', 'playful',
        'Ngày 20/10, {self} chúc {you} có một ngày nhận được thật nhiều lời chúc dễ thương. Mong giờ dạy hôm nay có những câu trả lời thật hay, lớp học nhiều tiếng cười và mọi việc đều nhẹ nhàng hơn một chút.\n\nChúc {you} luôn khỏe, luôn có lý do để mỉm cười và một buổi tối nghỉ ngơi thật thoải mái. Tấm thiệp nhỏ này là lời chào vui vẻ cùng sự kính mến mà {self} muốn gửi đến {you}.'),
      t('teacher-kind-work', 'Cảm ơn những điều được trao', 'moving',
        'Nhân ngày 20/10, {self} muốn gửi đến {you} một lời cảm ơn dành cho công việc dạy học. Mỗi bài giảng cần sự chuẩn bị, mỗi câu hỏi của học trò cần được lắng nghe; những điều ấy đều đáng được trân trọng.\n\n{Self} kính chúc {you} nhiều sức khỏe, bình an và những ngày làm việc có niềm vui. Mong khi khép lại một ngày, {you} vẫn còn thời gian cho sở thích riêng và những người mình yêu quý.'),
      t('teacher-letter', 'Lời chúc trên trang giấy', 'moving',
        'Có những lời cảm ơn viết ra thật giản dị, nhưng {self} mong {you} nhận được sự chân thành trong đó. Ngày 20/10, xin gửi đến {you} lời kính chúc sức khỏe và bình an, cùng sự trân trọng dành cho vai trò của một người thầy.\n\nMong con đường dạy học của {you} có thêm nhiều niềm vui, những cuộc gặp tốt đẹp và những khoảng nghỉ vừa đủ. Chúc {you} có một ngày thật ấm áp, cả trong lớp học lẫn cuộc sống riêng.')
    ],
    sister_older: [
      t('older-little-surprise', 'Một bất ngờ cho chị', 'short',
        '20/10, {self} chúc {you} khỏe, vui và gặp nhiều chuyện dễ thương. Hôm nay hãy dành một chút thời gian làm điều mình thích nhé. Gửi {you} một tấm thiệp nhỏ, một lời chúc thật lòng và thật nhiều thương mến.'),
      t('older-own-afternoon', 'Một chiều dành cho chị', 'warm',
        'Hôm nay, {self} chúc {you} có một khoảng thời gian thật riêng: uống món mình thích, nghe bài nhạc mình mê hay đơn giản là nghỉ một lát cho nhẹ đầu. Mong những việc đang làm được thuận lợi và cơ thể luôn khỏe khoắn.\n\n20/10 rồi, chúc {you} nhận được những lời thương chân thành và có thêm điều để háo hức. Không cần một ngày thật hoàn hảo, chỉ cần thấy vui và dễ chịu theo cách của mình là được.'),
      t('older-new-plans', 'Cho những điều chị thích', 'warm',
        'Ngày 20/10, {self} gửi {you} lời chúc cho những dự định lớn nhỏ: mong chúng tiến triển từng chút một, vừa sức và có niềm vui. Chúc {you} gặp những người dễ mến, tìm được điều mình thích và có thời gian tận hưởng.\n\nGiữa những ngày bận rộn, mong {you} nhớ ăn ngon, ngủ đủ và cho mình nghỉ khi cần. Tấm thiệp này là một lời nhắc nhẹ từ {self}: sức khỏe và niềm vui của {you} cũng đáng được ưu tiên.'),
      t('older-good-luck', 'Một ngày toàn tin vui', 'playful',
        '20/10 này, {self} chúc {you} mở điện thoại gặp tin vui, ra ngoài gặp thời tiết đẹp, chọn món nào cũng thấy ngon và chụp tấm nào cũng thật ưng ý. Thêm một chút may mắn nữa cho ngày càng dễ thương nhé.\n\nCòn lời chúc lâu dài là khỏe thật khỏe, vui thật vui và có nhiều tiền cho những điều mình thích. {Self} gửi thiệp trước, mong nụ cười của {you} sẽ đến ngay sau đó!'),
      t('older-no-need-perfect', 'Chị cứ là chị thôi', 'moving',
        'Ngày 20/10, {self} muốn chúc {you} một điều giản dị: được sống những ngày thật dễ chịu, có người nghe mình nói và có thể nghỉ ngơi khi thấy mệt. Không phải lúc nào cũng cần giỏi giang, mạnh mẽ hay làm mọi thứ thật tròn.\n\nMong {you} khỏe mạnh, giữ được những điều làm mình vui và đón nhận sự quan tâm một cách tự nhiên. Trong tấm thiệp này, {self} gửi một lời thương dành cho {you}, đúng với con người của {you}.'),
      t('older-at-home', 'Thêm những lúc ngồi gần', 'moving',
        '20/10, {self} chúc {you} nhiều sức khỏe và có thêm những ngày lòng nhẹ tênh. Mong những chuyện đang lo tìm được cách giải quyết, còn những chuyện vui thì có người cùng nghe và cùng mừng.\n\n{Self} mong chúng ta có thêm những lúc ngồi gần nhau, kể chuyện lớn nhỏ mà không cần vội. Một bữa ăn, một cuộc trò chuyện hay một lời hỏi thăm cũng đủ làm ngày ấm hơn. Gửi {you} thật nhiều thương mến hôm nay.')
    ],
    sister_younger: [
      t('younger-happy-day', 'Một ngày nhiều niềm vui', 'short',
        '20/10, {self} chúc {you} luôn khỏe, cười thật nhiều và gặp những người tử tế. Cứ dành thời gian cho điều mình thích, thử điều mình tò mò và nghỉ khi cần nhé. Gửi {you} một bất ngờ nhỏ thật dễ thương!'),
      t('younger-bright-morning', 'Nắng dành cho em', 'warm',
        'Gửi {you} một chút nắng trong ngày 20/10. {Self} chúc những việc đang làm có thêm điều thuận lợi, những dự định riêng có cơ hội bắt đầu và mỗi ngày đều có một chuyện khiến {you} mỉm cười.\n\nMong {you} ăn ngon, ngủ đủ, có bạn bè dễ mến và những khoảng thời gian thoải mái cho sở thích của mình. Không cần phải vội vàng, cứ làm từng điều vừa sức và tận hưởng niềm vui trên đường đi nhé.'),
      t('younger-little-dreams', 'Cho điều em muốn thử', 'warm',
        'Ngày 20/10, {self} chúc {you} có thêm can đảm để thử một điều mình thích: học một việc mới, bắt đầu một sở thích hay dành thời gian cho một kế hoạch còn để đó. Mong mọi bước nhỏ đều mang lại chút niềm vui.\n\nVà dù hôm nay có làm được nhiều hay ít, chúc {you} vẫn thấy mình xứng đáng được quan tâm. Nhớ chăm sóc sức khỏe, tìm người giúp khi cần và giữ lại những điều khiến lòng vui nhé.'),
      t('younger-full-battery', 'Nạp đầy niềm vui', 'playful',
        '20/10 rồi, {self} gửi {you} một gói lời chúc: sức khỏe đầy pin, niềm vui đầy túi, ảnh chụp thật xinh và chuyện bực mình ít thôi. Mong hôm nay món ngon đến đúng lúc, bài nhạc nghe trúng ý và mọi kế hoạch đều có thêm chút may mắn.\n\nTấm thiệp này không cần mật khẩu, chỉ cần {you} mở ra và cười một cái. Chúc {you} một ngày thật vui, rồi những ngày sau cũng nhiều điều dễ thương như thế!'),
      t('younger-gentle-heart', 'Dịu dàng với mình nhé', 'moving',
        '20/10, {self} chúc {you} luôn có những người đáng tin để tìm đến khi cần và những điều nhỏ làm lòng mình vui. Mong {you} không phải giấu nỗi buồn chỉ vì sợ làm phiền, cũng không phải so bước chân mình với bất kỳ ai.\n\nCứ đi theo nhịp phù hợp với mình, nhớ chăm sóc sức khỏe và cho bản thân thời gian nghỉ. {Self} gửi lời chúc này với mong muốn rất giản dị: {you} được bình an và sống thật vui.'),
      t('younger-family-love', 'Một lời thương trong nhà', 'moving',
        'Nhân ngày 20/10, {self} gửi {you} một lời thương thật rõ. Mong những ngày sắp tới có nhiều tiếng cười, nhiều điều để mong chờ và cả những lúc được nghỉ ngơi mà không phải nghĩ ngợi quá nhiều.\n\n{Self} mong chúng ta có thêm dịp trò chuyện, nghe nhau kể những điều nhỏ trong ngày và chia sẻ cả những điều chưa dễ nói. Chúc {you} luôn khỏe và cảm thấy có người quan tâm đến mình, trong ngày này và những ngày bình thường.')
    ],
    friend: [
      t('friend-good-day', 'Một ngày thật dễ thương', 'short',
        '20/10, {self} chúc {you} khỏe, vui và gặp thật nhiều chuyện dễ thương. Mong hôm nay có món ngon, bài nhạc hay và một điều bất ngờ khiến {you} cười. Chúc {you} tận hưởng ngày này theo đúng cách mình thích!'),
      t('friend-your-way', 'Vui theo cách của bạn', 'warm',
        'Ngày 20/10, {self} chúc {you} có một ngày vừa ý mình: ra ngoài thật vui hay ở nhà thật thoải mái, miễn là thấy dễ chịu. Mong có một món ngon, một câu chuyện hay và một khoảng thời gian dành cho điều {you} thích.\n\nChúc những ngày sắp tới nhiều sức khỏe, công việc thuận lợi và gặp được những người tử tế. Tấm thiệp này gửi đến {you} một lời chúc vui vẻ, chân thành và vừa đủ nhẹ nhàng cho hôm nay.'),
      t('friend-new-energy', 'Một khoảng nghỉ vừa xinh', 'warm',
        '20/10 rồi, {self} chúc {you} có một khoảng nghỉ thật ngon lành giữa những việc cần làm. Mong chuyện khó bớt khó, chuyện vui đến nhiều hơn và những kế hoạch riêng có dịp bắt đầu.\n\nNhớ ăn uống tử tế, ngủ đủ và dành thời gian cho những người khiến mình thấy thoải mái nhé. {Self} gửi tấm thiệp này như một lời chào nhỏ: chúc {you} một ngày vui, và những ngày bình thường cũng có nhiều điều đáng thích.'),
      t('friend-lucky-list', 'Danh sách toàn chuyện vui', 'playful',
        'Chúc {you} ngày 20/10 gặp đúng món đang thèm, nghe đúng bài đang thích, chụp ảnh không cần chọn quá lâu và mở tin nhắn thấy toàn điều dễ thương. Nếu có thêm chút may mắn trong những việc đang làm thì càng tuyệt!\n\n{Self} gửi một tấm thiệp có hoa, có ánh sáng và một lời chúc thật gọn: khỏe hơn, vui hơn, tiền đủ cho những sở thích hay ho. Chúc {you} có một ngày đáng nhớ theo cách thật vui vẻ.'),
      t('friend-light-day', 'Cho những ngày nhẹ lòng', 'moving',
        'Nhân ngày 20/10, {self} chúc {you} có thêm những ngày nhẹ lòng. Mong lúc mệt có thể nghỉ, lúc bối rối có người để hỏi và lúc vui có người sẵn sàng nghe kể.\n\nKhông phải ngày nào cũng cần làm được thật nhiều việc mới là một ngày có ý nghĩa. Chúc {you} khỏe mạnh, có những mối quan hệ thoải mái và giữ được một góc nhỏ cho điều mình yêu thích. Gửi {you} lời chúc thật chân thành hôm nay.'),
      t('friend-ordinary-joy', 'Điều tốt đẹp rất gần', 'moving',
        '20/10, {self} mong những điều tốt lành đến với {you} thật gần: một cuộc trò chuyện hợp ý, một công việc xong đúng lúc, một buổi tối ngủ ngon và sáng mai thức dậy thấy nhẹ người.\n\nMong những dự định của {you} có thêm cơ hội, những nỗ lực có kết quả và những ngày chưa như ý vẫn có người lắng nghe. Chúc {you} luôn biết chăm sóc bản thân và có nhiều niềm vui nhỏ, chẳng cần chờ một dịp đặc biệt.')
    ],
    women_one: [
      t('woman-warm-wish', 'Lời chúc chân thành', 'short',
        'Nhân ngày 20/10, {self} chúc {you} nhiều sức khỏe, niềm vui và bình an. Mong {you} có thời gian cho điều mình yêu thích, gặp những người tử tế và đón nhận thật nhiều lời chúc ấm áp hôm nay.'),
      t('woman-gentle-day', 'Một ngày dành cho mình', 'warm',
        'Ngày 20/10, {self} gửi đến {you} lời chúc sức khỏe và một ngày thật vui. Mong hôm nay có những cuộc trò chuyện dễ chịu, những lời hỏi thăm chân thành và một chút thời gian dành riêng cho điều mình thích.\n\nChúc những dự định của {you} từng bước thuận lợi, những ngày bận rộn vẫn có khoảng nghỉ và cuộc sống có nhiều tiếng cười. Tấm thiệp này là một lời chúc nhỏ, mong mang đến cho {you} một chút ấm áp.'),
      t('woman-joyful-plans', 'Nhiều điều để mong chờ', 'warm',
        '20/10, {self} chúc {you} có nhiều điều tốt đẹp để mong chờ: một dự định sắp bắt đầu, một nơi muốn đến hay một sở thích đang muốn thử. Mong mọi việc đến theo nhịp dễ chịu và vừa với sức mình.\n\nChúc {you} luôn khỏe, ngủ ngon và có những người khiến cuộc sống thêm vui. Hôm nay, mong {you} đón nhận lời chúc này như một chút quan tâm chân thành, dành riêng cho mình.'),
      t('woman-lucky-day', 'Thêm chút vui cho hôm nay', 'playful',
        'Chúc {you} một ngày 20/10 toàn những điều nhỏ mà vui: món ăn ngon hơn mong đợi, công việc xong sớm một chút và mở điện thoại gặp tin nhắn dễ thương. Mong niềm vui cứ nối tiếp, để hôm nay có thật nhiều lý do mỉm cười.\n\n{Self} gửi thêm lời chúc sức khỏe, may mắn và một buổi tối thật thư thái. Chúc {you} được làm điều mình thích và tận hưởng ngày này theo cách riêng nhé!'),
      t('woman-rest-and-love', 'Mong lòng luôn nhẹ', 'moving',
        'Nhân ngày 20/10, {self} chúc {you} có những ngày lòng thấy nhẹ. Mong khi cần nghỉ có thể nghỉ, khi có điều muốn nói sẽ có người lắng nghe, và những chuyện tốt lành đến bằng cách thật gần gũi.\n\nChúc {you} khỏe mạnh, bình an và dành được thời gian cho những niềm vui của riêng mình. Lời chúc trong tấm thiệp này không thật lớn lao, chỉ mong {you} cảm nhận được một sự quan tâm chân thành hôm nay.'),
      t('woman-simple-kindness', 'Dịu dàng trong ngày thường', 'moving',
        '20/10 là dịp để gửi một lời chúc, nhưng {self} mong sự quan tâm dành cho {you} còn ở lại trong những ngày bình thường. Một lời hỏi han đúng lúc, một người chịu lắng nghe, một khoảng nghỉ yên tĩnh đều thật đáng quý.\n\nChúc {you} có nhiều sức khỏe, những lựa chọn khiến mình thấy vui và những người đồng hành tử tế. Mong mỗi ngày đều có ít nhất một điều khiến {you} muốn mỉm cười.')
    ],
    women_group: [
      t('women-small-wishes', 'Mỗi người một niềm vui', 'short',
        'Nhân ngày 20/10, {self} chúc {you} nhiều sức khỏe, bình an và thật nhiều niềm vui. Mong mỗi người đều có thời gian cho điều mình yêu thích và một ngày vui theo cách riêng. Gửi {you} những lời chúc chân thành nhất!'),
      t('women-own-colors', 'Những niềm vui rất riêng', 'warm',
        'Ngày 20/10, {self} gửi đến {you} lời chúc sức khỏe và thật nhiều niềm vui. Mỗi người có một nhịp sống, một điều đang mong chờ; chúc những dự định ấy có thêm cơ hội và từng bước trở thành điều vui trong cuộc sống.\n\nMong {you} có những khoảng nghỉ dễ chịu, những cuộc trò chuyện ấm áp và nhiều người tử tế ở bên. Chúc mỗi người đều tận hưởng hôm nay theo cách phù hợp với mình.'),
      t('women-good-morning', 'Một ngày đầy lời chúc', 'warm',
        '20/10, {self} chúc {you} đón một ngày thật ấm áp, với những lời hỏi han chân thành và những chuyện nhỏ đáng vui. Mong mỗi người có một chút thời gian để ăn món mình thích, nghe bản nhạc mình yêu hay đơn giản là nghỉ ngơi.\n\nChúc {you} luôn khỏe mạnh, công việc thuận lợi và những ngày sắp tới nhiều tiếng cười. Tấm thiệp này gửi một lời chúc chung, nhưng niềm vui mong dành cho mỗi người đều thật riêng.'),
      t('women-smile-together', 'Cùng nhận một chút vui', 'playful',
        'Chúc {you} ngày 20/10 nhận lời chúc mỏi tay, ăn món nào cũng ngon và gặp thật nhiều tin vui. Mong ai thích yên tĩnh có khoảng nghỉ vừa ý, ai thích náo nhiệt có một ngày thật rộn ràng.\n\n{Self} gửi thêm một lời chúc dễ nhớ: sức khỏe nhiều lên, việc phiền ít lại, niềm vui cứ đến đều đều. Chúc mỗi người có một ngày dễ thương và nhiều điều để kể với nụ cười thật tươi!'),
      t('women-kind-days', 'Sự quan tâm ở lại', 'moving',
        'Nhân ngày 20/10, {self} chúc {you} luôn được đón nhận bằng sự tử tế. Mong mỗi người có chỗ để nghỉ ngơi khi mệt, có người lắng nghe khi cần và có niềm vui không phụ thuộc vào việc phải làm được bao nhiêu.\n\nChúc {you} sức khỏe, bình an và những ngày dễ chịu hơn. Mong lời hỏi han và sự quan tâm không chỉ có trong hôm nay, mà còn ở lại trong những điều bình thường của cuộc sống.'),
      t('women-many-paths', 'Gửi những hành trình riêng', 'moving',
        '20/10, {self} gửi lời chúc đến {you}, mỗi người đang có một hành trình của riêng mình. Mong những việc đang làm có thêm thuận lợi, những điều đang chờ có tin vui và những ngày khó khăn có người sẵn lòng giúp đỡ.\n\nChúc {you} luôn khỏe, có thời gian cho niềm vui và thoải mái đón nhận sự chăm sóc. Mong tấm thiệp nhỏ này mang đến một chút ấm áp, để hôm nay của mỗi người thêm dễ chịu.')
    ],
    lover: [
      t('lover-little-heart', 'Một chút bất ngờ, nhiều thương', 'short',
        '20/10 rồi, {self} chúc {you} một ngày thật vui và thật nhiều yêu thương. Mong {you} luôn khỏe, ngủ ngon và có những ngày nhẹ lòng. Tấm thiệp này là một chút bất ngờ, còn điều {self} muốn nói là: thương {you} nhiều.'),
      t('lover-tender-day', 'Quan tâm từ điều nhỏ', 'warm',
        'Ngày 20/10, {self} chúc {you} có một ngày thật vui, được làm điều mình thích và nhận thật nhiều sự quan tâm. Mong {you} ăn ngon, ngủ đủ, bớt những chuyện phải lo và có thêm nhiều điều để mỉm cười.\n\n{Self} muốn dành cho {you} không chỉ một lời chúc hôm nay, mà cả những cuộc trò chuyện thật lòng và sự quan tâm trong những điều nhỏ. Mong chúng ta có thêm nhiều dịp ở bên nhau, thong thả và ấm áp.'),
      t('lover-smile-delivery', 'Giao một nụ cười đến đây', 'playful',
        'Có một tấm thiệp vừa được giao đến {you}: bên trong có hoa, có ánh sao và có một người đang mong {you} cười. 20/10, {self} chúc {you} mọi chuyện dễ thương hơn một chút, món ngon nhiều hơn một chút và chuyện bực mình ít đi thật nhiều.\n\nRiêng lời thương thì không đếm bằng “một chút” đâu nhé. {Self} mong được cùng {you} làm thêm nhiều điều vui, từ một buổi đi dạo đến những kế hoạch nhỏ mà cả hai cùng thích.'),
      t('lover-being-yourself', 'Thương cả ngày bình thường', 'moving',
        '20/10, {self} muốn gửi {you} một lời thương thật rõ. Mong {you} biết rằng không cần lúc nào cũng vui, cũng mạnh mẽ hay thật hoàn hảo mới đáng được quan tâm. Những ngày mệt cũng xứng đáng có một người ngồi nghe.\n\n{Self} mong chúng ta có thể nói với nhau cả điều vui lẫn điều khó, và hiểu nhau thêm từ những chuyện rất nhỏ. Chúc {you} khỏe, bình an và có nhiều ngày được yêu thương theo cách khiến lòng mình thấy ấm.'),
      t('lover-heart-note', 'Điều muốn nói là thương', 'sweet',
        'Hôm nay, {self} gói một lời thương vào tấm thiệp nhỏ này. Chúc {you} ngày 20/10 thật vui, có món ngon để thưởng thức, có bài nhạc để ngân nga và có một điều bất ngờ khiến mắt sáng lên.\n\nĐiều {self} muốn nói không cầu kỳ đâu: {self} rất thương {you}. Mong chúng ta có thêm những buổi đi chơi không cần vội, những câu chuyện kể mãi chưa hết và thật nhiều khoảnh khắc bình thường mà ở cạnh nhau lại thấy vui.'),
      t('lover-shared-stars', 'Một góc trời cho hai người', 'romantic',
        'Giữa những ánh sao trong tấm thiệp này, {self} dành một góc trời nhỏ để gửi lời chúc đến {you}. 20/10, mong {you} luôn khỏe, lòng nhẹ và có thật nhiều ngày vui.\n\n{Self} mong được cùng {you} ngắm thêm những buổi chiều đẹp, đi qua những nơi cả hai muốn đến và kể cho nhau nghe chuyện nhỏ mỗi ngày. Không cần mọi thứ phải thật rực rỡ; chỉ mong những lúc bên nhau, chúng ta đều cảm thấy được lắng nghe và yêu thương.')
    ]
  };
  const closings = {
    mom: 'Gửi {you} thật nhiều thương mến,',
    grandma: 'Gửi {you} thật nhiều thương mến,',
    teacher: 'Với lòng kính mến,',
    sister_older: 'Thương gửi {you},',
    sister_younger: 'Thương gửi {you},',
    friend: 'Gửi {you} những điều tốt lành,',
    women_one: 'Gửi {you} lời chúc chân thành,',
    women_group: 'Gửi {you} những điều tốt lành,',
    lover: 'Thương gửi {you},'
  };

  // NFC keeps Vietnamese combining marks together without deleting accents.
  const text = value => typeof value === 'string' ? value.normalize('NFC') : '';
  const sentenceCase = value => {
    const letters = Array.from(text(value));
    return letters.length ? letters[0].toLocaleUpperCase('vi-VN') + letters.slice(1).join('') : '';
  };
  const normalizePair = value => ({
    self: text(value && value.self).trim() || 'mình',
    you: text(value && value.you).trim() || 'bạn'
  });
  const render = (template, value) => {
    const input = typeof template === 'string' ? template : template && template.body;
    const current = normalizePair(value);
    const fields = { self: current.self, Self: sentenceCase(current.self), you: current.you, You: sentenceCase(current.you) };
    return text(input).replace(/\{(self|Self|you|You)\}/g, (_, key) => fields[key]);
  };
  const getPairs = key => pairs[key] || pairs.friend;
  const defaultPair = key => ({ ...getPairs(key)[0] });
  const getTemplates = (key, tone = 'all') => {
    const collection = templates[key] || templates.friend;
    return tone === 'all' ? collection : collection.filter(item => item.tone === tone);
  };
  const salutation = (value, options = {}) => {
    const current = normalizePair(value);
    // A selected affectionate call or an entered name is never invented here.
    const addressee = text(options.name).trim() || text(options.call).trim() || current.you;
    return `Gửi ${addressee},`;
  };
  const compose = (template, value, options = {}) => ({
    body: render(template, value),
    salutation: salutation(value, options),
    closing: render(closings[options.recipient || (template && template.recipient)] || 'Gửi {you} những điều tốt lành,', value)
  });

  Object.entries(templates).forEach(([key, collection]) => {
    collection.forEach(item => {
      item.recipient = key;
      item.closing = closings[key];
      Object.freeze(item);
    });
    Object.freeze(collection);
  });
  Object.values(pairs).forEach(Object.freeze);
  Object.values(recipients).forEach(Object.freeze);

  return Object.freeze({
    recipients: Object.freeze(recipients), pairs: Object.freeze(pairs),
    templates: Object.freeze(templates), tones, affectionateCalls,
    render, compose, salutation, sentenceCase, normalizePair,
    getTemplates, getPairs, defaultPair
  });
})();
