const CardMusic = (() => {
  'use strict';
  const MUSIC_ROOT = 'assets/music/';
  const definitions = Object.freeze({
    mom: { stem: 'me', oldStem: 'nhacme' },
    grandma: { stem: 'ba', oldStem: 'nhacba' },
    teacher: { stem: 'co', oldStem: 'nhacco' },
    sister: { stem: 'chi', oldStem: 'nhacchiem' },
    friend: { stem: 'nu', oldStem: 'nhacban' },
    women: { stem: 'nu', oldStem: 'nhacphunu' },
    lover: { stem: 'yeu', oldStem: 'nhacyeu' }
  });
  const suggestions = Object.freeze({
    me: ['Ca khúc về mẹ', 'Ca khúc gia đình ấm áp', 'Piano dịu', 'Guitar acoustic', 'Piano và dây', 'Nhạc không lời tươi sáng'],
    ba: ['Giai điệu quê hương', 'Ca khúc về bà phù hợp', 'Đàn tranh nhẹ', 'Guitar mộc', 'Piano hoài niệm', 'Hòa tấu ấm áp'],
    co: ['Ca khúc tri ân', 'Ca khúc tuổi học trò', 'Piano trong trẻo', 'Guitar nhẹ', 'Hòa tấu dây', 'Nhạc không lời trang nhã'],
    chi: ['Pop vui', 'Acoustic tích cực', 'Lo-fi sáng', 'Ukulele', 'Piano vui', 'Chill không lời'],
    nu: ['Pop tích cực', 'Acoustic tươi', 'Lo-fi nhẹ', 'Bossa nova', 'Piano sáng', 'Hòa tấu vui'],
    yeu: ['Tình ca ngọt ngào', 'Tình ca đồng hành', 'Acoustic lãng mạn', 'Piano tình cảm', 'Chill R&B phù hợp', 'Không lời kiểu điện ảnh']
  });
  // Tệp cũ được giữ nguyên, không đoán tên bài hoặc sao chép thành nhiều bản.
  const legacyRecordings = Object.freeze({
    'me:0': ['nhac_me.mp3', 'assets/nhac_me.mp3'],
    'ba:0': ['nhac_ba.mp3', 'assets/nhac_ba.mp3'],
    'nu:0': ['music_under.mp3', 'assets/music_under.mp3'],
    'nu:1': ['music_over.mp3', 'assets/music_over.mp3']
  });
  const metadata = new Map();
  let catalogueRequest = null;
  const $ = id => document.getElementById(id);
  const audio = $('background-music');
  const buttons = [$('music-toggle'), $('header-music-toggle')].filter(Boolean);
  const probeCache = new Map();
  const queue = [];
  let activeProbes = 0;
  let group = null;
  let tracks = [];
  let selectedId = null;
  let selectedTrack = null;
  let loading = false;
  let desired = false;
  let pendingPlay = false;
  let userPaused = false;
  let userActionRevision = 0;
  let autoAttempted = false;
  let requestId = 0;
  let scanId = 0;
  let statusOverride = '';
  let openingIntent = null;
  let volume = 30;

  if (audio) {
    audio.loop = true;
    audio.preload = 'metadata';
    audio.volume = .3;
  }

  const notice = message => document.dispatchEvent(new CustomEvent('cardmusicnotice', { detail: { message } }));
  const emitSelection = () => document.dispatchEvent(new CustomEvent('cardmusicchange', { detail: { id: selectedId } }));
  const canonicalURL = path => new URL(path, document.baseURI).href;
  const actualPlaying = () => Boolean(audio && selectedTrack?.available && desired && !audio.paused && !audio.ended && !audio.error);
  const labelFor = index => `Bản nhạc ${String(index + 1).padStart(2, '0')}`;
  const expectedFile = (target, index) => `${MUSIC_ROOT}${index}${definitions[target].stem}.mp3`;
  const titleFor = track => track.displayName || labelFor(track.index);

  function trackMetadata(target, index) {
    const stem = definitions[target].stem;
    const entry = metadata.get(`${stem}:${index}`);
    return {
      catalogId: `${stem}:${index}`,
      displayName: entry?.displayName || labelFor(index),
      artist: entry?.artist || '',
      suggestion: entry?.suggestion || suggestions[stem]?.[index] || ''
    };
  }

  async function loadCatalogue() {
    if (!catalogueRequest) catalogueRequest = (async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      try {
        const response = await fetch(`${MUSIC_ROOT}catalog.json`, { signal: controller.signal });
        if (!response.ok) return;
        const config = await response.json();
        if (config?.version !== 1 || !Array.isArray(config.tracks)) return;
        for (const entry of config.tracks.slice(0, 36)) {
          const match = typeof entry?.id === 'string' && entry.id.match(/^(me|ba|co|chi|nu|yeu):([0-5])$/);
          if (!match || entry.path !== `${MUSIC_ROOT}${match[2]}${match[1]}.mp3`) continue;
          metadata.set(entry.id, {
            displayName: typeof entry.displayName === 'string' ? entry.displayName.slice(0, 120) : '',
            artist: typeof entry.artist === 'string' ? entry.artist.slice(0, 100) : '',
            suggestion: typeof entry.suggestion === 'string' ? entry.suggestion.slice(0, 160) : ''
          });
        }
      } catch (_) {
        // Thiếu catalogue vẫn có thể tìm đúng sáu tên tệp tiêu chuẩn.
      } finally { clearTimeout(timeout); }
    })();
    return catalogueRequest;
  }

  function emptyTrack(target, index) {
    return { id: `${target}:${index}`, index, expected: expectedFile(target, index),
      file: null, url: null, available: false, canonical: false, legacy: false,
      ...trackMetadata(target, index) };
  }


  function drain() {
    while (activeProbes < 8 && queue.length) {
      const task = queue.shift();
      activeProbes += 1;
      task.run().then(task.resolve, () => task.resolve(null)).finally(() => {
        activeProbes -= 1;
        drain();
      });
    }
  }

  function probe(path) {
    if (probeCache.has(path)) return probeCache.get(path);
    const result = new Promise(resolve => {
      queue.push({ resolve, run: async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 7000);
        try {
          const response = await fetch(path, { method: 'HEAD', cache: 'no-store', signal: controller.signal });
          const type = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
          const lengthHeader = response.headers.get('content-length');
          const length = lengthHeader === null ? null : Number(lengthHeader);
          const audioMime = type.startsWith('audio/');
          const binaryMime = type === 'application/octet-stream' || type === 'binary/octet-stream';
          const hasBody = length === null ? audioMime : Number.isFinite(length) && length > 0;
          if (response.ok && (audioMime || binaryMime) && hasBody) return path;
          return null;
        } catch (_) {
          return null;
        } finally {
          clearTimeout(timeout);
        }
      } });
      drain();
    });
    probeCache.set(path, result);
    return result;
  }

  async function findTrack(target, index) {
    const definition = definitions[target];
    const track = emptyTrack(target, index);
    const old = `${index}${definition.oldStem}.mp3`;
    // Chỉ sáu vị trí mới. Vị trí 6–19 chỉ được dò khi một liên kết cũ yêu cầu.
    const candidates = index < 6 ? [track.expected] : [];
    candidates.push(...(legacyRecordings[`${definition.stem}:${index}`] || []));
    candidates.push(old, `assets/${old}`);
    if (index === 0) candidates.push(`${definition.oldStem}.mp3`, `assets/${definition.oldStem}.mp3`);
    // Bạn nữ và nhóm phụ nữ dùng chung chính xác danh mục nu.
    if (definition.stem === 'nu' && index < 6) {
      candidates.splice(candidates.indexOf(old), 2);
      if (index === 0) {
        for (const path of [`${definition.oldStem}.mp3`, `assets/${definition.oldStem}.mp3`]) {
          const at = candidates.indexOf(path);
          if (at >= 0) candidates.splice(at, 1);
        }
      }
      for (const stem of ['nhacban', 'nhacphunu']) {
        candidates.push(`${index}${stem}.mp3`, `assets/${index}${stem}.mp3`);
        if (index === 0) candidates.push(`${stem}.mp3`, `assets/${stem}.mp3`);
      }
    }
    for (const path of [...new Set(candidates)]) {
      const found = await probe(path);
      if (found) return { ...track, file: found, url: found, available: true,
        canonical: found === track.expected, legacy: found !== track.expected };
    }
    return track;
  }

  function currentStatus() {
    if (!group) return 'Chọn người nhận để chọn nhạc cho thiệp.';
    if (statusOverride) return statusOverride;
    if (loading && !selectedTrack?.available) return 'Đang tìm các bản nhạc trong nhóm này…';
    if (!selectedTrack?.available) return `Chưa có tệp nhạc · ${selectedTrack?.expected || expectedFile(group, 0)}. Bạn vẫn có thể xem thiệp bình thường.`;
    if (actualPlaying()) return `Đang phát ${titleFor(selectedTrack)} · ${selectedTrack.file}`;
    if (pendingPlay && desired) return `Đang mở ${titleFor(selectedTrack)}…`;
    if (userPaused) return 'Nhạc đã tạm dừng. Chạm nút nhạc để nghe tiếp.';
    return `${titleFor(selectedTrack)} đã sẵn sàng. Chạm để bật nhạc.`;
  }

  function syncUI() {
    const playing = actualPlaying();
    for (const button of buttons) {
      button.disabled = false;
      button.setAttribute('aria-pressed', String(playing));
      button.setAttribute('aria-label', playing ? 'Tạm dừng nhạc nền' : 'Bật nhạc nền');
      const label = button.querySelector('[data-music-label]');
      const icon = button.querySelector('[data-music-icon] use');
      if (label) label.textContent = playing ? 'Tắt nhạc' : 'Bật nhạc';
      if (icon) icon.setAttribute('href', playing ? '#i-volume' : '#i-volume-off');
    }
    if ($('music-status')) $('music-status').textContent = currentStatus();
    if ($('volume-control')) $('volume-control').disabled = false;
    document.querySelectorAll('#track-list [data-track-id]').forEach(button => {
      const selected = button.dataset.trackId === selectedId;
      button.setAttribute('aria-pressed', String(selected));
      const row = button.closest('.music-track');
      if (row) row.dataset.selected = String(selected);
    });
    document.querySelectorAll('#track-list [data-preview-track]').forEach(button => {
      const thisPlaying = playing && button.dataset.previewTrack === selectedId;
      button.textContent = thisPlaying ? 'Tạm dừng' : 'Nghe thử';
      button.setAttribute('aria-pressed', String(thisPlaying));
      const track = tracks.find(item => item.id === button.dataset.previewTrack);
      button.setAttribute('aria-label', `${thisPlaying ? 'Tạm dừng' : 'Nghe thử'} ${track ? titleFor(track) : 'bản nhạc'}`);
    });
    if ($('letter-track-select')) $('letter-track-select').value = selectedId || '';
    const available = tracks.filter(track => track.available);
    for (const id of ['prev-track', 'next-track']) {
      if ($(id)) $(id).disabled = available.length < 2;
    }
  }

  function renderCatalogue() {
    const list = $('track-list');
    if (list) {
      list.setAttribute('aria-busy', String(loading));
      const fragment = document.createDocumentFragment();
      for (const track of tracks.filter(item => item.index < 6)) {
        const row = document.createElement('div');
        row.className = 'music-track';
        row.dataset.selected = String(track.id === selectedId);
        const select = document.createElement('button');
        select.type = 'button';
        select.className = 'track-select';
        select.dataset.trackId = track.id;
        select.disabled = !track.available;
        select.setAttribute('aria-pressed', String(track.id === selectedId));
        const title = document.createElement('strong');
        title.className = 'track-title';
        title.textContent = `${titleFor(track)}${track.artist ? ` · ${track.artist}` : ''}`;
        const detail = document.createElement('small');
        detail.className = 'track-state';
        detail.textContent = track.available ? `${track.legacy ? 'Đang dùng tệp cũ' : 'Có sẵn'} · ${track.file}` : `Chưa có tệp nhạc · ${track.expected}`;
        const suggestion = document.createElement('small');
        suggestion.className = 'track-suggestion';
        suggestion.textContent = track.suggestion ? `Gợi ý chọn nhạc: ${track.suggestion}` : '';
        select.append(title, detail, suggestion);
        const preview = document.createElement('button');
        preview.type = 'button';
        preview.className = 'track-preview';
        preview.dataset.previewTrack = track.id;
        preview.disabled = !track.available;
        preview.textContent = 'Nghe thử';
        row.append(select, preview);
        fragment.append(row);
      }
      list.replaceChildren(fragment);
    }
    const receivedSelect = $('letter-track-select');
    if (receivedSelect) {
      const fragment = document.createDocumentFragment();
      for (const track of tracks) {
        const option = document.createElement('option');
        option.value = track.id;
        option.disabled = !track.available;
        option.textContent = `${titleFor(track)}${track.available ? '' : ' — chưa có tệp nhạc'}${track.index > 5 ? ' · từ liên kết cũ' : ''}`;
        fragment.append(option);
      }
      receivedSelect.replaceChildren(fragment);
      receivedSelect.value = selectedId || '';
      receivedSelect.disabled = !tracks.some(track => track.available);
    }
    const missingContainer = $('music-missing-files');
    if (missingContainer) {
      const missing = tracks.filter(track => track.index < 6 && !track.canonical);
      const fragment = document.createDocumentFragment();
      for (const track of missing) {
        const item = document.createElement('li');
        const file = document.createElement('code');
        file.textContent = track.expected;
        item.append(file);
        fragment.append(item);
      }
      let missingList = missingContainer.tagName === 'UL' ? missingContainer : missingContainer.querySelector('ul');
      if (!missingList) {
        missingList = document.createElement('ul');
        missingContainer.append(missingList);
      }
      missingList.replaceChildren(fragment);
      missingContainer.hidden = missing.length === 0;
    }
    const catalogStatus = $('music-catalog-status');
    if (catalogStatus) {
      const count = tracks.filter(track => track.index < 6 && track.available).length;
      const canonicalCount = tracks.filter(track => track.index < 6 && track.canonical).length;
      catalogStatus.textContent = loading ? 'Đang kiểm tra 6 vị trí nhạc cho người nhận…' : `${count}/6 bản nhạc có thể nghe.${count < 6 ? ` Còn ${6 - count} vị trí chưa có tệp nhạc.` : ' Chọn một bản để gắn vào thiệp.'}${canonicalCount < count ? ' Các tệp cũ vẫn nghe được; xem hướng dẫn để bổ sung tên mới.' : ''}`;
    }
    if ($('rescan-music')) $('rescan-music').disabled = loading;
    syncUI();
  }

  function pause(userInitiated = true) {
    requestId += 1;
    desired = false;
    pendingPlay = false;
    if (userInitiated) { userPaused = true; userActionRevision += 1; openingIntent = null; }
    if (audio) audio.pause();
    statusOverride = '';
    syncUI();
  }

  function loadTrack(track) {
    requestId += 1;
    pendingPlay = false;
    selectedTrack = track || null;
    if (!audio) return;
    audio.pause();
    if (track?.available) {
      if (audio.getAttribute('src') !== track.url) {
        audio.src = track.url;
        audio.load();
      }
    } else {
      audio.removeAttribute('src');
      audio.load();
    }
  }

  function play(userInitiated = true) {
    if (!audio || !selectedTrack?.available) {
      syncUI();
      return Promise.resolve(false);
    }
    if (userInitiated) { userPaused = false; userActionRevision += 1; }
    desired = true;
    pendingPlay = true;
    statusOverride = '';
    const attempt = ++requestId;
    let result;
    try {
      // Gọi play ngay trong thao tác bấm; không chờ dò tệp làm mất quyền phát của trình duyệt.
      result = audio.play();
    } catch (error) {
      result = Promise.reject(error);
    }
    syncUI();
    return Promise.resolve(result).then(() => {
      if (attempt !== requestId) return false;
      pendingPlay = false;
      syncUI();
      return actualPlaying();
    }).catch(error => {
      if (attempt !== requestId) return false;
      pendingPlay = false;
      desired = false;
      if (error?.name !== 'AbortError') {
        statusOverride = error?.name === 'NotAllowedError'
          ? 'Trình duyệt chưa cho phép phát nhạc. Chạm nút nhạc một lần nữa để nghe.'
          : 'Chưa phát được bản nhạc này. Chọn bản khác hoặc thử lại.';
        notice(statusOverride);
      }
      syncUI();
      return false;
    });
  }

  function selectTrack(id, preview = false) {
    const track = tracks.find(item => item.id === id);
    if (!track?.available) return false;
    if (preview && id === selectedId && (actualPlaying() || pendingPlay)) {
      pause(true);
      return true;
    }
    userActionRevision += 1;
    const continuePlaying = desired && !userPaused;
    selectedId = id;
    statusOverride = '';
    desired = false;
    loadTrack(track);
    emitSelection();
    syncUI();
    if (preview || continuePlaying) void play(true);
    return true;
  }

  async function setGroup(target, requestedId) {
    if (!definitions[target]) target = 'women';
    const changed = group !== target;
    const generation = ++scanId;
    if (changed) {
      openingIntent = null;
      pause(false);
      autoAttempted = false;
    }
    group = target;
    const match = typeof requestedId === 'string' ? requestedId.match(/^([a-z]+):(\d{1,2})$/) : null;
    const requestedIndex = match && match[1] === target && Number(match[2]) < 20 ? Number(match[2]) : 0;
    const previousId = selectedId;
    selectedId = `${target}:${requestedIndex}`;
    loading = true;
    statusOverride = '';
    const shouldContinue = !changed && desired && !userPaused;
    const actionAtScanStart = userActionRevision;
    desired = false;
    tracks = Array.from({ length: 6 }, (_, index) => emptyTrack(target, index));
    const placeholder = tracks.find(track => track.id === selectedId) || emptyTrack(target, requestedIndex);
    loadTrack(null);
    selectedTrack = placeholder;
    renderCatalogue();
    // Ưu tiên bản được chọn trước khi dò các bài bổ sung.
    await loadCatalogue();
    if (generation !== scanId || group !== target) return [];
    const order = [requestedIndex, ...Array.from({ length: 6 }, (_, index) => index).filter(index => index !== requestedIndex)];
    const found = await Promise.all(order.map(async index => {
      const track = await findTrack(target, index);
      if (generation === scanId && group === target && index === requestedIndex) {
        loadTrack(track);
        syncUI();
        if (track.available && openingIntent && openingIntent.group === target && openingIntent.id === selectedId && openingIntent.revision === userActionRevision && !userPaused) {
          openingIntent = null;
          autoAttempted = true;
          void play(false);
        }
      }
      return track;
    }));
    if (generation !== scanId || group !== target) return [];
    tracks = found.filter(track => track.index < 6 || track.id === selectedId).sort((a, b) => a.index - b.index);
    selectedTrack = tracks.find(track => track.id === selectedId) || placeholder;
    loading = false;
    renderCatalogue();
    if (selectedId !== previousId) emitSelection();
    // Không để kết quả quét đến muộn ghi đè thao tác tắt/đổi bài mới của người dùng.
    if (shouldContinue && !userPaused && userActionRevision === actionAtScanStart && selectedTrack.available) void play(false);
    return tracks.map(track => ({ ...track }));
  }

  async function refreshGroup() {
    if (!group) return [];
    probeCache.clear();
    metadata.clear();
    catalogueRequest = null;
    const result = await setGroup(group, selectedId);
    if (result.length) notice(`Đã quét lại: tìm thấy ${result.filter(track => track.available).length} bản nhạc.`);
    return result;
  }

  function openGesture() {
    if (userPaused || autoAttempted) {
      syncUI();
      return Promise.resolve(false);
    }
    if (!selectedTrack?.available) {
      if (loading) openingIntent = { group, id: selectedId, revision: userActionRevision };
      syncUI();
      return Promise.resolve(false);
    }
    openingIntent = null;
    autoAttempted = true;
    return play(false);
  }

  async function toggle() {
    if (desired || actualPlaying() || pendingPlay) {
      pause(true);
      return;
    }
    if (!selectedTrack?.available) {
      if (loading) {
        notice('Đang tìm nhạc. Bạn có thể mở thiệp trước, rồi chạm nút nhạc khi file sẵn sàng.');
        return;
      }
      await refreshGroup();
      if (!selectedTrack?.available) {
        notice(currentStatus());
        return;
      }
      // Sau khi quét lại, cần một lần chạm mới để trình duyệt cho phép phát nhạc.
      notice('Đã tìm thấy nhạc. Chạm nút nhạc lần nữa để phát.');
      syncUI();
      return;
    }
    await play(true);
  }

  for (const button of buttons) button.addEventListener('click', () => { void toggle(); });
  $('track-list')?.addEventListener('click', event => {
    const preview = event.target.closest('[data-preview-track]');
    const select = event.target.closest('[data-track-id]');
    if (preview && !preview.disabled) selectTrack(preview.dataset.previewTrack, true);
    else if (select && !select.disabled) selectTrack(select.dataset.trackId, false);
  });
  $('letter-track-select')?.addEventListener('change', event => selectTrack(event.target.value, false));
  $('rescan-music')?.addEventListener('click', () => { void refreshGroup(); });
  for (const [id, direction] of [['prev-track', -1], ['next-track', 1]]) {
    $(id)?.addEventListener('click', () => {
      const available = tracks.filter(track => track.available);
      if (!available.length) return;
      const index = available.findIndex(track => track.id === selectedId);
      const next = (index < 0 ? (direction > 0 ? 0 : available.length - 1) : (index + direction + available.length) % available.length);
      selectTrack(available[next].id, false);
    });
  }
  function setVolume(value, emit = true) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return volume;
    volume = Math.round(Math.min(100, Math.max(0, numeric)));
    if (audio) {
      try { audio.volume = volume / 100; } catch (_) { /* iOS điều khiển âm lượng bằng nút thiết bị. */ }
    }
    for (const id of ['volume-control', 'editor-volume-control']) {
      if ($(id)) $(id).value = String(volume);
    }
    for (const id of ['volume-value', 'editor-volume-value']) {
      if ($(id)) $(id).textContent = `${volume}%`;
    }
    if (emit) document.dispatchEvent(new CustomEvent('cardmusicvolume', { detail: { volume } }));
    return volume;
  }
  for (const id of ['volume-control', 'editor-volume-control']) {
    $(id)?.addEventListener('input', event => setVolume(event.target.value));
  }
  setVolume(30, false);
  if (audio) {
    audio.addEventListener('playing', () => {
      if (!desired || !selectedTrack?.available) audio.pause();
      else pendingPlay = false;
      syncUI();
    });
    for (const event of ['pause', 'loadedmetadata', 'ended', 'emptied']) audio.addEventListener(event, syncUI);
    audio.addEventListener('error', () => {
      if (!audio.error || !selectedTrack?.available) return;
      if (audio.currentSrc && audio.currentSrc !== canonicalURL(selectedTrack.url)) return;
      const failed = selectedTrack;
      probeCache.set(failed.url, Promise.resolve(null));
      failed.available = false;
      failed.file = null;
      desired = false;
      pendingPlay = false;
      requestId += 1;
      audio.pause();
      statusOverride = `Không đọc được ${failed.url}. Hãy kiểm tra file MP3, chọn bản khác hoặc quét lại nhạc.`;
      renderCatalogue();
      notice(statusOverride);
    });
  }
  function stopOnPageHide() { openingIntent = null; autoAttempted = false; userActionRevision += 1; pause(false); }
  function resumeUI() { syncUI(); }
  window.addEventListener('pagehide', stopOnPageHide);
  window.addEventListener('pageshow', resumeUI);
  syncUI();
  return Object.freeze({
    setGroup,
    setVolume,
    currentVolume: () => volume,
    currentId: () => selectedId,
    openGesture,
    stopOnPageHide,
    resumeUI,
    refreshGroup,
    get catalogue() { return tracks.map(track => ({ ...track })); }
  });
})();

