var theory = require("./theory.js");
var sound = require("../../assets/sound.js");
var failed = 0;
function assert(cond, message) {
  if (!cond) { failed += 1; console.error("FAIL: " + message); }
}
theory.QUALITIES.forEach(function (item) {
  theory.KEYS.forEach(function (raw) {
    var key = theory.keyById(raw.id, item.id);
    theory.shapesFor(item.id).forEach(function (shape) {
      var placed = theory.placeShape(shape, key);
      var degrees = [];
      theory.stringsOf(placed, key).forEach(function (string, index) {
        if (string.muted) {
          assert(string.degree == null && placed.midis[index] == null, shape.id + " mute labeled");
          return;
        }
        assert(string.fret >= 1 && string.fret <= 15, shape.id + " " + raw.name + " fret " + string.fret + " " + placed.notation);
        assert(placed.midis[index] === [40, 45, 50, 55, 59, 64][index] + string.fret, "midi");
        assert(string.degree, shape.id + " " + raw.name + " foreign " + placed.notation);
        degrees.push(string.degree);
      });
      (shape.need || []).forEach(function (degree) {
        assert(degrees.indexOf(degree) >= 0, shape.id + " " + raw.name + " missing " + degree + " in " + degrees.join(","));
      });
      if (!shape.allowNoRoot) assert(degrees.indexOf("R") >= 0, shape.id + " missing root");
    });
    var piano = theory.pianoNotes(key);
    piano.forEach(function (note, index) {
      assert(index === 0 || note.midi !== piano[index - 1].midi, "piano duplicate");
    });
  });
  var c = theory.keyById("C", item.id);
  theory.shapesFor(item.id).forEach(function (shape) {
    var placed = theory.placeShape(shape, c);
    var base = shape.frets.map(function (fret) { return fret == null ? "x" : String(fret); }).join("-");
    if (Math.min.apply(null, shape.frets.filter(function (fret) { return fret != null; })) < 13) {
      assert(placed.notation === base, shape.id + " C notation " + placed.notation + " != " + base);
    }
  });
});
var tone = sound.renderPiano(60, 22050, 0.4);
assert(tone.length > 1000 && tone[100] === tone[100], "piano renders");
if (failed) { console.error(failed + " failed"); process.exit(1); }
console.log("all checks passed");
