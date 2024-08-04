// Game constants and configurations
const GAME_WIDTH = 600;
const GAME_HEIGHT = 800;
const OBJECT_FALL_SPEED = 2;
const MERGE_THRESHOLD = 10;

// Game objects
const gameObjects = [
    { name: 'きのこ', size: 85, collisionRadius: 40 },
    { name: 'ねずみ', size: 100, collisionRadius: 48 },
    { name: 'ひよこ', size: 120, collisionRadius: 58 },
    { name: 'にわとり', size: 150, collisionRadius: 70 },
];

const allGameObjects = [
    { name: 'きのこ', size: 85, collisionRadius: 40 },
    { name: 'ねずみ', size: 100, collisionRadius: 48 },
    { name: 'ひよこ', size: 120, collisionRadius: 58 },
    { name: 'にわとり', size: 150, collisionRadius: 70 },
    { name: 'ぺんぎん', size: 200, collisionRadius: 95 },
    { name: 'あざらし', size: 210, collisionRadius: 100 },
    { name: 'くま', size: 240, collisionRadius: 115 },
    { name: 'いちご', size: 200, collisionRadius: 110, isX: true },
    { name: 'かえる', size: 300, collisionRadius: 140 },
    { name: 'はーと', size: 330, collisionRadius: 150, isHeart: true }
];

// ボムオブジェクトの定義
const BOMB_SIZE = 80;
const BOMB_EXPLOSION_RADIUS = 150;

// Playable characters with skills
const playableCharacters = [
    {
        name: 'へいへい',
        unlocked: true,
        storyUnlockScore: 500,
        characterUnlockScore: 0,
        backgroundImage: 'assets/images/へいへい_背景.PNG',
        stageBG: 'assets/images/へいへい_ステージ.PNG',
        bgm: 'assets/audio/へいへい_BGM.mp3',
        description: '主人公の親友であり、イケメンでモテる。時々現れては、主人公に助言をしてかっこよく去っていく。',
        skill: {
            name: 'にわとり一掃',
            description: '場に出ているにわとりのオブジェクトをすべて消去する',
            effect: (gameState) => {
                gameState.fallingObjects = gameState.fallingObjects.filter(obj => obj.type.name !== 'にわとり');
                return gameState;
            }
        }
    },
    {
        name: 'アイナ',
        unlocked: false,
        storyUnlockScore: 3000,
        characterUnlockScore: 4000,
        backgroundImage: 'assets/images/アイナ_背景.PNG',
        stageBG: 'assets/images/アイナ_ステージ.PNG',
        bgm: 'assets/audio/アイナ_BGM.mp3',
        description: '誰にでも親切な、マリコの親友。実はマリコが仮想世界で創造した人物。現実には存在しない。',
        skill: {
            name: 'ネッネ参上',
            description: '現在場にあるオブジェクトの半分をランダムでねずみのオブジェクトに変化させる',
            effect: (gameState) => {
                const objectsCount = gameState.fallingObjects.length;
                const changeCount = Math.floor(objectsCount / 2);
                const indexes = new Set();
                
                while (indexes.size < changeCount) {
                    indexes.add(Math.floor(Math.random() * objectsCount));
                }
                
                gameState.fallingObjects = gameState.fallingObjects.map((obj, index) => {
                    if (indexes.has(index)) {
                        return {
                            ...obj,
                            type: gameObjects.find(type => type.name === 'ねずみ')
                        };
                    }
                    return obj;
                });
                
                return gameState;
            }
        }
    },
    {
        name: 'アヒッル',
        unlocked: false,
        storyUnlockScore: 5000,
        characterUnlockScore: 6000,
        backgroundImage: 'assets/images/アヒッル_背景.PNG',
        stageBG: 'assets/images/アヒッル_ステージ.PNG',
        bgm: 'assets/audio/アヒッル_BGM.mp3',
        description: 'クラスメートであり、すさまじいほどのイケメン。マリコが大好きで、主人公がマリコと仲良くなるのをあの手この手で邪魔しようとしてくる。',
        skill: {
            name: '餌の時間',
            description: '場にあるきのことひよこのオブジェクトを全消去する',
            effect: (gameState) => {
                gameState.fallingObjects = gameState.fallingObjects.filter(obj => 
                    obj.type.name !== 'きのこ' && obj.type.name !== 'ひよこ'
                );
                return gameState;
            }
        }
    },
    {
        name: 'エレン',
        unlocked: false,
        storyUnlockScore: 7000,
        characterUnlockScore: 8000,
        backgroundImage: 'assets/images/エレン_背景.PNG',
        stageBG: 'assets/images/エレン_ステージ.PNG',
        bgm: 'assets/audio/エレン_BGM.mp3',
        description: 'XANA内の学校「GENESIS学園」に務める女性教師。落ち着いた物腰で生徒からの信頼も厚い。実は現実世界では１０歳の女の子。ふとしたきっかけでXANAに迷い込んでしまう。',
        skill: {
            name: 'いちご泥棒',
            description: '場にあるすべてのいちごのオブジェクトを消滅させる',
            effect: (gameState) => {
                gameState.fallingObjects = gameState.fallingObjects.filter(obj => obj.type.name !== 'いちご');
                return gameState;
            }
        }
    },
    {
        name: 'shim',
        unlocked: false,
        storyUnlockScore: 9000,
        characterUnlockScore: 10000,
        backgroundImage: 'assets/images/shim_背景.PNG',
        stageBG: 'assets/images/shim_ステージ.PNG',
        bgm: 'assets/audio/shim_BGM.mp3',
        description: 'GENESIS学園の生徒会長。主人公の事を「ふざけた奴」と、ライバル視しており、事あるごとに張り合ってくるが、根はまっすぐで心優しい。',
        skill: {
            name: 'なおたんのために',
            description: '次の4ターン連続であざらしのオブジェクトが落下する',
            effect: (gameState) => {
                gameState.shimSkillTurns = 4;
                return gameState;
            }
        }
    },
    {
        name: 'RIO',
        unlocked: false,
        storyUnlockScore: 11000,
        characterUnlockScore: 12000,
        backgroundImage: 'assets/images/RIO_背景.PNG',
        stageBG: 'assets/images/RIO_ステージ.PNG',
        bgm: 'assets/audio/RIO_BGM.mp3',
        description: '仮想世界を創り出した人物。本人も現実世界と仮想世界を行き来しながら、理想の世界を創り出そうとしている。',
        skill: {
            name: '理想郷',
            description: '場にあるオブジェクトをすべて消去する',
            effect: (gameState) => {
                gameState.fallingObjects = [];
                return gameState;
            }
        }
    },
    {
        name: 'ミンミン',
        unlocked: false,
        storyUnlockScore: 13000,
        characterUnlockScore: 14000,
        backgroundImage: 'assets/images/ミンミン_背景.PNG',
        stageBG: 'assets/images/ミンミン_ステージ.PNG',
        bgm: 'assets/audio/ミンミン_BGM.mp3',
        description: '仮想世界を支配しようとする黒い魔王。GENESIS学園に素晴らしい恋のエネルギーが眠っていることを知り、生徒に変装して忍び込んでいる。',
        skill: {
            name: 'いちご大好き',
            description: '次のターンから三連続でいちごがドロップする',
            effect: (gameState) => {
                gameState.minminSkillTurns = 3;
                return gameState;
            }
        }
    },
    {
        name: 'マリコ',
        unlocked: false,
        storyUnlockScore: 15000,
        characterUnlockScore: 16000,
        backgroundImage: 'assets/images/マリコ_背景.PNG',
        stageBG: 'assets/images/マリコ_ステージ.PNG',
        bgm: 'assets/audio/マリコ_BGM.mp3',
        description: '学園のアイドル的存在。明るく優しい性格で人気者だが、XANAの世界に秘密を抱えている。主人公に対して特別な感情を抱いているようだ。',
        skill: {
            name: 'けろきんぐ',
            description: '次の2ターン連続でかえるのオブジェクトが落下する',
            effect: (gameState) => {
                gameState.marikoSkillTurns = 2;
                return gameState;
            }
        }
    }
];

