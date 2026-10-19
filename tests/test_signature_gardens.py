"""Signed cards and six new worlds, through the real editor and share codec."""
import unittest
from playwright.sync_api import expect
import test_bebe as bbtests

NEW=('glassgarden','wisteria','lotusmoon','sunmail','lavender','heartgarden')
class SignatureGardenTests(unittest.TestCase):
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
    clipboard=bbtests.BebeBrowserTests.clipboard
    copy_link=bbtests.BebeBrowserTests.copy_link
    assert_layout=bbtests.BebeBrowserTests.assert_layout

    def draw(self,touch=False):
        pad=self.page.locator('#signature-pad');pad.scroll_into_view_if_needed();self.page.wait_for_timeout(120);r=pad.bounding_box()
        points=[(.12,.7),(.2,.2),(.24,.7),(.29,.25),(.35,.72),(.43,.5),(.52,.63),(.65,.5),(.78,.58)]
        if touch:
            client=self.context.new_cdp_session(self.page)
            for i,(x,y) in enumerate(points):client.send('Input.dispatchTouchEvent',{'type':'touchStart' if i==0 else 'touchMove','touchPoints':[{'x':r['x']+x*r['width'],'y':r['y']+y*r['height']}]})
            client.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});client.detach()
        else:
            self.page.mouse.move(r['x']+r['width']*points[0][0],r['y']+r['height']*points[0][1]);self.page.mouse.down()
            for x,y in points[1:]:self.page.mouse.move(r['x']+r['width']*x,r['y']+r['height']*y,steps=4)
            self.page.mouse.up()
        self.assertGreater(self.page.locator('#preview-card .signature-ink path').count(),0)

    def test_01_no_timing_bar_or_detached_hand_arcs_and_gentle_lights_respect_motion(self):
        self.page.emulate_media(reduced_motion='no-preference');self.editor()
        self.assertEqual('motherhug',self.page.locator('[data-theme-preset]').first.get_attribute('data-theme-preset'))
        self.assertEqual(9,self.page.locator('.theme-new').count());self.welcome()
        expect(self.page.locator('#bebe-hold')).to_be_visible(timeout=3000)
        self.assertEqual(0,self.page.locator('.bb-reading-meter,.bb-hands').count())
        self.assertEqual(8,self.page.locator('.bb-wish-lights i').count())
        self.assertTrue(self.page.locator('.bb-wish-lights').evaluate("e=>e.getAnimations({subtree:true}).some(a=>a.playState==='running')"))
        self.page.locator('#bebe-hold').click();self.assertFalse(self.page.evaluate('BebeWelcome.metrics().pendingTimer'))
        self.page.emulate_media(reduced_motion='reduce');self.assertEqual(0,self.page.locator('#bebe-welcome').evaluate("e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"))
        self.receive()

    def test_02_six_new_worlds_really_open_after_flowers_and_keep_ink_music_and_motion(self):
        self.add_group_audio('mom')
        for scene in NEW:
            with self.subTest(scene=scene):
                self.page.emulate_media(reduced_motion='reduce');self.editor();self.settle_library()
                self.page.locator('#signature-text').fill('Một cái ôm từ con · Minh')
                self.draw();self.page.locator(f'[data-theme-preset="{scene}"]').click();self.welcome()
                self.page.emulate_media(reduced_motion='no-preference');self.page.locator('#bouquet-letter-open').click()
                self.page.wait_for_function("document.querySelector('#envelope-screen').dataset.journeyPhase==='theme'",timeout=4000)
                expect(self.page.locator('#theme-stage .gift-scene')).to_have_attribute('data-gift',scene)
                expect(self.page.locator('#theme-stage .gift-scene')).to_have_attribute('data-phase','opening')
                self.assertGreater(self.page.locator('#theme-stage svg').first.evaluate("e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"),0)
                self.wait_playing('0me.mp3');before=self.page.locator('#background-music').evaluate('a=>a.currentTime')
                expect(self.page.locator('#letter-screen')).to_be_visible(timeout=6000)
                expect(self.page.locator('#letter-screen')).to_have_attribute('data-experience',scene)
                expect(self.page.locator('#letter-sender')).to_have_text('Một cái ôm từ con · Minh')
                self.assertGreater(self.page.locator('#letter-screen .signature-ink path').count(),0)
                self.assertGreater(self.page.locator('#background-music').evaluate('a=>a.currentTime'),before+1)
                self.assertGreater(self.page.locator('#theme-backdrop svg').first.evaluate("e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"),0)
                self.assertEqual(1,self.page.locator('audio').count())

    def test_03_draw_undo_clear_and_blank_sender_do_not_invent_a_name(self):
        self.editor();expect(self.page.locator('#sender-name')).to_have_value('');self.draw()
        expect(self.page.locator('#preview-card .paper-sign')).to_be_visible();expect(self.page.locator('#preview-sender')).to_have_text('')
        self.draw();self.assertEqual(2,self.page.locator('#signature-pad path').count())
        self.page.locator('#signature-undo').click();self.assertEqual(1,self.page.locator('#signature-pad path').count())
        self.page.locator('#signature-clear').click();self.assertEqual(0,self.page.locator('#signature-pad path').count())
        expect(self.page.locator('#preview-card .paper-sign')).not_to_be_visible();expect(self.page.locator('#signature-undo')).to_be_disabled()
        self.page.locator('#signature-text').fill('Thương bà · An')
        expect(self.page.locator('#preview-card .paper-sign')).to_be_visible();expect(self.page.locator('#preview-sender')).to_have_text('Thương bà · An')
        expect(self.page.locator('#sender-name')).to_have_value('')

    def test_04_signed_link_restores_exact_vector_text_and_style_as_literal_content(self):
        self.clipboard();self.editor('lover');self.page.locator('#sender-name').fill('Minh')
        custom='Thương em <b>rất nhiều</b> 🌷';self.page.locator('#signature-text').fill(custom);self.page.locator('#signature-style').select_option('seal');self.draw()
        paths=self.page.locator('#preview-card .signature-ink path').evaluate_all('a=>a.map(e=>e.getAttribute("d"))')
        self.page.locator('[data-theme-preset="heartgarden"]').click();self.welcome();self.page.locator('#bebe-skip').click();link=self.copy_link()
        payload=self.page.evaluate('link=>CardLinks.decode(new URL(link).hash)',link)
        self.assertEqual(custom,payload['design']['signatureText']);self.assertTrue(payload['design']['signatureInk']);self.assertEqual('seal',payload['design']['signatureStyle'])
        second=self.new_page();second.goto(link);second.locator('#bebe-skip').click()
        expect(second.locator('#letter-sender')).to_have_text(custom);self.assertEqual(0,second.locator('#letter-sender b').count())
        self.assertEqual(paths,second.locator('#letter-screen .signature-ink path').evaluate_all('a=>a.map(e=>e.getAttribute("d"))'))
        expect(second.locator('#letter-screen .paper-sign')).to_have_attribute('data-signature-style','seal')
        self.assertEqual(0,second.locator('.signature-ink script,.signature-ink image,.signature-ink foreignObject').count())

    def test_05_theme_reset_hide_show_and_new_card_preserve_or_clear_signature_as_expected(self):
        self.editor();self.page.locator('#signature-text').fill('Con thương mẹ');self.draw();self.open_design();self.page.locator('#reset-design').click()
        expect(self.page.locator('#signature-text')).to_have_value('Con thương mẹ');self.assertGreater(self.page.locator('#signature-pad path').count(),0)
        self.page.locator('#show-signature').uncheck();expect(self.page.locator('#preview-card .paper-sign')).not_to_be_visible()
        expect(self.page.locator('#signature-visibility-note')).to_be_visible();self.page.locator('#show-signature').check()
        self.welcome();self.page.locator('#bebe-skip').click();expect(self.page.locator('#letter-screen .signature-ink')).to_be_visible()
        self.page.locator('#create-another').click();self.page.locator('[data-recipient="mom"]').click()
        expect(self.page.locator('#signature-text')).to_have_value('');self.assertEqual(0,self.page.locator('#signature-pad path').count())
        expect(self.page.locator('#preview-card .paper-sign')).not_to_be_visible()

    def test_06_touch_signature_fits_phones_without_scrolling_the_page_while_drawing(self):
        for width in (360,390):
            with self.subTest(width=width):
                self.page.set_viewport_size({'width':width,'height':844});self.editor();self.draw(touch=True);self.assert_layout('signature on phone')
                self.page.locator('#signature-text').fill('Thương thật nhiều 💛');self.welcome();self.page.locator('#bebe-skip').click();self.assert_layout('signed phone card')
                box=self.page.locator('#letter-screen .signature-ink').bounding_box();self.assertGreater(box['width'],100);self.assertLessEqual(box['x']+box['width'],width)

    def test_07_cancelled_stroke_does_not_replace_committed_ink_or_lock_the_pad(self):
        self.editor();self.draw();pad=self.page.locator('#signature-pad');pad.scroll_into_view_if_needed();r=pad.bounding_box()
        previous=self.page.locator('#preview-card .signature-ink path').first.get_attribute('d')
        self.page.mouse.move(r['x']+50,r['y']+50);self.page.mouse.down();self.page.mouse.move(r['x']+100,r['y']+80)
        pad.dispatch_event('pointercancel',{'pointerId':1});self.page.mouse.up()
        self.assertEqual(previous,self.page.locator('#preview-card .signature-ink path').first.get_attribute('d'))
        self.assertEqual(1,pad.locator('path').count());self.draw();self.assertEqual(2,pad.locator('path').count())
        r=pad.bounding_box();self.page.mouse.move(r['x']+50,r['y']+50);self.page.mouse.down();self.page.mouse.move(r['x']+100,r['y']+80)
        self.page.evaluate("window.dispatchEvent(new PageTransitionEvent('pagehide'))");self.page.mouse.up()
        self.assertEqual(2,pad.locator('path').count());self.draw();self.assertEqual(3,pad.locator('path').count())

    def test_08_legacy_sender_signature_and_no_ink_still_read_the_same_way(self):
        self.editor();fragment=self.page.evaluate("CardLinks.encode({target:'mom',senderName:'Con An',greeting:'Chúc mẹ bình yên.',design:{arrival:'classic',experience:'letter',scene:'envelope'}})")
        self.page.goto(bbtests.BASE_URL+fragment);self.page.locator('#envelope-open-button').click();expect(self.page.locator('#letter-screen')).to_be_visible()
        expect(self.page.locator('#letter-sender')).to_have_text('Con An');expect(self.page.locator('#letter-screen .signature-ink')).not_to_be_visible()
        expect(self.page.locator('#letter-screen .paper-sign')).to_have_attribute('data-signature-style','classic')

    def test_09_long_signature_words_wrap_in_all_four_styles_on_small_phones(self):
        text='ThươngMẹBìnhYên'*5+' 💛'
        text=text[:78]
        for width in (360,390):
            self.page.set_viewport_size({'width':width,'height':844});self.editor();self.page.locator('#signature-text').fill(text);self.draw();self.open_design();self.page.locator('[data-font-choice="handwriting"]').click()
            for style in ('classic','script','minimal','seal'):
                with self.subTest(width=width,style=style):
                    self.page.locator('#signature-style').select_option(style);self.welcome();self.page.locator('#bebe-skip').click();self.assert_layout('long signed card')
                    family=self.page.locator('#letter-sender').evaluate('e=>getComputedStyle(e).fontFamily');self.assertIn({'classic':'Lora','script':'Dancing Script','minimal':'Manrope','seal':'Lora'}[style],family)
                    box=self.page.locator('#letter-sender').bounding_box();self.assertGreaterEqual(box['x'],0);self.assertLessEqual(box['x']+box['width'],width)
                    self.page.locator('#edit-card').click()

if __name__=='__main__':unittest.main(verbosity=2)
