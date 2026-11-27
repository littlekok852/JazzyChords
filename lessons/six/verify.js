/* Musical facts for 6 and 6/9, plus the song-loop voicings. Run: node verify.js */
var theory = require("./theory.js");
var sound = require("./sound.js");
var voice = require("../../assets/voice.js");

var failed = 0;
function assert(cond, message) {
  if (!cond) {
    failed += 1;
    console.error("FAIL: " + message);
  }
}

function pcsOf(midis) {
  var set = {};
  midis.forEach(function (midi) {
    if (midi != null) set[((midi % 12) + 12) % 12] = true;
  });
  return Object.keys(set).map(Number).sort(function (a, b) { return a - b; }).join(",");
}

var expectedDegrees = {
  a6: ["x", "R", "5", "R", "3", "6"],
  d6: ["x", "x", "R", "5", "6", "3"],
  e6: ["R", "5", "R", "3", "6", "R"],
  a69: ["x", "R", "3", "6", "9", "5"],
  d69: ["x", "x", "R", "3", "6", "9"],
  e69: ["R", "3", "6", "9", "5", "R"]
};

var expectedCMidi = {
  a6: [null, 48, 55, 60, 64, 69],
  d6: [null, null, 60, 67, 69, 76],
  e6: [48, 55, 60, 64, 69, 72],
  a69: [null, 48, 52, 57, 62, 67],
  d69: [null, null, 60, 64, 69, 74],
  e69: [48, 52, 57, 62, 67, 72]
};

["6", "69"].forEach(function (quality) {
  var C = theory.keyById("C", quality);
  var piano = theory.pianoNotes(C);
  if (quality === "6") {
    assert(piano.map(function (n) { return n.midi; }).join(",") === "48,55,57,64", "C6 piano " + piano.map(function (n) { return n.midi; }));
    assert(piano.map(function (n) { return n.role; }).join(",") === "root,fifth,sixth,third", "C6 roles");
    assert(theory.spell(piano[2].midi, C) === "A3", "C6 sixth spells A3");
  } else {
    assert(piano.map(function (n) { return n.midi; }).join(",") === "48,55,57,62,64", "C6/9 piano " + piano.map(function (n) { return n.midi; }));
    assert(piano.map(function (n) { return n.role; }).join(",") === "root,fifth,sixth,ninth,third", "C6/9 roles");
    assert(theory.spell(piano[3].midi, C) === "D4", "C6/9 ninth spells D4");
  }
  assert(piano.every(function (n, i) { return i === 0 || n.midi > piano[i - 1].midi; }), quality + " piano ascends");

  theory.shapesFor(quality).forEach(function (shape) {
    assert(shape.frets.every(function (fret) { return fret == null || fret > 0; }), shape.id + " base grip uses no open string");
    var placed = theory.placeShape(shape, C);
    assert(placed.midis.join(",") === expectedCMidi[shape.id].join(","), shape.id + " C midis " + placed.midis);
    var degrees = theory.stringsOf(placed, C).map(function (s) { return s.muted ? "x" : s.degree; });
    assert(degrees.join("-") === expectedDegrees[shape.id].join("-"), shape.id + " degrees " + degrees.join("-"));
  });
});

assert(theory.degreeOf(48, theory.keyById("C", "6")) === "R", "C is R");
assert(theory.degreeOf(52, theory.keyById("C", "6")) === "3", "E is 3");
assert(theory.degreeOf(55, theory.keyById("C", "6")) === "5", "G is 5");
assert(theory.degreeOf(57, theory.keyById("C", "6")) === "6", "A is 6, not 13");
assert(theory.degreeOf(62, theory.keyById("C", "69")) === "9", "D is 9");
assert(theory.degreeOf(59, theory.keyById("C", "6")) === "7", "B is 7 and is not a chord tone");
assert(theory.toneOf(59, theory.keyById("C", "6")) === null, "major seventh is outside 6");
assert(theory.toneOf(58, theory.keyById("C", "69")) === null, "minor seventh is outside 6/9");

