/* Offline note renderers. Piano is additive and slightly inharmonic.
   Guitar is a Karplus-Strong plucked string. Bass is a warm low partial stack.
   Buffers are mono Float32; the page adds room and dynamics. */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ChordSound = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function fadeEnds(out, sampleRate, fadeIn, fadeOut) {
    var inN = Math.max(1, Math.floor(sampleRate * fadeIn));
    var outN = Math.max(1, Math.floor(sampleRate * fadeOut));
    var i;
    for (i = 0; i < inN && i < out.length; i++) out[i] *= i / inN;
    for (i = 0; i < outN && i < out.length; i++) {
      out[out.length - 1 - i] *= i / outN;
    }
  }

function normalize(out, peakTarget) {
  var peak = 0;
  var i;
  for (i = 0; i < out.length; i++) {
    var a = Math.abs(out[i]);
    if (a > peak) peak = a;
  }
  if (peak < 1e-8) return out;
  var gain = peakTarget / peak;
  for (i = 0; i < out.length; i++) out[i] *= gain;
  return out;
}

/* Match the body of the note, not the pick spike, so a strum stays even. */
function normalizeWindow(out, sampleRate, rmsTarget) {
  var n = Math.min(out.length, Math.max(1, Math.floor(sampleRate * 0.09)));
  var acc = 0;
  var i;
  for (i = 0; i < n; i++) acc += out[i] * out[i];
  var r = Math.sqrt(acc / n);
  if (r < 1e-8) return out;
  var gain = rmsTarget / r;
  var peak = 0;
  for (i = 0; i < out.length; i++) {
    out[i] *= gain;
    var a = Math.abs(out[i]);
    if (a > peak) peak = a;
  }
  if (peak > 0.9) {
    var trim = 0.9 / peak;
    for (i = 0; i < out.length; i++) out[i] *= trim;
  }
  return out;
}

  function onePoleLowpass(out, sampleRate, freq) {
    var alpha = 1 - Math.exp((-2 * Math.PI * freq) / sampleRate);
    var y = 0;
    for (var i = 0; i < out.length; i++) {
      y += alpha * (out[i] - y);
      out[i] = y;
    }
  }

  function biquadCoeffs(type, sampleRate, freq, q, gainDb) {
    var A = Math.pow(10, (gainDb || 0) / 40);
    var w0 = (2 * Math.PI * freq) / sampleRate;
    var cos = Math.cos(w0);
    var sin = Math.sin(w0);
    var alpha = sin / (2 * q);
    var b0, b1, b2, a0, a1, a2;
    if (type === "highpass") {
      b0 = (1 + cos) / 2;
      b1 = -(1 + cos);
      b2 = (1 + cos) / 2;
      a0 = 1 + alpha;
      a1 = -2 * cos;
      a2 = 1 - alpha;
    } else if (type === "peaking") {
      b0 = 1 + alpha * A;
      b1 = -2 * cos;
      b2 = 1 - alpha * A;
      a0 = 1 + alpha / A;
      a1 = -2 * cos;
      a2 = 1 - alpha / A;
    } else {
      b0 = (1 - cos) / 2;
      b1 = 1 - cos;
      b2 = (1 - cos) / 2;
      a0 = 1 + alpha;
      a1 = -2 * cos;
      a2 = 1 - alpha;
    }
    return { b0: b0 / a0, b1: b1 / a0, b2: b2 / a0, a1: a1 / a0, a2: a2 / a0 };
  }

  function applyBiquad(input, c) {
    var y = new Float32Array(input.length);
    var x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (var i = 0; i < input.length; i++) {
      var x = input[i];
      var yn = c.b0 * x + c.b1 * x1 + c.b2 * x2 - c.a1 * y1 - c.a2 * y2;
      x2 = x1;
      x1 = x;
      y2 = y1;
      y1 = yn;
      y[i] = yn;
    }
    return y;
  }

  function renderPiano(midi, sampleRate, seconds) {
    var duration = seconds || 2.15;
    var n = Math.floor(sampleRate * duration);
    var out = new Float32Array(n);
    var f0 = midiToFreq(midi);
    var B = Math.min(0.0011, 0.00006 + Math.max(0, 58 - midi) * 0.000025);
    var partials = midi < 45 ? 11 : midi < 62 ? 9 : midi < 76 ? 7 : 5;
    var detunes = [-1.15, 1.15];
    var d, p, i;
    for (d = 0; d < detunes.length; d++) {
      var stringRatio = Math.pow(2, detunes[d] / 1200);
      for (p = 1; p <= partials; p++) {
        var freq = f0 * stringRatio * p * Math.sqrt(1 + B * p * p);
        if (freq > 11000 || freq > sampleRate * 0.42) break;
        var amp = Math.pow(0.58, p - 1) * (p === 1 ? 1 : 0.92);
        amp /= detunes.length;
        var tau = (1.22 * Math.pow(2, (50 - midi) / 40)) / Math.pow(p, 0.8);
        var decay = Math.exp(-1 / (tau * sampleRate));
        var env = 1;
        var attackN = Math.max(1, Math.floor((0.0022 + p * 0.00035) * sampleRate));
        var phase = (d * 0.35 + p * 0.17) % (Math.PI * 2);
        var dphase = (2 * Math.PI * freq) / sampleRate;
        for (i = 0; i < n; i++) {
          var att = i < attackN ? i / attackN : 1;
          out[i] += amp * att * env * Math.sin(phase);
          phase += dphase;
          if (phase > 6.283185307179586) phase -= 6.283185307179586;
          env *= decay;
        }
      }
    }

    var rand = mulberry32(midi * 97 + 11);
    var hammerN = Math.floor(sampleRate * 0.022);
    var noise = 0;
    for (i = 0; i < hammerN; i++) {
      var white = rand() * 2 - 1;
      noise = noise * 0.62 + white * 0.38;
      var hen = Math.pow(1 - i / hammerN, 2);
      out[i] += noise * hen * 0.22;
    }
    var thumpF = midi < 52 ? 118 : 156;
    var thumpN = Math.floor(sampleRate * 0.045);
    var thumpPhase = 0;
    var thumpStep = (2 * Math.PI * thumpF) / sampleRate;
    for (i = 0; i < thumpN; i++) {
      var tenv = Math.exp(-i / (sampleRate * 0.012));
      out[i] += Math.sin(thumpPhase) * tenv * 0.18;
      thumpPhase += thumpStep;
    }

    onePoleLowpass(out, sampleRate, midi < 50 ? 5200 : 6400);
    for (i = 0; i < n; i++) out[i] = Math.tanh(out[i] * 1.15);
    fadeEnds(out, sampleRate, 0.0015, 0.03);
    normalize(out, 0.58);
    return out;
  }

  /* Integer-period Karplus-Strong. Caller corrects pitch with playbackRate
     if the rounded period is not exact. */
  function renderGuitarPeriod(period, sampleRate, seconds, brightness, freqHint) {
    var N = Math.max(8, period | 0);
    var duration = seconds || 1.7;
    var n = Math.floor(sampleRate * duration);
    var buf = new Float32Array(N);
    var rand = mulberry32((N * 131 + Math.round(brightness * 100) * 17) >>> 0);
    var dull = 0.25 + (1 - brightness) * 0.6;
    var low = 0;
    var i;
    for (i = 0; i < N; i++) {
      var white = rand() * 2 - 1;
      low = low * dull + white * (1 - dull);
      var window = Math.sin((Math.PI * i) / N);
      buf[i] = low * (0.35 + 0.65 * window);
    }

    var freq = freqHint || sampleRate / N;
    var sustain = 1.62 + Math.min(0.4, 34 / freq);
    var loss = Math.exp(Math.log(0.32) / (freq * sustain));
    var out = new Float32Array(n);
    var prev = 0;
    for (i = 0; i < n; i++) {
      var idx = i % N;
      var cur = buf[idx];
      var filtered = loss * 0.5 * (cur + prev);
      prev = cur;
      buf[idx] = filtered;
      out[i] = cur;
    }

    var clickN = Math.floor(sampleRate * 0.004);
    var clickRand = mulberry32(N * 19 + 3);
    var click = 0;
    for (i = 0; i < clickN; i++) {
      var w = clickRand() * 2 - 1;
      click = click * 0.2 + w * 0.8;
      var cenv = 1 - i / clickN;
      out[i] += click * cenv * (0.08 + brightness * 0.12);
    }

    var hp = biquadCoeffs("highpass", sampleRate, 75, 0.7, 0);
    var body = biquadCoeffs("peaking", sampleRate, 196, 1.15, 3.2);
    var lp = biquadCoeffs("lowpass", sampleRate, 2800 + brightness * 1600, 0.7, 0);
    out = applyBiquad(out, hp);
    out = applyBiquad(out, body);
    out = applyBiquad(out, lp);
    fadeEnds(out, sampleRate, 0.001, 0.025);
    normalizeWindow(out, sampleRate, 0.2);
    return out;
  }

