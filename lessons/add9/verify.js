/* Musical facts and timbre checks. Run: node verify.js */
var theory = require("./theory.js");
var sound = require("./sound.js");

var failed = 0;
function assert(cond, message) {
  if (!cond) {
    failed += 1;
    console.error("FAIL: " + message);
  }
}

function rms(samples, from, to) {
  var a = from | 0;
  var b = to == null ? samples.length : to | 0;
  var acc = 0;
  var n = 0;
  for (var i = a; i < b; i++) {
    acc += samples[i] * samples[i];
    n += 1;
  }
  return Math.sqrt(acc / Math.max(1, n));
}

function peakOf(samples) {
  var peak = 0;
  for (var i = 0; i < samples.length; i++) {
    var a = Math.abs(samples[i]);
    if (a > peak) peak = a;
    if (samples[i] !== samples[i]) return NaN;
  }
  return peak;
}

function magnitude(samples, sampleRate, freq) {
  var w = (2 * Math.PI * freq) / sampleRate;
  var re = 0;
  var im = 0;
  var n = samples.length;
  for (var i = 0; i < n; i++) {
    var hann = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (n - 1)));
    var s = samples[i] * hann;
    re += s * Math.cos(w * i);
    im -= s * Math.sin(w * i);
  }
  return Math.hypot(re, im) / n;
}

function pitchErrorCents(samples, sampleRate, freq) {
  var bestF = freq;
  var bestM = -1;
  for (var step = -40; step <= 40; step++) {
    var f = freq * Math.pow(2, step * 0.5 / 1200);
    var m = magnitude(samples, sampleRate, f);
    if (m > bestM) {
      bestM = m;
      bestF = f;
    }
  }
  return { cents: 1200 * Math.log2(bestF / freq), mag: bestM, freq: bestF };
}

var C = theory.keyById("C");
var pianoC = theory.pianoNotes(C);
assert(
  pianoC.map(function (n) { return n.midi; }).join(",") === "48,55,62,64",
  "C piano voicing should be C3 G3 D4 E4 (48,55,62,64), got " + pianoC.map(function (n) { return n.midi; })
);
assert(
  pianoC.map(function (n) { return theory.spell(n.midi, C); }).join(" ") === "C3 G3 D4 E4",
  "C piano spelling"
);
assert(pianoC.map(function (n) { return n.role; }).join(",") === "root,fifth,ninth,third", "C piano roles");

var expectedShapes = {
  "a-root": [null, 48, 55, 60, 62, 67],
  "d-root": [null, null, 60, 64, 67, 74],
  "low-e": [48, null, 60, 64, 67, 74],
  full: [48, 55, 60, 64, 67, 74],
  "fifth-bass": [null, 55, 60, 64, 67, 74]
};

theory.SHAPES.forEach(function (shape) {
  var placed = theory.placeShape(shape, C);
  var expect = expectedShapes[shape.id];
  assert(placed.midis.join(",") === expect.join(","), shape.id + " C midis " + placed.midis + " != " + expect);
});

assert(theory.placeShape(theory.SHAPES[0], theory.keyById("D")).notation === "x-5-7-7-5-5", "Dadd9 A-shape is x-5-7-7-5-5");
assert(theory.placeShape(theory.SHAPES[1], theory.keyById("F")).notation === "x-x-3-2-1-3", "F compact folds to x-x-3-2-1-3");
assert(theory.placeShape(theory.SHAPES[2], theory.keyById("F")).notation === "1-x-3-2-1-3", "F low-E folds to 1-x-3-2-1-3");
assert(theory.placeShape(theory.SHAPES[0], theory.keyById("Bb")).notation === "x-1-3-3-1-1", "Bb A-shape folds to x-1-3-3-1-1");
assert(theory.placeShape(theory.SHAPES[0], theory.keyById("A")).notation === "x-12-14-14-12-12", "A A-shape stays at the 12th fret");

assert(theory.degreeOf(48, C) === "R", "C3 is R");
assert(theory.degreeOf(52, C) === "3", "E3 is 3");
assert(theory.degreeOf(55, C) === "5", "G3 is 5");
assert(theory.degreeOf(59, C) === "7", "B3 is 7");
assert(theory.degreeOf(50, C) === "9", "D3 is 9");
assert(theory.degreeOf(49, C) === "b9", "C# is b9");
assert(theory.degreeOf(51, C) === "b3", "Eb is b3");
assert(theory.degreeOf(54, C) === "#11", "F# is #11");
assert(theory.degreeOf(58, C) === "b7", "Bb is b7");