var allowed = { R: true, "3": true, "5": true, "6": true, "9": true };
theory.KEYS.forEach(function (raw) {
  ["6", "69"].forEach(function (quality) {
    var key = theory.keyById(raw.id, quality);
    var pcs = {};
    theory.chordPcs(key).forEach(function (pc) { pcs[pc] = true; });
    assert(!pcs[(key.pc + 10) % 12], key.name + quality + " has no minor seventh");
    assert(!pcs[(key.pc + 11) % 12], key.name + quality + " has no major seventh");
    if (quality === "6") assert(!pcs[(key.pc + 2) % 12], key.name + "6 has no ninth");
    else assert(pcs[(key.pc + 2) % 12], key.name + "6/9 has a ninth");
    assert(pcs[(key.pc + 9) % 12], key.name + " has a sixth");

    var piano = theory.pianoNotes(key);
    piano.forEach(function (note) {
      assert(theory.toneOf(note.midi, key) === note.role, key.suffix + " " + key.name + " piano role");
      assert(pcs[theory.pcOf(note.midi)], "piano tone in chord");
    });
    assert(String(theory.spell(piano[0].midi, key)).endsWith("3"), key.name + " root stays in octave 3");

    theory.shapesFor(quality).forEach(function (shape) {
      var placed = theory.placeShape(shape, key);
      var sounding = [];
      placed.frets.forEach(function (fret, i) {
        if (fret == null) {
          assert(placed.midis[i] == null, shape.id + " mute");
          return;
        }
        assert(fret >= 1 && fret <= 15, shape.id + " " + key.name + " fret " + fret + " (" + placed.notation + ")");
        assert(placed.midis[i] === theory.OPEN_MIDI[i] + fret, shape.id + " midi math");
        assert(pcs[theory.pcOf(placed.midis[i])], shape.id + " " + key.name + " foreign pitch " + placed.notation);
        sounding.push(placed.midis[i]);
      });
      var roles = {};
      sounding.forEach(function (midi) { roles[theory.toneOf(midi, key)] = true; });
      assert(roles.root && roles.third && roles.sixth, shape.id + " " + key.name + " missing root, third, or sixth " + JSON.stringify(roles));
      if (shape.id === "d69") assert(!roles.fifth, "compact 6/9 omits the fifth");
      else assert(roles.fifth, shape.id + " should include the fifth");
      if (quality === "69" && shape.id !== "d69") assert(roles.ninth, shape.id + " 6/9 missing the ninth");
      if (quality === "6") assert(!roles.ninth, shape.id + " 6 must not include the ninth");
      var degrees = theory.stringsOf(placed, key).map(function (s) { return s.muted ? "x" : s.degree; });
      assert(degrees.join("-") === expectedDegrees[shape.id].join("-"), shape.id + " " + key.name + " degrees " + degrees.join("-"));
      degrees.forEach(function (deg) {
        if (deg !== "x") assert(allowed[deg], shape.id + " unexpected degree " + deg);
      });
    });

    var bass = theory.bassNotes(key);
    assert(theory.toneOf(bass[0].midi, key) === "root", "bass root");
    assert(theory.toneOf(bass[1].midi, key) === "fifth", "bass fifth");
    assert(bass[2].midi === bass[0].midi + 12, "bass octave");
    assert(theory.toneOf(bass[0].midi, key) !== "sixth", "bass does not play the sixth");
  });
});

assert(theory.placeShape(theory.shapesFor("6")[0], theory.keyById("D", "6")).notation === "x-5-7-7-7-7", "D6 A-shape");
assert(theory.placeShape(theory.shapesFor("69")[0], theory.keyById("B", "69")).notation === "x-2-1-1-2-2", "B6/9 folds above the nut");
assert(theory.placeShape(theory.shapesFor("69")[2], theory.keyById("Fs", "69")).notation === "2-1-1-1-2-2", "F#6/9 full shape folds to the 1st fret");
assert(theory.placeShape(theory.shapesFor("6")[1], theory.keyById("F", "6")).notation === "x-x-3-5-3-5", "F6 compact folds off the dusty frets");

assert(theory.spell(theory.pianoNotes(theory.keyById("Db", "6"))[0].midi, theory.keyById("Db", "6")) === "D♭3", "Db root");
assert(theory.pianoNotes(theory.keyById("Fs", "69")).map(function (n) { return theory.spell(n.midi, theory.keyById("Fs", "69")); }).join(" ") === "F♯3 C♯4 D♯4 G♯4 A♯4", "F#6/9 spelling");

function uniqPcs(symbol) {
  return pcsOf(voice.notes(symbol));
}
function lowest(symbol) {
  return Math.min.apply(null, voice.notes(symbol));
}