// Global story
const globalStory = [
    {
        title: "プロローグ: XANAへの招待",
        unlockScore: 500,
        content: `都会の喧騒の中、あなたは日常に飽き飽きしていた。いつも通りスマートフォンを手に取ると、突然画面が青白く光り出し、見知らぬメッセージが浮かび上がった。

「XANAへようこそ。あなたは選ばれし者です。」

戸惑う中、部屋の空気が変わり、壁や天井がゆっくりと溶けるような感覚に襲われる。恐怖で体が凍りつきそうになるが、スマートフォンから柔らかな声が聞こえた。
「恐れることはありません。あなたの冒険が、今始まろうとしているのです。」

その声に導かれるようにスクリーンに触れると、青い光の渦に包まれ、浮遊感に包まれた。次に目を開けると、幻想的な風景が広がっていた。空には浮遊する島々があり、地上には未来的な建物が立ち並ぶ。そこには「GENESIS学園」の大きな門がそびえていた。

「大丈夫か？」

突然聞こえた声に振り向くと、笑顔の少年が立っていた。彼は優しく手を差し出しながら自己紹介をした。

「俺はへいへい。君は新入生？ようこそＸＡＮＡへ！」

彼の手を取ると、温かさと共に現実感が戻ってきた。へいへいはXANAの世界のことを教えてくれた。

「ここでは想像力が現実になるんだ。でも、時々予想外のことも起きるんだよね。俺もちょっと前に来たばかりで、いろいろ驚いてるところさ。」

話の途中で、空から虹色の雨が降り始め、地面に落ちる前に花に変わっていった。へいへいはそれを見て笑った。

「面白いだろ？さあ、これからもっと面白いことが起きるぜ。」

彼の言葉に期待が膨らむ。この未知の世界でどんな冒険が待っているのだろうか。GENESIS学園の門をくぐると、様々な姿の生徒たちが行き交っていた。

「お、アヒッルがいる。」へいへいが指さした先には、鋭い視線をこちらに向ける少年がいた。「あいつ、イケメンだけどなーーんか変わってるんだよなぁ。」

オリエンテーションの時間が近づいていた。へいへいに促され、あなたは一歩を踏み出した。XANAでの新生活が今、幕を開ける。`,
        images: [
            "assets/images/prologue_1.PNG",
            "assets/images/prologue_2.PNG",
            "assets/images/prologue_3.PNG"
        ]
    },
    {
        title: "第1章: 謎の転校生",
        unlockScore: 3000,
        content: `GENESIS学園での新生活に少しずつ慣れてきたあなたとへいへい。学校はXANAの中で最も賑やかな場所で、様々な異世界からの生徒たちが集まっていた。毎日が新しい発見の連続だった。

ある日、クラスに新しい転校生がやってきた。その名はアイナ。彼女は穏やかな微笑みを浮かべ、クラスメートに親しげに挨拶した。しかし、何かが違う。彼女の周りには不思議な空気が漂っていた。
へいへいもその違和感に気づいたようだった。放課後、二人でアイナについて話すことにした。

「なんだろう、あの子には何か隠されている気がするんだ。」

へいへいは眉をひそめて言った。

「彼女の目の奥に、どこか遠くを見つめるような表情があった。」

その夜、あなたは夢を見た。夢の中で、アイナが誰もいない教室で何かを見つめている。彼女の目は悲しげで、何か言いたそうだった。あなたが近づこうとすると、急に目が覚めた。
翌日、へいへいにその夢を話すと、彼も同じような夢を見たと言う。どうやら、ただの偶然ではないようだ。二人はアイナに関する手がかりを探るため、彼女を観察することにした。

彼女は普段、クラスメートと仲良くしているが、時折遠くを見つめていることがあった。その視線の先には、学園の図書館があった。

ある放課後、あなたとへいへいはアイナの後を追い、図書館に向かった。そこには、アイナが一人で古い書物を調べている姿があった。彼女は驚いた様子で二人に気づき、少し戸惑ったように笑った。

「ここで何をしているの？」

あなたが尋ねると、アイナはためらいながら答えた。

「この世界について知りたくて…GENESIS学園の歴史やXANAの成り立ちについて、少しでも知識を得たかったの。」

彼女の言葉に、あなたとへいへいはさらに疑問を抱いた。アイナが何を隠しているのか、彼女が本当に探しているものは何なのか。答えを見つけるために、二人はアイナに協力を申し出た。

「ありがとう。でも、これは私一人の問題だから…」

アイナはそう言って微笑んだが、その微笑みの裏には深い悲しみが潜んでいるようだった。

アイナの周りに何か謎があることは確かだった。彼女が本当に何者なのか、そして何を求めているのかを知るために、あなたたちは更なる調査を進めることを決意する。
こうして、XANAの謎に満ちた日々が始まった。アイナとの出会いが、あなたたちをどんな冒険に導くのか、この時点ではまだ誰も知らなかった。`,
        images: [
            "assets/images/chapter1_1.PNG",
            "assets/images/chapter1_2.PNG"
        ]
    },
    {
        title: "第2章: 幻のアイドル",
        unlockScore: 5000,
        content: `GENESIS学園には、誰もが憧れる存在がいた。その名はマリコ。彼女は学園のアイドルであり、その美しい歌声と踊りで多くのファンを魅了していた。しかし、実際に彼女に会ったことがあるという生徒はほとんどいなかった。まるで彼女の存在自体が幻のようだった。

ある日、あなたはアヒッルがマリコについて熱く語っているのを耳にする。
アヒッルは自信満々で、自分のことを「ボクチン」と呼ぶ変わったキャラクターだ。彼はマリコへの熱い思いを隠そうとせず、彼女に固執している様子が見て取れた。そしてなぜか主人公の事を何かにつけてライバル視してくる。

「ボクチンは、マリコちゃんに会ったことがあるんだ。彼女の歌声を聴いたら、誰だって彼女の虜になるに違いない！」

アヒッルは誇らしげに話し、周囲の視線を集めていた。

「マリコに会ったって言ってたけど、本当に彼女に会ったのか？」

へいへいが疑念を込めて問いかけると、アヒッルは一瞬ためらったが、すぐに自信を取り戻して答えた。

「まあ、実際に会ったわけじゃないけど、ボクチンは彼女の歌声を聴いたんだ。それだけで十分さ。彼女の声はまるで天使のようで、ボクチンの心を揺さぶるんだよ。」

その自信に満ちた態度と固執ぶりに、あなたは何か引っかかるものを感じた。マリコの存在には何か秘密があるに違いない…。

やがて、学園の文化祭でマリコがパフォーマンスをするという噂が広まった。生徒たちは彼女の姿を一目見ようと集まっていた。そしていよいよ舞台の幕が上がった時、そこには誰もいなかった。
しかし突然、幻想的な音楽が響き渡り、光が舞台に集まった。その中からマリコが現れ、彼女の美しさに観客は息を呑んだ。彼女の圧倒的なパフォーマンス、素晴らしい歌声に皆我を忘れて聞き惚れていた。

ふと、我に返ると、あなたはアイナが観客席の端で何かを呟いているのを見つけた。彼女の表情には困惑と焦りが浮かんでいた。ステージが終わり、幕が閉じるとあなたはアイナに近づき、問いかけた。

「マリコについて、何か知っているの…？」

アイナはしばらく沈黙していたが、やがてため息をついて答えた。

「実は…マリコは現実には存在しないの。彼女はXANAの一部で、誰かが作り出した仮想の存在なのよ。」

その言葉にあなたは驚きを隠せなかった。アイナによると、マリコはXANAのシステムによって創り出されたデジタルアイドルであり、その存在は非常に不安定なものだという。そして、彼女の歌声や姿は、聴く者の心に最も響く形で表現されるのだ。
この事実を知ったあなたたちは、マリコの存在が一体誰の手によって作られたのか、そしてその目的は何なのかを探ることに決めた。XANAの世界に潜む更なる謎を解き明かすため、調査は続いていく…。`,
        images: [
            "assets/images/chapter2_1.PNG",
            "assets/images/chapter2_2.PNG"
        ]
    },
    {
        title: "第3章: 時を越えた教師",
        unlockScore: 7000,
        content: `GENESIS学園に新しい教師が着任した。その名はエレン。彼女は落ち着いた物腰と深い知識を持ち、瞬く間に生徒たちの信頼を得た。彼女の授業はいつも興味深く、学生たちの間で人気があった。しかし、エレンには何か謎めいた雰囲気があり、あなたは次第にその正体に興味を抱くようになる。

ある日、あなたはエレンが授業中に口にした言葉に違和感を覚える。それは、普通の10歳の少女が話すような言葉遣いで、彼女の知的で落ち着いたイメージとは異なっていた。さらに、彼女は時折、自分の年齢や過去について曖昧なことを言うことがあった。

「エレン先生って、もしかして何か隠してるんじゃないか？」

へいへいが耳打ちするように言う。

「この学園には不思議なことが多すぎるし、彼女もその一部かもしれない。」

その言葉に触発され、あなたとへいへいはエレンの過去を調べることにした。学園の記録を調べても、エレンの情報はほとんど見つからない。まるで彼女は突然この学園に現れたかのようだった。

ある日、あなたは偶然にもエレンが一人で校舎の屋上にいるのを見かけた。彼女はスマートフォンを手にし、何かをつぶやいていた。近づくと、その言葉が聞こえてきた。

「どうして私はここにいるの？私の家族や友達はどこにいるの？」

その瞬間、エレンはあなたの存在に気づき、驚いた表情を浮かべた。あなたが彼女に近づき、真実を問いただそうとすると、彼女は静かに話し始めた。

「私は、本当は現実世界の10歳の少女なの。名前もエレンじゃない。本当の名前はエミリ。私がこの世界に来たのは、ただの偶然だったの。」

彼女の話によると、エミリは現実世界で普通の生活を送っていたが、ある日、XANAのシステムに引き込まれてしまったという。彼女はこの世界で自分の本来の姿を失い、教師としての役割を与えられてしまったのだ。

「私はここで何をすればいいのか分からない。でも、生徒たちに教えることができることは幸せだわ。」

エミリは少し微笑んだが、その目にはどこか哀しみが宿っていた。
あなたはエミリに、彼女を助ける方法を探すと約束した。彼女を現実世界に戻すために、あなたたちは再びXANAの謎を解き明かす旅に出ることを決意する。エミリの過去と彼女がこの世界に迷い込んだ経緯を調べる中で、XANAと現実世界との奇妙な繋がりが次第に明らかになっていく。`,
        images: [
            "assets/images/chapter3_1.PNG",
            "assets/images/chapter3_2.PNG"
        ]
    },
    {
        title: "第4章: 生徒会長の野望",
        unlockScore: 9000,
        content: `GENESIS学園の生徒会長であるshimは、これまで穏やかで公正なリーダーとして知られていた。しかし、最近彼の行動に変化が現れ始める。彼は次第に権力を握ることに執着し、学園全体を支配しようとするかのような態度を見せ始めた。生徒たちは彼の変貌に戸惑いと不安を感じていた。

ある日、shimは全校集会を開き、驚くべき宣言をした。
「GENESIS学園の未来を守るためには、強いリーダーシップが必要だ。私に学園の全ての決定権を委ねるべきだ！」
その言葉に、多くの生徒たちが戸惑いを隠せない。あなたとへいへいは、shimの変化に疑問を抱く。
「おかしいぜ。あいつがこんな主張するなんて」へいへいが眉をひそめる。
エレン先生も心配そうな表情で近づいてきた。「shimの行動には何か理由があるはずよ。でも、このままでは学園の秩序が乱れてしまう」
アイナも不安そうに言う。「私にはよく分からないけど...shimさんの様子が変です」
あなたたちは、shimの背後に何か大きな力が働いているのではないかと考え始める。そこで、shimの行動を密かに監視することを決意した。
調査を進めるうちに、shimが学園内の影響力を強めるためにさまざまな手段を講じていることが明らかになる。彼は生徒会のメンバーを自分の味方につけ、反対勢力を排除しようと画策していた。
ある日、あなたはshimが秘密裏に何かを計画していることを知り、その計画を阻止するための情報を集めることを決意する。へいへいと共に、shimの部屋に忍び込むことに成功した。
そこで発見したのは、学園全体を監視し、shimの意に反する者を排除するための計画書だった。さらに驚いたことに、shimの背後には謎の人物がいることが分かる。その人物は学園を支配しようとしているようだった。
「これは大変だ。みんなに知らせなきゃ」へいへいが焦った様子で言う。
あなたたちは、この情報をエレン先生やアイナ、そして信頼できる仲間たちに共有することにした。全員で力を合わせ、shimの陰謀を阻止する計画を立て始める。
しかし、shimの影響力はすでに学園全体に及んでいた。彼の支持者たちは、あなたたちの行動を妨害しようとする。
エレン先生が提案する。「私たちに必要なのは、真実を全ての生徒に伝えること。みんなの力を借りれば、きっとshimの計画を止められるはず」
アイナも決意を込めて言う。「私にできることは少ないかもしれない。でも、精一杯協力します」
あなたたちは、shimの陰謀を暴露し、学園の平和を取り戻すための行動を起こすことを決意する。しかし、その背後にいる謎の人物の正体はまだ分からない。XANAの世界には、まだ多くの謎が隠されているようだ。
shimの野望に立ち向かい、GENESIS学園の未来を守るための戦いが、今始まろうとしていた。`,
        images: [
            "assets/images/chapter4_1.PNG",
            "assets/images/chapter4_2.PNG"
        ]
    },
    {
        title: "第5章：危機と希望",
        unlockScore: 11000,
        content: `shimの野望に立ち向かうため、あなたたちは行動を起こした。まず、エレン先生の協力を得て、shimの計画書のコピーを学園内に密かに配布し始めた。
「これで、みんなに真実が伝わるはず」とへいへいが言う。
しかし、shimの影響力は予想以上に強く、多くの生徒たちは真実を信じようとしなかった。
アイナが提案する。「私たち、直接みんなに話しかけてみましょう」
あなたたちは分担して生徒たちに真実を伝え始めた。少しずつではあるが、理解を示す生徒が増えていく。
ところが、shimはこの動きに気づき、反撃に出た。彼は全校放送で、あなたたちを「学園の秩序を乱す反逆者」と名指しで非難し始めたのだ。
「くっ、このままじゃまずいぞ」へいへいが焦る。
その時、マリコが前に出た。「私に考えがあります。みんなの心に届く歌を歌って、真実を伝えましょう」
マリコの提案を受け入れ、秘密のライブを計画。
ライブ当日、マリコの歌声がXANA全体に響き渡る。その歌には不思議な力があり、聴く者の心に直接訴えかけるかのようだった。
多くの生徒たちが真実に目覚め始める中、shimは最後の手段に出た。「これ以上は許さん！」と叫び、学園のシステムを強制的に操作し始めたのだ。
突如、GENESIS学園全体が大きく揺れ始める。窓の外では、XANAの風景が歪み、現実世界の景色が透けて見えた。
「こ、これは...」エレン先生が驚きの声を上げる。
shimの暴走により、XANAのシステムが不安定化し始めたのだ。あなたたちは必死にshimを説得しようとするが、彼は聞く耳を持たない。
まさにその時、全身白いスーツに身を包んだ男性が現れた。
「やめるんだ。これ以上XANAを傷つけてはならない」
その声に、全ての動きが止まる。男性は静かに自己紹介をした。
「私はRIO。XANAの創造者だ」
その言葉に、shimを含む全員が驚きの声を上げる。
RIOはshimに近づき、優しく語りかける。「君の気持ちはよく分かる。しかし、支配することがXANAの目的ではない。ここは皆が自由に成長できる場所なのだ」
shimは混乱した表情を浮かべながらも、徐々に冷静さを取り戻していく。
しかし、XANAの不安定化は収まらない。RIOが説明を始める。
「XANAは危機に瀕している。現実世界とのバランスが崩れつつあるのだ。このままでは、仮想世界が崩壊してしまうかもしれない」
その時、黒い影が現れ、闇のような響きの声がみんなの頭の中に響いてきた。「ふふふ...ﾖｼﾎﾞｳｻﾝﾔﾖｼﾎﾞｳｻﾝ。XANAが不安定になればなるほど、ミンの力が増していくのよ」
「この声は…まさか」RIOがつぶやく。不気味な声が響き、混沌とした状況の中、あなたは決意を固める。「みんな、力を合わせよう。XANAを、そして僕たちの絆を守るために！」
マリコ、アイナ、エレン先生、そしてへいへいが、あなたの周りに集まる。
RIOが言う。「君たちの想いが、XANAを支える力となる。さあ、XANAの心臓部へ向かおう。そこで全てを安定させることができるはずだ」
こうして、あなたたちはXANAの存続をかけた戦いへと向かう。shimの暴走は止まったものの、新たな危機と謎が待ち受けていた。XANAと現実世界の真の関係...全ての謎が、今明かされようとしていた。`,
        images: [
            "assets/images/chapter5_1.PNG",
            "assets/images/chapter5_2.PNG"
        ]
    },
    {
        title: "第6章：闇の正体",
        unlockScore: 13000,
        content: `XANAの心臓部へ向かう途中、あなたたちはさらなる真実に直面することになる。RIOの案内で、学園の地下深くに隠された秘密の部屋に辿り着いたのだ。
その部屋に入ると、壁一面にXANAのシステムを表す複雑な図形が映し出されていた。その中心にはshimの姿が浮かび上がっている。
「これは...」へいへいが驚きの声を上げる。
RIOが説明を始める。「shimは知らず知らずのうちに、XANAのシステムと深く結びついていたのだ。彼の感情や思考が、直接XANAの安定性に影響を与えていた」
その時、黒い影がシステムの図形の中を這うように動き回る。ミンミンの姿だ。
「ふふふ...全て私の計画通りよ」不気味な声が響く。
RIOが厳しい表情で言う。「やはりミンミン…貴様がshimを操っていたのか」
まるで闇そのもののミンミンは高らかに笑う。「そうよ。あの子の野望を煽り、XANAを不安定にさせるのはとても簡単だったわ」
shim自身もその場に居合わせており、ミンミンの告白を聞いて愕然とする。「私は...操られていたのか？」
あなたがshimに近づき、優しく語りかける。「shimさん、あなたは騙されていたんだ。でも、まだ間に合う。一緒にXANAを守りましょう」
エレン先生も付け加える。「そうよ、shim。あなたの強さは、今こそXANAを守るために必要なの」
ミンミンは苛立ちを隠せない。「ちっ、こんなところで仲良くされては困るわ！」
突如、部屋全体が激しく揺れ始める。ミンミンの力によって、XANAの崩壊が加速し始めたのだ。
マリコが叫ぶ。「このままじゃXANAが...！」
アイナも不安そうに言う。「私たち、消えてしまうの...？」
その時、RIOが前に出る。「まだ希望はある。君たち一人一人の中にある、XANAへの想いだ。その力を集めれば、システムを安定させることができるはずだ」
あなたは決意を固める。「みんな、力を合わせよう！」
へいへい、マリコ、アイナ、エレン先生、そしてshimまでもが、あなたの周りに集まる。全員で手を取り合い、目を閉じてXANAへの想いを集中させる。
すると、驚くべきことが起こった。全員の体から淡い光が放たれ、それがシステムの図形に吸収されていく。XANAの風景が徐々に安定を取り戻していく。
「な、なんてことなの...！」ミンミンが悲鳴を上げる。
光に包まれたミンミンの姿が少しずつ変化していく。そして、その正体が明らかになる瞬間が訪れた。
光が収まると、そこにはミンミンの姿はなく、一人の少女が立っていた。
「こ、この子は...」RIOが驚きの声を上げる。
ミンミンの正体とは? そして、XANAの真の目的とは? 物語は、さらなる真実へと向かって進んでいく。`,
        images: [
            "assets/images/chapter6_1.PNG",
            "assets/images/chapter6_2.PNG"
        ]
    },
    {
        title: "第7章：真実の光",
        unlockScore: 15000,
        content: `ミンミンの姿が消え、一人の少女が現れたことで、部屋中が静寂に包まれた。
    RIOが驚きの表情で少女に近づく。「まさか...君は...」
    少女は困惑した様子で周りを見回し、おずおずと口を開いた。「私は...美奈（みな）。どうしてここにいるの...？」
    RIOは深いため息をつき、説明を始めた。「美奈は、XANAの原型となったプログラムを作った天才プログラマーだ。しかし、彼女は現実世界で事故に遭い、意識不明の状態になってしまった。その直前、彼女の意識がXANAに取り込まれてしまったのだ」
    全員が驚きの声を上げる中、マリコが前に出た。「それで、美奈さんの意識が『ミンミン』として具現化したのね」
    アイナも付け加えた。「きっと、美奈さんの中にあった現実世界への不満や怒りが『ミンミン』を生み出したんだわ」
    美奈は混乱した様子で言う。「私...何をしてしまったの？」
    あなたが優しく美奈に語りかける。「美奈さん、あなたは自分の苦しみから、XANAを危険に晒してしまった。でも、それは過去のこと。これからは一緒にXANAを守っていこう」
    へいへいも励ます。「そうだぜ！みんなで力を合わせれば、きっと道は開ける」
    美奈の目に涙が浮かぶ。「みんな...ありがとう」
    しかし、まだXANAの不安定さは完全には解消されていなかった。システムの図形が時折大きく揺れる。
    RIOが説明する。「XANAと現実世界のバランスを完全に取り戻すには、もう一つ重要なことがある。それは...」
    突然、部屋の奥に大きな扉が現れた。RIOが続ける。「あの扉の向こうにXANAの核心部がある。そこで最後の調整を行わなければならない」
    エレン先生が不安そうに尋ねる。「でも、誰が行くの？」
    RIOはあなたを見つめ、静かに言った。「君しかいない。君には両世界を行き来する特別な力がある。その力で、XANAと現実世界の橋渡しをしてほしい」
    あなたは決意を固め、頷く。「分かりました。行ってきます」
    マリコが心配そうに言う。「気を付けてね」
    アイナも付け加える。「私たち、ここで待ってるから」
    あなたが扉に向かって歩き出したその時、shimが声をかけた。「待ってくれ。俺も一緒に行く。俺のせいでXANAが危機に陥ったんだ。最後まで責任を取らせてくれ」
    RIOは少し考え、頷いた。「いいだろう。二人で行ってくれ」
    あなたとshimは、仲間たちに見送られながら、扉の向こう側へと踏み出した。そこには、XANAの真実と、あなたたちの未来を決める重大な選択が待っていた。`,
        images: [
            "assets/images/chapter7_1.PNG",
            "assets/images/chapter7_2.PNG"
        ]
    },
    {
        title: "最終章：新たな始まり",
        unlockScore: 17000,
        content: `XANAの核心部に足を踏み入れたあなたとshim。そこには、現実世界とXANAをつなぐ巨大な光の柱が立っていた。
    「これが...XANAの心臓か」shimが畏敬の念を込めて呟く。
    光の柱に近づくと、あなたの体が輝き始める。両世界を行き来する力が反応しているのだ。
    突然、光の柱から声が聞こえてきた。「よく来てくれた。私はXANAそのものだ」
    XANAの声は続く。「私は人々の想像力と希望から生まれた。しかし、現実世界との均衡が崩れ、存在が不安定になっていた」
    あなたは尋ねる。「どうすれば安定を取り戻せますか？」
    「君の中にある両世界をつなぐ力が鍵となる。その力で、私を現実世界とより強く結びつけてほしい」
    あなたは決意を固め、光の柱に手を触れる。するとあなたの体から光が溢れ、XANA全体に広がっていく。
    shimも側で励ます。「君なら出来る！みんなの想いを忘れるな！」
    光が最高潮に達したとき、XANAの風景が一瞬にして安定を取り戻した。
    核心部から戻ったあなたとshimを、仲間たちが歓迎の声で迎える。
    RIOが微笑みながら言う。「よくやってくれた。XANAは安定を取り戻し、さらに進化を遂げたようだ」
    エレン先生が付け加える。「現実世界との繋がりも、より強固になったわ。私たちはもう、消えてしまう心配はないのよ」
    美奈も涙ながらに謝罪する。「みんな、本当にごめんなさい。これからは、XANAの発展のために力を尽くすわ」
    喜びに沸く中、あなたはふとマリコの様子がおかしいことに気づく。彼女は少し離れたところで、何かを考え込んでいるようだ。
    「マリコ、どうしたの？」あなたが声をかける。
    マリコは少し驚いた様子で振り返り、微笑む。「ううん、なんでもないの。ただ、少し考えごとをしていただけ」
    その時、RIOが静かに言った。「マリコ、もう隠す必要はないだろう」
    全員の視線がマリコに集まる。
    マリコは深呼吸をし、決意を込めて言う。「実は...私はXANAが生み出した特別な存在なの。XANAの意思を具現化した、いわば『XANAの娘』とも言えるかもしれない」
    その告白に、全員が驚きの声を上げる。アイナが困惑した様子で尋ねる。「じゃあ、私を作り出したのは...」
    マリコは優しく微笑む。「そう、私よ。でも、あなたはもう立派な一人の存在になったわ」
    RIOが補足する。「マリコの存在は、XANAの進化の証でもある。彼女には、まだ私たちも知らない力が眠っているかもしれない」
    あなたはマリコに近づき、手を差し伸べる。「これからも一緒に、XANAの未来を作っていこう」
    マリコは感謝の笑顔を見せ、あなたの手を取る。「ありがとう。きっと素晴らしい冒険になるわ」
    こうして、XANAの危機は去り、平和が戻ってきた。しかし、マリコの正体という新たな謎が浮上し、さらなる冒険の予感が漂う。
    GENESIS学園の日常が戻る中、あなたは窓の外を見つめる。現実世界とXANAの風景が美しく溶け合っている。
    「次はどんな冒険が待っているんだろう」
    そう呟きながら、あなたは仲間たちと共に、新たな一歩を踏み出す準備をしていた。`,
        images: [
            "assets/images/chapter8_1.PNG",
            "assets/images/chapter8_2.PNG"
        ]
    }
];






