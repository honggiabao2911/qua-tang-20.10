const LEGACY_GREETINGS = {
  mom: [
    {
      title: 'Một ngày thật riêng',
      body: 'Nhân ngày 20/10, {self} mong {you} có một ngày thật dễ chịu: được làm điều mình thích, ăn món mình muốn và nhận những lời thương mến thật lòng. Mong những điều đem lại niềm vui cho {you} luôn có chỗ trong cuộc sống mỗi ngày.\n\nVới {self}, {you} vừa là người thân yêu, vừa là một người có những ước mơ và sở thích rất riêng. Chúc {you} luôn khỏe, luôn có người lắng nghe và tự tin dành thời gian cho chính mình.'
    },
    {
      title: 'Bình yên bên mẹ',
      body: 'Điều {self} muốn gửi đến {you} hôm nay là một lời chúc bình yên. Mong {you} có những giấc ngủ ngon, những buổi sáng nhẹ lòng và đủ sức khỏe để tận hưởng những điều mình yêu thích.\n\nCó những lời thương đôi khi khó nói thành câu, nhưng {self} luôn muốn {you} biết rằng {you} rất quan trọng. Mong hai chúng ta có thêm nhiều dịp ngồi bên nhau, trò chuyện thong thả và hiểu nhau hơn từng chút một.'
    },
    {
      title: 'Niềm vui giản dị',
      body: 'Chúc {you} một ngày 20/10 có nhiều niềm vui giản dị: một cuộc trò chuyện hợp ý, một món ngon vừa miệng, hay một khoảng thời gian yên tĩnh thật vừa vặn. Mong những ngày bình thường cũng mang đến cho {you} cảm giác được quan tâm như hôm nay.\n\nCảm ơn {you} vì tình thương dành cho {self}, theo cách rất riêng của {you}. Mong {you} luôn thấy mình được trân trọng, có thể nói ra điều mình cần và được đón nhận bằng sự dịu dàng.'
    }
  ],
  grandma: [
    {
      title: 'Thảnh thơi mỗi sớm',
      body: 'Nhân ngày 20/10, {self} chúc {you} luôn khỏe, ăn ngon, ngủ yên và có nhiều ngày thảnh thơi. Mong mỗi buổi sáng đều có một điều nho nhỏ khiến {you} vui, từ một chậu cây xanh đến một cuộc gọi hỏi thăm.\n\nVới {self}, được biết {you} đang vui và thấy lòng nhẹ nhõm là điều rất quý. Mong {you} luôn có người chuyện trò, có những việc yêu thích để mong chờ và cảm nhận được tình thương của cả nhà trong những điều gần gũi nhất.'
    },
    {
      title: 'Chuyện vui mỗi ngày',
      body: 'Hôm nay, {self} gửi {you} lời chúc có thật nhiều chuyện vui để kể và những người sẵn lòng ngồi nghe. Mong {you} luôn được sống theo nhịp mình thấy dễ chịu, làm những điều mình thích và gặp những người khiến mình vui lòng.\n\nMỗi câu chuyện, suy nghĩ và mong muốn của {you} đều đáng được lắng nghe. Chúc {you} nhiều sức khỏe, nhiều tiếng cười và luôn thấy mình được quan tâm, trong ngày 20/10 này cũng như những ngày sau.'
    },
    {
      title: 'Ấm áp quanh bà',
      body: 'Chúc {you} một ngày 20/10 ấm áp, với những lời hỏi han chân thành và những điều tốt lành thật gần. Mong {you} có sức khỏe để tận hưởng cuộc sống, có lúc nghỉ ngơi thoải mái và có niềm vui theo cách riêng của mình.\n\nCó {you} trong cuộc sống là một điều quý đối với {self}. Mong chúng ta có thêm nhiều dịp ở bên nhau, để {self} được nghe {you} kể chuyện, chia sẻ chuyện của mình và gửi tình thương bằng cả những việc nhỏ mỗi ngày.'
    }
  ],
  teacher: [
    {
      title: 'Một lời biết ơn',
      body: 'Nhân ngày 20/10, {self} xin gửi đến {you} lời chúc sức khỏe, bình an và nhiều niềm vui. Cảm ơn {you} vì công việc dạy học, vì những kiến thức được trao đi và sự quan tâm dành cho học trò.\n\nMong những cố gắng của {you} được ghi nhận bằng sự tôn trọng và những điều kiện làm việc thuận lợi. Ngoài lớp học, chúc {you} có thời gian cho sở thích riêng, cho người thân và cho những điều giúp mình thấy thư thái.'
    },
    {
      title: 'Niềm vui với nghề',
      body: 'Chúc {you} một ngày 20/10 thật vui và một hành trình làm nghề có nhiều điều đáng mong chờ. Mong {you} gặp những lớp học cởi mở, những đồng nghiệp biết hỗ trợ nhau và những cơ hội để tiếp tục học hỏi điều mình quan tâm.\n\nTừ vị trí của một người học, {self} trân trọng sự kiên nhẫn và chuyên môn mà công việc này đòi hỏi. Chúc {you} giữ được niềm vui với nghề, đồng thời luôn có đủ thời gian và sự chăm sóc dành cho bản thân.'
    },
    {
      title: 'Những điều tử tế',
      body: 'Nhân ngày dành để gửi lời trân trọng đến phụ nữ, {self} chúc {you} luôn được đón nhận bằng sự tử tế. Mong mỗi ngày làm việc có những cuộc trao đổi tích cực, những tiến bộ nhỏ đáng vui và những khoảng nghỉ thật cần thiết.\n\nLời chúc này cũng là một lời cảm ơn dành cho vai trò của {you} trong việc giúp học trò hiểu biết thêm và tự tin hơn. Chúc {you} sức khỏe, sự an tâm và nhiều niềm vui trong cả công việc lẫn cuộc sống riêng.'
    }
  ],
  sister_older: [
    {
      title: 'Một khoảng trời riêng',
      body: 'Chúc {you} một ngày 20/10 thật vui và có một khoảng thời gian chỉ dành cho điều mình thích. Mong những dự định của {you} được tiến triển thuận lợi, những lúc cần nghỉ ngơi cũng có thể nghỉ mà không thấy áy náy.\n\nVới {self}, {you} luôn là một người rất đáng quý, dù hôm nay mạnh mẽ hay thấy mình cần được an ủi. Mong {you} có những mối quan hệ khiến mình thoải mái và một cuộc sống ngày càng gần với điều mình mong muốn.'
    },
    {
      title: 'Vững vàng và dịu dàng',
      body: 'Nhân ngày 20/10, {self} chúc {you} đủ tự tin để chọn điều phù hợp với mình và đủ nhẹ lòng khi cần thay đổi hướng đi. Mong công việc có tiến triển, sức khỏe được chăm sóc và những nỗ lực của {you} được nhìn nhận công bằng.\n\nĐiều {self} mong là {you} luôn có một nơi để chia sẻ mà không phải cố tỏ ra ổn. Chúc {you} được yêu thương bằng sự tôn trọng, được lắng nghe và có nhiều ngày sống đúng với nhịp của mình.'
    },
    {
      title: 'Niềm vui của chị',
      body: 'Hôm nay, {self} chúc {you} gặp một điều vui thật bất ngờ và có nhiều điều vui thật bền lâu. Có thể là một kế hoạch thành công, một sở thích mới hay đơn giản là những ngày trôi qua dễ chịu hơn.\n\nMong {you} không quên những điều làm mình háo hức giữa bao việc cần lo. Chúc {you} một ngày 20/10 ấm áp, có người đồng hành đáng tin và luôn cảm thấy những mong muốn của mình cũng quan trọng.'
    }
  ],
  sister_younger: [
    {
      title: 'Cứ lớn theo cách mình',
      body: 'Chúc {you} một ngày 20/10 vui vẻ và luôn có cơ hội khám phá điều mình thích. Mong {you} được thử, được học và từng bước tìm ra con đường phù hợp với bản thân, không cần vội so mình với bất kỳ ai.\n\nVới {self}, điều đáng quý là {you} được sống an toàn, được tôn trọng và có thể nói ra suy nghĩ của mình. Chúc {you} có những người bạn tử tế, sức khỏe thật tốt và nhiều niềm vui trên chặng đường phía trước.'
    },
    {
      title: 'Một ngày nhiều nắng',
      body: 'Nhân ngày 20/10, {self} gửi {you} một lời chúc thật tươi: mong việc học, công việc hay những kế hoạch riêng đều có thêm điều thuận lợi. Chúc {you} có nhiều lúc cười thoải mái và những khoảng nghỉ đủ để nạp lại năng lượng.\n\nKhông phải ngày nào cũng dễ dàng, nên mong {you} biết tìm sự giúp đỡ khi cần và đối xử dịu dàng với chính mình. Bởi vậy, {self} mong {you} luôn cảm thấy mình có giá trị, ngay cả vào những ngày chưa làm được điều như ý.'
    },
    {
      title: 'Tin vào điều mình chọn',
      body: 'Chúc {you} ngày 20/10 có thật nhiều niềm vui và một điều nho nhỏ để tự hào về mình. Mong {you} giữ được sự tò mò, dám đặt câu hỏi và tự tin nói điều mình muốn bằng cách chân thành, rõ ràng.\n\nQua lời chúc này, {self} mong {you} có cơ hội theo đuổi những điều quan trọng với mình, cùng những người biết lắng nghe và tôn trọng lựa chọn ấy. Cứ đi từng bước vừa sức, dành thời gian cho niềm vui và nhớ chăm sóc sức khỏe của mình.'
    }
  ],
  friend: [
    {
      title: 'Vui theo cách của bạn',
      body: 'Chúc {you} một ngày 20/10 thật vui, theo đúng cách {you} thích: náo nhiệt hay yên tĩnh, ra ngoài hay dành thời gian cho mình. Mong hôm nay có một điều dễ thương khiến {you} mỉm cười.\n\nCùng với lời chúc hôm nay, {self} mong những ngày sắp tới của {you} có công việc vừa sức, những mối quan hệ tử tế và đủ thời gian cho điều mình quan tâm. Mong {you} luôn thấy thoải mái khi là chính mình và được tôn trọng trong những lựa chọn riêng.'
    },
    {
      title: 'Một lời chúc nhẹ lòng',
      body: 'Nhân ngày 20/10, {self} chúc {you} có thêm những ngày nhẹ lòng: việc khó tìm được hướng giải quyết, chuyện vui có người cùng chia sẻ và lúc mệt có thể nghỉ ngơi thật yên tâm.\n\nMong {you} không cần lúc nào cũng phải thật năng suất hay thật tích cực để thấy mình xứng đáng với những điều tốt đẹp. Chúc {you} khỏe, có những người đáng tin ở bên và luôn tìm được một niềm vui nhỏ dành cho mình.'
    },
    {
      title: 'Những dự định đang chờ',
      body: 'Chúc {you} một ngày 20/10 đầy năng lượng cho những điều đang ấp ủ. Mong {you} gặp cơ hội phù hợp, có người hỗ trợ khi cần và đủ tự tin để bắt đầu từ những bước nhỏ.\n\nBên cạnh đó, {self} cũng chúc {you} những niềm vui không cần gắn với thành tích: một món ăn ngon, một buổi đi chơi thoải mái hay một cuộc trò chuyện hợp ý. Mong hành trình phía trước có cả tiến bộ lẫn những khoảng thảnh thơi thật đáng quý.'
    }
  ],
  women_one: [
    {
      title: 'Trân trọng chính mình',
      body: 'Nhân ngày 20/10, {self} chúc {you} nhiều sức khỏe, niềm vui và sự an tâm. Mong {you} luôn có không gian để thể hiện suy nghĩ, được tôn trọng trong những lựa chọn và được ghi nhận bằng chính năng lực của mình.\n\nChúc những điều {you} theo đuổi ngày càng rõ hướng, những mối quan hệ xung quanh mang lại sự tin cậy và cuộc sống có nhiều lúc thật dễ chịu. Mong {you} luôn dành được sự quan tâm cần thiết cho bản thân.'
    },
    {
      title: 'Một ngày dành cho bạn',
      body: 'Chúc {you} một ngày 20/10 có những lời chúc chân thành, những cuộc gặp dễ chịu và một khoảng thời gian cho điều mình yêu thích. Mong niềm vui hôm nay đến từ những điều thật sự phù hợp với {you}.\n\nQua lời chúc này, {self} mong {you} luôn được lắng nghe và đối xử công bằng trong công việc cũng như cuộc sống. Chúc {you} đủ khỏe để thực hiện những dự định, đủ thảnh thơi để tận hưởng kết quả và có người đồng hành đáng tin.'
    },
    {
      title: 'Những điều tốt đang tới',
      body: 'Nhân ngày 20/10, {self} gửi đến {you} lời chúc bình an và nhiều cơ hội tốt. Mong những cố gắng của {you} gặp điều kiện thuận lợi, những câu hỏi có lời giải và những kế hoạch riêng dần thành hình.\n\nBên cạnh các mục tiêu, chúc {you} có cả những niềm vui giản dị và những ngày được nghỉ ngơi trọn vẹn. Mong {you} luôn thấy mình có quyền lựa chọn nhịp sống phù hợp và được đón nhận bằng sự tử tế.'
    }
  ],
  women_group: [
    {
      title: 'Mỗi người một niềm vui',
      body: 'Nhân ngày 20/10, {self} gửi đến {you} lời chúc sức khỏe, bình an và nhiều niềm vui. Mỗi người có những mong muốn và hành trình riêng; mong ai cũng có cơ hội theo đuổi điều quan trọng với mình.\n\nChúc {you} luôn được tôn trọng, được lắng nghe và được ghi nhận công bằng. Mong ngày hôm nay mang đến những lời quan tâm chân thành, và những ngày sau có thêm nhiều sự hỗ trợ thiết thực trong công việc lẫn cuộc sống.'
    },
    {
      title: 'Cùng nhau thêm vững vàng',
      body: 'Chúc {you} một ngày 20/10 ấm áp và có nhiều điều đáng vui. Mong mỗi người đều tìm thấy sự đồng hành phù hợp: người cùng chia sẻ ý tưởng, người hỗ trợ lúc cần và người biết trân trọng những khác biệt.\n\nQua lời chúc này, {self} mong {you} có sức khỏe, những cơ hội phát triển công bằng và thời gian chăm sóc đời sống riêng. Chúc chúng ta luôn dành cho nhau sự tử tế, để những ngày bình thường cũng trở nên dễ chịu hơn.'
    },
    {
      title: 'Dành lời thương chân thành',
      body: 'Nhân ngày 20/10, {self} xin gửi một lời chúc chân thành đến {you}: mong mỗi người đều được sống an toàn, có tiếng nói của mình và tự tin với những lựa chọn phù hợp. Chúc những nỗ lực đang có sớm gặp kết quả tốt lành.\n\nMong {you} có niềm vui theo cách riêng, có thể nghỉ ngơi khi cần và nhận được sự quan tâm bằng những hành động cụ thể. Chúc hôm nay là một ngày dễ chịu, với nhiều lời hỏi han, nụ cười và những cuộc trò chuyện ấm áp.'
    }
  ]
};

// 12. Cấu hình, trạng thái, hiển thị, sự kiện, nhạc và liên kết chia sẻ.
// Liên kết tự chứa, tự nén; không gửi dữ liệu tới dịch vụ ngoài.
/*
 * Self-contained card URLs: compact positional schema + LZ-string 1.5.0.
 * LZ source: https://registry.npmjs.org/lz-string/-/lz-string-1.5.0.tgz
 * Verified npm dist integrity (SHA-512):
 * h5bgJWpxJNswbU7qCrV0tIKQCaS3blPDrqKWx+QxzuzL1zGUzij9XCWLrSLsJPu5t+eWA/ycetzYAO5IOMcWAQ==
 * Adapted upstream compressor/decompressor: null-prototype dictionaries;
 * decoder checks total output BEFORE retaining each expanded phrase.
 * No external requests, storage service, token, or new runtime dependency.
 *
 * MIT License
 *
 * Copyright (c) 2013 pieroxy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
