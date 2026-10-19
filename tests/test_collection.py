"""Acceptance checks for the recipient-aware, twenty-two-theme card collection.

    BASE_URL=http://127.0.0.1:8001/ python3 tests/test_collection.py

The browser uses actual MP3 bytes from the repository through HTTP routes.
Only the clipboard transport is replaced, so card state, serialization,
rendering, discovery and audio playback execute the production code.
"""

import json
import re
import time
import unittest
from urllib.parse import quote, urlparse

from playwright.sync_api import expect

import test_upgrade as regression


BASE_URL = regression.BASE_URL
VIETNAMESE = regression.VIETNAMESE
GROUPS = {
    "mom": "me", "grandma": "ba", "teacher": "co", "sister": "chi",
    "friend": "nu", "women": "nu", "lover": "yeu",
}
DEFAULT_PAIRS = {
    "mom": ("con", "mẹ"), "grandma": ("cháu", "bà"),
    "teacher": ("em", "cô"), "sister": ("em", "chị"),
    "friend": ("mình", "bạn"), "women": ("mình", "bạn"),
    "lover": ("anh", "em"),
}


class CollectionBrowserTests(unittest.TestCase):
    setUpClass = classmethod(regression.UpgradeBrowserTests.setUpClass.__func__)
    tearDownClass = classmethod(regression.UpgradeBrowserTests.tearDownClass.__func__)
    new_page = regression.UpgradeBrowserTests.new_page
    route_audio = regression.UpgradeBrowserTests.route_audio
    def editor(self, recipient='mom', url=regression.BASE_URL):
        regression.UpgradeBrowserTests.editor(self,recipient,url)
        # These tests compare every scene; recipient-first entry is covered separately.
        self.page.locator('#theme-filter').select_option('all')
    open_design = regression.UpgradeBrowserTests.open_design
    wait_playing = regression.UpgradeBrowserTests.wait_playing
    copy_link = regression.UpgradeBrowserTests.copy_link
    clipboard = regression.UpgradeBrowserTests.clipboard
    assert_layout = regression.UpgradeBrowserTests.assert_layout

    def setUp(self):
        regression.UpgradeBrowserTests.setUp(self)

    def tearDown(self):
        regression.UpgradeBrowserTests.tearDown(self)

    def add_group_audio(self, recipient="mom"):
        sources = tuple(self.audio_bytes)
        for index in range(6):
            self.available[f"assets/music/{index}{GROUPS[recipient]}.mp3"] = sources[index % len(sources)]

    def settle_library(self, page=None):
        page = page or self.page
        expect(page.locator("#track-list .track-select")).to_have_count(6)
        expect(page.locator("#track-list")).to_have_attribute("aria-busy", "false")

    def open_letter(self, page=None):
        page = page or self.page
        if page.locator("#editor-screen").is_visible():
            page.locator("#open-card-button").click()
        expect(page.locator("#envelope-screen")).to_be_visible()
        page.locator("#envelope-open-button").click()
        regression.finish_opening(page)

    def theme_buttons(self):
        return self.page.locator("#theme-gallery [data-theme-preset]")

    def choose_theme(self, label):
        button = self.theme_buttons().filter(has_text=label)
        expect(button).to_have_count(1)
        theme_id = button.get_attribute("data-theme-preset")
        button.click()
        return theme_id

    def choose_pair(self, sender, receiver):
        field = self.page.locator("#pair-field")
        choices = field.locator("option").evaluate_all(
            "els => els.map(el => ({value:el.value,label:el.textContent}))")
        pair = next((choice for choice in choices
                     if re.search(rf"^\s*{re.escape(sender)}\s*[–—-]\s*{re.escape(receiver)}\s*$",
                                  choice["label"], re.IGNORECASE)), None)
        self.assertIsNotNone(pair, choices)
        field.select_option(pair["value"])

    def test_01_sender_stays_empty_and_each_recipient_has_the_right_pair(self):
        for recipient, (sender, receiver) in DEFAULT_PAIRS.items():
            with self.subTest(recipient=recipient):
                self.editor(recipient)
                expect(self.page.locator("#sender-name")).to_have_value("")
                expect(self.page.locator("#sender-name")).to_have_attribute(
                    "placeholder", "Nhập tên hoặc biệt danh")
                expect(self.page.locator("#sender-pronoun")).to_have_value(sender)
                expect(self.page.locator("#recipient-pronoun")).to_have_value(receiver)
                expect(self.page.locator("#preview-sender").locator("..")).not_to_be_visible()
                self.open_letter()
                expect(self.page.locator("#letter-sender").locator("..")).not_to_be_visible()
                self.assertNotIn("Hồng Gia Bảo", self.page.locator("#letter-screen").inner_text())
                greeting = self.page.locator("#letter-greeting").inner_text().lower()
                self.assertIn(sender, greeting)
                self.assertIn(receiver, greeting)
                self.assertNotIn("{", greeting)

    def test_02_lovers_use_both_directions_and_custom_terms_consistently(self):
        self.editor("lover")
        for sender, receiver in (("anh", "em"), ("em", "anh"), ("mình", "cậu")):
            with self.subTest(pair=(sender, receiver)):
                self.choose_pair(sender, receiver)
                expect(self.page.locator("#sender-pronoun")).to_have_value(sender)
                expect(self.page.locator("#recipient-pronoun")).to_have_value(receiver)
                text = self.page.locator("#preview-greeting").inner_text().lower()
                self.assertIn(sender, text)
                self.assertIn(receiver, text)
                self.assertNotRegex(text, r"\banh chúc bạn\b|\bem chúc bạn\b")
                self.assertIn(receiver, self.page.locator("#preview-recipient").inner_text().lower())
        self.page.locator("#sender-pronoun").fill("anh")
        self.page.locator("#recipient-pronoun").fill("em yêu")
        expect(self.page.locator("#preview-greeting")).to_contain_text("em yêu")
        self.open_letter()
        expect(self.page.locator("#letter-greeting")).to_have_text(
            self.page.locator("#preview-greeting").inner_text())
        self.assertIn("em yêu", self.page.locator("#letter-recipient").inner_text().lower())

    def test_03_switching_recipient_keeps_custom_body_and_resets_the_pair(self):
        self.editor("mom")
        self.open_design()
        custom = "Một lời riêng do chính mình viết — xin giữ nguyên 🌷"
        self.page.locator("#custom-greeting").fill(custom)
        self.page.locator("#personal-message").fill("Lời nhắn phụ cũng cần được giữ.")
        self.page.locator("#back-to-recipients").click()
        self.page.locator('[data-recipient="lover"]').click()
        expect(self.page.locator("#preview-greeting")).to_have_text(custom)
        expect(self.page.locator("#sender-pronoun")).to_have_value("anh")
        expect(self.page.locator("#recipient-pronoun")).to_have_value("em")
        expect(self.page.locator("#preview-message")).to_have_text("Lời nhắn phụ cũng cần được giữ.")
        # Keeping an edited card must be explained so its old relationship is
        # not silently mistaken for the newly selected sample.
        self.assertRegex(self.page.locator("#editor-screen").inner_text(),
                         r"(?i)(giữ.*(nội dung|lời chúc)|nội dung.*(giữ|riêng))")
        self.open_design()
        self.page.locator("#use-template").click()
        expect(self.page.locator("#preview-greeting")).not_to_have_text(custom)
        self.assertNotIn("chúc bạn", self.page.locator("#preview-greeting").inner_text().lower())

    def test_04_all_forty_one_themes_have_recognizable_previews(self):
        self.editor()
        buttons = self.theme_buttons()
        expect(buttons).to_have_count(41)
        self.assertEqual(41, len(set(buttons.evaluate_all("els => els.map(el => el.dataset.themePreset)"))))
        previews = []
        appearances = []
        for index in range(41):
            button = buttons.nth(index)
            self.assertTrue(button.locator("svg,canvas,img").count(), button.inner_text())
            previews.append(button.locator("svg,canvas,img").first.evaluate("el => el.outerHTML"))
            button.click()
            appearances.append(self.page.locator("#preview-card").evaluate("""el => ({
                attributes:[...el.attributes].filter(a=>a.name.startsWith('data-')).map(a=>[a.name,a.value]),
                background:getComputedStyle(el).backgroundImage,
                radius:getComputedStyle(el).borderRadius
            })"""))
        self.assertEqual(41, len(set(previews)), "Each tile needs its own artwork")
        self.assertEqual(41, len({json.dumps(style, sort_keys=True) for style in appearances}))

    def test_05_visual_themes_preserve_custom_text_relationship_and_selected_music(self):
        self.add_group_audio("mom")
        self.editor("mom")
        self.settle_library()
        self.page.locator("#track-list .track-select").nth(5).click()
        self.open_design()
        custom = "Con gửi mẹ một ngày thật dịu dàng. " + VIETNAMESE
        self.page.locator("#custom-greeting").fill(custom)
        self.page.locator("#personal-message").fill("Yêu mẹ.")
        for index in range(41):
            self.theme_buttons().nth(index).click()
            expect(self.page.locator("#preview-greeting")).to_have_text(custom)
            expect(self.page.locator("#preview-message")).to_have_text("Yêu mẹ.")
            expect(self.page.locator("#sender-pronoun")).to_have_value("con")
            expect(self.page.locator("#recipient-pronoun")).to_have_value("mẹ")
            expect(self.page.locator("#track-list .track-select").nth(5)).to_have_attribute("aria-pressed", "true")
            self.assertTrue(self.page.locator("#background-music").evaluate("el => el.paused"))
        self.open_letter()
        self.wait_playing("5me.mp3")
        self.assertEqual(1, self.page.locator("audio").count())

    def test_06_each_music_group_offers_six_canonical_slots_without_cross_group_fetches(self):
        for group in GROUPS:
            self.add_group_audio(group)
        for group, stem in GROUPS.items():
            with self.subTest(group=group):
                self.audio_requests.clear()
                self.editor(group)
                self.settle_library()
                initial_gets = {path for method, path, _ in self.audio_requests if method == "GET"}
                self.assertTrue(initial_gets.issubset({f"/assets/music/0{stem}.mp3"}),
                                "Discovery should load metadata only for the selected song")
                for index in range(6):
                    button = self.page.locator("#track-list .track-select").nth(index)
                    expect(button).to_be_enabled()
                    button.click()
                    expect(button).to_have_attribute("aria-pressed", "true")
                paths = {path for method, path, _ in self.audio_requests if method == "HEAD"}
                canonical = {f"/assets/music/{index}{stem}.mp3" for index in range(6)}
                self.assertTrue(canonical.issubset(paths), (group, paths))
                # The editor's separate nhac.mp3 soundtrack may also be probed
                # here; every recipient-track probe must still belong to this
                # group's six canonical files.
                recipient_paths = {path for path in paths if "/assets/music/" in path
                                   and path != "/assets/music/nhac.mp3"}
                self.assertEqual(canonical, recipient_paths)
                self.assertTrue(self.page.locator("#background-music").evaluate("el => el.paused"),
                                "Selecting a song must not autoplay while editing")
                self.open_letter()
                self.wait_playing(f"5{stem}.mp3")

    def test_07_missing_music_is_visible_but_the_card_still_opens(self):
        self.editor("lover")
        self.settle_library()
        self.assertRegex(self.page.locator("#music-library").inner_text(), "Chưa có tệp nhạc")
        for index in range(6):
            expect(self.page.locator("#track-list .track-select").nth(index)).to_be_disabled()
        self.open_letter()
        expect(self.page.locator("#letter-greeting")).not_to_have_text("")
        self.assertTrue(self.page.locator("#background-music").evaluate("el => el.paused"))
        self.assertEqual(0, sum(method == "GET" for method, _, _ in self.audio_requests))

    def test_08_song_changes_never_stack_audio_and_explicit_pause_survives_replay(self):
        self.add_group_audio("lover")
        self.editor("lover")
        self.settle_library()
        self.open_letter()
        self.wait_playing("0yeu.mp3")
        for index in (1, 4, 5, 0):
            self.page.locator("#letter-track-select").select_option(f"lover:{index}")
            self.wait_playing(f"{index}yeu.mp3")
            self.assertEqual(1, self.page.locator("audio").count())
        self.page.locator("#music-toggle").click()
        self.page.wait_for_function("document.querySelector('#background-music').paused")
        self.page.locator("#replay-card").click()
        self.open_letter()
        self.assertTrue(self.page.locator("#background-music").evaluate("el => el.paused"))

    def test_09_shared_card_restores_frozen_text_secret_design_music_and_volume(self):
        self.clipboard()
        self.add_group_audio("lover")
        self.editor("lover")
        self.choose_pair("em", "anh")
        self.page.locator("#recipient-name").fill("Minh")
        self.page.locator("#sender-name").fill("An")
        self.page.locator("#personal-message").fill("Thêm một lời thương gửi anh.")
        self.choose_theme("Dải ngân hà tình yêu")
        self.settle_library()
        self.page.locator("#track-list .track-select").nth(4).click()
        self.open_design()
        greeting = VIETNAMESE + "\nEm gửi anh thật nhiều yêu thương."
        secret = "Một điều chỉ muốn nói với anh: cảm ơn vì đã ở đây."
        self.page.locator("#custom-greeting").fill(greeting)
        self.page.locator("#secret-message").fill(secret)
        self.page.locator('[data-font-choice="italic"]').click()
        self.page.locator('[data-structure-choice="folded"]').click()
        self.page.locator("#intensity-field").select_option("gentle")
        self.page.locator("#show-date").uncheck()
        self.page.locator("#show-signature").uncheck()
        self.page.locator("#editor-volume-control").fill("41")
        self.open_letter()
        before = self.page.locator(".letter-paper").evaluate(
            "el => Object.fromEntries([...el.attributes].filter(a=>a.name.startsWith('data-')).map(a=>[a.name,a.value]))")
        link = self.copy_link()
        card = self.page.evaluate("hash => CardLinks.decode(hash)", "#" + urlparse(link).fragment)
        self.assertEqual(4, card["v"])
        self.assertEqual(greeting, card["greeting"])
        second = self.new_page()
        second.goto(link)
        self.settle_library(second)
        self.assertTrue(second.locator("#background-music").evaluate("el => el.paused"))
        self.open_letter(second)
        expect(second.locator("#letter-greeting")).to_have_text(greeting)
        expect(second.locator("#letter-message")).to_have_text("Thêm một lời thương gửi anh.")
        after = second.locator(".letter-paper").evaluate(
            "el => Object.fromEntries([...el.attributes].filter(a=>a.name.startsWith('data-')).map(a=>[a.name,a.value]))")
        self.assertEqual(before, after)
        expect(second.locator("#letter-sender").locator("..")).not_to_be_visible()
        expect(second.locator(".letter-paper .paper-date")).not_to_be_visible()
        expect(second.locator("#secret-content")).not_to_be_visible()
        second.locator("#secret-reveal-button").click()
        expect(second.locator("#secret-content")).to_have_text(secret)
        expect(second.locator("#letter-track-select")).to_have_value("lover:4")
        self.assertAlmostEqual(0.41, second.locator("#background-music").evaluate("el => el.volume"), places=2)
        second.wait_for_function("!document.querySelector('#background-music').paused")
        self.assertTrue(second.locator("#background-music").evaluate("el => el.currentSrc").endswith("/4yeu.mp3"))

    def test_10_legacy_card_versions_remain_readable(self):
        for version in (1, 2):
            with self.subTest(version=version):
                card = {
                    "v": version, "target": "grandma", "variant": "", "recipientName": "Ngoại Ánh",
                    "senderName": "", "pronoun": "cháu", "sampleIndex": 1,
                    "message": "Những lời được gửi từ phiên bản cũ.",
                }
                if version == 2:
                    card.update({"musicId": "grandma:1", "design": {
                        "theme": "sage", "font": "sans", "layout": "classic", "decoration": "botanical",
                        "effect": "petals", "dedication": "", "body": "Lời chúc cũ phải được giữ nguyên.",
                        "scene": "bouquet", "structure": "letter", "ornament": "botanical", "intensity": "gentle",
                    }})
                self.page.goto(BASE_URL + "#card=" + quote(json.dumps(card, ensure_ascii=False)))
                self.open_letter()
                expect(self.page.locator("#letter-recipient")).to_contain_text("Ngoại Ánh")
                expect(self.page.locator("#letter-message")).to_have_text(card["message"])
                if version == 2:
                    expect(self.page.locator("#letter-greeting")).to_have_text(card["design"]["body"])

    def test_11_unicode_and_html_are_rendered_as_literal_text(self):
        self.editor("lover")
        self.open_design()
        text = VIETNAMESE + '\n<img src=x onerror="window.__injected=true">'
        self.page.locator("#custom-greeting").fill(text)
        self.page.locator("#secret-message").fill(text)
        expect(self.page.locator("#preview-greeting")).to_have_text(text)
        self.open_letter()
        expect(self.page.locator("#letter-greeting")).to_have_text(text)
        self.page.locator("#secret-reveal-button").click()
        expect(self.page.locator("#secret-content")).to_have_text(text)
        self.assertEqual(0, self.page.locator("#letter-greeting img, #secret-content img").count())
        self.assertFalse(self.page.evaluate("Boolean(window.__injected)"))

    def test_12_long_cards_fit_both_phone_widths_and_desktop_in_all_four_shapes(self):
        greeting = (VIETNAMESE + "\n" + "Thương" * 650)[:2999]  # 3,000 UTF-16 units including the emoji
        message = ("Những ngày dịu dàng và nhiều niềm vui.\n" * 30)[:1000]
        for width, height in ((360, 800), (390, 844), (1440, 900)):
            with self.subTest(viewport=(width, height)):
                self.page.set_viewport_size({"width": width, "height": height})
                self.editor("lover")
                self.page.locator("#sender-name").fill("Người gửi")
                self.open_design()
                self.page.locator("#custom-greeting").fill(greeting)
                self.page.locator("#personal-message").fill(message)
                for shape in ("letter", "arch", "postcard", "folded"):
                    with self.subTest(shape=shape):
                        self.page.locator(f'[data-structure-choice="{shape}"]').click()
                        self.assert_layout(f"{width}px editor {shape}")
                        self.open_letter()
                        expect(self.page.locator("#letter-greeting")).to_have_text(greeting)
                        expect(self.page.locator("#letter-message")).to_have_text(message)
                        self.assert_layout(f"{width}px received {shape}")
                        self.page.locator("#copy-link").scroll_into_view_if_needed()
                        bounds = self.page.locator("#copy-link").bounding_box()
                        self.assertGreaterEqual(bounds["y"], 0)
                        self.assertLessEqual(bounds["y"] + bounds["height"], height + 1)
                        self.page.locator("#edit-card").click()
                        self.open_design()

    def test_13_reduced_motion_and_disabled_effects_open_immediately_on_replay(self):
        self.editor("lover")
        self.choose_theme("Dải ngân hà tình yêu")
        self.open_design()
        self.page.locator("#intensity-field").select_option("off")
        self.page.emulate_media(reduced_motion="no-preference")
        self.page.locator("#open-card-button").click()
        for _ in range(3):
            start = time.monotonic()
            # Timing starts at the open gesture, after editor scroll/navigation.
            self.page.locator("#envelope-open-button").evaluate("el => el.click()")
            expect(self.page.locator("#letter-screen")).to_be_visible(timeout=1000)
            self.assertLess(time.monotonic() - start, 2)
            self.assertEqual(1, self.page.locator("audio").count())
            self.assertEqual(0, self.page.locator("#petal-burst > *").count())
            self.page.locator("#replay-card").click()
        self.page.emulate_media(reduced_motion="reduce")
        start = time.monotonic()
        self.open_letter()
        self.assertLess(time.monotonic() - start, 1.5)

    def test_14_three_requested_themes_have_distinct_opening_and_received_screenshots(self):
        cases = (("Vũ trụ ngân hà", "galaxy"), ("Khu vườn xanh", "garden"),
                 ("Dải ngân hà tình yêu", "lovegalaxy"))
        for label, filename in cases:
            with self.subTest(theme=filename):
                self.page.set_viewport_size({"width": 390, "height": 844})
                self.editor("lover" if filename == "lovegalaxy" else "mom")
                self.choose_theme(label)
                self.page.locator("#sender-name").fill("Một người thương")
                self.page.locator("#open-card-button").click()
                self.assert_layout(f"{filename} invitation")
                self.page.screenshot(path=f"/tmp/collection-{filename}-opening.png", full_page=True)
                self.open_letter()
                self.assert_layout(f"{filename} received")
                self.page.screenshot(path=f"/tmp/collection-{filename}-mobile.png", full_page=True)
                self.page.set_viewport_size({"width": 1440, "height": 1000})
                self.assert_layout(f"{filename} desktop")
                self.page.screenshot(path=f"/tmp/collection-{filename}-desktop.png", full_page=True)

    def test_15_listening_to_another_preview_replaces_the_actual_playing_song(self):
        self.add_group_audio("teacher")
        self.editor("teacher")
        self.settle_library()
        for index in (0, 2, 5):
            self.page.locator(f'[data-preview-track="teacher:{index}"]').click()
            self.wait_playing(f"{index}co.mp3")
            self.assertEqual(1, self.page.locator("audio").count())
            expect(self.page.locator(f'[data-track-id="teacher:{index}"]')).to_have_attribute("aria-pressed", "true")
        self.page.locator('[data-preview-track="teacher:5"]').click()
        self.page.wait_for_function("document.querySelector('#background-music').paused")
        self.assertTrue(self.page.locator("#background-music").evaluate("el => el.paused"))

    def test_16_a_blocked_audio_attempt_is_reported_without_blocking_the_card(self):
        self.add_group_audio("mom")
        self.context.add_init_script("""
            HTMLMediaElement.prototype.play = function () {
                return Promise.reject(new DOMException('Playback blocked in test', 'NotAllowedError'));
            };
        """)
        self.editor("mom")
        self.settle_library()
        self.open_letter()
        expect(self.page.locator("#music-status")).to_contain_text("Trình duyệt chưa cho phép phát nhạc")
        expect(self.page.locator("#music-toggle")).to_have_attribute("aria-pressed", "false")
        expect(self.page.locator("#letter-greeting")).not_to_have_text("")

    def test_17_generated_greeting_is_frozen_in_the_shared_payload(self):
        self.clipboard()
        self.editor("lover")
        self.choose_pair("em", "anh")
        self.page.locator("#tone-field").select_option("romantic")
        greeting = self.page.locator("#preview-greeting").inner_text()
        self.open_letter()
        link = self.copy_link()
        card = self.page.evaluate("hash => CardLinks.decode(hash)", "#" + urlparse(link).fragment)
        self.assertEqual(greeting, card["greeting"])
        self.assertEqual("em", card["pronoun"])
        self.assertEqual("anh", card["recipientPronoun"])
        self.assertEqual("romantic", card["tone"])
        self.assertEqual("", card["senderName"])
        second = self.new_page()
        second.goto(link)
        self.open_letter(second)
        expect(second.locator("#letter-greeting")).to_have_text(greeting)
        expect(second.locator("#letter-sender").locator("..")).not_to_be_visible()

    def test_18_all_fonts_and_detail_controls_survive_a_shared_link(self):
        self.clipboard()
        self.editor("lover")
        self.open_design()
        self.page.locator("#custom-greeting").fill(VIETNAMESE)
        for font in ("serif","sans","italic","handwriting"):
            self.page.locator(f'[data-font-choice="{font}"]').click()
            expect(self.page.locator("#preview-card")).to_have_attribute("data-font",font)
            expect(self.page.locator("#preview-greeting")).to_have_text(VIETNAMESE)
        self.page.evaluate("document.fonts.ready")
        self.assertTrue(self.page.evaluate("document.fonts.check('24px \"Dancing Script\"')"))
        self.page.locator("#size-field").select_option("large")
        self.page.locator("#reveal-field").select_option("slow")
        self.page.locator('[data-theme-choice="lilac"]').click()
        self.open_letter()
        link=self.copy_link()
        second=self.new_page();second.goto(link);self.open_letter(second)
        for key,value in (("font","handwriting"),("size","large"),("reveal","slow"),("theme","lilac")):
            expect(second.locator(".letter-paper")).to_have_attribute("data-"+key,value)
        expect(second.locator("#letter-greeting")).to_have_text(VIETNAMESE)

    def test_19_snapshot_does_not_depend_on_the_future_template_count(self):
        self.clipboard();self.editor("lover");self.open_letter()
        link=self.copy_link()
        card=self.page.evaluate("hash => CardLinks.decode(hash)","#"+urlparse(link).fragment)
        greeting=card["greeting"];card["sampleIndex"]=999
        fragment=self.page.evaluate("card => CardLinks.encode(card)",card)
        self.page.goto(BASE_URL+fragment);self.open_letter()
        expect(self.page.locator("#letter-greeting")).to_have_text(greeting)

    def test_20_returning_to_edit_pauses_and_next_open_restarts_unmuted_music(self):
        self.add_group_audio("lover");self.editor("lover");self.settle_library();self.open_letter()
        self.wait_playing("0yeu.mp3")
        self.page.locator("#edit-card").click()
        self.assertTrue(self.page.locator("audio").evaluate("el=>el.paused"))
        self.page.locator("#recipient-name").fill("Người thương")
        self.settle_library();self.open_letter();self.wait_playing("0yeu.mp3")


if __name__ == "__main__":
    unittest.main(verbosity=2)
