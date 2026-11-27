function g(id, group, name, tag, frets, blurb, note, need, extra) {
  return Object.assign({
    id, group, name, tag, frets, blurb, note, need, barre: false,
    fingers: frets.map((fret) => (fret == null ? null : 1))
  }, extra || {});
}

function q(spec) { return spec; }

export const lessons = [];
function add(lesson) { lessons.push(lesson); }

add({
  slug: "maj7", num: "03", nav: "第三课 · 大七 / 大九", title: "大七 / 大九",
  lede: "大七的七音比根音的高八度低半音。在 C 调里它最常放在 IV 和 I：Fmaj7、Cmaj7。粤语歌、国语歌的慢歌里，IV 上的大七往往比 I 上的更好用。默认先听 Fmaj7。大九是同一级再加九音，七音还在。",
  piano: "现在响的是调里的那一级，不是永远把根音放在 C。左手是这颗和弦自己的根音。大七听七音，大九再加九音。点 IV 和 I 来回听。",
  guitar: "每把能响的音都写在圆点上。大九那把高把位没有根音，根音交给贝斯，页面上写明白了。",
  dots: "R 根音，3 三音，5 五音，7 大七，9 九音。",
  bass: "贝斯守根音。大七的导音放低了会和根音顶在一起。",
  daily: "当前调把大三、6、大七、大九各齐奏一次。说出大七那个音的名字。",
  resolve: "大七可以自己停着，也可以当 IV 去到主和弦。它不像属七那样非解决不可。",
  compare: [["maj", "大三", 0], ["6", "6", 0], ["maj7", "大七", 0], ["maj9", "大九", 0]],
  songs: [
    song("pop", "Isn't She Lovely", "Stevie Wonder · 原调 E · 副歌前", [
      ["听", "原调 E。副歌前那句从 Amaj7 起，它是 IV，大七让这句悬着。前奏不是大七，前奏是小七和属九，留到后面的课。"],
      ["仿", "只听这个大七，不把后面的变化属和弦写进来。"]
    ], [
      ["原调 E", "Amaj7 · Amaj7", "Amaj7 Amaj7"],
      ["转到 C，IV 变成 Fmaj7", "Fmaj7 · Fmaj7", "Fmaj7 Fmaj7"]
    ], "依据：Spy Tunes；Jon MacLennan。两处都把这句写成 Amaj7。"),
    song("pop", "Just the Two of Us", "Grover Washington Jr. / Bill Withers · 原调 D♭", [
      ["听", "主歌坐在 Dbmaj7 上，旁边接到 C7 和 Fm7。大七在这里是家。"],
      ["仿", "三格。这是灵魂乐的用法。"]
    ], [
      ["原调 D♭", "D♭maj7 · C7 · Fm7", "Dbmaj7 C7 Fm7"],
      ["转到 C", "Cmaj7 · B7 · Em7", "Cmaj7 B7 Em7"]
    ], "依据：Spy Tunes；Tab4U；E-chords。开头的 Dbmaj7 三份谱一致。")
  ],
  useTitle: "把 6 换成大七",
  useText: "上一课的落点如果太稳，把 C6 换成 Cmaj7，或再加九音变成 Cmaj9。C 调的导音是 B，九音是 D。",
  useChanges: [
    ["6 的落点", "C · C6", "C C6"],
    ["换成大七", "C · Cmaj7", "C Cmaj7"],
    ["再加大九", "C · Cmaj9", "C Cmaj9"]
  ],
  qualities: [
    q({
      id: "IVmaj7", label: "IV 大七", suffix: "maj7", root: 5,
      intervals: [0, 4, 7, 11], labels: ["根音", "三音", "五音", "大七"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 7: "5", 11: "7" },
      summary: "在 {key} 调里这是 IV。根音 {root}，大七是 {11}。慢歌里这一级往往比 I 上的大七更常用。",
      highNote: "A 弦根音。C 调里是 Fmaj7。",
      piano: [0, 11, 16], bass: [0, 7],
      compares: [["maj7", "IV 大七", 5], ["maj7", "I 大七", 0], ["maj9", "IV 大九", 5], ["6", "I 的 6", 0]],
      shapes: [
        g("a", "low", "A 弦根音", "IV", [null, 8, 10, 9, 10, 8], "食指按 A 弦和高音 e 的根音。无名指按 D 弦，中指按 G 弦，小指按 B 弦。G 弦是大七。", "根音、三音、五音、大七都在。C 调里根音是 F。", ["R", "3", "5", "7"], { barre: true }),
        g("d", "high", "D 弦根音", "四音", [null, null, 15, 14, 13, 12], "和小把位同一类：高音 e 是大七。把位偏高，转调后会降下来。", "四音都在。", ["R", "3", "5", "7"])
      ]
    }),
    q({
      id: "IVmaj9", label: "IV 大九", suffix: "maj9", root: 5,
      intervals: [0, 4, 7, 11, 2], labels: ["根音", "三音", "五音", "大七", "九音"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 7: "5", 11: "7", 2: "9" },
      summary: "还是 IV。大七是 {11}，九音是 {2}。七音还在。",
      highNote: "五个音都在这一把。",
      piano: [0, 11, 14, 16], bass: [0, 7],
      compares: [["maj9", "IV 大九", 5], ["maj7", "IV 大七", 5], ["add9", "IV 的 add9", 5]],
      shapes: [
        g("a", "low", "A 弦根音", "五音都在", [null, 8, 7, 9, 8, 8], "中指按 A 弦根音。食指按 D 弦，那是三音。无名指按 G 弦，那是大七。B 弦是九音。", "五个音都响。", ["R", "3", "5", "7", "9"])
      ]
    }),
    q({
      id: "maj7", label: "I 大七", suffix: "maj7", root: 0,
      intervals: [0, 4, 7, 11], labels: ["根音", "三音", "五音", "大七"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 7: "5", 11: "7" },
      summary: "在 {key} 调里，大七是 {11}。它比根音的高八度低半音。",
      highNote: "高把位是四音紧凑形。低把位是 A 弦根音。两把都有大七。",
      piano: [0, 11, 16], bass: [0, 7],
      shapes: [
        g("a", "low", "A 弦根音", "五品内", [null, 3, 5, 4, 5, 3], "食指按 A 弦和高音 e。无名指按 D 弦，中指按 G 弦，小指按 B 弦。G 弦上是大七。", "根音、三音、五音、大七都在。", ["R", "3", "5", "7"]),
        g("d", "high", "D 弦根音", "四音", [null, null, 10, 9, 8, 7], "小指按 D 弦，无名指按 G 弦，中指按 B 弦，食指按高音 e。高音 e 是大七。低音两根闷住。", "四音都在，没有九音。", ["R", "3", "5", "7"])
      ]
    }),
    q({
      id: "maj9", label: "I 大九", suffix: "maj9", root: 0,
      intervals: [0, 4, 7, 11, 2], labels: ["根音", "三音", "五音", "大七", "九音"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 7: "5", 11: "7", 2: "9" },
      summary: "在 {key} 调里，大七是 {11}，九音是 {2}。七音还在，所以不是 add9。",
      highNote: "高把位没有根音。低把位五个音都在。",
      piano: [0, 11, 14, 16], bass: [0, 7],
      shapes: [
        g("a", "low", "A 弦根音", "五音都在", [null, 3, 2, 4, 3, 3], "中指按 A 弦。食指按 D 弦，那是三音。小指按 G 弦，那是大七。无名指按 B 和高音 e，B 弦是九音。", "五个音都响。", ["R", "3", "5", "7", "9"]),
        g("h", "high", "五音在低音", "没有根音", [null, 10, 9, 9, 8, 10], "无名指按 A 弦，中指按住 D 和 G，食指按 B 弦，小指按高音 e。低音 E 闷住。", "没有根音。五音、三音、大七、九音都在。", ["3", "5", "7", "9"], { allowNoRoot: true })
      ]
    })
  ]
});

