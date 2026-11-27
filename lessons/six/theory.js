/* 6 and 6/9: spelling, piano voicing, movable guitar grips.
   Standard tuning MIDI, C4 = 60. Low E to high e = 40, 45, 50, 55, 59, 64.
   No 7th. The major sixth is labeled 6, not 13. */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ChordTheory = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  var INTERVAL = { root: 0, third: 4, fifth: 7, sixth: 9, ninth: 2 };
  var ROLES = {
    "6": ["root", "third", "fifth", "sixth"],
    "69": ["root", "third", "fifth", "sixth", "ninth"]
  };

  var KEYS = [
    { id: "C", name: "C", pc: 0, acc: "sharp", tones6: ["C", "E", "G", "A"], tones69: ["C", "E", "G", "A", "D"] },
    { id: "Db", name: "D♭", pc: 1, acc: "flat", tones6: ["D♭", "F", "A♭", "B♭"], tones69: ["D♭", "F", "A♭", "B♭", "E♭"] },
    { id: "D", name: "D", pc: 2, acc: "sharp", tones6: ["D", "F♯", "A", "B"], tones69: ["D", "F♯", "A", "B", "E"] },
    { id: "Eb", name: "E♭", pc: 3, acc: "flat", tones6: ["E♭", "G", "B♭", "C"], tones69: ["E♭", "G", "B♭", "C", "F"] },
    { id: "E", name: "E", pc: 4, acc: "sharp", tones6: ["E", "G♯", "B", "C♯"], tones69: ["E", "G♯", "B", "C♯", "F♯"] },
    { id: "F", name: "F", pc: 5, acc: "flat", tones6: ["F", "A", "C", "D"], tones69: ["F", "A", "C", "D", "G"] },
    { id: "Fs", name: "F♯", pc: 6, acc: "sharp", tones6: ["F♯", "A♯", "C♯", "D♯"], tones69: ["F♯", "A♯", "C♯", "D♯", "G♯"] },
    { id: "G", name: "G", pc: 7, acc: "sharp", tones6: ["G", "B", "D", "E"], tones69: ["G", "B", "D", "E", "A"] },
    { id: "Ab", name: "A♭", pc: 8, acc: "flat", tones6: ["A♭", "C", "E♭", "F"], tones69: ["A♭", "C", "E♭", "F", "B♭"] },
    { id: "A", name: "A", pc: 9, acc: "sharp", tones6: ["A", "C♯", "E", "F♯"], tones69: ["A", "C♯", "E", "F♯", "B"] },
    { id: "Bb", name: "B♭", pc: 10, acc: "flat", tones6: ["B♭", "D", "F", "G"], tones69: ["B♭", "D", "F", "G", "C"] },
    { id: "B", name: "B", pc: 11, acc: "sharp", tones6: ["B", "D♯", "F♯", "G♯"], tones69: ["B", "D♯", "F♯", "G♯", "C♯"] }
  ];

  var SHARP_NAMES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
  var FLAT_NAMES = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];

  var SHAPES = {
    "6": [
      {
        id: "a6",
        group: "low",
        name: "A 弦根音",
        tag: "常用移动形",
        frets: [null, 3, 5, 5, 5, 5],
        fingers: [null, 1, 3, 3, 4, 4],
        barre: true,
        blurb: "食指按住 A 弦的根音。D、G、B 在高两品，无名指摊过去，小指再按高音 e。高音 e 比大三和弦那把高了两品，那个音就是六音。",
        note: "根音、三音、五音、六音都在。没有九音，也没有七音。"
      },
      {
        id: "d6",
        group: "high",
        name: "D 弦根音",
        tag: "四音 · 紧凑",
        frets: [null, null, 10, 12, 10, 12],
        fingers: [null, null, 1, 3, 2, 4],
        barre: false,
        blurb: "食指按 D 弦，中指按 B 弦，这两根同一品。无名指按 G 弦，小指按高音 e，高两品。低音 E 和 A 闷住。",
        note: "四音都在，仍然没有九音。"
      },
      {
        id: "e6",
        group: "high",
        name: "低音 E 根音",
        tag: "六弦都响",
        frets: [8, 10, 10, 9, 10, 8],
        fingers: [1, 3, 3, 2, 4, 1],
        barre: true,
        blurb: "食指横按最低那一品，低音 E 和高音 e 都在食指上。中指按 G 弦，无名指按 A 和 D，小指按 B 弦。小指比食指高两品，那是六音。",
        note: "六根弦响的都是根音、三音、五音或六音。"
      }
    ],
    "69": [
      {
        id: "a69",
        group: "low",
        name: "A 弦根音",
        tag: "五音都在",
        frets: [null, 3, 2, 2, 3, 3],
        fingers: [null, 2, 1, 1, 3, 4],
        barre: false,
        blurb: "中指按 A 弦的根音。食指躺在低一品，按住 D 和 G。无名指按 B 弦，小指按高音 e，和根音同一品。",
        note: "根音、三音、五音、六音、九音都响。没有七音。"
      },
      {
        id: "d69",
        group: "high",
        name: "D 弦根音",
        tag: "四音 · 紧凑",
        frets: [null, null, 10, 9, 10, 10],
        fingers: [null, null, 1, 2, 3, 4],
        barre: false,
        blurb: "食指按 D 弦，中指按 G 弦，比食指低一品。无名指按 B 弦，小指按高音 e。低音 E 和 A 闷住。",
        note: "没有五音。五音在低音 E 那一把，或交给贝斯。"
      },
      {
        id: "e69",
        group: "high",
        name: "低音 E 根音",
        tag: "五音 · 跨一品",
        frets: [8, 7, 7, 7, 8, 8],
        fingers: [2, 1, 1, 1, 3, 4],
        barre: true,
        blurb: "食指按较低的那一品，发声的是 A、D、G。高一品：中指按低音 E，无名指按 B，小指按高音 e。",
        note: "五个音都在，低音是根音。两品之内，比大横按好按。"
      }
    ]
  };

  var OPEN_MIDI = [40, 45, 50, 55, 59, 64];
  var OPEN_NAME = ["E2", "A2", "D3", "G3", "B3", "E4"];
  var STRING_NAME = ["低音 E", "A", "D", "G", "B", "高音 e"];

  function normalizeQuality(quality) {
    return quality === "69" ? "69" : "6";
  }

  function rolesOf(key) {
    return ROLES[key.quality === "69" ? "69" : "6"];
  }

  function keyById(id, quality) {
    var found = KEYS[0];
    var i;
    for (i = 0; i < KEYS.length; i++) if (KEYS[i].id === id) found = KEYS[i];
    var q = normalizeQuality(quality);
    return {
      id: found.id,
      name: found.name,
      pc: found.pc,
      acc: found.acc,
      quality: q,
      tones: (q === "69" ? found.tones69 : found.tones6).slice(),
      suffix: q === "69" ? "6/9" : "6"
    };
  }

  function pcOf(midi) {
    return ((midi % 12) + 12) % 12;
  }

  function octaveOf(midi) {
    return Math.floor(midi / 12) - 1;
  }

  function toneOf(midi, key) {
    var pc = pcOf(midi);
    var roles = rolesOf(key);
    var i;
    for (i = 0; i < roles.length; i++) {
      if ((key.pc + INTERVAL[roles[i]]) % 12 === pc) return roles[i];
    }
    return null;
  }

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
    9: "6",
    10: "b7",
    11: "7"
  };
  var DEGREE_BY_ROLE = { root: "R", third: "3", fifth: "5", sixth: "6", ninth: "9" };

  function degreeOf(midi, key) {
    var role = toneOf(midi, key);
    if (role && DEGREE_BY_ROLE[role]) return DEGREE_BY_ROLE[role];
    return DEGREE_BY_INTERVAL[(pcOf(midi) - key.pc + 12) % 12];
  }

  function spell(midi, key) {
    var role = toneOf(midi, key);
    var name;
    if (role) {
      name = key.tones[rolesOf(key).indexOf(role)];
    } else {
      var names = key.acc === "flat" ? FLAT_NAMES : SHARP_NAMES;
      name = names[pcOf(midi)];
    }
    return name + octaveOf(midi);
  }

  function chordPcs(key) {
    return rolesOf(key).map(function (role) {
      return (key.pc + INTERVAL[role]) % 12;
    });
  }

  function pianoNotes(key) {
    var root = 48 + key.pc;
    var notes = [
      { midi: root, role: "root", hand: "left" },
      { midi: root + 7, role: "fifth", hand: "right" },
      { midi: root + 9, role: "sixth", hand: "right" }
    ];
    if (key.quality === "69") notes.push({ midi: root + 14, role: "ninth", hand: "right" });
    notes.push({ midi: root + 16, role: "third", hand: "right" });
    return notes;
  }

  function bassNotes(key) {
    var root = 36 + key.pc;
    return [
      { midi: root, role: "root" },
      { midi: root + 7, role: "fifth" },
      { midi: root + 12, role: "root" }
    ];
  }

  function placeShape(shape, key) {
    var shift = key.pc;
    var frets = shape.frets.map(function (fret) {
      return fret == null ? null : fret + shift;
    });
    function sounding() {
      return frets.filter(function (fret) { return fret != null; });
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

  function shapesFor(quality) {
    return SHAPES[normalizeQuality(quality)];
  }

  return {
    KEYS: KEYS,
    SHAPES: SHAPES["6"],
    shapesFor: shapesFor,
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
