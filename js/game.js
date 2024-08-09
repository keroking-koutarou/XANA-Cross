// Game objects
const gameObjects = [
    { name: 'きのこ', size: 80 },
    { name: 'ねずみ', size: 100 },
    { name: 'ひよこ', size: 120 },
    { name: 'にわとり', size: 150 }
];

const allGameObjects = [
    { name: 'きのこ', size: 80 },
    { name: 'ねずみ', size: 100 },
    { name: 'ひよこ', size: 120 },
    { name: 'にわとり', size: 150 },
    { name: 'ぺんぎん', size: 200 },
    { name: 'あざらし', size: 210 },
    { name: 'くま', size: 240 },
    { name: 'ぱんだ', size: 270 },
    { name: 'かえる', size: 300 },
    { name: 'はーと', size: 330 }
];

// Playable characters with skills
const playableCharacters = [
    {
        name: 'へいへい',
        unlocked: true,
        storyUnlockScore:0,
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
            name: 'きのこ一掃',
            description: '場に出ているきのこのオブジェクトをすべて消去する',
            effect: (gameState) => {
                gameState.fallingObjects = gameState.fallingObjects.filter(obj => obj.type.name !== 'きのこ');
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
            name: 'ひよこ一掃',
            description: '場に出ているひよこのオブジェクトをすべて消去する',
            effect: (gameState) => {
                gameState.fallingObjects = gameState.fallingObjects.filter(obj => obj.type.name !== 'ひよこ');
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
            name: 'ボム設置',
            description: 'ランダムに場に出ている一つのオブジェクトをボムに変化させる',
            effect: (gameState) => {
                if (gameState.fallingObjects.length > 0) {
                    const randomIndex = Math.floor(Math.random() * gameState.fallingObjects.length);
                    const selectedObject = gameState.fallingObjects[randomIndex];
                    gameState.bombs.push(createBomb(selectedObject.x, selectedObject.y));
                    gameState.fallingObjects.splice(randomIndex, 1);
                }
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
            name: 'あざらしラッシュ',
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
            name: 'オールクリア',
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
            name: 'トリプルボム',
            description: 'ランダムに場に出ている三つのオブジェクトをボムに変化させる',
            effect: (gameState) => {
                for (let i = 0; i < 3; i++) {
                    if (gameState.fallingObjects.length > 0) {
                        const randomIndex = Math.floor(Math.random() * gameState.fallingObjects.length);
                        const selectedObject = gameState.fallingObjects[randomIndex];
                        gameState.bombs.push(createBomb(selectedObject.x, selectedObject.y));
                        gameState.fallingObjects.splice(randomIndex, 1);
                    }
                }
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
            name: 'かえるラッシュ',
            description: '次の2ターン連続でかえるのオブジェクトが落下する',
            effect: (gameState) => {
                gameState.marikoSkillTurns = 2;
                return gameState;
            }
        }
    }
];
const globalStory = [
    {
        title: "プロローグ: XANAへの招待",
        unlockScore: 0,
        content: `喧騒に満ちた都会の一室。あなたは、いつもと変わらない日常に飽き飽きしていた。「もっと刺激的な何かがあるはずだ」そう思いながら、無意識のうちにスマートフォンを手に取る。

突然、画面が青白く光り、見知らぬメッセージが浮かび上がった。

「XANAへようこそ。あなたは選ばれし者です。」

戸惑いながらもその言葉に目を凝らしていると、部屋の空気が変わり始めた。壁や天井が歪み、まるで現実が溶けていくかのような錯覚に襲われる。パニックに陥りそうになったその時、スマートフォンから柔らかな声が響いた。

「恐れることはありません。あなたの冒険が、今始まろうとしているのです。」

その声に導かれるように、あなたは震える手でスクリーンに触れた。すると、目の前に青い光の渦が現れ、あなたの体は宙に浮いたような感覚に包まれた。一瞬の目眩と、心地よい浮遊感。そして――

目を開けると、そこは見たこともない幻想的な風景だった。空には無数の浮遊する島々、地上には未来的な建造物が立ち並ぶ。色とりどりの光が交錯し、まるで夢の中にいるかのような感覚に陥る。あなたの目の前には「GENESIS学園」と書かれた巨大な門が聳え立っていた。

「やあ、ようこそXANAメタバースへ！」

明るい声に振り返ると、にこやかな表情の少年が立っていた。彼は親しげに手を差し出してくる。

「僕の名前はへいへい。君も新入生なんだよね？一緒に頑張ろう！」

戸惑いながらも、あなたは彼の手を取った。温かみのある確かな感触に、これが現実であることを実感する。

「ねえ、XANAのことはどれくらい知ってるの？」へいへいは興味深そうにあなたを見つめる。「ここでは、想像力が現実になるんだ。でも、時々予想外のことも起きちゃうんだよね。」

彼の言葉に首を傾げていると、突然空から虹色の雨が降り出した。驚いて空を見上げると、雨粒が地面に落ちる前に小さな花に変わっていく。

「ほら、こんな風に。面白いでしょ？」へいへいは楽しそうに笑う。「さあ、これから君の冒険が始まるよ。GENESIS学園で、きっと素晴らしい仲間たちに出会えるはずだ。」

彼の言葉に、あなたの中に小さな期待が芽生え始める。この不思議な世界で、一体どんな冒険が待っているのだろうか。未知への不安と、新しい世界への好奇心が入り混じる。

へいへいに導かれ、あなたはGENESIS学園の門をくぐる。広大なキャンパスには、様々な姿かたちの生徒たちが行き交っていた。人間らしからぬ姿の者もいれば、まるで異世界から来たかのような風貌の者もいる。

「あ、あれを見て！」へいへいが指さす先には、空中を優雅に泳ぐように移動する生徒の姿があった。「XANAでは、君の想像力次第で何でもできるんだ。でも、そのぶん責任も大きくなるよ。」

その言葉に、あなたは身が引き締まる思いがした。この世界で、自分は何を成し遂げられるのだろうか。そして、どんな物語を紡いでいくのだろうか。

「さあ、オリエンテーションの時間だ。」へいへいがあなたの背中を軽く押す。「君のXANAでの新生活が、今始まろうとしているんだ。」

深呼吸をして、あなたは一歩を踏み出した。この瞬間から、予想もつかない冒険が始まろうとしていた。XANAの世界で、あなたはどんな物語を紡ぐのだろうか。その答えを見つけるため、あなたの旅が今、幕を開ける。`,
        images: [
            "assets/images/prologue_1.PNG",
            "assets/images/prologue_2.PNG",
            "assets/images/prologue_3.PNG"
        ]
    },
    // 他のチャプターも同様に追加...
];

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
let volumeControl;
let skillUses = 2;
let shimSkillTurns = 0;
let marikoSkillTurns = 0;
let bombs = [];

// Game initialization
function initGame() {
    gameContainer = document.getElementById('game-container');
    gameArea = document.getElementById('game-area');
    if (!gameArea || !gameContainer) {
        console.error('Game elements not found!');
        return;
    }
    
    resizeGame();
    addVolumeControl();
    addEventListeners();
    showTitleScreen();
}

function resizeGame() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const gameRatio = 600 / 800;
    const windowRatio = windowWidth / windowHeight;

    if (windowRatio > gameRatio) {
        gameContainer.style.height = '100vh';
        gameContainer.style.width = `${windowHeight * gameRatio}px`;
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
    volumeControl = document.createElement('input');
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
    gameContainer.appendChild(volumeControl);
}

function manageBGM(bgmKey) {
    if (currentBGM) {
        currentBGM.pause();
        currentBGM.currentTime = 0;
    }
    currentBGM = new Audio(BGM[bgmKey] || bgmKey);
    currentBGM.loop = true;
    currentBGM.volume = volumeControl.value;
    currentBGM.play();
}

// Title screen
function showTitleScreen() {
    manageBGM('title');
    gameArea.innerHTML = '';
    const titleScreen = document.createElement('div');
    titleScreen.id = 'title-screen';
    titleScreen.style.backgroundImage = 'url("assets/images/タイトル.PNG")';

    const title = document.createElement('h1');
    title.textContent = 'XANA/クロスオーバーパズル';
    title.className = 'fade-in';
    titleScreen.appendChild(title);

    const menuContainer = document.createElement('div');
    menuContainer.id = 'menu-container';

    const menuItems = [
        { text: 'ゲームスタート', action: showCharacterSelectScreen },
        { text: 'ハイスコア', action: showHighScores },
        { text: 'ストーリー', action: showStory },
        { text: 'ゲーム説明', action: showGameInstructions }
    ];

    menuItems.forEach((item, index) => {
        const button = document.createElement('button');
        button.textContent = item.text;
        button.addEventListener('click', item.action);
        button.style.animation = `fadeIn 0.5s ease-in-out ${index * 0.1}s forwards`;
        button.style.opacity = '0';
        menuContainer.appendChild(button);
    });

    titleScreen.appendChild(menuContainer);
    gameArea.appendChild(titleScreen);
}

// Character selection screen

function showCharacterSelectScreen() {
    manageBGM('characterSelect');
    gameArea.innerHTML = '';
    const selectScreen = document.createElement('div');
    selectScreen.id = 'character-select-screen';

    const title = document.createElement('h2');
    title.textContent = 'キャラクター選択';
    title.className = 'fade-in';
    selectScreen.appendChild(title);

    const characterContainer = document.createElement('div');
    characterContainer.id = 'character-buttons';

    const characterInfo = document.createElement('div');
    characterInfo.id = 'character-info';

    playableCharacters.forEach((char, index) => {
        const charButton = document.createElement('button');
        charButton.textContent = char.unlocked ? char.name : '???';
        charButton.disabled = !char.unlocked;
        charButton.addEventListener('click', () => startGameWithCharacter(char));
        charButton.style.animation = `fadeIn 0.5s ease-in-out ${index * 0.1}s forwards`;
        charButton.style.opacity = '0';

        charButton.addEventListener('mouseover', () => {
            if (char.unlocked) {
                selectScreen.style.backgroundImage = `url('${char.backgroundImage}')`;
                characterInfo.innerHTML = `
                    <h3>${char.name}</h3>
                    <p>${char.description}</p>
                    <h4>スキル: ${char.skill.name}</h4>
                    <p>${char.skill.description}</p>
                `;
            } else {
                characterInfo.innerHTML = '<p>このキャラクターはまだアンロックされていません。</p>';
            }
            characterInfo.classList.add('visible');
        });

        charButton.addEventListener('mouseout', () => {
            selectScreen.style.backgroundImage = '';
            characterInfo.classList.remove('visible');
        });

        characterContainer.appendChild(charButton);
    });

    selectScreen.appendChild(characterContainer);
    selectScreen.appendChild(characterInfo);

    const backButton = document.createElement('button');
    backButton.textContent = '戻る';
    backButton.addEventListener('click', showTitleScreen);
    backButton.className = 'fade-in';
    selectScreen.appendChild(backButton);

    gameArea.appendChild(selectScreen);
}

// Game start
function startGameWithCharacter(character) {
    currentCharacter = character;
    skillUses = character.name === 'RIO' ? 1 : 2;
    shimSkillTurns = 0;
    marikoSkillTurns = 0;
    bombs = [];
    gameArea.innerHTML = '';
    
    const scoreContainer = document.createElement('div');
    scoreContainer.id = 'score-container';
    
    const scoreElement = document.createElement('div');
    scoreElement.id = 'score';
    scoreElement.textContent = 'Score: 0';
    scoreContainer.appendChild(scoreElement);

    const skillButton = document.createElement('button');
    skillButton.id = 'skill-button';
    skillButton.textContent = `スキル: ${skillUses}`;
    skillButton.addEventListener('click', useSkill);
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
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
    resetGame();
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
    updateScore();
    createGameOverLine();
}

function createGameOverLine() {
    const gamePlayArea = document.getElementById('game-play-area');
    const line = document.createElement('div');
    line.id = 'game-over-line';
    line.style.top = `${GAME_OVER_LINE}px`;
    
    const lineLabel = document.createElement('div');
    lineLabel.textContent = 'ゲームオーバーライン';
    line.appendChild(lineLabel);
    
    gamePlayArea.appendChild(line);
}

function createRandomObject() {
    let randomIndex;
    if (shimSkillTurns > 0) {
        randomIndex = allGameObjects.findIndex(obj => obj.name === 'あざらし');
        shimSkillTurns--;
    } else if (marikoSkillTurns > 0) {
        randomIndex = allGameObjects.findIndex(obj => obj.name === 'かえる');
        marikoSkillTurns--;
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
    if (isGameOver) return;
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

function updateObjectElement(element, obj) {
    element.style.width = `${obj.type.size}px`;
    element.style.height = `${obj.type.size}px`;
    element.style.left = `${obj.x - obj.type.size / 2}px`;
    element.style.top = `${obj.y - obj.type.size / 2}px`;
    element.style.transform = `rotate(${obj.rotation}deg)`;
    element.style.backgroundImage = `url('assets/images/${obj.type.name}.PNG')`;
    element.style.backgroundSize = '98% 98%';
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
    if (isGameOver) return;
    const droppedObject = { ...nextObject, y: nextObject.type.size / 2 };
    fallingObjects.push(droppedObject);
    createNextObject();
}

function gameLoop(currentTime) {
    if (isGameOver) return;

    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    updatePhysics(deltaTime);
    checkCollisions();
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

        if (obj.x < obj.type.size / 2) {
            obj.x = obj.type.size / 2;
            obj.velocity.x *= -0.5;
        } else if (obj.x > gamePlayArea.offsetWidth - obj.type.size / 2) {
            obj.x = gamePlayArea.offsetWidth - obj.type.size / 2;
            obj.velocity.x *= -0.5;
        }

        if (obj.y > gamePlayArea.offsetHeight - obj.type.size / 2) {
            obj.y = gamePlayArea.offsetHeight - obj.type.size / 2;
            obj.velocity.y *= -0.5;
            obj.velocity.x *= 0.9;
        }

        obj.velocity.x *= 0.99;
        obj.velocity.y *= 0.99;

        if (Math.abs(obj.velocity.x) < 0.1) obj.velocity.x = 0;
        if (Math.abs(obj.velocity.y) < 0.1) obj.velocity.y = 0;

        obj.rotation += obj.velocity.x * 0.1;
    });
}

function checkCollisions() {
    for (let i = 0; i < fallingObjects.length; i++) {
        for (let j = i + 1; j < fallingObjects.length; j++) {
            if (isColliding(fallingObjects[i], fallingObjects[j])) {
                resolveCollision(fallingObjects[i], fallingObjects[j]);
                if (fallingObjects[i].type === fallingObjects[j].type) {
                    mergeObjects(i, j);
                    return;
                }
            }
        }
    }
}

function isColliding(obj1, obj2) {
    const distance = Math.sqrt((obj1.x - obj2.x) ** 2 + (obj1.y - obj2.y) ** 2);
    return distance < (obj1.type.size + obj2.type.size) / 2;
}

function resolveCollision(obj1, obj2) {
    const dx = obj2.x - obj1.x;
    const dy = obj2.y - obj1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const overlap = (obj1.type.size + obj2.type.size) / 2 - distance;

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
            velocity: { x: (obj1.velocity.x + obj2.velocity.x) / 2, y: (obj1.velocity.y + obj2.velocity.y) / 2 },
            acceleration: { x: 0, y: 980 }
        };
        
        fallingObjects.splice(Math.max(index1, index2), 1);
        fallingObjects.splice(Math.min(index1, index2), 1, newObj);
        
        score += (newIndex + 1) * 10;
        updateScore();
        checkUnlocks();
        
        if (newIndex === allGameObjects.length - 1) {
            activateSpecialEffect();
        }
    }
}

function renderObjects() {
    const gamePlayArea = document.getElementById('game-play-area');
    gamePlayArea.innerHTML = '';
    createGameOverLine();
    fallingObjects.forEach((obj, index) => {
        const element = createGameObjectElement(`object-${index}`);
        updateObjectElement(element, obj);
        gamePlayArea.appendChild(element);
    });
    bombs.forEach((bomb, index) => {
        const element = createGameObjectElement(`bomb-${index}`);
        updateObjectElement(element, bomb);
        element.style.backgroundImage = 'url("assets/images/bomb.PNG")';
        element.addEventListener('click', () => explodeBomb(bomb));
        gamePlayArea.appendChild(element);
    });
    updateNextObjectPosition();
}

function activateSpecialEffect() {
    alert('特別効果が発動しました！');
    fallingObjects = [];
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

function useSkill() {
    if (skillUses > 0 && !isGameOver) {
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
        document.getElementById('skill-button').textContent = `スキル: ${skillUses}`;

        if (skillUses === 0) {
            document.getElementById('skill-button').disabled = true;
        }

        updateScore();
        renderObjects();
    }
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
            displayUnlockMessage(`${char.name}がプレイ可能になりました！`);
        }
    });

    globalStory.forEach((chapter, index) => {
        if (!chapter.unlocked && score >= chapter.unlockScore) {
            chapter.unlocked = true;
            displayUnlockMessage(`新しいストーリーチャプターが解放されました！`);
        }
    });
}