add({
  slug: "min7", num: "04", nav: "第四课 · 小七 / 小九", title: "小七 / 小九",
  lede: "在 C 大调里，小七不放在 C 上。默认是 ii 的 Dm7，然后是 vi 的 Am7，再是 iii 的 Em7。a 小调里先用 Am7 当主和弦。Cm7 只是借来的小主和弦，放在最后，不是默认。",
  piano: "左手是这一级自己的根音：D、A 或 E，不是 C。右手听降三和降七。小九只在同一级上加九音。",
  guitar: "圆点上的 R 是这一级的根音。Dm7 的 R 是 D，Am7 的 R 是 A。不要把它们读成 C 和弦。",
  dots: "R、b3、5、b7、9。b3 比大三低半音，b7 比大七低半音。",
  bass: "贝斯守根音或五音。降七先留在上面。",
  daily: "在 C 调把 Dm7、Am7、Em7 各弹一次，再说它们要去哪。最后才点「借来的 i」。",
  resolve: "Dm7 去 G。Am7 可以停着，也可以去 Dm 或 F。Em7 常去 Am。Cm7 是借来的，解决回 C 或接到 Fm。",
  compare: [["m7", "ii", 2], ["m7", "vi", 9], ["m7", "iii", 4], ["m7", "借来的 i", 0]],
  songs: [
    song("pop", "Just the Two of Us 里的小七", "同一首歌的旁边", [
      ["听", "上一课的 Dbmaj7 旁边就是 Fm7，还有 Ebm7。谱上写的是小七，不是小九，这里不升级。"],
      ["仿", "四格里有两个小七。"]
    ], [
      ["原调 D♭", "D♭maj7 · C7 · Fm7 · E♭m7", "Dbmaj7 C7 Fm7 Ebm7"],
      ["转到 C", "Cmaj7 · B7 · Em7 · Dm7", "Cmaj7 B7 Em7 Dm7"]
    ], "依据：Spy Tunes；Tab4U。"),
    song("jazz", "So What", "Miles Davis · 调式 · 不是 ii–V", [
      ["听", "前十六小节几乎都停在 Dm7。这是调式的小七，当主和弦用。谱上写 Dm7。钢琴那一叠四度里听得见九音，和弦名字仍是小七，这里不改写成小九。"],
      ["仿", "两格同一个和弦。"]
    ], [
      ["原调的前半段", "Dm7 · Dm7", "Dm7 Dm7"],
      ["主和弦挪到 C", "Cm7 · Cm7", "Cm7 Cm7"]
    ], "和上面的灵魂乐分开。这不是小调里的 ii。")
  ],
  useTitle: "只加一个九音",
  useText: "我没有核对到一首流行歌把小九写成主钩子。在你自己的 ii 上试：Dm7 换成 Dm9。D 小七的九音是 E。",
  useChanges: [
    ["原来的 ii", "Dm7 · G7 · C", "Dm7 G7 C"],
    ["ii 改成小九", "Dm9 · G7 · C", "Dm9 G7 C"]
  ],
  qualities: [
    q({
      id: "ii", label: "ii", suffix: "m7", root: 2,
      compares: [["m7", "ii", 2], ["m9", "ii 的九", 2], ["7", "去 G", 7]],
      intervals: [0, 3, 7, 10], labels: ["根音", "降三", "五音", "降七"], colorFrom: 1,
      degrees: { 0: "R", 3: "b3", 7: "5", 10: "b7" },
      summary: "在 {key} 调里这是 ii，根音 {root}。通常去 G 或 G7。降三是 {3}，降七是 {10}。",
      highNote: "A 弦根音。C 调里是 Dm7，不是 Cm7。",
      piano: [0, 3, 10, 15], bass: [0, 7],
      shapes: [
        g("a", "low", "A 弦根音", "ii", [null, 5, 7, 5, 6, 5], "食指横按。小指按 B 弦，那是降三。G 弦是降七。", "四个音都在。C 调根音是 D。", ["R", "b3", "5", "b7"], { barre: true }),
        g("e", "high", "低音 E 根音", "ii", [10, 12, 12, 10, 13, 10], "食指横按。无名指按 A 和 D，小指按 B 弦。B 弦是降七。", "六个音都是这颗小七里的音。", ["R", "b3", "5", "b7"], { barre: true })
      ]
    }),
    q({
      id: "ii9", label: "ii9", suffix: "m9", root: 2,
      compares: [["m9", "ii9", 2], ["m7", "ii", 2]],
      intervals: [0, 3, 7, 10, 2], labels: ["根音", "降三", "五音", "降七", "九音"], colorFrom: 1,
      degrees: { 0: "R", 3: "b3", 7: "5", 10: "b7", 2: "9" },
      summary: "还是 ii。九音是 {2}，大九，降三和降七都还在。",
      highNote: "紧凑的五音形。",
      piano: [0, 3, 10, 14], bass: [0, 7],
      shapes: [
        g("a", "low", "A 弦根音", "小九", [null, 5, 3, 5, 5, 5], "食指按 D 弦，那是降三。其余在高两品。B 弦是九音。", "五个音都在。", ["R", "b3", "5", "b7", "9"])
      ]
    }),
    q({
      id: "vi", label: "vi", suffix: "m7", root: 9,
      compares: [["m7", "vi", 9], ["7", "a 小调的属七", 4]],
      intervals: [0, 3, 7, 10], labels: ["根音", "降三", "五音", "降七"], colorFrom: 1,
      degrees: { 0: "R", 3: "b3", 7: "5", 10: "b7" },
      summary: "在 {key} 大调里这是 vi。a 小调里它就是主和弦 Am7。降三 {3}，降七 {10}。",
      highNote: "低音 E 根音。C 调里是 Am7。",
      piano: [0, 3, 10, 15], bass: [0, 7],
      shapes: [
        g("e", "low", "低音 E 根音", "vi", [5, 7, 7, 5, 8, 5], "食指横按。无名指按 A 和 D，小指按 B 弦。B 弦是降七，G 弦是降三。", "四个音都在。", ["R", "b3", "5", "b7"], { barre: true }),
        g("a", "high", "A 弦根音", "vi", [null, 12, 14, 12, 13, 12], "同一类小七，根音在 A 弦第十二品。", "四个音都在。", ["R", "b3", "5", "b7"], { barre: true })
      ]
    }),
    q({
      id: "iii", label: "iii", suffix: "m7", root: 4,
      compares: [["m7", "iii", 4], ["m7", "vi", 9]],
      intervals: [0, 3, 7, 10], labels: ["根音", "降三", "五音", "降七"], colorFrom: 1,
      degrees: { 0: "R", 3: "b3", 7: "5", 10: "b7" },
      summary: "在 {key} 调里这是 iii，根音 {root}。常去 Am。",
      highNote: "A 弦根音。C 调里是 Em7。",
      piano: [0, 3, 10, 15], bass: [0, 7],
      shapes: [
        g("a", "low", "A 弦根音", "iii", [null, 7, 9, 7, 8, 7], "食指横按。小指按 B 弦，那是降三。G 弦是降七。", "四个音都在。", ["R", "b3", "5", "b7"], { barre: true })
      ]
    }),
    q({
      id: "i", label: "借来的 i", suffix: "m7", root: 0,
      compares: [["m7", "借来的 i", 0], ["m", "小主和弦", 0]],
      intervals: [0, 3, 7, 10], labels: ["根音", "降三", "五音", "降七"], colorFrom: 1,
      degrees: { 0: "R", 3: "b3", 7: "5", 10: "b7" },
      summary: "这不是 C 大调里的默认小七。它是向同主音小调借的 i，根音才是 {root}。",
      highNote: "只有明确要小调主和弦时才用。前面的 ii、vi、iii 才是大调里的位置。",
      piano: [0, 3, 10, 15], bass: [0, 7],
      shapes: [
        g("a", "low", "A 弦根音", "借来的", [null, 3, 5, 3, 4, 3], "食指横按。B 弦是降三，G 弦是降七。", "四个音都在。这是 Cm7，不是默认。", ["R", "b3", "5", "b7"], { barre: true }),
        g("e", "high", "低音 E 根音", "借来的", [8, 10, 10, 8, 11, 8], "食指横按。小指按 B 弦，那是降七。", "六个音都是这颗小七里的音。", ["R", "b3", "5", "b7"], { barre: true })
      ]
    })
  ]
});

