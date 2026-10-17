"""Bé B -> bouquet -> the exact prepared card, using production lifecycle/audio."""
import time
import unittest
from playwright.sync_api import expect
import test_collection as collection
import test_upgrade as regression

BASE_URL=regression.BASE_URL

class BebeBrowserTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        regression.UpgradeBrowserTests.setUpClass.__func__(cls)
        cls.audio_bytes['loichao.mp3']=(regression.ROOT/'assets/music/loichao.mp3').read_bytes()
    tearDownClass=classmethod(regression.UpgradeBrowserTests.tearDownClass.__func__)
    def setUp(self):
        regression.UpgradeBrowserTests.setUp(self)
        self.available['loichao.mp3']='loichao.mp3'
    tearDown=regression.UpgradeBrowserTests.tearDown
    new_page=regression.UpgradeBrowserTests.new_page
    route_audio=regression.UpgradeBrowserTests.route_audio
    add_group_audio=collection.CollectionBrowserTests.add_group_audio
    open_design=regression.UpgradeBrowserTests.open_design
    settle_library=regression.UpgradeBrowserTests.settle_library
    wait_playing=regression.UpgradeBrowserTests.wait_playing
    clipboard=regression.UpgradeBrowserTests.clipboard
    copy_link=regression.UpgradeBrowserTests.copy_link
    assert_layout=regression.UpgradeBrowserTests.assert_layout

    def editor(self,target='mom',variant=None):
        self.page.goto(BASE_URL)
        self.page.locator(f'[data-recipient="{target}"]').first.click()
        expect(self.page.locator('#editor-screen')).to_be_visible()
        if variant:self.page.locator('#variant-field').select_option(variant)

    def welcome(self):
        self.page.locator('#preview-welcome').click()
        expect(self.page.locator('#bebe-welcome')).to_be_visible()

    def receive(self,page=None):
        page=page or self.page
        page.locator('.ba-flower-touch').click()
        expect(page.locator('#letter-screen')).to_be_visible(timeout=8000)

    def test_01_six_groups_have_distinct_messenger_wishes_and_no_default_sender(self):
        wishes=[]
        for target,word in [('mom','nghỉ ngơi'),('grandma','chuyện trò'),('teacher','với nghề'),('sister','vững vàng'),('women','tự tin'),('lover','thương nhớ')]:
            with self.subTest(target=target):
                self.editor(target)
                expect(self.page.locator('#welcome-mode')).to_have_value('bebe')
                expect(self.page.locator('#sender-name')).to_have_value('')
                lines=self.page.evaluate('target=>BebeWelcome.linesFor({target,variant:target==="sister"?"older":"friend"})',target)
                self.assertIn(word,lines[2]);wishes.append(lines[2])
                self.welcome()
                expect(self.page.locator('#bebe-dialogue')).to_contain_text(word)
                self.assertNotIn('Hồng Gia Bảo',self.page.locator('#bebe-welcome').inner_text())
                self.assertNotIn('Tiny',self.page.locator('#bebe-welcome').inner_text())
                self.receive()
                self.assertFalse(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))
        self.assertEqual(6,len(set(wishes)))

    def test_02_variants_and_custom_address_preserve_the_right_relationship(self):
        cases=[('sister','younger','em','ước mơ'),('sister','older','chị','vững vàng'),('women','group','mọi người','trân trọng'),('women','one','bạn','tự tin')]
        for target,variant,you,word in cases:
            with self.subTest(target=target,variant=variant):
                self.editor(target,variant)
                self.welcome()
                expect(self.page.locator('#bebe-dialogue')).to_contain_text(you)
                expect(self.page.locator('#bebe-dialogue')).to_contain_text(word)
                if variant=='group':self.assertNotIn('chúc bạn',self.page.locator('#bebe-dialogue').inner_text())
        self.editor('lover')
        self.page.locator('#recipient-pronoun').fill('chị thương')
        self.page.locator('#recipient-name').fill('An')
        self.welcome()
        expect(self.page.locator('#bebe-dialogue')).to_contain_text('chị thương')
        expect(self.page.locator('#bebe-dialogue')).to_contain_text('An')
        self.assertNotIn('anh yêu',self.page.locator('#bebe-dialogue').inner_text())

    def test_03_real_timeline_changes_expressions_then_offers_flowers_and_keeps_the_selected_opening(self):
        self.page.emulate_media(reduced_motion='no-preference')
        self.editor()
        self.page.locator('[data-theme-preset="wishtree"]').click()
        self.page.locator('#sender-name').fill('Minh')
        self.page.locator('#welcome-text').fill('Một chút nắng bé B mang đến mẹ hôm nay.')
        self.welcome();start=time.monotonic()
        expect(self.page.locator('.bb-root')).to_have_attribute('data-mood','sleep')
        expect(self.page.locator('#bouquet-arrival')).not_to_be_visible()
        for mood in ('awake','curious','happy','shy'):
            self.page.wait_for_function('mood=>BebeWelcome.metrics().mood===mood',arg=mood,timeout=4500)
            if mood=='curious':expect(self.page.locator('#bebe-dialogue')).to_contain_text('Minh nhờ bé B')
            if mood=='happy':expect(self.page.locator('#bebe-dialogue')).to_contain_text('nghỉ ngơi')
            if mood=='shy':expect(self.page.locator('#bebe-dialogue')).to_contain_text('Một chút nắng')
        self.page.wait_for_function('BebeWelcome.metrics().offered',timeout=4500)
        self.assertGreater(time.monotonic()-start,11)
        self.assertLess(time.monotonic()-start,18)
        expect(self.page.locator('#bouquet-arrival')).to_be_visible()
        self.wait_playing('loichao.mp3')
        start=time.monotonic();self.receive()
        self.assertLess(time.monotonic()-start,7)
        expect(self.page.locator('#theme-backdrop .gift-wishtree')).to_be_visible()
        self.assertFalse(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))
        self.assertFalse(self.page.evaluate('BouquetArrival.metrics().running'))

    def test_04_shared_card_preserves_welcome_text_names_paper_and_music(self):
        self.clipboard();self.add_group_audio('lover');self.editor('lover');self.settle_library()
        self.page.locator('#recipient-name').fill('An 🌸')
        self.page.locator('#sender-name').fill('Minh')
        custom='Một món quà <b>riêng</b> cho chị, từ bé B!'
        self.page.locator('#welcome-text').fill(custom)
        self.page.locator('#arrival-style').select_option('growing')
        self.open_design()
        self.page.locator('[data-font-choice="handwriting"]').click()
        self.page.locator('#size-field').select_option('large')
        self.page.locator('#custom-greeting').fill('Chúc em luôn được yêu thương và bình yên.')
        self.page.locator('#personal-message').fill('Một lời nhắn được giữ nguyên 🌷')
        self.page.locator('#track-list .track-select').nth(5).click()
        self.welcome();expect(self.page.locator('#bebe-dialogue')).to_contain_text(custom)
        self.assertEqual(0,self.page.locator('#bebe-dialogue b').count())
        self.receive();greeting=self.page.locator('#letter-greeting').inner_text()
        link=self.copy_link()
        payload=self.page.evaluate('link=>CardLinks.decode(new URL(link).hash)',link)
        self.assertEqual('bebe',payload['design']['welcome']);self.assertEqual(custom,payload['design']['welcomeText'])
        second=self.new_page();second.goto(link)
        expect(second.locator('#bebe-welcome')).to_be_visible()
        expect(second.locator('#bebe-dialogue')).to_contain_text('An 🌸')
        expect(second.locator('#bebe-dialogue')).to_contain_text(custom)
        self.assertTrue(second.locator('#background-music').evaluate('a=>a.paused'))
        self.receive(second)
        expect(second.locator('#letter-greeting')).to_have_text(greeting)
        expect(second.locator('#letter-message')).to_have_text('Một lời nhắn được giữ nguyên 🌷')
        expect(second.locator('.letter-paper')).to_have_attribute('data-font','handwriting')
        expect(second.locator('.letter-paper')).to_have_attribute('data-size','large')
        expect(second.locator('#letter-track-select')).to_have_value('lover:5')

    def test_05_skip_is_immediate_plays_the_selected_track_and_cancels_the_story(self):
        self.page.emulate_media(reduced_motion='no-preference')
        self.add_group_audio('mom');self.editor();self.settle_library()
        self.page.locator('#track-list .track-select').nth(2).click()
        self.welcome();self.page.wait_for_timeout(1100)
        expect(self.page.locator('#bebe-skip')).to_be_visible()
        self.page.locator('#bebe-skip').press('Enter')
        expect(self.page.locator('#letter-screen')).to_be_visible(timeout=2000)
        self.wait_playing('2me.mp3')
        self.assertFalse(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))
        self.page.wait_for_timeout(500)
        expect(self.page.locator('#bebe-welcome')).not_to_be_visible()
        self.assertEqual(1,self.page.locator('audio').evaluate_all('els=>els.filter(a=>!a.paused).length'))

    def test_06_keyboard_flower_opens_once_and_music_does_not_restart(self):
        self.add_group_audio('mom');self.editor();self.page.locator('#welcome-music').uncheck();self.settle_library();self.welcome()
        self.page.emulate_media(reduced_motion='no-preference')
        self.page.locator('#header-music-toggle').click();self.wait_playing('0me.mp3')
        self.page.wait_for_timeout(600)
        before=self.page.locator('#background-music').evaluate('a=>a.currentTime')
        self.page.evaluate("""() => {window.__letterOpens=0;new MutationObserver(()=>{
            if(!document.querySelector('#letter-screen').hidden)window.__letterOpens++;
        }).observe(document.querySelector('#letter-screen'),{attributes:true,attributeFilter:['hidden']});}""")
        self.page.locator('.ba-flower-touch').press('Enter')
        self.page.evaluate("""() => {document.querySelector('.ba-flower-touch').click();document.querySelector('#bouquet-letter-open').click();}""")
        expect(self.page.locator('#letter-screen')).to_be_visible(timeout=8000)
        self.assertEqual(1,self.page.evaluate('window.__letterOpens'))
        self.assertGreater(self.page.locator('#background-music').evaluate('a=>a.currentTime'),before+.5)
        self.assertEqual(1,self.page.locator('audio').evaluate_all('els=>els.filter(a=>!a.paused).length'))

    def test_07_hidden_page_pauses_time_then_resumes_and_replay_restarts_cleanly(self):
        self.page.emulate_media(reduced_motion='no-preference');self.editor();self.welcome()
        self.page.wait_for_function("BebeWelcome.metrics().mood==='awake'",timeout=2500)
        self.page.evaluate("""()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));}""")
        before=self.page.evaluate('BebeWelcome.metrics()');self.assertFalse(before['pendingTimer'])
        self.page.wait_for_timeout(650)
        after=self.page.evaluate('BebeWelcome.metrics()')
        self.assertEqual(before['elapsed'],after['elapsed']);self.assertEqual(before['mood'],after['mood'])
        self.page.evaluate("""()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));}""")
        self.assertTrue(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))
        self.page.locator('#bebe-skip').click()
        self.page.locator('#replay-card').click()
        expect(self.page.locator('.bb-root')).to_have_attribute('data-mood','sleep')
        self.page.locator('#back-to-editor').click()
        self.assertFalse(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))
        expect(self.page.locator('#editor-screen')).to_be_visible()

    def test_08_reduced_motion_or_disabled_effects_show_complete_character_and_flowers(self):
        for mode in ('reduce','off'):
            with self.subTest(mode=mode):
                self.page.emulate_media(reduced_motion='no-preference');self.editor()
                if mode=='off':self.open_design();self.page.locator('#intensity-field').select_option('off')
                self.welcome()
                if mode=='reduce':self.page.emulate_media(reduced_motion='reduce')
                expect(self.page.locator('#bouquet-arrival')).to_be_visible()
                expect(self.page.locator('.bb-character')).to_be_visible()
                self.assertFalse(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))
                self.assertFalse(self.page.evaluate('BouquetArrival.metrics().running'))
                self.assertFalse(self.page.locator('.bb-root').evaluate("n=>n.getAnimations({subtree:true}).some(a=>a.playState==='running')"))
                self.receive()

    def test_09_legacy_links_and_explicit_direct_mode_keep_the_previous_opening(self):
        self.editor()
        fragment=self.page.evaluate("""() => CardLinks.encode({target:'mom',greeting:'Chúc mẹ thật bình an.',design:{arrival:'growing',experience:'island',scene:'island'}})""")
        self.page.goto(BASE_URL+fragment)
        expect(self.page.locator('#bebe-welcome')).not_to_be_visible()
        self.page.locator('#bouquet-letter-open').click()
        expect(self.page.locator('#theme-stage .gift-island')).to_have_attribute('data-phase','ready')
        self.page.locator('#envelope-open-button').click()
        expect(self.page.locator('#letter-greeting')).to_have_text('Chúc mẹ thật bình an.')
        self.editor();self.page.locator('#welcome-mode').select_option('none')
        expect(self.page.locator('#arrival-style')).to_have_value('classic')
        self.page.locator('#preview-welcome').click()
        expect(self.page.locator('#bebe-welcome')).not_to_be_visible()
        expect(self.page.locator('#theme-stage')).to_be_visible()

    def test_10_character_script_failure_falls_back_to_a_working_bouquet(self):
        self.page.route('**/assets/js/bebe-welcome.js',lambda route:route.fulfill(status=404,body='missing'))
        self.editor();self.welcome_without_character()
        expect(self.page.locator('#bouquet-arrival')).to_be_visible()
        self.page.locator('#bouquet-letter-open').click()
        expect(self.page.locator('#letter-screen')).to_be_visible()

    def welcome_without_character(self):
        self.page.locator('#preview-welcome').click()
        expect(self.page.locator('#bebe-welcome')).not_to_be_visible()

    def test_11_long_names_and_custom_lines_do_not_overlap_on_phone_or_desktop(self):
        for width in (360,390,1440):
            with self.subTest(width=width):
                self.page.set_viewport_size({'width':width,'height':844})
                self.editor()
                self.page.locator('#recipient-name').fill('Người nhận '+('Ánh '*22))
                self.page.locator('#welcome-text').fill('Một món quà nhỏ. '*9)
                self.welcome()
                self.assert_layout(f'{width}px bé B with long names')
                character=self.page.locator('.bb-character').bounding_box();caption=self.page.locator('.bb-dialogue').bounding_box()
                self.assertTrue(character['x']+character['width']<=caption['x']+1 or character['y']+character['height']<=caption['y']+1)
                self.assertGreaterEqual(self.page.locator('#bebe-skip').bounding_box()['height'],44)
                self.receive();self.assert_layout(f'{width}px letter after bé B')

    def test_12_reset_preserves_intro_and_page_restore_does_not_leave_an_empty_screen(self):
        self.editor('lover');self.open_design()
        self.page.locator('#welcome-text').fill('Một lời riêng của bé B.')
        self.page.locator('#reset-design').click()
        expect(self.page.locator('#welcome-mode')).to_have_value('bebe')
        expect(self.page.locator('#welcome-text')).to_have_value('Một lời riêng của bé B.')
        self.page.emulate_media(reduced_motion='no-preference');self.welcome()
        self.page.evaluate("window.dispatchEvent(new PageTransitionEvent('pagehide'))")
        self.assertFalse(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))
        self.page.evaluate("window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))")
        expect(self.page.locator('#bebe-welcome')).to_be_visible()
        self.assertTrue(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))
        self.page.locator('#bebe-skip').click();expect(self.page.locator('#letter-screen')).to_be_visible()

if __name__=='__main__':unittest.main(verbosity=2)
