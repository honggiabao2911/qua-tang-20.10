"""Acceptance checks for the giant bouquet received before the card.

    BASE_URL=http://127.0.0.1:8001/ python3 tests/test_arrival.py

Production canvas, card sharing and audio execute in Chromium. MP3 routes serve
actual repository audio; the clipboard transport is the only mocked feature.
"""

import time
import unittest
from urllib.parse import urlparse

from playwright.sync_api import expect

import test_collection as collection
import test_upgrade as regression


BASE_URL = regression.BASE_URL


class ArrivalBrowserTests(unittest.TestCase):
    setUpClass = classmethod(regression.UpgradeBrowserTests.setUpClass.__func__)
    tearDownClass = classmethod(regression.UpgradeBrowserTests.tearDownClass.__func__)
    setUp = regression.UpgradeBrowserTests.setUp
    tearDown = regression.UpgradeBrowserTests.tearDown
    new_page = regression.UpgradeBrowserTests.new_page
    route_audio = regression.UpgradeBrowserTests.route_audio
    open_design = regression.UpgradeBrowserTests.open_design
    add_group_audio = collection.CollectionBrowserTests.add_group_audio
    settle_library = collection.CollectionBrowserTests.settle_library
    wait_playing = regression.UpgradeBrowserTests.wait_playing
    clipboard = regression.UpgradeBrowserTests.clipboard
    copy_link = regression.UpgradeBrowserTests.copy_link
    assert_layout = regression.UpgradeBrowserTests.assert_layout

    def editor(self, recipient="mom"):
        # Legacy regression helpers deliberately opt into classic arrival.
        # This suite exercises the unmodified first-time creation defaults.
        self.page.goto(BASE_URL)
        expect(self.page.locator("#home-screen")).to_be_visible()
        ui_recipient = "women" if recipient == "friend" else recipient
        self.page.locator(f'button[data-recipient="{ui_recipient}"]').first.click()
        expect(self.page.locator("#editor-screen")).to_be_visible()
        if recipient == "friend":
            self.page.locator("#variant-field").select_option("friend")

    def invitation(self):
        if self.page.locator("#editor-screen").is_visible():
            self.page.locator("#open-card-button").click()
        expect(self.page.locator("#envelope-screen")).to_be_visible()
        expect(self.page.locator("#bouquet-arrival")).to_be_visible()
        expect(self.page.locator("#bouquet-letter-open")).to_be_enabled()

    def read_arrival(self, page=None):
        page = page or self.page
        page.locator("#bouquet-letter-open").click()
        expect(page.locator("#letter-screen")).to_be_visible(timeout=7000)

    def metrics(self):
        return self.page.evaluate("BouquetArrival.metrics()")

    def choose_arrival(self, style):
        self.open_design()
        self.page.locator("#arrival-style").select_option(style)

    def test_01_all_six_groups_start_with_a_giant_bouquet(self):
        for target in ("mom", "grandma", "teacher", "sister", "women", "lover"):
            with self.subTest(target=target):
                self.editor(target)
                self.open_design()
                expect(self.page.locator("#arrival-style")).to_have_value("stardust")
                self.invitation()
                self.assertTrue(self.metrics()["visible"])
                self.read_arrival()
                expect(self.page.locator("#letter-greeting")).not_to_have_text("")
                self.assertFalse(self.metrics()["visible"])
                self.assertFalse(self.metrics()["running"])

    def test_02_bouquet_fills_the_phone_and_keeps_the_card_inside(self):
        for width, height in ((360, 800), (390, 844), (1440, 900)):
            with self.subTest(viewport=(width, height)):
                self.page.set_viewport_size({"width": width, "height": height})
                self.editor("lover")
                self.page.locator("#recipient-name").fill("Người thương của mình 🌸")
                self.invitation()
                host = self.page.locator("#bouquet-arrival").bounding_box()
                canvas = self.page.locator("#bouquet-arrival canvas").first.bounding_box()
                card = self.page.locator("#bouquet-letter-open").bounding_box()
                self.assertGreater(canvas["height"], min(height * .5, 400))
                self.assertGreater(canvas["width"], host["width"] * .8)
                self.assertGreaterEqual(card["x"], host["x"] - 1)
                self.assertLessEqual(card["x"] + card["width"], host["x"] + host["width"] + 1)
                self.assertGreaterEqual(card["y"], host["y"] - 1)
                self.assertLessEqual(card["y"] + card["height"], host["y"] + host["height"] + 1)
                self.assert_layout(f"{width}px bouquet arrival")
                self.assertGreater(self.metrics()["particles"], 1000)
                self.page.screenshot(path=f"/tmp/bouquet-arrival-{width}.png", full_page=True)

    def test_03_shared_link_preserves_bouquet_style_and_frozen_card(self):
        self.clipboard()
        self.add_group_audio("lover")
        self.editor("lover")
        self.settle_library()
        self.page.locator("#recipient-name").fill("An")
        self.page.locator("#sender-name").fill("Minh")
        self.page.locator("#personal-message").fill("Một điều dịu dàng gửi riêng đến em ❤️")
        self.page.locator("#track-list .track-select").nth(5).click()
        self.choose_arrival("growing")
        greeting = regression.VIETNAMESE + "\nAnh thương em thật nhiều."
        self.page.locator("#custom-greeting").fill(greeting)
        self.invitation()
        self.read_arrival()
        self.wait_playing("5yeu.mp3")
        link = self.copy_link()
        payload = self.page.evaluate("hash => CardLinks.decode(hash)", "#" + urlparse(link).fragment)
        self.assertEqual("growing", payload["design"]["arrival"])
        self.assertEqual("lover:5", payload["musicId"])
        self.assertEqual(greeting, payload["greeting"])
        second = self.new_page()
        second.goto(link)
        expect(second.locator("#bouquet-arrival")).to_be_visible()
        self.settle_library(second)
        self.assertTrue(second.locator("#background-music").evaluate("el => el.paused"))
        self.read_arrival(second)
        expect(second.locator("#letter-greeting")).to_have_text(greeting)
        expect(second.locator("#letter-recipient")).to_contain_text("An")
        expect(second.locator("#letter-message")).to_have_text("Một điều dịu dàng gửi riêng đến em ❤️")
        expect(second.locator("#letter-track-select")).to_have_value("lover:5")

    def test_04_opening_shared_bouquet_is_silent_until_the_card_gesture(self):
        self.add_group_audio("mom")
        self.editor()
        fragment = self.page.evaluate("""() => CardLinks.encode({target:'mom',senderName:'Con',
            recipientName:'Mẹ',greeting:'Con chúc mẹ thật nhiều bình an.',musicId:'mom:2',
            design:{arrival:'stardust',experience:'sunflower',scene:'sunrise'}})""")
        self.page.goto(BASE_URL + fragment)
        expect(self.page.locator("#bouquet-arrival")).to_be_visible()
        self.settle_library()
        self.assertTrue(self.page.locator("#background-music").evaluate("el => el.paused"))
        self.read_arrival()
        self.wait_playing("2me.mp3")
        self.assertEqual(1, self.page.locator("audio").evaluate_all("els=>els.filter(a=>!a.paused).length"))

    def test_05_reduced_motion_and_off_keep_the_complete_bouquet_without_a_loop(self):
        for style in ("stardust", "growing"):
            for intensity in ("cinematic", "off"):
                with self.subTest(style=style, intensity=intensity):
                    self.editor()
                    self.choose_arrival(style)
                    self.page.locator("#intensity-field").select_option(intensity)
                    self.page.emulate_media(reduced_motion="reduce" if intensity == "cinematic" else "no-preference")
                    self.invitation()
                    initial = self.metrics()
                    self.assertGreater(initial["particles"], 1000)
                    self.assertFalse(initial["running"])
                    self.page.wait_for_timeout(130)
                    self.assertEqual(initial["frames"], self.metrics()["frames"])
                    start = time.monotonic()
                    self.read_arrival()
                    self.assertLess(time.monotonic() - start, 2)

    def test_06_live_particles_stop_when_reading_and_restart_once_on_replay(self):
        self.page.emulate_media(reduced_motion="no-preference")
        self.editor("lover")
        self.invitation()
        self.page.wait_for_function("BouquetArrival.metrics().frames > 2")
        self.assertTrue(self.metrics()["running"])
        self.read_arrival()
        stopped = self.metrics()
        self.assertFalse(stopped["running"])
        self.page.wait_for_timeout(150)
        self.assertEqual(stopped["frames"], self.metrics()["frames"])
        for _ in range(2):
            self.page.locator("#replay-card").click()
            self.invitation()
            self.page.wait_for_function("BouquetArrival.metrics().running")
            self.assertEqual(1, self.page.locator("#bouquet-arrival canvas").count())
            self.read_arrival()
            self.assertFalse(self.metrics()["running"])

    def test_07_page_visibility_stops_and_resumes_one_particle_loop(self):
        self.page.emulate_media(reduced_motion="no-preference")
        self.editor()
        self.invitation()
        self.page.wait_for_function("BouquetArrival.metrics().running")
        self.page.evaluate("""() => {
            Object.defineProperty(document,'hidden',{configurable:true,value:true});
            document.dispatchEvent(new Event('visibilitychange'));
        }""")
        self.assertFalse(self.metrics()["running"])
        frames = self.metrics()["frames"]
        self.page.wait_for_timeout(150)
        self.assertEqual(frames, self.metrics()["frames"])
        self.page.evaluate("""() => {
            Object.defineProperty(document,'hidden',{configurable:true,value:false});
            document.dispatchEvent(new Event('visibilitychange'));
        }""")
        self.page.wait_for_function("BouquetArrival.metrics().running")
        self.page.wait_for_function("n => BouquetArrival.metrics().frames > n", arg=frames)
        self.read_arrival()

    def test_08_classic_arrival_keeps_existing_gift_scene(self):
        self.editor()
        self.page.locator('#theme-gallery [data-theme-preset="umbrella"]').click()
        self.choose_arrival("classic")
        self.page.locator("#open-card-button").click()
        expect(self.page.locator("#bouquet-arrival")).not_to_be_visible()
        expect(self.page.locator("#theme-stage")).to_be_visible()
        self.page.locator("#envelope-open-button").click()
        regression.finish_opening(self.page)
        expect(self.page.locator("#letter-greeting")).not_to_have_text("")

    def test_09_studio_music_reports_a_missing_file_and_track_suggestions_are_removed(self):
        self.editor()
        self.settle_library()
        expect(self.page.locator("#studio-music-toggle")).to_be_visible()
        self.assertEqual(0, self.page.locator(".track-suggestion").count())
        self.assertNotIn("Gợi ý chọn nhạc", self.page.locator("#music-library").inner_text())
        self.page.locator("#studio-music-toggle").click()
        expect(self.page.locator("#studio-music-status")).to_contain_text("nhac.mp3")
        self.assertEqual(0, self.page.locator("audio").evaluate_all("els=>els.filter(a=>!a.paused).length"))

    def test_10_studio_music_uses_nhac_and_never_overlaps_card_preview(self):
        self.available["nhac.mp3"] = "music_under.mp3"
        self.add_group_audio("mom")
        self.editor()
        self.settle_library()
        # Choosing a recipient is already a user gesture and can start studio
        # music. A second toggle would intentionally pause that playing track.
        if not self.page.evaluate("CardMusic.studioState().playing"):
            self.page.locator("#studio-music-toggle").click()
        self.page.wait_for_function("""() => [...document.querySelectorAll('audio')].some(a =>
            !a.paused && a.readyState >= 2 && a.currentSrc.endsWith('/nhac.mp3'))""")
        self.assertEqual(1, self.page.locator("audio").evaluate_all("els=>els.filter(a=>!a.paused).length"))
        self.page.locator('[data-preview-track="mom:2"]').click()
        self.wait_playing("2me.mp3")
        self.assertEqual(1, self.page.locator("audio").evaluate_all("els=>els.filter(a=>!a.paused).length"))
        self.page.locator("#studio-music-toggle").click()
        self.page.wait_for_function("""() => [...document.querySelectorAll('audio')].some(a =>
            !a.paused && a.readyState >= 2 && a.currentSrc.endsWith('/nhac.mp3'))""")
        self.invitation()
        self.assertEqual(0, self.page.locator("audio").evaluate_all("els=>els.filter(a=>!a.paused).length"))
        self.read_arrival()
        self.wait_playing("2me.mp3")
        self.assertEqual(1, self.page.locator("audio").evaluate_all("els=>els.filter(a=>!a.paused).length"))

    def test_11_existing_links_without_arrival_preserve_the_original_scene(self):
        self.editor()
        fragment = self.page.evaluate("""() => CardLinks.encode({target:'mom',
            greeting:'Con chúc mẹ một ngày thật bình an.',design:{scene:'umbrella',experience:'umbrella'}})""")
        self.page.goto(BASE_URL + fragment)
        expect(self.page.locator("#envelope-screen")).to_be_visible()
        expect(self.page.locator("#bouquet-arrival")).not_to_be_visible()
        expect(self.page.locator("#theme-stage")).to_be_visible()
        self.page.locator("#envelope-open-button").click()
        regression.finish_opening(self.page)
        expect(self.page.locator("#letter-greeting")).to_have_text("Con chúc mẹ một ngày thật bình an.")


if __name__ == "__main__":
    unittest.main(verbosity=2)
