/*
 * Self-contained card URLs: compact positional schema + LZ-string 1.5.0.
 * LZ source: https://registry.npmjs.org/lz-string/-/lz-string-1.5.0.tgz
 * Verified npm dist integrity (SHA-512):
 * h5bgJWpxJNswbU7qCrV0tIKQCaS3blPDrqKWx+QxzuzL1zGUzij9XCWLrSLsJPu5t+eWA/ycetzYAO5IOMcWAQ==
 * Adapted upstream compressor/decompressor: null-prototype dictionaries;
 * decoder checks total output BEFORE retaining each expanded phrase.
 * No external requests, storage service, token, or new runtime dependency.
 *
 * MIT License
 *
 * Copyright (c) 2013 pieroxy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const CardLinks = (() => {
  'use strict';
  const MAX_FRAGMENT_LENGTH = 60000;
  const MAX_TEXT_LENGTH = 20000;
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const f = String.fromCharCode;
  function compress (uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null) return "";
    var i, value,
        context_dictionary= Object.create(null),
        context_dictionaryToCreate= Object.create(null),
        context_c="",
        context_wc="",
        context_w="",
        context_enlargeIn= 2, // Compensate for the first entry which should not count
        context_dictSize= 3,
        context_numBits= 2,
        context_data=[],
        context_data_val=0,
        context_data_position=0,
        ii;

    for (ii = 0; ii < uncompressed.length; ii += 1) {
      context_c = uncompressed.charAt(ii);
      if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
        context_dictionary[context_c] = context_dictSize++;
        context_dictionaryToCreate[context_c] = true;
      }

      context_wc = context_w + context_c;
      if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
        context_w = context_wc;
      } else {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
          if (context_w.charCodeAt(0)<256) {
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<8 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1) | value;
              if (context_data_position ==bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<16 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }


        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        // Add wc to the dictionary.
        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      }
    }

    // Output the code for w.
    if (context_w !== "") {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
        if (context_w.charCodeAt(0)<256) {
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<8 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<16 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        delete context_dictionaryToCreate[context_w];
      } else {
        value = context_dictionary[context_w];
        for (i=0 ; i<context_numBits ; i++) {
          context_data_val = (context_data_val << 1) | (value&1);
          if (context_data_position == bitsPerChar-1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }


      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
    }

    // Mark the end of the stream
    value = 2;
    for (i=0 ; i<context_numBits ; i++) {
      context_data_val = (context_data_val << 1) | (value&1);
      if (context_data_position == bitsPerChar-1) {
        context_data_position = 0;
        context_data.push(getCharFromInt(context_data_val));
        context_data_val = 0;
      } else {
        context_data_position++;
      }
      value = value >> 1;
    }

    // Flush the last char
    while (true) {
      context_data_val = (context_data_val << 1);
      if (context_data_position == bitsPerChar-1) {
        context_data.push(getCharFromInt(context_data_val));
        break;
      }
      else context_data_position++;
    }
    return context_data.join('');
  }
  function decompress (length, resetValue, getNextValue) {
    var resultLength = 0;
    var dictionary = [],
        next,
        enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = "",
        result = [],
        i,
        w,
        bits, resb, maxpower, power,
        c,
        data = {val:getNextValue(0), position:resetValue, index:1};

    for (i = 0; i < 3; i += 1) {
      dictionary[i] = i;
    }

    bits = 0;
    maxpower = Math.pow(2,2);
    power=1;
    while (power!=maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb>0 ? 1 : 0) * power;
      power <<= 1;
    }

    switch (next = bits) {
      case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 2:
        return "";
    }
    dictionary[3] = c;
    w = c;
    resultLength = c.length;
    result.push(c);
    while (true) {
      if (data.index > length) {
        return "";
      }

      bits = 0;
      maxpower = Math.pow(2,numBits);
      power=1;
      while (power!=maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb>0 ? 1 : 0) * power;
        power <<= 1;
      }

      switch (c = bits) {
        case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }

          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 2:
          return result.join('');
      }

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

      if (dictionary[c]) {
        entry = dictionary[c];
      } else {
        if (c === dictSize) {
          entry = w + w.charAt(0);
        } else {
          return null;
        }
      }
      resultLength += entry.length;
      if (resultLength > MAX_TEXT_LENGTH) throw new Error("Card expands beyond the size limit");
      result.push(entry);

      // Add w+entry[0] to the dictionary.
      dictionary[dictSize++] = w + entry.charAt(0);
      enlargeIn--;

      w = entry;

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

    }
  }

  // Indexes in the v3 schema must never change: old cards remain readable.
  const legacyTargets = ['mom', 'grandma', 'teacher', 'sister', 'friend', 'women'];
  const targets = [...legacyTargets, 'lover'];
  const legacyDesignFields = ['theme', 'font', 'layout', 'decoration', 'effect', 'dedication', 'body'];
  const legacyDesignDefaults = ['rose', 'serif', 'classic', 'botanical', 'petals', '', ''];
  const legacyDesignChoices = [
    ['rose', 'sage', 'champagne', 'midnight'], ['serif', 'sans'],
    ['classic', 'centered'], ['botanical', 'stars', 'minimal'],
    ['petals', 'constellation', 'butterflies', 'none']
  ];
  const tones = ['all', 'short', 'warm', 'playful', 'moving', 'sweet', 'romantic'];
  // Positional fields and choice indexes are append-only: shared v4 cards keep
  // their original meaning when more gift experiences become available.
  const designFields = [...legacyDesignFields, 'scene', 'structure', 'ornament', 'intensity',
    'experience', 'size', 'reveal', 'showDate', 'showSignature', 'secret', 'giftIntro', 'flowerNotes', 'arrival', 'welcome', 'welcomeText', 'welcomeName', 'welcomeMusic', 'signatureText', 'signatureInk', 'signatureStyle'];
  const designChoices = [
    ['rose', 'sage', 'champagne', 'midnight', 'teal', 'lilac'],
    ['serif', 'sans', 'italic', 'handwriting'],
    ...legacyDesignChoices.slice(2), null, null,
    ['stardust', 'aurora', 'bloom', 'rose', 'sunrise', 'lotus', 'moonlight', 'butterflies', 'envelope', 'layers', 'crystal', 'orbits', 'bouquet', 'galaxy',
      'umbrella', 'storybook', 'island', 'ocean', 'balloon', 'lantern', 'wishtree', 'silk', 'lightbridge', 'musicbox', 'glassgarden', 'wisteria', 'lotusmoon', 'sunmail', 'lavender', 'heartgarden'],
    ['letter', 'arch', 'postcard', 'folded'], ['botanical', 'orbit', 'pressed'],
    ['cinematic', 'medium', 'gentle', 'off'],
    ['galaxy', 'aurora', 'garden', 'rose', 'sunflower', 'lotus', 'moonlake', 'butterfly', 'letter', 'pearl', 'crystal', 'lovegalaxy',
      'umbrella', 'storybook', 'island', 'ocean', 'balloon', 'lantern', 'wishtree', 'silk', 'lightbridge', 'musicbox', 'glassgarden', 'wisteria', 'lotusmoon', 'sunmail', 'lavender', 'heartgarden'],
    ['small', 'medium', 'large'], ['instant', 'gentle', 'slow'], ['on', 'off'], ['on', 'off'], null, null, null,
    ['stardust', 'growing', 'classic'], ['none','bebe'], null, null, ['on','off'], null, null, ['classic','script','minimal','seal']
  ];
  const rootFields = new Set(['v', 'target', 'variant', 'recipientName', 'senderName', 'pronoun',
    'sampleIndex', 'message', 'musicId', 'design', 'recipientPronoun', 'tone', 'greeting', 'volume']);
  const dangerous = key => ['__proto__', 'prototype', 'constructor'].includes(key);
  const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  function trimDefaults(array) {
    while (array.length > 1 && array[array.length - 1] === null) array.pop();
    return array;
  }
  function text(value, fallback = '') {
    if (value === undefined || value === null) return fallback;
    if (typeof value !== 'string') throw new Error('Invalid card text');
    return value;
  }
  function limitedText(value, limit, fallback = '') {
    if (value === undefined) value = fallback;
    if (typeof value !== 'string' || value.length > limit) throw new Error('Invalid card text');
    return value;
  }
  function defaultVariant(target) { return target === 'sister' ? 'older' : target === 'women' ? 'one' : ''; }
  function defaultPronoun(target, variant) {
    return target === 'sister' ? (variant === 'younger' ? 'anh' : 'em') :
      ({ mom: 'con', grandma: 'cháu', teacher: 'em', friend: 'mình', women: 'tôi', lover: 'anh' })[target];
  }
  function parseJSON(source) {
    if (typeof source !== 'string' || source.length > MAX_TEXT_LENGTH) throw new Error('Card text exceeds limit');
    // JSON parsing does not assign prototypes. Reject dangerous keys and deep nested
    // values iteratively so malicious JSON cannot exhaust a recursive reviver.
    const value = JSON.parse(source);
    const pending = [[value, 0]];
    while (pending.length) {
      const [item, depth] = pending.pop();
      if (item === null || typeof item !== 'object') continue;
      if (depth > 8) throw new Error('Invalid card nesting');
      for (const key of Object.keys(item)) {
        if (dangerous(key)) throw new Error('Invalid card key');
        pending.push([item[key], depth + 1]);
      }
    }
    return value;
  }
  function designText(value, key) {
    if(key==='signatureInk'){
      const ink=limitedText(value,1215);if(!ink)return ink;const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-',strokes=ink.split('.');let points=0;
      if(strokes.length>16)throw new Error('Too many signature strokes');
      for(const stroke of strokes){if(stroke.length<6||stroke.length%3||!/^[A-Za-z0-9_-]+$/.test(stroke))throw new Error('Invalid signature');for(let i=0;i<stroke.length;i+=3){const n=alphabet.indexOf(stroke[i])*4096+alphabet.indexOf(stroke[i+1])*64+alphabet.indexOf(stroke[i+2]);if((n>>8)>600||(n&255)>180||++points>400)throw new Error('Invalid signature point');}}return ink;
    }
    if(key==='signatureStyle'){if(!['classic','script','minimal','seal'].includes(value))throw new Error('Invalid signature style');return value;}
    if(key==='welcomeMusic'){if(!['on','off'].includes(value))throw new Error('Invalid welcome music');return value;}
    if(key==='welcome'){if(!['none','bebe'].includes(value))throw new Error('Invalid welcome');return value;}
    if (key === 'arrival') {
      if (!['stardust', 'growing', 'classic'].includes(value)) throw new Error('Invalid bouquet arrival');
      return value;
    }
    if (key === 'flowerNotes') {
      // JSON can escape each UTF-16 code unit with six characters. Bound the
      // encoded string before parsing, then validate its small, flat structure.
      const source = limitedText(value, 5 * (160 * 6 + 3) + 1);
      const notes = JSON.parse(source);
      if (!Array.isArray(notes) || notes.length > 5 ||
          notes.some(note => typeof note !== 'string' || note.length > 160)) {
        throw new Error('Invalid flower notes');
      }
      return source;
    }
    const limit = key==='signatureText'?80:key === 'welcomeName' ? 30 : key === 'body' ? 3000 : key === 'secret' ? 1000 :
      (key === 'giftIntro'||key==='welcomeText') ? 160 : key === 'dedication' ? 100 : 40;
    return limitedText(value, limit);
  }
  function packDesign(design) {
    if (!isRecord(design)) throw new Error('Invalid card design');
    for (const key of Object.keys(design)) {
      if (!designFields.includes(key)) throw new Error('Invalid design key');
    }
    return trimDefaults(designFields.map((key, index) => {
      // All fields are optional in the wire schema. Missing fields stay missing,
      // including future UI defaults; explicitly supplied empty strings survive.
      if (design[key] === undefined) return null;
      const value = designText(design[key], key);
      const choice = designChoices[index]?.indexOf(value);
      return choice !== undefined && choice >= 0 ? choice : value;
    }));
  }
  function unpackDesign(packed) {
    if (packed === undefined || packed === null) return {};
    if (!Array.isArray(packed) || packed.length > designFields.length) throw new Error('Invalid card design');
    const design = {};
    designFields.forEach((key, index) => {
      let value = packed[index];
      if (value === undefined || value === null) return;
      if (typeof value === 'number') {
        const choices = designChoices[index];
        if (!Number.isInteger(value) || !choices || value < 0 || value >= choices.length) throw new Error('Invalid design choice');
        value = choices[value];
      }
      design[key] = designText(value, key);
    });
    return design;
  }
  // Frozen wire v5 character table: common Vietnamese code points cost eight
  // bits on first use rather than sixteen. Latin-1 bytes are escaped losslessly.
  // Never reorder/edit these v5 tables. v3/v4 remain unchanged; callers choose
  // the shorter full-content encoding.
  const vietnameseWide='ĂăĐđĨĩŨũƠơƯư'+Array.from({length:90},(_,i)=>String.fromCharCode(0x1ea0+i)).join('');
  const vietnameseCodes=new Map(Array.from(vietnameseWide,(character,index)=>[character,String.fromCharCode(128+index)]));
  const vietnamesePhrases=['yêu thương','hạnh phúc','bình yên','Nhân ngày','nhiều ','những ','luôn ','được ','thật ','ngày ','20/10','một ','Mong ','người ','thương','chúc ','của ','và ','cho ','với ','có ','con ','mẹ ','anh ','em '];
  function packVietnamese(source){
    let result='';
    for(let i=0;i<source.length;){
      const phrase=vietnamesePhrases.findIndex(value=>source.startsWith(value,i));
      if(phrase>=0){result+=String.fromCharCode(230+phrase);i+=vietnamesePhrases[phrase].length;continue;}
      const character=source[i++],mapped=vietnameseCodes.get(character),code=character.charCodeAt(0);
      result+=mapped===undefined?(code>=128&&code<=255?'ÿ'+character:character):mapped;
    }
    return result;
  }
  function unpackVietnamese(source){
    let result='';
    for(let i=0;i<source.length;i++){
      const code=source.charCodeAt(i);
      if(code===255){
        const escaped=source.charCodeAt(++i);
        if(!(escaped>=128&&escaped<=255))throw new Error('Invalid Vietnamese escape');
        result+=source[i];
      }else if(code>=230&&code<=254)result+=vietnamesePhrases[code-230];
      else result+=code>=128&&code<128+vietnameseWide.length?vietnameseWide[code-128]:source[i];
      if(result.length>MAX_TEXT_LENGTH)throw new Error('Card text exceeds limit');
    }
    return result;
  }
  function encodeCompact(payload){return encode(payload,true);}
  function encode(payload, compact=false) {
    if (!isRecord(payload)) throw new Error('Invalid card');
    for (const key of Object.keys(payload)) {
      if (!rootFields.has(key)) throw new Error('Invalid card field');
    }
    const target = payload.target === undefined ? 'mom' : payload.target;
    const targetIndex = targets.indexOf(target);
    if (targetIndex < 0) throw new Error('Invalid recipient');
    const variant = limitedText(payload.variant, 30, defaultVariant(target));
    const pronoun = limitedText(payload.pronoun, 30, defaultPronoun(target, variant));
    const musicId = limitedText(payload.musicId, 30, `${target}:0`);
    if (!new RegExp(`^${target}:(?:[0-9]|1[0-9])$`).test(musicId)) throw new Error('Invalid card song');
    const track = Number(musicId.slice(musicId.lastIndexOf(':') + 1));
    const sample = payload.sampleIndex === undefined ? 0 : payload.sampleIndex;
    if (!Number.isInteger(sample) || sample < 0 || sample > 1000) throw new Error('Invalid card sample');
    const tone = payload.tone === undefined ? 'all' : payload.tone;
    const toneIndex = tones.indexOf(tone);
    if (toneIndex < 0) throw new Error('Invalid card tone');
    const volume = payload.volume === undefined ? 30 : payload.volume;
    if (typeof volume !== 'number' || !Number.isFinite(volume) || volume < 0 || volume > 100) throw new Error('Invalid card volume');
    const design = packDesign(payload.design === undefined ? {} : payload.design);
    const packed = trimDefaults([
      4, targetIndex || null,
      variant === defaultVariant(target) ? null : variant,
      limitedText(payload.recipientName, 100) || null,
      limitedText(payload.senderName, 100) || null,
      pronoun === defaultPronoun(target, variant) ? null : pronoun,
      sample || null, limitedText(payload.message, 1000) || null,
      track || null, design.every(value => value === null) ? null : design,
      limitedText(payload.recipientPronoun, 30) || null,
      toneIndex || null, limitedText(payload.greeting, 3000) || null,
      volume === 30 ? null : volume
    ]);
    const source = JSON.stringify(packed);
    if (source.length > MAX_TEXT_LENGTH) throw new Error('Card text exceeds limit');
    let hash = '#c=' + compress(source, 6, value => alphabet.charAt(value));
    if(compact){
      const compactSource=packVietnamese(source.replace(/^\[4/, '[5'));
      if(compactSource.length<=MAX_TEXT_LENGTH){
        const alternate='#c='+compress(compactSource,6,value=>alphabet.charAt(value));
        if(alternate.length<hash.length)hash=alternate;
      }
    }
    if (hash.length > MAX_FRAGMENT_LENGTH) throw new Error('Card link exceeds limit');
    return hash;
  }
  function decodeLegacyPacked(packed) {
    if (packed.length > 10) throw new Error('Unsupported card encoding');
    const targetIndex = packed[1] ?? 0;
    if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= legacyTargets.length) throw new Error('Invalid recipient');
    const target = legacyTargets[targetIndex];
    const variant = text(packed[2], defaultVariant(target));
    const sampleIndex = packed[6] ?? 0;
    if (!Number.isInteger(sampleIndex) || sampleIndex < 0 || sampleIndex > 1000) throw new Error('Invalid card sample');
    const track = packed[8] ?? 0;
    if (typeof track !== 'string' && (!Number.isInteger(track) || track < 0 || track > 19)) throw new Error('Invalid card song');
    const design = Object.fromEntries(legacyDesignFields.map((key, index) => [key, legacyDesignDefaults[index]]));
    const packedDesign = packed[9];
    if (packedDesign !== undefined && packedDesign !== null) {
      if (!Array.isArray(packedDesign) || packedDesign.length > 8) throw new Error('Invalid card design');
      legacyDesignFields.forEach((key, index) => {
        let value = packedDesign[index];
        if (value === undefined || value === null) return;
        if (typeof value === 'number') {
          const choices = legacyDesignChoices[index];
          if (!Number.isInteger(value) || !choices || value < 0 || value >= choices.length) throw new Error('Invalid design choice');
          value = choices[value];
        }
        design[key] = text(value);
      });
      const extras = packedDesign[7];
      if (extras !== undefined && extras !== null) {
        if (!isRecord(extras)) throw new Error('Invalid card design');
        for (const [key, value] of Object.entries(extras)) {
          if (dangerous(key) || legacyDesignFields.includes(key)) throw new Error('Invalid design key');
          design[key] = text(value);
        }
      }
    }
    // Preserve the original version and defaults. The application migrates old
    // greetings and the old women:0 track without changing their meaning here.
    return {
      v: 2, target, variant, recipientName: text(packed[3]),
      senderName: text(packed[4], 'Hồng Gia Bảo'),
      pronoun: text(packed[5], defaultPronoun(target, variant)),
      sampleIndex, message: text(packed[7]),
      musicId: typeof track === 'number' ? `${target}:${track}` : track, design
    };
  }
  function decodeV4(packed) {
    if (packed.length > 14) throw new Error('Unsupported card encoding');
    const targetIndex = packed[1] ?? 0;
    if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= targets.length) throw new Error('Invalid recipient');
    const target = targets[targetIndex];
    const variant = limitedText(packed[2] ?? undefined, 30, defaultVariant(target));
    const sampleIndex = packed[6] ?? 0;
    if (!Number.isInteger(sampleIndex) || sampleIndex < 0 || sampleIndex > 1000) throw new Error('Invalid card sample');
    const track = packed[8] ?? 0;
    if (!Number.isInteger(track) || track < 0 || track > 19) throw new Error('Invalid card song');
    const toneIndex = packed[11] ?? 0;
    if (!Number.isInteger(toneIndex) || toneIndex < 0 || toneIndex >= tones.length) throw new Error('Invalid card tone');
    const volume = packed[13] ?? 30;
    if (typeof volume !== 'number' || !Number.isFinite(volume) || volume < 0 || volume > 100) throw new Error('Invalid card volume');
    return {
      v: 4, target, variant,
      recipientName: limitedText(packed[3] ?? undefined, 100),
      senderName: limitedText(packed[4] ?? undefined, 100),
      pronoun: limitedText(packed[5] ?? undefined, 30, defaultPronoun(target, variant)),
      sampleIndex, message: limitedText(packed[7] ?? undefined, 1000),
      musicId: `${target}:${track}`, design: unpackDesign(packed[9]),
      recipientPronoun: limitedText(packed[10] ?? undefined, 30),
      tone: tones[toneIndex], greeting: limitedText(packed[12] ?? undefined, 3000), volume
    };
  }
  function decode(hash) {
    if (typeof hash !== 'string' || hash.length > MAX_FRAGMENT_LENGTH) throw new Error('Invalid card link');
    if (hash.startsWith('#card=')) return parseJSON(decodeURIComponent(hash.slice(6)));
    if (!hash.startsWith('#c=')) throw new Error('Invalid card link');
    const input = hash.slice(3);
    if (!input.length || !/^[A-Za-z0-9_-]+$/.test(input)) throw new Error('Invalid card encoding');
    const source = decompress(input.length, 32, index => alphabet.indexOf(input.charAt(index)));
    if (!source) throw new Error('Invalid compressed card');
    const isVietnamese=/^\[5(?:,|\])/.test(source);
    const packed = parseJSON(isVietnamese?unpackVietnamese(source):source);
    if(isVietnamese)packed[0]=4;
    if (!Array.isArray(packed)) throw new Error('Unsupported card encoding');
    if (packed[0] === 3) return decodeLegacyPacked(packed);
    if (packed[0] === 4) return decodeV4(packed);
    throw new Error('Unsupported card encoding');
  }
  return Object.freeze({ encode, decode, encodeCompact });
})();