let currentChapter = null;

// BGM settings
const BGM = {
    title: 'assets/audio/title_BGM.mp3',
    characterSelect: 'assets/audio/title_BGM.mp3',
    gameOver: 'assets/audio/game_over_BGM.mp3'
};

// Game state variables
let gameArea;
let gameContainer;
let currentCharacter = playableCharacters[0];
let nextObject;
let nextNextObject;
let fallingObjects = [];
let isGameOver = false;
let score = 0;
let lastTime;
const GAME_OVER_LINE = 100;
let highScores = [];
let currentBGM = null;
let currentBGMKey = null;
let volumeControl;
let skillUses = 2;
let shimSkillTurns = 0;
let marikoSkillTurns = 0;
let bombs = [];
// グローバル変数の追加
let unlockedImages = [];

// SE設定
const SE = {
    select: new Audio('assets/audio/select.mp3'),
    drop: new Audio('assets/audio/drop.mp3'),
    merge: new Audio('assets/audio/merge.mp3'),
    skill: new Audio('assets/audio/skill.mp3'),
    unlock: new Audio('assets/audio/unlock.mp3')
};

// SE再生関数
function playSE(name) {
    if (SE[name]) {
        SE[name].currentTime = 0;
        SE[name].play().catch(error => console.log('SE playback error:', error));
    }
}

