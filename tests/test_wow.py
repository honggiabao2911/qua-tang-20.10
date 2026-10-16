"""Browser acceptance checks for the bouquet / galaxy card experience.

Run against the repository's HTTP server:
    BASE_URL=http://127.0.0.1:8000/ python tests/test_wow.py

Uses the existing real-MP3 routing helpers; media playback is never mocked.
Screenshots from representative layouts are saved under /tmp/wow-*.png.
"""

import json
import time
import unittest
from urllib.parse import quote, urlparse

from playwright.sync_api import expect

import test_upgrade as regression


BASE_URL = regression.BASE_URL
VIETNAMESE = regression.VIETNAMESE
VIEWPORTS = regression.VIEWPORTS
SCENES = ("bouquet", "galaxy", "envelope")
STRUCTURES = ("letter", "arch", "postcard")
# LZ-string fixture expanding to 30,000 "x" characters: exercises the decoder's
# expanded-output limit using a small URL rather than only its input-size guard.
COMPRESSED_BOMB = (
    "#c=B418ZXTt_DFOS1b0c17Pd_wYUcSaWeRZVdTbXfQ408y62-x519z73_wMFDhI0WPETJU6"
    "TNlz5CxUuUrVa9Rs1btO3Xv0HDR4ydNnzFy1es3bd-w8dPnL12_cfPX7z99__AYFBwSGhYe"
    "ERkVHRMbFx8QmJSckpqWnpGZlZ2Tm5efkFhUXFJaVl5RWVVdU1tXX1DY1NzS2tbe0dnV3"
    "dPb19_QODQ8Mjo2PjE5NT0zOzc_MLi0vLK6tr6xubW9s7u3v7B4dHxyenZ-cXl1fXN7d39w"
    "-PT88vr28OQA"
)


def payload(**changes):
    """A public v2 card, independent of the application's internal state."""
    card = {
        "v": 2, "target": "mom", "variant": "", "recipientName": "Mẹ Ánh",
        "senderName": "Gia Bảo", "pronoun": "con", "sampleIndex": 0,
        "message": "Con thương mẹ rất nhiều ♥", "musicId": "mom:0",
        "design": {
            "theme": "rose", "font": "serif", "layout": "classic",
            "decoration": "botanical", "effect": "petals", "dedication": "Chỉ riêng mẹ",
            "body": "", "scene": "bouquet", "structure": "letter",
            "ornament": "botanical", "intensity": "cinematic",
        },
    }
    card.update(changes)
    return card


