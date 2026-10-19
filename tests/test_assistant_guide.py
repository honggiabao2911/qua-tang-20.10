"""Independent recipient music, real teacher gifts, and local guided card creation."""
import unittest
from playwright.sync_api import expect
import test_recipient_studio as rs

class GuideTests(rs.RecipientStudioTests):
    # Reuse browser fixtures, not the inherited suite.
    def chat(self,text):
        field=self.page.locator('#studio-helper-input');field.fill(text);field.press('Enter')
    def open_chat(self):
        if not self.page.locator('#studio-helper-copy').is_visible():self.page.locator('#studio-helper-toggle').click()
    def receiver_page(self):
        context=self.browser.new_context(viewport={'width':390,'height':844},reduced_motion='reduce');page=context.new_page();page.on('pageerror',lambda e:self.errors.append(str(e)));page.route('**/*.mp3',self.route_audio);return context,page
    def reply(self,text):
        self.page.locator('.helper-replies button',has_text=text).first.click()

    def test_15_other_music_group_survives_sharing_without_changing_mom_or_studio(self):
        self.add_group_audio('mom');self.add_group_audio('teacher');self.clipboard();self.editor('mom');self.settle_library()
        before=self.page.locator('#preview-greeting').inner_text()
        self.page.locator('#studio-music-toggle').click();self.studio_playing()
        self.page.locator('#recipient-music-group').select_option('teacher');self.settle_library()
        self.assertEqual('mom',self.page.evaluate('CardMusic.studioState().group'))
        self.assertTrue(self.page.evaluate('CardMusic.studioState().playing'))
        self.page.locator('[data-track-id="teacher:4"]').click()
        expect(self.page.locator('#preview-greeting')).to_have_text(before)
        self.welcome();self.receive();self.wait_playing('4co.mp3');link=self.copy_link()
        decoded=self.page.evaluate('h=>CardLinks.decode(h)',link[link.index('#'):]);self.assertEqual('mom',decoded['target']);self.assertEqual('teacher',decoded['design']['musicGroup'])
        context,page=self.receiver_page();page.goto(link);expect(page.locator('#bebe-welcome')).to_be_visible();self.receive(page)
        expect(page.locator('#letter-greeting')).to_have_text(before);page.wait_for_function("document.querySelector('#background-music').src.endsWith('4co.mp3')")
        context.close()

    def test_16_switching_music_back_to_auto_restores_the_recipient_group(self):
        self.add_group_audio('mom');self.add_group_audio('grandma');self.editor();self.settle_library()
        self.page.locator('#recipient-music-group').select_option('grandma');self.settle_library();self.page.locator('[data-track-id="grandma:3"]').click()
        self.page.locator('#recipient-music-group').select_option('');self.settle_library();self.assertEqual('mom:0',self.page.evaluate('CardMusic.currentId()'))
        expect(self.page.locator('#editor-title')).to_contain_text('mẹ')

    def test_17_three_teacher_scenes_have_real_foreground_openings_and_persistent_motion(self):
        for scene,foreground in [('teacherbloom','.gg-tree'),('teachingbook','.gg-page'),('chalkconstellation','.gg-chalk path')]:
            self.editor('teacher');self.page.locator(f'[data-theme-preset="{scene}"]').click();self.welcome();self.page.emulate_media(reduced_motion='no-preference');self.page.locator('.ba-flower-touch').click()
            stage=self.page.locator('#theme-stage .gift-scene');expect(stage).to_have_attribute('data-phase','opening',timeout=4000)
            self.assertTrue(stage.locator(foreground).first.evaluate("e=>e.getAnimations().some(a=>a.playState==='running')"))
            expect(self.page.locator('#letter-screen')).to_be_visible(timeout=6000);expect(self.page.locator('#theme-backdrop .gift-scene')).to_have_attribute('data-gift',scene)
            self.assertGreater(self.page.locator('#theme-backdrop').evaluate("e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"),0)
            self.page.emulate_media(reduced_motion='reduce')

    def test_18_teacher_flower_notes_edit_and_share_as_literal_text(self):
        self.clipboard();self.editor('teacher');self.page.locator('[data-theme-preset=teacherbloom]').click();self.open_design();expect(self.page.locator('#flower-notes-fields')).to_be_visible()
        self.page.locator('#flower-note-0').fill('<b>Cảm ơn cô</b> 🌷');self.page.locator('[data-theme-preset=teachingbook]').click();self.page.locator('[data-theme-preset=teacherbloom]').click()
        expect(self.page.locator('#flower-note-0')).to_have_value('<b>Cảm ơn cô</b> 🌷');self.welcome();self.receive();self.page.locator('#theme-backdrop [data-note-index="0"]').click()
        expect(self.page.locator('#theme-backdrop .gift-note-content')).to_have_text('<b>Cảm ơn cô</b> 🌷');self.assertEqual(0,self.page.locator('.gift-note-content b').count())
        link=self.copy_link();context,page=self.receiver_page();page.goto(link);self.receive(page);expect(page.locator('#theme-backdrop .gift-flower-note')).to_have_count(5);context.close()

    def test_19_faq_explains_journey_controls_and_privacy_without_mutating_card(self):
        self.editor('mom');before=self.page.locator('#preview-greeting').inner_text();self.open_chat()
        for question,expected in [('Món quà đầu tiên khi mở liên kết là gì?','bé B chào trước'),('Đổi nhóm nhạc thế nào?','người nhận và cách xưng hô vẫn giữ nguyên'),('Chữ ký làm sao?','ngón tay'),('Cỡ chữ đổi ở đâu?','phông và cỡ chữ'),('Lời nhắn ẩn có bảo mật không?','không có mật khẩu'),('Sao liên kết dài?','Web tự nén')]:
            self.chat(question);expect(self.page.locator('#studio-helper-log>p').last).to_contain_text(expected)
        expect(self.page.locator('#preview-greeting')).to_have_text(before);expect(self.page.locator('#editor-title')).to_contain_text('mẹ')

    def guided_review(self):
        self.open_chat();self.chat('Tôi cần web cho cô giáo bạn giúp tôi với');self.chat('Cô Lan');self.chat('Minh');self.reply('Trang sách biết ơn');self.chat('Em chúc cô một ngày thật vui!');self.chat('Cảm ơn cô đã luôn tin em.');self.reply('Hoa từ hạt sáng');self.chat('nhạc cho mẹ bài 3');self.chat('Học trò của cô · Minh')
        expect(self.page.locator('#studio-helper-log>p').last).to_contain_text('BẢN NHÁP CỦA BẠN')

    def test_20_guided_draft_does_not_mutate_before_review_and_undo_restores_ink(self):
        self.editor('mom');self.page.locator('#sender-name').fill('Tên cũ');self.open_design();self.page.locator('#custom-greeting').fill('Lời tự viết ban đầu.')
        pad=self.page.locator('#signature-pad');pad.scroll_into_view_if_needed();box=pad.bounding_box();self.page.mouse.move(box['x']+20,box['y']+25);self.page.mouse.down();self.page.mouse.move(box['x']+80,box['y']+55,steps=4);self.page.mouse.up()
        self.guided_review();expect(self.page.locator('#sender-name')).to_have_value('Tên cũ');expect(self.page.locator('#custom-greeting')).to_have_value('Lời tự viết ban đầu.')
        self.reply('Áp dụng bản nháp');expect(self.page.locator('#editor-title')).to_contain_text('cô');expect(self.page.locator('#recipient-name')).to_have_value('Cô Lan');expect(self.page.locator('#custom-greeting')).to_have_value('Em chúc cô một ngày thật vui!')
        expect(self.page.locator('#recipient-music-group')).to_have_value('mom');expect(self.page.locator('#signature-text')).to_have_value('Học trò của cô · Minh');self.assertEqual('mom:2',self.page.evaluate('CardMusic.currentId()'))
        self.reply('Hoàn tác bản nháp');expect(self.page.locator('#editor-title')).to_contain_text('mẹ');expect(self.page.locator('#sender-name')).to_have_value('Tên cũ');expect(self.page.locator('#custom-greeting')).to_have_value('Lời tự viết ban đầu.');self.assertGreater(self.page.locator('#signature-pad path').count(),0)

    def test_21_guided_creation_from_home_preview_and_shared_song_are_real(self):
        self.add_group_audio('mom');self.clipboard();self.page.goto(rs.bbtests.BASE_URL);self.guided_review();self.reply('Áp dụng bản nháp');self.settle_library();self.reply('Xem thiệp vừa tạo');expect(self.page.locator('#bebe-welcome')).to_be_visible();self.receive();self.wait_playing('2me.mp3')
        expect(self.page.locator('#letter-greeting')).to_have_text('Em chúc cô một ngày thật vui!');expect(self.page.locator('#letter-screen')).to_have_attribute('data-experience','teachingbook')
        link=self.copy_link();context,page=self.receiver_page();page.goto(link);self.receive(page);expect(page.locator('#letter-greeting')).to_have_text('Em chúc cô một ngày thật vui!');context.close()

    def test_22_wizard_back_skip_cancel_and_typing_bounds(self):
        self.editor();self.open_chat();self.chat('tạo thiệp cho bà');self.chat('Ngoại');self.reply('Quay lại');self.chat('Bà Mai');self.reply('Bỏ qua');self.reply('Bỏ qua');self.chat('x'*1000);self.chat('y'*1000);self.reply('Bỏ qua');self.reply('Bà · Bài 1');self.chat('x'*81)
        expect(self.page.locator('#studio-helper-log>p').last).to_contain_text('tối đa 80');self.chat('hủy');expect(self.page.locator('#editor-title')).to_contain_text('mẹ');expect(self.page.locator('#sender-name')).to_have_value('')

    def test_23_proactive_greeting_idle_glasses_and_no_interruption_or_audio(self):
        self.page.clock.install();self.page.goto(rs.bbtests.BASE_URL);self.page.clock.fast_forward(2500);expect(self.page.locator('.helper-nudge')).to_be_visible();expect(self.page.locator('.helper-nudge')).to_contain_text('Hello!')
        self.assertTrue(self.page.locator('#background-music').evaluate('a=>a.paused'));self.page.clock.fast_forward(5600);self.page.clock.fast_forward(3100);expect(self.page.locator('#studio-helper')).to_have_attribute('data-outfit','glasses')
        self.page.locator('.helper-nudge-close').click();self.page.clock.fast_forward(120000);expect(self.page.locator('.helper-nudge')).not_to_be_visible()
        self.open_chat();self.chat('chán quá đeo kính đi');expect(self.page.locator('#studio-helper')).to_have_attribute('data-outfit','glasses');expect(self.page.locator('#studio-helper-log>p').last).to_contain_text('Kính đen')
        self.page.evaluate("Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))");expect(self.page.locator('#studio-helper')).to_have_attribute('data-outfit','')

    def test_26_vietnamese_co_does_not_confuse_can_with_teacher(self):
        self.editor();self.open_chat();self.chat('Tôi muốn tạo thiệp cho mẹ có được không?')
        expect(self.page.locator('#studio-helper-log>p').last).to_contain_text('Mẹ')
        self.chat('hủy');self.chat('Thiệp của tôi đang chọn gì?');expect(self.page.locator('#studio-helper-log>p').last).to_contain_text('con – mẹ')
        self.chat('hủy');self.chat('Mẫu cho cô giáo nào đẹp?');expect(self.page.locator('#studio-helper-log>p').last).to_contain_text('Cây hoa tri ân')

    def test_25_faq_navigation_opens_collapsed_controls_and_closes_mobile_chat(self):
        self.page.set_viewport_size({'width':390,'height':844});self.editor();self.open_chat();self.chat('Hiệu ứng chỉnh ở đâu?');self.reply('Đến mục này')
        expect(self.page.locator('#studio-helper-copy')).not_to_be_visible();expect(self.page.locator('#design-panel')).to_have_attribute('open','');expect(self.page.locator('#effect-field')).to_be_focused()

    def test_24_phone_wizard_keyboard_and_reduced_teacher_scenes_fit(self):
        self.page.set_viewport_size({'width':360,'height':800});self.editor('teacher');self.open_chat();self.chat('giúp tôi tạo thiệp cho cô');self.page.locator('#studio-helper-input').focus();self.page.evaluate("Object.defineProperty(visualViewport,'height',{configurable:true,value:390});visualViewport.dispatchEvent(new Event('resize'))")
        rect=self.page.locator('#studio-helper-input').bounding_box();self.assertLess(rect['y']+rect['height'],390);self.assert_layout('guided keyboard');self.chat('hủy');self.page.keyboard.press('Escape')
        self.page.evaluate("delete visualViewport.height;visualViewport.dispatchEvent(new Event('resize'))")
        for scene in ['teacherbloom','teachingbook','chalkconstellation']:
            self.editor('teacher');self.page.locator(f'[data-theme-preset={scene}]').click();self.welcome();self.receive();self.assert_layout(scene);self.assertEqual(0,self.page.locator('#theme-backdrop').evaluate("e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"))

# Fixtures are inherited; only the task's new scenarios are run from this file.
for _name in list(rs.RecipientStudioTests.__dict__):
    if _name.startswith('test_'):setattr(GuideTests,_name,None)
if __name__=='__main__':unittest.main(verbosity=2)