function displayUnlockMessage(message) {
    alert(message);
}

function updateHighScores(newScore) {
    highScores.push(newScore);
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, 10);
}

function showHighScores() {
    manageBGM('title');
    gameArea.innerHTML = '';
    const highScoreScreen = document.createElement('div');
    highScoreScreen.id = 'high-score-screen';

    const title = document.createElement('h2');
    title.textContent = 'ハイスコア';
    highScoreScreen.appendChild(title);

    const scoreList = document.createElement('ol');
    highScores.forEach(score => {
        const listItem = document.createElement('li');
        listItem.textContent = score;
        scoreList.appendChild(listItem);
    });
    highScoreScreen.appendChild(scoreList);

    const backButton = document.createElement('button');
    backButton.textContent = '戻る';
    backButton.addEventListener('click', showTitleScreen);
    highScoreScreen.appendChild(backButton);

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

    globalStory.forEach((chapter, index) => {
        if (chapter.unlockScore <= score || index === 0) {
            const chapterSection = window.innerWidth > 768
                ? createChapterSectionHorizontal(chapter)
                : createChapterSectionVertical(chapter);
            storyScreen.appendChild(chapterSection);
        } else {
            const lockedChapter = document.createElement('div');
            lockedChapter.className = 'locked-chapter';
            lockedChapter.textContent = `スコア${chapter.unlockScore}でアンロック`;
            storyScreen.appendChild(lockedChapter);
        }
    });

    const backButton = document.createElement('button');
    backButton.textContent = '戻る';
    backButton.addEventListener('click', showTitleScreen);
    storyScreen.appendChild(backButton);

    gameArea.appendChild(storyScreen);
}

