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
    sus2: [0, 2, 7],
    sus4: [0, 5, 7],
    dim7: [0, 3, 6, 9],
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
    } else if (rest.indexOf("m7") === 0) {
      quality = "m7";
      rest = rest.slice(2);
    } else if (rest.indexOf("dim7") === 0) {
      quality = "dim7";
      rest = rest.slice(4);
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

  return {
    parseSymbol: parseSymbol,
    notesFromPc: notesFromPc,
    notes: notes,
    RECIPES: RECIPES
  };
});