add({
  slug: "sus", num: "05", nav: "第五课 · 挂留和附加", title: "挂留 / 附加",
  lede: "在 C 调里，挂留最有用的是 V：Gsus4 再落到 G。四音悬着，三音不在，所以想解决。add9 是另一件事：三音留着再加九音，常用在 I 和 IV，不在这一课的默认钮上。",
  piano: "默认响的是 Gsus4。点「落到 G」听三音回来。sus2 是同一级把四音换成二音。对照钮里的 add9 是 Fadd9，三音还在。",
  guitar: "第一课 A 弦那把 add9（x-3-5-5-3-3）没有三音，响出来就是 sus2。这一课把那把放在 sus2 里。三音还在的 add9 用高把位那两把。空弦的 Cadd9、Dsus4 只作对照。",
  dots: "sus2 是 R、2、5。sus4 是 R、4、5。add9 是 R、3、5、9。2 和 9 同音高：2 表示三音被换掉，9 表示三音还在。",
  bass: "贝斯给根音。挂留的紧张在上面的 2 或 4。",
  daily: "同一个根音，依次弹大三、sus4、sus2、add9。说出三音还在不在。",
  resolve: "sus4 最常回到大三，四音落到三音。sus2 可以回去，也可以就停着。add9 不必解决。",
  compare: [["maj", "大三", 0], ["sus4", "sus4", 0], ["sus2", "sus2", 0], ["add9", "add9", 0]],
  songs: [
    song("pop", "Wonderwall", "Oasis · 常见吉他编配 · 变调夹 2 品", [
      ["听", "主歌循环是 Em7、G、Dsus4、A7sus4，空的是 sus4。副歌前才出现 Cadd9，旁边仍是 Dsus4。挂留和附加在同一首歌里，干的不是一件事。"],
      ["仿", "先四格主歌，再三格副歌前。"]
    ], [
      ["谱面调", "Em7 · G · Dsus4 · A7sus4", "Em7 G Dsus4 A7sus4"],
      ["挪到以 C 为主音的一圈", "Am7 · C · Gsus4 · D7sus4", "Am7 C Gsus4 D7sus4"],
      ["副歌前，谱面调", "Cadd9 · Dsus4 · Em7", "Cadd9 Dsus4 Em7"],
      ["副歌前，挪到 C", "Fadd9 · Gsus4 · Am7", "Fadd9 Gsus4 Am7"]
    ], "依据：Acoustic Binder；Heartwood Guitar；Open Guitar Chords。主歌和弦和副歌前的 Cadd9、Dsus4 三处一致。", "常见吉他编配，不是逐音对过原编。变调夹在第 2 品。G 这里按大三，不把整首说成 add9。"),
    song("pop", "Message in a Bottle", "The Police · 前奏和主歌", [
      ["听", "四格里三格是 sus2：C#sus2、Asus2、Bsus2。最后一格常被说成 sus2，可是里面有降三，应记成 F#madd9。就差这个三音。"],
      ["仿", "四格。最后一格按有三音的小调附加来记。"]
    ], [
      ["原调", "C♯sus2 · Asus2 · Bsus2 · F♯madd9", "C#sus2 Asus2 Bsus2 F#madd9"],
      ["第一格挪成 Csus2", "Csus2 · A♭sus2 · B♭sus2 · Fmadd9", "Csus2 Absus2 Bbsus2 Fmadd9"]
    ], "依据：Spy Tunes；GuitarTuna。Spy Tunes 写明最后一格是 F#madd9。")
  ],
  useTitle: "同一个低音，三音在不在",
  useText: "低音都从 C 走。大三有 E，sus4 把 E 换成 F，add9 是 E 还在再加 D。再用你自己的四格换一次。",
  useChanges: [
    ["大三", "C · G · Am · F", "C G Am F"],
    ["C 换成 sus4", "Csus4 · G · Am · F", "Csus4 G Am F"],
    ["C 换成 add9", "Cadd9 · G · Am · F", "Cadd9 G Am F"]
  ],
  qualities: [
    q({
      id: "Vsus4", label: "V sus4", suffix: "sus4", root: 7,
      compares: [["sus4", "Gsus4", 7], ["maj", "落到 G", 7]],
      intervals: [0, 5, 7], labels: ["根音", "四音", "五音"], colorFrom: 1,
      degrees: { 0: "R", 5: "4", 7: "5" },
      summary: "在 {key} 调里这是 V。根音 {root}，四音是 {5}，三音不在，所以想落到大三。",
      highNote: "低把位四音在 G 弦。高把位四音在 B 弦。C 调里是 Gsus4。",
      piano: [0, 5, 7], bass: [0, 7],
      shapes: [
        g("d", "low", "D 弦根音", "V", [null, null, 5, 5, 3, 3], "无名指按 D 和 G。G 弦是四音。食指按 B 和高音 e。低音两根闷住。", "没有三音。C 调根音是 G。", ["R", "4", "5"]),
        g("a", "high", "A 弦根音", "V", [null, 10, 12, 12, 13, 10], "食指横按 A 弦和高音 e。无名指按 D 和 G。小指把 B 弦再抬一品，那是四音。", "没有三音。", ["R", "4", "5"], { barre: true })
      ]
    }),
    q({
      id: "V", label: "落到 V", suffix: "", root: 7,
      compares: [["sus4", "Gsus4", 7], ["maj", "G", 7]],
      intervals: [0, 4, 7], labels: ["根音", "三音", "五音"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 7: "5" },
      summary: "四音落到三音 {4}。这是解决，不是另一颗挂留。",
      highNote: "三音在 G 弦。和上一把比，就多了这个三音。",
      piano: [0, 4, 7], bass: [0, 7],
      shapes: [
        g("e", "low", "低音 E 根音", "三音回来", [3, 5, 5, 4, 3, 3], "食指横按低音 E、B 和高音 e。无名指按 A 和 D，中指按 G 弦。G 弦是三音。", "大三和弦。挂留要落到这里。", ["R", "3", "5"], { barre: true })
      ]
    }),
    q({
      id: "Vsus2", label: "V sus2", suffix: "sus2", root: 7,
      intervals: [0, 2, 7], labels: ["根音", "二音", "五音"], colorFrom: 1,
      degrees: { 0: "R", 2: "2", 7: "5" },
      summary: "还是 V。二音是 {2}，三音仍然不在。",
      highNote: "B 弦上是二音。第一课 A 弦 add9 那把如果根音在 G，响出来就是这种没有三音的声音。",
      piano: [0, 2, 7], bass: [0, 7],
      shapes: [
        g("a", "low", "A 弦根音", "没有三音", [null, 10, 12, 12, 10, 10], "食指横按 A 弦、B 和高音 e。无名指按 D 和 G。B 弦是二音。", "没有三音。", ["R", "2", "5"], { barre: true })
      ]
    }),
    q({
      id: "add9", label: "IV add9", suffix: "add9", root: 5,
      intervals: [0, 4, 7, 2], labels: ["根音", "三音", "五音", "九音"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 7: "5", 2: "9" },
      summary: "这是对照，不是 V。在 {key} 调里它是 IV，根音 {root}，三音 {4} 还在，九音是 {2}。",
      highNote: "三音还在，所以是 add9，不是 sus。C 调里是 Fadd9。",
      piano: [0, 7, 14, 16], bass: [0, 7],
      shapes: [
        g("d", "low", "D 弦根音", "三音还在", [null, null, 3, 2, 1, 3], "小指按 D 弦根音。无名指按高音 e，那是九音。中指按 G 弦，那是三音。食指按 B 弦。", "根音、三音、五音、九音都在。", ["R", "3", "5", "9"]),
        g("e", "high", "低音 E 根音", "六弦都响", [1, 3, 3, 2, 1, 3], "食指横按低音 E 和 B 弦。无名指按 A 和 D，中指按 G 弦，小指按高音 e。G 弦是三音。", "三音还在。靠近琴枕时横按会紧。", ["R", "3", "5", "9"], { barre: true })
      ]
    })
  ]
});