// ボリューム調整の拡張
function addVolumeControl() {
    const volumeControlContainer = document.createElement('div');
    
    const label = document.createElement('label');
    label.htmlFor = 'volume-control';
    label.textContent = '音量:';
    volumeControlContainer.appendChild(label);

    volumeControl = document.createElement('input');
    volumeControl.id = 'volume-control';
    volumeControl.type = 'range';
    volumeControl.min = 0;
    volumeControl.max = 1;
    volumeControl.step = 0.1;
    volumeControl.value = 0.5;
    volumeControl.addEventListener('input', (e) => {
        const volume = e.target.value;
        if (currentBGM) {
            currentBGM.volume = volume;
        }
        Object.values(SE).forEach(audio => {
            audio.volume = volume;
        });
    });
    volumeControlContainer.appendChild(volumeControl);

    gameContainer.appendChild(volumeControlContainer);
}

// ギャラリー画像の定義
const galleryImages = [
    { id: 1, src: 'assets/images/heart_reward_1.png', unlocked: false },
    { id: 2, src: 'assets/images/heart_reward_2.png', unlocked: false },
    { id: 3, src: 'assets/images/heart_reward_3.png', unlocked: false },
    { id: 4, src: 'assets/images/heart_reward_4.png', unlocked: false },
    { id: 5, src: 'assets/images/heart_reward_5.png', unlocked: false },
    { id: 6, src: 'assets/images/heart_reward_6.png', unlocked: false },
];

// Game initialization
function initGame() {
    try {
        gameContainer = document.getElementById('game-container');
        gameArea = document.getElementById('game-area');
        if (!gameArea || !gameContainer) {
            throw new Error('Game elements not found!');
        }
        
        // 初期スコアが500未満の場合、プロローグをロック
        if (score < 500) {
            globalStory[0].unlocked = false;
        }
            // タッチイベントの追加
    gameArea.addEventListener('touchmove', (event) => {
        event.preventDefault();
        const touch = event.touches[0];
        moveNextObject({ clientX: touch.clientX, clientY: touch.clientY });
    }, { passive: false });

    gameArea.addEventListener('touchend', dropObject);
    
        resizeGame();
        addVolumeControl();
        addEventListeners();
        showTitleScreen(); // タイトル画面を先に表示
        
        // createNextObject とupdateNextObjectsDisplay はゲーム開始時に呼び出す
        
        console.log('Game initialized successfully');
    } catch (error) {
        console.error('Game initialization error:', error);
        alert('ゲームの初期化中にエラーが発生しました。ページをリロードしてください。');
    }
}

function resizeGame() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const gameRatio = 600 / 800;
    const windowRatio = windowWidth / windowHeight;

    if (windowRatio > gameRatio) {
        gameContainer.style.width = `${windowHeight * gameRatio}px`;
        gameContainer.style.height = '100vh';
    } else {
        gameContainer.style.width = '100vw';
        gameContainer.style.height = `${windowWidth / gameRatio}px`;
    }
}

function addEventListeners() {
    window.addEventListener('resize', resizeGame);
    gameArea.addEventListener('mousemove', moveNextObject);
    gameArea.addEventListener('mouseup', dropObject);
    gameArea.addEventListener('touchmove', (event) => {
        event.preventDefault();
        const touch = event.touches[0];
        moveNextObject({ clientX: touch.clientX, clientY: touch.clientY });
    }, { passive: false });
    gameArea.addEventListener('touchend', dropObject);
}

function addVolumeControl() {
    const volumeControlContainer = document.createElement('div');
    
    const label = document.createElement('label');
    label.htmlFor = 'volume-control';
    label.textContent = '音量:';
    volumeControlContainer.appendChild(label);

    volumeControl = document.createElement('input');
    volumeControl.id = 'volume-control';
    volumeControl.type = 'range';
    volumeControl.min = 0;
    volumeControl.max = 1;
    volumeControl.step = 0.1;
    volumeControl.value = 0.5;
    volumeControl.addEventListener('input', (e) => {
        if (currentBGM) {
            currentBGM.volume = e.target.value;
        }
    });
    volumeControlContainer.appendChild(volumeControl);

    gameContainer.appendChild(volumeControlContainer);
}

// 1. BGMの自動再生問題
function manageBGM(bgmKey) {
    const bgmSrc = BGM[bgmKey] || bgmKey;
    
    if (currentBGMKey === bgmKey) {
        return;
    }
    
    if (currentBGM) {
        currentBGM.pause();
        currentBGM.currentTime = 0;
    }
    
    currentBGM = new Audio(bgmSrc);
    currentBGM.loop = true;
    currentBGM.volume = volumeControl.value;
    
    // ユーザーインタラクション後にBGMを再生
    document.addEventListener('click', playBGM, { once: true });
    
    currentBGMKey = bgmKey;
}

function playBGM() {
    if (currentBGM) {
        currentBGM.play().catch(error => console.log('BGM playback error:', error));
    }
}

