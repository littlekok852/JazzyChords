/* Chord-symbol voicings for the short song loops.
   Block chords only: no melody and no lyrics. */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ChordVoice = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  var NAMES = {
    C: 0,
    "C#": 1, Db: 1,
    D: 2,
    "D#": 3, Eb: 3,
    E: 4,
    F: 5,
    "F#": 6, Gb: 6,
    G: 7,
    "G#": 8, Ab: 8,
    A: 9,
    "A#": 10, Bb: 10,
    B: 11
  };

  /* Semitones above the chord root in octave 3. */
  var RECIPES = {
    maj: [0, 7, 16],
    add9: [0, 7, 14, 16],
    madd9: [0, 3, 7, 14],
    "6": [0, 7, 9, 16],
    "69": [0, 7, 9, 14, 16],
    m: [0, 3, 7],
    m7: [0, 3, 7, 10],
    m9: [0, 3, 10, 14],
    "7": [0, 4, 7, 10],
    "9": [0, 4, 10, 14],
    "13": [0, 4, 10, 21],
    "7sus4": [0, 5, 7, 10],
    "7b9": [0, 4, 10, 13],
    "7#9": [0, 4, 10, 15],
    "7#11": [0, 4, 10, 18],
    "7b13": [0, 4, 10, 20],
    "7#5": [0, 4, 8, 10],
    alt: [0, 4, 10, 13, 18],
    sus2: [0, 2, 7],
    sus4: [0, 5, 7],
    dim7: [0, 3, 6, 9],
    dim: [0, 3, 6],
    m7b5: [0, 3, 6, 10],
    maj7: [0, 7, 11, 16],
    maj9: [0, 11, 14, 16]
  };

  function parseSymbol(symbol) {
    var raw = String(symbol).trim();
    var match = raw.match(/^([A-G])([b#]?)(.*)$/);
    if (!match || !Object.prototype.hasOwnProperty.call(NAMES, match[1] + match[2])) {
      throw new Error("unknown chord " + symbol);
    }
    var rootName = match[1] + match[2];
    var rest = match[3];
    var quality = "maj";
    if (rest.indexOf("6/9") === 0) {
      quality = "69";
      rest = rest.slice(3);
    } else if (rest.indexOf("madd9") === 0) {
      quality = "madd9";
      rest = rest.slice(5);
    } else if (rest.indexOf("add9") === 0) {
      quality = "add9";
      rest = rest.slice(4);
    } else if (rest.indexOf("maj9") === 0) {
      quality = "maj9";
      rest = rest.slice(4);
    } else if (rest.indexOf("maj7") === 0) {
      quality = "maj7";
      rest = rest.slice(4);
    } else if (rest.indexOf("m9") === 0) {
      quality = "m9";
      rest = rest.slice(2);
    } else if (rest.indexOf("m7b5") === 0) {
      quality = "m7b5";
      rest = rest.slice(4);
    } else if (rest.indexOf("m7") === 0) {
      quality = "m7";
      rest = rest.slice(2);
    } else if (rest.indexOf("dim7") === 0) {
      quality = "dim7";
      rest = rest.slice(4);
    } else if (rest.indexOf("dim") === 0) {
      quality = "dim";
      rest = rest.slice(3);
    } else if (rest.indexOf("sus2") === 0) {
      quality = "sus2";
      rest = rest.slice(4);
    } else if (rest.indexOf("sus4") === 0) {
      quality = "sus4";
      rest = rest.slice(4);
    } else if (rest.indexOf("7sus4") === 0) {
      quality = "7sus4";
      rest = rest.slice(5);
    } else if (rest.indexOf("7b9") === 0) {
      quality = "7b9";
      rest = rest.slice(3);
    } else if (rest.indexOf("7#9") === 0) {
      quality = "7#9";
      rest = rest.slice(3);
    } else if (rest.indexOf("7#11") === 0) {
      quality = "7#11";
      rest = rest.slice(4);
    } else if (rest.indexOf("7b13") === 0) {
      quality = "7b13";
      rest = rest.slice(4);
    } else if (rest.indexOf("7#5") === 0) {
      quality = "7#5";
      rest = rest.slice(3);
    } else if (rest.indexOf("7alt") === 0) {
      quality = "alt";
      rest = rest.slice(4);
    } else if (rest.indexOf("13") === 0) {
      quality = "13";
      rest = rest.slice(2);
    } else if (rest.indexOf("9") === 0) {
      quality = "9";
      rest = rest.slice(1);
    } else if (rest.indexOf("6") === 0) {
      quality = "6";
      rest = rest.slice(1);
    } else if (rest.indexOf("m") === 0) {
      quality = "m";
      rest = rest.slice(1);
    } else if (rest.indexOf("7") === 0) {
      quality = "7";
      rest = rest.slice(1);
    }
    var bass = null;
    if (rest.charAt(0) === "/") {
      var bassName = rest.slice(1);
      if (!Object.prototype.hasOwnProperty.call(NAMES, bassName)) throw new Error("unknown chord " + symbol);
      bass = NAMES[bassName];
    } else if (rest !== "") {
      throw new Error("unknown chord " + symbol);
    }
    return { root: NAMES[rootName], quality: quality, bass: bass, symbol: raw };
  }

  function notesFromPc(pc, quality, bassPc) {
    var recipe = RECIPES[quality];
    if (!recipe) throw new Error("unknown quality " + quality);
    var root = 48 + ((pc % 12) + 12) % 12;
    var notes = recipe.map(function (interval) { return root + interval; });
    if (bassPc != null) notes.unshift(36 + ((bassPc % 12) + 12) % 12);
    return notes;
  }

  function notes(symbol) {
    var parsed = parseSymbol(symbol);
    return notesFromPc(parsed.root, parsed.quality, parsed.bass);
  }

  /* Progression loops: 90 BPM, one bar per symbol.
     A token like Gsus4+G is one bar split evenly between those chords.
     Pass 1 is a sustained block. Pass 2 is eighth-note arpeggios that fill the same bars. */
  var BPM = 90;
  var BEAT = 60 / BPM;
  var BAR = BEAT * 4;
  var EIGHTH = BEAT / 2;
  var RELEASE = 0.03;
  var running = typeof WeakMap === "function" ? new WeakMap() : null;

  function slotsOf(symbols) {
    var slots = [];
    symbols.forEach(function (token) {
      var parts = String(token).split("+").map(function (part) { return part.trim(); }).filter(Boolean);
      if (!parts.length) return;
      var share = BAR / parts.length;
      parts.forEach(function (symbol) {
        slots.push({ symbol: symbol, duration: share });
      });
    });
    return slots;
  }

  function arpSequence(symbol, count) {
    var parsed = parseSymbol(symbol);
    var raw = notes(symbol);
    var chordNotes = parsed.bass == null ? raw : raw.slice(1);
    var recipe = RECIPES[parsed.quality];
    var byInterval = {};
    recipe.forEach(function (interval, index) {
      byInterval[((interval % 12) + 12) % 12] = chordNotes[index];
    });
    var prefer = [0, 7, 4, 11, 10, 3, 2, 5, 9, 1, 6, 8];
    var order = [];
    prefer.forEach(function (interval) {
      var midi = byInterval[interval];
      if (midi != null && order.indexOf(midi) < 0) order.push(midi);
    });
    chordNotes.forEach(function (midi) {
      if (order.indexOf(midi) < 0) order.push(midi);
    });
    if (!order.length) order = raw.slice();
    var seq = [];
    var step;
    for (step = 0; step < count; step++) seq.push(order[step % order.length]);
    if (parsed.bass != null) {
      seq[0] = raw[0];
      if (count > 4) seq[4] = raw[0];
    }
    return seq;
  }

  function progressionEvents(symbols) {
    var slots = slotsOf(symbols);
    var pass = slots.reduce(function (sum, slot) { return sum + slot.duration; }, 0);
    var events = [];
    var passIndex, cursor, slotIndex, slot, chord, step, count, seq, hit;
    for (passIndex = 0; passIndex < 2; passIndex++) {
      cursor = passIndex * pass;
      for (slotIndex = 0; slotIndex < slots.length; slotIndex++) {
        slot = slots[slotIndex];
        if (passIndex === 0) {
          chord = notes(slot.symbol);
          chord.forEach(function (midi) {
            events.push({
              kind: "block",
              symbol: slot.symbol,
              midi: midi,
              at: cursor,
              gain: chord.length > 4 ? 0.48 : 0.62,
              seconds: Math.max(0.25, slot.duration - RELEASE)
            });
          });
        } else {
          count = Math.max(1, Math.round(slot.duration / EIGHTH));
          seq = arpSequence(slot.symbol, count);
          for (step = 0; step < count; step++) {
            hit = cursor + step * EIGHTH;
            events.push({
              kind: "arp",
              symbol: slot.symbol,
              midi: seq[step],
              at: hit,
              gain: 0.5,
              seconds: Math.max(0.12, cursor + slot.duration - hit - RELEASE)
            });
          }
        }
        cursor += slot.duration;
      }
    }
    return { slots: slots, events: events, pass: pass, total: pass * 2, bpm: BPM };
  }

  function displaySymbols(symbols) {
    var names = [];
    symbols.forEach(function (token) {
      String(token).split("+").forEach(function (part) {
        if (part.trim()) names.push(part.trim());
      });
    });
    return names.join(" · ");
  }

  function statusLine(symbols) {
    return "在播 " + displaySymbols(symbols) + "。先柱式，再琶音，大约 90 拍。";
  }

  function stopProgression(eng) {
    if (!running) return;
    var previous = running.get(eng);
    if (!previous) return;
    previous.forEach(function (src) {
      try { src.stop(); } catch (err) { /* already ended */ }
    });
    running.delete(eng);
  }

  function playMelody(eng, notes, options) {
    var beat = BEAT;
    var repeats = options && options.repeats != null ? options.repeats : 2;
    var start = eng.ctx.currentTime + (options && options.leadIn != null ? options.leadIn : 0.05);
    var owned = [];
    var total = notes.reduce(function (sum, note) { return sum + note.beats; }, 0) * beat;
    var rep, cursor, index, note, dur, src;
    stopProgression(eng);
    if (running) running.set(eng, owned);
    for (rep = 0; rep < repeats; rep++) {
      cursor = start + rep * total;
      for (index = 0; index < notes.length; index++) {
        note = notes[index];
        dur = note.beats * beat;
        src = eng.playPiano(note.midi, cursor, note.gain || 0.72, Math.max(0.12, dur - RELEASE));
        if (src) owned.push(src);
        cursor += dur;
      }
    }
    return { beat: beat, total: total * repeats, bpm: BPM };
  }

  function playHits(eng, events, options) {
    var start = eng.ctx.currentTime + (options && options.leadIn != null ? options.leadIn : 0.05);
    var owned = [];
    var index, event, src;
    stopProgression(eng);
    if (running) running.set(eng, owned);
    for (index = 0; index < events.length; index++) {
      event = events[index];
      src = eng.playPiano(event.midi, start + event.at, event.gain || 0.62, event.seconds);
      if (src) owned.push(src);
    }
    return { count: events.length };
  }

  function playProgression(eng, symbols, options) {
    var plan = progressionEvents(symbols);
    var start = eng.ctx.currentTime + (options && options.leadIn != null ? options.leadIn : 0.05);
    var owned = [];
    stopProgression(eng);
    if (running) running.set(eng, owned);
    plan.events.forEach(function (event) {
      var src = eng.playPiano(event.midi, start + event.at, event.gain, event.seconds);
      if (src) owned.push(src);
      if (options && options.onEvent && event.kind === "block") {
        options.onEvent({ midi: event.midi, when: start + event.at, seconds: event.seconds, symbol: event.symbol });
      }
    });
    return plan;
  }

  return {
    parseSymbol: parseSymbol,
    notesFromPc: notesFromPc,
    notes: notes,
    RECIPES: RECIPES,
    BPM: BPM,
    progressionEvents: progressionEvents,
    displaySymbols: displaySymbols,
    statusLine: statusLine,
    playProgression: playProgression,
    playMelody: playMelody,
    playHits: playHits
  };
});