add({
  slug: "slash", num: "06", nav: "第六课 · 斜杠和弦", title: "斜杠 / 低音",
  lede: "斜杠和弦的低音不是根音。低音可以是和弦里的三音或五音，也可以是从旁边走过去的音。上面的和弦先别大改，让低音自己走。",
  piano: "左手专门弹斜杠后面的那个音。右手仍是原来的三和弦。点不同的钮，听低音在换、上面不怎么换。",
  guitar: "圆点上，最低的那个音就是斜杠后面的音。把它和根音分开看。空弦的 C/E、Am/G 只作对照。",
  dots: "R 仍是和弦根音，不是低音。低音如果是三音，圆点写 3。低音如果在和弦外面，按它离根音的度数写，比如 Am/G 的 G 是 b7。",
  bass: "这一课贝斯就是斜杠。先弹低音，再弹和弦根音，听两个不是同一个音。",
  daily: "在 C 调把 C、G/B、Am、Am/G 连起来，只唱低音：C、B、A、G。",
  resolve: "低音顺级走的时候，上面可以留在同一个和弦，也可以换成低音所属的那个三和弦。",
  compare: [["maj", "主和弦", 0], ["maj", "三音在低音", 0], ["maj", "V", 7], ["m", "vi", 9]],
  songs: [
    song("pop", "晴天", "周杰伦 · 常见吉他编配 · 原调 G", [
      ["听", "第一课已经用过这圈。这里单看 D/F#：低音是 F#，和弦还是 D。转到 C 之后是 G/B，低音是 B。"],
      ["仿", "四格。低音在主歌里往下走了一步。"]
    ], [
      ["原调 G", "Em7 · Cadd9 · G · D/F♯", "Em7 Cadd9 G D/F#"],
      ["转到 C", "Am7 · Fadd9 · C · G/B", "Am7 Fadd9 C G/B"]
    ], "依据和第一课相同：Passionet、Chord4、Chordy 的吉他谱。常见吉他编配，不是逐音对过原编。", "常见吉他编配，未对原编逐音核对。"),
  ],
  useTitle: "低音走下来",
  useText: "没有再核对到一首和这四格完全一致、又足够清楚的流行谱，所以这一条当你自己的低音练习。低音是 C、B、A、G。再单独听三音在低音的 C/E。",
  useChanges: [
    ["顺级低音", "C · G/B · Am · Am/G", "C G/B Am Am/G"],
    ["三音当低音", "C · C/E · F · G", "C C/E F G"]
  ],
  qualities: [
    q({
      id: "I", label: "I", suffix: "", root: 0,
      intervals: [0, 4, 7], labels: ["根音", "三音", "五音"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 7: "5" },
      summary: "在 {key} 调里，这是主和弦，低音就是根音 {0}。",
      highNote: "先听根音在低音。后面几钮把低音换掉。",
      piano: [0, 7, 16], bass: [0, 7],
      shapes: [
        g("a", "low", "A 弦根音", "低音是根音", [null, 3, 5, 5, 5, 3], "食指按 A 弦和高音 e 的根音。无名指横按 D、G、B。", "低音是根音。", ["R", "3", "5"], { barre: true })
      ]
    }),
    q({
      id: "I3", label: "I/三音", suffixBass: 4, root: 0,
      intervals: [0, 4, 7], labels: ["根音", "三音", "五音"], colorFrom: 1,
      degrees: { 0: "R", 4: "3", 7: "5" },
      summary: "低音是三音 {4}，根音仍是 {0}。写成 {root}/{4}。",
      highNote: "最低的音是三音，不是根音。",
      piano: [0, 7, 16], pianoBass: 4, bass: [4, 0], bassLabels: ["低音", "根音"], walkLabel: "低音—根音",
      shapes: [
        g("a", "low", "三音在 A 弦", "第一转位", [null, 7, 5, 5, 5, null], "中指按 A 弦，那是三音。食指横按 D、G、B，里面有根音和五音。低音 E 和高音 e 闷住。", "最低音是三音。", ["R", "3", "5"])
      ]
    }),
    q({
      id: "V3", label: "V/三音", suffixBass: 4, root: 7,
      intervals: [0, 4, 7], labels: ["根音", "三音", "五音"], colorFrom: 1,
      degrees: { 0: "R", 4: "3", 7: "5" },
      summary: "这是属和弦 {root}，低音是它的三音 {4}。C 调里就是 G/B。",
      highNote: "低音 E 上是三音。根音在 D 弦。",
      piano: [0, 4, 7], pianoBass: 4, bass: [4, 0], bassLabels: ["低音", "根音"], walkLabel: "低音—根音",
      shapes: [
        g("e", "low", "三音在低音 E", "属和弦的转位", [7, 5, 5, 4, null, null], "无名指按低音 E，那是三音。食指按 G 弦，中指按 A 和 D。D 弦是根音。B 和高音 e 闷住。", "四个音都是这颗大三和弦里的音，最低的是三音。", ["R", "3", "5"])
      ]
    }),
    q({
      id: "vi", label: "vi", suffix: "m", root: 9, spell: "sharp",
      intervals: [0, 3, 7], labels: ["根音", "降三", "五音"], colorFrom: 1,
      degrees: { 0: "R", 3: "b3", 7: "5" },
      summary: "六级是 {root} 小三。低音先是根音。",
      highNote: "紧凑的四音形，低音是根音。",
      piano: [0, 3, 7], bass: [0, 7],
      shapes: [
        g("d", "high", "D 弦根音", "小三", [null, null, 7, 5, 5, 5], "无名指按 D 弦根音。食指横按 G、B、高音 e。G 弦是降三。", "低音是根音。", ["R", "b3", "5"])
      ]
    }),
    q({
      id: "viG", label: "vi/低音", suffixBass: 10, root: 9,
      intervals: [0, 3, 7, 10], labels: ["根音", "降三", "五音", "低音"], colorFrom: 1,
      degrees: { 0: "R", 3: "b3", 7: "5", 10: "b7" },
      summary: "上面仍是 {root} 小三，低音换成 {10}。这个低音不是小三里的音，它是降七，所以写成斜杠。",
      highNote: "低音 E 上的音在和弦外面。上面三根才是小三。",
      piano: [0, 3, 7], pianoBass: 10, bass: [10, 0], bassLabels: ["低音", "根音"], walkLabel: "低音—根音",
      shapes: [
        g("e", "low", "低音在和弦外", "经过低音", [3, null, 2, 2, 1, null], "无名指按低音 E，那是斜杠低音。中指按 D 和 G，食指按 B 弦。A 和高音 e 闷住。", "上面是小三。最低的音是降七，不把它算进小三的三个音里。", ["R", "b3", "5", "b7"])
      ]
    })
  ]
});

add({
  slug: "secondary", num: "07", nav: "第七课 · 副属", title: "副属",
  lede: "副属是临时把旁边的和弦当成主和弦，先弹它的属七。C 调里默认先听 D7，它是 V/V，去 G。E7 是 V/vi，也是 a 小调的属七。A7 去 Dm。C7 是 V/IV，去 F，不要把它当成「那个」副属的统称，更不要当成主和弦上的色彩。",
  piano: "先听属七自己的三音和降七，再听它解决到的那个和弦。钮上写的是功能：V/V、V/ii、V/vi、V/IV。",
  guitar: "把位是普通的属七。C 调里 V/V 的根音是 D，V/ii 是 A，V/vi 是 E，V/IV 是 C。",
  dots: "圆点相对的是这颗属七自己的根音：R、3、5、b7。不要把它们读成主调的音级。",
  bass: "贝斯给这颗属七的根音，解决的时候再跳到下一条的根音。",
  daily: "在 C 调弹 D7 到 G，E7 到 Am，A7 到 Dm，C7 到 F。每对只听有没有被拉过去。",
  resolve: "副属要去它自己的临时主和弦：D7 去 G，E7 去 Am，A7 去 Dm，C7 去 F。不去，就变成别的颜色。",
  compare: [["7", "这颗属七", 0], ["maj", "它要去的大调", 0]],
  songs: [
    song("jazz", "Don't Know Why", "Norah Jones · 原调 B♭ · 功能和弦", [
      ["听", "Ethan Hein 把主歌写成一串副属：Bbmaj7 接 Bb7，Bb7 是去 Eb 的属七；后面 Gm7 接 C7，C7 是去 F 的属七。D 那一格有的谱写 D7，有的写 D(#5)，这里不写进仿奏。"],
      ["仿", "只仿大家一致的两小段。"]
    ], [
      ["原调 B♭", "B♭maj7 · B♭7 · E♭maj7", "Bbmaj7 Bb7 Ebmaj7"],
      ["原调后半", "Gm7 · C7 · F7", "Gm7 C7 F7"],
      ["前半挪到 C", "Cmaj7 · C7 · Fmaj7", "Cmaj7 C7 Fmaj7"],
      ["后半挪到 C", "Am7 · D7 · G7", "Am7 D7 G7"]
    ], "依据：Ethan Hein；Spy Tunes。Bb7 和 C7 的走向两处一致。D 和弦的写法不一致，所以不放进仿奏。"),
    song("pop", "Yesterday", "The Beatles · 原调 F", [
      ["听", "落到 Dm 之前是 A7。Dm 是 F 调的 vi，A7 就是 vi 的属七。A7 前面那一格，有人写 Em7，有人写 Em7b5，这里不把那一格写死。"],
      ["仿", "只留属七和它去的小和弦。"]
    ], [
      ["原调 F", "A7 · Dm", "A7 Dm"],
      ["转到 C", "E7 · Am", "E7 Am"]
    ], "依据：College Music Symposium 对 Yesterday 的和声说明；一份 F 调和弦谱把 A7 放在 Dm 前面。")
  ],
  useTitle: "给进行加一股拉力",
  useText: "原来的 C、Am、F、G 很平。把 Am 前面换成 A7，或者在 G 前面加 D7。听多出来的那一下有没有把下一条和弦拉过来。",
  useChanges: [
    ["原来", "C · Am · F · G", "C Am F G"],
    ["vi 前面加它的属七", "C · A7 · Dm · G", "C A7 Dm G"],
    ["V 前面加它的属七", "C · D7 · G", "C D7 G"]
  ],
  qualities: [
    q({
      id: "VV", label: "V/V", suffix: "7", root: 2,
      compares: [["7", "这颗属七", 2], ["maj", "去到 V", 7]],
      intervals: [0, 4, 7, 10], labels: ["根音", "三音", "五音", "降七"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 7: "5", 10: "b7" },
      summary: "在 {key} 调里，这是上大二度的属七，根音 {root}，三音 {4}，降七 {10}。它要去的是属和弦。",
      highNote: "低把位 A 弦根音。高把位低音 E 根音。",
      piano: [0, 4, 10, 16], bass: [0, 7],
      shapes: [
        g("a", "low", "A 弦根音", "属七", [null, 5, 7, 5, 7, 5], "食指横按 A 弦、G 弦和高音 e。无名指按 D 弦，小指按 B 弦。B 弦是三音，G 弦是降七。", "四个音都在。", ["R", "3", "5", "b7"], { barre: true }),
        g("e", "high", "低音 E 根音", "六弦都响", [10, 12, 10, 11, 10, 10], "食指横按最低那一品。无名指按 A 弦，中指按 G 弦。D 弦在食指上，是降七。G 弦是三音。", "六根弦都是这颗属七里的音。", ["R", "3", "5", "b7"], { barre: true })
      ]
    }),
    q({
      id: "Vii", label: "V/ii", suffix: "7", root: 9,
      compares: [["7", "这颗属七", 9], ["m", "去到 ii", 2]],
      intervals: [0, 4, 7, 10], labels: ["根音", "三音", "五音", "降七"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 7: "5", 10: "b7" },
      summary: "在 {key} 调里，这是 ii 的属七，根音 {root}。它要去的是 ii。",
      highNote: "同一类属七把位，根音改到 ii 的属音上。",
      piano: [0, 4, 10, 16], bass: [0, 7],
      shapes: [
        g("e", "low", "低音 E 根音", "属七", [5, 7, 5, 6, 5, 5], "食指横按。中指按 G 弦，那是三音。无名指按 A 弦。D 弦在食指上，是降七。", "四个音都在。", ["R", "3", "5", "b7"], { barre: true }),
        g("a", "high", "A 弦根音", "属七", [null, 12, 14, 12, 14, 12], "和低把位的 A 弦形是同一把，只是放在高八度。", "四个音都在。", ["R", "3", "5", "b7"], { barre: true })
      ]
    }),
    q({
      id: "Vvi", label: "V/vi", suffix: "7", root: 4,
      compares: [["7", "这颗属七", 4], ["m", "去到 vi", 9]],
      intervals: [0, 4, 7, 10], labels: ["根音", "三音", "五音", "降七"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 7: "5", 10: "b7" },
      summary: "在 {key} 调里，这是 vi 的属七，根音 {root}。它要去的是 vi。",
      highNote: "C 调里这是 E7。把位会偏高，转调之后会折回低把位。",
      piano: [0, 4, 10, 16], bass: [0, 7],
      shapes: [
        g("a", "low", "A 弦根音", "属七", [null, 7, 9, 7, 9, 7], "食指横按 A 弦、G 弦和高音 e。小指按 B 弦，那是三音。G 弦是降七。", "四个音都在。", ["R", "3", "5", "b7"], { barre: true }),
        g("e", "high", "低音 E 根音", "六弦都响", [12, 14, 12, 13, 12, 12], "同一类低音 E 把位，放在第十二品。转调时如果太高，会整把降八度。", "四个音都在。", ["R", "3", "5", "b7"], { barre: true })
      ]
    }),
    q({
      id: "VIV", label: "V/IV", suffix: "7", root: 0,
      compares: [["7", "C7，去 F", 0], ["maj", "F", 5]],
      intervals: [0, 4, 7, 10], labels: ["根音", "三音", "五音", "降七"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 7: "5", 10: "b7" },
      summary: "在 {key} 调里这是 V/IV，不是「那个副属」的统称。根音 {root}，降七 {10}，它要去的是 IV。",
      highNote: "C 调里是 C7，去 F。不要把它当成主和弦上的色彩。",
      piano: [0, 4, 10, 16], bass: [0, 7],
      shapes: [
        g("a", "low", "A 弦根音", "去 IV", [null, 3, 5, 3, 5, 3], "食指横按 A 弦、G 弦和高音 e。无名指按 D 弦，小指按 B 弦。G 弦是降七，B 弦是三音。", "四个音都在。这是去 F 的属七。", ["R", "3", "5", "b7"], { barre: true }),
        g("e", "high", "低音 E 根音", "去 IV", [8, 10, 8, 9, 8, 8], "食指横按。中指按 G 弦，那是三音。D 弦在食指上，是降七。", "四个音都在。", ["R", "3", "5", "b7"], { barre: true })
      ]
    })
  ]
});