class WowBrowserTests(unittest.TestCase):
    # Reuse functional helpers without inheriting/rerunning unrelated test cases.
    setUpClass = classmethod(regression.UpgradeBrowserTests.setUpClass.__func__)
    tearDownClass = classmethod(regression.UpgradeBrowserTests.tearDownClass.__func__)
    new_page = regression.UpgradeBrowserTests.new_page
    editor = regression.UpgradeBrowserTests.editor
    settle_library = regression.UpgradeBrowserTests.settle_library
    add_group_audio = regression.UpgradeBrowserTests.add_group_audio
    open_design = regression.UpgradeBrowserTests.open_design
    wait_playing = regression.UpgradeBrowserTests.wait_playing
    copy_link = regression.UpgradeBrowserTests.copy_link
    clipboard = regression.UpgradeBrowserTests.clipboard
    assert_layout = regression.UpgradeBrowserTests.assert_layout

    def setUp(self):
        self.hold_audio = False
        self.pending_audio = []
        regression.UpgradeBrowserTests.setUp(self)
        self.context.add_init_script("""
            window.__musicPlayCalls = [];
            const actualPlay = HTMLMediaElement.prototype.play;
            HTMLMediaElement.prototype.play = function (...args) {
                window.__musicPlayCalls.push({
                    active: navigator.userActivation?.isActive,
                    time: performance.now(), source: this.currentSrc || this.src
                });
                return actualPlay.apply(this, args);
            };
        """)

    def tearDown(self):
        regression.UpgradeBrowserTests.tearDown(self)

    def route_audio(self, route):
        if self.hold_audio and route.request.method == "HEAD":
            self.pending_audio.append(route)
            return
        regression.UpgradeBrowserTests.route_audio(self, route)

    def choose_scene(self, scene):
        self.open_design()
        self.page.locator("#scene-field").select_option(scene)

    def open_letter(self, page=None):
        page = page or self.page
        if page.locator("#editor-screen").is_visible():
            page.locator("#open-card-button").click()
        expect(page.locator("#envelope-screen")).to_be_visible()
        page.locator("#envelope-open-button").click()
        expect(page.locator("#letter-screen")).to_be_visible(timeout=4000)

    def decode(self, fragment):
        return self.page.evaluate("hash => CardLinks.decode(hash)", fragment)

    def test_01_presets_have_distinct_art_direction_without_erasing_the_message(self):
        self.editor("grandma")
        self.open_design()
        self.page.locator("#recipient-name").fill("Ngoại Ánh")
        self.page.locator("#sender-name").fill("Bảo")
        self.page.locator("#sender-pronoun").fill("cháu")
        self.page.locator("#personal-message").fill("Nhớ những chiều ở bên Ngoại.")
        self.page.locator("#custom-greeting").fill("Ngoại luôn là khoảng trời bình yên của cháu.")
        paper = self.page.locator("#preview-card")
        appearances = []
        designs = []
        for preset in ("bouquet", "galaxy", "atelier"):
            self.page.locator(f'[data-preset="{preset}"]').click()
            designs.append(paper.evaluate("el => [el.dataset.scene,el.dataset.structure,el.dataset.theme]"))
            appearances.append(paper.evaluate("""el => {
                const style=getComputedStyle(el);
                return [style.backgroundColor,style.backgroundImage,style.borderRadius,
                    style.borderColor,style.color,style.boxShadow];
            }"""))
            expect(self.page.locator("#recipient-name")).to_have_value("Ngoại Ánh")
            expect(self.page.locator("#sender-name")).to_have_value("Bảo")
            expect(self.page.locator("#sender-pronoun")).to_have_value("cháu")
            expect(self.page.locator("#preview-greeting")).to_have_text(
                "Ngoại luôn là khoảng trời bình yên của cháu.")
            expect(self.page.locator("#preview-message")).to_have_text("Nhớ những chiều ở bên Ngoại.")
        self.assertEqual(3, len({json.dumps(design) for design in designs}), designs)
        self.assertEqual(3, len({json.dumps(style) for style in appearances}), appearances)

    def test_02_live_mini_preview_is_useful_while_customizing_on_a_phone(self):
        self.page.set_viewport_size({"width": 390, "height": 844})
        self.editor()
        self.open_design()
        mini = self.page.locator("#design-mini-preview")
        expect(mini).to_be_visible()
        self.page.locator("#recipient-name").fill("Mẹ yêu")
        self.page.locator("#custom-greeting").fill("Một vườn hoa chỉ riêng mẹ 🌷")
        expect(self.page.locator("#mini-preview-recipient")).to_contain_text("Mẹ yêu")
        expect(self.page.locator("#mini-preview-line")).to_contain_text("Một vườn hoa")
        before = self.page.locator("#design-summary").inner_text()
        self.page.locator('[data-preset="galaxy"]').click()
        expect(self.page.locator("#design-summary")).not_to_have_text(before)
        self.page.locator("#ornament-field").scroll_into_view_if_needed()
        bounds = mini.bounding_box()
        self.assertIsNotNone(bounds)
        self.assertGreaterEqual(bounds["y"], 0)
        self.assertLessEqual(bounds["y"] + bounds["height"], 844,
                             "The live sample should remain visible next to design controls")
        self.page.locator("#jump-to-preview").click()
        expect(self.page.locator("#preview-card")).to_be_focused()
        self.assert_layout("390px live preview")
        self.page.screenshot(path="/tmp/wow-mobile-designer.png", full_page=True)

    def test_03_new_design_fields_reach_the_live_preview_and_received_card(self):
        self.editor()
        self.open_design()
        self.page.locator("#scene-field").select_option("galaxy")
        self.page.locator('[data-structure-choice="arch"]').click()
        self.page.locator("#ornament-field").select_option("orbit")
        self.page.locator("#intensity-field").select_option("gentle")
        expected = {"scene": "galaxy", "structure": "arch", "ornament": "orbit", "intensity": "gentle"}
        for key, value in expected.items():
            expect(self.page.locator("#preview-card")).to_have_attribute("data-" + key, value)
        self.open_letter()
        for key, value in expected.items():
            expect(self.page.locator(".letter-paper")).to_have_attribute("data-" + key, value)
        expect(self.page.locator("#letter-screen.immersive-scene")).to_have_attribute("data-scene", "galaxy")
        garden = self.page.locator("#cosmic-garden")
        expect(garden).to_be_visible()
        self.assertEqual("none", garden.evaluate("el => getComputedStyle(el).pointerEvents"))

    def test_04_all_opening_scenes_are_keyboard_operable_and_have_a_skip(self):
        self.page.emulate_media(reduced_motion="no-preference")
        for scene in SCENES:
            with self.subTest(scene=scene):
                self.editor()
                self.choose_scene(scene)
                self.page.locator("#open-card-button").click()
                expect(self.page.locator(f"#{scene}-stage")).to_be_visible()
                for other in set(SCENES) - {scene}:
                    expect(self.page.locator(f"#{other}-stage")).not_to_be_visible()
                opener = self.page.locator(f"#open-{scene}")
                opener.focus()
                opener.press("Enter")
                expect(self.page.locator("#skip-animation")).to_be_visible()
                self.page.locator("#skip-animation").click()
                expect(self.page.locator("#letter-screen")).to_be_visible(timeout=3000)
                expect(self.page.locator("#letter-greeting")).not_to_have_text("")
                self.assertEqual(scene, self.page.locator(".letter-paper").get_attribute("data-scene"))
                if scene == "envelope":
                    expect(self.page.locator("#cosmic-garden")).not_to_be_visible()
                else:
                    expect(self.page.locator("#cosmic-garden")).to_be_visible()

    def test_05_open_gesture_starts_real_audio_and_does_not_autoplay_on_load(self):
        self.add_group_audio()
        self.editor()
        self.settle_library()
        self.assertTrue(self.page.locator("#background-music").evaluate("el => el.paused"))
        self.assertEqual([], self.page.evaluate("window.__musicPlayCalls"))
        self.page.locator("#open-card-button").click()
        self.assertTrue(self.page.locator("#background-music").evaluate("el => el.paused"))
        self.page.locator("#envelope-open-button").click()
        self.wait_playing("0nhacme.mp3")
        calls = self.page.evaluate("window.__musicPlayCalls")
        self.assertTrue(calls and calls[0]["active"], calls)
        self.assertEqual(1, self.page.locator("audio").count())

    def test_06_opening_during_music_discovery_recovers_when_files_arrive(self):
        self.add_group_audio()
        self.hold_audio = True
        self.editor()
        self.page.locator("#open-card-button").click()
        self.page.locator("#envelope-open-button").click()
        expect(self.page.locator("#letter-screen")).to_be_visible(timeout=3000)
        self.assertTrue(self.pending_audio, "The test must actually interrupt discovery")
        self.hold_audio = False
        for route in self.pending_audio:
            regression.UpgradeBrowserTests.route_audio(self, route)
        self.pending_audio.clear()
        self.wait_playing("0nhacme.mp3")

    def test_07_explicit_pause_survives_scene_replay(self):
        self.add_group_audio()
        self.editor()
        self.settle_library()
        self.open_letter()
        self.wait_playing()
        self.page.locator("#music-toggle").click()
        self.page.wait_for_function("document.querySelector('#background-music').paused")
        self.page.locator("#replay-card").click()
        self.open_letter()
        self.assertTrue(self.page.locator("#background-music").evaluate("el => el.paused"))
        self.page.locator("#music-toggle").click()
        self.wait_playing()

    def test_08_compact_link_is_lossless_and_much_shorter_for_vietnamese(self):
        self.page.goto(BASE_URL)
        for length in (360, 3000):
            with self.subTest(greeting_length=length):
                card = payload()
                card["design"]["body"] = (VIETNAMESE + "\n") * 60
                card["design"]["body"] = card["design"]["body"][:length]
                fragment = self.page.evaluate("card => CardLinks.encode(card)", card)
                self.assertTrue(fragment.startswith("#c="), fragment[:60])
                self.assertEqual(card, self.decode(fragment))
                legacy = "#card=" + quote(json.dumps(card, ensure_ascii=False, separators=(",", ":")), safe="")
                self.assertLess(len(fragment), len(legacy) * 0.5, (len(fragment), len(legacy)))

    def test_09_shared_compact_card_keeps_all_art_direction_text_and_music(self):
        self.clipboard()
        self.add_group_audio()
        self.editor()
        self.settle_library()
        self.page.locator("#track-list .track-select").nth(2).click()
        self.open_design()
        self.page.locator('[data-preset="galaxy"]').click()
        self.page.locator('[data-structure-choice="postcard"]').click()
        self.page.locator("#ornament-field").select_option("pressed")
        self.page.locator("#intensity-field").select_option("gentle")
        self.page.locator('[data-font-choice="sans"]').click()
        self.page.locator('[data-layout-choice="centered"]').click()
        self.page.locator("#effect-field").select_option("butterflies")
        self.page.locator("#card-dedication").fill("Vũ trụ nhỏ dành cho mẹ")
        self.page.locator("#custom-greeting").fill(VIETNAMESE)
        self.page.locator("#personal-message").fill("Con luôn ở đây.\nYêu mẹ ♥")
        self.open_letter()
        link = self.copy_link()
        self.assertTrue(urlparse(link).fragment.startswith("c="))
        canonical = self.decode("#" + urlparse(link).fragment)
        second = self.new_page()
        second.goto(link)
        expect(second.locator("#envelope-screen")).to_be_visible()
        expect(second.locator("#galaxy-stage")).to_be_visible()
        expect(second.locator("#track-list")).to_have_attribute("aria-busy", "false")
        self.assertTrue(second.locator("#background-music").evaluate("el => el.paused"))
        self.open_letter(second)
        expect(second.locator("#letter-greeting")).to_have_text(VIETNAMESE)
        expect(second.locator("#letter-message")).to_have_text("Con luôn ở đây.\nYêu mẹ ♥")
        for key in ("scene", "structure", "ornament", "intensity", "theme", "font", "layout", "decoration"):
            expect(second.locator(".letter-paper")).to_have_attribute("data-" + key, canonical["design"][key])
        expect(second.locator("#letter-track-select")).to_have_value("mom:2")
        second.wait_for_function("!document.querySelector('#background-music').paused")
        self.assertTrue(second.locator("#background-music").evaluate("el => el.currentSrc").endswith("/2nhacme.mp3"))
        expect(second.locator("#edit-card")).not_to_be_visible()

    def test_10_legacy_links_still_work_without_new_design_fields(self):
        for version in (1, 2):
            with self.subTest(version=version):
                card = payload(v=version)
                for key in ("scene", "structure", "ornament", "intensity"):
                    card["design"].pop(key)
                if version == 1:
                    card.pop("design")
                    card.pop("musicId")
                self.page.goto(BASE_URL + "#card=" + quote(json.dumps(card, ensure_ascii=False)))
                expect(self.page.locator("#envelope-screen")).to_be_visible()
                self.open_letter()
                expect(self.page.locator("#letter-message")).to_have_text(card["message"])
                expect(self.page.locator("#letter-recipient")).to_contain_text("Mẹ Ánh")

    def test_11_bad_compact_links_and_oversized_data_fail_safely(self):
        self.page.goto(BASE_URL)
        good = self.page.evaluate("card => CardLinks.encode(card)", payload())
        cases = ["#c=", "#c=%not-a-card", good[:-5], "#c=" + "A" * 150_000, COMPRESSED_BOMB]
        invalid = payload()
        invalid["design"]["scene"] = "<script>alert(1)</script>"
        cases.append(self.page.evaluate("card => CardLinks.encode(card)", invalid))
        for index, fragment in enumerate(cases):
            with self.subTest(case=index):
                self.page.goto(BASE_URL + fragment)
                expect(self.page.locator("#home-screen")).to_be_visible()
                expect(self.page.locator("#toast")).not_to_have_text("")
                expect(self.page.locator("#letter-screen")).not_to_be_visible()

    def test_12_clipboard_and_native_share_are_called_with_user_activation(self):
        self.context.add_init_script("""
            Object.defineProperty(navigator,'clipboard',{configurable:true,value:{
                writeText: text => {
                    window.__copyActivation = navigator.userActivation.isActive;
                    window.__copiedCardLink = text;
                    return Promise.resolve();
                }
            }});
            Object.defineProperty(navigator,'share',{configurable:true,value:data => {
                window.__shareActivation = navigator.userActivation.isActive;
                window.__sharedCard = data;
                return Promise.resolve();
            }});
        """)
        self.editor()
        self.open_letter()
        link = self.copy_link()
        self.assertTrue(self.page.evaluate("window.__copyActivation"))
        self.page.locator("#share-card").click()
        self.page.wait_for_function("Boolean(window.__sharedCard)")
        self.assertTrue(self.page.evaluate("window.__shareActivation"))
        self.assertEqual(link, self.page.evaluate("window.__sharedCard.url"))

    def test_13_long_cards_and_all_shapes_fit_phone_tablet_desktop_and_landscape(self):
        greeting = (VIETNAMESE.replace("🌷", "") + "\n" + "Thương" * 650)[:3000]
        message = (("Những ngày dịu dàng và thật nhiều niềm vui.\n") * 30)[:1000]
        for width, height in VIEWPORTS:
            with self.subTest(viewport=f"{width}x{height}"):
                self.page.set_viewport_size({"width": width, "height": height})
                self.editor()
                self.open_design()
                self.page.locator("#custom-greeting").fill(greeting)
                self.page.locator("#personal-message").fill(message)
                for shape in STRUCTURES:
                    self.page.locator(f'[data-structure-choice="{shape}"]').click()
                    expect(self.page.locator("#preview-greeting")).to_have_text(greeting)
                    self.assert_layout(f"{width}x{height} editor {shape}")
                    # A long preview must let readers reach the signature even when sticky.
                    signature = self.page.locator("#preview-sender")
                    signature.scroll_into_view_if_needed()
                    box = signature.bounding_box()
                    self.assertIsNotNone(box)
                    self.assertGreater(box["y"] + box["height"], 0)
                    self.assertLess(box["y"], height)
                    self.open_letter()
                    self.assert_layout(f"{width}x{height} received {shape}")
                    expect(self.page.locator("#letter-greeting")).to_have_text(greeting)
                    expect(self.page.locator("#letter-message")).to_have_text(message)
                    self.page.locator("#letter-sender").scroll_into_view_if_needed()
                    if width == 390 and shape == "postcard":
                        self.page.screenshot(path="/tmp/wow-mobile-long-card.png", full_page=True)
                    self.page.locator("#edit-card").click()
                    self.open_design()

    def test_14_reduced_motion_is_immediate_and_replay_does_not_accumulate_particles(self):
        self.editor()
        self.page.locator("#open-card-button").click()
        started = time.monotonic()
        self.page.locator("#envelope-open-button").click()
        expect(self.page.locator("#letter-screen")).to_be_visible(timeout=1500)
        self.assertLess(time.monotonic() - started, 1.5)
        for _ in range(3):
            self.page.locator("#replay-card").click()
            self.open_letter()
            self.assertEqual(0, self.page.locator("#petal-burst > *").count())
            self.assertEqual(1, self.page.locator("#cosmic-garden").count())

    def test_15_representative_bouquet_and_galaxy_layouts_capture_cleanly(self):
        for width, height, scene in ((1440, 900, "bouquet"), (390, 844, "galaxy")):
            self.page.set_viewport_size({"width": width, "height": height})
            self.editor()
            self.page.locator(f'[data-preset="{scene}"]').click()
            self.page.locator("#open-card-button").click()
            self.page.screenshot(path=f"/tmp/wow-{scene}-opening.png", full_page=True)
            self.open_letter()
            self.assert_layout(f"{scene} received")
            expect(self.page.locator("#cosmic-garden")).to_be_visible()
            self.page.screenshot(path=f"/tmp/wow-{scene}-received.png", full_page=True)


if __name__ == "__main__":
    unittest.main(verbosity=2)