var expectedDegrees = {
  "a-root": ["x", "R", "5", "R", "9", "5"],
  "d-root": ["x", "x", "R", "3", "5", "9"],
  "low-e": ["R", "x", "R", "3", "5", "9"],
  full: ["R", "5", "R", "3", "5", "9"],
  "fifth-bass": ["x", "5", "R", "3", "5", "9"]
};

var ROLE_PC = { root: 0, third: 4, fifth: 7, ninth: 2 };
theory.KEYS.forEach(function (key) {
  var tones = theory.pianoNotes(key);
  tones.forEach(function (note, index) {
    var roles = ["root", "fifth", "ninth", "third"];
    var role = roles[index];
    assert(theory.toneOf(note.midi, key) === role, key.name + " piano role " + role);
    assert((note.midi - (48 + key.pc) + 120) % 12 === ROLE_PC[role] || note.midi - (48 + key.pc) === { root: 0, fifth: 7, ninth: 14, third: 16 }[role], key.name + " piano interval");
    assert(theory.spell(note.midi, key) === key.tones[["root", "third", "fifth", "ninth"].indexOf(role)] + theory.octaveOf(note.midi), key.name + " spelling " + theory.spell(note.midi, key));
  });
  assert(theory.spell(tones[0].midi, key).endsWith("3"), key.name + " root stays in octave 3");

  var pcs = {};
  theory.chordPcs(key).forEach(function (pc) { pcs[pc] = true; });
  assert(theory.chordPcs(key).indexOf((key.pc + 9) % 12) === -1, key.name + " has no sixth");
  assert(theory.chordPcs(key).indexOf((key.pc + 10) % 12) === -1, key.name + " has no minor seventh");
  assert(theory.chordPcs(key).indexOf((key.pc + 11) % 12) === -1, key.name + " has no major seventh");

  theory.SHAPES.forEach(function (shape) {
    var placed = theory.placeShape(shape, key);
    var sounding = [];
    placed.frets.forEach(function (fret, i) {
      if (fret == null) {
        assert(placed.midis[i] == null, shape.id + " mute");
        return;
      }
      assert(fret >= 1 && fret <= 15, shape.id + " " + key.name + " fret " + fret + " out of range (" + placed.notation + ")");
      assert(placed.midis[i] === theory.OPEN_MIDI[i] + fret, shape.id + " midi math");
      var pc = theory.pcOf(placed.midis[i]);
      assert(pcs[pc], shape.id + " " + key.name + " pitch class " + pc + " is not a chord tone (" + placed.notation + ")");
      sounding.push(placed.midis[i]);
    });
    var roles = {};
    sounding.forEach(function (midi) { roles[theory.toneOf(midi, key)] = true; });
    if (shape.id === "a-root") {
      assert(!roles.third, "A-shape must omit the third");
      assert(roles.root && roles.fifth && roles.ninth, "A-shape has root, fifth, ninth");
    } else {
      assert(roles.root && roles.third && roles.fifth && roles.ninth, shape.id + " " + key.name + " missing a chord tone " + JSON.stringify(roles));
    }
    var degrees = theory.stringsOf(placed, key).map(function (s) { return s.muted ? "x" : s.degree; });
    assert(degrees.join("-") === expectedDegrees[shape.id].join("-"), shape.id + " " + key.name + " degrees " + degrees.join("-"));
    degrees.forEach(function (deg) {
      if (deg !== "x") assert(["R", "3", "5", "9"].indexOf(deg) >= 0, shape.id + " unexpected degree " + deg);
    });
  });

  var bass = theory.bassNotes(key);
  assert(theory.toneOf(bass[0].midi, key) === "root", "bass root");
  assert(theory.toneOf(bass[1].midi, key) === "fifth", "bass fifth");
  assert(bass[2].midi === bass[0].midi + 12, "bass octave");
});

assert(theory.spell(theory.pianoNotes(theory.keyById("Db"))[0].midi, theory.keyById("Db")) === "D♭3", "Db3");
assert(theory.pianoNotes(theory.keyById("Db")).map(function (n) { return theory.spell(n.midi, theory.keyById("Db")); }).join(" ") === "D♭3 A♭3 E♭4 F4", "Db voicing names");
assert(theory.pianoNotes(theory.keyById("Fs")).map(function (n) { return theory.spell(n.midi, theory.keyById("Fs")); }).join(" ") === "F♯3 C♯4 G♯4 A♯4", "F# voicing names");
assert(theory.pianoNotes(theory.keyById("B")).map(function (n) { return theory.spell(n.midi, theory.keyById("B")); }).join(" ") === "B3 F♯4 C♯5 D♯5", "B voicing names");