add({
  slug: "dim", num: "08", nav: "第八课 · 经过减和弦", title: "经过减",
  lede: "经过减七不是用来吓人的。它夹在两个相差二度的和弦中间，让低音或某一个声部半音走过去。减七里每个音都隔一个小三度，所以它对称，换一个音当根音还是同一类和弦。",
  piano: "四个音叠小三度：根音、降三、减五、减七。听的时候跟前后的和弦比，不要单独听成一个恐怖片和弦。",
  guitar: "减七的把位每三品重复一次，音是同一组。圆点按「低音要去的那个方向」来标根音。",
  dots: "R、b3、b5、bb7。bb7 听起来和六度一样高，在减七里它是减七音。",
  bass: "贝斯就走那条半音：C 到 C# 到 D，或者 A 到 Ab 到 G。",
  daily: "只弹低音 C、C#、D，再配上 C、C#dim7、Dm7。半音有没有连上。",
  resolve: "减七自己不稳定。它的工作是把低音送到下一格，然后离开。",
  compare: [["dim7", "减七", 0], ["m7", "它后面的小七", 0]],
  songs: [],
  useTitle: "两条半音低音",
  useText: "我没有核对到一首适合写在这里、减七又清清楚楚的流行歌，所以直接练两条连接。第一条低音 C、C#、D。第二条低音 A、Ab、G。",
  useChanges: [
    ["走向 ii", "C · C♯dim7 · Dm7 · G7", "C C#dim7 Dm7 G7"],
    ["从 vi 走到 V", "Am · A♭dim7 · G7 · C", "Am Abdim7 G7 C"]
  ],
  qualities: [
    q({
      id: "up", label: "进到 ii", suffix: "dim7", root: 1,
      compares: [["dim7", "减七", 1], ["maj", "前面的 I", 0], ["m7", "后面的 ii", 2]],
      intervals: [0, 3, 6, 9], labels: ["根音", "降三", "减五", "减七"], colorFrom: 1,
      degrees: { 0: "R", 3: "b3", 6: "b5", 9: "bb7" },
      summary: "在 {key} 调里，这个减七的根音是 {root}，比主音高半音，用来走到 ii。",
      highNote: "高三品是同一组音，减七每三品重复。",
      piano: [0, 3, 6, 9], bass: [0, 6], bassLabels: ["根音", "减五"], walkLabel: "半音走",
      shapes: [
        g("d", "low", "紧凑", "小三度一叠", [null, null, 2, 3, 2, 3], "食指按 D 弦和 B 弦。中指按高音 e，无名指按 G 弦。低音两根闷住。", "四个音刚好是一颗减七。", ["R", "b3", "b5", "bb7"]),
        g("h", "high", "高三品", "同一组音", [null, null, 5, 6, 5, 6], "同一把往上三品。音高类不变，只是换了一组八度。", "还是这颗减七。", ["R", "b3", "b5", "bb7"])
      ]
    }),
    q({
      id: "down", label: "进到 V", suffix: "dim7", root: 8, spell: "flat",
      compares: [["dim7", "减七", 8], ["m", "前面的 vi", 9], ["7", "后面的 V", 7]],
      intervals: [0, 3, 6, 9], labels: ["根音", "降三", "减五", "减七"], colorFrom: 1,
      degrees: { 0: "R", 3: "b3", 6: "b5", 9: "bb7" },
      summary: "在 {key} 调里，这个减七比 vi 低半音，用来走到 V。根音是 {root}。",
      highNote: "和上面是同一类指法，根音换了。",
      piano: [0, 3, 6, 9], bass: [0, 6], bassLabels: ["根音", "减五"], walkLabel: "半音走",
      shapes: [
        g("d", "low", "紧凑", "小三度一叠", [null, null, 9, 10, 9, 10], "食指按 D 弦和 B 弦。中指按高音 e，无名指按 G 弦。", "四个音是这颗减七。", ["R", "b3", "b5", "bb7"]),
        g("h", "high", "高三品", "同一组音", [null, null, 12, 13, 12, 13], "再高三品，还是同一组音。", "还是这颗减七。", ["R", "b3", "b5", "bb7"])
      ]
    })
  ]
});