function guitarPatch(midi, sampleRate, brightness, seconds) {
  var freq = midiToFreq(midi);
  /* The averaging filter adds about half a sample of delay, so the
     sounding period is N + 0.5. Pick N around that, then playbackRate
     makes up the rest so the note matches the piano. */
  var ideal = sampleRate / freq;
  var period = Math.max(8, Math.round(ideal - 0.5));
  var actual = sampleRate / (period + 0.5);
  var samples = renderGuitarPeriod(period, sampleRate, seconds || 1.65, brightness, freq);
  return { samples: samples, rate: freq / actual, freq: freq, actual: actual, period: period };
}

  function renderBass(midi, sampleRate, seconds) {
    var duration = seconds || 1.2;
    var n = Math.floor(sampleRate * duration);
    var out = new Float32Array(n);
    var f0 = midiToFreq(midi);
    var amps = [1, 0.42, 0.16, 0.05];
    var p, i;
    for (p = 1; p <= amps.length; p++) {
      var freq = f0 * p;
      var tau = 0.62 / Math.pow(p, 0.75);
      var decay = Math.exp(-1 / (tau * sampleRate));
      var env = 1;
      var phase = 0;
      var dphase = (2 * Math.PI * freq) / sampleRate;
      var attackN = Math.floor(sampleRate * 0.006);
      for (i = 0; i < n; i++) {
        var att = i < attackN ? i / attackN : 1;
        var glide = 1 - 0.0035 * Math.exp(-i / (sampleRate * 0.02));
        out[i] += amps[p - 1] * att * env * Math.sin(phase);
        phase += dphase * glide;
        if (phase > 6.283185307179586) phase -= 6.283185307179586;
        env *= decay;
      }
    }
    onePoleLowpass(out, sampleRate, 420);
    for (i = 0; i < n; i++) out[i] = Math.tanh(out[i] * 1.25);
    fadeEnds(out, sampleRate, 0.002, 0.02);
    normalizeWindow(out, sampleRate, 0.22);
    return out;
  }

  function makeRoomImpulse(sampleRate, seconds) {
    var len = Math.floor(sampleRate * (seconds || 0.62));
    var left = new Float32Array(len);
    var right = new Float32Array(len);
    var randL = mulberry32(2026);
    var randR = mulberry32(2027);
    var i;
    for (i = 0; i < len; i++) {
      var t = i / len;
      var env = Math.pow(1 - t, 2.6);
      left[i] = (randL() * 2 - 1) * env;
      right[i] = (randR() * 2 - 1) * env;
    }
    var taps = [0.011, 0.017, 0.029, 0.043];
    for (i = 0; i < taps.length; i++) {
      var s = Math.floor(taps[i] * sampleRate);
      if (s < len) {
        left[s] += i % 2 === 0 ? 0.55 : 0.28;
        right[s] += i % 2 === 0 ? 0.25 : 0.5;
      }
    }
    onePoleLowpass(left, sampleRate, 5200);
    onePoleLowpass(right, sampleRate, 5200);
    normalize(left, 0.45);
    normalize(right, 0.45);
    return { left: left, right: right };
  }

  return {
    midiToFreq: midiToFreq,
    renderPiano: renderPiano,
    renderGuitarPeriod: renderGuitarPeriod,
    guitarPatch: guitarPatch,
    renderBass: renderBass,
    makeRoomImpulse: makeRoomImpulse
  };
});