function stopBGM() {
    if (currentBGM) {
        currentBGM.pause();
        currentBGM.currentTime = 0;
        currentBGMKey = null;
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Title screen
// タイトル画面にギャラリーボタンを追加
function showTitleScreen() {
    manageBGM('title');
    gameArea.innerHTML = '';
    const titleScreen = document.createElement('div');
    titleScreen.id = 'title-screen';
    titleScreen.style.backgroundImage = 'url("assets/images/タイトル.PNG")';

    const title = document.createElement('h1');
    title.id = 'game-title';
    title.textContent = 'XANA/クロスオーバーパズル';
    title.className = 'fade-in';
    titleScreen.appendChild(title);

    const menuContainer = document.createElement('div');
    menuContainer.id = 'menu-container';

    const menuItems = [
        { text: 'ゲームスタート', action: showCharacterSelectScreen },
        { text: 'ハイスコア', action: showHighScores },
        { text: 'ストーリー', action: showStorySelection },
        { text: 'ギャラリー', action: showGallery },
        { text: 'ゲーム説明', action: showGameInstructions },
        { text: 'セーブ＆ロード', action: showSaveLoadScreen }
    ];

    menuItems.forEach((item, index) => {
        const button = document.createElement('button');
        button.textContent = item.text;
        button.addEventListener('click', () => {
            playSE('select');
            item.action();
        });
        button.style.animation = `fadeIn 0.5s ease-in-out ${index * 0.1}s forwards`;
        button.style.opacity = '0';
        menuContainer.appendChild(button);
    });

    titleScreen.appendChild(menuContainer);
    gameArea.appendChild(titleScreen);

    const versionInfo = document.createElement('div');
    versionInfo.textContent = 'Version 1.0.0';
    versionInfo.style.position = 'absolute';
    versionInfo.style.bottom = '10px';
    versionInfo.style.right = '10px';
    versionInfo.style.fontSize = '12px';
    versionInfo.style.color = '#ffffff';
    titleScreen.appendChild(versionInfo);

    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
}

// ストーリー選択画面を表示する関数
function showStorySelection() {
    gameArea.innerHTML = '';
    const storyScreen = document.createElement('div');
    storyScreen.id = 'story-screen';
    storyScreen.style.backgroundImage = 'url("assets/images/story_background.jpg")';
    storyScreen.style.backgroundSize = 'cover';
    storyScreen.style.backgroundPosition = 'center';

    const title = document.createElement('h2');
    title.textContent = 'ストーリー';
    storyScreen.appendChild(title);

    const chapterGrid = document.createElement('div');
    chapterGrid.id = 'chapter-grid';
    chapterGrid.style.display = 'grid';
    chapterGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    chapterGrid.style.gap = '20px';
    chapterGrid.style.padding = '20px';

    const chapterOrder = [
        'プロローグ', '第1章', '第2章', '第3章',
        '第4章', '第5章', '第6章', '第7章', '最終章'
    ];

    chapterOrder.forEach((chapterTitle, index) => {
        const chapter = globalStory.find(ch => ch.title.includes(chapterTitle));
        if (chapter) {
            const chapterButton = document.createElement('button');
            chapterButton.textContent = `${chapter.title}${chapter.unlocked ? '' : ' (ロック中)'}`;
            chapterButton.disabled = !chapter.unlocked;
            chapterButton.addEventListener('click', () => showChapter(globalStory.indexOf(chapter)));
            chapterGrid.appendChild(chapterButton);
        }
    });

    storyScreen.appendChild(chapterGrid);

    const backButton = document.createElement('button');
    backButton.textContent = 'タイトルに戻る';
    backButton.addEventListener('click', showTitleScreen);
    backButton.style.position = 'absolute';
    backButton.style.bottom = '20px';
    backButton.style.left = '50%';
    backButton.style.transform = 'translateX(-50%)';
    storyScreen.appendChild(backButton);

    gameArea.appendChild(storyScreen);
}

// 特定の章を表示する関数
function showChapter(index) {
    currentChapter = globalStory[index];
    gameArea.innerHTML = '';
    const chapterScreen = document.createElement('div');
    chapterScreen.id = 'chapter-screen';

    const title = document.createElement('h2');
    title.textContent = currentChapter.title;
    chapterScreen.appendChild(title);

    const contentContainer = document.createElement('div');
    contentContainer.id = 'content-container';
    contentContainer.style.maxHeight = '70vh'; // 画面の70%の高さを最大とする（画像がないので増やしました）
    contentContainer.style.overflowY = 'auto'; // スクロール可能にする
    contentContainer.style.padding = '20px';
    contentContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // 背景を少し透明に
    contentContainer.style.borderRadius = '10px';

    const content = document.createElement('p');
    // 句読点で改行を入れる
    content.innerHTML = currentChapter.content.replace(/([。．！？])\s*/g, '$1<br><br>');
    contentContainer.appendChild(content);

    chapterScreen.appendChild(contentContainer);

    const backButton = document.createElement('button');
    backButton.textContent = 'ストーリー選択に戻る';
    backButton.addEventListener('click', showStorySelection);
    backButton.style.marginTop = '20px';
    chapterScreen.appendChild(backButton);

    gameArea.appendChild(chapterScreen);
}

// ゲーム進行に応じてストーリーをアンロックする関数
function unlockStories() {
    globalStory.forEach(chapter => {
        if (score >= chapter.unlockScore) {
            chapter.unlocked = true;
        }
    });
}

// ゲーム開始関数
function startGame() {
    showCharacterSelectScreen(); // キャラクター選択画面を表示
}


// Character selection screen
function showCharacterSelectScreen() {
    manageBGM('characterSelect');
    gameArea.innerHTML = '';
    const selectScreen = document.createElement('div');
    selectScreen.id = 'character-select-screen';

    const characterContainer = document.createElement('div');
    characterContainer.id = 'character-buttons';

    const characterInfo = document.createElement('div');
    characterInfo.id = 'character-info';
    characterInfo.style.display = 'none';

    playableCharacters.forEach((char, index) => {
        const charButton = document.createElement('button');
        charButton.textContent = char.unlocked ? char.name : '???';
        charButton.disabled = !char.unlocked;
        charButton.addEventListener('click', () => {
            playSE('select');
            showCharacterInfo(char, selectScreen);
        });

        charButton.addEventListener('mouseover', () => {
            selectScreen.style.backgroundImage = `url('${char.backgroundImage}')`;
        });

        characterContainer.appendChild(charButton);
    });

    selectScreen.appendChild(characterContainer);
    selectScreen.appendChild(characterInfo);

    const backButton = document.createElement('button');
    backButton.id = 'back-button';
    backButton.textContent = '戻る';
    backButton.addEventListener('click', showTitleScreen);
    backButton.className = 'fade-in';
    selectScreen.appendChild(backButton);

    gameArea.appendChild(selectScreen);
}

function showCharacterInfo(character, selectScreen) {
    const characterInfo = document.getElementById('character-info');
    characterInfo.innerHTML = `
        <h3>${character.name}</h3>
        <p>${character.description}</p>
        <h4>スキル: ${character.skill.name}</h4>
        <p>${character.skill.description}</p>
        <button id="start-game-button">ゲームスタート</button>
        <button id="back-to-selection-button">キャラクター選択に戻る</button>
    `;
    characterInfo.style.display = 'block';

    document.getElementById('start-game-button').addEventListener('click', () => {
        startGameWithCharacter(character);
    });

    document.getElementById('back-to-selection-button').addEventListener('click', () => {
        characterInfo.style.display = 'none';
    });

    selectScreen.style.backgroundImage = `url('${character.backgroundImage}')`;
}
function startGameWithCharacter(character) {
    try {
        currentCharacter = character;
        gameState = {
            score: 0,
            skillUses: character.name === 'RIO' ? 1 : 2,
            shimSkillTurns: 0,
            marikoSkillTurns: 0,
            minminSkillTurns: 0,
            bombs: [],
            fallingObjects: []
        };
        gameArea.innerHTML = '';

        const scoreContainer = document.createElement('div');
        scoreContainer.id = 'score-container';

        const scoreElement = document.createElement('div');
        scoreElement.id = 'score';
        scoreElement.textContent = 'Score: 0';
        scoreContainer.appendChild(scoreElement);

        const skillButton = document.createElement('div');
        skillButton.id = 'skill-button';
        skillButton.style.backgroundImage = "url('assets/images/スキル_ボタン.PNG')";
        skillButton.style.backgroundSize = 'contain';
        skillButton.style.backgroundRepeat = 'no-repeat';
        skillButton.style.width = '100px';
        skillButton.style.height = '100px';
        skillButton.style.position = 'relative';
        skillButton.style.cursor = 'pointer';
        skillButton.addEventListener('click', useSkill);

        const skillUseCount = document.createElement('div');
        skillUseCount.id = 'skill-use-count';
        skillUseCount.textContent = gameState.skillUses;
        skillButton.appendChild(skillUseCount);

        scoreContainer.appendChild(skillButton);

        gameArea.appendChild(scoreContainer);

        const titleElement = document.createElement('div');
        titleElement.id = 'game-title';
        titleElement.textContent = 'XANA/クロスオーバーパズル';
        gameArea.appendChild(titleElement);

        const gamePlayArea = document.createElement('div');
        gamePlayArea.id = 'game-play-area';
        gameArea.appendChild(gamePlayArea);

        setStageAndBGM(character);

        createNextObject();
        updateNextObjectsDisplay();

        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
        resetGame();

        console.log('Game started successfully with character:', character.name);
    } catch (error) {
        console.error('Error starting game:', error);
        alert('ゲームの開始中にエラーが発生しました。もう一度お試しください。');
    }
}

function setStageAndBGM(character) {
    const gamePlayArea = document.getElementById('game-play-area');
    gamePlayArea.style.backgroundImage = `url('${character.stageBG}')`;
    manageBGM(character.bgm);
}

function resetGame() {
    isGameOver = false;
    score = 0;
    fallingObjects = [];
    gameState = {
        minminSkillTurns: 0,
        shimSkillTurns: 0,
        marikoSkillTurns: 0,
        // その他の必要なプロパティ
    };
    updateScore();
    createGameOverLine();
}

function createGameOverLine() {
    const gamePlayArea = document.getElementById('game-play-area');
    const line = document.createElement('div');
    line.id = 'game-over-line';
    line.style.top = `${GAME_OVER_LINE}px`;
    
    // テキストラベルの削除
    
    gamePlayArea.appendChild(line);
}

function createRandomObject() {
    let randomIndex;
    if (gameState.minminSkillTurns > 0) {
        randomIndex = allGameObjects.findIndex(obj => obj.name === 'いちご');
        gameState.minminSkillTurns--;
    } else if (gameState.shimSkillTurns > 0) {
        randomIndex = allGameObjects.findIndex(obj => obj.name === 'あざらし');
        gameState.shimSkillTurns--;
    } else if (gameState.marikoSkillTurns > 0) {
        randomIndex = allGameObjects.findIndex(obj => obj.name === 'かえる');
        gameState.marikoSkillTurns--;
    } else {
        randomIndex = Math.floor(Math.random() * gameObjects.length);
    }

    return {
        type: allGameObjects[randomIndex],
        x: gameArea.offsetWidth / 2,
        y: allGameObjects[randomIndex].size / 2,
        rotation: 0,
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 980 }
    };
}

function createNextObject() {
    if (nextNextObject) {
        nextObject = nextNextObject;
    } else {
        nextObject = createRandomObject();
    }
    nextNextObject = createRandomObject();
    updateNextObjectsDisplay();
}

function moveNextObject(event) {
    if (isGameOver || !nextObject) return; // nextObjectが未定義の場合は処理をスキップ
    const rect = gameArea.getBoundingClientRect();
    nextObject.x = Math.max(nextObject.type.size / 2, Math.min(event.clientX - rect.left, gameArea.offsetWidth - nextObject.type.size / 2));
    updateNextObjectPosition();
}

function updateNextObjectPosition() {
    const gamePlayArea = document.getElementById('game-play-area');
    const nextObjectElement = document.getElementById('next-object') || createGameObjectElement('next-object');
    updateObjectElement(nextObjectElement, nextObject);
    gamePlayArea.appendChild(nextObjectElement);
    showDropPreview();
}

function showDropPreview() {
    const gamePlayArea = document.getElementById('game-play-area');
    const previewElement = document.getElementById('drop-preview') || createDropPreviewElement();
    previewElement.style.left = `${nextObject.x - 1}px`;
    previewElement.style.height = `${gamePlayArea.offsetHeight}px`;
    gamePlayArea.appendChild(previewElement);
}

function createDropPreviewElement() {
    const element = document.createElement('div');
    element.id = 'drop-preview';
    return element;
}

function createGameObjectElement(id) {
    const element = document.createElement('div');
    element.id = id;
    element.className = 'game-object';
    return element;
}

// updateObjectElement 関数を修正してボムの画像を表示
function updateObjectElement(element, obj) {
    element.style.width = `${obj.type.size}px`;
    element.style.height = `${obj.type.size}px`;
    element.style.left = `${obj.x - obj.type.size / 2}px`;
    element.style.top = `${obj.y - obj.type.size / 2}px`;
    element.style.transform = `rotate(${obj.rotation}deg)`;
    if (obj.type.isBomb) {
        console.log('Updating bomb element:', obj);
        element.style.backgroundImage = 'url("assets/images/bomb.PNG")';
    } else {
        element.style.backgroundImage = `url('assets/images/${obj.type.name}.PNG')`;
    }
    element.style.backgroundSize = '98% 98%';
    console.log('Updated element:', element.style.backgroundImage);
}

function updateNextObjectsDisplay() {
    const gamePlayArea = document.getElementById('game-play-area');
    const nextObjectsContainer = document.getElementById('next-objects-container') || createNextObjectsContainer();

    const nextElement = document.getElementById('next-object') || createGameObjectElement('next-object');
    updateObjectElement(nextElement, nextObject);

    const nextNextElement = document.getElementById('next-next-object') || createGameObjectElement('next-next-object');
    updateObjectElement(nextNextElement, nextNextObject);

    nextObjectsContainer.appendChild(nextElement);
    nextObjectsContainer.appendChild(nextNextElement);
    gamePlayArea.appendChild(nextObjectsContainer);
}

function createNextObjectsContainer() {
    const container = document.createElement('div');
    container.id = 'next-objects-container';

    const nextLabel = document.createElement('div');
    nextLabel.className = 'next-label';
    nextLabel.textContent = 'Next';

    const nextNextLabel = document.createElement('div');
    nextNextLabel.className = 'next-label';
    nextNextLabel.textContent = 'After';

    container.appendChild(nextLabel);
    container.appendChild(document.createElement('div'));
    container.appendChild(nextNextLabel);
    container.appendChild(document.createElement('div'));

    return container;
}

function dropObject() {
    if (isGameOver || !nextObject) return;
    const droppedObject = { ...nextObject, y: nextObject.type.size / 2 };
    fallingObjects.push(droppedObject);
    playSE('drop');
    createNextObject();
}

function createBomb(x, y) {
    const bomb = {
        type: { name: 'ボム', size: BOMB_SIZE, isBomb: true },
        x: x,
        y: y,
        rotation: 0,
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 980 }
    };
    console.log('Created bomb:', bomb);
    return bomb;
}

