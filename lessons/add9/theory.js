/* Cadd9 theory: spelling, piano voicing, movable guitar grips.
   Standard tuning MIDI, scientific pitch (C4 = 60 = middle C):
   E2 A2 D3 G3 B3 E4 = 40, 45, 50, 55, 59, 64. */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ChordTheory = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  var INTERVAL = { root: 0, third: 4, fifth: 7, ninth: 2 };
  var ROLES = ["root", "third", "fifth", "ninth"];

  var KEYS = [
    { id: "C", name: "C", pc: 0, acc: "sharp", tones: ["C", "E", "G", "D"] },
    { id: "Db", name: "D♭", pc: 1, acc: "flat", tones: ["D♭", "F", "A♭", "E♭"] },
    { id: "D", name: "D", pc: 2, acc: "sharp", tones: ["D", "F♯", "A", "E"] },
    { id: "Eb", name: "E♭", pc: 3, acc: "flat", tones: ["E♭", "G", "B♭", "F"] },
    { id: "E", name: "E", pc: 4, acc: "sharp", tones: ["E", "G♯", "B", "F♯"] },
    { id: "F", name: "F", pc: 5, acc: "flat", tones: ["F", "A", "C", "G"] },
    { id: "Fs", name: "F♯", pc: 6, acc: "sharp", tones: ["F♯", "A♯", "C♯", "G♯"] },
    { id: "G", name: "G", pc: 7, acc: "sharp", tones: ["G", "B", "D", "A"] },
    { id: "Ab", name: "A♭", pc: 8, acc: "flat", tones: ["A♭", "C", "E♭", "B♭"] },
    { id: "A", name: "A", pc: 9, acc: "sharp", tones: ["A", "C♯", "E", "B"] },
    { id: "Bb", name: "B♭", pc: 10, acc: "flat", tones: ["B♭", "D", "F", "C"] },
    { id: "B", name: "B", pc: 11, acc: "sharp", tones: ["B", "D♯", "F♯", "C♯"] }
  ];

  var SHARP_NAMES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
  var FLAT_NAMES = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];

  /* Low E to high e. frets are the Cadd9 grip; null is muted.
     Fingers: 1 index, 2 middle, 3 ring, 4 pinky. */
  var SHAPES = [
    {
      id: "a-root",
      group: "low",
      name: "A 弦根音",
      tag: "常用移动形",
      frets: [null, 3, 5, 5, 3, 3],
      fingers: [null, 1, 3, 4, 1, 1],
      barre: true,
      blurb:
        "食指横按同一品：A 弦的根音，加上 B 弦和高音 e。无名指按 D 弦，小指按 G 弦，这两根都比横按高两品。",
      note:
        "响出来的只有根音、五音和九音，没有三音。流行谱仍习惯标成 add9，三音多半交给钢琴或人声。"
    },
    {
      id: "d-root",
      group: "high",
      name: "D 弦根音",
      tag: "四音 · 紧凑",
      frets: [null, null, 10, 9, 8, 10],
      fingers: [null, null, 3, 2, 1, 4],
      barre: false,
      blurb:
        "食指按 B 弦，中指按 G 弦，无名指按 D 弦，小指按高音 e。跨度只有两品。低音 E 和 A 闷住。",
      note: "根音、三音、五音、九音都在，是这组高把位的基本形。"
    },
    {
      id: "low-e",
      group: "high",
      name: "低音 E 根音",
      tag: "闷住 A 弦",
      frets: [8, null, 10, 9, 8, 10],
      fingers: [1, null, 3, 2, 1, 4],
      barre: true,
      blurb:
        "食指同时按住低音 E 和 B 弦（同一品），指腹轻轻贴住 A 弦，让它不响。中指、无名指、小指和四音把位一样。",
      note: "低音是根音。比六弦都按好按，A 弦空过。"
    },
    {
      id: "full",
      group: "high",
      name: "低音 E，六弦都响",
      tag: "根音加五音",
      frets: [8, 10, 10, 9, 8, 10],
      fingers: [1, 3, 3, 2, 1, 4],
      barre: true,
      blurb:
        "食指横按最低那一品。中指在高一品按 G 弦，无名指在高两品同时按 A 弦和 D 弦，小指按高音 e。A、D 已被无名指按住，食指不会把它们变成别的音。",
      note: "六根弦响的都是根音、三音、五音或九音。无名指要平按相邻的两根弦。"
    },
    {
      id: "fifth-bass",
      group: "high",
      name: "五音在低音",
      tag: "转位",
      frets: [null, 10, 10, 9, 8, 10],
      fingers: [null, 3, 3, 2, 1, 4],
      barre: false,
      blurb:
        "和四音紧凑形是同一把，无名指多按一根 A 弦，低音就变成五音。低音 E 仍然闷住。",
      note: "没有六音，也没有七音。适合副歌不想用根音当最低音的时候。"
    }
  ];

  var OPEN_MIDI = [40, 45, 50, 55, 59, 64];
  var OPEN_NAME = ["E2", "A2", "D3", "G3", "B3", "E4"];
  var STRING_NAME = ["低音 E", "A", "D", "G", "B", "高音 e"];

  function keyById(id) {
    for (var i = 0; i < KEYS.length; i++) if (KEYS[i].id === id) return KEYS[i];
    return KEYS[0];
  }

  function pcOf(midi) {
    return ((midi % 12) + 12) % 12;
  }

  function octaveOf(midi) {
    return Math.floor(midi / 12) - 1;
  }

  function toneOf(midi, key) {
    var pc = pcOf(midi);
    for (var i = 0; i < ROLES.length; i++) {
      if ((key.pc + INTERVAL[ROLES[i]]) % 12 === pc) return ROLES[i];
    }
    return null;
  }

  /* Chord-tone labels relative to the key root. R stays distinct from 1. */
  var DEGREE_BY_INTERVAL = {
    0: "R",
    1: "b9",
    2: "9",
    3: "b3",
    4: "3",
    5: "11",
    6: "#11",
    7: "5",
    8: "#5",
    9: "13",
    10: "b7",
    11: "7"
  };
  var DEGREE_BY_ROLE = { root: "R", third: "3", fifth: "5", ninth: "9" };

  function degreeOf(midi, key) {
    var role = toneOf(midi, key);
    if (role && DEGREE_BY_ROLE[role]) return DEGREE_BY_ROLE[role];
    return DEGREE_BY_INTERVAL[(pcOf(midi) - key.pc + 12) % 12];
  }

  function spell(midi, key) {
    var role = toneOf(midi, key);
    var name;
    if (role) {
      name = key.tones[ROLES.indexOf(role)];
    } else {
      var names = key.acc === "flat" ? FLAT_NAMES : SHARP_NAMES;
      name = names[pcOf(midi)];
    }
    return name + octaveOf(midi);
  }

  function chordPcs(key) {
    return ROLES.map(function (role) {
      return (key.pc + INTERVAL[role]) % 12;
    });
  }

  /* Left hand: root in octave 3. Right hand, low to high: fifth, ninth, third.
     Intervals from the bass root: 0, +7, +14, +16. */
  function pianoNotes(key) {
    var root = 48 + key.pc;
    return [
      { midi: root, role: "root", hand: "left" },
      { midi: root + 7, role: "fifth", hand: "right" },
      { midi: root + 14, role: "ninth", hand: "right" },
      { midi: root + 16, role: "third", hand: "right" }
    ];
  }

  /* Bass stays in octave 2, with the root repeated an octave up for a short walk. */
  function bassNotes(key) {
    var root = 36 + key.pc;
    return [
      { midi: root, role: "root" },
      { midi: root + 7, role: "fifth" },
      { midi: root + 12, role: "root" }
    ];
  }

  /* Slide the C grip by the key's semitone offset.
     If the whole shape would start at fret 13 or higher, drop an octave.
     Never land on an open string (fret 0) or below the nut. */
  function placeShape(shape, key) {
    var shift = key.pc;
    var frets = shape.frets.map(function (fret) {
      return fret == null ? null : fret + shift;
    });
    function sounding() {
      return frets.filter(function (fret) {
        return fret != null;
      });
    }
    while (Math.min.apply(null, sounding()) >= 13) {
      frets = frets.map(function (fret) {
        return fret == null ? null : fret - 12;
      });
    }
    while (sounding().some(function (fret) { return fret < 1; })) {
      frets = frets.map(function (fret) {
        return fret == null ? null : fret + 12;
      });
    }
    var midis = frets.map(function (fret, i) {
      return fret == null ? null : OPEN_MIDI[i] + fret;
    });
    return {
      frets: frets,
      fingers: shape.fingers.slice(),
      midis: midis,
      notation: frets.map(function (fret) { return fret == null ? "x" : String(fret); }).join("-")
    };
  }

  function stringsOf(placed, key) {
    return placed.frets.map(function (fret, i) {
      if (fret == null) {
        return {
          index: i,
          muted: true,
          fret: null,
          finger: null,
          midi: null,
          name: null,
          role: null,
          degree: null,
          openName: OPEN_NAME[i],
          stringName: STRING_NAME[i]
        };
      }
      var midi = placed.midis[i];
      return {
        index: i,
        muted: false,
        fret: fret,
        finger: placed.fingers[i],
        midi: midi,
        name: spell(midi, key),
        role: toneOf(midi, key),
        degree: degreeOf(midi, key),
        openName: OPEN_NAME[i],
        stringName: STRING_NAME[i]
      };
    });
  }

  return {
    KEYS: KEYS,
    SHAPES: SHAPES,
    OPEN_MIDI: OPEN_MIDI,
    OPEN_NAME: OPEN_NAME,
    STRING_NAME: STRING_NAME,
    INTERVAL: INTERVAL,
    keyById: keyById,
    pcOf: pcOf,
    octaveOf: octaveOf,
    toneOf: toneOf,
    degreeOf: degreeOf,
    spell: spell,
    chordPcs: chordPcs,
    pianoNotes: pianoNotes,
    bassNotes: bassNotes,
    placeShape: placeShape,
    stringsOf: stringsOf
  };
});
