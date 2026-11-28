(function () {
  function step(name, midi, color) {
    return { name: name, midi: midi, beats: 1, color: !!color };
  }
  function tone(name, deg, midi, color) {
    return { name: name, deg: deg, midi: midi, color: !!color };
  }

  var MODES = [
    {
      id: "ionian",
      name: "伊奥尼亚",
      en: "Ionian",
      family: "major",
      familyLabel: "大调色彩 · 主音 C",
      spell: "sharp",
      lead: "伊奥尼亚就是 C 自然大调。没有降音，也没有升音。",
      compare: "和另外两个大调色彩比：四级是 F，七级是 B，会落到 C。利底亚把 F 升成 F#。混合利底亚把 B 降成 Bb。",
      scale: [
        tone("C", "1", 60), tone("D", "2", 62), tone("E", "3", 64), tone("F", "4", 65, true),
        tone("G", "5", 67), tone("A", "6", 69), tone("B", "7", 71, true)
      ],
      colorLabel: "要听清的是还原四级 F，还有大七级 B。",
      chords: [
        ["I", "C", "Cmaj7"],
        ["ii", "Dm", "Dm7"],
        ["iii", "Em", "Em7"],
        ["IV", "F", "Fmaj7"],
        ["V", "G", "G7"],
        ["vi", "Am", "Am7"],
        ["vii°", "Bdim", "Bm7b5"]
      ],
      melody: [step("G", 67), step("A", 69), step("B", 71, true), step("C", 72), step("F", 65, true), step("E", 64), step("D", 62), step("C", 60)],
      melodyNote: "B 落到 C。F 是还原四级。",
      chordsPlay: ["C", "F", "G", "C"],
      progressionNote: "I、IV、V、I。这是 C 大调里你已经在用的家。",
      task: "今天写 4 小节，主音 C。和弦用 C、F、G，可以回到 C。旋律里要有 F，还要有 B 落到 C。F 保持还原。",
      parent: "从 C 开始，只弹白键，弹回 C，就是它。"
    },
    {
      id: "dorian",
      name: "多利亚",
      en: "Dorian",
      family: "minor",
      familyLabel: "小调色彩 · 主音 A",
      spell: "sharp",
      lead: "多利亚是 A 自然小调，只把六级升高。",
      compare: "A 自然小调是 A B C D E F G。六级 F 换成 F#，就是 A 多利亚。F# 是大六度。和 A 大调比：三级是 C，七级是 G，都比大调低半音。",
      scale: [
        tone("A", "1", 57), tone("B", "2", 59), tone("C", "b3", 60), tone("D", "4", 62),
        tone("E", "5", 64), tone("F#", "6", 66, true), tone("G", "b7", 67)
      ],
      colorLabel: "特征音是大六度 F#。",
      chords: [
        ["i", "Am", "Am7"],
        ["ii", "Bm", "Bm7"],
        ["bIII", "C", "Cmaj7"],
        ["IV", "D", "D7"],
        ["v", "Em", "Em7"],
        ["vi°", "F#dim", "F#m7b5"],
        ["bVII", "G", "Gmaj7"]
      ],
      melody: [step("A", 69), step("C", 72), step("E", 76), step("F#", 78, true), step("F#", 78, true), step("E", 76), step("D", 74), step("A", 69)],
      melodyNote: "F# 出现两次。自然小调这里会是 F。",
      chordsPlay: ["Am7", "D7", "Am7", "D7"],
      progressionNote: "i 到 IV。D7 里的 F#，就是那个大六度。",
      task: "今天写 4 小节。和弦只用 Am 和 D，可以用 Am7 和 D7。旋律里至少用两次 F#。六级保持升号。",
      parent: "A 多利亚用的是 G 大调那七个音，从 A 排到 A。从 A 起只弹白键，六级是 F，那是自然小调。",
      extra: {
        label: "同一条旋律，六级改低",
        melody: [step("A", 69), step("C", 72), step("E", 76), step("F", 77, true), step("F", 77, true), step("E", 76), step("D", 74), step("A", 69)],
        status: "这是 A 自然小调的六级 F。和刚才的 F# 比一比。"
      },
      songs: [
        {
          klass: "pop",
          title: "Oye Como Va",
          meta: "Santana · 原调 A",
          text: "两格是 Am7 和 D7，谱上有时把第二格写成 D9。F# 是 A 的大六度。这一页的 A 多利亚进行，就是这一对和弦。Ethan Hein 把整首放在 A 多利亚。也有人说它是 G 大调的 ii 到 V，一直不回到 G。和弦没有争论。",
          source: "依据：Ethan Hein；Jon MacLennan 的和弦课。两处都是 Am7 和 D（D7 或 D9）。"
        },
        {
          klass: "jazz",
          title: "So What",
          meta: "Miles Davis · Kind of Blue · 原调 D",
          text: "原调是 D 多利亚，主段长时间停在 Dm7。桥段升半音，停在 Ebm7，那是 Eb 多利亚。和这一页的 Am 到 D 是两种用法。小七那一课说过：谱上写的是 m7。",
          source: "依据：Jazz Language Workbooks；Bruno Jazz 对曲式的说明。主段 Dm7、桥段 Ebm7，几份说明一致。"
        }
      ]
    },
    {
      id: "phrygian",
      name: "弗里几亚",
      en: "Phrygian",
      family: "minor",
      familyLabel: "小调色彩 · 主音 A",
      spell: "flat",
      lead: "弗里几亚是 A 自然小调，只把二级降低。",
      compare: "A 自然小调的二级是 B。这里把 B 降成 Bb。Bb 是降二级，紧贴在 A 下面。和 A 大调比：二级、三级、六级、七级都低半音。",
      scale: [
        tone("A", "1", 57), tone("Bb", "b2", 58, true), tone("C", "b3", 60), tone("D", "4", 62),
        tone("E", "5", 64), tone("F", "b6", 65), tone("G", "b7", 67)
      ],
      colorLabel: "特征音是降二级 Bb。",
      chords: [
        ["i", "Am", "Am7"],
        ["bII", "Bb", "Bbmaj7"],
        ["bIII", "C", "C7"],
        ["iv", "Dm", "Dm7"],
        ["v°", "Edim", "Em7b5"],
        ["bVI", "F", "Fmaj7"],
        ["bvii", "Gm", "Gm7"]
      ],
      melody: [step("A", 69), step("Bb", 70, true), step("C", 72), step("A", 69), step("Bb", 70, true), step("A", 69), step("G", 67), step("A", 69)],
      melodyNote: "Bb 紧挨着 A。二级在这里是降的。",
      chordsPlay: ["Am", "Bb", "Am", "Bb"],
      progressionNote: "i 到降 II。Bb 大三和弦把降二级放在根音上。",
      task: "今天写 4 小节，主音 A。进行里必须有 Am 接到 Bb。旋律里用 Bb，二级保持降号。",
      parent: "A 弗里几亚用的是 F 大调那七个音，从 A 排到 A。白键从 E 起，是 E 弗里几亚。"
    },
    {
      id: "lydian",
      name: "利底亚",
      en: "Lydian",
      family: "major",
      familyLabel: "大调色彩 · 主音 C",
      spell: "sharp",
      lead: "利底亚是 C 自然大调，只把四级升高。",
      compare: "C 大调的四级是 F。这里把 F 升成 F#。F# 是升四级。七级仍是 B，主和弦仍是大三和弦。",
      scale: [
        tone("C", "1", 60), tone("D", "2", 62), tone("E", "3", 64), tone("F#", "#4", 66, true),
        tone("G", "5", 67), tone("A", "6", 69), tone("B", "7", 71)
      ],
      colorLabel: "特征音是升四级 F#。",
      chords: [
        ["I", "C", "Cmaj7"],
        ["II", "D", "D7"],
        ["iii", "Em", "Em7"],
        ["#iv°", "F#dim", "F#m7b5"],
        ["V", "G", "Gmaj7"],
        ["vi", "Am", "Am7"],
        ["vii", "Bm", "Bm7"]
      ],
      melody: [step("C", 60), step("D", 62), step("E", 64), step("F#", 66, true), step("G", 67), step("F#", 66, true), step("E", 64), step("C", 60)],
      melodyNote: "F# 比大调的 F 高半音。听到它，就和普通 C 大调分开了。",
      chordsPlay: ["C", "D", "C", "D"],
      progressionNote: "I 到 II。D 大三和弦里的 F#，就是升四级。",
      task: "今天写 4 小节，主音 C。和弦用 C 和 D。旋律里用 F#。四级保持升号。",
      parent: "C 利底亚用的是 G 大调那七个音，从 C 排到 C。白键从 F 起，是 F 利底亚。"
    },
    {
      id: "mixolydian",
      name: "混合利底亚",
      en: "Mixolydian",
      family: "major",
      familyLabel: "大调色彩 · 主音 C",
      spell: "flat",
      lead: "混合利底亚是 C 自然大调，只把七级降低。",
      compare: "C 大调的七级是 B。这里把 B 降成 Bb。Bb 是降七级。三级仍是 E，主和弦还是大三和弦。它用 Bb，不靠 B 把耳朵拉回 C。",
      scale: [
        tone("C", "1", 60), tone("D", "2", 62), tone("E", "3", 64), tone("F", "4", 65),
        tone("G", "5", 67), tone("A", "6", 69), tone("Bb", "b7", 70, true)
      ],
      colorLabel: "特征音是降七级 Bb。",
      chords: [
        ["I", "C", "C7"],
        ["ii", "Dm", "Dm7"],
        ["iii°", "Edim", "Em7b5"],
        ["IV", "F", "Fmaj7"],
        ["v", "Gm", "Gm7"],
        ["vi", "Am", "Am7"],
        ["bVII", "Bb", "Bbmaj7"]
      ],
      melody: [step("C", 60), step("E", 64), step("G", 67), step("Bb", 70, true), step("A", 69), step("G", 67), step("F", 65), step("C", 60)],
      melodyNote: "Bb 停在大七级的下面。七级在这里是降的。",
      chordsPlay: ["C", "Bb", "F", "C"],
      progressionNote: "I、降 VII、IV、I。Bb 大三和弦把降七级放在根音上。",
      task: "今天写 4 小节，主音 C。和弦用 C 和 Bb，可以加上 F。旋律里用 Bb。七级保持降号。",
      parent: "C 混合利底亚用的是 F 大调那七个音，从 C 排到 C。白键从 G 起，是 G 混合利底亚。",
      songs: [
        {
          klass: "pop",
          title: "Norwegian Wood",
          meta: "The Beatles · 主歌 · 原调 E",
          text: "主歌是 E 混合利底亚。降七级是 D，和弦里听得到 E 和 D。中间段转到小调色彩。整首不要都算成混合利底亚。",
          source: "依据：Paul McCartney Project 转引的调式说明；Hooktheory 把主歌标成 E Mixolydian、中间段标成 E Dorian。主歌的降七级，几处一致。"
        }
      ]
    },
    {
      id: "aeolian",
      name: "爱奥利亚",
      en: "Aeolian",
      family: "minor",
      familyLabel: "小调色彩 · 主音 A",
      spell: "sharp",
      lead: "爱奥利亚就是 A 自然小调。音是 A B C D E F G。你已经会这一套。",
      compare: "和多利亚比，六级是 F，是小六度。多利亚把这个 F 升成 F#。和 A 大调比：三级是 C，六级是 F，七级是 G。",
      scale: [
        tone("A", "1", 57), tone("B", "2", 59), tone("C", "b3", 60), tone("D", "4", 62),
        tone("E", "5", 64), tone("F", "b6", 65, true), tone("G", "b7", 67)
      ],
      colorLabel: "和多利亚分开的那个音，是小六度 F。",
      chords: [
        ["i", "Am", "Am7"],
        ["ii°", "Bdim", "Bm7b5"],
        ["bIII", "C", "Cmaj7"],
        ["iv", "Dm", "Dm7"],
        ["v", "Em", "Em7"],
        ["bVI", "F", "Fmaj7"],
        ["bVII", "G", "G7"]
      ],
      melody: [step("A", 69), step("C", 72), step("E", 76), step("F", 77, true), step("E", 76), step("D", 74), step("C", 72), step("A", 69)],
      melodyNote: "和多利亚是同一类旋律，六级用 F。",
      chordsPlay: ["Am", "F", "G", "Am"],
      progressionNote: "i、降 VI、降 VII、i。F 里的 F 就是小六度。",
      task: "今天写 4 小节，主音 A。和弦用 Am、F、G。旋律里用 F。写完可以把 F 换成多利亚的 F#，听哪一个更亮。",
      parent: "从 A 起只弹白键，就是它。",
      extra: {
        label: "同一条旋律，六级升高",
        melody: [step("A", 69), step("C", 72), step("E", 76), step("F#", 78, true), step("E", 76), step("D", 74), step("C", 72), step("A", 69)],
        status: "六级改成 F#。这就是 A 多利亚。"
      }
    },
    {
      id: "locrian",
      name: "洛克里亚",
      en: "Locrian",
      family: "minor",
      familyLabel: "小调色彩 · 主音 A",
      spell: "flat",
      lead: "洛克里亚很少当一首歌的家。主和弦的五音是降的，站不稳。",
      compare: "和 A 自然小调比：二级 B 再降成 Bb，五级 E 再降成 Eb。主和弦是 A、C、Eb。Eb 是降五级。五音不纯，耳朵不想把 A 当成家。",
      scale: [
        tone("A", "1", 57), tone("Bb", "b2", 58, true), tone("C", "b3", 60), tone("D", "4", 62),
        tone("Eb", "b5", 63, true), tone("F", "b6", 65), tone("G", "b7", 67)
      ],
      colorLabel: "让主音站不稳的是降五级 Eb。降二级 Bb 也在。",
      chords: [
        ["i°", "Adim", "Am7b5"],
        ["bII", "Bb", "Bbmaj7"],
        ["biii", "Cm", "Cm7"],
        ["iv", "Dm", "Dm7"],
        ["bV", "Eb", "Ebmaj7"],
        ["bVI", "F", "F7"],
        ["bvii", "Gm", "Gm7"]
      ],
      melody: [step("A", 69), step("Bb", 70, true), step("C", 72), step("Eb", 75, true), step("D", 74), step("C", 72), step("Bb", 70), step("A", 69)],
      melodyNote: "Eb 是降五级。它回到 A 的时候，家还是虚的。",
      chordsPlay: ["Am7b5", "Bbmaj7", "Am7b5"],
      progressionNote: "减的主和弦走到降 II，再回来。短短三格，用来感觉它为什么不停。",
      task: "今天只写 2 到 4 小节，主音 A。主和弦用 Adim 或 Am7b5，旁边用 Bb 或 Dm。旋律里用 Eb。听的时候问自己：它想停在 A 吗？然后改成 Am、F、G，再听一次。",
      parent: "A 洛克里亚用的是 Bb 大调那七个音，从 A 排到 A。白键从 B 起是 B 洛克里亚，主和弦一样站不稳。",
      extra: {
        label: "改听 A 自然小调",
        chords: ["Am", "F", "G", "Am"],
        status: "这是爱奥利亚：Am、F、G、Am。主和弦是小三，五音是纯的，能停住。"
      }
    }
  ];

  var current = "dorian";
  var focus = null;
  var engine = null;
  var RENDER_RATE = 44100;
  var KB_LO = 48;
  var KB_HI = 72;
  var SHARP_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  var FLAT_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

  function pcOf(midi) { return ((midi % 12) + 12) % 12; }
  function isWhite(midi) {
    var pc = pcOf(midi);
    return pc === 0 || pc === 2 || pc === 4 || pc === 5 || pc === 7 || pc === 9 || pc === 11;
  }
  function spell(midi, mode) {
    return (mode.spell === "flat" ? FLAT_NAMES : SHARP_NAMES)[pcOf(midi)];
  }
  function chordNames(symbol, mode) {
    var seen = {};
    var list = [];
    window.ChordVoice.notes(symbol).forEach(function (midi) {
      var name = spell(midi, mode);
      if (seen[name]) return;
      seen[name] = true;
      list.push({ name: name, pc: pcOf(midi) });
    });
    list.sort(function (a, b) { return a.pc - b.pc; });
    return list.map(function (item) { return item.name; });
  }

  function createEngine() {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    var ctx = new Ctx();
    var master = ctx.createGain();
    master.gain.value = 0.82;
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
      playPiano: function (midi, when, gain, seconds) {
        var dur = seconds || 1.95;
        var key = "p" + midi + ":" + Math.round(dur * 1000);
        if (!cache.has(key)) cache.set(key, bufferFrom(window.ChordSound.renderPiano(midi, RENDER_RATE, dur)));
        var src = ctx.createBufferSource();
        src.buffer = cache.get(key);
        var g = ctx.createGain();
        g.gain.setValueAtTime(Math.max(0.0001, gain), when);
        src.connect(g);
        g.connect(master);
        src.start(when);
        return src;
      }
    };
  }

  function ensure() {
    if (!engine) engine = createEngine();
    if (!engine) return Promise.resolve(null);
    if (engine.ctx.state === "suspended") return engine.ctx.resume().then(function () { return engine; });
    return Promise.resolve(engine);
  }

  function setStatus(text) {
    var box = document.getElementById("loopStatus");
    box.hidden = false;
    box.textContent = text;
  }

  function withEng(run) {
    ensure().then(function (eng) {
      if (!eng) {
        setStatus("这个浏览器没有放开音频。");
        return;
      }
      run(eng);
    }).catch(function () {
      setStatus("再点一次，浏览器才会出声。");
    });
  }

  function playLine(notes, text) {
    setStatus(text);
    withEng(function (eng) { window.ChordVoice.playMelody(eng, notes, { repeats: 2 }); });
  }

  function playChords(symbols, text) {
    setStatus(text || window.ChordVoice.statusLine(symbols));
    withEng(function (eng) { window.ChordVoice.playProgression(eng, symbols); });
  }

  function playDegree(mode, index) {
    var scaleTone = mode.scale[index];
    var seventh = mode.chords[index][2];
    var beat = 60 / 90;
    var chord = window.ChordVoice.notes(seventh).slice().sort(function (a, b) { return a - b; });
    var events = [{ midi: scaleTone.midi, at: 0, gain: 0.78, seconds: beat - 0.03 }];
    chord.forEach(function (midi) {
      events.push({ midi: midi, at: beat, gain: 0.52, seconds: beat * 2 - 0.03 });
    });
    var names = chordNames(seventh, mode);
    setStatus("先听 " + scaleTone.deg + " 音 " + scaleTone.name + "，再听 " + seventh + "（" + names.join("、") + "）。");
    withEng(function (eng) { window.ChordVoice.playHits(eng, events); });
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function modeNow() {
    return MODES.filter(function (mode) { return mode.id === current; })[0];
  }

  function renderTabs() {
    var row = document.getElementById("modes");
    row.innerHTML = "";
    MODES.forEach(function (mode) {
      var button = document.createElement("button");
      button.type = "button";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", mode.id === current ? "true" : "false");
      button.textContent = mode.name;
      if (mode.id === current) button.className = "is-on";
      button.addEventListener("click", function () {
        current = mode.id;
        focus = null;
        render();
      });
      row.appendChild(button);
    });
  }

  function selectDegree(index) {
    focus = index;
    render();
    playDegree(modeNow(), index);
  }

  function renderKeyboard(mode) {
    var wrap = el("div", "kb-wrap");
    wrap.id = "keyboard";
    var kb = el("div", "kb");
    var whites = el("div", "kb-whites");
    var whiteList = [];
    var midi;
    for (midi = KB_LO; midi <= KB_HI; midi++) {
      if (isWhite(midi)) whiteList.push(midi);
    }
    var whiteIndex = {};
    whiteList.forEach(function (note, index) { whiteIndex[note] = index; });

    var degreeByPc = {};
    mode.scale.forEach(function (note, index) {
      degreeByPc[pcOf(note.midi)] = { index: index, deg: note.deg, midi: note.midi, color: note.color };
    });
    var chordPcs = {};
    if (focus != null) {
      window.ChordVoice.notes(mode.chords[focus][2]).forEach(function (note) {
        chordPcs[pcOf(note)] = true;
      });
    }

    function mark(note) {
      var info = degreeByPc[pcOf(note)];
      if (!info) return "";
      if (focus == null) return info.color ? "is-degree" : "is-scale";
      if (info.index === focus) return "is-degree";
      if (chordPcs[pcOf(note)]) return "is-chord";
      return "";
    }
    function label(note) {
      var info = degreeByPc[pcOf(note)];
      if (!info) return "";
      if (focus == null) return info.deg;
      if (info.index === focus) return info.deg;
      return "";
    }
    function onKey(note) {
      var info = degreeByPc[pcOf(note)];
      if (!info) return;
      selectDegree(info.index);
    }

    whiteList.forEach(function (note) {
      var key = el("button", "kb-white " + mark(note));
      key.type = "button";
      key.setAttribute("data-midi", String(note));
      var text = label(note);
      if (text) key.appendChild(el("span", "deg", text));
      key.addEventListener("click", function () { onKey(note); });
      whites.appendChild(key);
    });
    kb.appendChild(whites);

    for (midi = KB_LO; midi <= KB_HI; midi++) {
      if (isWhite(midi)) continue;
      var prev = whiteIndex[midi - 1];
      if (prev == null) continue;
      var key = el("button", "kb-black " + mark(midi));
      key.type = "button";
      key.setAttribute("data-midi", String(midi));
      key.style.left = (prev * 45 + 29) + "px";
      var text = label(midi);
      if (text) key.appendChild(el("span", "deg", text));
      key.addEventListener("click", function (event) {
        onKey(Number(event.currentTarget.getAttribute("data-midi")));
      });
      kb.appendChild(key);
    }
    wrap.appendChild(kb);
    return wrap;
  }

  function renderPanel(mode) {
    var panel = document.getElementById("panel");
    panel.innerHTML = "";
    panel.appendChild(el("p", "family " + mode.family, mode.familyLabel));
    var title = el("h2", null, mode.name);
    title.style.margin = "8px 0 4px";
    panel.appendChild(title);
    panel.appendChild(el("p", "section-lead quiet", mode.en));
    panel.appendChild(el("p", "section-lead", mode.lead));
    panel.appendChild(el("p", "section-lead", mode.compare));

    var scaleHeading = el("h3", null, "音阶");
    scaleHeading.style.margin = "18px 0 6px";
    panel.appendChild(scaleHeading);
    panel.appendChild(el("p", "section-lead", mode.colorLabel));
    var tones = el("ol", "tones");
    mode.scale.forEach(function (item, index) {
      var li = el("li", item.color ? "is-color" : "");
      li.appendChild(el("b", null, item.name));
      li.appendChild(el("span", null, item.deg));
      li.style.cursor = "pointer";
      li.addEventListener("click", function () { selectDegree(index); });
      tones.appendChild(li);
    });
    panel.appendChild(tones);

    var keyHeading = el("h3", null, "键盘");
    keyHeading.style.margin = "18px 0 6px";
    panel.appendChild(keyHeading);
    var degRow = el("div", "frame-tabs deg-row");
    degRow.setAttribute("role", "group");
    degRow.setAttribute("aria-label", "看哪一级");
    var all = el("button", focus == null ? "is-on" : "", "1–7");
    all.type = "button";
    all.addEventListener("click", function () { focus = null; render(); });
    degRow.appendChild(all);
    mode.scale.forEach(function (item, index) {
      var button = el("button", focus === index ? "is-on" : "", item.deg);
      button.type = "button";
      button.addEventListener("click", function () { selectDegree(index); });
      degRow.appendChild(button);
    });
    panel.appendChild(degRow);
    if (focus == null) {
      panel.appendChild(el("p", "section-lead", "键上的字是 1 到 7。深色是特征音。点某一级，只留下这个音和这一级的和弦。"));
    } else {
      var scaleTone = mode.scale[focus];
      var seventh = mode.chords[focus][2];
      var names = chordNames(seventh, mode);
      panel.appendChild(el("p", "section-lead", scaleTone.deg + " 音是 " + scaleTone.name + "，键上是深色。" + mode.chords[focus][0] + " 的七和弦是 " + seventh + "，含 " + names.join("、") + "。其余和弦音是浅色。"));
    }
    panel.appendChild(renderKeyboard(mode));

    var chordHeading = el("h3", null, "调内和弦");
    chordHeading.style.margin = "18px 0 6px";
    panel.appendChild(chordHeading);
    panel.appendChild(el("p", "section-lead quiet", "左边是三和弦，右边是七和弦。点级数时，键盘亮的是右边这颗七和弦。"));
    var grid = el("div", "chord-grid");
    mode.chords.forEach(function (row, index) {
      var card = document.createElement("div");
      if (focus === index) card.style.boxShadow = "inset 0 0 0 2px #9c4a28";
      card.appendChild(el("b", null, row[0]));
      card.appendChild(el("span", null, row[1] + " · " + row[2]));
      card.style.cursor = "pointer";
      card.addEventListener("click", function () { selectDegree(index); });
      grid.appendChild(card);
    });
    panel.appendChild(grid);

    var melHeading = el("h3", null, "特征旋律");
    melHeading.style.margin = "18px 0 6px";
    panel.appendChild(melHeading);
    panel.appendChild(el("p", "section-lead", mode.melodyNote));
    var melRow = el("div", "loop-row");
    mode.melody.forEach(function (note) {
      var cell = el("div", "cell" + (note.color ? " mark" : ""));
      cell.appendChild(el("b", null, note.name));
      melRow.appendChild(cell);
    });
    panel.appendChild(melRow);

    var progHeading = el("h3", null, "特征进行");
    progHeading.style.margin = "18px 0 6px";
    panel.appendChild(progHeading);
    panel.appendChild(el("p", "section-lead", mode.progressionNote));
    var progRow = el("div", "loop-row");
    mode.chordsPlay.forEach(function (symbol) {
      var cell = el("div", "cell");
      cell.appendChild(el("b", null, symbol));
      progRow.appendChild(cell);
    });
    panel.appendChild(progRow);

    var transport = el("div", "transport");
    transport.style.marginTop = "12px";
    var hearMel = el("button", "text-btn primary", "听旋律");
    hearMel.type = "button";
    hearMel.addEventListener("click", function () {
      playLine(mode.melody, "在播旋律，两遍，大约 90 拍。标出来的是特征音。");
    });
    var hearChords = el("button", "text-btn", "听进行");
    hearChords.type = "button";
    hearChords.addEventListener("click", function () {
      playChords(mode.chordsPlay);
    });
    transport.appendChild(hearMel);
    transport.appendChild(hearChords);
    if (mode.extra) {
      var extra = el("button", "text-btn", mode.extra.label);
      extra.type = "button";
      extra.addEventListener("click", function () {
        if (mode.extra.melody) playLine(mode.extra.melody, mode.extra.status);
        else playChords(mode.extra.chords, mode.extra.status);
      });
      transport.appendChild(extra);
    }
    panel.appendChild(transport);

    var taskHeading = el("h3", null, "今天写");
    taskHeading.style.margin = "18px 0 6px";
    panel.appendChild(taskHeading);
    var task = el("article", "song pop");
    task.appendChild(el("p", "beat", mode.task));
    panel.appendChild(task);

    var parentHeading = el("h3", null, "第二眼");
    parentHeading.style.margin = "18px 0 6px";
    panel.appendChild(parentHeading);
    panel.appendChild(el("p", "section-lead quiet", mode.parent));

    if (mode.songs) {
      var songHeading = el("h3", null, "可以去听");
      songHeading.style.margin = "18px 0 6px";
      panel.appendChild(songHeading);
      panel.appendChild(el("p", "section-lead quiet", "只标大家说法一致的地方。"));
      mode.songs.forEach(function (song) {
        var card = el("article", "song " + song.klass);
        card.appendChild(el("h3", null, song.title));
        card.appendChild(el("p", "meta", song.meta));
        card.appendChild(el("p", null, song.text));
        card.appendChild(el("p", "source", song.source));
        panel.appendChild(card);
      });
    }
  }

  function render() {
    renderTabs();
    renderPanel(modeNow());
  }

  render();
})();
