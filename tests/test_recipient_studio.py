"""Group music, recipient suggestions, illustrated gifts and the corner helper."""
import re
import unittest
from playwright.sync_api import expect
import test_bebe as bbtests

NEW={'mom':'motherhug','grandma':'grandmatea','teacher':'teacherbloom','sister':'sisterswing','women':'friendpicnic','lover':'lovewaltz'}
STEMS={'mom':'me','grandma':'ba','teacher':'co','sister':'chi','women':'nu','lover':'yeu'}
class RecipientStudioTests(unittest.TestCase):
    setUpClass=classmethod(bbtests.BebeBrowserTests.setUpClass.__func__)
    tearDownClass=classmethod(bbtests.BebeBrowserTests.tearDownClass.__func__)
    setUp=bbtests.BebeBrowserTests.setUp
    tearDown=bbtests.BebeBrowserTests.tearDown
    new_page=bbtests.BebeBrowserTests.new_page
    route_audio=bbtests.BebeBrowserTests.route_audio
    add_group_audio=bbtests.BebeBrowserTests.add_group_audio
    editor=bbtests.BebeBrowserTests.editor
    welcome=bbtests.BebeBrowserTests.welcome
    receive=bbtests.BebeBrowserTests.receive
    open_design=bbtests.BebeBrowserTests.open_design
    settle_library=bbtests.BebeBrowserTests.settle_library
    wait_playing=bbtests.BebeBrowserTests.wait_playing
    assert_layout=bbtests.BebeBrowserTests.assert_layout
    clipboard=bbtests.BebeBrowserTests.clipboard
    copy_link=bbtests.BebeBrowserTests.copy_link

    def studio_playing(self):
        self.page.wait_for_function('CardMusic.studioState().playing && !CardMusic.studioState().pending')
        return self.page.evaluate('CardMusic.studioState()')

    def test_01_studio_uses_only_available_songs_in_each_group_after_explicit_play(self):
        for target,stem in STEMS.items():
            self.add_group_audio(target);self.editor(target);self.settle_library()
            self.assertTrue(self.page.locator('#background-music').evaluate('a=>a.paused'))
            selected=self.page.evaluate('CardMusic.currentId()');self.page.locator('#studio-music-toggle').click();state=self.studio_playing()
            self.assertRegex(state['file'],rf'assets/music/[0-5]{stem}\.mp3$');self.assertEqual(target,state['group'])
            self.assertEqual(selected,self.page.evaluate('CardMusic.currentId()'))
            self.assertEqual(1,self.page.locator('audio').count());self.assertFalse(self.page.locator('#background-music').evaluate('a=>a.loop'))
            self.page.locator('#studio-music-toggle').click();self.assertTrue(self.page.locator('#background-music').evaluate('a=>a.paused'))
        self.assertFalse(any('nhac.mp3' in path for _,path,_ in self.audio_requests))

    def test_02_shuffle_is_random_without_immediate_repeat_or_changing_the_card_selection(self):
        self.add_group_audio('mom');self.editor();self.settle_library();self.page.evaluate('Math.random=()=>0')
        self.page.locator('[data-track-id="mom:2"]').click()
        self.page.locator('#studio-music-toggle').click();a=self.studio_playing()['file']
        self.page.evaluate('Math.random=()=>.999');self.page.locator('#studio-music-shuffle').click();b=self.studio_playing()['file']
        self.assertNotEqual(a,b);self.assertTrue(b.endswith('5me.mp3'))
        self.page.locator('#studio-music-shuffle').click();c=self.studio_playing()['file'];self.assertNotEqual(b,c)
        self.assertEqual('mom:2',self.page.evaluate('CardMusic.currentId()'))
        self.page.locator('#studio-music-toggle').click();self.page.locator('#studio-music-toggle').click();d=self.studio_playing()['file'];self.assertNotEqual(c,d)

    def test_03_no_group_music_never_uses_nhac_or_an_unrelated_group(self):
        self.available['nhac.mp3']='music_under.mp3';self.available['assets/music/0ba.mp3']='music_under.mp3'
        self.editor('teacher');self.settle_library();self.page.locator('#studio-music-toggle').click()
        expect(self.page.locator('#studio-music-status')).to_contain_text('0co.mp3')
        self.assertTrue(self.page.locator('#background-music').evaluate('a=>a.paused'))
        self.assertFalse(any('nhac.mp3' in path or re.search(r'/[0-5]ba\.mp3$',path) for _,path,_ in self.audio_requests))

    def test_04_pause_during_a_slow_scan_does_not_play_later_or_leak_to_another_group(self):
        self.add_group_audio('mom');self.add_group_audio('grandma')
        self.context.add_init_script("""const realFetch=window.fetch.bind(window);window.fetch=(url,opts)=>opts?.method==='HEAD'?new Promise(resolve=>setTimeout(()=>resolve(realFetch(url,opts)),400)):realFetch(url,opts);""")
        self.editor();self.page.locator('#studio-music-toggle').click();self.page.locator('#studio-music-toggle').click()
        self.settle_library();self.page.wait_for_timeout(450)
        self.assertFalse(self.page.evaluate('CardMusic.studioState().playing'));self.assertTrue(self.page.locator('#background-music').evaluate('a=>a.paused'))
        self.page.locator('#back-to-recipients').click();self.page.locator('[data-recipient="grandma"]').first.click();self.settle_library()
        self.page.locator('#studio-music-toggle').click();state=self.studio_playing();self.assertRegex(state['file'],r'/[0-5]ba\.mp3$')

    def test_05_each_group_has_its_own_suggestions_and_filtering_does_not_rewrite_a_card(self):
        union=set()
        for target,scene in NEW.items():
            self.editor(target);expect(self.page.locator('[data-theme-preset]').first).to_have_attribute('data-theme-preset',scene)
            self.page.locator('#theme-filter').select_option('recipient')
            ids=self.page.locator('.theme-entry:not([hidden])').evaluate_all('els=>els.map(e=>e.dataset.entryId)')
            self.assertIn(scene,ids);self.assertGreater(len(ids),5);self.assertLess(len(ids),41);union.update(ids)
        self.assertEqual(41,len(union))
        self.editor('mom');self.page.locator('#sender-name').fill('An');self.page.locator('#personal-message').fill('Mẹ giữ thật nhiều niềm vui nhé.')
        greeting=self.page.locator('#preview-greeting').inner_text();selected=self.page.evaluate('CardMusic.currentId()')
        self.page.locator('#theme-filter').select_option('for-grandma');expect(self.page.locator('[data-theme-preset]:visible').first).to_have_attribute('data-theme-preset','grandmatea')
        expect(self.page.locator('#preview-greeting')).to_have_text(greeting);expect(self.page.locator('#personal-message')).to_have_value('Mẹ giữ thật nhiều niềm vui nhé.')
        self.assertEqual(selected,self.page.evaluate('CardMusic.currentId()'));self.page.locator('#theme-filter').select_option('all');expect(self.page.locator('[data-theme-preset]:visible')).to_have_count(41)

    def test_06_new_stories_really_open_and_keep_motion_words_and_selected_song(self):
        for target,scene in NEW.items():
            with self.subTest(scene=scene):
                self.page.emulate_media(reduced_motion='reduce');self.add_group_audio(target);self.editor(target);self.settle_library()
                self.page.locator(f'[data-theme-preset="{scene}"]').click();greeting=self.page.locator('#preview-greeting').inner_text()
                self.page.locator('#studio-music-toggle').click();self.studio_playing();self.welcome()
                self.page.emulate_media(reduced_motion='no-preference');self.page.locator('.ba-flower-touch').click()
                stage=self.page.locator('#theme-stage .gift-scene');expect(stage).to_have_attribute('data-gift',scene)
                expect(stage).to_have_attribute('data-phase','opening',timeout=4000)
                self.assertGreater(stage.evaluate("e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"),0)
                foreground={'teacherbloom':'.gg-tree','motherhug':'.gf-mother','grandmatea':'.gf-tea-family','classroom':'.gf-chalk-flower','sisterswing':'.gf-reveal','friendpicnic':'.gf-friends','lovewaltz':'.gf-heart'}[scene]
                self.assertTrue(stage.locator(foreground).first.evaluate("e=>e.getAnimations().some(a=>a.playState==='running')"),scene)
                expect(self.page.locator('#letter-screen')).to_be_visible(timeout=6000);expect(self.page.locator('#letter-greeting')).to_have_text(greeting)
                expect(self.page.locator('#theme-backdrop .gift-scene')).to_have_attribute('data-gift',scene)
                self.assertGreater(self.page.locator('#theme-backdrop').evaluate("e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"),0)
                self.wait_playing(f'0{STEMS[target]}.mp3');self.assertTrue(self.page.locator('#background-music').evaluate('a=>a.loop'));self.assertEqual(1,self.page.locator('audio').count())
                expect(self.page.locator('#studio-helper')).not_to_be_visible()

    def test_07_new_story_links_restore_in_separate_browser_storage(self):
        self.clipboard();self.add_group_audio('teacher');self.editor('teacher');self.settle_library()
        self.page.locator('[data-theme-preset="classroom"]').click();self.page.locator('#signature-text').fill('Học trò của cô · Minh')
        self.welcome();self.receive();text=self.page.locator('#letter-greeting').inner_text();url=self.copy_link()
        context=self.browser.new_context(viewport={'width':390,'height':844},reduced_motion='reduce')
        try:
            page=context.new_page();page.on('pageerror',lambda e:self.errors.append(str(e)));page.route('**/*.mp3',self.route_audio);page.goto(url);self.receive(page)
            expect(page.locator('#letter-screen')).to_have_attribute('data-experience','classroom');expect(page.locator('#letter-greeting')).to_have_text(text)
            expect(page.locator('#letter-sender')).to_have_text('Học trò của cô · Minh');expect(page.locator('#studio-helper')).not_to_be_visible()
        finally:context.close()

    def test_08_corner_helper_stays_fixed_and_closes_with_escape_on_mobile(self):
        for width in (360,390,1440):
            self.page.set_viewport_size({'width':width,'height':844});self.editor()
            button=self.page.locator('#studio-helper-toggle');a=button.bounding_box();self.page.evaluate('window.scrollTo(0,document.body.scrollHeight)');b=button.bounding_box()
            self.assertAlmostEqual(a['x'],b['x'],delta=1);self.assertAlmostEqual(a['y'],b['y'],delta=1)
            button.click();expect(self.page.locator('#studio-helper-copy')).to_be_visible();self.assert_layout(f'{width} helper')
            self.page.locator('#studio-helper-input').focus();self.page.keyboard.press('Escape');expect(self.page.locator('#studio-helper-copy')).not_to_be_visible();expect(button).to_be_focused()
            self.welcome();expect(self.page.locator('#studio-helper')).not_to_be_visible();self.receive();expect(self.page.locator('#studio-helper')).not_to_be_visible()

    def test_09_helper_answers_locally_without_inserting_markup_or_changing_the_recipient(self):
        self.editor('mom');self.page.locator('#studio-helper-toggle').click()
        field=self.page.locator('#studio-helper-input');field.fill('gợi ý mẫu cho bà');self.page.locator('#studio-helper-chat button').click()
        expect(self.page.locator('#studio-helper-log')).to_contain_text('Chiều trà cùng bà');expect(self.page.locator('#theme-filter')).to_have_value('for-grandma')
        expect(self.page.locator('#editor-title')).to_contain_text('mẹ')
        field.fill('<img src=x onerror=alert(1)>');self.page.locator('#studio-helper-chat button').click();self.assertEqual(0,self.page.locator('#studio-helper img').count())
        for i in range(8):field.fill('chào bé B');self.page.locator('#studio-helper-chat button').click()
        self.assertLessEqual(self.page.locator('#studio-helper-log>p').count(),12)
        self.assertFalse(self.page.evaluate("Boolean(document.querySelector('#studio-helper script'))"))

    def test_10_helper_has_six_expressions_and_respects_reduced_motion(self):
        self.page.emulate_media(reduced_motion='no-preference');self.editor();self.page.locator('#studio-helper-toggle').click()
        for mood in ('happy','curious','shy','love','wink','sleep'):
            self.page.locator('[data-helper-topic=play]').click();expect(self.page.locator('#studio-helper')).to_have_attribute('data-expression',mood)
        self.assertGreater(self.page.locator('#studio-helper').evaluate("e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"),0)
        self.page.emulate_media(reduced_motion='reduce');self.assertEqual(0,self.page.locator('#studio-helper').evaluate("e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"))

    def test_11_ending_a_real_track_chooses_another_and_studio_volume_stays_separate(self):
        self.add_group_audio('mom');self.editor();self.settle_library();self.page.locator('#studio-music-toggle').click();before=self.studio_playing()['file']
        self.page.locator('#studio-volume-control').fill('17');self.page.locator('#studio-volume-control').dispatch_event('input')
        self.assertAlmostEqual(.17,self.page.locator('#background-music').evaluate('a=>a.volume'),places=2)
        self.page.evaluate("Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))")
        self.page.locator('#background-music').evaluate('a=>a.currentTime=Math.max(0,a.duration-.1)')
        self.page.wait_for_function('previous=>CardMusic.studioState().playing && CardMusic.studioState().file!==previous',arg=before,timeout=6000)
        self.assertEqual(17,self.page.evaluate('CardMusic.studioState().volume'));self.assertEqual(30,self.page.evaluate('CardMusic.currentVolume()'))

    def test_12_reduced_stories_have_complete_figures_and_no_motion_on_phone(self):
        self.page.set_viewport_size({'width':360,'height':800})
        for target,scene in NEW.items():
            self.editor(target);self.page.locator(f'[data-theme-preset="{scene}"]').click();self.welcome();self.receive();self.assert_layout(scene)
            self.assertGreater(self.page.locator('#theme-backdrop svg path').count(),15)
            self.assertEqual(0,self.page.locator('#theme-backdrop').evaluate("e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"))

    def test_13_chat_input_stays_above_the_mobile_keyboard(self):
        self.page.set_viewport_size({'width':390,'height':844});self.editor();self.page.locator('#studio-helper-toggle').click();self.page.locator('#studio-helper-input').focus()
        self.page.evaluate("Object.defineProperty(visualViewport,'height',{configurable:true,value:400});visualViewport.dispatchEvent(new Event('resize'))")
        expect(self.page.locator('#studio-helper')).to_have_attribute('data-keyboard','true')
        rect=self.page.locator('#studio-helper-input').bounding_box();self.assertLess(rect['y']+rect['height'],400)
        expect(self.page.locator('#studio-helper-input')).to_be_visible();self.assert_layout('keyboard viewport')
        self.page.keyboard.press('Escape');expect(self.page.locator('#studio-helper')).to_have_attribute('data-keyboard','false')

    def test_14_helper_greeting_and_a_different_recipient_do_not_change_the_card(self):
        self.editor('mom');self.page.locator('#studio-helper-toggle').click();field=self.page.locator('#studio-helper-input')
        field.fill('chào bé B');self.page.locator('#studio-helper-chat button').click();expect(self.page.locator('#studio-helper-log>p').last).to_contain_text('Chào bạn!')
        field.fill('lời chúc cho bà');self.page.locator('#studio-helper-chat button').click();expect(self.page.locator('#studio-helper-log>p').last).to_contain_text('Đổi người nhận')
        expect(self.page.locator('#editor-title')).to_contain_text('mẹ')
        field.fill('bé B ngủ ngon');self.page.locator('#studio-helper-chat button').click();expect(self.page.locator('#studio-helper')).to_have_attribute('data-expression','sleep')
        field.fill('bé B làm trái tim');self.page.locator('#studio-helper-chat button').click();expect(self.page.locator('#studio-helper')).to_have_attribute('data-expression','love')

if __name__=='__main__':unittest.main(verbosity=2)
