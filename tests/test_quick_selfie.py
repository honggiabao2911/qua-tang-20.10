"""Quick creation, mobile step controls and Be B's fictional selfie routine."""
import unittest
from playwright.sync_api import expect
import test_scoped_companion as scoped
import test_bebe as bb

class QuickSelfieTests(unittest.TestCase):
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
    open_chat=scoped.ScopedCompanionTests.open_chat
    chat=scoped.ScopedCompanionTests.chat
    reply=scoped.ScopedCompanionTests.reply
    clipboard=bb.BebeBrowserTests.clipboard
    copy_link=bb.BebeBrowserTests.copy_link
    receiver_page=scoped.ScopedCompanionTests.receiver_page

    def quick(self,target='grandma'):
        self.editor(target);self.page.locator('#start-quick-card').click()
        expect(self.page.locator('.helper-step-title')).to_have_text('Tạo nhanh · 1 / 3')

    def quick_review(self,target='grandma'):
        self.quick(target);self.chat('An');self.reply('Bỏ qua');self.reply('Dùng lời bé B đã chọn')
        expect(self.page.locator('#studio-helper-log>p').last).to_contain_text('BẢN NHÁP')

    def test_01_six_groups_can_create_a_card_in_three_questions(self):
        for target,you in [('mom','mẹ'),('grandma','bà'),('teacher','cô'),('sister','chị'),('women','bạn'),('lover','em')]:
            self.quick(target);self.chat('An');expect(self.page.locator('.helper-step-title')).to_have_text('Tạo nhanh · 2 / 3')
            self.reply('Bỏ qua');expect(self.page.locator('.helper-step-title')).to_have_text('Tạo nhanh · 3 / 3');self.reply('Dùng lời bé B đã chọn')
            expect(self.page.locator('#sender-name')).to_have_value('');preview=self.page.locator('.helper-preview-body').inner_text();self.assertIn(you,preview)
            self.reply('Dùng thiệp này');expect(self.page.locator('#sender-name')).to_have_value('An');expect(self.page.locator('#preview-greeting')).to_have_text(preview)
            self.assertEqual(target+':0',self.page.evaluate('CardMusic.currentId()'));expect(self.page.locator('#recipient-music-group')).to_have_value('')

    def test_02_quick_card_keeps_the_entered_recipient_and_shares_exact_text(self):
        self.add_group_audio('grandma');self.clipboard();self.editor('grandma');self.page.locator('#recipient-name').fill('Ngoại Mai');self.page.locator('#start-quick-card').click()
        self.chat('An');self.chat('nền đen ngân hà');self.chat('Cháu thương bà nhiều 🌷 <b>Ngày thật vui</b>')
        expect(self.page.locator('.helper-preview-recipient')).to_have_text('Gửi Ngoại Mai,');body=self.page.locator('.helper-preview-body').inner_text()
        self.reply('Dùng thiệp này');expect(self.page.locator('#arrival-style')).to_have_value('stardust');self.welcome();self.receive();expect(self.page.locator('#letter-greeting')).to_have_text(body)
        link=self.copy_link();context,page=self.receiver_page()
        try:
            page.goto(link);self.receive(page);expect(page.locator('#letter-recipient')).to_have_text('Gửi Ngoại Mai,');expect(page.locator('#letter-greeting')).to_have_text(body);expect(page.locator('#letter-message')).to_have_text('Cháu thương bà nhiều 🌷 <b>Ngày thật vui</b>');self.assertEqual(0,page.locator('#letter-message b').count())
        finally:context.close()

    def test_03_quick_review_can_expand_into_music_and_signature(self):
        self.quick_review('teacher');self.reply('Chỉnh thêm nhạc / chữ ký');expect(self.page.locator('#studio-helper-log>p').last).to_contain_text('sáu bài nhạc cho cô giáo')
        self.reply('Cô giáo · Bài 4');self.chat('Học trò của cô · An');self.reply('Áp dụng bản nháp');expect(self.page.locator('#sender-name')).to_have_value('An');expect(self.page.locator('#signature-text')).to_have_value('Học trò của cô · An');self.assertEqual('teacher:3',self.page.evaluate('CardMusic.currentId()'))

    def test_04_empty_next_uses_optional_defaults_and_review_still_requires_apply(self):
        self.quick();submit=self.page.locator('#studio-helper-chat button');expect(submit).to_have_text('Tiếp');expect(self.page.locator('#studio-helper-input')).to_have_attribute('enterkeyhint','next')
        submit.click();submit.click();submit.click();expect(self.page.locator('.helper-step-title')).to_contain_text('Xem lại thiệp');expect(submit).to_have_text('Gửi');expect(self.page.locator('#sender-name')).to_have_value('')
        self.reply('Dùng thiệp này');expect(self.page.locator('#sender-name')).to_have_value('');expect(self.page.locator('#preview-greeting')).to_contain_text('bà')

    def test_05_vietnamese_composition_and_correctable_long_names_do_not_advance(self):
        self.quick();field=self.page.locator('#studio-helper-input');field.fill('a'*101);field.press('Enter');expect(field).to_have_value('a'*101);expect(self.page.locator('.helper-step-title')).to_have_text('Tạo nhanh · 1 / 3')
        field.fill('Bảo');field.dispatch_event('compositionstart',{'data':'ả'});self.page.locator('#studio-helper-chat').dispatch_event('submit');expect(self.page.locator('.helper-step-title')).to_have_text('Tạo nhanh · 1 / 3')
        field.dispatch_event('compositionend',{'data':'ả'});field.press('Enter');expect(self.page.locator('.helper-step-title')).to_have_text('Tạo nhanh · 2 / 3');expect(self.page.locator('.helper-preview-signature')).to_have_text('Bảo')

    def test_06_phone_and_flash_animate_without_accessing_a_camera_or_starting_audio(self):
        self.context.add_init_script("window.cameraCalls=0;if(navigator.mediaDevices)navigator.mediaDevices.getUserMedia=()=>{window.cameraCalls++;return Promise.reject(new Error('unexpected camera'));};")
        self.page.emulate_media(reduced_motion='no-preference');self.editor();self.open_chat();self.chat('bé B lấy điện thoại tự sướng đi')
        expect(self.page.locator('#studio-helper')).to_have_attribute('data-act','selfie');expect(self.page.locator('#studio-helper-log>p').last).to_contain_text('cười xinh')
        self.assertTrue(self.page.locator('.helper-selfie-phone').first.evaluate("e=>e.getAnimations().some(a=>a.playState==='running')"));self.assertEqual(0,self.page.evaluate('cameraCalls'));self.assertTrue(self.page.locator('#background-music').evaluate('a=>a.paused'))
        self.page.emulate_media(reduced_motion='reduce');self.assertEqual(0,self.page.locator('#studio-helper').evaluate("e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"));self.assertEqual('none',self.page.locator('.helper-selfie-flash').first.evaluate('e=>getComputedStyle(e).display'))
        self.page.evaluate("Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))");expect(self.page.locator('#studio-helper')).to_have_attribute('data-act','')

    def test_07_selfie_is_available_as_a_button_and_the_sunglasses_phrase_is_short(self):
        self.editor();self.open_chat();self.page.locator('[data-helper-topic=play]').click();self.reply('Tự sướng');expect(self.page.locator('#studio-helper')).to_have_attribute('data-act','selfie');self.reply('Kính đen')
        expect(self.page.locator('#studio-helper-log>p').last).to_have_text('Thấy tớ ngầu hông? 😎');expect(self.page.locator('#studio-helper')).to_have_attribute('data-outfit','glasses')

    def test_08_idle_selfie_happens_without_clicking_and_dismissal_stops_it(self):
        self.page.clock.install();self.page.goto(bb.BASE_URL);self.page.clock.fast_forward(2500);self.page.clock.fast_forward(5500);self.page.clock.fast_forward(3100)
        expect(self.page.locator('.helper-nudge')).to_have_text('Thấy tớ ngầu hông? 😎×');self.page.clock.fast_forward(5500);self.page.clock.fast_forward(3100);expect(self.page.locator('#studio-helper')).to_have_attribute('data-act','selfie')
        self.page.locator('.helper-nudge-close').click();self.page.clock.fast_forward(120000);expect(self.page.locator('#studio-helper')).to_have_attribute('data-act','');expect(self.page.locator('.helper-nudge')).not_to_be_visible()

    def test_09_controls_fit_small_phones_and_stay_above_the_keyboard(self):
        for width,height in [(320,700),(360,800),(390,844)]:
            self.page.set_viewport_size({'width':width,'height':height});self.quick();self.assert_layout(f'quick {width}');self.page.locator('#studio-helper-input').focus()
            self.page.evaluate("Object.defineProperty(visualViewport,'height',{configurable:true,value:390});visualViewport.dispatchEvent(new Event('resize'))")
            for selector in ['#studio-helper-chat button','.helper-step-tools button']:
                for box in self.page.locator(selector).all():
                    r=box.bounding_box();self.assertLessEqual(r['y']+r['height'],390);self.assertGreaterEqual(r['height'],44)
            self.assert_layout('quick keyboard');self.page.evaluate("Object.defineProperty(visualViewport,'height',{configurable:true,value:300});visualViewport.dispatchEvent(new Event('resize'))")
            expect(self.page.locator('#studio-helper')).to_have_attribute('data-compact','true');r=self.page.locator('#studio-helper-input').bounding_box();self.assertLessEqual(r['y']+r['height'],300);self.assert_layout('compact keyboard')
            self.page.evaluate("delete visualViewport.height;visualViewport.dispatchEvent(new Event('resize'))");self.chat('hủy');self.page.keyboard.press('Escape')

    def test_10_normal_detailed_creation_is_still_available_and_undo_restores_the_card(self):
        self.editor('mom');self.page.locator('#sender-name').fill('Tên cũ');old=self.page.locator('#preview-greeting').inner_text();self.page.locator('#start-quick-card').click();self.chat('An');self.reply('Bỏ qua');self.reply('Dùng lời bé B đã chọn');self.reply('Dùng thiệp này');self.reply('Hoàn tác bản nháp')
        expect(self.page.locator('#sender-name')).to_have_value('Tên cũ');expect(self.page.locator('#preview-greeting')).to_have_text(old);self.page.locator('[data-helper-topic=create]').click();expect(self.page.locator('#studio-helper-log>p').last).to_contain_text('gọi thân mật')

    def test_12_current_question_stays_in_view_after_choices_change_height(self):
        self.page.set_viewport_size({'width':390,'height':844});self.quick();self.chat('An')
        self.page.wait_for_function("()=>{const l=document.querySelector('#studio-helper-log').getBoundingClientRect(),p=document.querySelector('#studio-helper-log').lastElementChild.getBoundingClientRect();return p.bottom<=l.bottom+1 && p.top>=l.top-1;}")
        expect(self.page.locator('#studio-helper-log>p').last).to_contain_text('khung cảnh')

    def test_11_quick_creation_can_start_from_home_or_a_natural_language_request(self):
        self.page.goto(bb.BASE_URL);self.open_chat();self.chat('giúp tạo thiệp nhanh cho em gái');expect(self.page.locator('.helper-step-title')).to_have_text('Tạo nhanh · 1 / 3');self.reply('Bỏ qua');self.reply('Bỏ qua');self.reply('Dùng lời bé B đã chọn')
        body=self.page.locator('.helper-preview-body').inner_text();self.assertIn('em',body);self.reply('Dùng thiệp này');expect(self.page.locator('#variant-field')).to_have_value('younger')
        self.page.goto(bb.BASE_URL);self.open_chat();self.reply('Tạo nhanh');expect(self.page.locator('.helper-step-title')).to_have_text('Tạo nhanh · 1 / 4');self.reply('Bà');expect(self.page.locator('.helper-step-title')).to_have_text('Tạo nhanh · 2 / 4')

if __name__=='__main__':unittest.main(verbosity=2)
