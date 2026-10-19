"""Recipient-first discovery, live private drafts and a responsive Be B companion."""
import unittest
from playwright.sync_api import expect
import test_assistant_guide as guide
import test_bebe as bb

class ScopedCompanionTests(unittest.TestCase):
    setUpClass=classmethod(bb.BebeBrowserTests.setUpClass.__func__)
    tearDownClass=classmethod(bb.BebeBrowserTests.tearDownClass.__func__)
    setUp=bb.BebeBrowserTests.setUp
    tearDown=bb.BebeBrowserTests.tearDown
    new_page=bb.BebeBrowserTests.new_page
    route_audio=bb.BebeBrowserTests.route_audio
    editor=bb.BebeBrowserTests.editor
    welcome=bb.BebeBrowserTests.welcome
    receive=bb.BebeBrowserTests.receive
    add_group_audio=bb.BebeBrowserTests.add_group_audio
    settle_library=bb.BebeBrowserTests.settle_library
    assert_layout=bb.BebeBrowserTests.assert_layout
    chat=guide.GuideTests.chat
    open_chat=guide.GuideTests.open_chat
    reply=guide.GuideTests.reply
    clipboard=bb.BebeBrowserTests.clipboard
    copy_link=bb.BebeBrowserTests.copy_link
    receiver_page=guide.GuideTests.receiver_page

    def wizard(self,target='grandma'):
        self.editor(target);self.open_chat();self.page.locator('[data-helper-topic=create]').click()

    def to_music(self,target='grandma'):
        self.wizard(target)
        for _ in range(5):self.reply('Bỏ qua')
        self.reply('Hoa từ hạt sáng')
        expect(self.page.locator('#studio-helper-log>p').last).to_contain_text('sáu bài nhạc')

    def test_01_initial_filter_matches_each_recipient_but_full_library_remains_accessible(self):
        for target in ['mom','grandma','teacher','sister','women','lover']:
            self.editor(target);expect(self.page.locator('#theme-filter')).to_have_value('recipient')
            visible=self.page.locator('.theme-entry:not([hidden])').evaluate_all('es=>es.map(e=>e.dataset.entryId)')
            expected=self.page.evaluate('t=>CardRecommendations.idsFor(t)',target);self.assertEqual(expected,visible)
            self.page.locator('#theme-filter').select_option('all');expect(self.page.locator('[data-theme-preset]:visible')).to_have_count(41)
        self.page.locator('#back-to-recipients').click();self.page.locator('[data-recipient=grandma]').first.click();expect(self.page.locator('#theme-filter')).to_have_value('recipient')
        self.assertEqual('grandmatea',self.page.locator('[data-theme-preset]:visible').first.get_attribute('data-theme-preset'))

    def test_02_music_suggestions_and_examples_stay_in_the_selected_group(self):
        for target,label in [('mom','Mẹ'),('grandma','Bà'),('teacher','Cô giáo'),('sister','Chị / em gái'),('women','Bạn nữ / nhóm phụ nữ'),('lover','Người thương')]:
            self.to_music(target);buttons=self.page.locator('.helper-replies button').all_text_contents()
            self.assertEqual([f'{label} · Bài {n}' for n in range(1,7)],buttons[:6]);self.assertEqual(10,len(buttons))
            self.assertNotIn('nhạc cho bà bài 3',self.page.locator('#studio-helper-log>p').last.inner_text())
            self.reply(f'{label} · Bài 4');expect(self.page.locator('.helper-preview-meta')).to_contain_text(f'Nhạc {label} 4')
            if target=='grandma':
                expect(self.page.locator('#helper-step-example')).to_contain_text('Cháu thương bà');self.assertNotIn('mẹ',self.page.locator('#helper-step-example').inner_text().lower())
            self.chat('hủy')

    def test_03_cross_group_music_is_explicit_and_keeps_its_chosen_track(self):
        self.to_music('grandma');self.assertEqual(0,self.page.locator('.helper-replies button',has_text='Mẹ ·').count())
        self.reply('Chọn nhóm nhạc khác');self.page.locator('.helper-replies button',has_text='Cô giáo').click();self.reply('Cô giáo · Bài 5')
        self.reply('Bỏ qua');self.reply('Áp dụng bản nháp');expect(self.page.locator('#editor-title')).to_contain_text('bà');expect(self.page.locator('#recipient-music-group')).to_have_value('teacher');self.assertEqual('teacher:4',self.page.evaluate('CardMusic.currentId()'))

    def test_04_live_typed_draft_uses_actual_greeting_and_does_not_mutate_main_card(self):
        self.wizard('grandma');field=self.page.locator('#studio-helper-input');field.fill('Ngoại Mai')
        expect(self.page.locator('.helper-preview-recipient')).to_have_text('Gửi Ngoại Mai,');expect(self.page.locator('#recipient-name')).to_have_value('')
        field.press('Enter');self.chat('An');self.chat('nền đen ngân hà');expect(self.page.locator('#helper-draft-preview')).to_have_attribute('data-theme','galaxy')
        field.fill('<b>Cháu chúc bà bình yên.</b>');expect(self.page.locator('.helper-preview-body')).to_have_text('<b>Cháu chúc bà bình yên.</b>');self.assertEqual(0,self.page.locator('.helper-preview-body b').count())
        field.press('Enter');self.chat('Thương bà nhiều!');self.reply('Hoa mọc');self.reply('Bà · Bài 2');self.chat('Cháu của bà · An')
        expected=self.page.locator('.helper-preview-body').inner_text();expect(self.page.locator('#recipient-name')).to_have_value('');self.reply('Áp dụng bản nháp');self.welcome();self.receive();expect(self.page.locator('#letter-greeting')).to_have_text(expected)

    def test_05_each_question_has_a_small_example_and_contextual_placeholder(self):
        self.wizard('grandma');expect(self.page.locator('#helper-step-example')).to_contain_text('Ngoại');self.chat('Ngoại');expect(self.page.locator('#helper-step-example')).to_contain_text('An')
        self.chat('An');expect(self.page.locator('#helper-step-example')).to_contain_text('Chiều trà cùng bà');self.chat('dịu dàng');expect(self.page.locator('#helper-step-example')).to_contain_text('cháu');self.chat('gợi ý');expect(self.page.locator('#helper-step-example')).to_contain_text('bà')
        self.reply('Bỏ qua');expect(self.page.locator('#helper-step-example')).to_contain_text('Hạt sáng');self.reply('Hoa từ hạt sáng');expect(self.page.locator('#helper-step-example')).to_contain_text('bài 3')

    def test_06_unknown_theme_requests_are_not_silently_applied(self):
        self.wizard('teacher');self.chat('Cô An');self.chat('Minh');self.chat('mẫu ngoài không có trong thư viện')
        expect(self.page.locator('#studio-helper-log>p').last).to_contain_text('chưa nhận ra');self.chat('quyển sách mở ra');expect(self.page.locator('#helper-draft-preview')).to_have_attribute('data-theme','teachingbook')
        self.chat('Món quà đầu tiên là gì?');expect(self.page.locator('#studio-helper-log>p').last).to_contain_text('bé B chào trước');self.chat('gợi ý');expect(self.page.locator('#studio-helper-log>p').last).to_contain_text('điều riêng')

    def test_07_explicit_commands_edit_only_requested_fields_and_support_undo(self):
        self.add_group_audio('grandma');self.editor('grandma');self.page.locator('#sender-name').fill('Tên giữ lại');before=self.page.locator('#preview-greeting').inner_text();self.open_chat()
        self.chat('đổi mẫu sang ngân hà');expect(self.page.locator('#preview-card')).to_have_attribute('data-theme','midnight');expect(self.page.locator('#sender-name')).to_have_value('Tên giữ lại');expect(self.page.locator('#preview-greeting')).to_have_text(before)
        self.chat('tắt hiệu ứng');expect(self.page.locator('#effect-field')).to_have_value('none');self.chat('hoàn tác');expect(self.page.locator('#effect-field')).to_have_value('constellation')
        self.chat('chọn bài 3');self.assertEqual('grandma:2',self.page.evaluate('CardMusic.currentId()'));self.chat('đổi tên người gửi thành An');expect(self.page.locator('#sender-name')).to_have_value('An')
        self.chat('đổi tên bé B thành Mây');expect(self.page.locator('#welcome-name')).to_have_value('Mây');self.chat('giảm hiệu ứng');expect(self.page.locator('#intensity-field')).to_have_value('gentle')

    def test_08_draft_can_be_revised_by_command_without_applying_it(self):
        self.to_music('grandma');self.reply('Bà · Bài 1');self.chat('Cháu · An');self.chat('đổi mẫu sang ngân hà');self.chat('đổi nhạc bài 6')
        expect(self.page.locator('.helper-preview-meta')).to_contain_text('Vũ trụ ngân hà');expect(self.page.locator('.helper-preview-meta')).to_contain_text('Bà 6');expect(self.page.locator('#editor-title')).to_contain_text('bà')
        self.assertEqual('grandma:0',self.page.evaluate('CardMusic.currentId()'));self.reply('Áp dụng bản nháp');self.assertEqual('grandma:5',self.page.evaluate('CardMusic.currentId()'))

    def test_09_recipient_change_during_a_draft_restarts_questions_in_the_new_group(self):
        self.wizard('mom');self.chat('Mẹ An');self.page.locator('#studio-helper-close').click();self.page.locator('#back-to-recipients').click();self.page.locator('[data-recipient=grandma]').first.click();self.open_chat()
        expect(self.page.locator('#studio-helper-log>p').last).to_contain_text('Bà');expect(self.page.locator('#helper-step-example')).to_contain_text('Ngoại');expect(self.page.locator('.helper-preview-recipient')).to_contain_text('Bà')

    def test_10_idle_glasses_and_selfie_show_soon_without_clicking_or_audio(self):
        self.page.clock.install();self.page.goto(bb.BASE_URL);self.page.clock.fast_forward(2500);expect(self.page.locator('.helper-nudge')).to_contain_text('Hello!')
        self.page.clock.fast_forward(5500);self.page.clock.fast_forward(3100);expect(self.page.locator('#studio-helper')).to_have_attribute('data-outfit','glasses');expect(self.page.locator('.helper-nudge')).to_contain_text('Thấy tớ ngầu hông?')
        self.assertEqual('rgb(10, 17, 26)',self.page.locator('.helper-shade-frame').first.evaluate('e=>getComputedStyle(e).fill'))
        self.page.clock.fast_forward(5500);self.page.clock.fast_forward(3100);expect(self.page.locator('#studio-helper')).to_have_attribute('data-act','selfie');expect(self.page.locator('.helper-nudge')).to_contain_text('cười xinh')
        self.assertTrue(self.page.locator('#background-music').evaluate('a=>a.paused'));self.page.locator('.helper-nudge-close').click();self.page.clock.fast_forward(120000);expect(self.page.locator('.helper-nudge')).not_to_be_visible();expect(self.page.locator('#studio-helper')).to_have_attribute('data-act','')

    def test_11_ball_and_sunglasses_play_on_request_and_respect_motion_and_visibility(self):
        self.page.emulate_media(reduced_motion='no-preference');self.editor();self.open_chat();self.chat('tung bóng đi bé B')
        expect(self.page.locator('#studio-helper')).to_have_attribute('data-act','ball');self.assertTrue(self.page.locator('.helper-toy-ball').first.evaluate("e=>e.getAnimations().some(a=>a.playState==='running')"))
        self.page.emulate_media(reduced_motion='reduce');self.assertEqual(0,self.page.locator('#studio-helper').evaluate("e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"))
        self.chat('đeo kính đen');expect(self.page.locator('#studio-helper')).to_have_attribute('data-outfit','glasses');expect(self.page.locator('#studio-helper-log>p').last).to_contain_text('Thấy tớ ngầu hông?')
        self.page.evaluate("Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))");expect(self.page.locator('#studio-helper')).to_have_attribute('data-outfit','');expect(self.page.locator('#studio-helper')).to_have_attribute('data-act','')

    def test_12_idle_does_not_interrupt_typing_or_drawing(self):
        self.page.clock.install();self.editor('grandma');self.page.locator('#personal-message').focus();self.page.clock.fast_forward(30000);expect(self.page.locator('.helper-nudge')).not_to_be_visible()
        self.page.locator('#personal-message').evaluate('e=>e.blur()');pad=self.page.locator('#signature-pad');pad.scroll_into_view_if_needed();r=pad.bounding_box();self.page.mouse.move(r['x']+30,r['y']+35);self.page.mouse.down();self.page.clock.fast_forward(30000);expect(self.page.locator('.helper-nudge')).not_to_be_visible();self.page.mouse.move(r['x']+90,r['y']+50,steps=4);self.page.mouse.up();self.assertGreater(self.page.locator('#signature-pad path').count(),0)

    def test_13_live_preview_and_replies_fit_phone_and_mobile_keyboard(self):
        for width in [360,390]:
            self.page.set_viewport_size({'width':width,'height':844});self.wizard('grandma');self.chat('Ngoại');self.chat('An');self.assert_layout(f'draft {width}')
            self.assertLessEqual(self.page.locator('#helper-draft-preview').bounding_box()['width'],width-24)
            self.page.locator('#studio-helper-input').focus();self.page.evaluate("Object.defineProperty(visualViewport,'height',{configurable:true,value:390});visualViewport.dispatchEvent(new Event('resize'))")
            rect=self.page.locator('#studio-helper-input').bounding_box();self.assertLess(rect['y']+rect['height'],390);expect(self.page.locator('#helper-draft-preview')).to_be_visible();self.assert_layout('keyboard draft')
            self.page.evaluate("delete visualViewport.height;visualViewport.dispatchEvent(new Event('resize'))");self.chat('hủy');self.page.keyboard.press('Escape')

    def test_15_context_questions_do_not_become_edit_commands(self):
        self.editor('grandma');self.page.locator('#signature-text').fill('Cháu của bà');self.open_chat()
        for question in ['Chữ ký làm sao?', 'Tên người gửi là gì?', 'Tắt hiệu ứng như thế nào?']:
            self.chat(question);expect(self.page.locator('#signature-text')).to_have_value('Cháu của bà');expect(self.page.locator('#sender-name')).to_have_value('')
        self.chat('tạo thiệp cho cô');self.chat('Thiệp của tôi đang chọn gì?')
        expect(self.page.locator('#studio-helper-log>p').last).to_contain_text('em – cô');self.chat('hủy');expect(self.page.locator('#editor-title')).to_contain_text('bà')

    def test_14_default_group_music_remains_correct_in_a_shared_card(self):
        self.add_group_audio('grandma');self.clipboard();self.to_music('grandma');self.reply('Bà · Bài 6');self.reply('Bỏ qua');self.reply('Áp dụng bản nháp');self.settle_library();self.welcome();self.receive()
        link=self.copy_link();context,page=self.receiver_page()
        try:
            page.goto(link);self.receive(page);self.assertEqual('grandma:5',page.evaluate('CardMusic.currentId()'));expect(page.locator('#letter-greeting')).to_contain_text('bà')
        finally:context.close()

if __name__=='__main__':unittest.main(verbosity=2)