var openShape = [null, 3, 2, 0, 3, 0];
assert(openShape.some(function (fret) { return fret === 0; }), "contrast shape x32030 uses open strings and is not a shipped grip");
theory.SHAPES.forEach(function (shape) {
  assert(shape.frets.every(function (fret) { return fret == null || fret > 0; }), shape.id + " base grip uses no open string");
});

var sr = 44100;
function sliceFrom(samples, t0, t1) {
  return samples.subarray(Math.floor(sr * t0), Math.floor(sr * t1));
}

function checkTone(label, samples, freq, minRatio) {
  var finite = true;
  for (var i = 0; i < samples.length; i += 17) {
    if (samples[i] !== samples[i]) finite = false;
  }
  assert(finite, label + " has NaN");
  var peak = peakOf(samples);
  assert(peak > 0.2 && peak <= 1, label + " peak " + peak);
  var early = rms(samples, sr * 0.02, sr * 0.12);
  var late = rms(samples, samples.length - sr * 0.18, samples.length - sr * 0.02);
  assert(early > 0.02, label + " early rms " + early);
  assert(early / Math.max(late, 1e-6) > 3, label + " does not decay (" + early.toFixed(3) + " -> " + late.toFixed(3) + ")");
  var body = sliceFrom(samples, 0.06, 0.38);
  var found = pitchErrorCents(body, sr, freq);
  assert(Math.abs(found.cents) <= 12, label + " pitch error " + found.cents.toFixed(1) + " cents");
  var fund = magnitude(body, sr, freq);
  var off = magnitude(body, sr, freq * 1.37);
  assert(fund > off * minRatio, label + " fundamental is weak vs noise (" + fund.toFixed(5) + " vs " + off.toFixed(5) + ")");
  return { peak: peak, decay: early / late, cents: found.cents, fund: fund, off: off };
}

var t0 = Date.now();
var piano = sound.renderPiano(48, sr, 2.15);
var pianoMs = Date.now() - t0;
var pianoStats = checkTone("piano C3", piano, sound.midiToFreq(48), 8);
var pianoE = sound.renderPiano(64, sr, 2.15);
checkTone("piano E4", pianoE, sound.midiToFreq(64), 8);
var pBody = sliceFrom(piano, 0.08, 0.3);
var p2 = magnitude(pBody, sr, sound.midiToFreq(48) * 2);
var p4 = magnitude(pBody, sr, sound.midiToFreq(48) * 4);
assert(p2 > pianoStats.fund * 0.08, "piano has a second partial");
assert(p4 > pianoStats.fund * 0.02, "piano has higher partials");

var gC = sound.guitarPatch(60, sr, 0.55, 1.65);
var gBody = sliceFrom(gC.samples, 0.06, 0.38);
var gFound = pitchErrorCents(gBody, sr, gC.actual);
var correctedFreq = gC.actual * Math.pow(2, gFound.cents / 1200) * gC.rate;
var correctedCents = 1200 * Math.log2(correctedFreq / gC.freq);
assert(Math.abs(correctedCents) < 8, "guitar corrected pitch " + correctedCents.toFixed(1) + " cents");
var gStats = checkTone("guitar C4", gC.samples, gC.actual, 6);

var gLow = sound.guitarPatch(40, sr, 0.22, 1.7);
checkTone("guitar E2", gLow.samples, gLow.actual, 4);
var gHigh = sound.guitarPatch(74, sr, 0.86, 1.7);
checkTone("guitar D5", gHigh.samples, gHigh.actual, 4);

var bass = sound.renderBass(36, sr, 1.2);
var bassStats = checkTone("bass C2", bass, sound.midiToFreq(36), 6);

console.log("piano C3", JSON.stringify({ ms: pianoMs, peak: pianoStats.peak, decay: Number(pianoStats.decay.toFixed(2)), cents: Number(pianoStats.cents.toFixed(2)) }));
console.log("guitar C4", JSON.stringify({ decay: Number(gStats.decay.toFixed(2)), cents: Number(gStats.cents.toFixed(2)), rate: Number(gC.rate.toFixed(5)) }));
console.log("bass C2", JSON.stringify({ decay: Number(bassStats.decay.toFixed(2)), cents: Number(bassStats.cents.toFixed(2)) }));

console.log("--- grips at C ---");
theory.SHAPES.forEach(function (shape) {
  var placed = theory.placeShape(shape, C);
  var names = theory.stringsOf(placed, C).map(function (s) { return s.muted ? "x" : s.name + "/" + s.degree; });
  console.log(shape.id, placed.notation, names.join(" "));
});

if (failed) {
  console.error(failed + " failed");
  process.exit(1);
}
console.log("all checks passed");
