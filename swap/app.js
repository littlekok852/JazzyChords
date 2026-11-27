(function () {
  function chord(play, label, hint) {
    return { play: play, label: label || play, hint: hint || "" };
  }

  var DEGREES = {
    I: {
      roman: "I", base: "C",
      pop: [chord("C"), chord("Cadd9"), chord("C6"), chord("C6/9"), chord("Cmaj7"), chord("Cmaj9"), chord("C/E", "C/E", "转位")],
      jazz: [],
      func: [],
      before: []
    },
    vi: {
      roman: "vi", base: "Am",
      pop: [chord("Am"), chord("Am7"), chord("Am9"), chord("Am/G", "Am/G", "低音经过，不是新功能")],
      jazz: [],
      func: [],
      before: [chord("E7", "E7", "V/vi")]
    },
    IV: {
      roman: "IV", base: "F",
      pop: [chord("F"), chord("Fadd9"), chord("Fmaj7"), chord("Fmaj9"), chord("F6"), chord("F/A", "F/A", "转位")],
      jazz: [],
      func: [chord("Fm", "Fm", "iv · 借来的暗 IV"), chord("Ab", "Ab", "降Ⅵ代Ⅳ")],
      before: [chord("C7", "C7", "V/IV")]
    },
    V: {
      roman: "V", base: "G",
      pop: [chord("G"), chord("Gsus4", "Gsus4", "通常再落到 G"), chord("G7"), chord("G9"), chord("G/B", "G/B", "转位")],
      jazz: [chord("G13"), chord("G7alt", "G7alt", "更紧的 V，级数没变")],
      func: [chord("Db7", "Db7", "降Ⅱ代Ⅴ"), chord("Db9", "Db9", "降Ⅱ代Ⅴ"), chord("Db7#11", "Db7#11", "降Ⅱ代Ⅴ"), chord("Bb", "Bb", "降Ⅶ代Ⅴ")],
      before: [chord("D7", "D7", "V/V")]
    },
    iii: {
      roman: "iii", base: "Em",
      pop: [chord("Em"), chord("Em7"), chord("Em9")],
      jazz: [],
      func: [],
      before: []
    },
    ii: {
      roman: "ii", base: "Dm",
      pop: [chord("Dm"), chord("Dm7"), chord("Dm9")],
      jazz: [],
      func: [],
      before: [chord("A7", "A7", "V/ii"), chord("C#dim7", "C#°7", "夹在 C 和 Dm 之间")]
    },
    i: {
      roman: "i", base: "Am",
      pop: [chord("Am"), chord("Am7"), chord("Am9")],
      jazz: [], func: [], before: []
    },
    ivm: {
      roman: "iv", base: "Dm",
      pop: [chord("Dm"), chord("Dm7"), chord("Dm9")],
      jazz: [], func: [], before: [chord("A7", "A7", "V/iv")]
    },
    VI: {
      roman: "VI", base: "F",
      pop: [chord("F"), chord("Fadd9"), chord("Fmaj7")],
      jazz: [],
      func: [chord("Fm", "Fm", "同主音的小下属")],
      before: []
    },
    III: {
      roman: "III", base: "C",
      pop: [chord("C"), chord("Cadd9"), chord("Cmaj7")],
      jazz: [], func: [], before: []
    },
    VAm: {
      roman: "V", base: "E",
      pop: [chord("E"), chord("E7")],
      jazz: [chord("E7b9", "E7b9", "更紧的属七")],
      func: [],
      before: []
    }
  };

  var FRAMES = [
    {
      id: "p1645",
      name: "1645",
      roman: "I–vi–IV–V",
      note: "C、Am、F、G。V 那一格里，G、Gsus4、G7、G13 还是同一级。Db7 写着「降Ⅱ代Ⅴ」，用来换掉 G。",
      slots: ["I", "vi", "IV", "V"]
    },
    {
      id: "canon",
      name: "卡农",
      roman: "I–V–vi–iii–IV–I–IV–V",
      note: "八格：C、G、Am、Em、F、C、F、G。下面可以改成第七格用 Dm 的常见变体。",
      slots: ["I", "V", "vi", "iii", "IV", "I", "IV", "V"],
      variant: "第七格改成 ii（I–V–vi–iii–IV–I–ii–V）"
    },
    {
      id: "p453",
      name: "4536251",
      roman: "IV–V–iii–vi–ii–V–I",
      note: "F、G、Em、Am、Dm、G、C。两个 V 可以各换各的。",
      slots: ["IV", "V", "iii", "vi", "ii", "V", "I"]
    },
    {
      id: "amin",
      name: "a 小调",
      roman: "i–VI–III–V",
      note: "短对照：Am、F、C、E。也可以改成 Am、Dm、E。",
      slots: ["i", "VI", "III", "VAm"],
      variant: "改成 i–iv–V（Am、Dm、E）"
    }
  ];

  var state = { frame: 0, canonIi: false, aminCadence: false, pick: {}, before: {} };

  function keyOf(frameId, index) { return frameId + ":" + index; }

  function currentFrame() { return FRAMES[state.frame]; }

  function degreesFor(frame) {
    var slots = frame.slots.slice();
    if (frame.id === "canon" && state.canonIi) slots[6] = "ii";
    if (frame.id === "amin" && state.aminCadence) slots = ["i", "ivm", "VAm"];
    return slots.map(function (id) { return DEGREES[id]; });
  }

  function sequence(frame) {
    var degs = degreesFor(frame);
    var out = [];
    degs.forEach(function (deg, index) {
      var id = keyOf(frame.id, index);
      var ahead = state.before[id];
      if (ahead) out.push(ahead);
      out.push(state.pick[id] || deg.base);
    });
    return out;
  }

  function playNow() {
    window.LoopPlay.play(sequence(currentFrame()), document.getElementById("loopStatus"));
  }

  function chipButton(item, kind, index, selected) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "chip " + kind + (selected ? " is-on" : "");
    var strong = document.createElement("b");
    strong.textContent = item.label;
    button.appendChild(strong);
    if (item.hint) {
      var note = document.createElement("span");
      note.textContent = item.hint;
      button.appendChild(note);
    }
    button.addEventListener("click", function () {
      var id = keyOf(currentFrame().id, index);
      if (kind === "before") {
        state.before[id] = state.before[id] === item.play ? "" : item.play;
      } else {
        state.pick[id] = item.play;
      }
      render();
      playNow();
    });
    return button;
  }

  function group(title, kind, items, index, selectedPlay) {
    if (!items.length) return null;
    var wrap = document.createElement("div");
    var label = document.createElement("p");
    label.className = "group-label " + kind;
    label.textContent = title;
    var row = document.createElement("div");
    row.className = "chip-row";
    items.forEach(function (item) {
      row.appendChild(chipButton(item, kind, index, item.play === selectedPlay));
    });
    wrap.appendChild(label);
    wrap.appendChild(row);
    return wrap;
  }

  function renderBoard() {
    var frame = currentFrame();
    var board = document.getElementById("board");
    board.innerHTML = "";
    degreesFor(frame).forEach(function (deg, index) {
      var id = keyOf(frame.id, index);
      var chosen = state.pick[id] || deg.base;
      var ahead = state.before[id] || "";
      var article = document.createElement("article");
      article.className = "slot" + ((chosen !== deg.base || ahead) ? " is-changed" : "");
      var roman = document.createElement("p");
      roman.className = "roman";
      roman.textContent = deg.roman + " · 原三和弦 " + deg.base;
      var now = document.createElement("p");
      now.className = "now";
      now.textContent = (ahead ? ahead + " → " : "") + chosen;
      if (chosen !== deg.base || ahead) {
        var small = document.createElement("small");
        small.textContent = "这一格改过";
        now.appendChild(small);
      }
      article.appendChild(roman);
      article.appendChild(now);
      [
        group("同级换色彩", "pop", deg.pop, index, chosen),
        group("更冲的爵士张力", "jazz", deg.jazz, index, chosen),
        group("功能替代", "func", deg.func, index, chosen),
        group("加在到达之前", "before", deg.before, index, ahead)
      ].forEach(function (node) { if (node) article.appendChild(node); });
      if (chosen !== deg.base || ahead) {
        var back = document.createElement("button");
        back.type = "button";
        back.className = "text-btn";
        back.textContent = "这一格回到 " + deg.base;
        back.style.marginTop = "10px";
        back.addEventListener("click", function () {
          delete state.pick[id];
          delete state.before[id];
          render();
          playNow();
        });
        article.appendChild(back);
      }
      board.appendChild(article);
    });
  }

  function renderFrames() {
    var row = document.getElementById("frames");
    row.innerHTML = "";
    FRAMES.forEach(function (frame, index) {
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = frame.name;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", index === state.frame ? "true" : "false");
      if (index === state.frame) button.className = "is-on";
      button.addEventListener("click", function () {
        state.frame = index;
        render();
      });
      row.appendChild(button);
    });
  }

  function renderVariant() {
    var frame = currentFrame();
    var row = document.getElementById("variantRow");
    row.innerHTML = "";
    var roman = frame.roman;
    if (frame.id === "canon" && state.canonIi) roman = "I–V–vi–iii–IV–I–ii–V";
    if (frame.id === "amin" && state.aminCadence) roman = "i–iv–V";
    document.getElementById("frameNote").textContent = frame.note + " 进行：" + roman + "。";
    if (!frame.variant) return;
    var on = frame.id === "canon" ? state.canonIi : state.aminCadence;
    var button = document.createElement("button");
    button.type = "button";
    button.className = "text-btn" + (on ? " primary" : "");
    button.textContent = (on ? "正在用变体 · " : "改用变体 · ") + frame.variant;
    button.addEventListener("click", function () {
      if (frame.id === "canon") state.canonIi = !state.canonIi;
      else state.aminCadence = !state.aminCadence;
      Object.keys(state.pick).forEach(function (key) {
        if (key.indexOf(frame.id + ":") === 0) delete state.pick[key];
      });
      Object.keys(state.before).forEach(function (key) {
        if (key.indexOf(frame.id + ":") === 0) delete state.before[key];
      });
      render();
    });
    row.appendChild(button);
  }

  function render() {
    renderFrames();
    renderVariant();
    renderBoard();
  }

  document.getElementById("hear").addEventListener("click", playNow);
  document.getElementById("reset").addEventListener("click", function () {
    var prefix = currentFrame().id + ":";
    Object.keys(state.pick).forEach(function (key) {
      if (key.indexOf(prefix) === 0) delete state.pick[key];
    });
    Object.keys(state.before).forEach(function (key) {
      if (key.indexOf(prefix) === 0) delete state.before[key];
    });
    render();
    playNow();
  });

  render();
})();