// ボムの爆発を処理する関数を修正
function explodeBomb(bombIndex, fallingObjects) {
    const bomb = fallingObjects[bombIndex];
    const explosionRadius = BOMB_EXPLOSION_RADIUS;
    const survivingObjects = fallingObjects.filter((obj, index) => {
        if (index === bombIndex) return false; // ボム自体を除去
        const distance = Math.sqrt((obj.x - bomb.x) ** 2 + (obj.y - bomb.y) ** 2);
        return distance > explosionRadius || obj.type.isBomb; // 他のボムは爆発の影響を受けない
    });
    return survivingObjects;
}

// ボムをクリックした際の処理を修正
function handleBombClick(bombIndex) {
    fallingObjects = explodeBomb(bombIndex, fallingObjects);
    score += 100; // ボム爆発でボーナススコア
    updateScore();
    renderObjects();
}

function checkCollisions() {
    for (let i = 0; i < fallingObjects.length; i++) {
        for (let j = i + 1; j < fallingObjects.length; j++) {
            if (isColliding(fallingObjects[i], fallingObjects[j])) {
                resolveCollision(fallingObjects[i], fallingObjects[j]);
                if (fallingObjects[i].type.name === fallingObjects[j].type.name) {
                    mergeObjects(i, j);
                    return; // 一度にひとつの衝突のみを処理
                }
            }
        }
    }
}

function gameLoop(currentTime) {
    if (isGameOver) return;

    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    updatePhysics(deltaTime);
    checkCollisions();
    applyPositionConstraints(); // 新しく追加
    renderObjects();
    checkGameOver();

    requestAnimationFrame(gameLoop);
}

function updatePhysics(deltaTime) {
    const gamePlayArea = document.getElementById('game-play-area');
    fallingObjects.forEach(obj => {
        obj.velocity.x += obj.acceleration.x * deltaTime;
        obj.velocity.y += obj.acceleration.y * deltaTime;
        obj.x += obj.velocity.x * deltaTime;
        obj.y += obj.velocity.y * deltaTime;

        const effectiveRadius = obj.type.isX || obj.type.isHeart ? obj.type.size / 2 : obj.type.collisionRadius;

        if (obj.x < effectiveRadius) {
            obj.x = effectiveRadius;
            obj.velocity.x *= -0.5;
        } else if (obj.x > gamePlayArea.offsetWidth - effectiveRadius) {
            obj.x = gamePlayArea.offsetWidth - effectiveRadius;
            obj.velocity.x *= -0.5;
        }

        if (obj.y > gamePlayArea.offsetHeight - effectiveRadius) {
            obj.y = gamePlayArea.offsetHeight - effectiveRadius;
            obj.velocity.y *= -0.5;
            obj.velocity.x *= 0.9;
        }

        // 速度の減衰を少し緩める
        obj.velocity.x *= 0.99;
        obj.velocity.y *= 0.99;

        if (Math.abs(obj.velocity.x) < 0.1) obj.velocity.x = 0;
        if (Math.abs(obj.velocity.y) < 0.1) obj.velocity.y = 0;

        // 回転の計算を調整
        obj.rotation += obj.velocity.x * 0.05; // 係数を小さくして回転を抑える
    });

    checkCollisions(); // 衝突チェックと合成処理
    applyPositionConstraints(); // 位置の制約適用
}
function isColliding(obj1, obj2) {
    if (obj1.type.isX || obj2.type.isX) {
        return isCollidingWithX(obj1, obj2);
    } else if (obj1.type.isHeart || obj2.type.isHeart) {
        return isCollidingWithHeart(obj1, obj2);
    } else {
        const distance = Math.sqrt((obj1.x - obj2.x) ** 2 + (obj1.y - obj2.y) ** 2);
        return distance < (obj1.type.collisionRadius + obj2.type.collisionRadius) * 1.1; // 合成判定を緩くする
    }
}

function isCollidingWithX(obj1, obj2) {
    const xObj = obj1.type.isX ? obj1 : obj2;
    const otherObj = obj1.type.isX ? obj2 : obj1;
    const dx = Math.abs(xObj.x - otherObj.x);
    const dy = Math.abs(xObj.y - otherObj.y);
    const radius = otherObj.type.collisionRadius;
    const xSize = xObj.type.size;

    // X の各腕の幅を考慮した簡易的な判定
    const armWidth = xSize * 0.2;
    if (dx < armWidth && dy < xSize / 2) return true;
    if (dy < armWidth && dx < xSize / 2) return true;

    // X の中心との距離で判定
    return Math.sqrt(dx * dx + dy * dy) < (xSize / 2 + radius);
}

function isCollidingWithHeart(obj1, obj2) {
    const heartObj = obj1.type.isHeart ? obj1 : obj2;
    const otherObj = obj1.type.isHeart ? obj2 : obj1;
    const dx = Math.abs(heartObj.x - otherObj.x);
    const dy = Math.abs(heartObj.y - otherObj.y);
    const radius = otherObj.type.collisionRadius;
    const heartSize = heartObj.type.size;

    // ハートの形状を考慮した簡易的な判定
    if (dy < heartSize * 0.75) {
        return dx < (heartSize / 2 + radius);
    } else {
        const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
        return distanceToCenter < (heartSize / 2 + radius);
    }
}

function resolveCollision(obj1, obj2) {
    const dx = obj2.x - obj1.x;
    const dy = obj2.y - obj1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    let overlap;

    if (obj1.type.isX || obj2.type.isX || obj1.type.isHeart || obj2.type.isHeart) {
        // X やハートの場合は、おおよその重なりを計算
        overlap = (obj1.type.size / 2 + obj2.type.size / 2) - distance;
    } else {
        overlap = (obj1.type.collisionRadius + obj2.type.collisionRadius) - distance;
    }

    if (overlap > 0) {
        const angle = Math.atan2(dy, dx);
        const moveX = overlap * Math.cos(angle) / 2;
        const moveY = overlap * Math.sin(angle) / 2;

        obj1.x -= moveX * 1.001;
        obj1.y -= moveY * 1.001;
        obj2.x += moveX * 1.001;
        obj2.y += moveY * 1.001;

        const v1 = Math.sqrt(obj1.velocity.x ** 2 + obj1.velocity.y ** 2);
        const v2 = Math.sqrt(obj2.velocity.x ** 2 + obj2.velocity.y ** 2);
        const direction1 = Math.atan2(obj1.velocity.y, obj1.velocity.x);
        const direction2 = Math.atan2(obj2.velocity.y, obj2.velocity.x);

        const newVx1 = v1 * Math.cos(direction1 - angle);
        const newVy1 = v1 * Math.sin(direction1 - angle);
        const newVx2 = v2 * Math.cos(direction2 - angle);
        const newVy2 = v2 * Math.sin(direction2 - angle);

        obj1.velocity.x = (newVx1 * (obj1.type.size - obj2.type.size) + 2 * obj2.type.size * newVx2) / (obj1.type.size + obj2.type.size) * Math.cos(angle) + newVy1 * Math.cos(angle + Math.PI/2);
        obj1.velocity.y = (newVx1 * (obj1.type.size - obj2.type.size) + 2 * obj2.type.size * newVx2) / (obj1.type.size + obj2.type.size) * Math.sin(angle) + newVy1 * Math.sin(angle + Math.PI/2);
        obj2.velocity.x = (newVx2 * (obj2.type.size - obj1.type.size) + 2 * obj1.type.size * newVx1) / (obj1.type.size + obj2.type.size) * Math.cos(angle) + newVy2 * Math.cos(angle + Math.PI/2);
        obj2.velocity.y = (newVx2 * (obj2.type.size - obj1.type.size) + 2 * obj1.type.size * newVx1) / (obj1.type.size + obj2.type.size) * Math.sin(angle) + newVy2 * Math.sin(angle + Math.PI/2);

        obj1.velocity.x *= 0.98;
        obj1.velocity.y *= 0.98;
        obj2.velocity.x *= 0.98;
        obj2.velocity.y *= 0.98;
    }
}

function mergeObjects(index1, index2) {
    const obj1 = fallingObjects[index1];
    const obj2 = fallingObjects[index2];
    const currentIndex = allGameObjects.findIndex(obj => obj.name === obj1.type.name);
    const newIndex = currentIndex + 1;
    
    if (newIndex < allGameObjects.length) {
        const newObj = {
            type: allGameObjects[newIndex],
            x: (obj1.x + obj2.x) / 2,
            y: (obj1.y + obj2.y) / 2,
            rotation: 0,
            velocity: { 
                x: (obj1.velocity.x + obj2.velocity.x) / 2 * 0.8, 
                y: Math.min(obj1.velocity.y, obj2.velocity.y) * 0.9 
            },
            acceleration: { x: 0, y: 980 }
        };
        
        fallingObjects.splice(Math.max(index1, index2), 1);
        fallingObjects.splice(Math.min(index1, index2), 1);
        fallingObjects.push(newObj);
        
        playSE('merge');
        
        score += (newIndex + 1) * 10;
        updateScore();
        checkUnlocks();
        
        if (newObj.type.name === 'はーと') {
            unlockHeartReward();
            fallingObjects = fallingObjects.filter(obj => obj.type.name === 'はーと');
            activateSpecialEffect();
        }
    }
}