add({
  slug: "borrow", num: "09", nav: "第九课 · 调式互换", title: "调式互换",
  lede: "大调歌曲可以临时向同主音小调借和弦。借来的音通常是降三、降六或降七。最有用的一颗是小四度：大调的 IV 变成 iv，四音还在，三音低了半音。",
  piano: "先听大三的 IV，再听小三的 iv。两颗和弦只差一个音，就是那个降三。bVI、bVII 是同一类借法，降六和降七进来了。",
  guitar: "iv 是小横按。bVI、bVII 是大横按，根音在低音 E。空弦的 Fm 不好移动，这里不用。",
  dots: "iv 的圆点有 b3。bVI、bVII 是大三和弦，圆点是 R、3、5，只是根音不在大调音阶上。",
  bass: "贝斯给借来的和弦自己的根音。IV 到 iv 时，低音可以不动，让三音自己降下去。",
  daily: "大调里弹 F、Fm、C。只听 F 里的 A 有没有变成 Ab。",
  resolve: "iv 最常回到 I。bVI 可以去 bVII 再回 I，也可以去 iv。",
  compare: [["maj", "大调 IV", 5], ["m", "小调 iv", 5], ["maj", "bVI", 8], ["maj", "bVII", 10]],
  songs: [
    song("pop", "Creep", "Radiohead · 原调 G", [
      ["听", "整首歌就是四格循环：G、B、C、Cm。G 和 C 在调内。B 是大调里不该大的 III，有人把它看成没解决的副属。Cm 是从同主音小调借来的 iv，三音从 E 降到 Eb。"],
      ["仿", "四格。III 按大三 B，不写成 B7。入门谱有时写成 B7，这里跟多数谱用 B。"]
    ], [
      ["原调 G", "G · B · C · Cm", "G B C Cm"],
      ["转到 C", "C · E · F · Fm", "C E F Fm"]
    ], "依据：National Guitar Academy；Musika Lessons；Chordify；fachords。四格 G、B、C、Cm 一致。Spy Tunes 在个别拍上加了 sus4，骨架仍是这四格。")
  ],
  useTitle: "IV 变成 iv",
  useText: "粤语歌、国语歌的慢歌里我没有核对到一份把 iv 标清楚的公开谱。写法就是：大调里走 F、Fm、C。Fm 里多出来的降三，C 调是 Ab。",
  useChanges: [
    ["IV 还是大的", "C · F · C", "C F C"],
    ["IV 变成 iv", "C · F · Fm · C", "C F Fm C"],
    ["Creep 那一圈", "C · E · F · Fm", "C E F Fm"]
  ],
  qualities: [
    q({
      id: "iv", label: "iv", suffix: "m", root: 5,
      compares: [["maj", "大四度", 5], ["m", "小四度", 5]],
      intervals: [0, 3, 7], labels: ["根音", "降三", "五音"], colorFrom: 1,
      degrees: { 0: "R", 3: "b3", 7: "5" },
      summary: "在 {key} 调里，小四度的根音是 {root}，降三是 {3}。大四度的三音低了半音就是它。",
      highNote: "低音 E 根音的小横按。C 调会靠近琴枕。",
      piano: [0, 3, 7], bass: [0, 7],
      shapes: [
        g("e", "low", "低音 E 根音", "小横按", [1, 3, 3, 1, 1, 1], "食指横按最低那一品。无名指按 A 和 D。G 弦在食指上，是降三。", "这是小三和弦，不是小七。降三就是借来的那个音。", ["R", "b3", "5"], { barre: true }),
        g("a", "high", "A 弦根音", "小横按", [null, 8, 10, 10, 9, 8], "食指横按 A 弦和高音 e。无名指按 D 和 G，中指按 B 弦。B 弦是降三。", "同一颗小三，换一把。", ["R", "b3", "5"], { barre: true })
      ]
    }),
    q({
      id: "bVI", label: "bVI", suffix: "", root: 8, spell: "flat",
      compares: [["maj", "降六级", 8], ["m", "小四度", 5]],
      intervals: [0, 4, 7], labels: ["根音", "三音", "五音"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 7: "5" },
      summary: "在 {key} 调里，降六级是 {root} 大三。它从同主音小调来。",
      highNote: "低音 E 上的大横按。",
      piano: [0, 4, 7], bass: [0, 7],
      shapes: [
        g("e", "low", "低音 E 根音", "大横按", [4, 6, 6, 5, 4, 4], "食指横按。无名指按 A 和 D，中指按 G 弦。", "大三和弦，根音是降六级。", ["R", "3", "5"], { barre: true })
      ]
    }),
    q({
      id: "bVII", label: "bVII", suffix: "", root: 10, spell: "flat",
      compares: [["maj", "降七级", 10], ["maj", "主和弦", 0]],
      intervals: [0, 4, 7], labels: ["根音", "三音", "五音"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 7: "5" },
      summary: "在 {key} 调里，降七级是 {root} 大三。它也从同主音小调来。",
      highNote: "比 bVI 高两品，还是大横按。",
      piano: [0, 4, 7], bass: [0, 7],
      shapes: [
        g("e", "low", "低音 E 根音", "大横按", [6, 8, 8, 7, 6, 6], "食指横按。无名指按 A 和 D，中指按 G 弦。", "大三和弦，根音是降七级。", ["R", "3", "5"], { barre: true })
      ]
    })
  ]
});

add({
  slug: "dom9", num: "10", nav: "第十课 · 属九 / 属十三", title: "属九 / 属十三",
  lede: "属九、属十三是装在属七外面的颜色。降七还在，所以它仍然想解决。属九的九音是大九。属十三的十三音就是大六度那个音，可是因为降七还在，它不叫 6。不要和 add9、大九搞混：那两颗没有降七。",
  piano: "属九是根音、三音、降七、九音。属十三把九音换成十三音，也可以两颗都在。先听降七还在不在。",
  guitar: "低音 E 根音的属七，把高音 e 或 B 弦抬起来，就是九音或十三音。",
  dots: "R、3、5、b7、9、13。看到 b7，就不是 add9，也不是大九。",
  bass: "贝斯守属音。九音和十三音放低了会糊。",
  daily: "当前调的属音上弹属七、属九、属十三，再解决到主和弦。",
  resolve: "它们都去主和弦。属九、属十三比干的属七更暖，拉力还在。",
  compare: [["7", "属七", 7], ["9", "属九", 7], ["13", "属十三", 7], ["add9", "add9 对照", 0]],
  songs: [
    song("jazz", "Isn't She Lovely", "Stevie Wonder · 原调 E · 主循环", [
      ["听", "主循环是 C#m7、F#9、B9、E。F#9 和 B9 都是属九，降七还在。这不是 add9。大七那一课用的是另一句里的 Amaj7。"],
      ["仿", "四格。"]
    ], [
      ["原调 E", "C♯m7 · F♯9 · B9 · E", "C#m7 F#9 B9 E"],
      ["V 挪成 G9，主和弦挪到 C", "A♭m7 · D9 · G9 · C", "Abm7 D9 G9 C"]
    ], "依据：Spy Tunes；AmChords；Jon MacLennan。主循环的 F#9 和落到 E 的属和弦，几份谱都是九和弦。"),
  ],
  useTitle: "给属七加一件衣服",
  useText: "十三音我没有核对到和这首属九一样稳的流行谱。自己听：G7、G9、G13 都去 C。G 的九音是 A，十三音是 E。",
  useChanges: [
    ["干的属七", "Dm7 · G7 · C", "Dm7 G7 C"],
    ["换成属九", "Dm7 · G9 · C", "Dm7 G9 C"],
    ["换成属十三", "Dm7 · G13 · Cmaj7", "Dm7 G13 Cmaj7"]
  ],
  qualities: [
    q({
      id: "9", label: "属九", suffix: "9", root: 7,
      intervals: [0, 4, 7, 10, 2], labels: ["根音", "三音", "五音", "降七", "九音"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 7: "5", 10: "b7", 2: "9" },
      summary: "在 {key} 调里，属九的根音是 {root}，降七是 {10}，九音是 {2}。降七还在。",
      highNote: "低音 E 根音。高音 e 是九音。",
      piano: [0, 4, 10, 14], bass: [0, 7],
      shapes: [
        g("e", "low", "低音 E 根音", "九音在高音 e", [3, null, 3, 4, 3, 5], "食指横按低音 E、D 和 B。中指按 G 弦，那是三音。小指把高音 e 抬高两品，那是九音。A 弦闷住。", "降七在 D 弦。有降七，所以是属九，不是 add9。", ["R", "3", "5", "b7", "9"])
      ]
    }),
    q({
      id: "C9", label: "C9 别用", suffix: "9", root: 0,
      compares: [["9", "C9", 0], ["maj", "它去 F", 5], ["9", "真正的 V 是 G9", 7]],
      intervals: [0, 4, 7, 10, 2], labels: ["根音", "三音", "五音", "降七", "九音"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 7: "5", 10: "b7", 2: "9" },
      summary: "这不是 C 调的 V。C9 在这里是布鲁斯式的主和弦，或是去 F 的 V/IV。默认请用 G9。",
      highNote: "根音在 C，降七还在。不要把它当成 G9 的替代默认。",
      piano: [0, 4, 10, 14], bass: [0, 7],
      shapes: [
        g("e", "high", "低音 E 根音", "不是 V", [8, null, 8, 9, 8, 10], "食指横按。中指按 G 弦，小指按高音 e。高音 e 是九音，D 弦是降七。", "这是 C9。C 调的属九仍是 G9。", ["R", "3", "5", "b7", "9"])
      ]
    }),
    q({
      id: "13", label: "属十三", suffix: "13", root: 7,
      intervals: [0, 4, 10, 9], labels: ["根音", "三音", "降七", "十三"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 7: "5", 10: "b7", 9: "13" },
      summary: "在 {key} 调里，属十三的根音是 {root}，十三音是 {9}。降七是 {10}，还在。",
      highNote: "十三音在 B 弦。这把没有五音。",
      piano: [0, 4, 10, 21], bass: [0, 7],
      shapes: [
        g("e", "low", "低音 E 根音", "十三在 B 弦", [3, null, 3, 4, 5, 3], "食指横按低音 E、D 和高音 e。中指按 G 弦，无名指把 B 弦抬高两品。B 弦是十三音。A 弦闷住。", "没有五音。降七和十三音都在。", ["R", "3", "b7", "13"])
      ]
    })
  ]
});

