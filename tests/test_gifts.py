"""Browser acceptance checks for the ten complete gift-opening experiences.

    BASE_URL=http://127.0.0.1:8001/ python3 tests/test_gifts.py

Production artwork, lifecycle, card serialization and the single music player
run unchanged. HTTP audio fixtures use actual MP3 bytes from the repository;
only clipboard transport and explicit browser visibility are simulated.
"""

import json
import re
import sys
import time
import unittest
from urllib.parse import quote

from playwright.sync_api import expect

import test_upgrade as regression


BASE_URL = regression.BASE_URL
SCENES = ("umbrella", "storybook", "island", "ocean", "balloon", "lantern",
          "wishtree", "silk", "lightbridge", "musicbox", "glassgarden", "wisteria", "lotusmoon", "sunmail", "lavender", "heartgarden", "dandelion", "teacup", "seabottle", "starcrane", "motherhug", "grandmatea", "classroom", "sisterswing", "friendpicnic", "lovewaltz", "teacherbloom", "teachingbook", "chalkconstellation")
HOME_GROUPS = ("mom", "grandma", "teacher", "sister", "women", "lover")
MOODS = ("bright", "gentle", "romantic", "elegant", "fantasy")
VIEWPORTS = ((360, 800), (390, 844), (1440, 1000))


