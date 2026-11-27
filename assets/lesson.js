(function () {
  var T = window.ChordTheory;
  var S = window.ChordSound;
  var SVG = "http://www.w3.org/2000/svg";
  var RENDER_RATE = 22050;
  var BRIGHT = [0.24, 0.36, 0.5, 0.62, 0.76, 0.88];
  var PIANO_LO = 48;
  var PIANO_HI = 88;

  var state = { keyId: "C", quality: (T.QUALITIES[0] && T.QUALITIES[0].id) || "6", spacing: 0.16, volume: 0.82, neckFocus: "all" };
  var requested = new URLSearchParams(window.location.search);
  var requestedKey = requested.get("key");
  if (requestedKey && T.KEYS.some(function (key) { return key.id === requestedKey; })) {
    state.keyId = requestedKey;
  }
  if (T.QUALITIES.some(function (item) { return item.id === requested.get("quality"); })) {
    state.quality = requested.get("quality");
  }
  var engine = null;
  var pianoKeys = new Map();

  function currentKey() {
    return T.keyById(state.keyId, state.quality);
  }

  function shapes() {
    return T.shapesFor(state.quality);
  }

  function failAudio(err) {
    var status = document.getElementById("audioStatus");
    status.hidden = false;
    if (err && err.name === "NotAllowedError") {
      status.textContent = "再点一次按钮或琴键，浏览器才会出声。";
      return;
    }
    status.textContent = "这个浏览器没有放开音频。请换 Chrome、Edge、Firefox 或 Safari 再试。";
  }

  function createEngine() {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    var ctx = new Ctx();
    var master = ctx.createGain();
    master.gain.value = state.volume;
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.knee.value = 18;
    comp.ratio.value = 3.5;
    comp.attack.value = 0.005;
    comp.release.value = 0.16;
    master.connect(comp);
    comp.connect(ctx.destination);

    var conv = ctx.createConvolver();
    var impulse = S.makeRoomImpulse(ctx.sampleRate, 0.55);
    var ir = ctx.createBuffer(2, impulse.left.length, ctx.sampleRate);
    ir.getChannelData(0).set(impulse.left);
    ir.getChannelData(1).set(impulse.right);
    conv.buffer = ir;
    var wet = ctx.createGain();
    wet.gain.value = 0.16;
    conv.connect(wet);
    wet.connect(master);

    var cache = new Map();

    function bufferFrom(samples) {
      var buffer = ctx.createBuffer(1, samples.length, RENDER_RATE);
      buffer.getChannelData(0).set(samples);
      return buffer;
    }

    function voice(buffer, when, gainValue, rate) {
      var src = ctx.createBufferSource();
      src.buffer = buffer;
      src.playbackRate.setValueAtTime(rate || 1, when);
      var g = ctx.createGain();
      g.gain.setValueAtTime(Math.max(0.0001, gainValue), when);
      src.connect(g);
      g.connect(master);
      g.connect(conv);
      src.start(when);
      return src;
    }

    return {
      ctx: ctx,
      setVolume: function (value) {
        master.gain.setValueAtTime(value, ctx.currentTime);
      },
      playPiano: function (midi, when, gain, seconds) {
        var dur = seconds || 1.95;
        var key = "p" + midi + ":" + Math.round(dur * 1000);
        if (!cache.has(key)) cache.set(key, bufferFrom(S.renderPiano(midi, RENDER_RATE, dur)));
        return voice(cache.get(key), when, gain, 1);
      },
      playGuitar: function (midi, brightness, when, gain) {
        var key = "g" + midi + ":" + Math.round(brightness * 100);
        if (!cache.has(key)) {
          var patch = S.guitarPatch(midi, RENDER_RATE, brightness, 1.6);
          cache.set(key, { buffer: bufferFrom(patch.samples), rate: patch.rate });
        }
        var hit = cache.get(key);
        voice(hit.buffer, when, gain, hit.rate);
      },
      playBass: function (midi, when, gain) {
        var key = "b" + midi;
        if (!cache.has(key)) cache.set(key, bufferFrom(S.renderBass(midi, RENDER_RATE, 1.15)));
        voice(cache.get(key), when, gain, 1);
      }
    };
  }

  function ensure() {
    if (engine) return engine;
    try {
      engine = createEngine();
    } catch (err) {
      engine = null;
      failAudio(err);
      return null;
    }
    if (!engine) failAudio();
    return engine;
  }

  function withAudio(fn) {
    var eng = ensure();
    if (!eng) return;
    var run = function () {
      document.getElementById("audioStatus").hidden = true;
      fn(eng);
    };
    if (eng.ctx.state === "suspended") {
      eng.ctx.resume().then(run).catch(function (err) { failAudio(err); });
    } else {
      run();
    }
  }

  function pulse(node, when, holdMs) {
    if (!node || !engine) return;
    var token = String(Number(node.dataset.pulse || 0) + 1);
    node.dataset.pulse = token;
    var delay = Math.max(0, (when - engine.ctx.currentTime) * 1000);
    window.setTimeout(function () {
      if (node.dataset.pulse !== token) return;
      node.classList.add("is-sounding");
      window.setTimeout(function () {
        if (node.dataset.pulse !== token) return;
        node.classList.remove("is-sounding");
      }, holdMs);
    }, delay);
  }

  function pulseMidi(midi, when, holdMs) {
    pulse(pianoKeys.get(midi), when, holdMs);
    document.querySelectorAll('.dot[data-midi="' + midi + '"]').forEach(function (dot) {
      pulse(dot, when, holdMs);
    });
  }

  function isWhite(midi) {
    var pc = midi % 12;
    return pc === 0 || pc === 2 || pc === 4 || pc === 5 || pc === 7 || pc === 9 || pc === 11;
  }

  function buildPiano() {
    var piano = document.getElementById("piano");
    var midis = [];
    var m;
    for (m = PIANO_LO; m <= PIANO_HI; m++) midis.push(m);
    var whites = midis.filter(isWhite);
    var whiteIndex = {};
    whites.forEach(function (midi, index) {
      whiteIndex[midi] = index;
      var button = document.createElement("button");
      button.type = "button";
      button.className = "key white";
      button.dataset.midi = String(midi);
      var label = document.createElement("span");
      label.className = "key-label";
      button.appendChild(label);
      button.addEventListener("click", function () {
        playPianoOne(midi);
      });
      piano.appendChild(button);
      pianoKeys.set(midi, button);
    });
    midis.forEach(function (midi) {
      if (isWhite(midi)) return;
      var prev = midi - 1;
      while (!isWhite(prev)) prev -= 1;
      var index = whiteIndex[prev];
      var button = document.createElement("button");
      button.type = "button";
      button.className = "key black";
      button.dataset.midi = String(midi);
      var whitePct = 100 / whites.length;
      var blackPct = whitePct * 0.58;
      var pc = midi % 12;
      var nudge = pc === 1 ? -0.08 : pc === 3 ? 0.08 : pc === 6 ? -0.1 : pc === 10 ? 0.1 : 0;
      button.style.left = (index + 1) * whitePct - blackPct / 2 + nudge * whitePct + "%";
      button.style.width = blackPct + "%";
      var label = document.createElement("span");
      label.className = "key-label";
      button.appendChild(label);
      button.addEventListener("click", function () {
        playPianoOne(midi);
      });
      piano.appendChild(button);
      pianoKeys.set(midi, button);
    });
  }

  function paintPiano() {
    var key = currentKey();
    var sounding = {};
    T.pianoNotes(key).forEach(function (note) {
      sounding[note.midi] = note.role;
    });
    pianoKeys.forEach(function (button, midi) {
      button.classList.remove("is-chord", "is-root", "is-third", "is-fifth", "is-sixth", "is-ninth");
      var label = button.querySelector(".key-label");
      var role = sounding[midi];
      if (role) {
        button.classList.add("is-chord", "is-" + role);
        label.textContent = T.spell(midi, key);
        button.setAttribute("aria-label", T.spell(midi, key) + "，和弦音");
      } else {
        label.textContent = "";
        button.setAttribute("aria-label", T.spell(midi, key));
      }
    });
    var notes = T.pianoNotes(key);
    var right = notes.filter(function (note) { return note.hand === "right"; });
    document.getElementById("pianoLine").innerHTML =
      "<span>左手 <b>" + T.spell(notes[0].midi, key) + "</b></span>" +
      "<span>右手 <b>" + right.map(function (note) {
        return T.spell(note.midi, key);
      }).join(" · ") + "</b></span>";
  }

  function renderKeys() {
    var box = document.getElementById("keys");
    if (!box.childElementCount) {
      T.KEYS.forEach(function (key) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "key-btn";
        button.textContent = key.name;
        button.dataset.id = key.id;
        button.addEventListener("click", function () {
          state.keyId = key.id;
          renderDynamic();
        });
        box.appendChild(button);
      });
    }
    Array.prototype.forEach.call(box.children, function (button) {
      button.setAttribute("aria-pressed", button.dataset.id === state.keyId ? "true" : "false");
    });
  }

  function renderQuality() {
    var box = document.getElementById("quality");
    if (!box) return;
    var list = T.QUALITIES || [];
    if (list.length < 2) {
      box.hidden = true;
      return;
    }
    box.hidden = false;
    if (!box.childElementCount) {
      list.forEach(function (item) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "key-btn";
        button.textContent = item.label;
        button.dataset.quality = item.id;
        button.addEventListener("click", function () {
          state.quality = item.id;
          state.neckFocus = "all";
          renderDynamic();
        });
        box.appendChild(button);
      });
    }
    Array.prototype.forEach.call(box.children, function (button) {
      button.setAttribute("aria-pressed", button.dataset.quality === state.quality ? "true" : "false");
    });
  }

  var DEGREE_INK = {
    R: ["#9c4a28", "#fffaf3"],
    "3": ["#f7f1e4", "#241c16"],
    b3: ["#e7c4c4", "#241c16"],
    "5": ["#f3efe6", "#241c16"],
    b5: ["#e4c2a8", "#241c16"],
    "6": ["#d5ddb8", "#24301c"],
    "7": ["#f0c2b0", "#241c16"],
    b7: ["#e4b898", "#241c16"],
    bb7: ["#d4a090", "#241c16"],
    "9": ["#e8c27a", "#2a2118"],
    "2": ["#f0d9a0", "#241c16"],
    "4": ["#c9d4e4", "#241c16"],
    b9: ["#e09880", "#241c16"],
    "#9": ["#c45c48", "#fffaf3"],
    "11": ["#b7c8d8", "#241c16"],
    "#11": ["#7facc4", "#241c16"],
    "13": ["#e6d39a", "#241c16"],
    b13: ["#d4a07a", "#241c16"]
  };

  function inkFor(degree) {
    return DEGREE_INK[degree] || ["#f7f1e4", "#241c16"];
  }

  function renderTones() {
    var key = currentKey();
    var list = document.getElementById("tones");
    list.innerHTML = "";
    key.tones.forEach(function (name, index) {
      var item = document.createElement("li");
      if (index >= key.colorFrom) item.className = "is-color";
      var strong = document.createElement("b");
      strong.textContent = name;
      var span = document.createElement("span");
      span.textContent = key.toneLabels[index];
      item.appendChild(strong);
      item.appendChild(span);
      list.appendChild(item);
    });
    document.getElementById("symRoot").textContent = key.name;
    document.getElementById("symQuality").textContent = key.suffix;
    document.getElementById("chordTitle").classList.toggle("is-long", String(key.suffix).length > 3);
    document.getElementById("colorNow").textContent = key.summary;
    var high = document.getElementById("highNote");
    if (high) high.textContent = key.highNote || "";
    document.title = key.name + key.suffix + " · 色彩百科";
  }

  function svgEl(name, attrs) {
    var node = document.createElementNS(SVG, name);
    Object.keys(attrs).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    return node;
  }

  function fretWindow(frets) {
    var sounding = frets.filter(function (fret) { return fret != null; });
    var min = Math.min.apply(null, sounding);
    var max = Math.max.apply(null, sounding);
    if (min <= 5) return { start: 1, end: Math.max(5, max), nut: true, min: min };
    return { start: min, end: Math.max(max, min + 3), nut: false, min: min };
  }

  function drawDiagram(strings, shapeId) {
    var frets = strings.map(function (s) { return s.muted ? null : s.fret; });
    var win = fretWindow(frets);
    var gap = 28;
    var fretW = 50;
    var top = win.nut ? 18 : 40;
    var labelW = 16;
    var boardX = 40;
    var nutW = win.nut ? 7 : 0;
    var count = win.end - win.start + 1;
    var boardW = nutW + count * fretW;
    var width = boardX + boardW + 64;
    var height = top + 5 * gap + 32;
    var svg = svgEl("svg", { viewBox: "0 0 " + width + " " + height, class: "diagram" });

    function yOf(index) { return top + (5 - index) * gap; }

    svg.appendChild(svgEl("rect", {
      x: boardX, y: top - 16, width: boardW, height: 5 * gap + 32, rx: 8, fill: "#5c3b30"
    }));

    var f;
    for (f = 0; f < count; f++) {
      var fretNum = win.start + f;
      var wire = boardX + nutW + (f + 1) * fretW;
      svg.appendChild(svgEl("line", {
        x1: wire, y1: top - 12, x2: wire, y2: top + 5 * gap + 12,
        stroke: "#eadccb", "stroke-width": 2
      }));
      var num = svgEl("text", {
        x: wire - fretW / 2, y: height - 6, "text-anchor": "middle",
        fill: "#8a7b6e", "font-size": 11
      });
      num.textContent = String(fretNum);
      svg.appendChild(num);
      var cx = wire - fretW / 2;
      var inlay = "rgba(255,244,230,0.28)";
      if (fretNum === 12) {
        svg.appendChild(svgEl("circle", { cx: cx, cy: top + 1.5 * gap, r: 3.4, fill: inlay }));
        svg.appendChild(svgEl("circle", { cx: cx, cy: top + 3.5 * gap, r: 3.4, fill: inlay }));
      } else if ([3, 5, 7, 9, 15, 17].indexOf(fretNum) >= 0) {
        svg.appendChild(svgEl("circle", { cx: cx, cy: top + 2.5 * gap, r: 3.4, fill: inlay }));
      }
    }

    if (win.nut) {
      svg.appendChild(svgEl("rect", {
        x: boardX, y: top - 14, width: nutW, height: 5 * gap + 28, fill: "#f6efe4"
      }));
    } else {
      var pos = svgEl("text", {
        x: boardX, y: 14, fill: "#9c4a28", "font-size": 13, "font-weight": 700
      });
      pos.textContent = win.start + " 品起";
      svg.appendChild(pos);
    }

    if (!win.nut) {
      svg.appendChild(svgEl("line", {
        x1: boardX, y1: top - 12, x2: boardX, y2: top + 5 * gap + 12,
        stroke: "#eadccb", "stroke-width": 2
      }));
    }

    strings.forEach(function (s) {
      var y = yOf(s.index);
      svg.appendChild(svgEl("line", {
        x1: boardX + nutW, y1: y, x2: boardX + boardW, y2: y,
        stroke: s.muted ? "rgba(246,236,223,0.25)" : "#f6ecdf",
        "stroke-width": Math.max(0.9, 2.5 - s.index * 0.28),
        "stroke-linecap": "round"
      }));
      var id = svgEl("text", {
        x: labelW, y: y + 4, "text-anchor": "end", fill: "#6a5e53", "font-size": 13
      });
      id.textContent = ["E", "A", "D", "G", "B", "e"][s.index];
      svg.appendChild(id);

      if (s.muted) {
        var mute = svgEl("text", {
          x: boardX - 14, y: y + 5, "text-anchor": "middle",
          fill: "#8a7b6e", "font-size": 16
        });
        mute.textContent = "×";
        svg.appendChild(mute);
        var quiet = svgEl("text", {
          x: boardX + boardW + 12, y: y + 4, fill: "#a89888", "font-size": 13
        });
        quiet.textContent = "闷";
        svg.appendChild(quiet);
        return;
      }

      var space = s.fret - win.start;
      var cx = boardX + nutW + space * fretW + fretW / 2;
      var paint = inkFor(s.degree);
      var fill = paint[0];
      var ink = paint[1];
      var dotAttrs = {
        cx: cx, cy: y, r: 11, fill: fill, class: "dot", "data-midi": String(s.midi)
      };
      if (shapeId) dotAttrs["data-shape"] = shapeId;
      var dot = svgEl("circle", dotAttrs);
      svg.appendChild(dot);
      var degree = svgEl("text", {
        x: cx, y: y + 4, "text-anchor": "middle", fill: ink,
        "font-size": 13, "font-weight": 700, "pointer-events": "none"
      });
      degree.textContent = s.degree;
      svg.appendChild(degree);
      var name = svgEl("text", {
        x: boardX + boardW + 12, y: y + 4,
        fill: inkFor(s.degree)[1] === "#fffaf3" ? "#fffaf3" : "#241c16",
        "font-size": 14, "font-weight": 700
      });
      name.textContent = s.name;
      svg.appendChild(name);

      var hit = svgEl("rect", {
        x: boardX, y: y - 13, width: boardW, height: 26, fill: "transparent"
      });
      hit.style.cursor = "pointer";
      hit.setAttribute("role", "button");
      hit.setAttribute("aria-label", s.stringName + " 弦 " + s.name);
      hit.addEventListener("click", function () {
        playGuitarOne(s);
      });
      svg.appendChild(hit);
    });

    return svg;
  }

  function renderShape(shape, key) {
    var placed = T.placeShape(shape, key);
    var strings = T.stringsOf(placed, key);
    var article = document.createElement("article");
    article.className = "voicing";
    article.dataset.shape = shape.id;
    article.dataset.notation = placed.notation;

    var diagramWrap = document.createElement("div");
    diagramWrap.className = "diagram-scroll";
    diagramWrap.appendChild(drawDiagram(strings, shape.id));

    var text = document.createElement("div");
    var head = document.createElement("div");
    head.className = "title-row";
    var title = document.createElement("h3");
    title.textContent = shape.name;
    var tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = shape.tag;
    head.appendChild(title);
    head.appendChild(tag);

    var notation = document.createElement("p");
    notation.className = "notation";
    notation.textContent = placed.notation;

    var blurb = document.createElement("p");
    blurb.className = "card-note";
    blurb.textContent = shape.blurb;

    var note = document.createElement("p");
    note.className = "card-note";
    note.textContent = shape.note;

    var names = strings.filter(function (s) { return !s.muted; }).map(function (s) { return s.name; });
    var sounding = document.createElement("p");
    sounding.className = "sounding";
    sounding.textContent = "发声 " + names.join(" · ");

    var pianoMidis = {};
    T.pianoNotes(key).forEach(function (n) { pianoMidis[n.midi] = true; });
    var shared = strings.filter(function (s) { return !s.muted && pianoMidis[s.midi]; });
    var share = document.createElement("p");
    share.className = "hint";
    share.textContent = shared.length
      ? "和钢琴同度：" + shared.map(function (s) { return s.name; }).join("、") + "。"
      : "和钢琴没有完全相同的音高，音名仍是这颗和弦里的音。";

    var minFret = Math.min.apply(null, strings.filter(function (s) { return !s.muted; }).map(function (s) { return s.fret; }));
    var placeHint = null;
    if (minFret === 1 && shape.barre) {
      placeHint = document.createElement("p");
      placeHint.className = "place-hint";
      placeHint.textContent = "这一调靠着琴枕，横按会紧一些。";
    } else if (minFret >= 12) {
      placeHint = document.createElement("p");
      placeHint.className = "place-hint";
      placeHint.textContent = "把位比较高。";
    }

    var transport = document.createElement("div");
    transport.className = "transport";
    [["block", "齐奏"], ["up", "琶音上行"], ["down", "琶音下行"]].forEach(function (pair, index) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = index === 0 ? "btn primary" : "btn";
      button.textContent = pair[1];
      button.addEventListener("click", function () {
        playShape(shape, pair[0]);
      });
      transport.appendChild(button);
    });

    var details = document.createElement("details");
    var summary = document.createElement("summary");
    summary.textContent = "品位是怎么算的";
    var list = document.createElement("ul");
    list.className = "math";
    strings.forEach(function (s) {
      var item = document.createElement("li");
      item.textContent = s.muted
        ? s.stringName + " 弦闷住，不发声。"
        : s.stringName + " 弦空弦 " + s.openName + "，第 " + s.fret + " 品，向上 " + s.fret + " 个半音，是 " + s.name + "。";
      list.appendChild(item);
    });
    details.appendChild(summary);
    details.appendChild(list);

    text.appendChild(head);
    text.appendChild(notation);
    text.appendChild(blurb);
    text.appendChild(note);
    text.appendChild(sounding);
    text.appendChild(share);
    if (placeHint) text.appendChild(placeHint);
    text.appendChild(transport);
    text.appendChild(details);

    article.appendChild(diagramWrap);
    article.appendChild(text);
    return article;
  }

  var PALETTE = ["#9c4a28", "#2f6f6a", "#4a5f9c", "#6a7a32", "#8a4e70", "#8a6232"];
  function shapeColor(id) {
    var list = shapes();
    var i;
    for (i = 0; i < list.length; i++) if (list[i].id === id) return PALETTE[i % PALETTE.length];
    return "#9c4a28";
  }

  function neckMaxFret(key) {
    var max = 12;
    shapes().forEach(function (shape) {
      T.placeShape(shape, key).frets.forEach(function (fret) {
        if (fret != null && fret > max) max = fret;
      });
    });
    return max;
  }

  function drawNeckOverview(key) {
    var focus = state.neckFocus;
    var maxFret = neckMaxFret(key);
    var gap = 26;
    var fretW = 34;
    var top = 46;
    var boardX = 36;
    var nutW = 7;
    var bottomPad = 62;
    var width = boardX + nutW + maxFret * fretW + 36;
    var height = top + 5 * gap + bottomPad;
    var svg = svgEl("svg", { viewBox: "0 0 " + width + " " + height, class: "diagram neck-diagram" });

    function yOf(index) { return top + (5 - index) * gap; }

    svg.appendChild(svgEl("rect", {
      x: boardX, y: top - 16, width: nutW + maxFret * fretW, height: 5 * gap + 32, rx: 8, fill: "#5c3b30"
    }));
    svg.appendChild(svgEl("rect", {
      x: boardX, y: top - 14, width: nutW, height: 5 * gap + 28, fill: "#f6efe4"
    }));

    var f;
    for (f = 1; f <= maxFret; f++) {
      var wire = boardX + nutW + f * fretW;
      svg.appendChild(svgEl("line", {
        x1: wire, y1: top - 12, x2: wire, y2: top + 5 * gap + 12,
        stroke: "#eadccb", "stroke-width": f % 12 === 0 ? 3 : 2
      }));
      var num = svgEl("text", {
        x: wire - fretW / 2, y: top + 5 * gap + 28, "text-anchor": "middle",
        fill: "#8a7b6e", "font-size": 11
      });
      num.textContent = String(f);
      svg.appendChild(num);
      var cx = wire - fretW / 2;
      var inlay = "rgba(255,244,230,0.28)";
      if (f === 12) {
        svg.appendChild(svgEl("circle", { cx: cx, cy: top + 1.5 * gap, r: 3.2, fill: inlay }));
        svg.appendChild(svgEl("circle", { cx: cx, cy: top + 3.5 * gap, r: 3.2, fill: inlay }));
      } else if ([3, 5, 7, 9, 15, 17].indexOf(f) >= 0) {
        svg.appendChild(svgEl("circle", { cx: cx, cy: top + 2.5 * gap, r: 3.2, fill: inlay }));
      }
    }

    ["E", "A", "D", "G", "B", "e"].forEach(function (label, index) {
      var y = yOf(index);
      svg.appendChild(svgEl("line", {
        x1: boardX + nutW, y1: y, x2: boardX + nutW + maxFret * fretW, y2: y,
        stroke: "#f6ecdf",
        "stroke-width": Math.max(0.9, 2.5 - index * 0.28),
        "stroke-linecap": "round"
      }));
      var id = svgEl("text", {
        x: 20, y: y + 4, "text-anchor": "end", fill: "#6a5e53", "font-size": 13
      });
      id.textContent = label;
      svg.appendChild(id);
    });

    var placedList = shapes().map(function (shape) {
      var placed = T.placeShape(shape, key);
      var strings = T.stringsOf(placed, key);
      var sounding = strings.filter(function (s) { return !s.muted; });
      var frets = sounding.map(function (s) { return s.fret; });
      var indices = sounding.map(function (s) { return s.index; });
      return {
        shape: shape,
        placed: placed,
        strings: strings,
        sounding: sounding,
        minFret: Math.min.apply(null, frets),
        maxFret: Math.max.apply(null, frets),
        loStr: Math.min.apply(null, indices),
        hiStr: Math.max.apply(null, indices)
      };
    });

    function bandX(minFret, maxFret) {
      return {
        x: boardX + nutW + (minFret - 1) * fretW + 3,
        w: (maxFret - minFret + 1) * fretW - 6
      };
    }

    function addBand(entry, opacity) {
      var box = bandX(entry.minFret, entry.maxFret);
      var yTop = yOf(entry.hiStr) - 13;
      var yBot = yOf(entry.loStr) + 13;
      var color = shapeColor(entry.shape.id);
      var band = svgEl("rect", {
        x: box.x, y: yTop, width: box.w, height: yBot - yTop, rx: 10,
        fill: color, opacity: String(opacity),
        class: "neck-band", "data-shape": entry.shape.id
      });
      band.style.cursor = "pointer";
      band.addEventListener("click", function () {
        state.neckFocus = entry.shape.id;
        renderGuitar();
      });
      svg.appendChild(band);
    }

    var visible = placedList.filter(function (entry) {
      return focus === "all" || entry.shape.id === focus;
    });

    if (focus === "all") {
      placedList.forEach(function (entry) { addBand(entry, 0.2); });
    } else {
      visible.forEach(function (entry) { addBand(entry, 0.16); });
    }

    // Fret-range labels under the board, clustered by neighborhood
    var labelY = top + 5 * gap + 42;
    if (focus === "all") {
      var groups = [
        { name: "低把位", items: placedList.filter(function (e) { return e.shape.group === "low"; }) },
        { name: "高把位", items: placedList.filter(function (e) { return e.shape.group === "high"; }) }
      ];
      groups.forEach(function (group) {
        if (!group.items.length) return;
        var minF = Math.min.apply(null, group.items.map(function (e) { return e.minFret; }));
        var maxF = Math.max.apply(null, group.items.map(function (e) { return e.maxFret; }));
        var box = bandX(minF, maxF);
        var label = svgEl("text", {
          x: box.x + box.w / 2, y: labelY, "text-anchor": "middle",
          fill: "#9c4a28", "font-size": 12, "font-weight": 700
        });
        var names = group.items.map(function (e) { return e.shape.name; }).join(" · ");
        label.textContent = group.name + " " + minF + "–" + maxF + " 品";
        svg.appendChild(label);
      });
    } else {
      visible.forEach(function (entry) {
        var box = bandX(entry.minFret, entry.maxFret);
        var label = svgEl("text", {
          x: box.x + box.w / 2, y: labelY, "text-anchor": "middle",
          fill: "#9c4a28", "font-size": 12, "font-weight": 700
        });
        label.textContent = entry.shape.name + "  " + entry.minFret + "–" + entry.maxFret + " 品";
        svg.appendChild(label);
      });
    }

    function addDot(s, shapeId, fill, ink, r, fontSize) {
      var cx = boardX + nutW + (s.fret - 1) * fretW + fretW / 2;
      var y = yOf(s.index);
      var dot = svgEl("circle", {
        cx: cx, cy: y, r: r, fill: fill, class: "dot",
        "data-midi": String(s.midi), "data-shape": shapeId
      });
      svg.appendChild(dot);
      var degree = svgEl("text", {
        x: cx, y: y + 4, "text-anchor": "middle", fill: ink,
        "font-size": String(fontSize || 13), "font-weight": 700, "pointer-events": "none"
      });
      degree.textContent = s.degree;
      svg.appendChild(degree);
      var hit = svgEl("rect", {
        x: cx - 12, y: y - 12, width: 24, height: 24, fill: "transparent"
      });
      hit.style.cursor = "pointer";
      hit.setAttribute("role", "button");
      hit.setAttribute("aria-label", s.stringName + " 弦 " + s.name);
      hit.addEventListener("click", function (event) {
        event.stopPropagation();
        playGuitarOne(s);
      });
      svg.appendChild(hit);
    }

    if (focus === "all") {
      var cells = {};
      placedList.forEach(function (entry) {
        entry.sounding.forEach(function (s) {
          var k = s.index + ":" + s.fret;
          if (!cells[k]) cells[k] = { s: s, shapes: [] };
          cells[k].shapes.push(entry.shape);
        });
      });
      Object.keys(cells).forEach(function (k) {
        var cell = cells[k];
        var fill = cell.shapes.length === 1 ? shapeColor(cell.shapes[0].id) : "#c4a574";
        var ink = cell.shapes.length === 1 ? "#fffaf3" : "#2a2118";
        addDot(cell.s, cell.shapes[0].id, fill, ink, 10, 11);
      });
    } else {
      visible.forEach(function (entry) {
        entry.sounding.forEach(function (s) {
          var paint = inkFor(s.degree);
          var fill = paint[0];
          var ink = paint[1];
          addDot(s, entry.shape.id, fill, ink, 11, 13);
        });
      });
    }

    return svg;
  }

  function renderNeck(key) {
    var host = document.getElementById("neckOverview");
    host.innerHTML = "";
    var panel = document.createElement("div");
    panel.className = "neck-panel";

    var chips = document.createElement("div");
    chips.className = "neck-chips";
    chips.setAttribute("role", "tablist");
    chips.setAttribute("aria-label", "在全指板上查看的把位");

    function addChip(id, label) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "chip" + (state.neckFocus === id ? " is-on" : "");
      button.textContent = label;
      if (id !== "all" && shapeColor(id)) {
        button.style.boxShadow = state.neckFocus === id ? "" : "inset 0 0 0 2px " + shapeColor(id);
      }
      button.addEventListener("click", function () {
        state.neckFocus = id;
        renderGuitar();
      });
      chips.appendChild(button);
    }

    addChip("all", "全部位置");
    shapes().forEach(function (shape) {
      addChip(shape.id, shape.name);
    });

    var scroll = document.createElement("div");
    scroll.className = "neck-scroll";
    scroll.appendChild(drawNeckOverview(key));

    var hint = document.createElement("p");
    hint.className = "hint neck-hint";
    hint.textContent = "演奏视角：低音弦在下、靠近你，高音弦在上。点把位名称，指板上只亮那一把；点圆点可以单听那个音。";

    panel.appendChild(chips);
    panel.appendChild(scroll);
    panel.appendChild(hint);
    host.appendChild(panel);
  }

  function renderGuitar() {

    var key = currentKey();
    renderNeck(key);
    var low = document.getElementById("guitarLow");
    var high = document.getElementById("guitarHigh");
    low.innerHTML = "";
    high.innerHTML = "";
    shapes().forEach(function (shape) {
      var node = renderShape(shape, key);
      if (state.neckFocus === shape.id) node.classList.add("is-focused");
      (shape.group === "low" ? low : high).appendChild(node);
    });
  }

  function renderBass() {
    var key = currentKey();
    var notes = T.bassNotes(key);
    var box = document.getElementById("bassNotes");
    box.innerHTML = "";
    var bassLabels = key.bassLabels || ["根音", "五音"];
    [[bassLabels[0], notes[0]], [bassLabels[1], notes[1]]].forEach(function (pair) {
      var pill = document.createElement("span");
      pill.className = "pill";
      pill.textContent = pair[0] + " " + T.spell(pair[1].midi, key);
      box.appendChild(pill);
    });
    document.getElementById("bassRoot").textContent = bassLabels[0] + " " + T.spell(notes[0].midi, key);
    document.getElementById("bassFifth").textContent = bassLabels[1] + " " + T.spell(notes[1].midi, key);
    var walk = document.getElementById("bassWalk");
    if (walk) walk.textContent = key.walkLabel || "根—五—根";
  }

  function renderCompare() {
    var host = document.getElementById("compare");
    if (!host) return;
    var key = currentKey();
    var list = key.compares || [];
    host.innerHTML = "";
    list.forEach(function (item) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "btn";
      button.textContent = item[1];
      button.addEventListener("click", function () {
        var pc = (key.pc + Number(item[2] || 0)) % 12;
        playMidis(window.ChordVoice.notesFromPc(pc, item[0]));
      });
      host.appendChild(button);
    });
  }

  function renderDynamic() {
    renderQuality();
    renderKeys();
    renderTones();
    paintPiano();
    renderGuitar();
    renderBass();
    renderCompare();
  }

  function playPianoNotes(notes, spacing) {
    withAudio(function (eng) {
      var when = eng.ctx.currentTime + 0.04;
      notes.forEach(function (note, index) {
        var at = when + index * spacing;
        var gain = note.role === "third" ? 0.84 : 0.74;
        eng.playPiano(note.midi, at, gain);
        pulseMidi(note.midi, at, 900);
      });
    });
  }

  function playPianoOne(midi) {
    withAudio(function (eng) {
      var at = eng.ctx.currentTime + 0.02;
      eng.playPiano(midi, at, 0.8);
      pulseMidi(midi, at, 700);
    });
  }

  function playShape(shape, mode) {
    var key = currentKey();
    var strings = T.stringsOf(T.placeShape(shape, key), key).filter(function (s) { return !s.muted; });
    var ordered = strings.slice();
    if (mode === "up" || mode === "down") {
      ordered.sort(function (a, b) { return a.midi - b.midi; });
      if (mode === "down") ordered.reverse();
    }
    var spacing = mode === "block" ? 0.018 : state.spacing;
    withAudio(function (eng) {
      var when = eng.ctx.currentTime + 0.04;
      ordered.forEach(function (s, index) {
        var at = when + index * spacing;
        var edge = index === 0 || index === ordered.length - 1 ? 0.08 : 0;
        eng.playGuitar(s.midi, BRIGHT[s.index], at, 0.62 + edge);
        document.querySelectorAll('.dot[data-shape="' + shape.id + '"][data-midi="' + s.midi + '"]').forEach(function (dot) {
          pulse(dot, at, 640);
        });
        pulse(pianoKeys.get(s.midi), at, 640);
      });
    });
  }

  function playGuitarOne(s) {
    withAudio(function (eng) {
      var at = eng.ctx.currentTime + 0.02;
      eng.playGuitar(s.midi, BRIGHT[s.index], at, 0.72);
      pulseMidi(s.midi, at, 640);
    });
  }

  function playBass(mode) {
    var notes = T.bassNotes(currentKey());
    var list = mode === "root" ? [notes[0]] : mode === "fifth" ? [notes[1]] : notes;
    var spacing = Math.max(0.14, state.spacing);
    withAudio(function (eng) {
      var when = eng.ctx.currentTime + 0.03;
      list.forEach(function (note, index) {
        var at = when + index * spacing;
        eng.playBass(note.midi, at, 0.9);
        pulse(pianoKeys.get(note.midi), at, 500);
      });
    });
  }

  document.getElementById("pianoBlock").addEventListener("click", function () {
    playPianoNotes(T.pianoNotes(currentKey()), 0);
  });
  document.getElementById("pianoUp").addEventListener("click", function () {
    playPianoNotes(T.pianoNotes(currentKey()), state.spacing);
  });
  document.getElementById("pianoDown").addEventListener("click", function () {
    playPianoNotes(T.pianoNotes(currentKey()).slice().reverse(), state.spacing);
  });
  document.getElementById("bassRoot").addEventListener("click", function () { playBass("root"); });
  document.getElementById("bassFifth").addEventListener("click", function () { playBass("fifth"); });
  document.getElementById("bassWalk").addEventListener("click", function () { playBass("walk"); });

  document.getElementById("speed").addEventListener("input", function (event) {
    state.spacing = Number(event.target.value) / 1000;
    document.getElementById("speedLabel").textContent = event.target.value + " 毫秒";
  });
  document.getElementById("volume").addEventListener("input", function (event) {
    state.volume = Number(event.target.value) / 100;
    document.getElementById("volumeLabel").textContent = event.target.value + "%";
    if (engine) engine.setVolume(state.volume);
  });

  function playMidis(midis) {
    withAudio(function (eng) {
      var at = eng.ctx.currentTime + 0.04;
      midis.forEach(function (midi) {
        eng.playPiano(midi, at, midis.length > 4 ? 0.58 : 0.72);
        pulseMidi(midi, at, 880);
      });
    });
  }

  function playLoop(symbols) {
    var box = document.getElementById("loopStatus");
    if (box) {
      box.hidden = false;
      box.textContent = window.ChordVoice.statusLine(symbols) + "这段按写下的调，不跟上面的转调走。";
    }
    withAudio(function (eng) {
      window.ChordVoice.playProgression(eng, symbols, {
        onEvent: function (event) { pulseMidi(event.midi, event.when, 700); }
      });
    });
  }

  document.querySelectorAll("[data-chords]").forEach(function (button) {
    button.addEventListener("click", function () {
      playLoop(button.getAttribute("data-chords").trim().split(/\s+/));
    });
  });
  document.querySelectorAll("[data-keyjump]").forEach(function (button) {
    button.addEventListener("click", function () {
      state.keyId = button.getAttribute("data-keyjump");
      var quality = button.getAttribute("data-qualityjump");
      if (quality === "6" || quality === "69") {
        state.quality = quality;
        state.neckFocus = "all";
      }
      renderDynamic();
      document.getElementById("guitarHeading").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  buildPiano();
  renderDynamic();
})();
