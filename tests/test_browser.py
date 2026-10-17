"""Browser acceptance checks for the static 20/10 card app.

Run with an HTTP server at BASE_URL (default http://127.0.0.1:8000):
    python tests/test_browser.py
Requires Python Playwright and Chromium; no application dependency is added.
"""

import os
from pathlib import Path
import sys
import time
import unittest
from urllib.parse import quote

from playwright.sync_api import Error as PlaywrightError, sync_playwright, expect


ROOT = Path(__file__).resolve().parents[1]
BASE_URL = os.environ.get("BASE_URL", "http://127.0.0.1:8000/")
CHROMIUM = os.environ.get("CHROMIUM_PATH", "/usr/bin/chromium")
VIEWPORTS = [
    (360, 800), (390, 844), (430, 932), (768, 1024),
    (1024, 768), (1366, 768), (1440, 900), (1920, 1080),
    (844, 390),
]


class CardBrowserTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(
            executable_path=CHROMIUM,
            headless=True,
            args=["--no-sandbox"],
        )

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        self.context = self.browser.new_context(
            viewport={"width": 1440, "height": 900},
            reduced_motion="reduce",
        )
        self.context.set_default_timeout(5000)
        self.js_errors = []
        self.page = self.new_page()
        # A missing optional soundtrack must never prevent creation/sharing.
        self.context.route("**/assets/music.mp3", lambda route: route.fulfill(status=404))

    def tearDown(self):
        self.context.close()
        self.assertEqual([], self.js_errors, "Uncaught browser JavaScript errors")

    def new_page(self):
        page = self.context.new_page()
        page.on("pageerror", lambda error: self.js_errors.append(str(error)))
        return page

    def visit(self):
        self.page.goto(BASE_URL)
        expect(self.page.locator("#home-screen")).to_be_visible()

    def editor(self, recipient="mom"):
        self.visit()
        self.page.locator("#start-button").click()
        ui_recipient = "women" if recipient == "friend" else recipient
        self.page.locator(f'button[data-recipient="{ui_recipient}"]').first.click()
        expect(self.page.locator("#editor-screen")).to_be_visible()
        # Keep these existing flow checks on their explicitly chosen classic
        # opening; the new bouquet-first arrival is covered independently.
        self.page.locator("#welcome-mode").select_option("none")
        self.page.locator("#arrival-style").select_option("classic")
        if recipient == "friend":
            self.page.locator("#variant-field").select_option("friend")

    def open_letter(self):
        self.page.locator("#open-card-button").click()
        expect(self.page.locator("#envelope-screen")).to_be_visible()
        self.page.locator("#envelope-open-button").click()
        self.page.wait_for_function("""() => !document.querySelector('#letter-screen').hidden ||
            Boolean(document.querySelector('#theme-stage .gift-scene[data-phase="ready"]'))""")
        if not self.page.locator("#letter-screen").is_visible():
            self.page.locator("#envelope-open-button").click()
        expect(self.page.locator("#letter-screen")).to_be_visible(timeout=3000)

    def mock_clipboard(self, failure=False):
        self.context.add_init_script("""
            Object.defineProperty(navigator, 'clipboard', {
                configurable: true,
                value: {writeText: async (value) => {
                    window.__clipboardAttempt = value;
                    %s
                }}
            });
        """ % (
            "throw new DOMException('Clipboard unavailable', 'NotAllowedError');"
            if failure else "window.__copiedText = value;"
        ))
        if failure:
            self.context.add_init_script("document.execCommand = () => false;")

    def serve_valid_audio(self):
        self.context.unroute("**/assets/music.mp3")
        self.context.route("**/0me.mp3", lambda route: route.fulfill(
            path=str(ROOT / "music_under.mp3"), content_type="audio/mpeg"))

    def assert_layout(self, label):
        dimensions = self.page.evaluate("""() => ({
            width: document.documentElement.clientWidth,
            scroll: document.documentElement.scrollWidth,
            controls: [...document.querySelectorAll('button,input,textarea,select')]
                .filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden')
                .map(el => ({id: el.id || el.dataset.recipient || el.tagName,
                    left: el.getBoundingClientRect().left,
                    right: el.getBoundingClientRect().right,
                    width: el.getBoundingClientRect().width}))
        })""")
        self.assertLessEqual(dimensions["scroll"], dimensions["width"] + 1, label)
        for control in dimensions["controls"]:
            self.assertGreater(control["width"], 0, f"{label}: {control}")
            self.assertGreaterEqual(control["left"], -1, f"{label}: {control}")
            self.assertLessEqual(control["right"], dimensions["width"] + 1,
                                 f"{label}: {control}")

    def test_00_home_starts_silent_and_start_reaches_recipients(self):
        self.visit()
        for screen in ("editor", "envelope", "letter"):
            expect(self.page.locator(f"#{screen}-screen")).not_to_be_visible()
        self.assertTrue(self.page.locator("#background-music").evaluate("el => el.paused"))
        self.page.locator("#start-button").click()
        self.page.wait_for_function("document.querySelector('#recipients').getBoundingClientRect().top < innerHeight")
        self.assertEqual(6, self.page.locator("button[data-recipient]").count())

    def test_01_all_recipients_variants_and_six_templates(self):
        for recipient in ("mom", "grandma", "teacher", "sister", "women", "lover"):
            with self.subTest(recipient=recipient):
                self.editor(recipient)
                variants = {"sister": ["older", "younger"], "women": ["friend", "one", "group"]}.get(recipient, [None])
                for variant in variants:
                    with self.subTest(variant=variant):
                        if variant:
                            self.page.locator("#variant-field").select_option(variant)
                        greetings = []
                        for _ in range(6):
                            greeting = self.page.locator("#preview-greeting").inner_text().strip()
                            self.assertTrue(greeting, f"Empty greeting for {recipient}/{variant}")
                            greetings.append(greeting)
                            self.page.locator("#next-greeting").click()
                        self.assertEqual(6, len(set(greetings)), f"Expected six distinct templates: {recipient}/{variant}")
                        self.assertEqual(greetings[0], self.page.locator("#preview-greeting").inner_text().strip())

    def test_02_text_is_literal_unicode_and_preserved(self):
        self.editor("friend")
        values = {
            "recipient-name": 'Hà <img src=x onerror="window.__injected=true"> 🌷',
            "sender-name": "Bảo & An <b>♥</b>",
            "sender-pronoun": "Tớ",
            "personal-message": "Chúc cậu luôn vui vẻ!\nTiếng Việt: ă â ê ô ơ ư đ ❤️\n<script>window.__injected=true</script>",
        }
        for field, value in values.items():
            self.page.locator(f"#{field}").fill(value)
        expect(self.page.locator("#preview-recipient")).to_contain_text(values["recipient-name"])
        expect(self.page.locator("#preview-message")).to_have_text(values["personal-message"])
        expect(self.page.locator("#preview-sender")).to_contain_text(values["sender-name"])
        self.assertEqual(0, self.page.locator("#preview-recipient img, #preview-message script, #preview-sender b").count())
        self.open_letter()
        expect(self.page.locator("#letter-recipient")).to_contain_text(values["recipient-name"])
        expect(self.page.locator("#letter-message")).to_have_text(values["personal-message"])
        expect(self.page.locator("#letter-sender")).to_contain_text(values["sender-name"])
        self.assertFalse(self.page.evaluate("Boolean(window.__injected)"))
        self.page.locator("#edit-card").click()
        for field, value in values.items():
            expect(self.page.locator(f"#{field}")).to_have_value(value)

    def test_03_message_limit_count_and_back_preservation(self):
        self.editor("sister")
        self.page.locator("#variant-field").select_option("younger")
        message = "Chúc em vui vẻ. " * 100
        message = message[:1000]
        self.page.locator("#personal-message").fill(message)
        self.page.locator("#personal-message").press("End")
        self.page.locator("#personal-message").press("X")
        expect(self.page.locator("#personal-message")).to_have_value(message)
        count = self.page.locator("#message-count").inner_text().replace(".", "")
        self.assertIn("1000", count)
        self.page.locator("#recipient-name").fill("Em gái yêu")
        self.page.locator("#back-to-recipients").click()
        expect(self.page.locator("#home-screen")).to_be_visible()
        self.page.locator('button[data-recipient="sister"]').click()
        expect(self.page.locator("#personal-message")).to_have_value(message)
        expect(self.page.locator("#recipient-name")).to_have_value("Em gái yêu")
        expect(self.page.locator("#variant-field")).to_have_value("younger")

    def test_03b_oversized_paste_preserves_message_and_warns(self):
        self.editor()
        original = "Lời nhắn đang soạn dở vẫn được giữ nguyên."
        field = self.page.locator("#personal-message")
        field.fill(original)
        was_cancelled = field.evaluate("""el => {
            el.focus();
            el.setSelectionRange(el.value.length, el.value.length);
            const clipboard = new DataTransfer();
            clipboard.setData('text/plain', 'x'.repeat(1100));
            const event = new ClipboardEvent('paste', {clipboardData:clipboard, bubbles:true, cancelable:true});
            el.dispatchEvent(event);
            return event.defaultPrevented;
        }""")
        self.assertTrue(was_cancelled, "An oversized paste must be rejected explicitly, not silently truncated")
        expect(field).to_have_value(original)
        expect(self.page.locator("#preview-message")).to_have_text(original)
        expect(self.page.locator("#toast")).to_contain_text("1.000")
        # A script/extension that bypasses maxlength still cannot submit an invalid card.
        field.evaluate("el => { el.value = 'x'.repeat(1100); }")
        self.page.locator("#open-card-button").click()
        expect(self.page.locator("#editor-screen")).to_be_visible()
        expect(self.page.locator("#message-error")).to_be_visible()
        expect(field).to_have_attribute("aria-invalid", "true")

    def test_04_preview_button_moves_focus_into_preview(self):
        self.editor()
        self.page.locator("#preview-button").click()
        self.assertTrue(self.page.evaluate("""() => {
            const el = document.activeElement;
            return el && (el.id.includes('preview') || Boolean(el.closest('[id*="preview"]')));
        }"""), "Preview action should move keyboard focus to the preview")

    def test_05_copy_and_fragment_round_trip(self):
        self.mock_clipboard()
        self.editor("women")
        self.page.locator("#variant-field").select_option("group")
        self.page.locator("#recipient-name").fill("Các chị em 🌸")
        self.page.locator("#sender-name").fill("Bảo")
        message = "Một lời chúc từ xa\nMãi tươi vui và hạnh phúc 💐"
        self.page.locator("#personal-message").fill(message)
        self.page.locator("#next-greeting").click()
        expected_greeting = self.page.locator("#preview-greeting").inner_text()
        self.open_letter()
        self.page.locator("#copy-link").click()
        self.page.wait_for_function("Boolean(window.__copiedText)")
        shared_url = self.page.evaluate("window.__copiedText")
        self.assertTrue(shared_url.startswith(BASE_URL.rstrip("/") + "/#"), shared_url)
        self.assertNotIn(message, shared_url)
        second = self.new_page()
        second.goto(shared_url)
        expect(second.locator("#envelope-screen")).to_be_visible()
        expect(second.locator("#envelope-title")).to_have_text("Bạn có một lời chúc 20/10")
        second.locator("#envelope-open-button").click()
        expect(second.locator("#letter-screen")).to_be_visible(timeout=3000)
        expect(second.locator("#letter-message")).to_have_text(message)
        expect(second.locator("#letter-recipient")).to_contain_text("Các chị em 🌸")
        expect(second.locator("#letter-sender")).to_contain_text("Bảo")
        expect(second.locator("#letter-greeting")).to_have_text(expected_greeting)

    def test_05b_received_card_skip_link_preserves_fragment(self):
        self.mock_clipboard()
        self.editor()
        self.page.locator("#personal-message").fill("Lời chúc đã được chia sẻ.")
        self.open_letter()
        self.page.locator("#copy-link").click()
        self.page.wait_for_function("Boolean(window.__copiedText)")
        link = self.page.evaluate("window.__copiedText")
        self.page.goto(link)
        expect(self.page.locator("#envelope-screen")).to_be_visible()
        skip = self.page.locator(".skip-link")
        skip.focus()
        skip.press("Enter")
        self.assertEqual(link, self.page.url)
        expect(self.page.locator("#main-content")).to_be_focused()
        expect(self.page.locator("#envelope-screen")).to_be_visible()
        self.page.locator("#envelope-open-button").click()
        expect(self.page.locator("#letter-screen")).to_be_visible(timeout=3000)
        expect(self.page.locator("#letter-message")).to_have_text("Lời chúc đã được chia sẻ.")

    def test_06_invalid_and_overlong_fragments_are_recoverable(self):
        invalid_fragments = [
            "#card=this-is-not-valid-card-data", "#card=" + "a" * 20000,
            "#unrecognized-card-format",
            *["#card=" + quote(data) for data in (
                '{"v":99}', '{"v":1,"target":"__proto__"}',
                '{"v":1,"target":"sister","variant":"invalid"}',
                '{"v":1,"sampleIndex":999}', '{"v":1,"message":["x"]}',
            )],
        ]
        for fragment in invalid_fragments:
            with self.subTest(fragment_length=len(fragment)):
                self.page.goto(BASE_URL + fragment)
                expect(self.page.locator("#home-screen")).to_be_visible()
                expect(self.page.locator("#toast")).not_to_have_text("")
                self.assertIn(self.page.locator("#toast").get_attribute("aria-live"), ("polite", "assertive"))
                self.page.locator('button[data-recipient="mom"]').click()
                expect(self.page.locator("#editor-screen")).to_be_visible()

    def test_07_clipboard_failure_exposes_manual_copy(self):
        self.mock_clipboard(failure=True)
        self.editor()
        self.open_letter()
        self.page.locator("#copy-link").click()
        expect(self.page.locator("#manual-copy-panel")).to_be_visible()
        field = self.page.locator("#share-link-field")
        self.assertTrue(field.input_value().startswith("http://"))
        self.assertIsNotNone(field.get_attribute("readonly"))

    def test_08_native_share_success_and_user_cancel(self):
        self.mock_clipboard()
        self.context.add_init_script("""
            Object.defineProperty(navigator, 'share', {configurable:true, value: async data => {
                window.__shareCalls = (window.__shareCalls || 0) + 1;
                window.__sharedData = data;
                if (window.__cancelShare) throw new DOMException('Cancelled', 'AbortError');
                if (window.__failShare) throw new Error('Share unavailable');
            }});
        """)
        self.editor("teacher")
        self.open_letter()
        self.page.locator("#share-card").click()
        self.page.wait_for_function("window.__shareCalls === 1")
        self.assertIn("#", self.page.evaluate("window.__sharedData.url"))
        self.page.evaluate("window.__cancelShare = true")
        self.page.locator("#share-card").click()
        self.page.wait_for_function("window.__shareCalls === 2")
        expect(self.page.locator("#letter-screen")).to_be_visible()
        expect(self.page.locator("#manual-copy-panel")).not_to_be_visible()
        self.assertFalse(self.page.evaluate("Boolean(window.__copiedText)"), "Cancelling native share must not copy silently")
        self.page.evaluate("window.__cancelShare = false; window.__failShare = true")
        self.page.locator("#share-card").click()
        self.page.wait_for_function("window.__shareCalls === 3 && Boolean(window.__copiedText)")

    def test_08b_unsupported_native_share_copies_link(self):
        self.mock_clipboard()
        self.context.add_init_script("Object.defineProperty(navigator, 'share', {configurable:true, value:undefined});")
        self.editor()
        self.open_letter()
        self.page.locator("#share-card").click()
        self.page.wait_for_function("Boolean(window.__copiedText)")
        self.assertIn("#", self.page.evaluate("window.__copiedText"))

    def test_09_file_url_never_copies_unusable_file_link(self):
        self.mock_clipboard()
        try:
            self.page.goto((ROOT / "index.html").as_uri())
        except PlaywrightError as error:
            if "ERR_BLOCKED_BY_ADMINISTRATOR" in str(error):
                self.skipTest("Managed Chromium policy blocks file:// navigation before app execution")
            raise
        self.page.locator('button[data-recipient="mom"]').click()
        self.page.locator("#welcome-mode").select_option("none")
        self.page.locator("#arrival-style").select_option("classic")
        self.open_letter()
        self.page.locator("#copy-link").click()
        expect(self.page.locator("#toast")).not_to_have_text("")
        copied = self.page.evaluate("window.__copiedText || ''")
        self.assertFalse(copied.startswith("file:"), copied)
        expect(self.page.locator("#letter-screen")).to_be_visible()

    def test_10_replay_and_create_another(self):
        self.editor("grandma")
        self.page.locator("#recipient-name").fill("Bà ngoại")
        self.page.locator("#personal-message").fill("Con luôn thương bà.")
        self.open_letter()
        greeting = self.page.locator("#letter-greeting").inner_text()
        self.page.locator("#replay-card").click()
        expect(self.page.locator("#envelope-screen")).to_be_visible()
        self.page.locator("#envelope-open-button").click()
        expect(self.page.locator("#letter-screen")).to_be_visible(timeout=3000)
        expect(self.page.locator("#letter-greeting")).to_have_text(greeting)
        expect(self.page.locator("#letter-message")).to_have_text("Con luôn thương bà.")
        self.page.locator("#create-another").click()
        expect(self.page.locator("#home-screen")).to_be_visible()
        self.page.locator('button[data-recipient="women"]').click()
        self.page.locator("#variant-field").select_option("friend")
        expect(self.page.locator("#personal-message")).to_have_value("")

    def test_11_skip_animation_and_reduced_motion(self):
        self.page.emulate_media(reduced_motion="no-preference")
        self.editor()
        self.page.locator("#open-card-button").click()
        self.page.locator("#envelope-open-button").click()
        expect(self.page.locator("#skip-animation")).to_be_visible()
        self.page.locator("#skip-animation").click()
        expect(self.page.locator("#letter-screen")).to_be_visible(timeout=1000)
        self.page.locator("#replay-card").click()
        self.page.emulate_media(reduced_motion="reduce")
        started = time.monotonic()
        self.page.locator("#envelope-open-button").click()
        expect(self.page.locator("#letter-screen")).to_be_visible(timeout=1000)
        self.assertLess(time.monotonic() - started, 1.5)

    def test_12_missing_music_keeps_complete_flow_usable(self):
        # All actual candidate paths must be absent; blocking the old single
        # default is insufficient now that legacy music is correctly restored.
        self.context.route("**/*.mp3", lambda route: route.fulfill(status=404))
        self.editor()
        expect(self.page.locator("#track-list")).to_have_attribute("aria-busy", "false")
        self.open_letter()
        expect(self.page.locator("#music-status")).to_contain_text("0me.mp3")
        expect(self.page.locator("#music-toggle")).to_be_enabled()
        expect(self.page.locator("#header-music-toggle")).to_be_enabled()
        expect(self.page.locator("#volume-control")).to_be_enabled()
        self.page.locator("#music-toggle").click()
        expect(self.page.locator("#track-list")).to_have_attribute("aria-busy", "false")
        self.assertTrue(self.page.locator("#background-music").evaluate("a=>a.paused"))
        self.page.locator("#edit-card").click()
        expect(self.page.locator("#editor-screen")).to_be_visible()

    def test_13_blocked_audio_is_handled(self):
        self.serve_valid_audio()
        self.context.add_init_script("""
            HTMLMediaElement.prototype.play = function () {
                return Promise.reject(new DOMException('Playback blocked', 'NotAllowedError'));
            };
        """)
        self.editor()
        self.open_letter()
        self.page.locator("#music-toggle").click()
        expect(self.page.locator("#music-status")).to_contain_text("Trình duyệt chưa cho phép phát nhạc")
        expect(self.page.locator("#letter-screen")).to_be_visible()

    def test_14_valid_audio_decodes_volume_and_mute(self):
        self.serve_valid_audio()
        self.editor()
        self.open_letter()
        self.page.wait_for_function("document.querySelector('#background-music').readyState >= 2")
        expect(self.page.locator("#volume-control")).to_have_value("30")
        playing = self.page.locator("#background-music").evaluate("el => !el.paused")
        if not playing:
            self.page.locator("#music-toggle").click()
        self.page.wait_for_function("!document.querySelector('#background-music').paused")
        self.assertAlmostEqual(0.3, self.page.locator("#background-music").evaluate("el => el.volume"), places=2)
        self.page.locator("#volume-control").evaluate("el => { el.value = '65'; }")
        self.page.locator("#volume-control").dispatch_event("input")
        self.assertAlmostEqual(0.65, self.page.locator("#background-music").evaluate("el => el.volume"), places=2)
        self.page.locator("#music-toggle").click()
        self.page.wait_for_function("document.querySelector('#background-music').paused || document.querySelector('#background-music').muted")
        self.page.locator("#header-music-toggle").click()
        self.page.wait_for_function("!document.querySelector('#background-music').paused && !document.querySelector('#background-music').muted")

    def test_14b_user_pause_persists_across_replay(self):
        self.serve_valid_audio()
        self.editor()
        self.open_letter()
        self.page.wait_for_function("!document.querySelector('#background-music').paused")
        self.page.locator("#music-toggle").click()
        self.page.wait_for_function("document.querySelector('#background-music').paused")
        self.page.locator("#replay-card").click()
        self.page.locator("#envelope-open-button").click()
        expect(self.page.locator("#letter-screen")).to_be_visible(timeout=3000)
        self.page.wait_for_timeout(250)
        self.assertTrue(self.page.locator("#background-music").evaluate("el => el.paused"))
        expect(self.page.locator("#music-toggle")).to_have_attribute("aria-pressed", "false")
        expect(self.page.locator("#header-music-toggle")).to_have_attribute("aria-pressed", "false")

    def test_14c_rapid_music_toggle_keeps_last_intent(self):
        self.serve_valid_audio()
        self.editor()
        self.open_letter()
        self.page.wait_for_function("!document.querySelector('#background-music').paused")
        # Establish a real user gesture before stressing promise/event races.
        self.page.locator("#music-toggle").click()
        self.page.wait_for_function("document.querySelector('#background-music').paused")
        self.page.evaluate("for (let i = 0; i < 21; i++) document.querySelector('#music-toggle').click()")
        self.page.wait_for_function("!document.querySelector('#background-music').paused")
        expect(self.page.locator("#music-toggle")).to_have_attribute("aria-pressed", "true")
        expect(self.page.locator("#header-music-toggle")).to_have_attribute("aria-pressed", "true")
        self.page.evaluate("for (let i = 0; i < 23; i++) document.querySelector('#header-music-toggle').click()")
        self.page.wait_for_function("document.querySelector('#background-music').paused")
        self.page.wait_for_timeout(250)
        self.assertTrue(self.page.locator("#background-music").evaluate("el => el.paused"))
        expect(self.page.locator("#music-toggle")).to_have_attribute("aria-pressed", "false")
        expect(self.page.locator("#header-music-toggle")).to_have_attribute("aria-pressed", "false")

    def test_15_responsive_flow_at_required_viewports(self):
        long_word = "Thương" * 100
        message = ("Một lời chúc 20/10 thật nhiều niềm vui.\n" + long_word)[:1000]
        for width, height in VIEWPORTS:
            with self.subTest(viewport=f"{width}x{height}"):
                self.page.set_viewport_size({"width": width, "height": height})
                self.visit()
                self.assert_layout(f"{width}x{height} home")
                self.page.locator('button[data-recipient="women"]').click()
                self.page.locator("#welcome-mode").select_option("none")
                self.page.locator("#arrival-style").select_option("classic")
                self.page.locator("#variant-field").select_option("friend")
                self.page.locator("#personal-message").fill(message)
                self.assert_layout(f"{width}x{height} editor")
                self.page.locator("#open-card-button").click()
                self.assert_layout(f"{width}x{height} envelope")
                self.page.locator("#envelope-open-button").click()
                expect(self.page.locator("#letter-screen")).to_be_visible(timeout=3000)
                self.assert_layout(f"{width}x{height} letter")
                self.page.locator("#edit-card").click()
                expect(self.page.locator("#personal-message")).to_have_value(message)


class AcceptanceResult(unittest.TextTestResult):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.passed = 0

    def addSuccess(self, test):
        self.passed += 1
        super().addSuccess(test)


if __name__ == "__main__":
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(CardBrowserTests)
    result = unittest.TextTestRunner(verbosity=2, resultclass=AcceptanceResult).run(suite)
    print(f"Browser acceptance: PASS={result.passed} FAIL={len(result.failures)} ERROR={len(result.errors)} SKIP={len(result.skipped)}")
    sys.exit(0 if result.wasSuccessful() else 1)
