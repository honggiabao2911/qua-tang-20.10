"""Named character and actual intro-audio handoff; no mocked successful playback."""
import unittest
from playwright.sync_api import expect
import test_bebe as bbtests

class WelcomeMusicTests(unittest.TestCase):
    setUpClass=classmethod(bbtests.BebeBrowserTests.setUpClass.__func__)
    tearDownClass=classmethod(bbtests.BebeBrowserTests.tearDownClass.__func__)
    setUp=bbtests.BebeBrowserTests.setUp
    tearDown=bbtests.BebeBrowserTests.tearDown
    new_page=bbtests.BebeBrowserTests.new_page
    route_audio=bbtests.BebeBrowserTests.route_audio
    add_group_audio=bbtests.BebeBrowserTests.add_group_audio
    editor=bbtests.BebeBrowserTests.editor
    open_design=bbtests.BebeBrowserTests.open_design
    welcome=bbtests.BebeBrowserTests.welcome
    receive=bbtests.BebeBrowserTests.receive
    settle_library=bbtests.BebeBrowserTests.settle_library
    wait_playing=bbtests.BebeBrowserTests.wait_playing
    clipboard=bbtests.BebeBrowserTests.clipboard
    copy_link=bbtests.BebeBrowserTests.copy_link
    assert_layout=bbtests.BebeBrowserTests.assert_layout

    def test_01_name_roundtrip_literal_text_and_exact_card(self):
        self.clipboard();self.editor('lover');self.page.locator('#welcome-name').fill('Mây <b>nhỏ</b> 🌷')
        self.page.locator('#sender-name').fill('Linh');self.page.locator('#recipient-name').fill('An')
        self.page.locator('#welcome-text').fill('Món quà dành riêng cho em.')
        self.welcome();expect(self.page.locator('#bebe-name')).to_have_text('Mây <b>nhỏ</b> 🌷')
        expect(self.page.locator('#bebe-dialogue')).to_contain_text('Mây <b>nhỏ</b> 🌷')
        self.assertEqual(0,self.page.locator('#bebe-name b, #bebe-dialogue b').count())
        self.assertNotIn('bé B',self.page.locator('#bebe-welcome').inner_text())
        self.receive();greeting=self.page.locator('#letter-greeting').inner_text();link=self.copy_link()
        payload=self.page.evaluate('link=>CardLinks.decode(new URL(link).hash)',link)
        self.assertEqual('Mây <b>nhỏ</b> 🌷',payload['design']['welcomeName']);self.assertEqual('on',payload['design']['welcomeMusic'])
        second=self.new_page();second.goto(link)
        expect(second.locator('#bebe-name')).to_have_text('Mây <b>nhỏ</b> 🌷')
        second.locator('#bebe-skip').click();expect(second.locator('#letter-greeting')).to_have_text(greeting)
        self.page.locator('#edit-card').click();expect(self.page.locator('#welcome-name')).to_have_value('Mây <b>nhỏ</b> 🌷')
        self.open_design();self.page.locator('#reset-design').click();expect(self.page.locator('#welcome-name')).to_have_value('Mây <b>nhỏ</b> 🌷')

    def test_02_actual_score_switches_once_to_chosen_card_song_and_replay_works(self):
        self.add_group_audio('mom');self.editor();self.settle_library()
        self.page.locator('#track-list .track-select').nth(2).click();self.welcome();self.wait_playing('loichao.mp3')
        self.page.wait_for_timeout(350);before=self.page.locator('#background-music').evaluate('a=>a.currentTime')
        self.page.locator('.bb-character').click();self.assertGreaterEqual(self.page.locator('#background-music').evaluate('a=>a.currentTime'),before)
        self.assertEqual(1,self.page.locator('audio').count());self.receive();self.wait_playing('2me.mp3')
        self.assertFalse(self.page.evaluate('CardMusic.welcomeState().active'))
        self.page.wait_for_timeout(300);t=self.page.locator('#background-music').evaluate('a=>a.currentTime');self.assertGreater(t,.2)
        self.page.locator('#replay-card').click();self.wait_playing('loichao.mp3')
        self.page.locator('#bebe-skip').click();self.wait_playing('2me.mp3')
        self.assertEqual(1,self.page.locator('audio').evaluate_all('a=>a.filter(x=>!x.paused).length'))

    def test_03_autoplay_denial_has_retry_and_never_stalls_the_character(self):
        self.context.add_init_script("""(()=>{const real=HTMLMediaElement.prototype.play;window.__blockWelcome=true;
          HTMLMediaElement.prototype.play=function(){if(window.__blockWelcome&&this.src.includes('loichao.mp3')){
            window.__blockWelcome=false;return Promise.reject(new DOMException('gesture required','NotAllowedError'));}return real.call(this);};})();""")
        self.page.emulate_media(reduced_motion='no-preference');self.editor();self.welcome()
        expect(self.page.locator('#welcome-audio-status')).to_contain_text('Chạm Bật nhạc chào')
        self.assertFalse(self.page.evaluate('CardMusic.welcomeState().pending'))
        self.page.wait_for_function("BebeWelcome.metrics().mood==='awake'",timeout=2500)
        self.page.locator('#welcome-music-toggle').click();self.wait_playing('loichao.mp3')
        self.page.locator('#bebe-skip').click();expect(self.page.locator('#letter-screen')).to_be_visible()

    def test_04_manual_mute_survives_handoff_and_replay(self):
        self.add_group_audio('mom');self.editor();self.settle_library();self.welcome();self.wait_playing('loichao.mp3')
        self.page.locator('#header-music-toggle').click()
        expect(self.page.locator('#welcome-music-toggle')).to_have_attribute('aria-pressed','false')
        self.receive();self.page.wait_for_timeout(300);self.assertTrue(self.page.locator('#background-music').evaluate('a=>a.paused'))
        self.page.locator('#replay-card').click();self.page.wait_for_timeout(250)
        self.assertTrue(self.page.locator('#background-music').evaluate('a=>a.paused'))
        self.page.locator('#welcome-music-toggle').click();self.wait_playing('loichao.mp3')
        self.page.locator('#bebe-skip').click();self.wait_playing('0me.mp3')

    def test_05_hidden_tab_pauses_without_restarting_and_page_exit_cleans_audio(self):
        self.page.emulate_media(reduced_motion='no-preference');self.editor();self.welcome();self.wait_playing('loichao.mp3')
        self.page.wait_for_timeout(400)
        self.page.evaluate("Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))")
        paused=self.page.locator('#background-music').evaluate('a=>a.currentTime');self.assertTrue(self.page.locator('#background-music').evaluate('a=>a.paused'))
        self.page.wait_for_timeout(300);self.assertAlmostEqual(paused,self.page.locator('#background-music').evaluate('a=>a.currentTime'),delta=.06)
        self.page.evaluate("Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'))")
        self.wait_playing('loichao.mp3');self.assertGreaterEqual(self.page.locator('#background-music').evaluate('a=>a.currentTime'),paused)
        self.page.evaluate("window.dispatchEvent(new PageTransitionEvent('pagehide'))")
        self.assertTrue(self.page.locator('#background-music').evaluate('a=>a.paused'))
        self.assertFalse(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))
        self.page.wait_for_timeout(250);self.assertTrue(self.page.locator('#background-music').evaluate('a=>a.paused'))

    def test_06_missing_score_does_not_mark_the_card_song_missing_or_block_reading(self):
        self.add_group_audio('mom')
        self.page.route('**/assets/music/loichao.mp3',lambda route:route.fulfill(status=404,body='missing'))
        self.editor();self.settle_library();self.welcome()
        expect(self.page.locator('#welcome-audio-status')).to_contain_text('Chưa')
        self.assertTrue(self.page.evaluate('CardMusic.catalogue[0].available'))
        self.page.locator('#bebe-skip').click();self.wait_playing('0me.mp3')
        expect(self.page.locator('#letter-screen')).to_be_visible()

    def test_07_phone_names_controls_gaze_and_reduced_motion(self):
        self.page.emulate_media(reduced_motion='no-preference')
        for width in (360,390,1440):
            self.page.set_viewport_size({'width':width,'height':844 if width<600 else 900})
            self.editor();self.page.locator('#welcome-name').fill('Mây nhỏ và những điều kỳ diệu 🌷')
            self.assertLessEqual(len(self.page.locator('#welcome-name').input_value().encode('utf-16-le'))//2,30)
            self.welcome();self.assert_layout('named character')
            for selector in ('#bebe-skip','#welcome-music-toggle','.bb-character'):
                box=self.page.locator(selector).bounding_box();self.assertGreaterEqual(box['height'],44);self.assertGreaterEqual(box['x'],0);self.assertLessEqual(box['x']+box['width'],width)
            self.page.locator('.bb-character').press('Enter');expect(self.page.locator('.bb-character')).to_have_class('bb-character bb-coucou')
            box=self.page.locator('.bb-root').bounding_box()
            self.page.mouse.move(box['x']+box['width']*.8,box['y']+box['height']*.4)
            self.page.wait_for_function("document.querySelector('.bb-character').style.getPropertyValue('--look-x')!==''")
            self.page.emulate_media(reduced_motion='reduce');expect(self.page.locator('#bouquet-arrival')).to_be_visible()
            self.assertEqual(0,self.page.locator('#bebe-welcome').evaluate("e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"))
            self.assert_layout('named handover');self.receive();self.page.emulate_media(reduced_motion='no-preference')

    def test_08_off_and_legacy_links_keep_their_audio_behavior_and_empty_name_falls_back(self):
        self.clipboard();self.editor();self.page.locator('#welcome-name').fill(' ');self.page.locator('#welcome-music').uncheck()
        self.welcome();expect(self.page.locator('#bebe-name')).to_have_text('bé B');expect(self.page.locator('#welcome-music-toggle')).not_to_be_visible()
        self.assertTrue(self.page.locator('#background-music').evaluate('a=>a.paused'));self.receive();link=self.copy_link()
        second=self.new_page();second.goto(link);self.assertFalse(second.evaluate('CardMusic.welcomeState().active'))
        old=self.page.evaluate("link=>{const p=CardLinks.decode(new URL(link).hash);delete p.design.welcomeName;delete p.design.welcomeMusic;return location.href.split('#')[0]+CardLinks.encodeCompact(p)}",link)
        second.goto(old);expect(second.locator('#bebe-name')).to_have_text('bé B');expect(second.locator('#welcome-music-toggle')).not_to_be_visible()

if __name__=='__main__':unittest.main(verbosity=2)