add({
  slug: "altered", num: "11", nav: "第十一课 · 变化属和弦", title: "变化音",
  lede: "变化属和弦仍是属七，只是九音、五音或十一音被升高或降低。降九更挤，升九更冲，升十一更亮，降十三更暗。主歌里的流行歌不必用它。它是紧张的 V，可有可无。",
  piano: "每一种都留着三音和降七。变化的是另外一个音。四个钮分开听，不要一次叠四种。",
  guitar: "把位都在属音的低把位，跨度两三品。升九那把就是常被叫做 Hendrix 和弦的指法，这里只学这个音，不学整首歌。",
  dots: "b9、#9、#11、b13 都是相对这颗属七的根音。三音仍写 3，降七仍写 b7。",
  bass: "贝斯守属音。变化音放在上面。",
  daily: "只练一种：G7 和 G7b9 都去 C。听 Ab 有没有让属七更紧。",
  resolve: "变化属七仍然去主和弦，去大调或小调都可以。变化音在解决的那一拍离开。",
  compare: [["7", "属七", 7], ["7b9", "降九", 7], ["7#9", "升九", 7], ["7#11", "升十一", 7], ["7b13", "降十三", 7]],
  songs: [
    song("jazz", "Isn't She Lovely 里的一格", "Stevie Wonder · 原调 E · 副歌前", [
      ["听", "副歌前除了 Amaj7，下一格是 G#7#5。升五和降十三是同一个音高。这是变化属和弦，不是大七。"],
      ["仿", "两格：大七，然后这颗变化属七。"]
    ], [
      ["原调 E", "Amaj7 · G♯7#5", "Amaj7 G#7#5"],
      ["转到 C", "Fmaj7 · E7#5", "Fmaj7 E7#5"]
    ], "依据：Spy Tunes；Jon MacLennan。两处都把这一格写成 G#7#5。")
  ],
  useTitle: "可有可无的紧张",
  useText: "流行歌可以永远不用。如果一句的属七太干，只换一种变化再解决。听完选一种，或者换回去。",
  useChanges: [
    ["干的属七", "Dm7 · G7 · C", "Dm7 G7 C"],
    ["降九", "Dm7 · G7b9 · C", "Dm7 G7b9 C"],
    ["升九", "Dm7 · G7#9 · C", "Dm7 G7#9 C"],
    ["降十三", "Dm7 · G7b13 · Cm", "Dm7 G7b13 Cm"]
  ],
  qualities: [
    q({
      id: "b9", label: "b9", suffix: "7b9", root: 7,
      intervals: [0, 4, 10, 1], labels: ["根音", "三音", "降七", "降九"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 7: "5", 10: "b7", 1: "b9" },
      summary: "在 {key} 调里，属七的根音是 {root}，降九是 {1}。降九比根音高半音。",
      highNote: "降九在高音 e，比根音高半音。",
      piano: [0, 4, 10, 13], bass: [0, 7],
      shapes: [
        g("e", "low", "低音 E 根音", "降九", [3, null, 3, 4, 3, 4], "食指横按低音 E、D 和 B。中指按 G 弦，小指把高音 e 抬高一品。高音 e 是降九。", "降七、三音、降九都在。", ["R", "3", "b7", "b9"])
      ]
    }),
    q({
      id: "s9", label: "#9", suffix: "7#9", root: 7,
      intervals: [0, 4, 10, 3], labels: ["根音", "三音", "降七", "升九"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 10: "b7", 3: "#9" },
      summary: "在 {key} 调里，升九是 {3}。三音 {4} 还在，所以这个音不叫降三。",
      highNote: "升九在高音 e，比降九再高一品。这把常被叫做 Hendrix 和弦。",
      piano: [0, 4, 10, 15], bass: [0, 7],
      shapes: [
        g("e", "low", "低音 E 根音", "升九", [3, null, 3, 4, null, 6], "食指横按低音 E 和 D。中指按 G 弦。小指按高音 e，那是升九。B 和 A 闷住。", "三音和升九同时在。升九比大三高一个小九度里的变化，不是把三音改成小三。", ["R", "3", "b7", "#9"])
      ]
    }),
    q({
      id: "s11", label: "#11", suffix: "7#11", root: 7,
      intervals: [0, 4, 10, 6], labels: ["根音", "三音", "降七", "升十一"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 10: "b7", 6: "#11" },
      summary: "在 {key} 调里，升十一是 {6}。它比五音高半音，听起来更亮。",
      highNote: "升十一在 B 弦。",
      piano: [0, 4, 10, 18], bass: [0, 7],
      shapes: [
        g("e", "low", "低音 E 根音", "升十一", [3, null, 3, 4, 2, null], "食指按低音 E 和 D。无名指按 G 弦，那是三音。中指按 B 弦，那是升十一。A 和高音 e 闷住。", "没有五音。三音、降七、升十一都在。", ["R", "3", "b7", "#11"])
      ]
    }),
    q({
      id: "b13", label: "b13", suffix: "7b13", root: 7,
      intervals: [0, 4, 10, 8], labels: ["根音", "三音", "降七", "降十三"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 10: "b7", 8: "b13" },
      summary: "在 {key} 调里，降十三是 {8}。它和升五是同一个音高。",
      highNote: "降十三在 B 弦，比五音高半音。",
      piano: [0, 4, 10, 20], bass: [0, 7],
      shapes: [
        g("e", "low", "低音 E 根音", "降十三", [3, null, 3, 4, 4, 3], "食指横按低音 E、D 和高音 e。中指按 G 弦，无名指按 B 弦。B 弦是降十三。", "降七、三音、降十三都在。", ["R", "3", "b7", "b13"])
      ]
    }),
    q({
      id: "e7b9", label: "a小调 V", suffix: "7b9", root: 4,
      compares: [["7b9", "E7b9", 4], ["m7", "回到 Am", 9]],
      intervals: [0, 4, 7, 10, 1], labels: ["根音", "三音", "五音", "降七", "降九"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 7: "5", 10: "b7", 1: "b9" },
      summary: "这是 a 小调的属七，不是 C 大调的 V。根音 {root}，降九 {1}，要回到 Am。",
      highNote: "B 弦是降九。C 调歌曲如果转到 a 小调，用这一颗，不要用 C7alt。",
      piano: [0, 4, 10, 13], bass: [0, 7],
      shapes: [
        g("a", "low", "A 弦根音", "去 Am", [null, 7, 6, 7, 6, 7], "食指按 D 弦和 B 弦。中指按 A 弦、G 弦和高音 e。B 弦是降九，D 弦是三音，G 弦是降七。", "降九、三音、降七都在。", ["R", "3", "5", "b7", "b9"])
      ]
    })
  ]
});

add({
  slug: "tritone", num: "12", nav: "第十二课 · 三全音替代", title: "三全音代替",
  lede: "三全音代替用 bII7 换掉 V7。C 调里用 Db7 换 G7。两颗属七共用一组三全音：B 和 F。低音改成半音下行，Db 走到 C。",
  piano: "先弹 G7，再弹 Db7，听三音和降七对调了位置，低音差了个减五度。然后听 Db7 走到 C。",
  guitar: "把位就是一颗普通属七，根音在主音上面半音。升十一那一把是可选的亮色，三全音代替经常顺手带上它。",
  dots: "圆点相对的是代替和弦自己的根音。C 调的 Db7：F 是三音，B 是降七。这两颗音也在 G7 里。",
  bass: "贝斯弹 Db，解决到 C。半音要听得见。",
  daily: "当前调弹 V7 和 bII7，再都解决到 I。说出哪两个音没变。",
  resolve: "bII7 半音下行到 I。它也可以先接在 ii 后面：ii、bII7、I。",
  compare: [["7", "原来的 V7", 7], ["7", "代替的 bII7", 1], ["maj7", "解决到 I", 0]],
  songs: [
    song("jazz", "Just the Two of Us 的间奏", "降半音解决的那一下", [
      ["听", "间奏里 Dbmaj7 接到 C7，C7 再落到 Bmaj7。C7 没有按五度上行解决，而是半音下行。这就是三全音代替的走法：属七当成上一条和弦的降二级。主歌不是这条。"],
      ["仿", "只留这一下半音解决。"]
    ], [
      ["原调那一截", "C7 · Bmaj7", "C7 Bmaj7"],
      ["同样的关系，落在 C", "D♭7 · Cmaj7", "Db7 Cmaj7"]
    ], "依据：Spy Tunes 和 Tab4U 都把间奏写成 Dbmaj7、C7、然后 Bmaj7。三全音代替是对这个半音下行的叫法。")
  ],
  useTitle: "ii 后面换一条属",
  useText: "同一句的结尾，属七用原来的 G7，或换成 Db7。再听一句带 ii 的。选更顺的那条，不必两条都留。",
  useChanges: [
    ["原来的 V", "Dm7 · G7 · Cmaj7", "Dm7 G7 Cmaj7"],
    ["换成 bII7", "Dm7 · D♭7 · Cmaj7", "Dm7 Db7 Cmaj7"],
    ["只听半音低音", "D♭7 · C", "Db7 C"]
  ],
  qualities: [
    q({
      id: "sub", label: "bII7", suffix: "7", root: 1, spell: "flat",
      compares: [["7", "原来的 V7", 7], ["7", "代替的 bII7", 1], ["maj7", "落到 I", 0]],
      intervals: [0, 4, 7, 10], labels: ["根音", "三音", "五音", "降七"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 7: "5", 10: "b7" },
      summary: "在 {key} 调里，代替属七的根音是 {root}，比主音高半音。三音是 {4}，降七是 {10}。",
      highNote: "两把都是普通属七，根音在 bII。",
      piano: [0, 4, 10, 16], bass: [0, 7],
      shapes: [
        g("a", "low", "A 弦根音", "属七", [null, 4, 6, 4, 6, 4], "食指横按 A 弦、G 弦和高音 e。无名指按 D 弦，小指按 B 弦。B 弦是三音，G 弦是降七。", "四个音都在。", ["R", "3", "5", "b7"], { barre: true }),
        g("e", "high", "低音 E 根音", "六弦都响", [9, 11, 9, 10, 9, 9], "食指横按。中指按 G 弦，那是三音。D 弦在食指上，是降七。", "六根弦都是这颗属七里的音。", ["R", "3", "5", "b7"], { barre: true })
      ]
    }),
    q({
      id: "sub11", label: "bII7#11", suffix: "7#11", root: 1, spell: "flat",
      compares: [["7", "原来的 V7", 7], ["7#11", "带升十一", 1], ["maj7", "落到 I", 0]],
      intervals: [0, 4, 10, 6], labels: ["根音", "三音", "降七", "升十一"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 10: "b7", 6: "#11" },
      summary: "同一颗代替属七，加上升十一 {6}。升十一让它更亮，拉力还是那组三全音。",
      highNote: "升十一在 B 弦。",
      piano: [0, 4, 10, 18], bass: [0, 7],
      shapes: [
        g("e", "low", "低音 E 根音", "升十一", [9, null, 9, 10, 8, null], "食指按低音 E 和 D。无名指按 G 弦，那是三音。中指按 B 弦，那是升十一。", "三音、降七、升十一都在。没有五音。", ["R", "3", "b7", "#11"])
      ]
    })
  ]
});

