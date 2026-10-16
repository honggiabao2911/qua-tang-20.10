"""Flower-only welcome, connected geometry, bounded rendering and sharing."""
import unittest
from playwright.sync_api import expect
import test_arrival as arrival
import test_upgrade as regression

BASE_URL = regression.BASE_URL


class RefinementBrowserTests(unittest.TestCase):
    setUpClass = classmethod(regression.UpgradeBrowserTests.setUpClass.__func__)
    tearDownClass = classmethod(regression.UpgradeBrowserTests.tearDownClass.__func__)
    setUp = regression.UpgradeBrowserTests.setUp
    tearDown = regression.UpgradeBrowserTests.tearDown
    new_page = regression.UpgradeBrowserTests.new_page
    route_audio = regression.UpgradeBrowserTests.route_audio
    editor = arrival.ArrivalBrowserTests.editor
    invitation = arrival.ArrivalBrowserTests.invitation
    read_arrival = arrival.ArrivalBrowserTests.read_arrival
    assert_layout = regression.UpgradeBrowserTests.assert_layout
    open_design = regression.UpgradeBrowserTests.open_design
    clipboard = regression.UpgradeBrowserTests.clipboard
    copy_link = regression.UpgradeBrowserTests.copy_link

    def test_01_initial_welcome_is_only_flowers_and_a_clear_receive_button(self):
        for width in (360, 390, 1440):
            for style in ('stardust', 'growing'):
                with self.subTest(width=width, style=style):
                    self.page.set_viewport_size({'width': width, 'height': 844})
                    self.editor()
                    self.page.locator('#arrival-style').select_option(style)
                    self.invitation()
                    expect(self.page.locator('.ba-occasion')).to_have_text('TẶNG HOA NHÂN NGÀY 20/10')
                    self.assertEqual(0, self.page.locator('#bouquet-arrival .ba-letter').count())
                    self.assertNotIn('tấm thiệp', self.page.locator('#bouquet-arrival').inner_text())
                    expect(self.page.locator('#bouquet-letter-open')).to_have_text('Nhận hoa và mở lời chúc')
                    self.assert_layout(f'{width}px flower-only gift')
                    self.read_arrival()
                    expect(self.page.locator('#letter-greeting')).not_to_have_text('')

    def test_02_every_flower_stays_connected_to_its_stem_during_growth_and_sway(self):
        self.page.emulate_media(reduced_motion='no-preference')
        self.editor()
        self.page.locator('#arrival-style').select_option('growing')
        self.invitation()
        def joint_errors():
            return self.page.evaluate("""() => [...document.querySelectorAll('#bouquet-arrival .ba-stems>path')].map(stem=>{
                const bloom=document.querySelector('#bouquet-arrival .ba-bloom[data-flower-index="'+stem.dataset.flowerIndex+'"]');
                const a=stem.getPointAtLength(0).matrixTransform(stem.getScreenCTM());
                const b=new DOMPoint(0,0).matrixTransform(bloom.getScreenCTM());
                return Math.hypot(a.x-b.x,a.y-b.y);
            })""")
        for _ in range(3):
            self.assertEqual(23, len(joint_errors()))
            self.assertLess(max(joint_errors()), 1)
            self.page.wait_for_timeout(150)
        self.page.locator('#bouquet-letter-open').click()
        self.page.wait_for_timeout(230)
        self.assertLess(max(joint_errors()), 1)
        self.assertTrue(self.page.locator('.ba-scene').evaluate("n=>n.getAnimations().some(a=>a.animationName==='ba-gift-sway'&&a.playState==='running')"))
        expect(self.page.locator('#letter-screen')).to_be_visible(timeout=10000)

    def test_03_idle_particles_use_cached_glows_and_a_bounded_drawing_rate(self):
        self.page.emulate_media(reduced_motion='no-preference')
        self.page.set_viewport_size({'width': 390, 'height': 844})
        self.editor()
        self.invitation()
        self.page.wait_for_function("BouquetArrival.state.phase==='ready'", timeout=6000)
        self.page.evaluate("""() => {
            const original=CanvasRenderingContext2D.prototype.createRadialGradient;
            window.__gradientCalls=0;
            CanvasRenderingContext2D.prototype.createRadialGradient=function(...args){window.__gradientCalls++;return original.apply(this,args);};
        }""")
        before=self.page.evaluate('BouquetArrival.metrics()')
        self.page.wait_for_timeout(1100)
        after=self.page.evaluate('BouquetArrival.metrics()')
        self.assertGreater(after['frames'], before['frames'])
        self.assertLessEqual(after['frames']-before['frames'], 28)
        self.assertEqual(0, self.page.evaluate('window.__gradientCalls'))
        self.assertLessEqual(after['glowSprites'], 16)
        self.read_arrival()
        self.assertFalse(self.page.evaluate('BouquetArrival.metrics().running'))

    def test_04_effect_picker_has_a_matching_demo_and_real_gift_particles(self):
        self.page.emulate_media(reduced_motion='no-preference')
        self.editor()
        self.page.locator('[data-theme-preset="island"]').click()
        self.page.locator('#arrival-style').select_option('classic')
        self.open_design()
        self.page.locator('#effect-field').select_option('butterflies')
        expect(self.page.locator('#effect-description')).to_contain_text('cánh bướm')
        self.page.locator('#preview-effect').click()
        expect(self.page.locator('#effect-preview-stage')).to_have_attribute('data-effect', 'butterflies')
        expect(self.page.locator('#effect-preview-particles svg')).to_have_count(6)
        self.assertTrue(self.page.locator('#effect-preview-particles span').first.evaluate("n=>n.getAnimations().some(a=>a.playState==='running')"))
        glyph=self.page.locator('#effect-preview-particles svg').first.inner_html()
        self.page.locator('#open-card-button').click()
        self.page.locator('#envelope-open-button').click()
        self.page.locator('#skip-animation').click()
        self.page.locator('#envelope-open-button').click()
        expect(self.page.locator('#letter-screen')).to_be_visible()
        actual=self.page.locator('#theme-backdrop .tx-welcome-particle svg')
        self.assertGreater(actual.count(), 0)
        self.assertEqual(glyph, actual.first.inner_html())
        self.assertGreater(self.page.locator('.reading-ambience i svg').count(), 0)

    def test_05_received_card_has_a_large_create_your_card_action(self):
        self.page.set_viewport_size({'width': 360, 'height': 800})
        self.editor()
        fragment=self.page.evaluate("""() => CardLinks.encodeCompact({target:'mom',senderName:'Con',
            greeting:'Con chúc mẹ bình yên và hạnh phúc.',design:{arrival:'growing',experience:'sunflower',scene:'sunrise'}})""")
        self.page.goto(BASE_URL+fragment)
        self.read_arrival()
        button=self.page.locator('#create-another')
        expect(button).to_have_text('Tạo thiệp của bạn')
        self.assertGreaterEqual(button.bounding_box()['height'], 52)
        self.assertGreater(button.bounding_box()['width'], 260)
        button.click()
        expect(self.page.locator('#home-screen')).to_be_visible()
        expect(self.page.locator('#home-screen .recipient-choice')).to_have_count(6)
        self.page.locator('[data-recipient="mom"]').click()
        expect(self.page.locator('#sender-name')).to_have_value('')
        self.assertNotIn('#c=', self.page.url)

    def test_06_shared_links_use_the_shorter_lossless_encoding_with_frozen_text(self):
        self.clipboard()
        self.editor()
        self.page.locator('#personal-message').fill('Bình yên, hạnh phúc và thật nhiều yêu thương. 🌷')
        self.invitation()
        self.read_arrival()
        greeting=self.page.locator('#letter-greeting').inner_text()
        message=self.page.locator('#letter-message').inner_text()
        link=self.copy_link()
        comparison=self.page.evaluate("""link=>{
            const fragment=new URL(link).hash,decoded=CardLinks.decode(fragment);
            return {compact:fragment.length,old:CardLinks.encode(decoded).length};
        }""", link)
        self.assertLess(comparison['compact'], comparison['old'])
        second=self.new_page();second.goto(link);self.read_arrival(second)
        expect(second.locator('#letter-greeting')).to_have_text(greeting)
        expect(second.locator('#letter-message')).to_have_text(message)


if __name__ == '__main__':
    unittest.main(verbosity=2)