class GiftBrowserTests(unittest.TestCase):
    setUpClass = classmethod(regression.UpgradeBrowserTests.setUpClass.__func__)
    tearDownClass = classmethod(regression.UpgradeBrowserTests.tearDownClass.__func__)
    new_page = regression.UpgradeBrowserTests.new_page
    route_audio = regression.UpgradeBrowserTests.route_audio
    editor = regression.UpgradeBrowserTests.editor
    open_design = regression.UpgradeBrowserTests.open_design
    settle_library = regression.UpgradeBrowserTests.settle_library
    wait_playing = regression.UpgradeBrowserTests.wait_playing
    copy_link = regression.UpgradeBrowserTests.copy_link
    clipboard = regression.UpgradeBrowserTests.clipboard
    assert_layout = regression.UpgradeBrowserTests.assert_layout

    def setUp(self):
        regression.UpgradeBrowserTests.setUp(self)

    def tearDown(self):
        regression.UpgradeBrowserTests.tearDown(self)

    def choose(self, scene, page=None):
        page = page or self.page
        page.locator("#theme-filter").select_option("all")
        page.locator(f'#theme-gallery [data-theme-preset="{scene}"]').click()
        expect(page.locator("#preview-card")).to_have_attribute("data-experience", scene)

    def invitation(self, scene, page=None):
        page = page or self.page
        if page.locator("#editor-screen").is_visible():
            if page.locator("#preview-card").get_attribute("data-experience") != scene:
                self.choose(scene, page)
            page.locator("#open-card-button").click()
        expect(page.locator("#envelope-screen")).to_be_visible()
        stage = page.locator("#theme-stage .gift-scene")
        expect(stage).to_have_attribute("data-phase", "initial")
        return stage

    def ready(self, scene, page=None, keyboard=False):
        page = page or self.page
        stage = self.invitation(scene, page)
        button = page.locator("#envelope-open-button")
        if keyboard:
            button.focus()
            button.press("Enter")
        else:
            button.click()
        expect(stage).to_have_attribute("data-phase", "ready", timeout=9000)
        expect(page.locator("#envelope-screen")).to_be_visible()
        expect(page.locator("#letter-screen")).not_to_be_visible()
        return stage

    def read(self, page=None, keyboard=False):
        page = page or self.page
        button = page.locator("#envelope-open-button")
        if keyboard:
            button.focus()
            button.press("Space")
        else:
            button.click()
        expect(page.locator("#letter-screen")).to_be_visible(timeout=4000)

    def preview(self, scene):
        self.page.locator("#theme-filter").select_option("all")
        self.page.locator(f'[data-preview-theme="{scene}"]').click()
        dialog = self.page.locator("#gift-preview-dialog")
        expect(dialog).to_be_visible()
        expect(dialog.locator("#preview-scene-host .gift-scene")).to_have_count(1)
        return dialog

    def fill_gift_notes(self, notes):
        self.open_design()
        for index in range(5):
            field = self.page.locator(f"#flower-note-{index}")
            expect(field).to_have_attribute("maxlength", "160")
            field.fill(notes[index] if index < len(notes) else "")

    def test_01_exactly_six_recipient_groups_keep_relationship_variants(self):
        self.page.goto(BASE_URL)
        groups = self.page.locator("#home-screen .recipient-choice[data-recipient]")
        expect(groups).to_have_count(6)
        self.assertEqual(set(HOME_GROUPS), set(groups.evaluate_all(
            "els => els.map(el => el.dataset.recipient)")))
        self.page.locator('[data-recipient="sister"]').click()
        variants = self.page.locator("#variant-field option").evaluate_all("els => els.map(el=>el.value)")
        self.assertEqual({"older", "younger"}, set(variants))
        self.page.locator("#variant-field").select_option("younger")
        expect(self.page.locator("#recipient-pronoun")).to_have_value("em")
        self.page.locator("#back-to-recipients").click()
        self.page.locator('[data-recipient="women"]').click()
        variants = self.page.locator("#variant-field option").evaluate_all("els => els.map(el=>el.value)")
        self.assertEqual({"friend", "one", "group"}, set(variants))
        self.page.locator("#variant-field").select_option("friend")
        expect(self.page.locator("#recipient-pronoun")).to_have_value("bạn")
        expect(self.page.locator("#sender-name")).to_have_value("")

    def test_02_library_has_forty_one_real_previews_and_feeling_filters(self):
        self.editor()
        self.assertEqual(set(SCENES), set(self.page.evaluate("Object.keys(GiftScenes.catalog)")))
        self.assertEqual(41, self.page.evaluate("Object.keys(CardThemes.catalog).length"))
        buttons = self.page.locator("#theme-gallery [data-theme-preset]")
        expect(buttons).to_have_count(41)
        expect(self.page.locator("#theme-gallery [data-preview-theme]")).to_have_count(41)
        options = self.page.locator("#theme-filter option").evaluate_all("els => els.map(el=>el.value)")
        self.assertEqual({"all", "recipient", "for-mom", "for-grandma", "for-teacher", "for-sister", "for-women", "for-lover", *MOODS}, set(options))
        for mood in MOODS:
            with self.subTest(mood=mood):
                self.page.locator("#theme-filter").select_option(mood)
                count = self.page.locator("#theme-gallery [data-theme-preset]:visible").count()
                self.assertGreater(count, 0)
                self.assertLess(count, 41)
        self.page.locator("#theme-filter").select_option("all")
        expect(self.page.locator("#theme-gallery [data-theme-preset]:visible")).to_have_count(41)
        artworks = []
        for scene in SCENES:
            svg = self.page.locator(f'[data-theme-preset="{scene}"] svg').first
            expect(svg).to_have_count(1)
            self.assertGreater(svg.locator("path,circle,ellipse,rect,use,polygon").count(), 15,
                               f"{scene} needs actual layered artwork")
            # The complete viewBox, not a clipped emoji or CSS-only swatch,
            # must represent the real object used by the opening scene.
            self.assertIsNotNone(svg.get_attribute("viewBox"))
            artworks.append(svg.inner_html())
        self.assertEqual(29, len(set(artworks)))

    def test_03_all_twenty_nine_gifts_fit_mobile_and_desktop_and_hold_before_reading(self):
        for width, height in VIEWPORTS:
            self.page.set_viewport_size({"width": width, "height": height})
            for scene in SCENES:
                with self.subTest(viewport=width, scene=scene):
                    self.editor()
                    greeting = self.page.locator("#preview-greeting").inner_text()
                    stage = self.invitation(scene)
                    self.assert_layout(f"{width}px {scene} initial")
                    svg = stage.locator("svg").first
                    bounds = svg.bounding_box()
                    host = stage.bounding_box()
                    self.assertGreater(bounds["width"], 100)
                    self.assertGreater(bounds["height"], 100)
                    self.assertGreaterEqual(bounds["x"], host["x"] - 1)
                    self.assertLessEqual(bounds["x"] + bounds["width"], host["x"] + host["width"] + 1)
                    if width == 390:
                        self.page.locator("#envelope-open-button").focus()
                        self.page.locator("#envelope-open-button").press("Enter")
                    else:
                        self.page.locator("#envelope-open-button").click()
                    expect(stage).to_have_attribute("data-phase", "ready")
                    self.page.wait_for_timeout(160)
                    expect(stage).to_have_attribute("data-phase", "ready")
                    expect(self.page.locator("#letter-screen")).not_to_be_visible()
                    self.assert_layout(f"{width}px {scene} completed gift")
                    self.read(keyboard=width == 390)
                    expect(self.page.locator("#letter-greeting")).to_have_text(greeting)
                    self.assert_layout(f"{width}px {scene} letter")

    def test_04_each_scene_has_a_real_opening_phase_and_skip_keeps_the_gift(self):
        self.page.emulate_media(reduced_motion="no-preference")
        for scene in SCENES:
            with self.subTest(scene=scene):
                self.editor()
                stage = self.invitation(scene)
                initial = stage.locator("svg").first.inner_html()
                self.page.locator("#envelope-open-button").click()
                expect(stage).to_have_attribute("data-phase", "opening")
                expect(self.page.locator("#skip-animation")).to_be_visible()
                self.page.locator("#skip-animation").click()
                expect(stage).to_have_attribute("data-phase", "ready")
                self.page.wait_for_timeout(220)
                expect(stage).to_have_attribute("data-phase", "ready")
                expect(self.page.locator("#letter-screen")).not_to_be_visible()
                self.assertTrue(initial, "The initial scene cannot be an empty placeholder")
                self.read(keyboard=True)

    def test_05_full_animation_finishes_at_ready_without_reading_automatically(self):
        self.page.emulate_media(reduced_motion="no-preference")
        self.editor("lover")
        stage = self.invitation("silk")
        self.page.locator("#envelope-open-button").focus()
        self.page.locator("#envelope-open-button").press("Enter")
        expect(stage).to_have_attribute("data-phase", "opening")
        expect(stage).to_have_attribute("data-phase", "ready", timeout=9000)
        self.page.wait_for_timeout(400)
        expect(stage).to_have_attribute("data-phase", "ready")
        self.read(keyboard=True)
        self.page.locator("#replay-card").click()
        expect(stage).to_have_attribute("data-phase", "initial")
        self.page.locator("#envelope-open-button").click()
        self.page.locator("#skip-animation").click()
        expect(stage).to_have_attribute("data-phase", "ready")

    def test_06_preview_jump_play_and_close_use_real_scenes_without_selecting(self):
        self.editor()
        selected = self.page.locator("#preview-card").get_attribute("data-experience")
        baseline = self.page.evaluate("GiftScenes.activeCount()")
        for scene in SCENES:
            with self.subTest(scene=scene):
                dialog = self.preview(scene)
                stage = dialog.locator("#preview-scene-host .gift-scene")
                expect(stage).to_have_attribute("data-phase", "initial")
                self.assertLessEqual(self.page.evaluate("GiftScenes.activeCount()"), baseline + 1)
                for phase in ("ready", "reading", "initial"):
                    dialog.locator(f'[data-preview-jump="{phase}"]').click()
                    expect(stage).to_have_attribute("data-phase", phase)
                dialog.locator("#preview-play").click()
                expect(stage).to_have_attribute("data-phase", "ready", timeout=9000)
                expect(self.page.locator("#preview-card")).to_have_attribute("data-experience", selected)
                self.assertTrue(self.page.locator("#background-music").evaluate("el => el.paused"))
                dialog.locator("#preview-close").click()
                expect(dialog).not_to_be_visible()
                expect(self.page.locator("#preview-scene-host")).to_be_empty()
                self.assertEqual(baseline, self.page.evaluate("GiftScenes.activeCount()"))

    def test_07_preview_selection_is_explicit_and_escape_cleans_up(self):
        self.editor("lover")
        self.open_design()
        body = "Một lời riêng 🌷 " + '<img src=x onerror="window.__injected=true">'
        self.page.locator("#custom-greeting").fill(body)
        original = self.page.locator("#preview-card").get_attribute("data-experience")
        dialog = self.preview("storybook")
        dialog.locator('[data-preview-jump="reading"]').click()
        expect(dialog.locator("#gift-preview-body")).to_contain_text(body)
        expect(dialog.locator("#gift-preview-body img")).to_have_count(0)
        expect(self.page.locator("#preview-card")).to_have_attribute("data-experience", original)
        self.page.keyboard.press("Escape")
        expect(dialog).not_to_be_visible()
        expect(self.page.locator("#preview-scene-host")).to_be_empty()
        dialog = self.preview("island")
        dialog.locator("#preview-select").click()
        expect(dialog).not_to_be_visible()
        expect(self.page.locator("#preview-card")).to_have_attribute("data-experience", "island")
        expect(self.page.locator("#preview-greeting")).to_have_text(body)
        self.assertFalse(self.page.evaluate("Boolean(window.__injected)"))

    def test_08_preview_never_starts_a_second_player_or_interrupts_selected_audio(self):
        sources = list(self.audio_bytes)
        for index in range(6):
            self.available[f"assets/music/{index}me.mp3"] = sources[index % len(sources)]
        self.editor()
        self.settle_library()
        self.page.locator("#track-list [data-preview-track]").nth(4).click()
        self.wait_playing("4me.mp3")
        source = self.page.locator("#background-music").evaluate("el => el.currentSrc")
        dialog = self.preview("musicbox")
        dialog.locator("#preview-play").click()
        expect(dialog.locator("#preview-scene-host .gift-scene")).to_have_attribute("data-phase", "ready")
        self.assertEqual(1, self.page.locator("audio").count())
        self.assertEqual(source, self.page.locator("#background-music").evaluate("el => el.currentSrc"))
        dialog.locator("#preview-close").click()
        self.choose("musicbox")
        self.ready("musicbox", keyboard=True)
        self.wait_playing("4me.mp3")
        self.assertEqual(1, self.page.locator("audio").count())
        self.read()
        self.page.locator("#music-toggle").click()
        self.page.wait_for_function("document.querySelector('#background-music').paused")
        self.page.locator("#replay-card").click()
        self.ready("musicbox")
        self.assertTrue(self.page.locator("#background-music").evaluate("el => el.paused"))

    def test_09_five_optional_flower_notes_are_literal_and_not_invented(self):
        self.editor()
        self.choose("wishtree")
        notes = ["Mẹ luôn được yêu thương.", regression.VIETNAMESE,
                 '<img src=x onerror="window.__injected=true">', "Điều nhỏ thật vui.", "Con yêu mẹ."]
        self.fill_gift_notes(notes)
        self.ready("wishtree")
        buttons = self.page.locator("#theme-stage .gift-flower-note[data-note-index]")
        expect(buttons).to_have_count(5)
        for index, note in enumerate(notes):
            self.page.locator(f'#theme-stage .gift-flower-note[data-note-index="{index}"]').click()
            expect(self.page.locator("#theme-stage .gift-note-content")).to_have_text(note)
        expect(self.page.locator("#theme-stage .gift-note-content img")).to_have_count(0)
        self.assertFalse(self.page.evaluate("Boolean(window.__injected)"))
        self.read()
        self.page.locator("#edit-card").click()
        self.fill_gift_notes([])
        self.ready("wishtree")
        expect(self.page.locator("#theme-stage .gift-flower-note")).to_have_count(0)
        expect(self.page.locator("#theme-stage svg")).to_have_count(1)
        self.read()
        expect(self.page.locator("#letter-greeting")).not_to_have_text("")

    def test_10_intro_and_five_notes_enforce_real_input_limits(self):
        self.editor()
        self.choose("lantern")
        self.open_design()
        intro = self.page.locator("#gift-intro")
        expect(intro).to_have_attribute("maxlength", "160")
        maximum = "Ước một ngày dịu dàng " * 20
        maximum = maximum[:160]
        intro.fill(maximum)
        intro.press("End")
        intro.press("X")
        expect(intro).to_have_value(maximum)
        self.choose("wishtree")
        for index in range(5):
            field = self.page.locator(f"#flower-note-{index}")
            expect(field).to_have_attribute("maxlength", "160")
            field.fill(maximum)
            field.press("End")
            field.press("X")
            expect(field).to_have_value(maximum)
        self.assertEqual(5, self.page.locator('[id^="flower-note-"]').count())

    def test_11_new_scene_links_restore_intro_notes_text_pair_and_music(self):
        self.clipboard()
        sources = list(self.audio_bytes)
        for index in range(6):
            self.available[f"assets/music/{index}yeu.mp3"] = sources[index % len(sources)]
        self.editor("lover")
        self.settle_library()
        self.page.locator("#recipient-name").fill("Ngọc Ánh")
        self.page.locator("#sender-name").fill("Một người thương")
        self.page.locator("#sender-pronoun").fill("em")
        self.page.locator("#recipient-pronoun").fill("anh yêu")
        self.page.locator("#track-list .track-select").nth(5).click()
        self.open_design()
        self.page.locator("#custom-greeting").fill(regression.VIETNAMESE)
        self.choose("wishtree")
        self.page.locator("#gift-intro").fill("Một lời nhỏ gửi bằng thật nhiều yêu thương 🌷")
        notes = ["Một ngày sáng lên.", "Một lời thương riêng.", "Chúc anh vui.", "Có em ở đây.", "♥"]
        self.fill_gift_notes(notes)
        for scene in SCENES:
            with self.subTest(scene=scene):
                self.choose(scene)
                self.ready(scene)
                self.read()
                self.page.evaluate("delete window.__copiedCardLink")
                link = self.copy_link()
                payload = self.page.evaluate("url => CardLinks.decode(new URL(url).hash)", link)
                self.assertEqual(scene, payload["design"]["experience"])
                self.assertEqual("Một lời nhỏ gửi bằng thật nhiều yêu thương 🌷", payload["design"]["giftIntro"])
                self.assertEqual(notes, json.loads(payload["design"]["flowerNotes"]))
                second = self.new_page()
                try:
                    second.goto(link)
                    self.ready(scene, second)
                    self.read(second)
                    expect(second.locator("#letter-greeting")).to_have_text(regression.VIETNAMESE)
                    expect(second.locator("#letter-recipient")).to_contain_text("Ngọc Ánh")
                    expect(second.locator("#letter-sender")).to_have_text("Một người thương")
                    expect(second.locator("#sender-pronoun")).to_have_value("em")
                    expect(second.locator("#recipient-pronoun")).to_have_value("anh yêu")
                    expect(second.locator("#letter-track-select")).to_have_value("lover:5")
                    expect(second.locator("#gift-intro")).to_have_value(payload["design"]["giftIntro"])
                    for index, note in enumerate(notes):
                        expect(second.locator(f"#flower-note-{index}")).to_have_value(note)
                finally:
                    second.close()
                self.page.locator("#edit-card").click()

    def test_12_invalid_notes_payload_is_rejected_without_executing_markup(self):
        self.clipboard()
        self.editor()
        self.ready("wishtree")
        self.read()
        payload = self.page.evaluate("url => CardLinks.decode(new URL(url).hash)", self.copy_link())
        for label, changes in (
                ("intro length", {"giftIntro": "x" * 161}),
                ("intro type", {"giftIntro": {"html": "<script>bad()</script>"}}),
                ("six notes", {"flowerNotes": json.dumps(["n"] * 6)}),
                ("long note", {"flowerNotes": json.dumps(["x" * 161])}),
                ("note object", {"flowerNotes": json.dumps([{"html": "bad"}])}),
                ("bad JSON", {"flowerNotes": "not valid JSON"})):
            with self.subTest(case=label):
                invalid = dict(payload, design=dict(payload["design"], **changes))
                self.page.goto(BASE_URL + "#card=" + quote(json.dumps(invalid, ensure_ascii=False)))
                expect(self.page.locator("#home-screen")).to_be_visible()
                expect(self.page.locator("#toast")).not_to_have_text("")
                self.assertFalse(self.page.evaluate("Boolean(window.__injected)"))

    def test_13_freeze_visibility_and_preview_cleanup_bound_active_scenes(self):
        self.page.emulate_media(reduced_motion="no-preference")
        self.editor()
        stage = self.ready("island")
        freeze = self.page.locator("#gift-freeze")
        freeze.click()
        expect(freeze).to_have_attribute("aria-pressed", "true")
        expect(stage).to_have_class(re.compile(r"\bgift-held\b"))
        animation_states = stage.evaluate("el => el.getAnimations({subtree:true}).map(a=>a.playState)")
        self.assertTrue(all(state in ("paused", "finished", "idle") for state in animation_states), animation_states)
        freeze.click()
        expect(freeze).to_have_attribute("aria-pressed", "false")
        self.page.evaluate("""() => {
            Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});
            document.dispatchEvent(new Event('visibilitychange'));
        }""")
        expect(stage).to_have_attribute("data-paused", "true")
        self.page.evaluate("""() => {
            Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});
            document.dispatchEvent(new Event('visibilitychange'));
        }""")
        expect(stage).to_have_attribute("data-paused", "false")
        self.read()
        self.page.locator("#edit-card").click()
        for scene in ("umbrella", "ocean", "musicbox", "wishtree"):
            self.choose(scene)
            baseline = self.page.evaluate("GiftScenes.activeCount()")
            dialog = self.preview(scene)
            self.assertLessEqual(self.page.evaluate("GiftScenes.activeCount()"), baseline + 1)
            dialog.locator("#preview-play").click()
            dialog.locator("#preview-close").click()
            expect(self.page.locator("#preview-scene-host")).to_be_empty()
            self.assertEqual(baseline, self.page.evaluate("GiftScenes.activeCount()"))

    def test_14_reduced_motion_off_and_low_power_keep_the_completed_shape(self):
        self.context.add_init_script("""
            Object.defineProperty(navigator,'hardwareConcurrency',{configurable:true,get:()=>2});
            Object.defineProperty(navigator,'deviceMemory',{configurable:true,get:()=>2});
        """)
        for scene in ("umbrella", "storybook", "lightbridge", "musicbox"):
            with self.subTest(scene=scene):
                self.editor()
                start = time.monotonic()
                stage = self.ready(scene)
                self.assertLess(time.monotonic() - start, 3.5)
                self.assertTrue(stage.locator("svg path,svg use").count() > 10)
                self.assertTrue(stage.evaluate("el => [...el.getAnimations({subtree:true})].every(a=>a.playState!=='running')"))
                self.read()
        self.editor()
        self.choose("lightbridge")
        self.open_design()
        self.page.locator("#intensity-field").select_option("off")
        self.page.emulate_media(reduced_motion="no-preference")
        stage = self.ready("lightbridge")
        expect(stage).to_have_class(re.compile(r"\bgift-motion-off\b"))
        self.assertTrue(stage.evaluate("el => [...el.getAnimations({subtree:true})].every(a=>a.playState!=='running')"))

    def test_15_ocean_pointer_interaction_is_bounded_and_keyboard_accessible(self):
        self.page.emulate_media(reduced_motion="no-preference")
        self.editor()
        stage = self.ready("ocean")
        touch = stage.locator(".gift-touch-zone")
        expect(touch).to_have_count(1)
        self.assertEqual("BUTTON", touch.evaluate("el=>el.tagName"))
        for _ in range(8):
            touch.click()
        particles = stage.locator(".gift-ripple,.gift-particle")
        self.assertGreater(particles.count(), 0)
        self.assertLessEqual(particles.count(), 40)
        touch.focus()
        touch.press("Enter")
        self.assertLessEqual(particles.count(), 40)
        self.read()
        expect(self.page.locator("#letter-greeting")).not_to_have_text("")

    def test_16_three_new_scenes_have_complete_mobile_and_desktop_screenshots(self):
        for scene in ("umbrella", "storybook", "ocean"):
            with self.subTest(scene=scene):
                self.page.set_viewport_size({"width": 390, "height": 844})
                self.editor("lover" if scene == "ocean" else "mom")
                self.choose(scene)
                self.page.locator("#sender-name").fill("Một người thương")
                self.ready(scene)
                self.assert_layout(f"{scene} mobile ready")
                self.page.screenshot(path=f"/tmp/gift-{scene}-ready-mobile.png", full_page=True)
                self.read()
                self.assert_layout(f"{scene} mobile reading")
                self.page.screenshot(path=f"/tmp/gift-{scene}-reading-mobile.png", full_page=True)
                self.page.set_viewport_size({"width": 1440, "height": 1000})
                self.assert_layout(f"{scene} desktop reading")
                self.page.screenshot(path=f"/tmp/gift-{scene}-reading-desktop.png", full_page=True)

    def test_17_legacy_friend_links_still_read_without_a_seventh_home_group(self):
        old = {"v": 1, "target": "friend", "recipientName": "Ngọc",
               "senderName": "An", "pronoun": "mình", "sampleIndex": 0,
               "message": "Lời chúc từ một người bạn, gửi trước khi đổi sáu nhóm."}
        self.page.goto(BASE_URL + "#card=" + quote(json.dumps(old, ensure_ascii=False)))
        expect(self.page.locator("#envelope-screen")).to_be_visible()
        self.page.locator("#envelope-open-button").click()
        expect(self.page.locator("#letter-screen")).to_be_visible(timeout=4000)
        expect(self.page.locator("#letter-recipient")).to_contain_text("Ngọc")
        expect(self.page.locator("#letter-message")).to_have_text(old["message"])
        self.assertIn("bạn", self.page.locator("#letter-greeting").inner_text().lower())


if __name__ == "__main__":
    result = unittest.TextTestRunner(verbosity=2).run(
        unittest.defaultTestLoader.loadTestsFromTestCase(GiftBrowserTests))
    print(f"Gift browser checks: FAIL={len(result.failures)} ERROR={len(result.errors)} SKIP={len(result.skipped)}")
    sys.exit(0 if result.wasSuccessful() else 1)