function applyPositionConstraints() {
    const iterations = 3; // 反復回数を減らす
    const relaxation = 0.5; // 緩和係数を小さくする

    for (let iter = 0; iter < iterations; iter++) {
        for (let i = 0; i < fallingObjects.length; i++) {
            for (let j = i + 1; j < fallingObjects.length; j++) {
                const obj1 = fallingObjects[i];
                const obj2 = fallingObjects[j];
                
                const dx = obj2.x - obj1.x;
                const dy = obj2.y - obj1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = (obj1.type.collisionRadius + obj2.type.collisionRadius) * 0.95; // 少し重なりを許容
                
                if (distance < minDistance) {
                    const correction = (minDistance - distance) / distance * relaxation;
                    const correctionX = dx * correction / 2;
                    const correctionY = dy * correction / 2;
                    
                    obj1.x -= correctionX;
                    obj1.y -= correctionY;
                    obj2.x += correctionX;
                    obj2.y += correctionY;
                }
            }
        }
    }
}

function renderObjects() {
    const gamePlayArea = document.getElementById('game-play-area');
    gamePlayArea.innerHTML = '';
    createGameOverLine();
    fallingObjects.forEach((obj, index) => {
        console.log('Rendering object:', obj);
        const element = createGameObjectElement(`object-${index}`);
        updateObjectElement(element, obj);
        if (obj.type.isBomb) {
            console.log('Adding bomb click listener');
            element.style.cursor = 'pointer';
            element.addEventListener('click', () => handleBombClick(index));
        }
        gamePlayArea.appendChild(element);
    });
    updateNextObjectPosition();
}

function activateSpecialEffect() {
    alert('特別効果が発動しました！');
    score += 1000;
    updateScore();
}

function checkGameOver() {
    if (fallingObjects.some(obj => obj.y - obj.type.size / 2 < GAME_OVER_LINE && Math.abs(obj.velocity.y) < 0.1)) {
        isGameOver = true;
        manageBGM('gameOver');
        updateHighScores(score);
        alert(`ゲームオーバー\nスコア: ${score}`);
        showTitleScreen();
    }
}

function updateScore() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = `Score: ${score}`;
    }
}

function updateHighScores(newScore) {
    highScores.push(newScore);
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, 10);
    saveGame(); // ハイスコアを更新したら保存する
}

function useSkill() {
    if (skillUses > 0 && !isGameOver) {
        playSE('skill');
        
        const gameState = {
            fallingObjects: fallingObjects,
            nextObject: nextObject,
            nextNextObject: nextNextObject,
            score: score,
            bombs: bombs,
            shimSkillTurns: shimSkillTurns,
            marikoSkillTurns: marikoSkillTurns
        };

        const updatedState = currentCharacter.skill.effect(gameState);

        fallingObjects = updatedState.fallingObjects;
        nextObject = updatedState.nextObject;
        nextNextObject = updatedState.nextNextObject;
        score = updatedState.score;
        bombs = updatedState.bombs;
        shimSkillTurns = updatedState.shimSkillTurns;
        marikoSkillTurns = updatedState.marikoSkillTurns;

        skillUses--;
        updateSkillButton();

        updateScore();
        renderObjects();
    }
}

function updateSkillButton() {
    const skillButton = document.getElementById('skill-button');
    const skillUseCount = document.getElementById('skill-use-count');
    
    if (skillUses === 0) {
        skillButton.style.filter = 'grayscale(100%)';
        skillButton.style.cursor = 'default';
    }
    
    skillUseCount.textContent = skillUses;
}

function createBomb(x, y) {
    return {
        type: { name: 'ボム', size: 100 },
        x: x,
        y: y,
        rotation: 0,
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 980 }
    };
}

function explodeBomb(bomb) {
    const explosionRadius = 150; // 爆発の半径
    fallingObjects = fallingObjects.filter(obj => {
        const distance = Math.sqrt((obj.x - bomb.x) ** 2 + (obj.y - bomb.y) ** 2);
        return distance > explosionRadius;
    });
    bombs = bombs.filter(b => b !== bomb);
    score += 100; // ボム爆発でボーナススコア
    updateScore();
    renderObjects();
}

function checkUnlocks() {
    playableCharacters.forEach((char, index) => {
        if (!char.unlocked && score >= char.characterUnlockScore) {
            char.unlocked = true;
            displayUnlockMessage('New Character!');
        }
    });

    globalStory.forEach((chapter, index) => {
        if (!chapter.unlocked && score >= chapter.unlockScore) {
            chapter.unlocked = true;
            displayUnlockMessage('New Story!');
        }
    });
}

function displayUnlockMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'unlock-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    playSE('unlock'); // 新しい解除音を追加する場合

    setTimeout(() => {
        notification.remove();
    }, 3000);
}
function showHighScores() {
    manageBGM('title');
    gameArea.innerHTML = '';
    const highScoreScreen = document.createElement('div');
    highScoreScreen.id = 'high-score-screen';
    
    // 背景画像の設定
    highScoreScreen.style.backgroundImage = 'url("assets/images/highscore_background.jpg")';
    highScoreScreen.style.backgroundSize = 'cover';
    highScoreScreen.style.backgroundPosition = 'center';

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'content-wrapper';

    const title = document.createElement('h2');
    title.textContent = 'ハイスコア';
    contentWrapper.appendChild(title);

    const scoreList = document.createElement('ol');
    scoreList.className = 'score-list';
    highScores.forEach(score => {
        const listItem = document.createElement('li');
        listItem.textContent = score;
        scoreList.appendChild(listItem);
    });
    contentWrapper.appendChild(scoreList);

    const backButton = document.createElement('button');
    backButton.textContent = '戻る';
    backButton.addEventListener('click', showTitleScreen);
    contentWrapper.appendChild(backButton);

    highScoreScreen.appendChild(contentWrapper);
    gameArea.appendChild(highScoreScreen);
}

function showStory() {
    manageBGM('title');
    gameArea.innerHTML = '';
    const storyScreen = document.createElement('div');
    storyScreen.id = 'story-screen';

    const title = document.createElement('h2');
    title.textContent = 'ストーリー';
    storyScreen.appendChild(title);

    const storyContent = document.createElement('div');
    storyContent.id = 'story-content';

    globalStory.forEach((chapter, index) => {
        if (chapter.unlocked) {
            const chapterSection = createChapterSection(chapter);
            storyContent.appendChild(chapterSection);
        } else {
            const lockedChapter = document.createElement('div');
            lockedChapter.className = 'locked-chapter';
            lockedChapter.textContent = `スコア${chapter.unlockScore}でアンロック`;
            storyContent.appendChild(lockedChapter);
        }
    });

    storyScreen.appendChild(storyContent);

    const backButton = document.createElement('button');
    backButton.textContent = '戻る';
    backButton.addEventListener('click', showTitleScreen);
    storyScreen.appendChild(backButton);

    gameArea.appendChild(storyScreen);
}

function createChapterSection(chapter) {
    const chapterSection = document.createElement('div');
    chapterSection.className = 'story-chapter';

    const backgroundContainer = document.createElement('div');
    backgroundContainer.className = 'background-container';

    if (chapter.images && chapter.images.length > 0) {
        backgroundContainer.style.backgroundImage = `url('${chapter.images[0]}')`;
    }

    const contentOverlay = document.createElement('div');
    contentOverlay.className = 'content-overlay';

    const chapterTitle = document.createElement('h3');
    chapterTitle.textContent = chapter.title;
    contentOverlay.appendChild(chapterTitle);

    const storyContent = document.createElement('p');
    storyContent.textContent = chapter.content;
    contentOverlay.appendChild(storyContent);

    backgroundContainer.appendChild(contentOverlay);
    chapterSection.appendChild(backgroundContainer);

    if (chapter.images && chapter.images.length > 1) {
        const navigationButtons = createNavigationButtons(chapter.images, backgroundContainer);
        chapterSection.appendChild(navigationButtons);
    }

    return chapterSection;
}
// 既存の関数の後に、この新しい関数を追加します

function showGallery() {
    gameArea.innerHTML = '';
    const galleryScreen = document.createElement('div');
    galleryScreen.id = 'gallery-screen';

    const title = document.createElement('h2');
    title.textContent = 'ギャラリー';
    galleryScreen.appendChild(title);

    const imageContainer = document.createElement('div');
    imageContainer.id = 'gallery-image-container';

    galleryImages.forEach(image => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'gallery-thumbnail';
        if (image.unlocked) {
            thumbnail.style.backgroundImage = `url(${image.src})`;
            thumbnail.addEventListener('click', () => showFullSizeImage(image.src));
        } else {
            thumbnail.style.backgroundColor = '#ccc';
            thumbnail.textContent = '?';
        }
        imageContainer.appendChild(thumbnail);
    });

    galleryScreen.appendChild(imageContainer);

    const backButton = document.createElement('button');
    backButton.textContent = 'タイトルに戻る';
    backButton.addEventListener('click', showTitleScreen);
    galleryScreen.appendChild(backButton);

    gameArea.appendChild(galleryScreen);
}

// フルサイズ画像を表示する関数
function showFullSizeImage(src) {
    const fullSizeContainer = document.createElement('div');
    fullSizeContainer.id = 'full-size-image-container';
    fullSizeContainer.addEventListener('click', () => {
        fullSizeContainer.remove();
    });

    const image = document.createElement('img');
    image.src = src;
    image.alt = 'ご褒美画像';
    fullSizeContainer.appendChild(image);

    gameArea.appendChild(fullSizeContainer);
}

// はーとの生成時に呼び出す関数
function unlockHeartReward() {
    const lockedImages = galleryImages.filter(img => !img.unlocked);
    if (lockedImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * lockedImages.length);
        const unlockedImage = lockedImages[randomIndex];
        unlockedImage.unlocked = true;
        unlockedImages.push(unlockedImage);
        showNotification('New Image!');
        saveGame();
    }
}

// 報酬解放の通知を表示する関数
function showRewardNotification(src) {
    const notification = document.createElement('div');
    notification.id = 'reward-notification';
    notification.innerHTML = `
        <p>新しい画像が解放されました！</p>
        <img src="${src}" alt="解放された画像" />
    `;
    gameArea.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function createNavigationButtons(images, backgroundContainer) {
    const navigationContainer = document.createElement('div');
    navigationContainer.className = 'navigation-buttons';

    let currentIndex = 0;

    const prevButton = document.createElement('button');
    prevButton.textContent = '前へ';
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        backgroundContainer.style.backgroundImage = `url('${images[currentIndex]}')`;
    });

    const nextButton = document.createElement('button');
    nextButton.textContent = '次へ';
    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        backgroundContainer.style.backgroundImage = `url('${images[currentIndex]}')`;
    });

    navigationContainer.appendChild(prevButton);
    navigationContainer.appendChild(nextButton);

    return navigationContainer;
}

