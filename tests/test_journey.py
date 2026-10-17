"""Regression for bouquet -> selected world -> persistent reading scene.

Use the production renderers and real repository MP3 bytes through HTTP.
"""
import unittest

from playwright.sync_api import expect
import test_arrival as arrival
import test_upgrade as regression

BASE_URL = regression.BASE_URL
GIFTS = ('umbrella', 'storybook', 'island', 'ocean', 'balloon', 'lantern',
         'wishtree', 'silk', 'lightbridge', 'musicbox', 'glassgarden', 'wisteria', 'lotusmoon', 'sunmail', 'lavender', 'heartgarden')


class JourneyBrowserTests(unittest.TestCase):
    setUpClass = classmethod(regression.UpgradeBrowserTests.setUpClass.__func__)
    tearDownClass = classmethod(regression.UpgradeBrowserTests.tearDownClass.__func__)
    setUp = regression.UpgradeBrowserTests.setUp
    tearDown = regression.UpgradeBrowserTests.tearDown
    new_page = regression.UpgradeBrowserTests.new_page
    route_audio = regression.UpgradeBrowserTests.route_audio
    editor = arrival.ArrivalBrowserTests.editor
    invitation = arrival.ArrivalBrowserTests.invitation
    read_arrival = arrival.ArrivalBrowserTests.read_arrival
    add_group_audio = arrival.ArrivalBrowserTests.add_group_audio
    assert_layout = regression.UpgradeBrowserTests.assert_layout
    settle_library = regression.UpgradeBrowserTests.settle_library
    wait_playing = regression.UpgradeBrowserTests.wait_playing
    open_design = regression.UpgradeBrowserTests.open_design
    clipboard = regression.UpgradeBrowserTests.clipboard
    copy_link = regression.UpgradeBrowserTests.copy_link

    def test_01_both_bouquets_keep_all_28_selected_scenes_and_reading_art(self):
        self.editor()
        scenes = self.page.evaluate('Object.keys(CardThemes.catalog)')
        self.assertEqual(28, len(scenes))
        for style in ('stardust', 'growing'):
            for scene in scenes:
                with self.subTest(style=style, scene=scene):
                    self.editor()
                    self.page.locator(f'[data-theme-preset="{scene}"]').click()
                    self.page.locator('#arrival-style').select_option(style)
                    self.invitation()
                    self.page.locator('#bouquet-letter-open').click()
                    if scene in GIFTS:
                        expect(self.page.locator('#theme-stage')).to_be_visible()
                        expect(self.page.locator('#theme-stage .gift-scene')).to_have_attribute('data-phase', 'ready')
                        expect(self.page.locator('#letter-screen')).not_to_be_visible()
                        self.page.locator('#envelope-open-button').click()
                    expect(self.page.locator('#letter-screen')).to_be_visible()
                    expect(self.page.locator('#letter-screen')).to_have_attribute('data-experience', scene)
                    art = self.page.locator('#theme-backdrop')
                    expect(art).to_be_visible()
                    self.assertGreater(art.locator('svg').count(), 0)
                    a, paper = art.bounding_box(), self.page.locator('.letter-paper').bounding_box()
                    self.assertGreater(a['width'], 250)
                    self.assertGreater(a['height'], 200)
                    self.assertLess(a['y'], paper['y'] + paper['height'])
                    self.assertLess(abs(a['y'] - paper['y']), 60, 'Reading artwork must accompany the text, not sit in a footer')
                    self.assertFalse(self.page.evaluate('BouquetArrival.metrics().running'))
                    self.assert_layout(f'{style} -> {scene} -> reading')

    def test_02_real_motion_runs_selected_scene_after_the_bouquet_and_keeps_music(self):
        self.page.emulate_media(reduced_motion='no-preference')
        self.add_group_audio('mom')
        self.editor()
        self.settle_library()
        self.page.locator('[data-theme-preset="island"]').click()
        self.invitation()
        self.page.locator('#bouquet-letter-open').press('Enter')
        self.wait_playing('0me.mp3')
        self.page.wait_for_function("document.querySelector('#envelope-screen').dataset.journeyPhase === 'theme'", timeout=6000)
        expect(self.page.locator('#theme-stage')).to_be_visible()
        expect(self.page.locator('#theme-stage .gift-scene')).to_have_attribute('data-phase', 'opening')
        expect(self.page.locator('#letter-screen')).not_to_be_visible()
        self.assertFalse(self.page.evaluate('BouquetArrival.metrics().running'))
        self.page.wait_for_function("GiftScenes.phase() === 'ready'", timeout=7000)
        self.assertGreater(self.page.locator('#background-music').evaluate('a=>a.currentTime'), 3)
        self.page.locator('#envelope-open-button').press('Enter')
        expect(self.page.locator('#letter-screen')).to_be_visible()
        self.assertTrue(self.page.locator('#theme-backdrop .ga-island-body').evaluate("n=>n.getAnimations().some(a=>a.playState==='running')"))
        self.assertEqual(1, self.page.locator('audio').evaluate_all('els=>els.filter(a=>!a.paused).length'))

    def test_03_visual_choices_show_real_art_and_preview_the_complete_path(self):
        self.editor()
        for style in ('stardust', 'growing', 'classic'):
            with self.subTest(style=style):
                button = self.page.locator(f'[data-arrival-choice="{style}"]')
                self.assertGreater(button.locator('svg').count(), 0)
                button.click()
                expect(button).to_have_attribute('aria-pressed', 'true')
                expect(self.page.locator('#arrival-style')).to_have_value(style)
        self.page.locator('[data-theme-preset="wishtree"]').click()
        expect(self.page.locator('#arrival-classic-picture')).to_have_attribute('data-experience', 'wishtree')
        expect(self.page.locator('#journey-description')).to_contain_text('Cây giữ nguyên tán hoa')
        self.page.locator('[data-preview-arrival="growing"]').press('Enter')
        expect(self.page.locator('#bouquet-arrival [data-style="growing"]')).to_be_visible()
        self.read_arrival()
        expect(self.page.locator('#theme-backdrop .gift-wishtree')).to_be_visible()

    def test_04_mobile_reading_keeps_tree_flower_notes_and_long_text_accessible(self):
        for width in (360, 390):
            with self.subTest(width=width):
                self.page.set_viewport_size({'width': width, 'height': 844})
                self.editor()
                self.page.locator('[data-theme-preset="wishtree"]').click()
                self.open_design()
                self.page.locator('#flower-note-0').fill('Cảm ơn mẹ đã luôn ở đây 🌷')
                self.page.locator('#personal-message').fill('Thương mẹ thật nhiều. ' * 35)
                self.invitation()
                self.read_arrival()
                world, paper = self.page.locator('#theme-backdrop').bounding_box(), self.page.locator('.letter-paper').bounding_box()
                self.assertLessEqual(world['y'] + world['height'], paper['y'])
                flower = self.page.locator('#theme-backdrop .gift-flower-note').first
                flower.click()
                expect(self.page.locator('#theme-backdrop .gift-note-content')).to_have_text('Cảm ơn mẹ đã luôn ở đây 🌷')
                self.assert_layout(f'{width}px tree and long letter')

    def test_05_shared_link_repeats_complete_world_and_preserves_personal_content(self):
        self.clipboard()
        self.editor('lover')
        self.page.locator('[data-theme-preset="wishtree"]').click()
        self.page.locator('#arrival-style').select_option('growing')
        self.page.locator('#recipient-name').fill('An 🌸')
        self.page.locator('#personal-message').fill('Bên em, mọi ngày đều thật đẹp.')
        self.invitation()
        self.read_arrival()
        link = self.copy_link()
        second = self.new_page()
        second.goto(link)
        expect(second.locator('#bouquet-arrival [data-style="growing"]')).to_be_visible()
        self.read_arrival(second)
        expect(second.locator('#theme-backdrop .gift-wishtree')).to_be_visible()
        expect(second.locator('#letter-message')).to_have_text('Bên em, mọi ngày đều thật đẹp.')
        expect(second.locator('#letter-recipient')).to_contain_text('An 🌸')

    def test_06_skip_and_replay_never_leave_a_late_scene_over_the_editor(self):
        self.page.emulate_media(reduced_motion='no-preference')
        self.editor()
        self.page.locator('[data-theme-preset="wishtree"]').click()
        self.invitation()
        self.page.locator('#bouquet-letter-open').click()
        self.page.locator('#skip-animation').click()
        expect(self.page.locator('#letter-screen')).to_be_visible()
        expect(self.page.locator('#theme-backdrop .gift-wishtree')).to_be_visible()
        self.page.locator('#replay-card').click()
        expect(self.page.locator('#bouquet-arrival')).to_be_visible()
        self.page.locator('#bouquet-letter-open').click()
        self.page.locator('#back-to-editor').click()
        self.page.wait_for_timeout(2600)
        expect(self.page.locator('#editor-screen')).to_be_visible()
        self.assertFalse(self.page.evaluate('BouquetArrival.metrics().running'))
        self.assertEqual('initial', self.page.evaluate('GiftScenes.phase()'))

    def test_07_switching_to_reduced_motion_mid_open_keeps_the_chosen_gift(self):
        self.page.emulate_media(reduced_motion='no-preference')
        self.editor()
        self.page.locator('[data-theme-preset="island"]').click()
        self.invitation()
        self.page.locator('#bouquet-letter-open').click()
        self.page.emulate_media(reduced_motion='reduce')
        expect(self.page.locator('#theme-stage .gift-island')).to_have_attribute('data-phase', 'ready')
        self.page.locator('#envelope-open-button').click()
        expect(self.page.locator('#theme-backdrop .gift-island')).to_be_visible()
        self.assertFalse(self.page.locator('#theme-backdrop').evaluate("n=>n.getAnimations({subtree:true}).some(a=>a.playState==='running')"))

    def test_08_disabled_motion_keeps_both_opening_and_reading_world_static(self):
        self.page.emulate_media(reduced_motion='no-preference')
        self.editor()
        self.page.locator('[data-theme-preset="island"]').click()
        self.open_design()
        self.page.locator('#intensity-field').select_option('off')
        self.invitation()
        self.page.locator('#bouquet-letter-open').click()
        expect(self.page.locator('#theme-stage .gift-island')).to_have_attribute('data-phase', 'ready')
        self.assertFalse(self.page.locator('#theme-stage').evaluate("n=>n.getAnimations({subtree:true}).some(a=>a.playState==='running')"))
        self.page.locator('#envelope-open-button').click()
        expect(self.page.locator('#theme-backdrop .gift-island')).to_be_visible()
        self.assertFalse(self.page.locator('#theme-backdrop').evaluate("n=>n.getAnimations({subtree:true}).some(a=>a.playState==='running')"))


if __name__ == '__main__':
    unittest.main(verbosity=2)
