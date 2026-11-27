/* Short piano loops for the C-major map and the substitution page.
   First click unlocks audio. No melody, no lyrics. */
(function (root) {
  var S = root.ChordSound;
  var engine = null;
  var volume = 0.82;
  var RENDER_RATE = 44100;

  function createEngine() {
    var Ctx = root.AudioContext || root.webkitAudioContext;
    if (!Ctx) return null;
    var ctx = new Ctx();
    var master = ctx.createGain();
    master.gain.value = volume;
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.knee.value = 18;
    comp.ratio.value = 3.5;
    comp.attack.value = 0.005;
    comp.release.value = 0.16;
    master.connect(comp);
    comp.connect(ctx.destination);
    var cache = new Map();

    function bufferFrom(samples) {
      var buffer = ctx.createBuffer(1, samples.length, RENDER_RATE);
      buffer.getChannelData(0).set(samples);
      return buffer;
    }

    return {
      ctx: ctx,
      setVolume: function (value) {
        volume = value;
        master.gain.setValueAtTime(value, ctx.currentTime);
      },
      playPiano: function (midi, when, gain) {
        var key = "p" + midi;
        if (!cache.has(key)) cache.set(key, bufferFrom(S.renderPiano(midi, RENDER_RATE, 1.95)));
        var src = ctx.createBufferSource();
        src.buffer = cache.get(key);
        var g = ctx.createGain();
        g.gain.setValueAtTime(Math.max(0.0001, gain), when);
        src.connect(g);
        g.connect(master);
        src.start(when);
      }
    };
  }

  function ensure() {
    if (!engine) engine = createEngine();
    if (!engine) return Promise.resolve(null);
    if (engine.ctx.state === "suspended") {
      return engine.ctx.resume().then(function () { return engine; });
    }
    return Promise.resolve(engine);
  }

  function play(symbols, status) {
    var voices = symbols.map(function (symbol) { return root.ChordVoice.notes(symbol); });
    if (status) {
      status.hidden = false;
      status.textContent = "在播 " + symbols.join(" · ") + "，两遍。";
    }
    return ensure().then(function (eng) {
      if (!eng) {
        if (status) status.textContent = "这个浏览器没有放开音频。请换 Chrome、Edge、Firefox 或 Safari。";
        return;
      }
      var step = 0.58;
      var when = eng.ctx.currentTime + 0.05;
      var rep, i;
      for (rep = 0; rep < 2; rep++) {
        for (i = 0; i < voices.length; i++) {
          voices[i].forEach(function (midi) {
            eng.playPiano(midi, when + (rep * voices.length + i) * step, voices[i].length > 4 ? 0.55 : 0.68);
          });
        }
      }
    }).catch(function () {
      if (status) {
        status.hidden = false;
        status.textContent = "再点一次，浏览器才会出声。";
      }
    });
  }

  function setVolume(value) {
    volume = value;
    if (engine) engine.setVolume(value);
  }

  function bindStatic() {
    var status = document.getElementById("loopStatus");
    document.querySelectorAll("[data-chords]").forEach(function (button) {
      button.addEventListener("click", function () {
        play(button.getAttribute("data-chords").trim().split(/\s+/), status);
      });
    });
    var slider = document.getElementById("volume");
    if (slider) {
      slider.addEventListener("input", function () {
        setVolume(Number(slider.value) / 100);
        var label = document.getElementById("volumeLabel");
        if (label) label.textContent = slider.value + "%";
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindStatic);
  else bindStatic();

  root.LoopPlay = { play: play, setVolume: setVolume };
})(typeof globalThis !== "undefined" ? globalThis : this);