// この関数は createChapterSection 関数内で使用されます
function createSlideshow(images) {
    const slideshow = document.createElement('div');
    slideshow.className = 'slideshow';

    const imgElement = document.createElement('img');
    imgElement.src = images[0];
    imgElement.alt = "ストーリー画像";
    slideshow.appendChild(imgElement);

    if (images.length > 1) {
        let currentIndex = 0;
        const prevButton = document.createElement('button');
        prevButton.textContent = '前へ';
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            imgElement.src = images[currentIndex];
        });

        const nextButton = document.createElement('button');
        nextButton.textContent = '次へ';
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            imgElement.src = images[currentIndex];
        });

        slideshow.appendChild(prevButton);
        slideshow.appendChild(nextButton);
    }

    return slideshow;
}

function showGameInstructions() {
    manageBGM('title');
    gameArea.innerHTML = '';
    const instructionsScreen = document.createElement('div');
    instructionsScreen.id = 'instructions-screen';
    
    instructionsScreen.style.backgroundImage = 'url("assets/images/instructions_background.jpg")';
    instructionsScreen.style.backgroundSize = 'cover';
    instructionsScreen.style.backgroundPosition = 'center';

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'content-wrapper';

    const title = document.createElement('h2');
    title.textContent = 'ゲーム説明';
    contentWrapper.appendChild(title);

    const instructions = `
        「XANA/クロスオーバーパズル」へようこそ！
        ここは仮想の世界、XANAメタバース。様々な不思議な出会いと冒険があなたを待っています。

        【ゲームの目的】
        XANAの世界で様々なオブジェクトを合体させ、高得点を目指しながら、謎に満ちた物語を解き明かしていきます。

        【基本的な遊び方】
        1. 画面上部から落ちてくるオブジェクトを操作します。
        2. オブジェクトを左右に移動させ、タップorクリックで落下させます。
        3. 同じ種類のオブジェクト同士が接触すると、より大きな新しいオブジェクトに進化します。
        4. オブジェクトを進化させるほど高いスコアを獲得できます。

        【ゲームオーバー】
        積み上がったオブジェクトが画面上部の赤いラインに到達するとゲームオーバーです。
        ゲームオーバー後は、獲得したスコアに応じて様々な要素がアンロックされます。

        【キャラクター】
        - ゲームを進めると、個性豊かな新しいキャラクターがアンロックされます。
        - 各キャラクターには固有のスキルがあり、1ゲームにつき2回、もしくは1回使用できます。
        - キャラクターのスキルを戦略的に使用することで、より高いスコアを狙えます。

        【ストーリー】
        - スコアを獲得すると、新しいストーリーチャプターが解放されます。
        - ストーリー画面では、XANAの世界観や登場人物たちの物語を楽しむことができます。

        【ギャラリー】
        - ゲーム中に特定の条件を満たすと、特別な報酬画像がアンロックされます。
        - アンロックされた画像はギャラリーで鑑賞することができます。
        - すべての画像を集めると、XANAの世界についての新たな発見があるかも（ないかも）しれません。

        【セーブ＆ロード】
        - ゲームの進行状況は自動的に保存されます。
        - セーブ＆ロード画面では、現在の進行状況をコードとして出力できます。
        - このコードを使用することで、別のデバイスでも同じ進行状況からゲームを再開できます。
        - 大切な進行状況は、こまめにコードを保存しておくことをおすすめします。

        【ヒント】
        - キャラクターのスキルを効果的に使うことで、より高いスコアを狙えます。
        - ストーリーを進めることで、ゲームの世界観がより深く理解できるでしょう。
        - ギャラリーのコンプリートを目指すことで、より多くのやりこみ要素を楽しめます。

        さあ、XANAの不思議な世界で、パズルとストーリーを楽しみましょう！
        あなたの冒険が、今始まります。
    `;

    const instructionsText = document.createElement('p');
    instructionsText.innerHTML = instructions.replace(/\n/g, '<br>');
    contentWrapper.appendChild(instructionsText);

    const backButton = document.createElement('button');
    backButton.textContent = '戻る';
    backButton.addEventListener('click', showTitleScreen);
    contentWrapper.appendChild(backButton);

    instructionsScreen.appendChild(contentWrapper);
    gameArea.appendChild(instructionsScreen);
}


function showSaveLoadScreen() {
    console.log('Showing save/load screen');
    gameArea.innerHTML = '';
    const saveLoadScreen = document.createElement('div');
    saveLoadScreen.id = 'save-load-screen';
  
    const title = document.createElement('h2');
    title.textContent = 'セーブ＆ロード';
    saveLoadScreen.appendChild(title);
  
    const saveButton = document.createElement('button');
    saveButton.textContent = 'セーブ';
    saveButton.addEventListener('click', () => {
      console.log('Save button clicked');
      const saveCode = saveGame();
      if (saveCode) {
        displaySaveCode(saveCode, saveLoadScreen);
      } else {
        console.error('Failed to generate save code');
        alert('セーブコードの生成に失敗しました。');
      }
    });
    saveLoadScreen.appendChild(saveButton);
  
    const loadButton = document.createElement('button');
    loadButton.textContent = 'ロード';
    loadButton.addEventListener('click', () => {
      console.log('Load button clicked');
      showLoadInput(saveLoadScreen);
    });
    saveLoadScreen.appendChild(loadButton);
  
    const backButton = document.createElement('button');
    backButton.textContent = '戻る';
    backButton.addEventListener('click', () => {
      console.log('Back button clicked');
      showTitleScreen();
    });
    saveLoadScreen.appendChild(backButton);
  
    gameArea.appendChild(saveLoadScreen);
}

function saveGame() {
    console.log('Saving game...');
    const gameState = {
        score: score,
        highScores: highScores,
        unlockedCharacters: playableCharacters.filter(char => char.unlocked).map(char => char.name),
        unlockedStoryChapters: globalStory.filter(chapter => chapter.unlocked).map(chapter => chapter.title),
        unlockedImages: galleryImages.filter(img => img.unlocked).map(img => img.id)
    };
    console.log('Game state to be saved:', gameState);
    return generateSaveCode(gameState);
}

function generateSaveCode(gameState) {
    console.log('Generating save code for game state:', gameState);
    const stateString = JSON.stringify(gameState);
    const encodedState = utf8_to_b64(stateString);
    const randomChars = generateRandomChars(10);
    const saveCode = randomChars.slice(0, 5) + encodedState + randomChars.slice(5);
    console.log('Generated save code:', saveCode);
    return saveCode;
}

function generateRandomChars(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

function utf8_to_b64(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
      return String.fromCharCode('0x' + p1);
    }));
}
  
function b64_to_utf8(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function displaySaveCode(saveCode, parentElement) {
    console.log('Displaying save code:', saveCode);
    const existingSaveCodeDisplay = document.getElementById('save-code-display');
    if (existingSaveCodeDisplay) {
      existingSaveCodeDisplay.remove();
    }
  
    const saveCodeDisplay = document.createElement('div');
    saveCodeDisplay.id = 'save-code-display';
  
    const saveCodeText = document.createElement('p');
    saveCodeText.textContent = `あなたのセーブコード: ${saveCode}`;
    saveCodeDisplay.appendChild(saveCodeText);
  
    const copyButton = document.createElement('button');
    copyButton.textContent = 'コピー';
    copyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(saveCode).then(() => {
        console.log('Save code copied to clipboard');
        alert('セーブコードがクリップボードにコピーされました。');
      }).catch(err => {
        console.error('Failed to copy save code:', err);
        alert('セーブコードのコピーに失敗しました。');
      });
    });
    saveCodeDisplay.appendChild(copyButton);
  
    parentElement.appendChild(saveCodeDisplay);
}

function showLoadInput(parentElement) {
    console.log('Showing load input');
    const existingLoadInput = document.getElementById('load-input');
    if (existingLoadInput) {
        existingLoadInput.remove();
    }

    const loadInput = document.createElement('div');
    loadInput.id = 'load-input-container';

    const label = document.createElement('label');
    label.htmlFor = 'load-input-field';
    label.textContent = 'セーブコードを入力:';
    loadInput.appendChild(label);

    const input = document.createElement('input');
    input.id = 'load-input-field';
    input.type = 'text';
    input.name = 'loadCode';
    loadInput.appendChild(input);

    const loadButton = document.createElement('button');
    loadButton.textContent = 'ロード';
    loadButton.addEventListener('click', () => {
        console.log('Load button clicked with input:', input.value);
        handleLoad(input.value);
    });
    loadInput.appendChild(loadButton);

    parentElement.appendChild(loadInput);
}

function handleLoad(saveCode) {
    console.log('Handling load with save code:', saveCode);
    const gameState = loadFromSaveCode(saveCode);
    if (gameState) {
        score = gameState.score;
        highScores = gameState.highScores || [];
        playableCharacters.forEach(char => {
            char.unlocked = gameState.unlockedCharacters.includes(char.name);
        });
        globalStory.forEach(chapter => {
            chapter.unlocked = gameState.unlockedStoryChapters.includes(chapter.title);
        });
        galleryImages.forEach(img => {
            img.unlocked = gameState.unlockedImages.includes(img.id);
        });
        unlockedImages = galleryImages.filter(img => img.unlocked);
        updateScore();
        showNotification('Load Successful!');
        showTitleScreen();
    } else {
        console.log('Invalid save code');
        alert('無効なセーブコードです。もう一度お試しください。');
    }
}


function loadFromSaveCode(saveCode) {
    console.log('Loading from save code:', saveCode);
    try {
      const encodedState = saveCode.slice(5, -5);
      const stateString = b64_to_utf8(encodedState);
      const gameState = JSON.parse(stateString);
      console.log('Loaded game state:', gameState);
      return gameState;
    } catch (error) {
      console.error('Invalid save code:', error);
      return null;
    }
}

// ゲーム初期化
window.onload = () => {
    initGame();
};

// 画面サイズ変更時の処理
window.addEventListener('resize', () => {
    if (gameArea) {
        resizeGame();
    }
});

// タッチデバイス対応
document.addEventListener('DOMContentLoaded', () => {
    if (gameArea) {
        gameArea.addEventListener('touchmove', (event) => {
            event.preventDefault();
            const touch = event.touches[0];
            moveNextObject({ clientX: touch.clientX, clientY: touch.clientY });
        }, { passive: false });

        gameArea.addEventListener('touchend', dropObject);
    }
});

        gameArea.addEventListener('touchend', dropObject);
    }
});
