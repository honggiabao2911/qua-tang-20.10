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
  // Hai không gian dùng chung một audio; nhạc làm thiệp không đi theo liên kết.
  let mode = 'card';
  let studioTrack = null;
  let studioDiscovery = null;
  let studioLoading = false;
  let studioDesired = false;
  let studioPending = false;
  let studioUserPaused = false;
  let studioRevision = 0;
  let studioStatusOverride = '';
  let studioVolume = 24;

  if (audio) {
    audio.loop = true;
    audio.preload = 'metadata';
    audio.volume = .3;
  }

  const notice = message => document.dispatchEvent(new CustomEvent('cardmusicnotice', { detail: { message } }));
  const emitSelection = () => document.dispatchEvent(new CustomEvent('cardmusicchange', { detail: { id: selectedId } }));
  const canonicalURL = path => new URL(path, document.baseURI).href;
  const actualPlaying = () => Boolean(mode === 'card' && audio && selectedTrack?.available && desired && !audio.paused && !audio.ended && !audio.error);
  const studioPlaying = () => Boolean(mode === 'studio' && audio && studioTrack && studioDesired && !audio.paused && !audio.ended && !audio.error);
  const labelFor = index => `Bản nhạc ${String(index + 1).padStart(2, '0')}`;
  const expectedFile = (target, index) => `${MUSIC_ROOT}${index}${definitions[target].stem}.mp3`;
  const titleFor = track => track.displayName || labelFor(track.index);

  function trackMetadata(target, index) {
    const stem = definitions[target].stem;
    const entry = metadata.get(`${stem}:${index}`);
    return {
      catalogId: `${stem}:${index}`,
      displayName: entry?.displayName || labelFor(index),
      artist: entry?.artist || ''
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
            artist: typeof entry.artist === 'string' ? entry.artist.slice(0, 100) : ''
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

  function studioStatus() {
    if (studioStatusOverride) return studioStatusOverride;
    if (studioLoading) return 'Đang tìm nhạc cho lúc làm thiệp…';
    if (!studioTrack) return 'Chưa có nhac.mp3. Thêm tệp này ở thư mục gốc để nghe nhạc khi làm thiệp.';
    if (studioPlaying()) return 'Nhạc làm thiệp đang phát.';
    if (studioPending && studioDesired) return 'Đang mở nhạc làm thiệp…';
    if (mode !== 'studio') return 'Nhạc làm thiệp sẽ phát riêng khi bạn quay lại thiết kế.';
    if (studioUserPaused) return 'Nhạc làm thiệp đã tạm dừng.';
    return 'Nhạc làm thiệp đã sẵn sàng. Chạm để nghe.';
  }

  function studioState() {
    return { active: mode === 'studio', available: Boolean(studioTrack), loading: studioLoading,
      playing: studioPlaying(), pending: studioPending, file: studioTrack, volume: studioVolume,
      status: studioStatus() };
  }

  function syncUI() {
    const playing = actualPlaying();
    const mainPlaying = mode === 'studio' ? studioPlaying() : playing;
    for (const button of buttons) {
      button.disabled = false;
      button.setAttribute('aria-pressed', String(mainPlaying));
      button.setAttribute('aria-label', mainPlaying ? 'Tạm dừng nhạc nền' : 'Bật nhạc nền');
      const label = button.querySelector('[data-music-label]');
      const icon = button.querySelector('[data-music-icon] use');
      if (label) label.textContent = mainPlaying ? 'Tắt nhạc' : 'Bật nhạc';
      if (icon) icon.setAttribute('href', mainPlaying ? '#i-volume' : '#i-volume-off');
    }
    const studioButton = $('studio-music-toggle');
    if (studioButton) {
      const on = studioPlaying();
      studioButton.disabled = false;
      studioButton.setAttribute('aria-pressed', String(on));
      studioButton.setAttribute('aria-label', on ? 'Tạm dừng nhạc làm thiệp' : 'Bật nhạc làm thiệp');
      const label = studioButton.querySelector('[data-studio-music-label]');
      if (label) label.textContent = on ? 'Tạm dừng' : 'Bật nhạc làm thiệp';
      else studioButton.textContent = on ? 'Tạm dừng' : 'Bật nhạc làm thiệp';
    }
    if ($('studio-music-status')) $('studio-music-status').textContent = studioStatus();
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
        select.append(title, detail);
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

  function applyAudioVolume(value) {
    if (audio) {
      try { audio.volume = value / 100; } catch (_) { /* iOS dùng nút âm lượng của thiết bị. */ }
    }
  }

  function setStudioVolume(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return studioVolume;
    studioVolume = Math.round(Math.min(100, Math.max(0, numeric)));
    if (mode === 'studio') applyAudioVolume(studioVolume);
    for (const id of ['studio-volume', 'studio-volume-control']) {
      if ($(id)) $(id).value = String(studioVolume);
    }
    for (const id of ['studio-volume-value']) {
      if ($(id)) $(id).textContent = `${studioVolume}%`;
    }
    return studioVolume;
  }

  function discoverStudio() {
    if (!studioDiscovery) {
      studioLoading = true;
      studioDiscovery = (async () => {
        for (const path of ['nhac.mp3', `${MUSIC_ROOT}nhac.mp3`]) {
          const found = await probe(path);
          if (found) { studioTrack = found; return found; }
        }
        studioTrack = null;
        return null;
      })().finally(() => { studioLoading = false; syncUI(); });
    }
    return studioDiscovery;
  }

  function playStudio() {
    if (!audio || mode !== 'studio' || !studioTrack) return Promise.resolve(false);
    desired = false;
    pendingPlay = false;
    openingIntent = null;
    studioDesired = true;
    studioPending = true;
    studioStatusOverride = '';
    if (audio.getAttribute('src') !== studioTrack) {
      audio.pause();
      audio.src = studioTrack;
      audio.load();
    }
    applyAudioVolume(studioVolume);
    const attempt = ++requestId;
    let result;
    try { result = audio.play(); } catch (error) { result = Promise.reject(error); }
    syncUI();
    return Promise.resolve(result).then(() => {
      if (attempt !== requestId || mode !== 'studio') return false;
      studioPending = false;
      syncUI();
      return studioPlaying();
    }).catch(error => {
      if (attempt !== requestId || mode !== 'studio') return false;
      studioDesired = false;
      studioPending = false;
      if (error?.name !== 'AbortError') studioStatusOverride = error?.name === 'NotAllowedError'
        ? 'Chạm “Bật nhạc làm thiệp” để trình duyệt cho phép phát nhạc.'
        : 'Chưa phát được nhac.mp3. Chạm nút để thử lại.';
      syncUI();
      return false;
    });
  }

  function enterStudio({ gesture = false } = {}) {
    const changed = mode !== 'studio';
    if (changed) {
      requestId += 1;
      userActionRevision += 1;
      desired = false;
      pendingPlay = false;
      openingIntent = null;
      if (audio) audio.pause();
      mode = 'studio';
      applyAudioVolume(studioVolume);
    }
    const revision = changed || gesture ? ++studioRevision : studioRevision;
    if (gesture && !studioUserPaused) {
      studioDesired = true;
      studioPending = true;
      studioStatusOverride = '';
      if (studioTrack) return playStudio();
    }
    // Đọc tệp có thể chạy sớm; chỉ thao tác chạm rõ ràng mới tạo ý định phát.
    const shouldPlay = gesture && !studioUserPaused;
    const result = discoverStudio().then(found => {
      if (revision !== studioRevision || mode !== 'studio') return false;
      if (found && shouldPlay && studioDesired && !studioUserPaused) return playStudio();
      if (!found) { studioDesired = false; studioPending = false; }
      syncUI();
      return false;
    });
    syncUI();
    return result;
  }

  function leaveStudio() {
    if (mode !== 'studio') return;
    studioRevision += 1;
    requestId += 1;
    studioDesired = false;
    studioPending = false;
    if (audio) audio.pause();
    mode = 'card';
    loadTrack(selectedTrack);
    applyAudioVolume(volume);
    syncUI();
  }

  function toggleStudio() {
    if (mode === 'studio' && (studioDesired || studioPlaying() || studioPending)) {
      studioRevision += 1;
      requestId += 1;
      studioUserPaused = true;
      studioDesired = false;
      studioPending = false;
      studioStatusOverride = '';
      if (audio) audio.pause();
      syncUI();
      return Promise.resolve(false);
    }
    studioUserPaused = false;
    studioStatusOverride = '';
    if (!studioTrack && !studioLoading) {
      for (const path of ['nhac.mp3', `${MUSIC_ROOT}nhac.mp3`]) probeCache.delete(path);
      studioDiscovery = null;
    }
    return enterStudio({ gesture: true });
  }

  function pause(userInitiated = true) {
    if (mode === 'card') requestId += 1;
    desired = false;
    pendingPlay = false;
    if (userInitiated) { userPaused = true; userActionRevision += 1; openingIntent = null; }
    if (audio && mode === 'card') audio.pause();
    statusOverride = '';
    syncUI();
  }

  function loadTrack(track) {
    if (mode === 'card') requestId += 1;
    pendingPlay = false;
    selectedTrack = track || null;
    if (!audio || mode !== 'card') return;
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
    if (mode !== 'card') leaveStudio();
    if (!audio || !selectedTrack?.available) {
      syncUI();
      return Promise.resolve(false);
    }
    if (userInitiated) { userPaused = false; userActionRevision += 1; }
    if (audio.getAttribute('src') !== selectedTrack.url) loadTrack(selectedTrack);
    applyAudioVolume(volume);
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
    const inEditor = $('editor-screen') && !$('editor-screen').hidden;
    const continuePlaying = mode === 'card' && desired && !userPaused && !inEditor;
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
        if (selectedId === track.id) loadTrack(track);
        syncUI();
        if (mode === 'card' && track.available && openingIntent && openingIntent.group === target && openingIntent.id === selectedId && openingIntent.revision === userActionRevision && !userPaused) {
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
    if (mode === 'card' && shouldContinue && !userPaused && userActionRevision === actionAtScanStart && selectedTrack.available) void play(false);
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
    leaveStudio();
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
    if (mode === 'studio') return toggleStudio();
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
    if (mode === 'card') applyAudioVolume(volume);
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
  $('studio-music-toggle')?.addEventListener('click', () => { void toggleStudio(); });
  for (const id of ['studio-volume', 'studio-volume-control']) {
    $(id)?.addEventListener('input', event => setStudioVolume(event.target.value));
  }
  setStudioVolume(studioVolume);
  void discoverStudio();
  setVolume(30, false);
  if (audio) {
    audio.addEventListener('playing', () => {
      if (mode === 'studio') {
        if (!studioDesired || !studioTrack) audio.pause();
        else studioPending = false;
      } else if (!desired || !selectedTrack?.available) audio.pause();
      else pendingPlay = false;
      syncUI();
    });
    for (const event of ['pause', 'loadedmetadata', 'ended', 'emptied']) audio.addEventListener(event, syncUI);
    audio.addEventListener('error', () => {
      if (mode === 'studio') {
        if (!audio.error || !studioTrack || (audio.currentSrc && audio.currentSrc !== canonicalURL(studioTrack))) return;
        studioDesired = false;
        studioPending = false;
        requestId += 1;
        audio.pause();
        studioStatusOverride = 'Không đọc được nhac.mp3. Kiểm tra tệp MP3 rồi chạm để thử lại.';
        studioDiscovery = null;
        studioTrack = null;
        syncUI();
        return;
      }
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
  function stopOnPageHide() {
    openingIntent = null;
    autoAttempted = false;
    userActionRevision += 1;
    studioRevision += 1;
    studioDesired = false;
    studioPending = false;
    requestId += 1;
    if (audio) audio.pause();
    pause(false);
  }
  function resumeUI() { syncUI(); }
  window.addEventListener('pagehide', stopOnPageHide);
  window.addEventListener('pageshow', resumeUI);
  syncUI();
  return Object.freeze({
    setGroup,
    setVolume,
    currentVolume: () => volume,
    enterStudio,
    leaveStudio,
    toggleStudio,
    studioState,
    setStudioVolume,
    currentId: () => selectedId,
    openGesture,
    stopOnPageHide,
    resumeUI,
    refreshGroup,
    get catalogue() { return tracks.map(track => ({ ...track })); }
  });
})();