function createChapterSectionHorizontal(chapter) {
    const chapterSection = document.createElement('div');
    chapterSection.className = 'story-chapter horizontal-layout';
    
    const contentContainer = document.createElement('div');
    contentContainer.className = 'content-container';

    const chapterTitle = document.createElement('h3');
    chapterTitle.textContent = chapter.title;
    contentContainer.appendChild(chapterTitle);

    const storyContent = document.createElement('p');
    storyContent.textContent = chapter.content;
    contentContainer.appendChild(storyContent);

    chapterSection.appendChild(contentContainer);

    if (chapter.images && chapter.images.length > 0) {
        const slideshow = createSlideshow(chapter.images);
        chapterSection.appendChild(slideshow);
    }

    return chapterSection;
}

function createChapterSectionVertical(chapter) {
    const chapterSection = document.createElement('div');
    chapterSection.className = 'story-chapter vertical-layout';

    const chapterTitle = document.createElement('h3');
    chapterTitle.textContent = chapter.title;
    chapterSection.appendChild(chapterTitle);

    if (chapter.images && chapter.images.length > 0) {
        const slideshow = createSlideshow(chapter.images);
        chapterSection.appendChild(slideshow);
    }

    const storyContent = document.createElement('p');
    storyContent.textContent = chapter.content;
    chapterSection.appendChild(storyContent);

    return chapterSection;
}

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

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'content-wrapper';

    const title = document.createElement('h2');
    title.textContent = 'ゲーム説明';
    contentWrapper.appendChild(title);

    const instructions = `
        「XANA/クロスオーバーパズル」へようこそ！
        ここは仮想の世界、XANAメタバース。いろいろな出会いがあなたを待っています。

        遊び方：
        1. 画面上部から落ちてくるオブジェクトを操作し、同じ種類のオブジェクト同士を合体させましょう。
        2. オブジェクトは左右に移動でき、クリックすると落下します。
        3. 同じ種類のオブジェクトが接触すると、より大きな新しいオブジェクトに進化します。
        4. オブジェクトを進化させてスコアを獲得し、高得点を目指しましょう。

        ゲームオーバー：
        - 積み上がったオブジェクトが画面上部の赤いラインに到達するとゲームオーバーです。

        キャラクター：
        - ゲームを進めると、新しいキャラクターがアンロックされます。
        - 各キャラクターには固有のスキルがあり、1ゲームにつき2回使用できます。

        ストーリー：
        - スコアを獲得すると新しいストーリーチャプターが解放されます。
        - ストーリー画面でXANAの世界観を楽しみましょう。

        それでは、楽しんでプレイしてください！
    `;

    const instructionsText = document.createElement('p');
    instructionsText.innerHTML = instructions.replace(/\n/g, '<br>');
    contentWrapper.appendChild(instructionsText);

    instructionsScreen.appendChild(contentWrapper);

    const backButton = document.createElement('button');
    backButton.textContent = '戻る';
    backButton.addEventListener('click', showTitleScreen);
    instructionsScreen.appendChild(backButton);

    gameArea.appendChild(instructionsScreen);
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
gameArea.addEventListener('touchmove', (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    moveNextObject({ clientX: touch.clientX, clientY: touch.clientY });
}, { passive: false });

gameArea.addEventListener('touchend', dropObject);