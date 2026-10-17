"""Readable automatic pacing and recipient-controlled conversation."""
import unittest
from playwright.sync_api import expect
import test_bebe as bbtests

class WelcomeReadingTests(unittest.TestCase):
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
    assert_layout=bbtests.BebeBrowserTests.assert_layout

    def start_reading(self):
        self.page.emulate_media(reduced_motion='no-preference');self.editor();self.welcome()
        expect(self.page.locator('#bebe-hold')).to_be_visible(timeout=3000)

    def test_01_short_greeting_really_stays_for_a_readable_duration(self):
        self.start_reading();before=self.page.locator('#bebe-dialogue').inner_text()
        self.page.wait_for_timeout(3000)
        expect(self.page.locator('#bebe-dialogue')).to_have_text(before)
        self.assertEqual(1,self.page.evaluate('BebeWelcome.metrics().step'))
        self.page.wait_for_function('BebeWelcome.metrics().step===2',timeout=3500)
        self.assertGreaterEqual(self.page.evaluate('BebeWelcome.metrics().elapsed'),5900)
        self.assertTrue(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))
        self.assertLess(self.page.evaluate('BebeWelcome.metrics().flowersAt'),40000)

    def test_02_pause_keeps_the_whole_sentence_and_back_next_leave_reader_in_control(self):
        self.start_reading();self.page.locator('#bebe-hold').click()
        before=self.page.evaluate('BebeWelcome.metrics()');text=self.page.locator('#bebe-dialogue').inner_text()
        self.page.wait_for_timeout(5300)
        self.assertEqual(before['elapsed'],self.page.evaluate('BebeWelcome.metrics().elapsed'))
        self.assertFalse(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))
        expect(self.page.locator('#bebe-dialogue')).to_have_text(text)
        self.assertTrue(self.page.locator('#bebe-dialogue .bb-word').evaluate_all('a=>a.every(e=>getComputedStyle(e).opacity==="1")'))
        self.page.locator('#bebe-next').press('Enter');self.assertEqual(2,self.page.evaluate('BebeWelcome.metrics().step'))
        self.assertTrue(self.page.evaluate('BebeWelcome.metrics().manualPaused'))
        self.page.locator('#bebe-prev').press('Enter');expect(self.page.locator('#bebe-dialogue')).to_have_text(text)
        expect(self.page.locator('#bebe-prev')).to_be_disabled()
        self.page.locator('#bebe-hold').click()
        self.assertTrue(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))
        self.assertFalse(self.page.evaluate('BebeWelcome.metrics().manualPaused'))
        self.assertTrue(self.page.locator('#bebe-dialogue .bb-word').evaluate_all('a=>a.every(e=>getComputedStyle(e).opacity==="1")'),'Resuming must not hide words again')

    def test_03_long_custom_lines_receive_more_time_without_lengthening_every_sentence(self):
        durations=[]
        for text in ('Thương mẹ.',('Chúc mẹ bình yên và thật nhiều niềm vui. '*4)[:160]):
            self.start_reading();self.page.locator('#bebe-skip').click();self.page.locator('#edit-card').click()
            self.page.locator('#welcome-text').fill(text);self.welcome();expect(self.page.locator('#bebe-hold')).to_be_visible(timeout=3000)
            for _ in range(3):self.page.locator('#bebe-next').click()
            expect(self.page.locator('#bebe-dialogue')).to_have_text(text)
            durations.append(self.page.evaluate('BebeWelcome.metrics().duration'))
            self.assertEqual(4,self.page.evaluate('BebeWelcome.metrics().step'))
        self.assertGreater(durations[1],durations[0]+3000);self.assertLessEqual(durations[1],16000)

    def test_04_hidden_tab_never_undoes_the_readers_manual_pause(self):
        self.start_reading();self.page.locator('#bebe-hold').click();before=self.page.evaluate('BebeWelcome.metrics().elapsed')
        for hidden in (True,False):
            self.page.evaluate("hidden=>{Object.defineProperty(document,'hidden',{configurable:true,value:hidden});document.dispatchEvent(new Event('visibilitychange'))}",hidden)
        self.page.wait_for_timeout(350)
        self.assertEqual(before,self.page.evaluate('BebeWelcome.metrics().elapsed'))
        self.assertTrue(self.page.evaluate('BebeWelcome.metrics().manualPaused'));self.assertFalse(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))
        self.page.locator('#bebe-hold').click();self.assertTrue(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))
        self.page.locator('#bebe-next').click();self.page.locator('#bebe-prev').click()
        self.assertTrue(self.page.evaluate('BebeWelcome.metrics().manualPaused'));self.assertFalse(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))

    def test_05_manual_finish_offers_one_bouquet_and_preserves_the_selected_effects(self):
        self.start_reading();self.page.locator('#bebe-hold').click()
        for i in range(3):
            self.page.locator('#bebe-next').click();self.assertEqual(i+2,self.page.evaluate('BebeWelcome.metrics().step'))
        expect(self.page.locator('#bebe-next')).to_contain_text('Đón bó hoa')
        self.page.locator('#bebe-next').press('Enter');expect(self.page.locator('#bouquet-arrival')).to_be_visible()
        self.assertEqual('bouquet-letter-open',self.page.evaluate('document.activeElement.id'))
        expect(self.page.locator('.bb-reading-panel')).not_to_be_visible()
        self.page.locator('#bouquet-letter-open').press('Enter')
        self.page.wait_for_function("document.querySelector('#envelope-screen').dataset.journeyPhase==='theme'",timeout=4000)
        expect(self.page.locator('#theme-stage')).to_be_visible()
        expect(self.page.locator('#letter-screen')).to_be_visible(timeout=5000)
        self.assertFalse(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))
        self.assertGreater(self.page.locator('#theme-backdrop').evaluate("e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"),0)

    def test_06_phone_and_desktop_controls_are_readable_and_keyboard_accessible(self):
        for width in (360,390,1440):
            with self.subTest(width=width):
                self.page.set_viewport_size({'width':width,'height':844 if width<600 else 900});self.start_reading()
                self.page.locator('#bebe-hold').press('Enter');self.assert_layout('reading controls')
                for selector in ('#bebe-prev','#bebe-hold','#bebe-next','#bebe-skip'):
                    box=self.page.locator(selector).bounding_box();self.assertGreaterEqual(box['height'],44);self.assertGreaterEqual(box['x'],0);self.assertLessEqual(box['x']+box['width'],width)
                caption=self.page.locator('#bebe-dialogue').bounding_box();controls=self.page.locator('.bb-reading-controls').bounding_box()
                self.assertLessEqual(caption['y']+caption['height'],controls['y'])
                self.page.locator('#bebe-next').press('Enter');self.assertEqual(2,self.page.evaluate('BebeWelcome.metrics().step'))
                self.page.emulate_media(reduced_motion='reduce');expect(self.page.locator('#bouquet-arrival')).to_be_visible()
                self.assertFalse(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))
                self.assertEqual(0,self.page.locator('#bebe-welcome').evaluate("e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"))

    def test_07_skip_replay_and_page_exit_clean_timers_and_reset_reading_state(self):
        self.start_reading();self.page.locator('#bebe-hold').click();self.page.locator('#bebe-skip').click()
        expect(self.page.locator('#letter-screen')).to_be_visible();self.assertFalse(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))
        self.page.locator('#replay-card').click();expect(self.page.locator('#bebe-hold')).to_be_visible(timeout=3000)
        self.assertFalse(self.page.evaluate('BebeWelcome.metrics().manualPaused'));self.assertEqual(1,self.page.evaluate('BebeWelcome.metrics().step'))
        self.page.evaluate("window.dispatchEvent(new PageTransitionEvent('pagehide'))")
        self.assertFalse(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))
        self.assertTrue(self.page.locator('#background-music').evaluate('a=>a.paused'))

if __name__=='__main__':unittest.main(verbosity=2)
