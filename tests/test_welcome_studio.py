"""Creator dialogue, compact links and new worlds through production controls."""
import unittest
from playwright.sync_api import expect
import test_bebe as bbtests

NEW=('dandelion','teacup','seabottle','starcrane')
class WelcomeStudioTests(unittest.TestCase):
    setUpClass=classmethod(bbtests.BebeBrowserTests.setUpClass.__func__)
    tearDownClass=classmethod(bbtests.BebeBrowserTests.tearDownClass.__func__)
    setUp=bbtests.BebeBrowserTests.setUp
    tearDown=bbtests.BebeBrowserTests.tearDown
    new_page=bbtests.BebeBrowserTests.new_page
    route_audio=bbtests.BebeBrowserTests.route_audio
    add_group_audio=bbtests.BebeBrowserTests.add_group_audio
    editor=bbtests.BebeBrowserTests.editor
    welcome=bbtests.BebeBrowserTests.welcome
    receive=bbtests.BebeBrowserTests.receive
    open_design=bbtests.BebeBrowserTests.open_design
    wait_playing=bbtests.BebeBrowserTests.wait_playing
    clipboard=bbtests.BebeBrowserTests.clipboard
    copy_link=bbtests.BebeBrowserTests.copy_link
    assert_layout=bbtests.BebeBrowserTests.assert_layout

    def script(self,lines):
        self.page.locator('#welcome-script-mode').select_option('custom')
        while self.page.locator('#welcome-script-list textarea').count()>len(lines):
            self.page.locator('#welcome-script-list [data-action=remove]').last.click()
        while self.page.locator('#welcome-script-list textarea').count()<len(lines):self.page.locator('#welcome-line-add').click()
        for i,line in enumerate(lines):self.page.locator(f'#welcome-line-{i}').fill(line)

    def test_01_edit_order_remove_and_eight_line_limit(self):
        self.editor('grandma');self.page.locator('#welcome-name').fill('Mây')
        self.page.locator('#welcome-script-mode').select_option('custom')
        expect(self.page.locator('#welcome-line-0')).to_have_value('Mây chào bà ạ. Có một món quà dành riêng cho bà.')
        self.script(['Bà ơi, con chào bà!','Hôm nay bà nghỉ ngơi nhé.','Bó hoa này dành tặng bà.'])
        self.page.locator('[data-action=up][data-index="1"]').click()
        expect(self.page.locator('#welcome-line-0')).to_have_value('Hôm nay bà nghỉ ngơi nhé.')
        self.page.locator('[data-action=remove][data-index="0"]').click()
        expect(self.page.locator('#welcome-script-list textarea')).to_have_count(2)
        expect(self.page.locator('[data-action=remove]').first).to_be_disabled()
        for i in range(6):self.page.locator('#welcome-line-add').click()
        expect(self.page.locator('#welcome-script-list textarea')).to_have_count(8)
        expect(self.page.locator('#welcome-line-add')).to_be_disabled()

    def test_02_custom_sequence_can_be_paused_backtracked_and_hands_over_last_line(self):
        self.page.emulate_media(reduced_motion='no-preference');self.editor()
        lines=['Mẹ ơi, Mây mang quà đến rồi!','Hôm nay con muốn mẹ cười nhiều hơn một chút.','Bó hoa này dành cho mẹ, thật nhiều thương!']
        self.script(lines);self.welcome()
        expect(self.page.locator('#bebe-dialogue')).to_have_text(lines[0],timeout=3000)
        expect(self.page.locator('#bebe-step-count')).to_have_text('1 / 2')
        self.page.locator('#bebe-hold').click();self.page.locator('#bebe-next').click()
        expect(self.page.locator('#bebe-dialogue')).to_have_text(lines[1]);self.page.wait_for_timeout(500)
        self.assertTrue(self.page.evaluate('BebeWelcome.metrics().manualPaused'))
        self.page.locator('#bebe-prev').click();expect(self.page.locator('#bebe-dialogue')).to_have_text(lines[0])
        self.page.locator('#bebe-next').click();self.page.locator('#bebe-next').click()
        expect(self.page.locator('#bebe-dialogue')).to_have_text(lines[2]);expect(self.page.locator('#bouquet-arrival')).to_be_visible()
        self.receive();self.assertFalse(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))

    def test_03_share_into_separate_storage_keeps_exact_script_card_and_song(self):
        self.add_group_audio('mom');self.clipboard();self.editor()
        lines=['Chào mẹ 🌷 <img src=x onerror=alert(1)>','Điều ước nhỏ: mẹ vui và an yên.','Hoa này là một cái ôm từ con.']
        self.script(lines);self.page.locator('#welcome-name').fill('Mây')
        self.page.locator('#signature-text').fill('Thương mẹ · An')
        self.page.locator('[data-theme-preset="starcrane"]').click();self.welcome();self.receive()
        greeting=self.page.locator('#letter-greeting').inner_text();link=self.copy_link()
        other=self.browser.new_context(viewport={'width':390,'height':844},reduced_motion='reduce')
        try:
            page=other.new_page();page.on('pageerror',lambda e:self.errors.append(str(e)));page.route('**/*.mp3',self.route_audio);page.goto(link)
            for line in lines:expect(page.locator('#bebe-dialogue')).to_contain_text(line)
            self.assertEqual(0,page.locator('#bebe-welcome img').count())
            self.receive(page);expect(page.locator('#letter-greeting')).to_have_text(greeting)
            expect(page.locator('#letter-sender')).to_have_text('Thương mẹ · An')
            expect(page.locator('#letter-screen')).to_have_attribute('data-experience','starcrane')
            self.assertEqual(1,page.locator('audio').count());self.assertEqual([],page.evaluate('Object.keys(localStorage)'))
        finally:other.close()

    def test_04_reduced_and_off_show_every_custom_line_without_animation(self):
        for off in (False,True):
            self.editor();lines=['Lời một riêng của bạn.','Lời hai đầy yêu thương.','Nhận hoa nhé, mẹ yêu.'];self.script(lines)
            if off:
                self.page.emulate_media(reduced_motion='no-preference');self.open_design();self.page.locator('#intensity-field').select_option('off')
            self.welcome()
            for line in lines:expect(self.page.locator('#bebe-dialogue')).to_contain_text(line)
            self.assertFalse(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))
            self.assertEqual(0,self.page.locator('#bebe-welcome').evaluate("e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"))
            self.receive()

    def test_05_helper_is_scoped_dismissible_and_silent_on_phone(self):
        self.page.set_viewport_size({'width':360,'height':800});self.editor()
        expect(self.page.locator('#studio-helper')).to_be_visible();expect(self.page.locator('#studio-helper-copy')).not_to_be_visible()
        self.page.locator('#studio-helper-toggle').click();expect(self.page.locator('#studio-helper-message')).to_contain_text('Chào bạn')
        self.page.locator('#studio-helper-close').click();expect(self.page.locator('#studio-helper-copy')).not_to_be_visible()
        self.page.locator('#studio-helper-toggle').click();expect(self.page.locator('#studio-helper-copy')).to_be_visible()
        self.assert_layout(self.page);self.assertEqual(1,self.page.locator('audio').count())
        self.welcome();expect(self.page.locator('#studio-helper')).not_to_be_visible();self.receive()
        expect(self.page.locator('#studio-helper')).not_to_be_visible()

    def test_06_four_worlds_really_open_and_keep_motion_with_selected_music(self):
        self.add_group_audio('mom')
        for world in NEW:
            with self.subTest(world=world):
                self.page.emulate_media(reduced_motion='reduce');self.editor();self.page.locator(f'[data-theme-preset="{world}"]').click();self.welcome()
                self.page.emulate_media(reduced_motion='no-preference');self.page.locator('.ba-flower-touch').click()
                stage=self.page.locator('#theme-stage .gift-scene')
                expect(stage).to_have_attribute('data-gift',world);expect(stage).to_have_attribute('data-phase','opening',timeout=4000)
                self.assertGreater(stage.evaluate("e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"),0)
                expect(self.page.locator('#letter-screen')).to_be_visible(timeout=6000)
                expect(self.page.locator('#theme-backdrop .gift-scene')).to_have_attribute('data-gift',world)
                self.assertGreater(self.page.locator('#theme-backdrop').evaluate("e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"),0)
                self.wait_playing('0me.mp3');self.assertEqual(1,self.page.locator('audio').count())
                if world in ('seabottle','starcrane'):
                    expect(self.page.locator('#letter-screen')).to_have_attribute('data-gift-dark','true')
                    for selector in ('#letter-title','#reading-world-title','#copy-link','#edit-card','#share-note'):
                        rgb=self.page.locator(selector).evaluate('e=>getComputedStyle(e).color')
                        self.assertGreater(sum(map(int,__import__('re').findall(r'\d+',rgb)[:3])),570,selector)


    def test_07_three_effects_preview_and_persist_after_share(self):
        for effect in ('fireflies','hearts','bubbles'):
            self.page.emulate_media(reduced_motion='reduce');self.clipboard();self.editor();self.open_design()
            self.page.locator('#effect-field').select_option(effect);self.page.locator('#preview-effect').click()
            expect(self.page.locator('#effect-preview-particles svg')).to_have_count(6)
            self.welcome();self.receive();link=self.copy_link();self.page.goto(link);self.receive()
            self.page.emulate_media(reduced_motion='no-preference')
            expect(self.page.locator('#letter-screen')).to_have_attribute('data-ambient',effect)
            self.assertGreater(self.page.locator('.reading-ambience svg').count(),0)
            self.assertGreater(self.page.locator('.reading-ambience').evaluate("e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"),0)
            self.assert_layout(self.page)

    def test_08_long_lines_fit_phone_and_desktop_and_theme_count_is_real(self):
        for width in (360,390,1440):
            self.page.set_viewport_size({'width':width,'height':844});self.editor('lover')
            self.script(['Thương em rất nhiều. '*8,'Mỗi ngày có em là một ngày thật đẹp.','Món quà nhỏ dành cho em, người thương của anh.'])
            self.assert_layout(self.page)
            count=self.page.evaluate('Object.keys(CardThemes.catalog).length')
            self.assertEqual(41,count);expect(self.page.locator('#theme-filter option[value=all]')).to_have_text(f'Tất cả {count} không gian')
            self.welcome();self.assert_layout(self.page);self.receive();self.assert_layout(self.page)

    def test_09_empty_sentence_is_not_silently_dropped(self):
        self.editor();self.script(['Một lời chào.','','Nhận hoa nhé!'])
        self.page.locator('#preview-welcome').click();expect(self.page.locator('#editor-screen')).to_be_visible()
        expect(self.page.locator('#toast')).to_contain_text('điền đủ')
        expect(self.page.locator('#welcome-line-1')).to_be_focused()

    def test_10_theme_reset_and_auto_mode_do_not_destroy_other_content(self):
        self.editor();lines=['Chào mẹ!','Chúc mẹ bình an.','Nhận hoa từ con nhé.'];self.script(lines)
        self.page.locator('#signature-text').fill('An');self.page.locator('[data-theme-preset="teacup"]').click()
        self.open_design();self.page.locator('#reset-design').click()
        for i,line in enumerate(lines):expect(self.page.locator(f'#welcome-line-{i}')).to_have_value(line)
        expect(self.page.locator('#signature-text')).to_have_value('An')
        self.page.locator('#welcome-script-mode').select_option('auto');expect(self.page.locator('#welcome-script-panel')).not_to_be_visible()
        self.welcome();self.receive();expect(self.page.locator('#letter-sender')).to_have_text('An')

    def test_11_eight_sentences_have_seven_reading_steps_and_the_exact_offer(self):
        self.page.set_viewport_size({'width':390,'height':844});self.page.emulate_media(reduced_motion='no-preference');self.editor()
        lines=[f'Câu {i+1}: '+('Mong mẹ có thật nhiều ngày vui. '*5)[:140] for i in range(8)]
        self.script(lines);self.welcome();expect(self.page.locator('#bebe-hold')).to_be_visible(timeout=3000)
        self.page.locator('#bebe-hold').click()
        for i in range(7):
            expect(self.page.locator('#bebe-dialogue')).to_have_text(lines[i]);expect(self.page.locator('#bebe-step-count')).to_have_text(f'{i+1} / 7')
            self.page.locator('#bebe-next').click()
        expect(self.page.locator('#bebe-dialogue')).to_have_text(lines[-1]);self.assert_layout(self.page)
        self.page.locator('#bebe-skip').click();self.assertFalse(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))

    def test_12_shared_custom_script_still_opens_if_character_module_is_missing(self):
        self.clipboard();self.editor();self.script(['Chào mẹ!','Con tặng mẹ bó hoa này.']);self.welcome();self.receive();link=self.copy_link()
        self.page.route('**/assets/js/bebe-welcome.js',lambda route:route.fulfill(status=404,body='missing'))
        self.page.goto('about:blank');self.page.goto(link);expect(self.page.locator('#bouquet-arrival')).to_be_visible();expect(self.page.locator('#bebe-welcome')).not_to_be_visible()
        self.receive();expect(self.page.locator('#letter-greeting')).to_contain_text('mẹ')

if __name__=='__main__':unittest.main(verbosity=2)