add({
  slug: "twfive", num: "13", nav: "第十三课 · ii–V–I", title: "ii–V–I",
  lede: "ii–V–I 是把前面学过的颜色按一条拉力排好：小七去属七，属七去主和弦。这一课不发明新和弦，只把已经会的小七、属七、大七，以及小九、属十三、6/9 装进这一句。",
  piano: "先听朴素的三格，再听加了颜色的三格。钮可以单独听 ii、V、I。",
  guitar: "每一钮是这一句里的一颗和弦，把位都是前面课里的移动形。转调之后，ii、V、I 一起搬。",
  dots: "小七看 b3 和 b7，属七看 3 和 b7，大七看 7，6/9 看 6 和 9。不要在一颗和弦上读到它没有的音。",
  bass: "低音就走 ii 的根音、V 的根音、I 的根音。颜色放在上面。",
  daily: "当前调弹两遍：先 Dm7、G7、Cmaj7，再 Dm9、G13、C6/9。留下更适合你这首歌的那一遍。",
  resolve: "拉力在 V 到 I。ii 只是把 V 介绍出来。主和弦用大七更悬，用 6/9 更稳。",
  compare: [["m7", "ii", 2], ["7", "V", 7], ["maj7", "I 大七", 0], ["69", "I 的 6/9", 0]],
  songs: [
    song("jazz", "Autumn Leaves 的开头", "标准曲 · 只取 ii–V–I", [
      ["听", "秋叶开头在 B♭ 调：Cm7、F7、Bbmaj7。这就是 ii–V–I。这里只取这三格，不排整首。"],
      ["仿", "三格，再挪到 C。"]
    ], [
      ["原调 B♭", "Cm7 · F7 · B♭maj7", "Cm7 F7 Bbmaj7"],
      ["转到 C", "Dm7 · G7 · Cmaj7", "Dm7 G7 Cmaj7"]
    ], "这是标准曲开头最常见的三格。后面还有小调的 ii–V，这一课不展开。"),
    song("pop", "流行里的朴素收法", "不是爵士进行", [
      ["听", "很多歌只是小三、大三的属、主和弦，没有七音。它和爵士 ii–V–I 是同一条低音，颜色少很多。"],
      ["仿", "三格，故意不加七音。"]
    ], [
      ["C 调", "Dm · G · C", "Dm G C"]
    ], "这一组和上面的爵士分开。")
  ],
  useTitle: "两种颜色，选一种",
  useText: "同一句低音，朴素的一套，和用了小九、属十三、6/9 的一套。写粤语歌或国语歌时留更贴的那套，不必上满。",
  useChanges: [
    ["朴素", "Dm · G · C", "Dm G C"],
    ["爵士的基本色", "Dm7 · G7 · Cmaj7", "Dm7 G7 Cmaj7"],
    ["再加已经学过的颜色", "Dm9 · G13 · C6/9", "Dm9 G13 C6/9"]
  ],
  qualities: [
    q({
      id: "ii", label: "ii", suffix: "m7", root: 2,
      intervals: [0, 3, 7, 10], labels: ["根音", "降三", "五音", "降七"], colorFrom: 1,
      degrees: { 0: "R", 3: "b3", 7: "5", 10: "b7" },
      summary: "在 {key} 调里，ii 是 {root} 小七。降三 {3}，降七 {10}。",
      highNote: "A 弦根音的小七。",
      piano: [0, 3, 10, 15], bass: [0, 7],
      shapes: [
        g("a", "low", "A 弦根音", "小七", [null, 5, 7, 5, 6, 5], "食指横按。小指按 B 弦，那是降三。G 弦是降七。", "四个音都在。", ["R", "b3", "5", "b7"], { barre: true })
      ]
    }),
    q({
      id: "V", label: "V", suffix: "7", root: 7,
      intervals: [0, 4, 7, 10], labels: ["根音", "三音", "五音", "降七"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 7: "5", 10: "b7" },
      summary: "在 {key} 调里，V 是 {root} 属七。三音 {4}，降七 {10}。",
      highNote: "低音 E 根音。",
      piano: [0, 4, 10, 16], bass: [0, 7],
      shapes: [
        g("e", "low", "低音 E 根音", "属七", [3, null, 3, 4, 3, 3], "食指横按低音 E、D、B、高音 e。中指按 G 弦，那是三音。D 弦是降七。A 弦闷住。", "四个音都在。", ["R", "3", "5", "b7"])
      ]
    }),
    q({
      id: "I", label: "I 大七", suffix: "maj7", root: 0,
      intervals: [0, 4, 7, 11], labels: ["根音", "三音", "五音", "大七"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 7: "5", 11: "7" },
      summary: "在 {key} 调里，主和弦用大七。大七是 {11}。",
      highNote: "第三课的紧凑把位。",
      piano: [0, 11, 16], bass: [0, 7],
      shapes: [
        g("d", "high", "D 弦根音", "大七", [null, null, 10, 9, 8, 7], "小指按 D 弦，无名指按 G 弦，中指按 B 弦，食指按高音 e。高音 e 是大七。", "四音都在。", ["R", "3", "5", "7"])
      ]
    }),
    q({
      id: "ii9", label: "ii9", suffix: "m9", root: 2,
      intervals: [0, 3, 7, 10, 2], labels: ["根音", "降三", "五音", "降七", "九音"], colorFrom: 1,
      degrees: { 0: "R", 3: "b3", 7: "5", 10: "b7", 2: "9" },
      summary: "ii 换成小九。根音 {root}，九音是 {2}。",
      highNote: "第四课的小九形，根音在 ii 上。",
      piano: [0, 3, 10, 14], bass: [0, 7],
      shapes: [
        g("a", "low", "A 弦根音", "小九", [null, 5, 3, 5, 5, 5], "食指按 D 弦，那是降三。其余在高两品：A 弦根音，G 弦降七，B 弦九音，高音 e 五音。", "五个音都在。", ["R", "b3", "5", "b7", "9"])
      ]
    }),
    q({
      id: "V13", label: "V13", suffix: "13", root: 7,
      intervals: [0, 4, 10, 9], labels: ["根音", "三音", "降七", "十三"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 10: "b7", 9: "13" },
      summary: "V 换成属十三。根音 {root}，十三音是 {9}。降七还在。",
      highNote: "第十课的属十三把位。",
      piano: [0, 4, 10, 21], bass: [0, 7],
      shapes: [
        g("e", "low", "低音 E 根音", "属十三", [3, null, 3, 4, 5, 3], "食指横按。中指按 G 弦，无名指按 B 弦。B 弦是十三音。", "没有五音。降七和十三音都在。", ["R", "3", "b7", "13"])
      ]
    }),
    q({
      id: "I69", label: "I 6/9", suffix: "6/9", root: 0,
      intervals: [0, 4, 7, 9, 2], labels: ["根音", "三音", "五音", "六音", "九音"], colorFrom: 3,
      degrees: { 0: "R", 4: "3", 7: "5", 9: "6", 2: "9" },
      summary: "主和弦改回第二课的 6/9。六音是 {9}，九音是 {2}。没有七音，所以比大七更稳。",
      highNote: "第二课的低把位 6/9。",
      piano: [0, 7, 9, 14, 16], bass: [0, 7],
      shapes: [
        g("a", "low", "A 弦根音", "五音都在", [null, 3, 2, 2, 3, 3], "中指按 A 弦。食指按 D 和 G。无名指按 B 弦，小指按高音 e。", "根音、三音、五音、六音、九音都在。没有七音。", ["R", "3", "5", "6", "9"])
      ]
    })
  ]
});

function song(group, title, meta, beats, changes, source, caveat) {
  return { group, title, meta, beats, changes, source, caveat: caveat || "" };
}
