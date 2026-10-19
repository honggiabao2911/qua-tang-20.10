"""A welcome must preserve the chosen opening, reading effects and audio."""
import unittest
from playwright.sync_api import expect
import test_bebe as bbtests

class WelcomeEffectsTests(unittest.TestCase):
    setUpClass=classmethod(bbtests.BebeBrowserTests.setUpClass.__func__)
    tearDownClass=classmethod(bbtests.BebeBrowserTests.tearDownClass.__func__)
    setUp=bbtests.BebeBrowserTests.setUp
    tearDown=bbtests.BebeBrowserTests.tearDown
    new_page=bbtests.BebeBrowserTests.new_page
    route_audio=bbtests.BebeBrowserTests.route_audio
    add_group_audio=bbtests.BebeBrowserTests.add_group_audio
    def editor(self,target='mom',variant=None):
        bbtests.BebeBrowserTests.editor(self,target,variant)
        # Scene regression coverage deliberately browses the full library.
        self.page.locator('#theme-filter').select_option('all')
    welcome=bbtests.BebeBrowserTests.welcome
    receive=bbtests.BebeBrowserTests.receive
    open_design=bbtests.BebeBrowserTests.open_design
    settle_library=bbtests.BebeBrowserTests.settle_library
    wait_playing=bbtests.BebeBrowserTests.wait_playing
    assert_layout=bbtests.BebeBrowserTests.assert_layout

    def theme_phase(self):
        self.page.wait_for_function("document.querySelector('#envelope-screen').dataset.journeyPhase==='theme'",timeout=4000)
        expect(self.page.locator('#theme-stage')).to_be_visible()
        expect(self.page.locator('#bebe-welcome')).not_to_be_visible()
        self.assertFalse(self.page.evaluate('BouquetArrival.metrics().running'))

    def test_01_all_41_themes_play_their_actual_opening_after_the_named_messenger(self):
        self.editor();scenes=self.page.evaluate('Object.keys(CardThemes.catalog)');self.assertEqual(41,len(scenes))
        for i,scene in enumerate(scenes):
            with self.subTest(scene=scene):
                self.page.emulate_media(reduced_motion='reduce');self.editor()
                self.page.locator('#welcome-name').fill('Mây');self.page.locator('#recipient-name').fill('Mẹ An')
                self.page.locator(f'[data-theme-preset="{scene}"]').click()
                self.page.locator('#arrival-style').select_option('stardust' if i%2 else 'growing')
                self.welcome();expect(self.page.locator('#bebe-name')).to_have_text('Mây')
                self.page.emulate_media(reduced_motion='no-preference');self.page.locator('.ba-flower-touch').click();self.theme_phase()
                is_gift=self.page.evaluate('id=>GiftScenes.has(id)',scene)
                if is_gift:
                    expect(self.page.locator('#theme-stage .gift-scene')).to_have_attribute('data-phase','opening')
                    expect(self.page.locator('#theme-stage .gift-scene')).to_have_attribute('data-gift',scene)
                else:expect(self.page.locator('#theme-stage')).to_have_class('theme-stage is-opening')
                self.assertGreater(self.page.locator('#theme-stage').evaluate("n=>n.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"),0)
                self.page.locator('#skip-animation').click()
                expect(self.page.locator('#letter-screen')).to_be_visible()
                expect(self.page.locator('#letter-screen')).to_have_attribute('data-experience',scene)
                expect(self.page.locator('#letter-recipient')).to_contain_text('Mẹ An')
                expect(self.page.locator('#theme-backdrop')).to_be_visible()
                self.assertGreater(self.page.locator('#theme-backdrop svg').count(),0)

    def test_02_full_openings_auto_read_without_an_extra_click_and_music_keeps_playing(self):
        self.add_group_audio('mom')
        for scene in ('wishtree','galaxy','garden'):
            with self.subTest(scene=scene):
                self.page.emulate_media(reduced_motion='reduce');self.editor();self.settle_library()
                self.page.locator(f'[data-theme-preset="{scene}"]').click();self.welcome()
                self.page.emulate_media(reduced_motion='no-preference');self.page.locator('.ba-flower-touch').press('Enter');self.theme_phase()
                self.wait_playing('0me.mp3');before=self.page.locator('#background-music').evaluate('a=>a.currentTime')
                expect(self.page.locator('#letter-screen')).not_to_be_visible()
                expect(self.page.locator('#letter-screen')).to_be_visible(timeout=6000)
                self.assertGreater(self.page.locator('#background-music').evaluate('a=>a.currentTime'),before+1)
                self.assertEqual(1,self.page.locator('audio').evaluate_all('a=>a.filter(x=>!x.paused).length'))
                self.assertGreater(self.page.locator('#theme-backdrop').evaluate("n=>n.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"),0)
                self.assertFalse(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))

    def test_03_shared_sky_keeps_character_bouquet_and_controls_together(self):
        for width in (360,390,768,1440):
            with self.subTest(width=width):
                self.page.set_viewport_size({'width':width,'height':844 if width<1100 else 900});self.editor()
                self.page.locator('#welcome-name').fill('Người đưa quà của gia đình 🌷')
                self.welcome();self.assert_layout('unified gift scene')
                box=self.page.locator('#welcome-reception').bounding_box();actor=self.page.locator('.bb-character').bounding_box();flowers=self.page.locator('.ba-flower-touch').bounding_box();caption=self.page.locator('.bb-dialogue').bounding_box()
                self.assertGreaterEqual(actor['x'],box['x']);self.assertLessEqual(flowers['x']+flowers['width'],box['x']+box['width']+1)
                self.assertTrue(actor['x']+actor['width']<=caption['x']+1 or actor['y']+actor['height']<=caption['y']+1)
                if width>620:self.assertLess(actor['x']+actor['width'],flowers['x']+10)
                else:self.assertLess(actor['y']+actor['height'],flowers['y'])
                self.assertEqual('rgba(0, 0, 0, 0)',self.page.locator('.bouquet-arrival').evaluate('e=>getComputedStyle(e).backgroundColor'))
                for selector in ('#bebe-skip','#welcome-music-toggle','#bouquet-letter-open'):
                    button=self.page.locator(selector).bounding_box();self.assertGreaterEqual(button['height'],44);self.assertGreaterEqual(button['x'],0);self.assertLessEqual(button['x']+button['width'],width+1)
                self.page.locator('#bebe-skip').click()

    def test_04_reading_effects_stay_visible_after_the_short_burst_ends(self):
        for effect in ('petals','constellation','butterflies'):
            with self.subTest(effect=effect):
                self.page.emulate_media(reduced_motion='reduce');self.editor()
                theme={'petals':'sunflower','constellation':'galaxy','butterflies':'butterfly'}[effect]
                self.page.locator(f'[data-theme-preset="{theme}"]').click();self.open_design();self.page.locator('#effect-field').select_option(effect)
                self.welcome();self.receive();self.page.emulate_media(reduced_motion='no-preference')
                self.page.wait_for_timeout(4100)
                ambient=self.page.locator('.reading-ambience');expect(ambient).to_be_visible()
                self.assertEqual(24,ambient.locator('i').count())
                animations=ambient.evaluate("e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').map(a=>a.animationName)")
                name={'petals':'reading-petal-sway','constellation':'reading-star-shimmer','butterflies':'reading-butterfly-flight'}[effect]
                self.assertIn(name,animations)
                if effect!='petals':self.assertEqual(24,ambient.locator('svg').count())
                self.assertTrue(ambient.locator('i').evaluate_all("a=>a.every(e=>{const x=parseFloat(e.style.getPropertyValue('--x'));return x<=5||x>=94})"))
                self.page.evaluate("Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))")
                self.assertEqual(0,ambient.evaluate("e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"))
                self.page.evaluate("Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'))")

    def test_05_motion_preferences_and_none_effect_never_leave_an_empty_or_stuck_scene(self):
        self.editor();self.open_design();self.page.locator('#effect-field').select_option('none');self.welcome();self.receive()
        expect(self.page.locator('.reading-ambience')).not_to_be_visible()
        self.page.locator('#edit-card').click();self.page.locator('#intensity-field').select_option('off');self.welcome()
        self.assertEqual(0,self.page.locator('#welcome-reception').evaluate("e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"))
        self.receive();expect(self.page.locator('#theme-backdrop')).to_be_visible()
        self.assertFalse(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))

    def test_06_opening_returns_into_view_after_a_scrolled_phone_bouquet(self):
        self.page.set_viewport_size({'width':360,'height':800});self.editor()
        self.page.locator('[data-theme-preset="wishtree"]').click();self.welcome()
        self.page.emulate_media(reduced_motion='no-preference')
        self.page.locator('#bouquet-letter-open').scroll_into_view_if_needed()
        self.page.locator('#bouquet-letter-open').click();self.theme_phase()
        box=self.page.locator('#theme-stage').bounding_box()
        self.assertGreater(box['y']+box['height'],0);self.assertLess(box['y']+box['height']/2,800)
        self.assertEqual(0,self.page.evaluate('scrollY'))
        self.page.locator('#skip-animation').click();expect(self.page.locator('#letter-screen')).to_be_visible()

if __name__=='__main__':unittest.main(verbosity=2)
