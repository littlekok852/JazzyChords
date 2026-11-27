(function () {
  function step(name, midi, color) {
    return { name: name, midi: midi, beats: 1, color: !!color };
  }

  var MODES = [
    {
      id: "ionian",
      name: "伊奥尼亚",
      en: "Ionian",
      family: "major",
      familyLabel: "大调色彩",
      lead: "伊奥尼亚就是自然大调。没有降音，也没有升音。",
      compare: "和另外两个大调色彩比：四级是 F，不是 F#。七级是 B，会落到 C。混合利底亚把这个 B 降成 Bb。利底亚把这个 F 升成 F#。",
      scale: [
        ["C", "1"], ["D", "2"], ["E", "3"], ["F", "4", true], ["G", "5"], ["A", "6"], ["B", "7", true]
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
      progressionNote: "I、IV、V、I。这是你已经在用的家。",
      task: "今天写 4 小节，主音 C。和弦用 C、F、G，可以回到 C。旋律里要有 F，还要有 B 落到 C。不要用 F#。不要写成整首歌。",
      parent: "从 C 开始，只弹白键，弹回 C，就是它。"
    },
    {
      id: "dorian",
      name: "多利亚",
      en: "Dorian",
      family: "minor",
      familyLabel: "小调色彩",
      lead: "多利亚是自然小调，只把六级升高。",
      compare: "C 自然小调是 C D Eb F G Ab Bb。六级 Ab 换成 A，就是 C 多利亚。A 是大六度。和 C 大调比：三级降成 Eb，七级降成 Bb。",
      scale: [
        ["C", "1"], ["D", "2"], ["Eb", "b3"], ["F", "4"], ["G", "5"], ["A", "6", true], ["Bb", "b7"]
      ],
      colorLabel: "特征音是大六度 A。",
      chords: [
        ["i", "Cm", "Cm7"],
        ["ii", "Dm", "Dm7"],
        ["bIII", "Eb", "Ebmaj7"],
        ["IV", "F", "F7"],
        ["v", "Gm", "Gm7"],
        ["vi°", "Adim", "Am7b5"],
        ["bVII", "Bb", "Bbmaj7"]
      ],
      melody: [step("C", 60), step("Eb", 63), step("G", 67), step("A", 69, true), step("G", 67), step("F", 65), step("Eb", 63), step("C", 60)],
      melodyNote: "标出来的 A 是升高的六级。自然小调这里会是 Ab。",
      chordsPlay: ["Cm7", "F7", "Cm7", "F7"],
      progressionNote: "i 到 IV。F7 里的 A，就是那个大六度。",
      task: "今天写 4 小节。和弦只在 Cm 和 F 之间换，可以用 Cm7 和 F7。旋律里至少用两次 A。不要把 A 写成 Ab。",
      parent: "从 D 开始只弹白键，是 D 多利亚。这一页主音仍放在 C，好和别的调式比。",
      extra: {
        label: "同一条旋律，六级改低",
        melody: [step("C", 60), step("Eb", 63), step("G", 67), step("Ab", 68, true), step("G", 67), step("F", 65), step("Eb", 63), step("C", 60)],
        status: "这是自然小调的六级 Ab。和刚才的 A 比一比。"
      },
      songs: [
        {
          klass: "pop",
          title: "Oye Como Va",
          meta: "Santana · 原调 A",
          text: "两格是 Am7 和 D7，谱上有时把第二格写成 D9。F# 是 A 的大六度，所以这一圈是 A 多利亚的 i 到 IV。Ethan Hein 把整首放在 A 多利亚。也有人说它是 G 大调的 ii 到 V，一直不回到 G。和弦没有争论，家放在 A 还是 G，看你自己。",
          source: "依据：Ethan Hein；Jon MacLennan 的和弦课。两处都是 Am7 和 D（D7 或 D9）。"
        },
        {
          klass: "jazz",
          title: "So What",
          meta: "Miles Davis · Kind of Blue · 原调 D",
          text: "主段长时间停在 Dm7，是 D 多利亚。桥段升半音，停在 Ebm7，那是 Eb 多利亚。不是 i 到 IV 的两格。小七那一课说过：谱上写的是 m7，不是小九。",
          source: "依据：Jazz Language Workbooks；Bruno Jazz 对曲式的说明。主段 Dm7、桥段 Ebm7，几份说明一致。"
        }
      ]
    },
    {
      id: "phrygian",
      name: "弗里几亚",
      en: "Phrygian",
      family: "minor",
      familyLabel: "小调色彩",
      lead: "弗里几亚是自然小调，只把二级降低。",
      compare: "C 自然小调的二级是 D。这里把 D 降成 Db。Db 是降二级，紧贴在主音下面。和 C 大调比：二级、三级、六级、七级都是降的。",
      scale: [
        ["C", "1"], ["Db", "b2", true], ["Eb", "b3"], ["F", "4"], ["G", "5"], ["Ab", "b6"], ["Bb", "b7"]
      ],
      colorLabel: "特征音是降二级 Db。",
      chords: [
        ["i", "Cm", "Cm7"],
        ["bII", "Db", "Dbmaj7"],
        ["bIII", "Eb", "Eb7"],
        ["iv", "Fm", "Fm7"],
        ["v°", "Gdim", "Gm7b5"],
        ["bVI", "Ab", "Abmaj7"],
        ["bvii", "Bbm", "Bbm7"]
      ],
      melody: [step("C", 60), step("Db", 61, true), step("Eb", 63), step("C", 60), step("Db", 61, true), step("C", 60), step("Bb", 58), step("C", 60)],
      melodyNote: "Db 紧挨着 C。不要把它听成 D。",
      chordsPlay: ["Cm", "Db", "Cm", "Db"],
      progressionNote: "i 到降 II。Db 大三和弦把降二级放在和弦的根音上。",
      task: "今天写 4 小节。进行里必须有 Cm 接到 Db。旋律里用 Db，不要改回 D。",
      parent: "从 E 开始只弹白键，是 E 弗里几亚。这一页主音仍是 C。"
    },
    {
      id: "lydian",
      name: "利底亚",
      en: "Lydian",
      family: "major",
      familyLabel: "大调色彩",
      lead: "利底亚是自然大调，只把四级升高。",
      compare: "C 大调的四级是 F。这里把 F 升成 F#。F# 是升四级。七级仍是 B，所以它还是大调色彩，不是小调。",
      scale: [
        ["C", "1"], ["D", "2"], ["E", "3"], ["F#", "♯4", true], ["G", "5"], ["A", "6"], ["B", "7"]
      ],
      colorLabel: "特征音是升四级 F#。",
      chords: [
        ["I", "C", "Cmaj7"],
        ["II", "D", "D7"],
        ["iii", "Em", "Em7"],
        ["♯iv°", "F#dim", "F#m7b5"],
        ["V", "G", "Gmaj7"],
        ["vi", "Am", "Am7"],
        ["vii", "Bm", "Bm7"]
      ],
      melody: [step("C", 60), step("D", 62), step("E", 64), step("F#", 66, true), step("G", 67), step("F#", 66, true), step("E", 64), step("C", 60)],
      melodyNote: "F# 比大调的 F 高半音。听到它，就不是普通大调。",
      chordsPlay: ["C", "D", "C", "D"],
      progressionNote: "I 到 II。D 大三和弦里的 F#，就是升四级。",
      task: "今天写 4 小节。和弦用 C 和 D。旋律里用 F#，不要用 F。",
      parent: "从 F 开始只弹白键，是 F 利底亚。这一页主音仍是 C，所以四级要升。"
    },
    {
      id: "mixolydian",
      name: "混合利底亚",
      en: "Mixolydian",
      family: "major",
      familyLabel: "大调色彩",
      lead: "混合利底亚是自然大调，只把七级降低。",
      compare: "C 大调的七级是 B。这里把 B 降成 Bb。Bb 是降七级。三级仍是 E，所以主和弦还是大三和弦。它不像大调那样，用 B 把耳朵拉回 C。",
      scale: [
        ["C", "1"], ["D", "2"], ["E", "3"], ["F", "4"], ["G", "5"], ["A", "6"], ["Bb", "b7", true]
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
      melodyNote: "Bb 停在大七级的下面。不要把它升回 B。",
      chordsPlay: ["C", "Bb", "F", "C"],
      progressionNote: "I、降 VII、IV、I。Bb 大三和弦把降七级放在根音上。",
      task: "今天写 4 小节。和弦用 C 和 Bb，可以加上 F。旋律里用 Bb。不要把 Bb 升高成 B，再解决到 C。",
      parent: "从 G 开始只弹白键，是 G 混合利底亚。这一页主音仍是 C，所以七级要降。",
      songs: [
        {
          klass: "pop",
          title: "Norwegian Wood",
          meta: "The Beatles · 主歌 · 原调 E",
          text: "主歌是 E 混合利底亚。降七级是 D，和弦里听得到 E 和 D。中间段转到小调色彩，不要把整首算成混合利底亚。",
          source: "依据：Paul McCartney Project 转引的调式说明；Hooktheory 把主歌标成 E Mixolydian、中间段标成 E Dorian。主歌的降七级，几处一致。"
        }
      ]
    },
    {
      id: "aeolian",
      name: "爱奥利亚",
      en: "Aeolian",
      family: "minor",
      familyLabel: "小调色彩",
      lead: "爱奥利亚就是自然小调。你已经会 a 自然小调：A B C D E F G。同一套间距，主音换成 C。",
      compare: "C 自然小调是 C D Eb F G Ab Bb。和多利亚比，六级是 Ab，不是 A。和 C 大调比：三级 Eb、六级 Ab、七级 Bb，都是降的。下面的例子仍停在 C，好和这一页的其他调式比。",
      scale: [
        ["C", "1"], ["D", "2"], ["Eb", "b3"], ["F", "4"], ["G", "5"], ["Ab", "b6", true], ["Bb", "b7"]
      ],
      colorLabel: "和多利亚分开的那个音，是降六级 Ab。",
      chords: [
        ["i", "Cm", "Cm7"],
        ["ii°", "Ddim", "Dm7b5"],
        ["bIII", "Eb", "Ebmaj7"],
        ["iv", "Fm", "Fm7"],
        ["v", "Gm", "Gm7"],
        ["bVI", "Ab", "Abmaj7"],
        ["bVII", "Bb", "Bb7"]
      ],
      melody: [step("C", 60), step("Eb", 63), step("G", 67), step("Ab", 68, true), step("G", 67), step("F", 65), step("Eb", 63), step("C", 60)],
      melodyNote: "和多利亚是同一条旋律，只把六级从 A 改成 Ab。",
      chordsPlay: ["Cm", "Ab", "Bb", "Cm"],
      progressionNote: "i、降 VI、降 VII、i。Ab 里的 Ab 就是降六级。",
      task: "今天写 4 小节。和弦用 Cm、Ab、Bb。旋律里用 Ab。写完可以把 Ab 换成多利亚的 A，听哪一个更暗。",
      parent: "从 A 开始只弹白键，就是你已经会的 a 自然小调。",
      extra: {
        label: "同一条旋律，六级升高",
        melody: [step("C", 60), step("Eb", 63), step("G", 67), step("A", 69, true), step("G", 67), step("F", 65), step("Eb", 63), step("C", 60)],
        status: "六级改成 A。这就是多利亚。"
      }
    },
    {
      id: "locrian",
      name: "洛克里亚",
      en: "Locrian",
      family: "minor",
      familyLabel: "小调色彩",
      lead: "洛克里亚很少当一首歌的家。主和弦的五音是降的，站不稳。",
      compare: "和自然小调比：二级再降，D 变成 Db。五级也降，G 变成 Gb。主和弦是 C、Eb、Gb。Gb 是降五级。因为五音不纯，耳朵不想把 C 当成家。",
      scale: [
        ["C", "1"], ["Db", "b2", true], ["Eb", "b3"], ["F", "4"], ["Gb", "b5", true], ["Ab", "b6"], ["Bb", "b7"]
      ],
      colorLabel: "让主音站不稳的是降五级 Gb。降二级 Db 也在。",
      chords: [
        ["i°", "Cdim", "Cm7b5"],
        ["bII", "Db", "Dbmaj7"],
        ["biii", "Ebm", "Ebm7"],
        ["iv", "Fm", "Fm7"],
        ["bV", "Gb", "Gbmaj7"],
        ["bVI", "Ab", "Ab7"],
        ["bvii", "Bbm", "Bbm7"]
      ],
      melody: [step("C", 60), step("Db", 61, true), step("Eb", 63), step("Gb", 66, true), step("F", 65), step("Eb", 63), step("Db", 61), step("C", 60)],
      melodyNote: "Gb 是降五级。它回到 C 的时候，家还是虚的。",
      chordsPlay: ["Cm7b5", "Dbmaj7", "Cm7b5"],
      progressionNote: "减的主和弦走到降 II，再回来。它不是一首歌的副歌循环。回来之后仍然不想停。",
      task: "今天只写 2 到 4 小节。主和弦用 Cdim 或 Cm7b5，旁边用 Db 或 Fm。旋律里用 Gb。听的时候问自己：它想停在 C 吗？然后改成 Cm、Ab、Bb，再听一次。不要写成完整的歌。",
      parent: "从 B 开始只弹白键，是 B 洛克里亚。白键能说明音有哪些，不能让这个主和弦变稳定。",
      extra: {
        label: "改听自然小调",
        chords: ["Cm", "Ab", "Bb", "Cm"],
        status: "这是爱奥利亚：Cm、Ab、Bb、Cm。主和弦是小三，五音是纯的，能停住。"
      }
    }
  ];

  var current = "dorian";
  var engine = null;
  var RENDER_RATE = 44100;

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

  function playLine(notes, text) {
    setStatus(text);
    ensure().then(function (eng) {
      if (!eng) {
        setStatus("这个浏览器没有放开音频。");
        return;
      }
      window.ChordVoice.playMelody(eng, notes, { repeats: 2 });
    }).catch(function () {
      setStatus("再点一次，浏览器才会出声。");
    });
  }

  function playChords(symbols, text) {
    setStatus(text || window.ChordVoice.statusLine(symbols));
    ensure().then(function (eng) {
      if (!eng) {
        setStatus("这个浏览器没有放开音频。");
        return;
      }
      window.ChordVoice.playProgression(eng, symbols);
    }).catch(function () {
      setStatus("再点一次，浏览器才会出声。");
    });
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
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
        render();
      });
      row.appendChild(button);
    });
  }

  function renderPanel(mode) {
    var panel = document.getElementById("panel");
    panel.innerHTML = "";
    var tag = el("p", "family " + mode.family, mode.familyLabel);
    var title = el("h2", null, mode.name);
    title.style.margin = "8px 0 4px";
    var en = el("p", "section-lead quiet", mode.en + " · 主音 C");
    panel.appendChild(tag);
    panel.appendChild(title);
    panel.appendChild(en);
    panel.appendChild(el("p", "section-lead", mode.lead));
    panel.appendChild(el("p", "section-lead", mode.compare));

    var scaleHeading = el("h3", null, "音阶");
    scaleHeading.style.margin = "18px 0 6px";
    panel.appendChild(scaleHeading);
    panel.appendChild(el("p", "section-lead", mode.colorLabel));
    var tones = el("ol", "tones");
    mode.scale.forEach(function (item) {
      var li = el("li", item[2] ? "is-color" : "");
      li.appendChild(el("b", null, item[0]));
      li.appendChild(el("span", null, item[1]));
      tones.appendChild(li);
    });
    panel.appendChild(tones);

    var chordHeading = el("h3", null, "调内和弦");
    chordHeading.style.margin = "18px 0 6px";
    panel.appendChild(chordHeading);
    panel.appendChild(el("p", "section-lead quiet", "左边是三和弦，右边是七和弦。写歌先用三和弦也够。"));
    var grid = el("div", "chord-grid");
    mode.chords.forEach(function (row) {
      var card = document.createElement("div");
      card.appendChild(el("b", null, row[0]));
      card.appendChild(el("span", null, row[1] + " · " + row[2]));
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
      panel.appendChild(el("p", "section-lead quiet", "不是作业。只标大家说法一致的地方。"));
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
    renderPanel(MODES.filter(function (mode) { return mode.id === current; })[0]);
  }

  render();
})();
