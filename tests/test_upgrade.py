"""Regression coverage for Vietnamese typography, custom cards and real music.

Run against the repository HTTP server:
    BASE_URL=http://127.0.0.1:8000/ python tests/test_upgrade.py

Audio fixtures are the repository's existing MP3s, served through HTTP routes;
application playback, card state, serialization and rendering remain unmodified.
"""

import json
import mimetypes
import os
from pathlib import Path
import re
import sys
import unittest
import unicodedata
from urllib.parse import quote, unquote, urlparse

from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parents[1]
BASE_URL = os.environ.get("BASE_URL", "http://127.0.0.1:8000/")
CHROMIUM = os.environ.get("CHROMIUM_PATH", "/usr/bin/chromium")
GROUPS = {
    "mom": "me", "grandma": "ba", "teacher": "co",
    "sister": "chi", "friend": "nu", "women": "nu",
}
VIEWPORTS = [(360, 800), (390, 844), (430, 932), (768, 1024),
             (1024, 768), (1366, 768), (1440, 900), (1920, 1080), (844, 390)]
VIETNAMESE = "Điều ước thật đẹp, dịu dàng, hạnh phúc và yêu thương. Ắ ằ ể ỗ ợ ự đ 🌷"


def finish_opening(page, timeout=7000):
    """Read after a new gift reaches its keepsake scene; old themes auto-open."""
    page.wait_for_function("""() => !document.querySelector('#letter-screen').hidden ||
        Boolean(document.querySelector('#theme-stage .gift-scene[data-phase="ready"]'))""",
        timeout=timeout)
    if not page.locator("#letter-screen").is_visible():
        page.locator("#envelope-open-button").click()
    expect(page.locator("#letter-screen")).to_be_visible(timeout=timeout)


class UpgradeBrowserTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(
            executable_path=CHROMIUM, headless=True, args=["--no-sandbox"])
        # Different real files verify selection changes the actual media source.
        cls.audio_bytes = {
            name: (ROOT / name).read_bytes()
            for name in ("music_under.mp3", "music_over.mp3", "nhac_me.mp3")
        }

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        self.context = self.browser.new_context(
            viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
        self.context.set_default_timeout(6000)
        self.errors = []
        self.available = {}
        self.audio_requests = []
        self.font_requests = []
        self.context.route(re.compile(r"\.mp3(?:\?.*)?$"), self.route_audio)
        self.context.on("request", lambda request: self.font_requests.append(request.url)
                        if request.resource_type == "font" else None)
        self.page = self.new_page()

    def tearDown(self):
        self.context.close()
        self.assertEqual([], self.errors, "Uncaught JavaScript error")

    def new_page(self):
        page = self.context.new_page()
        page.on("pageerror", lambda error: self.errors.append(str(error)))
        return page

    def route_audio(self, route):
        request = route.request
        path = unquote(urlparse(request.url).path)
        self.audio_requests.append((request.method, path, request.headers.get("range", "")))
        # Keys containing a slash allow checks that only the assets/ copy exists.
        filename = path.rsplit("/", 1)[-1]
        key = next((key for key in self.available if "/" in key and path.endswith("/" + key)), None)
        key = key if key is not None else filename
        source = self.available.get(key)
        if source is None:
            route.fulfill(status=404, content_type="text/plain", body="missing music")
            return
        body = self.audio_bytes[source]
        headers = {"Accept-Ranges": "bytes", "Cache-Control": "no-store"}
        if request.method == "HEAD":
            headers["Content-Length"] = str(len(body))
            route.fulfill(status=200, headers=headers, content_type="audio/mpeg", body=b"")
            return
        byte_range = re.fullmatch(r"bytes=(\d+)-(\d*)", request.headers.get("range", ""))
        if byte_range:
            start = int(byte_range.group(1))
            end = min(int(byte_range.group(2)) if byte_range.group(2) else len(body) - 1, len(body) - 1)
            if start >= len(body):
                route.fulfill(status=416, headers={"Content-Range": f"bytes */{len(body)}"})
                return
            headers["Content-Range"] = f"bytes {start}-{end}/{len(body)}"
            route.fulfill(status=206, headers=headers, content_type="audio/mpeg", body=body[start:end + 1])
            return
        route.fulfill(status=200, headers=headers, content_type="audio/mpeg", body=body)

    def add_group_audio(self, recipient="mom", assets=False):
        prefix = "assets/music/"
        source_names = list(self.audio_bytes)
        for index in range(3):
            self.available[f"{prefix}{index}{GROUPS[recipient]}.mp3"] = source_names[index]

    def editor(self, recipient="mom", url=BASE_URL):
        self.page.goto(url)
        expect(self.page.locator("#home-screen")).to_be_visible()
        ui_recipient = "women" if recipient == "friend" else recipient
        self.page.locator(f'button[data-recipient="{ui_recipient}"]').first.click()
        expect(self.page.locator("#editor-screen")).to_be_visible()
        if recipient == "friend":
            self.page.locator("#variant-field").select_option("friend")

    def settle_library(self):
        # All six slots must exist independently of actual file availability.
        expect(self.page.locator("#track-list .track-select")).to_have_count(6)
        expect(self.page.locator("#track-list")).to_have_attribute("aria-busy", "false")

    def open_design(self):
        panel = self.page.locator("#design-panel")
        if panel.get_attribute("open") is None:
            panel.locator("summary").click()

    def open_letter(self):
        self.page.locator("#open-card-button").click()
        expect(self.page.locator("#envelope-screen")).to_be_visible()
        self.page.locator("#envelope-open-button").click()
        finish_opening(self.page)

    def wait_playing(self, expected_filename=None):
        self.page.wait_for_function("""() => {
            const audio = document.querySelector('#background-music');
            return audio.readyState >= 2 && !audio.paused && !audio.ended;
        }""")
        if expected_filename:
            self.page.wait_for_function("filename => { const a=document.querySelector('#background-music'); return !a.paused && a.readyState>=2 && a.currentSrc.endsWith('/'+filename); }", arg=expected_filename)
            self.assertTrue(self.page.locator("#background-music").evaluate(
                "el => new URL(el.currentSrc).pathname").endswith("/" + expected_filename))

    def copy_link(self):
        self.page.locator("#copy-link").click()
        self.page.wait_for_function("Boolean(window.__copiedCardLink)")
        return self.page.evaluate("window.__copiedCardLink")

    def clipboard(self):
        self.context.add_init_script("""
            Object.defineProperty(navigator, 'clipboard', {configurable: true,
                value: {writeText: async text => { window.__copiedCardLink = text; }}});
        """)

    def assert_layout(self, label):
        result = self.page.evaluate("""() => ({width: document.documentElement.clientWidth,
            scroll: document.documentElement.scrollWidth,
            controls: [...document.querySelectorAll('button,input,textarea,select')]
                .filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden')
                .map(el => ({id: el.id || el.dataset.trackId || el.tagName,
                    left: el.getBoundingClientRect().left, right: el.getBoundingClientRect().right}))})""")
        self.assertLessEqual(result["scroll"], result["width"] + 1, label)
        for control in result["controls"]:
            self.assertGreaterEqual(control["left"], -1, f"{label}: {control}")
            self.assertLessEqual(control["right"], result["width"] + 1, f"{label}: {control}")

    def test_01_local_fonts_render_complete_vietnamese_and_literal_text(self):
        self.editor("grandma")
        self.open_design()
        text = VIETNAMESE + '\n<img src=x onerror="window.__injected=true">'
        self.page.locator("#custom-greeting").fill(text)
        expect(self.page.locator("#preview-greeting")).to_have_text(text)
        self.page.evaluate("document.fonts.ready")
        fonts = self.page.evaluate("[...document.fonts].map(font => ({family:font.family,status:font.status}))")
        self.assertTrue(any(font["status"] == "loaded" for font in fonts), fonts)
        self.assertTrue(self.font_requests, "Expected bundled fonts to be used")
        origin = urlparse(BASE_URL).netloc
        self.assertTrue(all(urlparse(url).netloc == origin for url in self.font_requests), self.font_requests)
        self.assertEqual(0, self.page.locator("#preview-greeting img").count())
        self.open_letter()
        expect(self.page.locator("#letter-greeting")).to_have_text(text)
        self.assertFalse(self.page.evaluate("Boolean(window.__injected)"))

    def test_02_real_existing_legacy_music_is_usable(self):
        self.available.update({name: name if name in self.audio_bytes else "music_under.mp3"
                               for name in ("nhac_me.mp3", "nhac_ba.mp3", "music_under.mp3", "music_over.mp3")})
        for group in ("mom", "grandma", "friend", "women"):
            with self.subTest(group=group):
                self.editor(group)
                self.settle_library()
                expect(self.page.locator("#music-toggle")).to_be_enabled()
                self.open_letter()
                if self.page.locator("#background-music").evaluate("el => el.paused"):
                    self.page.locator("#music-toggle").click()
                self.wait_playing()
                self.assertEqual(1, self.page.locator("audio").count())

    def test_03_each_group_has_three_real_selectable_tracks(self):
        for group in GROUPS:
            self.add_group_audio(group)
        for group, stem in GROUPS.items():
            with self.subTest(group=group):
                self.editor(group)
                self.settle_library()
                buttons = self.page.locator("#track-list .track-select")
                for index in range(3):
                    expect(buttons.nth(index)).to_be_enabled()
                    buttons.nth(index).click()
                    expect(buttons.nth(index)).to_have_attribute("aria-pressed", "true")
                self.open_letter()
                self.wait_playing(f"2{stem}.mp3")
                select = self.page.locator("#letter-track-select")
                options = select.locator("option:not([disabled])")
                self.assertGreaterEqual(options.count(), 3)
                select.select_option(options.nth(0).get_attribute("value"))
                self.wait_playing(f"0{stem}.mp3")

    def test_04_missing_tracks_are_named_disabled_and_do_not_fake_three_songs(self):
        self.available["nhac_me.mp3"] = "nhac_me.mp3"
        self.editor()
        self.settle_library()
        expect(self.page.locator("#track-list .track-select:enabled")).to_have_count(1)
        expect(self.page.locator("#track-list .track-select:disabled")).to_have_count(5)
        missing = self.page.locator("#music-missing-files")
        expect(missing).to_contain_text("1me.mp3")
        expect(missing).to_contain_text("2me.mp3")
        self.open_letter()
        self.wait_playing("nhac_me.mp3")
        expect(self.page.locator("#letter-track-select option:not([disabled])")).to_have_count(1)

    def test_05_all_music_missing_preserves_creation_and_recovers_after_files_arrive(self):
        self.editor("teacher")
        self.settle_library()
        expect(self.page.locator("#track-list .track-select:disabled")).to_have_count(6)
        expect(self.page.locator("#music-missing-files")).to_contain_text("co.mp3")
        self.open_letter()
        expect(self.page.locator("#letter-greeting")).not_to_have_text("")
        self.assertTrue(self.page.locator("#background-music").evaluate("el => el.paused"))
        self.add_group_audio("teacher")
        self.page.locator("#edit-card").click()
        self.page.locator("#rescan-music").click()
        self.settle_library()
        expect(self.page.locator("#track-list .track-select:enabled")).to_have_count(3)
        self.open_letter()
        self.wait_playing("0co.mp3")

    def test_06_assets_directory_music_is_discovered_and_played(self):
        self.add_group_audio("mom", assets=True)
        self.editor()
        self.settle_library()
        expect(self.page.locator("#track-list .track-select:enabled")).to_have_count(3)
        self.open_letter()
        self.wait_playing("0me.mp3")
        current = self.page.locator("#background-music").evaluate("el => new URL(el.currentSrc).pathname")
        self.assertIn("/assets/music/0me.mp3", current)

    def test_07_next_previous_and_rapid_track_switch_keep_latest_source(self):
        self.add_group_audio()
        self.editor()
        self.settle_library()
        self.open_letter()
        self.wait_playing("0me.mp3")
        self.page.locator("#next-track").click()
        self.wait_playing("1me.mp3")
        self.page.locator("#prev-track").click()
        self.wait_playing("0me.mp3")
        select = self.page.locator("#letter-track-select")
        values = select.locator("option:not([disabled])").evaluate_all("options => options.map(option => option.value)")
        # Dispatch browser change events rapidly to exercise real load/play promises.
        select.evaluate("""(el, values) => {
            for (const value of [values[1], values[0], values[1], values[2]]) {
                el.value = value; el.dispatchEvent(new Event('change', {bubbles:true}));
            }
        }""", values)
        self.wait_playing("2me.mp3")
        expect(self.page.locator("#music-toggle")).to_have_attribute("aria-pressed", "true")
        self.assertEqual(1, self.page.locator("audio").count())

    def test_08_user_pause_survives_replay_and_resumes_by_user_gesture(self):
        self.add_group_audio()
        self.editor()
        self.settle_library()
        self.open_letter()
        self.wait_playing()
        self.page.locator("#music-toggle").click()
        self.page.wait_for_function("document.querySelector('#background-music').paused")
        self.page.locator("#replay-card").click()
        self.page.locator("#envelope-open-button").click()
        expect(self.page.locator("#letter-screen")).to_be_visible()
        self.assertTrue(self.page.locator("#background-music").evaluate("el => el.paused"))
        expect(self.page.locator("#music-toggle")).to_have_attribute("aria-pressed", "false")
        self.page.locator("#music-toggle").click()
        self.wait_playing()

    def test_09_all_design_choices_update_preview_letter_and_reset(self):
        self.editor()
        self.open_design()
        preview = self.page.locator("#preview-card")
        for theme in ("rose", "sage", "midnight", "champagne"):
            self.page.locator(f'[data-theme-choice="{theme}"]').click()
            expect(preview).to_have_attribute("data-theme", theme)
        for font in ("serif", "sans"):
            self.page.locator(f'[data-font-choice="{font}"]').click()
            expect(preview).to_have_attribute("data-font", font)
        self.page.locator('[data-layout-choice="centered"]').click()
        self.page.locator("#decoration-field").select_option("stars")
        self.page.locator("#effect-field").select_option("butterflies")
        self.page.locator("#card-dedication").fill("Riêng tặng người tuyệt vời nhất 🌷")
        expect(preview).to_have_attribute("data-layout", "centered")
        expect(preview).to_have_attribute("data-decoration", "stars")
        expect(preview).to_contain_text("Riêng tặng người tuyệt vời nhất 🌷")
        self.open_letter()
        letter = self.page.locator("#letter-screen .paper")
        for attribute, value in (("theme", "champagne"), ("font", "sans"), ("layout", "centered"), ("decoration", "stars")):
            expect(letter).to_have_attribute("data-" + attribute, value)
        self.page.locator("#edit-card").click()
        self.open_design()
        self.page.locator("#reset-design").click()
        for attribute, value in (("theme", "champagne"), ("font", "serif"), ("layout", "classic"), ("decoration", "botanical")):
            expect(preview).to_have_attribute("data-" + attribute, value)

    def test_10_shared_v4_restores_design_custom_text_and_selected_music(self):
        self.clipboard()
        self.add_group_audio()
        self.editor()
        self.settle_library()
        self.page.locator("#track-list .track-select").nth(2).click()
        selected_id = self.page.locator('#track-list .track-select[aria-pressed="true"]').get_attribute("data-track-id")
        self.open_design()
        self.page.locator('[data-theme-choice="midnight"]').click()
        self.page.locator('[data-font-choice="sans"]').click()
        self.page.locator('[data-layout-choice="centered"]').click()
        self.page.locator("#decoration-field").select_option("stars")
        self.page.locator('[data-theme-preset="galaxy"]').click()
        self.page.locator('[data-font-choice="sans"]').click()
        self.page.locator('[data-layout-choice="centered"]').click()
        self.page.locator("#effect-field").select_option("constellation")
        self.page.locator("#card-dedication").fill("Chỉ riêng mẹ")
        self.page.locator("#custom-greeting").fill(VIETNAMESE)
        self.page.locator("#personal-message").fill("Một tấm thiệp có thiết kế riêng.\nYêu mẹ ♥")
        self.open_letter()
        link = self.copy_link()
        payload = self.page.evaluate("link => CardLinks.decode(new URL(link).hash)", link)
        self.assertEqual(4, payload["v"])
        second = self.new_page()
        second.goto(link)
        expect(second.locator("#envelope-screen")).to_be_visible()
        second.locator("#envelope-open-button").click()
        expect(second.locator("#letter-screen")).to_be_visible(timeout=4000)
        expect(second.locator("#letter-greeting")).to_have_text(VIETNAMESE)
        paper = second.locator("#letter-screen .paper")
        for attribute, value in (("theme", "midnight"), ("font", "sans"), ("layout", "centered"), ("decoration", "stars")):
            expect(paper).to_have_attribute("data-" + attribute, value)
        expect(paper).to_contain_text("Chỉ riêng mẹ")
        expect(second.locator("#letter-track-select")).to_have_value(selected_id)
        second.wait_for_function("!document.querySelector('#background-music').paused")
        self.assertTrue(second.locator("#background-music").evaluate("el => el.currentSrc").endswith("/2me.mp3"))
        # Received cards keep editing private; controls still reflect restored state.
        expect(second.locator("#edit-card")).not_to_be_visible()
        expect(second.locator("#effect-field")).to_have_value("constellation")

    def test_11_old_v1_links_still_open_with_default_design(self):
        payload = {"v": 1, "target": "grandma", "recipientName": "Ngoại", "senderName": "Bảo", "message": VIETNAMESE}
        self.page.goto(BASE_URL + "#card=" + quote(json.dumps(payload, ensure_ascii=False)))
        expect(self.page.locator("#envelope-screen")).to_be_visible()
        self.page.locator("#envelope-open-button").click()
        expect(self.page.locator("#letter-screen")).to_be_visible(timeout=4000)
        expect(self.page.locator("#letter-message")).to_have_text(VIETNAMESE)
        expect(self.page.locator("#letter-screen .paper")).to_have_attribute("data-theme", "rose")
        expect(self.page.locator("#letter-screen .paper")).to_have_attribute("data-font", "serif")

    def test_12_invalid_new_payloads_are_rejected_safely(self):
        self.clipboard()
        self.editor()
        self.open_letter()
        payload = self.page.evaluate("link => CardLinks.decode(new URL(link).hash)", self.copy_link())
        # Validate new data structurally using field names from the actual public format.
        self.assertIn("musicId", payload)
        self.assertIn("design", payload)
        invalid_payloads = [
            ("version", dict(payload, v=99)),
            ("music type", dict(payload, musicId={"unexpected": "mom:0"})),
            ("music group", dict(payload, musicId="grandma:0")),
            ("design type", dict(payload, design=[])),
            ("theme type", dict(payload, design=dict(payload["design"], theme=["rose"]))),
            ("effect choice", dict(payload, design=dict(payload["design"], effect="invalid-effect"))),
            ("body type", dict(payload, design=dict(payload["design"], body={"unexpected": "hello"}))),
            ("body length", dict(payload, design=dict(payload["design"], body="x" * 3001))),
        ]
        for label, invalid in invalid_payloads:
            with self.subTest(case=label):
                self.page.goto(BASE_URL + "#card=" + quote(json.dumps(invalid)))
                expect(self.page.locator("#home-screen")).to_be_visible()
                expect(self.page.locator("#toast")).not_to_have_text("")
                self.assertFalse(self.page.evaluate("Boolean(window.__injected)"))

    def test_13_long_custom_card_and_music_controls_fit_all_viewports(self):
        self.add_group_audio()
        greeting = (VIETNAMESE.replace("🌷", "") + "\n" + "Thương" * 600)[:3000]
        message = ("Một lời chúc thật nhiều niềm vui.\n" + "Mến" * 400)[:1000]
        for width, height in VIEWPORTS:
            with self.subTest(viewport=f"{width}x{height}"):
                self.page.set_viewport_size({"width": width, "height": height})
                self.editor()
                self.settle_library()
                self.open_design()
                self.page.locator("#custom-greeting").fill(greeting)
                self.page.locator("#personal-message").fill(message)
                self.assert_layout(f"{width}x{height} editor")
                self.open_letter()
                expect(self.page.locator("#letter-greeting")).to_have_text(greeting)
                expect(self.page.locator("#letter-message")).to_have_text(message)
                self.assert_layout(f"{width}x{height} letter")
                # Native pointer clicks also establish controls remain reachable.
                self.page.locator("#next-track").click()
                self.wait_playing("1me.mp3")
                self.page.locator("#prev-track").click()
                self.wait_playing("0me.mp3")
                self.page.locator("#edit-card").click()
                expect(self.page.locator("#custom-greeting")).to_have_value(greeting)

    def test_14_custom_greeting_limit_is_visible_and_literal(self):
        self.editor()
        self.open_design()
        field = self.page.locator("#custom-greeting")
        expect(field).to_have_attribute("maxlength", "3000")
        maximum = (VIETNAMESE.replace("🌷", "") * 100)[:3000]
        field.fill(maximum)
        field.press("End")
        field.press("X")
        expect(field).to_have_value(maximum)
        self.open_letter()
        expect(self.page.locator("#letter-greeting")).to_have_text(maximum)

    def test_15_preview_uses_one_player_and_selects_the_song_for_the_card(self):
        self.add_group_audio()
        self.editor()
        self.settle_library()
        preview = self.page.locator("#track-list [data-preview-track]").nth(1)
        preview.click()
        self.wait_playing("1me.mp3")
        selected = self.page.locator('#track-list .track-select[aria-pressed="true"]')
        expect(selected).to_have_attribute("data-track-id", preview.get_attribute("data-preview-track"))
        self.assertEqual(1, self.page.locator("audio").count())
        self.open_letter()
        self.wait_playing("1me.mp3")

    def test_16_decomposed_vietnamese_keeps_every_diacritic(self):
        self.editor("grandma")
        self.open_design()
        text = "Điều ước của Ngoại: mỗi ngày đều khỏe, yên vui và hạnh phúc."
        decomposed = unicodedata.normalize("NFD", text)
        self.page.locator("#custom-greeting").fill(decomposed)
        self.page.locator("#personal-message").fill(decomposed)
        self.page.locator("#recipient-name").fill(unicodedata.normalize("NFD", "Bà Ngoại"))
        for selector in ("#preview-greeting", "#preview-message"):
            self.assertEqual(text, unicodedata.normalize("NFC", self.page.locator(selector).inner_text()))
        self.open_letter()
        for selector in ("#letter-greeting", "#letter-message"):
            self.assertEqual(text, unicodedata.normalize("NFC", self.page.locator(selector).inner_text()))
        self.assertIn("Bà Ngoại", unicodedata.normalize("NFC", self.page.locator("#letter-recipient").inner_text()))

    def test_17_reduced_motion_and_replay_do_not_accumulate_effects(self):
        self.editor()
        self.open_design()
        self.page.locator("#effect-field").select_option("butterflies")
        self.open_letter()
        for _ in range(3):
            self.page.locator("#replay-card").click()
            self.page.locator("#envelope-open-button").click()
            expect(self.page.locator("#letter-screen")).to_be_visible(timeout=1500)
        # Accessibility preference must suppress transient particle effects.
        expect(self.page.locator("#petal-burst")).to_be_empty()
        self.page.emulate_media(reduced_motion="no-preference")
        self.page.locator("#replay-card").click()
        # Replay resets the page's scroll position. A real keyboard activation
        # avoids Playwright scrolling against the browser's new smooth scroll.
        self.page.locator("#envelope-open-button").focus()
        self.page.locator("#envelope-open-button").press("Enter")
        expect(self.page.locator("#skip-animation")).to_be_visible()
        self.page.locator("#skip-animation").click()
        expect(self.page.locator("#letter-screen")).to_be_visible(timeout=1500)
        self.page.locator("#theme-backdrop .tx-interact").click()
        particles = self.page.locator(".tx-touch-particle")
        self.assertGreater(particles.count(), 0, "The selected effect should render after opening")
        self.assertLessEqual(particles.count(), 14, "Effects must stay bounded during replay")
        expect(self.page.locator("#petal-burst")).to_be_empty(timeout=7500)

    def test_18_music_and_local_assets_work_under_github_pages_subpath(self):
        prefix = "/__upgrade_pages__/"
        parsed = urlparse(BASE_URL)
        url = f"{parsed.scheme}://{parsed.netloc}{prefix}"

        def serve_subpath(route):
            path = unquote(urlparse(route.request.url).path)
            if path.endswith(".mp3"):
                self.route_audio(route)
                return
            relative = path.removeprefix(prefix) or "index.html"
            local = (ROOT / relative).resolve()
            if not local.is_relative_to(ROOT) or not local.is_file():
                route.fulfill(status=404, body="missing test resource")
                return
            route.fulfill(path=str(local), content_type=mimetypes.guess_type(str(local))[0] or "application/octet-stream")

        self.context.route(url + "**", serve_subpath)
        self.add_group_audio("mom", assets=True)
        self.editor(url=url)
        self.settle_library()
        expect(self.page.locator("#track-list .track-select:enabled")).to_have_count(3)
        self.open_letter()
        self.wait_playing("0me.mp3")
        self.assertTrue(self.page.locator("#background-music").evaluate(
            "el => new URL(el.currentSrc).pathname").startswith(prefix + "assets/"))
        self.assertTrue(self.audio_requests)
        self.assertTrue(all(path.startswith(prefix) for _, path, _ in self.audio_requests), self.audio_requests)

    def test_19_pause_during_rescan_wins_over_previously_playing_state(self):
        self.add_group_audio()
        self.editor()
        self.settle_library()
        self.page.locator("#track-list [data-preview-track]").nth(0).click()
        self.wait_playing("0me.mp3")
        deferred = []
        hold = {"selected": True, "optional": True}

        def defer_selected_and_optional_probes(route):
            filename = urlparse(route.request.url).path.rsplit("/", 1)[-1]
            is_selected = filename == "0me.mp3"
            key = "selected" if is_selected else "optional"
            if route.request.method == "HEAD" and hold[key]:
                # Retain the actual HTTP route without answering yet; unrelated
                # discovery and real audio playback can continue in the browser.
                deferred.append((key, route))
            else:
                self.route_audio(route)

        self.context.route(re.compile(r"/(?:0|5)me\.mp3$"), defer_selected_and_optional_probes)
        try:
            self.page.locator("#rescan-music").click()
            expect(self.page.locator("#track-list")).to_have_attribute("aria-busy", "true")
            expect(self.page.locator("#music-status")).to_contain_text("Đang tìm")
            for _ in range(100):
                if any(key == "selected" for key, _ in deferred): break
                self.page.wait_for_timeout(20)
            self.assertTrue(any(key == "selected" for key, _ in deferred))
            hold["selected"] = False
            selected_routes = [route for key, route in deferred if key == "selected"]
            deferred[:] = [(key, route) for key, route in deferred if key != "selected"]
            for route in selected_routes:
                self.route_audio(route)
            self.page.wait_for_function("""() => {
                const audio = document.querySelector('#background-music');
                return audio.readyState >= 2 && audio.currentSrc.endsWith('/0me.mp3');
            }""")
            expect(self.page.locator("#track-list")).to_have_attribute("aria-busy", "true")
            self.page.locator("#music-toggle").click()
            self.wait_playing("0me.mp3")
            self.page.locator("#music-toggle").click()
            self.page.wait_for_function("document.querySelector('#background-music').paused")
            expect(self.page.locator("#music-toggle")).to_have_attribute("aria-pressed", "false")
            expect(self.page.locator("#track-list")).to_have_attribute("aria-busy", "true")
            self.assertTrue(any(key == "optional" for key, _ in deferred))
            hold["optional"] = False
            optional_routes = [route for key, route in deferred if key == "optional"]
            deferred[:] = [(key, route) for key, route in deferred if key != "optional"]
            for route in optional_routes:
                self.route_audio(route)
            self.settle_library()
            # Observe beyond scan completion so a late play() promise or media
            # event cannot silently reverse the last explicit pause.
            self.page.wait_for_timeout(250)
            self.assertTrue(self.page.locator("#background-music").evaluate("el => el.paused"))
            expect(self.page.locator("#music-toggle")).to_have_attribute("aria-pressed", "false")
            expect(self.page.locator("#header-music-toggle")).to_have_attribute("aria-pressed", "false")
        finally:
            hold["selected"] = hold["optional"] = False
            for _, route in deferred:
                route.abort()


if __name__ == "__main__":
    result = unittest.TextTestRunner(verbosity=2).run(
        unittest.defaultTestLoader.loadTestsFromTestCase(UpgradeBrowserTests))
    print(f"Upgrade browser checks: FAIL={len(result.failures)} ERROR={len(result.errors)} SKIP={len(result.skipped)}")
    sys.exit(0 if result.wasSuccessful() else 1)