assert(uniqPcs("C") === "0,4,7", "C major");
assert(uniqPcs("Cadd9") === "0,2,4,7", "Cadd9");
assert(uniqPcs("Fadd9") === "0,5,7,9", "Fadd9 pcs " + uniqPcs("Fadd9"));
assert(uniqPcs("G") === "2,7,11", "G");
assert(uniqPcs("D") === "2,6,9", "D");
assert(uniqPcs("Em7") === "2,4,7,11", "Em7");
assert(uniqPcs("Am7") === "0,4,7,9", "Am7");
assert(uniqPcs("D/F#") === "2,6,9" && lowest("D/F#") === 42, "D/F# bass is F#2");
assert(uniqPcs("G/B") === "2,7,11" && lowest("G/B") === 47, "G/B bass is B2");
assert(uniqPcs("Am7/G") === "0,4,7,9" && lowest("Am7/G") === 43, "Am7/G bass is G2");
assert(uniqPcs("Dadd9") === "2,4,6,9", "Dadd9");
assert(uniqPcs("A/C#") === "1,4,9" && lowest("A/C#") === 37, "A/C#");
assert(uniqPcs("Bm7") === "2,6,9,11", "Bm7");
assert(uniqPcs("Bm7/A") === "2,6,9,11" && lowest("Bm7/A") === 45, "Bm7/A");
assert(uniqPcs("C6") === "0,4,7,9", "C6 voice");
assert(uniqPcs("G6") === "2,4,7,11", "G6 voice");
assert(uniqPcs("D6") === "2,6,9,11", "D6 voice");
assert(uniqPcs("F6") === "0,2,5,9", "F6 voice");
assert(uniqPcs("C6/9") === "0,2,4,7,9", "C6/9 voice");
assert(uniqPcs("Db6/9") === "1,3,5,8,10", "Db6/9 voice " + uniqPcs("Db6/9"));
assert(uniqPcs("Dm7") === "0,2,5,9", "Dm7");
assert(uniqPcs("G7") === "2,5,7,11", "G7");
assert(uniqPcs("Cmaj7") === "0,4,7,11", "Cmaj7 contrast");
assert(voice.notes("C6").indexOf(59) === -1 && voice.notes("C6/9").indexOf(59) === -1, "song voicings of 6 and 6/9 have no leading tone");

["Cadd11", "C13", "H6", "Cmaj9"].forEach(function (bad) {
  var threw = false;
  try { voice.notes(bad); } catch (err) { threw = true; }
  assert(threw, bad + " should not parse");
});

["G G Cadd9 D", "C C Fadd9 G", "Em7 Cadd9 G D/F#", "Am7 Fadd9 C G/B", "Cadd9 G/B Am7 Am7/G", "Dadd9 A/C# Bm7 Bm7/A", "C G Am F", "Cadd9 G Am Fadd9", "C G/B Am F", "Cadd9 G/B Am Fadd9", "G G6", "C C6", "D6 G6", "C6 F6", "Db6/9 Db6/9", "C6/9 C6/9", "Dm7 G7 C6/9", "C Am Dm G", "C6 Am7 Dm7 G7", "C C6/9", "C Cmaj7"].forEach(function (line) {
  line.split(/\s+/).forEach(function (symbol) { voice.notes(symbol); });
});

function rms(samples, from, to) {
  var a = from | 0;
  var b = to == null ? samples.length : to | 0;
  var acc = 0;
  var n = 0;
  var i;
  for (i = a; i < b; i++) {
    acc += samples[i] * samples[i];
    n += 1;
  }
  return Math.sqrt(acc / Math.max(1, n));
}
function peakOf(samples) {
  var peak = 0;
  var i;
  for (i = 0; i < samples.length; i++) {
    var amp = Math.abs(samples[i]);
    if (amp > peak) peak = amp;
    if (samples[i] !== samples[i]) return NaN;
  }
  return peak;
}
var pianoTone = sound.renderPiano(60, 44100, 1.2);
var guitarTone = sound.guitarPatch(60, 44100, 0.5, 1.2);
var bassTone = sound.renderBass(36, 44100, 1.0);
assert(peakOf(pianoTone) > 0.2 && peakOf(pianoTone) <= 1, "piano peak");
assert(peakOf(guitarTone.samples) > 0.2, "guitar peak");
assert(peakOf(bassTone) > 0.2, "bass peak");
assert(rms(pianoTone, 44100 * 0.02, 44100 * 0.1) > rms(pianoTone, pianoTone.length - 4000, pianoTone.length - 100), "piano decays");

if (failed) {
  console.error(failed + " failed");
  process.exit(1);
}
console.log("all checks passed");
