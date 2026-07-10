const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d", { alpha: false });
const fullscreenButton = document.querySelector("#fullscreenButton");
ctx.imageSmoothingEnabled = false;

const W = canvas.width;
const H = canvas.height;
const WORLD = { w: 2560, h: 1440 };
const pageRoot = new URL(".", window.location.href);
const assetRootUrl = pageRoot.pathname.endsWith("/web/")
  ? new URL("../asset/", pageRoot)
  : new URL("asset/", pageRoot);
const ASSET_ROOT = assetRootUrl.href.replace(/\/$/, "");
const TILE = 96;
const TRIM_PADDING = 8;
const ROAD_RECTS = [
  { x: 280, y: -20, w: 145, h: WORLD.h + 40 },
  { x: 1090, y: -20, w: 150, h: WORLD.h + 40 },
  { x: 1900, y: -20, w: 150, h: WORLD.h + 40 },
  { x: -20, y: 245, w: WORLD.w + 40, h: 132 },
  { x: -20, y: 585, w: WORLD.w + 40, h: 142 },
  { x: -20, y: 1015, w: WORLD.w + 40, h: 132 },
];

const assetPaths = {
  logo: `${ASSET_ROOT}/logo/logo_mbg_food_delivery.png`,
  vanUp: `${ASSET_ROOT}/vehichles/mbg_van_up.png`,
  vanDown: `${ASSET_ROOT}/vehichles/mbg_van_down.png`,
  vanLeft: `${ASSET_ROOT}/vehichles/mbg_van_left.png`,
  vanRight: `${ASSET_ROOT}/vehichles/mbg_van_right.png`,
  vanUpgradeUp: `${ASSET_ROOT}/vehichles/mbg_van_upgrade_up.png`,
  vanUpgradeDown: `${ASSET_ROOT}/vehichles/mbg_van_upgrade_down.png`,
  vanUpgradeLeft: `${ASSET_ROOT}/vehichles/mbg_van_upgrade_left.png`,
  vanUpgradeRight: `${ASSET_ROOT}/vehichles/mbg_van_upgrade_right.png`,
  schoolSd: `${ASSET_ROOT}/schools/school_sd.png`,
  schoolSmp: `${ASSET_ROOT}/schools/school_smp.png`,
  schoolSma: `${ASSET_ROOT}/schools/school_sma.png`,
  schoolSmk: `${ASSET_ROOT}/schools/school_smk.png`,
  schoolDesa: `${ASSET_ROOT}/schools/school_desa.png`,
  grass: `${ASSET_ROOT}/tiles/grass.png`,
  roadHorizontal: `${ASSET_ROOT}/tiles/road_horizontal.png`,
  roadVertical: `${ASSET_ROOT}/tiles/road_vertical.png`,
  roadCrossroad: `${ASSET_ROOT}/tiles/road_crossroad.png`,
  sidewalk: `${ASSET_ROOT}/tiles/sidewalk.png`,
  trafficJamH: `${ASSET_ROOT}/obstacles/traffic_jam_horizontal.png`,
  trafficJamV: `${ASSET_ROOT}/obstacles/traffic_jam_vertical.png`,
  roadwork: `${ASSET_ROOT}/obstacles/roadwork.png`,
  trafficCone: `${ASSET_ROOT}/obstacles/traffic_cone.png`,
  puddle: `${ASSET_ROOT}/obstacles/puddle.png`,
  tree1: `${ASSET_ROOT}/props/tree_1.png`,
  tree2: `${ASSET_ROOT}/props/tree_2.png`,
  streetLamp: `${ASSET_ROOT}/props/street_lamp.png`,
  busStop: `${ASSET_ROOT}/props/bus_stop.png`,
  shopSembako: `${ASSET_ROOT}/props/shop_sembako.png`,
  foodStallMie: `${ASSET_ROOT}/props/food_stall_mie.png`,
  foodStallNasgor: `${ASSET_ROOT}/props/food_stall_nasgor.png`,
  roadSign: `${ASSET_ROOT}/props/road_sign.png`,
  markerDelivery: `${ASSET_ROOT}/UI/marker_delivery.png`,
  markerSuccess: `${ASSET_ROOT}/UI/marker_success.png`,
  panelTimer: `${ASSET_ROOT}/UI/panel_timer.png`,
  panelScore: `${ASSET_ROOT}/UI/panel_score.png`,
  buttonPrimary: `${ASSET_ROOT}/UI/button_primary.png`,
  foodTray: `${ASSET_ROOT}/food/food-tray.png`,
  milk: `${ASSET_ROOT}/food/milk.png`,
  fruits: `${ASSET_ROOT}/food/fruits.png`,
  musicMenu: `${ASSET_ROOT}/sound/bgm_menu.mp3`,
  musicPlay: `${ASSET_ROOT}/sound/bgm_gameplay.mp3`,
  musicRain: `${ASSET_ROOT}/sound/bgm_rain.mp3`,
  musicWin: `${ASSET_ROOT}/sound/bgm_menu.mp3`,
  musicRush: `${ASSET_ROOT}/sound/bgm_gameplay.mp3`,
  sfxButton: `${ASSET_ROOT}/sound/sfx_button.wav`,
  sfxBoost: `${ASSET_ROOT}/sound/sfx_boost.wav`,
  sfxHit: `${ASSET_ROOT}/sound/sfx_hit.wav`,
  sfxSuccess: `${ASSET_ROOT}/sound/sfx_success.wav`,
  sfxCar: `${ASSET_ROOT}/sound/sfx_mbg_car.wav`,
  sfxCarUpgrade: `${ASSET_ROOT}/sound/sfx_mbg_car-upgrade.wav`,
};

const levels = [
  {
    name: "Pagi di Karawang",
    time: 95,
    weather: "clear",
    schools: [
      { kind: 0, x: 690, y: 150, need: 1 },
      { kind: 1, x: 1515, y: 150, need: 1 },
    ],
    obstacles: [
      { x: 950, y: 655, w: 220, h: 120, type: 0, axis: "h" },
      { x: 1450, y: 1080, w: 95, h: 145, type: 1, axis: "v" },
    ],
  },
  {
    name: "Jam Istirahat",
    time: 110,
    weather: "clear",
    schools: [
      { kind: 2, x: 2265, y: 150, need: 1 },
      { kind: 3, x: 700, y: 870, need: 1 },
      { kind: 0, x: 1515, y: 490, need: 1 },
    ],
    obstacles: [
      { x: 760, y: 655, w: 230, h: 120, type: 2, axis: "h" },
      { x: 1180, y: 310, w: 95, h: 160, type: 0, axis: "v" },
      { x: 1760, y: 1080, w: 220, h: 120, type: 1, axis: "h" },
    ],
  },
  {
    name: "Rute Hujan",
    time: 130,
    weather: "rain",
    schools: [
      { kind: 4, x: 1515, y: 1290, need: 1 },
      { kind: 1, x: 2265, y: 150, need: 1 },
      { kind: 3, x: 700, y: 870, need: 1 },
      { kind: 2, x: 1515, y: 490, need: 1 },
    ],
    obstacles: [
      { x: 600, y: 655, w: 240, h: 125, type: 0, axis: "h" },
      { x: 1160, y: 1080, w: 100, h: 155, type: 1, axis: "v" },
      { x: 1510, y: 655, w: 220, h: 130, type: 2, axis: "h" },
      { x: 1975, y: 1080, w: 220, h: 130, type: 0, axis: "h" },
    ],
  },
  {
    name: "Distribusi Besar",
    time: 150,
    weather: "clear",
    schools: [
      { kind: 0, x: 690, y: 150, need: 1 },
      { kind: 1, x: 1515, y: 150, need: 1 },
      { kind: 2, x: 2265, y: 150, need: 1 },
      { kind: 3, x: 700, y: 870, need: 1 },
      { kind: 4, x: 1515, y: 1290, need: 1 },
    ],
    obstacles: [
      { x: 820, y: 655, w: 220, h: 125, type: 0, axis: "h" },
      { x: 1180, y: 1080, w: 100, h: 160, type: 1, axis: "v" },
      { x: 1700, y: 655, w: 230, h: 130, type: 2, axis: "h" },
      { x: 2150, y: 1080, w: 220, h: 130, type: 0, axis: "h" },
      { x: 350, y: 655, w: 190, h: 120, type: 1, axis: "h" },
    ],
  },
  {
    name: "Rute Padat Kota",
    time: 145,
    weather: "clear",
    schools: [
      { kind: 0, x: 690, y: 150, need: 1 },
      { kind: 2, x: 2265, y: 150, need: 1 },
      { kind: 4, x: 1515, y: 1290, need: 1 },
      { kind: 1, x: 700, y: 870, need: 1 },
    ],
    obstacles: [
      { x: 880, y: 655, w: 230, h: 125, type: 0, axis: "h", moveAxis: "x", range: 280, speed: 0.55 },
      { x: 1090, y: 430, w: 95, h: 155, type: 1, axis: "v", moveAxis: "y", range: 210, speed: 0.7, phase: 1.2 },
      { x: 1740, y: 1080, w: 220, h: 120, type: 0, axis: "h", moveAxis: "x", range: 320, speed: 0.62, phase: 2.4 },
      { x: 2090, y: 655, w: 100, h: 150, type: 2, axis: "v", moveAxis: "y", range: 170, speed: 0.8 },
      { x: 475, y: 1080, w: 180, h: 112, type: 1, axis: "h" },
    ],
  },
  {
    name: "Hujan Pulang Sekolah",
    time: 155,
    weather: "rain",
    schools: [
      { kind: 3, x: 1515, y: 490, need: 1 },
      { kind: 0, x: 690, y: 150, need: 1 },
      { kind: 1, x: 1515, y: 150, need: 1 },
      { kind: 2, x: 2265, y: 150, need: 1 },
      { kind: 4, x: 1515, y: 1290, need: 1 },
    ],
    obstacles: [
      { x: 650, y: 655, w: 230, h: 125, type: 0, axis: "h", moveAxis: "x", range: 260, speed: 0.72 },
      { x: 1180, y: 1080, w: 104, h: 156, type: 2, axis: "v", moveAxis: "y", range: 230, speed: 0.9, phase: 0.8 },
      { x: 1510, y: 655, w: 230, h: 126, type: 0, axis: "h", moveAxis: "x", range: 290, speed: 0.72, phase: 1.8 },
      { x: 1900, y: 1080, w: 104, h: 156, type: 1, axis: "v", moveAxis: "y", range: 190, speed: 0.78, phase: 2.5 },
      { x: 2220, y: 655, w: 220, h: 120, type: 0, axis: "h", moveAxis: "x", range: 180, speed: 0.65 },
    ],
  },
  {
    name: "Operasi Makan Siang",
    time: 165,
    weather: "clear",
    schools: [
      { kind: 0, x: 690, y: 150, need: 1 },
      { kind: 1, x: 1515, y: 150, need: 1 },
      { kind: 2, x: 2265, y: 150, need: 1 },
      { kind: 3, x: 700, y: 870, need: 1 },
      { kind: 4, x: 1515, y: 1290, need: 1 },
      { kind: 0, x: 2265, y: 870, need: 1 },
    ],
    obstacles: [
      { x: 370, y: 655, w: 190, h: 118, type: 1, axis: "h", moveAxis: "x", range: 170, speed: 0.85 },
      { x: 835, y: 655, w: 230, h: 125, type: 0, axis: "h", moveAxis: "x", range: 270, speed: 0.82, phase: 0.9 },
      { x: 1180, y: 310, w: 98, h: 150, type: 2, axis: "v", moveAxis: "y", range: 200, speed: 0.95, phase: 1.8 },
      { x: 1510, y: 655, w: 230, h: 126, type: 0, axis: "h", moveAxis: "x", range: 310, speed: 0.78, phase: 2.8 },
      { x: 1900, y: 1080, w: 104, h: 158, type: 1, axis: "v", moveAxis: "y", range: 240, speed: 0.9, phase: 3.3 },
      { x: 2200, y: 1080, w: 220, h: 120, type: 0, axis: "h", moveAxis: "x", range: 220, speed: 0.82, phase: 1.4 },
    ],
  },
  {
    name: "Final Distribusi MBG",
    time: 180,
    weather: "rain",
    schools: [
      { kind: 0, x: 690, y: 150, need: 1 },
      { kind: 1, x: 1515, y: 150, need: 1 },
      { kind: 2, x: 2265, y: 150, need: 1 },
      { kind: 3, x: 700, y: 870, need: 1 },
      { kind: 4, x: 1515, y: 1290, need: 1 },
      { kind: 0, x: 2265, y: 870, need: 1 },
    ],
    obstacles: [
      { x: 370, y: 655, w: 190, h: 118, type: 1, axis: "h", moveAxis: "x", range: 210, speed: 1.02 },
      { x: 760, y: 655, w: 230, h: 125, type: 0, axis: "h", moveAxis: "x", range: 320, speed: 0.95, phase: 0.7 },
      { x: 1090, y: 455, w: 98, h: 155, type: 0, axis: "v", moveAxis: "y", range: 270, speed: 1.05, phase: 1.4 },
      { x: 1385, y: 1080, w: 104, h: 158, type: 2, axis: "v", moveAxis: "y", range: 260, speed: 1.06, phase: 2.1 },
      { x: 1710, y: 655, w: 230, h: 126, type: 0, axis: "h", moveAxis: "x", range: 330, speed: 0.98, phase: 2.8 },
      { x: 1900, y: 1080, w: 104, h: 158, type: 1, axis: "v", moveAxis: "y", range: 250, speed: 1.0, phase: 3.5 },
      { x: 2200, y: 655, w: 220, h: 120, type: 0, axis: "h", moveAxis: "x", range: 280, speed: 1.0, phase: 4.2 },
    ],
  },
];

const state = {
  screen: "loading",
  loadingProgress: 0,
  levelIndex: 0,
  delivered: 0,
  score: 0,
  coins: 0,
  boost: 1,
  handling: 1,
  freshness: 1,
  timeLeft: 0,
  message: "",
  messageTimer: 0,
  hitCd: 0,
  cargo: 100,
  combo: 1,
  comboTimer: 0,
  priorityIndex: -1,
  priorityTime: 0,
  priorityBonus: 0,
  traffic: [],
  crashFlash: 0,
  shake: 0,
  paused: false,
  levelHits: 0,
  levelStars: 0,
  deliveryFx: [],
  car: { x: 315, y: 1086, vx: 0, vy: 0, angle: 0, speed: 0, boostCd: 0, usingUpgrade: false },
  keys: new Set(),
  camera: { x: 0, y: 0 },
};

const images = {};
const sprites = {};
const audio = {};
const audioState = {
  ready: false,
  unlocked: false,
  current: null,
  target: null,
  fading: false,
};
const buttons = [];
let routePulse = 0;
let last = performance.now();
let lastTouchScreen = "";

function loadImage(key, src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      images[key] = img;
      resolve();
    };
    img.onerror = () => resolve();
    img.src = src;
  });
}

function initAudio() {
  if (audioState.ready) return;
  for (const [key, src] of Object.entries(assetPaths)) {
    if (key.startsWith("music")) {
      const a = new Audio(src);
      a.loop = true;
      a.preload = "metadata";
      a.volume = 0;
      audio[key] = a;
    } else if (key.startsWith("sfx")) {
      const a = new Audio(src);
      a.loop = key === "sfxCar" || key === "sfxCarUpgrade";
      a.preload = "none";
      a.volume = key === "sfxCar" || key === "sfxCarUpgrade" ? 0 : 0.58;
      audio[key] = a;
    }
  }
  audioState.ready = true;
}

async function unlockAudio() {
  initAudio();
  if (audioState.unlocked) return;
  audioState.unlocked = true;
  const track = audio[audioState.target] || audio.musicMenu;
  if (!track) return;
  track.muted = true;
  try {
    await track.play();
    track.pause();
    track.currentTime = 0;
  } catch {
    // Browser may still defer playback; future user gestures will retry.
  }
  track.muted = false;
}

function bgmVolume(key) {
  if (key === "musicRush") return 0.38;
  if (key === "musicWin") return 0.44;
  if (key === "musicMenu") return 0.3;
  return 0.32;
}

function playSfx(key) {
  initAudio();
  const sound = audio[key];
  if (!sound || !audioState.unlocked) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function updateCarSfx(dt) {
  initAudio();
  const normal = audio.sfxCar;
  const upgrade = audio.sfxCarUpgrade;
  if ((!normal && !upgrade) || !audioState.unlocked) return;
  const activeKey = state.car.usingUpgrade ? "sfxCarUpgrade" : "sfxCar";
  const driveVolume = state.screen === "play" ? clamp(state.car.speed / 260, 0, 1) * 0.3 : 0;
  for (const key of ["sfxCar", "sfxCarUpgrade"]) {
    const sound = audio[key];
    if (!sound) continue;
    const target = key === activeKey ? driveVolume : 0;
    sound.volume += (target - sound.volume) * Math.min(1, dt * 8);
    if (target > 0.02 && sound.paused) sound.play().catch(() => {});
    if (target <= 0.01 && sound.volume < 0.015 && !sound.paused) sound.pause();
  }
}

function updateMovingObstacles(level, dt) {
  for (const obstacle of level.obstacles) {
    if (!obstacle.moveAxis || !obstacle.range || !obstacle.speed) continue;
    obstacle.moveT = (obstacle.moveT ?? obstacle.phase ?? 0) + dt * obstacle.speed;
    const offset = Math.sin(obstacle.moveT) * obstacle.range;
    obstacle.x = (obstacle.baseX ?? obstacle.x) + (obstacle.moveAxis === "x" ? offset : 0);
    obstacle.y = (obstacle.baseY ?? obstacle.y) + (obstacle.moveAxis === "y" ? offset : 0);
  }
}

const TRAFFIC_LANES = {
  x: [315, 390, 1125, 1205, 1935, 2015],
  y: [278, 344, 620, 692, 1048, 1118],
};

function spawnTraffic() {
  const count = 3 + state.levelIndex;
  state.traffic = Array.from({ length: count }, (_, i) => {
    const horizontal = i % 2 === 0;
    const direction = (i + state.levelIndex) % 3 === 0 ? -1 : 1;
    return {
      axis: horizontal ? "x" : "y",
      x: horizontal ? 620 + ((i * 367 + state.levelIndex * 191) % 1800) : TRAFFIC_LANES.x[(i + state.levelIndex) % TRAFFIC_LANES.x.length],
      y: horizontal ? TRAFFIC_LANES.y[(i * 2 + state.levelIndex) % TRAFFIC_LANES.y.length] : 180 + ((i * 293 + state.levelIndex * 137) % 1080),
      direction,
      speed: 105 + state.levelIndex * 9 + (i % 3) * 18,
      sprite: i % Math.max(1, sprites.traffic?.length || 1),
      w: horizontal ? 86 : 54,
      h: horizontal ? 50 : 92,
    };
  });
}

function updateTraffic(dt) {
  const rush = state.timeLeft < 18 ? 1.32 : 1;
  for (const vehicle of state.traffic) {
    vehicle[vehicle.axis] += vehicle.direction * vehicle.speed * rush * dt;
    if (vehicle.axis === "x") {
      if (vehicle.x < -120) vehicle.x = WORLD.w + 120;
      if (vehicle.x > WORLD.w + 120) vehicle.x = -120;
    } else {
      if (vehicle.y < -140) vehicle.y = WORLD.h + 140;
      if (vehicle.y > WORLD.h + 140) vehicle.y = -140;
    }
  }
}

function playBgm(key, { restart = false } = {}) {
  initAudio();
  const next = audio[key];
  if (!next || audioState.target === key) return;
  audioState.target = key;
  if (!audioState.unlocked) return;
  next.loop = key !== "musicWin";
  if (restart) next.currentTime = 0;
  next.play().catch(() => {});
  audioState.fading = false;
  fadeTo(key);
}

function fadeTo(key) {
  if (audioState.fading) return;
  audioState.fading = true;
  const step = () => {
    let done = true;
    for (const [name, track] of Object.entries(audio)) {
      if (!name.startsWith("music")) continue;
      const target = name === key ? bgmVolume(name) : 0;
      const delta = target - track.volume;
      if (Math.abs(delta) > 0.015) {
        track.volume += delta * 0.18;
        done = false;
    } else {
      track.volume = target;
    }
    if (name !== key && track.volume === 0 && !track.paused) track.pause();
    if (name === key && !track.paused && !track.loop && track.ended) {
      track.pause();
    }
  }
    if (!done) {
      requestAnimationFrame(step);
    } else {
      audioState.current = key;
      audioState.fading = false;
    }
  };
  requestAnimationFrame(step);
}

function stopBgm() {
  audioState.target = null;
  for (const [name, track] of Object.entries(audio)) {
    if (!name.startsWith("music")) continue;
    track.pause();
    track.currentTime = 0;
    track.volume = 0;
  }
  audioState.current = null;
  audioState.fading = false;
}

async function boot() {
  const imageEntries = Object.entries(assetPaths).filter(([, src]) => /\.(png|webp)$/.test(src));
  let loaded = 0;
  await Promise.all(
    imageEntries.map(async ([key, src]) => {
      await loadImage(key, src);
      loaded += 1;
      state.loadingProgress = loaded / imageEntries.length;
    })
  );
  buildSprites();
  initAudio();
  state.screen = "menu";
  playBgm("musicMenu");
}

function buildSprites() {
  sprites.logo = directSprite("logo");
  sprites.carDirections = {
    up: directSprite("vanUp"),
    down: directSprite("vanDown"),
    left: directSprite("vanLeft"),
    right: directSprite("vanRight"),
  };
  sprites.car2Directions = {
    up: directSprite("vanUpgradeUp"),
    down: directSprite("vanUpgradeDown"),
    left: directSprite("vanUpgradeLeft"),
    right: directSprite("vanUpgradeRight"),
  };
  sprites.car = sprites.carDirections.up;
  sprites.car2 = sprites.car2Directions.down;
  sprites.car2Side = sprites.car2Directions.right;
  sprites.schools = [
    directSprite("schoolSd"),
    directSprite("schoolSmp"),
    directSprite("schoolSma"),
    directSprite("schoolSmk"),
    directSprite("schoolDesa"),
  ];
  sprites.food = [directSprite("foodTray"), directSprite("milk"), directSprite("fruits")];
  sprites.obstacles = [
    directSprite("trafficCone"),
    directSprite("roadwork"),
    directSprite("puddle"),
  ];
  sprites.traffic = [];
  sprites.trafficJam = {
    h: directSprite("trafficJamH"),
    v: directSprite("trafficJamV"),
  };
  sprites.props = {
    tree: directSprite("tree1"),
    tree2: directSprite("tree2"),
    lamp: directSprite("streetLamp"),
    cone: directSprite("trafficCone"),
    shop: directSprite("shopSembako"),
    busStop: directSprite("busStop"),
    sign: directSprite("roadSign"),
    foodStallMie: directSprite("foodStallMie"),
    foodStallNasgor: directSprite("foodStallNasgor"),
  };
  sprites.city = {};
  sprites.tiles = {
    grass: directSprite("grass", false),
    roadH: directSprite("roadHorizontal", false),
    roadV: directSprite("roadVertical", false),
    crossroad: directSprite("roadCrossroad", false),
    sidewalk: directSprite("sidewalk", false),
  };
  sprites.ui = {
    markerDelivery: directSprite("markerDelivery"),
    markerSuccess: directSprite("markerSuccess"),
    panelTimer: directSprite("panelTimer"),
    panelScore: directSprite("panelScore"),
    buttonPrimary: directSprite("buttonPrimary"),
  };
}

function directSprite(key, trim = true) {
  const img = images[key];
  if (!img) return null;
  const work = document.createElement("canvas");
  work.width = img.naturalWidth || img.width;
  work.height = img.naturalHeight || img.height;
  const wctx = work.getContext("2d", { willReadFrequently: trim });
  wctx.imageSmoothingEnabled = false;
  wctx.drawImage(img, 0, 0);
  if (trim && !hasTransparentEdge(wctx, work.width, work.height)) {
    clearTransparentSheetBackground(wctx, work.width, work.height);
  }
  return trim ? trimSprite(work) : work;
}

function cropSprite(key, crop, clearBackground = true) {
  const img = images[key];
  if (!img || !crop) return null;
  return makeSprite(img, crop, clearBackground);
}

function makeSprite(img, crop, clearBackground = true) {
  if (!img || !crop) return null;
  const [sx, sy, sw, sh] = crop;
  const work = document.createElement("canvas");
  work.width = sw;
  work.height = sh;
  const wctx = work.getContext("2d", { willReadFrequently: true });
  wctx.imageSmoothingEnabled = false;
  wctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  if (clearBackground) clearTransparentSheetBackground(wctx, sw, sh);
  return trimSprite(work);
}

function clearTransparentSheetBackground(wctx, sw, sh) {
  const image = wctx.getImageData(0, 0, sw, sh);
  const data = image.data;
  const seen = new Uint8Array(sw * sh);
  const stack = [];
  for (let x = 0; x < sw; x += 1) {
    stack.push(x, x + (sh - 1) * sw);
  }
  for (let y = 0; y < sh; y += 1) {
    stack.push(y * sw, sw - 1 + y * sw);
  }
  while (stack.length) {
    const idx = stack.pop();
    if (idx < 0 || idx >= seen.length || seen[idx]) continue;
    seen[idx] = 1;
    const p = idx * 4;
    if (!isEdgeBackgroundPixel(data[p], data[p + 1], data[p + 2], data[p + 3])) continue;
    data[p + 3] = 0;
    const x = idx % sw;
    if (x > 0) stack.push(idx - 1);
    if (x < sw - 1) stack.push(idx + 1);
    if (idx >= sw) stack.push(idx - sw);
    if (idx < sw * (sh - 1)) stack.push(idx + sw);
  }
  wctx.putImageData(image, 0, 0);
}

function hasTransparentEdge(wctx, sw, sh) {
  const image = wctx.getImageData(0, 0, sw, sh);
  const data = image.data;
  let samples = 0;
  let transparent = 0;
  const sample = (x, y) => {
    samples += 1;
    if (data[(y * sw + x) * 4 + 3] < 16) transparent += 1;
  };
  const step = Math.max(1, Math.floor(Math.min(sw, sh) / 64));
  for (let x = 0; x < sw; x += step) {
    sample(x, 0);
    sample(x, sh - 1);
  }
  for (let y = 0; y < sh; y += step) {
    sample(0, y);
    sample(sw - 1, y);
  }
  return transparent / Math.max(1, samples) > 0.2;
}

function isEdgeBackgroundPixel(r, g, b, a) {
  if (a < 8) return true;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const neutral = max - min < 18;
  const brightWhite = min > 232 && neutral;
  const checkerLight = r >= 214 && r <= 238 && g >= 214 && g <= 238 && b >= 214 && b <= 238 && neutral;
  const checkerMid = r >= 184 && r <= 214 && g >= 184 && g <= 214 && b >= 184 && b <= 214 && neutral;
  const blackSheet = max < 18 && max - min < 12;
  return brightWhite || checkerLight || checkerMid || blackSheet;
}

function trimSprite(source) {
  const sctx = source.getContext("2d", { willReadFrequently: true });
  const { width, height } = source;
  const data = sctx.getImageData(0, 0, width, height).data;
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] > 12) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  if (minX > maxX || minY > maxY) return source;
  minX = Math.max(0, minX - TRIM_PADDING);
  minY = Math.max(0, minY - TRIM_PADDING);
  maxX = Math.min(width - 1, maxX + TRIM_PADDING);
  maxY = Math.min(height - 1, maxY + TRIM_PADDING);
  const out = document.createElement("canvas");
  out.width = maxX - minX + 1;
  out.height = maxY - minY + 1;
  out.getContext("2d").drawImage(source, minX, minY, out.width, out.height, 0, 0, out.width, out.height);
  return out;
}

function startLevel(index) {
  state.levelIndex = Math.min(index, levels.length - 1);
  levels[state.levelIndex].schools.forEach((school) => {
    school.done = false;
  });
  levels[state.levelIndex].obstacles.forEach((obstacle) => {
    obstacle.baseX = obstacle.startX ?? obstacle.x;
    obstacle.baseY = obstacle.startY ?? obstacle.y;
    obstacle.x = obstacle.baseX;
    obstacle.y = obstacle.baseY;
    obstacle.moveT = obstacle.phase ?? 0;
  });
  state.delivered = 0;
  state.timeLeft = levels[state.levelIndex].time;
  state.message = "";
  state.messageTimer = 0;
  state.hitCd = 0;
  state.cargo = 100;
  state.combo = 1;
  state.comboTimer = 0;
  state.priorityBonus = 0;
  state.crashFlash = 0;
  state.shake = 0;
  state.paused = false;
  state.levelHits = 0;
  state.levelStars = 0;
  state.deliveryFx = [];
  state.car.x = 315;
  state.car.y = 1086;
  state.car.vx = 0;
  state.car.vy = 0;
  state.car.angle = 0;
  state.car.speed = 0;
  state.car.boostCd = 0;
  state.car.usingUpgrade = state.boost + state.handling + state.freshness > 3;
  spawnTraffic();
  setNextPriority();
  state.screen = "play";
  playBgm(levels[state.levelIndex].weather === "rain" ? "musicRain" : "musicPlay", { restart: true });
}

function setNextPriority() {
  const schools = levels[state.levelIndex].schools;
  const next = schools.findIndex((school, index) => !school.done && index > state.priorityIndex);
  state.priorityIndex = next >= 0 ? next : schools.findIndex((school) => !school.done);
  state.priorityTime = state.priorityIndex >= 0 ? Math.max(16, 27 - state.levelIndex * 1.2) : 0;
}

function rectsHit(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function pointInRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function pointOnRoad(x, y) {
  return ROAD_RECTS.some((rect) => pointInRect(x, y, rect));
}

function carCanDrive(x, y) {
  const samples = [
    [x, y],
    [x - 38, y - 24],
    [x + 38, y - 24],
    [x - 38, y + 24],
    [x + 38, y + 24],
  ];
  return samples.every(([sx, sy]) => pointOnRoad(sx, sy));
}

function handleObstacleHit(obstacle) {
  if (state.hitCd > 0) {
    state.car.vx *= 0.82;
    state.car.vy *= 0.82;
    return;
  }
  if (obstacle.type === 2) {
    state.car.vx *= 0.56;
    state.car.vy *= 0.56;
    state.timeLeft -= 0.35;
    state.message = "Licin, pelan-pelan!";
    state.cargo -= 4;
  } else if (obstacle.type === 1) {
    state.car.vx *= -0.34;
    state.car.vy *= -0.34;
    state.timeLeft -= 1.15;
    state.message = "Pekerjaan jalan!";
    state.cargo -= 12;
  } else {
    state.car.vx *= -0.22;
    state.car.vy *= -0.22;
    state.timeLeft -= obstacle.moveAxis ? 1.05 : 0.8;
    state.message = obstacle.moveAxis ? "Macet bergerak!" : "Macet!";
    state.cargo -= obstacle.moveAxis ? 11 : 8;
  }
  registerCrash();
  state.messageTimer = 1.1;
  playSfx("sfxHit");
  state.hitCd = 0.8;
}

function handleTrafficHit(vehicle) {
  if (state.hitCd > 0) return;
  const dx = state.car.x - vehicle.x;
  const dy = state.car.y - vehicle.y;
  const length = Math.max(1, Math.hypot(dx, dy));
  state.car.vx = (dx / length) * 150;
  state.car.vy = (dy / length) * 150;
  vehicle[vehicle.axis] += vehicle.direction * 150;
  state.timeLeft -= 1.5;
  state.cargo -= 12;
  state.message = "Tabrakan! Muatan rusak";
  state.messageTimer = 1.25;
  state.hitCd = 1.2;
  registerCrash();
  playSfx("sfxHit");
}

function registerCrash() {
  state.cargo = clamp(state.cargo, 0, 100);
  state.combo = 1;
  state.comboTimer = 0;
  state.levelHits += 1;
  state.crashFlash = 0.42;
  state.shake = 0.38;
}

function update(dt) {
  updateDeliveryFx(dt);
  if (state.screen === "loading") return;
  updateCarSfx(dt);
  if (state.screen !== "play") return;
  if (state.paused) return;
  const level = levels[state.levelIndex];
  updateMovingObstacles(level, dt);
  updateTraffic(dt);
  state.timeLeft -= dt / state.freshness;
  state.priorityTime = Math.max(0, state.priorityTime - dt);
  state.comboTimer = Math.max(0, state.comboTimer - dt);
  state.crashFlash = Math.max(0, state.crashFlash - dt);
  state.shake = Math.max(0, state.shake - dt);
  if (state.comboTimer === 0) state.combo = 1;
  if (state.timeLeft < 18 && level.weather !== "rain" && audioState.target !== "musicRush") {
    playBgm("musicRush", { restart: true });
  }
  if (state.timeLeft <= 0) {
    state.screen = "fail";
    state.message = "Waktu habis";
    playBgm("musicRush", { restart: true });
    return;
  }
  if (state.cargo <= 0) {
    state.screen = "fail";
    state.message = "Muatan habis rusak";
    playBgm("musicRush", { restart: true });
    return;
  }

  let ix = 0;
  let iy = 0;
  if (state.keys.has("left")) ix -= 1;
  if (state.keys.has("right")) ix += 1;
  if (state.keys.has("up")) iy -= 1;
  if (state.keys.has("down")) iy += 1;
  const inputLength = Math.hypot(ix, iy);
  if (inputLength > 0) {
    ix /= inputLength;
    iy /= inputLength;
  }
  const maxSpeed = (level.weather === "rain" ? 235 : 285) + 38 * state.boost;
  const response = Math.min(1, dt * (5.4 + state.handling * 1.8));
  const targetVx = ix * maxSpeed;
  const targetVy = iy * maxSpeed;
  if (inputLength > 0) {
    state.car.vx += (targetVx - state.car.vx) * response;
    state.car.vy += (targetVy - state.car.vy) * response;
  } else {
    state.car.vx *= Math.pow(0.035, dt);
    state.car.vy *= Math.pow(0.035, dt);
  }
  if (state.keys.has("boost") && state.car.boostCd <= 0) {
    const ax = Math.cos(state.car.angle);
    const ay = Math.sin(state.car.angle);
    state.car.vx += ax * 210 * state.boost;
    state.car.vy += ay * 210 * state.boost;
    state.car.boostCd = 4.2;
    state.keys.delete("boost");
    playSfx("sfxBoost");
  }
  state.car.boostCd = Math.max(0, state.car.boostCd - dt);
  state.hitCd = Math.max(0, state.hitCd - dt);
  const speed = Math.hypot(state.car.vx, state.car.vy);
  if (speed > maxSpeed * 1.22) {
    const scale = (maxSpeed * 1.22) / speed;
    state.car.vx *= scale;
    state.car.vy *= scale;
  }
  state.car.speed = Math.hypot(state.car.vx, state.car.vy);
  if (state.car.speed > 8) {
    state.car.angle = lerpAngle(state.car.angle, Math.atan2(state.car.vy, state.car.vx), Math.min(1, dt * 9.5));
  }
  const nextX = clamp(state.car.x + state.car.vx * dt, 80, WORLD.w - 80);
  const nextY = clamp(state.car.y + state.car.vy * dt, 80, WORLD.h - 80);
  if (carCanDrive(nextX, nextY)) {
    state.car.x = nextX;
    state.car.y = nextY;
  } else {
    state.car.vx *= -0.18;
    state.car.vy *= -0.18;
    state.message = "Tetap di jalan!";
    state.messageTimer = Math.max(state.messageTimer, 0.65);
  }

  const carBox = { x: state.car.x - 44, y: state.car.y - 32, w: 88, h: 64 };
  for (const o of level.obstacles) {
    const obstacleBox = { x: o.x - o.w / 2, y: o.y - o.h / 2, w: o.w, h: o.h };
    if (rectsHit(carBox, obstacleBox)) {
      handleObstacleHit(o);
    }
  }
  for (const vehicle of state.traffic) {
    const trafficBox = { x: vehicle.x - vehicle.w / 2, y: vehicle.y - vehicle.h / 2, w: vehicle.w, h: vehicle.h };
    if (rectsHit(carBox, trafficBox)) handleTrafficHit(vehicle);
  }
  for (const [schoolIndex, s] of level.schools.entries()) {
    if (s.done) continue;
    const drop = schoolDropPoint(s);
    const dx = state.car.x - drop.x;
    const dy = state.car.y - drop.y;
    if (Math.hypot(dx, dy) < 130) {
      const wasPriority = schoolIndex === state.priorityIndex;
      const fastPriority = wasPriority && state.priorityTime > 0;
      s.done = true;
      state.delivered += 1;
      state.combo = state.comboTimer > 0 ? Math.min(4, state.combo + 1) : 1;
      state.comboTimer = 13;
      const deliveryScore = Math.round((500 + state.timeLeft * 4 + (fastPriority ? 450 : 0)) * state.combo);
      state.score += deliveryScore;
      state.coins += 2 + (fastPriority ? 2 : 0);
      if (fastPriority) state.priorityBonus += 1;
      state.message = fastPriority ? `Prioritas beres! +${deliveryScore}` : `Terkirim x${state.combo}! +${deliveryScore}`;
      state.messageTimer = 1.5;
      spawnDeliveryFx(state.car.x, state.car.y, s.x, s.y - 42);
      playSfx("sfxSuccess");
      if (wasPriority) setNextPriority();
      if (state.delivered === level.schools.length) {
        state.screen = "levelClear";
        state.levelStars = calculateStars();
        state.coins += 5 + state.levelIndex + state.levelStars * 2;
        playBgm("musicWin", { restart: true });
      }
    }
  }
  state.messageTimer = Math.max(0, state.messageTimer - dt);
  routePulse += dt * 4;
  state.camera.x = clamp(state.car.x - W / 2, 0, WORLD.w - W);
  state.camera.y = clamp(state.car.y - H / 2, 0, WORLD.h - H);
}

function calculateStars() {
  let stars = 1;
  if (state.cargo >= 60 && state.timeLeft >= 10) stars += 1;
  if (state.cargo >= 82 && state.levelHits <= 2 && state.priorityBonus >= Math.ceil(levels[state.levelIndex].schools.length / 2)) stars += 1;
  return stars;
}

function spawnDeliveryFx(fromX, fromY, toX, toY) {
  state.deliveryFx.push({
    fromX,
    fromY,
    toX,
    toY,
    t: 0,
    duration: 0.62,
  });
}

function schoolDropPoint(school) {
  if (school.dropX !== undefined && school.dropY !== undefined) {
    return { x: school.dropX, y: school.dropY };
  }
  let best = { x: school.x, y: school.y, d: Infinity };
  for (const road of ROAD_RECTS) {
    const x = clamp(school.x, road.x + 54, road.x + road.w - 54);
    const y = clamp(school.y, road.y + 44, road.y + road.h - 44);
    const d = Math.hypot(school.x - x, school.y - y);
    if (d < best.d) best = { x, y, d };
  }
  return { x: best.x, y: best.y };
}

function updateDeliveryFx(dt) {
  for (const fx of state.deliveryFx) {
    fx.t += dt;
  }
  state.deliveryFx = state.deliveryFx.filter((fx) => fx.t < fx.duration);
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  if (state.screen === "loading") {
    ctx.fillStyle = "#173034";
    ctx.fillRect(0, 0, W, H);
    drawPanel(390, 260, 500, 180, "Menyiapkan Pengiriman");
    const progress = clamp(state.loadingProgress, 0, 1);
    ctx.fillStyle = "#10191c";
    ctx.fillRect(438, 360, 404, 26);
    ctx.fillStyle = "#f7cf4a";
    ctx.fillRect(442, 364, 396 * progress, 18);
    text(`${Math.round(progress * 100)}%`, 640, 420, 20, "#dff7ef", "center");
    return;
  }
  if (state.screen === "menu") return drawMenu();
  if (state.screen === "upgrade") return drawUpgrade();
  drawWorld();
  drawHud();
  if (state.screen === "levelClear") drawLevelClear();
  if (state.screen === "fail") drawFail();
  if (state.screen === "play" && state.paused) drawPause();
}

function drawWorld() {
  const shakeAmount = state.shake > 0 ? state.shake * 16 : 0;
  const cam = {
    x: state.camera.x + Math.sin(routePulse * 17) * shakeAmount,
    y: state.camera.y + Math.cos(routePulse * 23) * shakeAmount,
  };
  drawMap(cam);
  drawSprites(cam);
  drawTrafficVehicles(cam);
  drawDeliveryFx(cam);
  drawCar(cam);
  if (levels[state.levelIndex].weather === "rain") drawRain();
  drawObjectiveArrow(cam);
  if (state.crashFlash > 0) {
    ctx.fillStyle = `rgba(220, 38, 38, ${state.crashFlash * 0.5})`;
    ctx.fillRect(0, 0, W, H);
  }
}

function drawMap(cam) {
  ctx.fillStyle = "#6fac74";
  ctx.fillRect(0, 0, W, H);
  const startX = Math.floor(cam.x / TILE) * TILE;
  const startY = Math.floor(cam.y / TILE) * TILE;
  for (let y = startY; y < cam.y + H + TILE; y += TILE) {
    for (let x = startX; x < cam.x + W + TILE; x += TILE) {
      const sx = x - cam.x;
      const sy = y - cam.y;
      if (sprites.tiles?.grass) {
        ctx.drawImage(sprites.tiles.grass, Math.round(sx), Math.round(sy), TILE, TILE);
      } else {
        ctx.fillStyle = (Math.floor(x / TILE) + Math.floor(y / TILE)) % 2 ? "#76b879" : "#80c07e";
        ctx.fillRect(sx, sy, TILE, TILE);
      }
    }
  }
  drawDecorPatches(cam);
  ctx.lineWidth = 2;
  drawRoad(280 - cam.x, -20 - cam.y, 145, WORLD.h + 40, true);
  drawRoad(1090 - cam.x, -20 - cam.y, 150, WORLD.h + 40, true);
  drawRoad(1900 - cam.x, -20 - cam.y, 150, WORLD.h + 40, true);
  drawRoad(-20 - cam.x, 245 - cam.y, WORLD.w + 40, 132, false);
  drawRoad(-20 - cam.x, 585 - cam.y, WORLD.w + 40, 142, false);
  drawRoad(-20 - cam.x, 1015 - cam.y, WORLD.w + 40, 132, false);
  drawRoadIntersections(cam);
  drawRoadFences(cam);
}

function drawDecorPatches(cam) {
  drawSprite(sprites.city?.court, 700 - cam.x, 38 - cam.y, 260, 190);
  drawSprite(sprites.city?.parking, 1310 - cam.x, 76 - cam.y, 340, 210);
  drawSprite(sprites.city?.park, 1530 - cam.x, 1120 - cam.y, 300, 140);
  drawSprite(sprites.city?.schoolSmall, 115 - cam.x, 68 - cam.y, 260, 138);
  drawSprite(sprites.city?.sidewalk, 430 - cam.x, 240 - cam.y, 70, 150);
  drawSprite(sprites.city?.sidewalk, 1240 - cam.x, 580 - cam.y, 70, 150);
  drawSprite(sprites.city?.sidewalk, 2050 - cam.x, 1010 - cam.y, 70, 150);
}

function drawRoad(x, y, w, h, vertical) {
  const roadSprite = vertical ? sprites.tiles?.roadV : sprites.tiles?.roadH;
  if (roadSprite) {
    if (sprites.tiles?.sidewalk) {
      if (vertical) {
        tileSprite(sprites.tiles.sidewalk, x - 24, y, 24, h, 64);
        tileSprite(sprites.tiles.sidewalk, x + w, y, 24, h, 64);
      } else {
        tileSprite(sprites.tiles.sidewalk, x, y - 24, w, 24, 64);
        tileSprite(sprites.tiles.sidewalk, x, y + h, w, 24, 64);
      }
    } else {
      ctx.fillStyle = "#aab1a7";
      if (vertical) {
        ctx.fillRect(x - 18, y, 18, h);
        ctx.fillRect(x + w, y, 18, h);
      } else {
        ctx.fillRect(x, y - 18, w, 18);
        ctx.fillRect(x, y + h, w, 18);
      }
    }
    tileSprite(roadSprite, x, y, w, h, 96);
    ctx.strokeStyle = "rgba(31, 42, 43, 0.55)";
    ctx.lineWidth = 2;
    ctx.strokeRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    return;
  }
  ctx.fillStyle = "#aab1a7";
  if (vertical) {
    ctx.fillRect(x - 18, y, 18, h);
    ctx.fillRect(x + w, y, 18, h);
  } else {
    ctx.fillRect(x, y - 18, w, 18);
    ctx.fillRect(x, y + h, w, 18);
  }
  ctx.fillStyle = "#555f5e";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "rgba(255,255,255,0.035)";
  for (let i = 0; i < (vertical ? h : w); i += 44) {
    if (vertical) ctx.fillRect(x + 8 + (i % 3) * 9, y + i, w - 20, 2);
    else ctx.fillRect(x + i, y + 8 + (i % 3) * 8, 2, h - 20);
  }
  ctx.strokeStyle = "#d8d0a2";
  ctx.setLineDash([22, 22]);
  ctx.beginPath();
  if (vertical) {
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w / 2, y + h);
  } else {
    ctx.moveTo(x, y + h / 2);
    ctx.lineTo(x + w, y + h / 2);
  }
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = "#40494a";
  ctx.strokeRect(x, y, w, h);
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  if (vertical) {
    ctx.beginPath();
    ctx.moveTo(x + 18, y);
    ctx.lineTo(x + 18, y + h);
    ctx.moveTo(x + w - 18, y);
    ctx.lineTo(x + w - 18, y + h);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(x, y + 18);
    ctx.lineTo(x + w, y + 18);
    ctx.moveTo(x, y + h - 18);
    ctx.lineTo(x + w, y + h - 18);
    ctx.stroke();
  }
}

function drawRoadIntersections(cam) {
  const crossroad = sprites.tiles?.crossroad;
  if (!crossroad) return;
  const xs = [280 + 72.5, 1090 + 75, 1900 + 75];
  const ys = [245 + 66, 585 + 71, 1015 + 66];
  for (const x of xs) {
    for (const y of ys) {
      ctx.drawImage(crossroad, Math.round(x - cam.x - 74), Math.round(y - cam.y - 74), 148, 148);
    }
  }
}

function drawRoadFences(cam) {
  const fenceStyle = {
    rail: "#f0d17a",
    post: "#5a4031",
    shadow: "rgba(28, 22, 15, 0.28)",
  };
  const drawFenceLine = (x1, y1, x2, y2, horizontal) => {
    ctx.strokeStyle = fenceStyle.shadow;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(Math.round(x1 - cam.x), Math.round(y1 - cam.y + 2));
    ctx.lineTo(Math.round(x2 - cam.x), Math.round(y2 - cam.y + 2));
    ctx.stroke();
    ctx.strokeStyle = fenceStyle.rail;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(Math.round(x1 - cam.x), Math.round(y1 - cam.y));
    ctx.lineTo(Math.round(x2 - cam.x), Math.round(y2 - cam.y));
    ctx.stroke();
    ctx.fillStyle = fenceStyle.post;
    const length = horizontal ? Math.abs(x2 - x1) : Math.abs(y2 - y1);
    const steps = Math.floor(length / 42);
    for (let i = 0; i <= steps; i += 1) {
      const t = steps ? i / steps : 0;
      const px = x1 + (x2 - x1) * t - cam.x;
      const py = y1 + (y2 - y1) * t - cam.y;
      ctx.fillRect(Math.round(px - 3), Math.round(py - 6), 6, 12);
    }
  };
  drawFenceLine(430, 238, 1082, 238, true);
  drawFenceLine(1248, 238, 1892, 238, true);
  drawFenceLine(2058, 238, WORLD.w, 238, true);
  drawFenceLine(430, 384, 1082, 384, true);
  drawFenceLine(1248, 384, 1892, 384, true);
  drawFenceLine(2058, 384, WORLD.w, 384, true);
  drawFenceLine(430, 578, 1082, 578, true);
  drawFenceLine(1248, 578, 1892, 578, true);
  drawFenceLine(2058, 578, WORLD.w, 578, true);
  drawFenceLine(430, 734, 1082, 734, true);
  drawFenceLine(1248, 734, 1892, 734, true);
  drawFenceLine(2058, 734, WORLD.w, 734, true);
  drawFenceLine(430, 1008, 1082, 1008, true);
  drawFenceLine(1248, 1008, 1892, 1008, true);
  drawFenceLine(2058, 1008, WORLD.w, 1008, true);
  drawFenceLine(430, 1154, 1082, 1154, true);
  drawFenceLine(1248, 1154, 1892, 1154, true);
  drawFenceLine(2058, 1154, WORLD.w, 1154, true);
  const verticalRoads = [
    [272, 433],
    [1082, 1248],
    [1892, 2058],
  ];
  const verticalGaps = [
    [0, 238],
    [384, 578],
    [734, 1008],
    [1154, WORLD.h],
  ];
  for (const [left, right] of verticalRoads) {
    for (const [top, bottom] of verticalGaps) {
      drawFenceLine(left, top, left, bottom, false);
      drawFenceLine(right, top, right, bottom, false);
    }
  }
}

function tileSprite(sprite, x, y, w, h, size) {
  if (!sprite || w <= 0 || h <= 0) return;
  ctx.save();
  ctx.beginPath();
  ctx.rect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  ctx.clip();
  for (let ty = y; ty < y + h; ty += size) {
    for (let tx = x; tx < x + w; tx += size) {
      ctx.drawImage(sprite, Math.round(tx), Math.round(ty), size, size);
    }
  }
  ctx.restore();
}

function drawSprites(cam) {
  const level = levels[state.levelIndex];
  const props = [
    ["busStop", 560, 402, 150, 104],
    ["shop", 1332, 764, 145, 104],
    ["tree", 720, 430, 52, 78],
    ["tree", 1648, 896, 52, 78],
    ["tree", 2212, 778, 52, 78],
    ["lamp", 1280, 456, 27, 72],
    ["lamp", 842, 1162, 27, 72],
    ["sign", 1698, 1190, 74, 84],
  ];
  for (const p of props) drawSprite(sprites.props[p[0]], p[1] - cam.x, p[2] - cam.y, p[3], p[4]);
  for (const [index, s] of level.schools.entries()) {
    drawSchool(s, cam, index === state.priorityIndex);
  }
  for (const o of level.obstacles) {
    if (o.type === 0) drawTrafficJam(o, cam);
    else drawSprite(sprites.obstacles[o.type], o.x - cam.x - o.w / 2, o.y - cam.y - o.h / 2, o.w, o.h);
  }
}

function drawSchool(s, cam, priority) {
  const sprite = sprites.schools[s.kind];
  const w = 260;
  const h = 194;
  const x = s.x - cam.x - w / 2;
  const y = s.y - cam.y - h / 2;
  const drop = schoolDropPoint(s);
  drawSprite(sprite, x, y, w, h);
  drawDeliveryPad(drop.x - cam.x, drop.y - cam.y, s.done, priority);
  drawMarker(drop.x - cam.x, drop.y - cam.y - 56, s.done);
  if (priority && !s.done) {
    text("PRIORITAS", drop.x - cam.x, drop.y - cam.y + 62, 15, state.priorityTime > 0 ? "#ffef75" : "#ff7b72", "center");
  }
}

function drawDeliveryPad(x, y, done, priority = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = done ? "rgba(37, 214, 111, 0.2)" : "rgba(255, 207, 50, 0.2)";
  ctx.strokeStyle = done ? "#25d66f" : priority ? "#fff06a" : "#ffcf32";
  ctx.lineWidth = priority ? 7 : 4;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.ellipse(0, 0, 64, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawTrafficVehicles(cam) {
  for (const vehicle of state.traffic) {
    const sprite = sprites.traffic?.[vehicle.sprite];
    const angle = vehicle.axis === "x" ? (vehicle.direction > 0 ? Math.PI / 2 : -Math.PI / 2) : vehicle.direction > 0 ? Math.PI : 0;
    if (sprite) {
      drawRotatedSprite(sprite, vehicle.x - cam.x, vehicle.y - cam.y, vehicle.axis === "x" ? 50 : 54, vehicle.axis === "x" ? 86 : 92, angle);
    } else {
      drawTrafficFallback(vehicle, cam, angle);
    }
  }
}

function drawTrafficFallback(vehicle, cam, angle) {
  const colors = ["#d74b45", "#e6b33e", "#3e8ac7", "#e7e3d6", "#55a567"];
  ctx.save();
  ctx.translate(Math.round(vehicle.x - cam.x), Math.round(vehicle.y - cam.y));
  ctx.rotate(angle);
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.fillRect(-25, -42, 50, 88);
  ctx.fillStyle = colors[vehicle.sprite % colors.length];
  ctx.fillRect(-24, -44, 48, 84);
  ctx.fillStyle = "#b9dce4";
  ctx.fillRect(-18, -24, 36, 22);
  ctx.fillStyle = "#26383c";
  ctx.fillRect(-27, -28, 6, 18);
  ctx.fillRect(21, -28, 6, 18);
  ctx.fillRect(-27, 18, 6, 18);
  ctx.fillRect(21, 18, 6, 18);
  ctx.fillStyle = "#fff2a8";
  ctx.fillRect(-18, -42, 9, 5);
  ctx.fillRect(9, -42, 9, 5);
  ctx.restore();
}

function drawObjectiveArrow(cam) {
  if (state.priorityIndex < 0) return;
  const school = levels[state.levelIndex].schools[state.priorityIndex];
  if (!school || school.done) return;
  const drop = schoolDropPoint(school);
  const sx = drop.x - cam.x;
  const sy = drop.y - cam.y;
  if (sx > 60 && sx < W - 60 && sy > 140 && sy < H - 60) return;
  const x = clamp(sx, 72, W - 72);
  const y = clamp(sy, 150, H - 72);
  const angle = Math.atan2(sy - H / 2, sx - W / 2);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = state.priorityTime > 0 ? "#ffdd3d" : "#ff685f";
  ctx.strokeStyle = "#17292c";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(22, 0);
  ctx.lineTo(-14, -15);
  ctx.lineTo(-8, 0);
  ctx.lineTo(-14, 15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawDeliveryFx(cam) {
  for (const fx of state.deliveryFx) {
    const p = clamp(fx.t / fx.duration, 0, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const arc = Math.sin(p * Math.PI) * 34;
    const x = fx.fromX + (fx.toX - fx.fromX) * eased;
    const y = fx.fromY + (fx.toY - fx.fromY) * eased - arc;
    const size = 46 - p * 10;
    ctx.save();
    ctx.globalAlpha = 1 - Math.max(0, p - 0.82) / 0.18;
    drawSprite(sprites.food[0], x - cam.x - size / 2, y - cam.y - size / 2, size, size);
    ctx.restore();
  }
}

function drawTrafficJam(o, cam) {
  const x = o.x - cam.x;
  const y = o.y - cam.y;
  const horizontal = o.axis !== "v";
  const jamSprite = horizontal ? sprites.trafficJam?.h : sprites.trafficJam?.v;
  if (jamSprite) {
    drawSprite(jamSprite, x - o.w / 2, y - o.h / 2, o.w, o.h);
    drawSprite(sprites.props.cone, x - o.w / 2 - 18, y + o.h / 2 - 28, 28, 28);
    drawSprite(sprites.props.cone, x + o.w / 2 - 10, y - o.h / 2 - 4, 28, 28);
    drawWarningBadge(x, y - o.h / 2 - 22);
    return;
  }
  if (horizontal) {
    drawRotatedSprite(sprites.traffic[0], x - 62, y - 4, 45, 74, Math.PI / 2);
    drawRotatedSprite(sprites.traffic[2], x - 4, y - 2, 34, 64, Math.PI / 2);
    drawRotatedSprite(sprites.traffic[3], x + 60, y + 2, 54, 82, Math.PI / 2);
    drawSprite(sprites.props.cone, x - 98, y + 34, 24, 34);
    drawSprite(sprites.props.cone, x + 96, y - 44, 24, 34);
  } else {
    drawRotatedSprite(sprites.traffic[1], x - 6, y - 56, 58, 96, 0);
    drawRotatedSprite(sprites.traffic[2], x + 4, y + 18, 34, 64, 0);
    drawRotatedSprite(sprites.traffic[4], x - 2, y + 84, 52, 92, 0);
    drawSprite(sprites.props.cone, x + 44, y - 80, 24, 34);
    drawSprite(sprites.props.cone, x - 62, y + 84, 24, 34);
  }
  drawWarningBadge(x, y - 58);
}

function drawWarningBadge(x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#fbd84d";
  ctx.strokeStyle = "#243236";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  text("!", 0, 8, 22, "#243236", "center");
  ctx.restore();
}

function drawCar(cam) {
  const dirs = state.car.usingUpgrade ? sprites.car2Directions : sprites.carDirections;
  const direction = carDirection();
  const sprite = dirs?.[direction] || (state.car.usingUpgrade ? sprites.car2 : sprites.car);
  if (dirs?.[direction]) {
    const horizontal = direction === "left" || direction === "right";
    drawSprite(sprite, state.car.x - cam.x - (horizontal ? 48 : 37), state.car.y - cam.y - (horizontal ? 35 : 52), horizontal ? 96 : 74, horizontal ? 70 : 104);
  } else {
    drawRotatedSprite(sprite, state.car.x - cam.x, state.car.y - cam.y, 70, 104, state.car.angle + Math.PI / 2);
  }
}

function carDirection() {
  const ax = Math.cos(state.car.angle);
  const ay = Math.sin(state.car.angle);
  if (Math.abs(ax) > Math.abs(ay)) return ax >= 0 ? "right" : "left";
  return ay >= 0 ? "down" : "up";
}

function drawHud() {
  const level = levels[state.levelIndex];
  drawHudBox(18, 16, 360, 110);
  text(`Level ${state.levelIndex + 1}`, 36, 46, 20, "#ffe47a");
  text(level.name, 124, 46, 20, "#fff4c6");
  text(`Score ${state.score}`, 36, 78, 18);
  text(`Coins ${state.coins}   Combo x${state.combo}`, 36, 104, 18, state.combo > 1 ? "#ffe47a" : "#ffffff");
  drawHudBox(982, 16, 280, 110);
  const urgent = state.timeLeft < 18;
  text(`Time ${Math.ceil(state.timeLeft)}s`, 1004, 55, 30, urgent ? "#ff4e55" : "#ffffff");
  text(`Delivery ${state.delivered}/${level.schools.length}`, 1006, 94, 20);
  drawHudBox(404, 16, 552, 72);
  const priorityColor = state.priorityTime > 0 ? "#ffe47a" : "#ff7b72";
  text(`PRIORITAS  ${Math.ceil(state.priorityTime)}s`, W / 2, 46, 19, priorityColor, "center");
  text(state.priorityTime > 0 ? "Kejar marker kuning untuk bonus" : "Bonus hangus - lanjut antar", W / 2, 72, 16, "#dff7ef", "center");
  drawHudBox(18, 644, 340, 58);
  text("MUATAN", 34, 678, 16, "#fff4c6");
  drawBar(122, 658, 214, 24, state.cargo / 100, state.cargo > 55 ? "#34d17b" : state.cargo > 25 ? "#ffce45" : "#ff4e55");
  text(`${Math.ceil(state.cargo)}%`, 229, 677, 15, "#ffffff", "center");
  drawHudBox(958, 644, 304, 58);
  const boostReady = state.car.boostCd <= 0;
  text("BOOST", 976, 678, 16, boostReady ? "#ffe47a" : "#dff7ef");
  drawBar(1050, 658, 190, 24, 1 - state.car.boostCd / 4.2, "#46bff2");
  text(boostReady ? "READY" : `${state.car.boostCd.toFixed(1)}s`, 1145, 677, 14, "#ffffff", "center");
  if (state.messageTimer > 0) {
    drawHudBox(420, 104, 440, 54);
    text(state.message, W / 2, 139, 21, "#fff4c6", "center");
  }
}

function drawBar(x, y, w, h, value, color) {
  ctx.fillStyle = "#0d1b1e";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = color;
  ctx.fillRect(x + 3, y + 3, Math.max(0, (w - 6) * clamp(value, 0, 1)), h - 6);
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
}

function drawMenu() {
  if (audioState.target !== "musicMenu") playBgm("musicMenu");
  ctx.fillStyle = "#1c3638";
  ctx.fillRect(0, 0, W, H);
  drawMap({ x: 640, y: 360 });
  ctx.fillStyle = "rgba(12, 22, 25, 0.62)";
  ctx.fillRect(0, 0, W, H);
  drawSprite(sprites.logo, 410, 24, 460, 312);
  text("Antar makan siang ke sekolah sebelum waktu habis", W / 2, 368, 22, "#dff7ef", "center");
  button("Mulai Pengiriman", 468, 424, 344, 66, () => startLevel(0));
  button("Upgrade Mobil", 498, 508, 284, 58, () => (state.screen = "upgrade"));
  text("WASD / Arrow: kemudi   Space: boost   P / Esc: pause", W / 2, 646, 19, "#d4e6dd", "center");
}

function drawUpgrade() {
  ctx.fillStyle = "#132629";
  ctx.fillRect(0, 0, W, H);
  text("Upgrade Mobil MBG", W / 2, 96, 48, "#fff4c6", "center");
  drawSprite(sprites.car2Side, 436, 120, 410, 230);
  upgradeRow("Boost", "Kecepatan dorong lebih besar", state.boost, 270, () => buy("boost"));
  upgradeRow("Handling", "Belokan lebih responsif", state.handling, 370, () => buy("handling"));
  upgradeRow("Freshness", "Timer turun lebih lambat", state.freshness, 470, () => buy("freshness"));
  text(`Coins: ${state.coins}`, 44, 48, 28, "#fff4c6");
  button("Kembali", 44, 620, 170, 58, () => (state.screen = "menu"));
  button("Main Level Berikutnya", 946, 620, 280, 58, () => startLevel(state.levelIndex));
}

function upgradeRow(name, desc, value, y, cb) {
  drawHudBox(292, y - 42, 696, 82);
  text(`${name} Lv.${value}`, 322, y - 8, 25, "#fff4c6");
  text(desc, 322, y + 22, 18, "#dfeee8");
  button("Beli 6", 840, y - 26, 118, 50, cb);
}

function buy(key) {
  if (state.coins < 6 || state[key] >= 4) return;
  state.coins -= 6;
  state[key] += 1;
}

function drawLevelClear() {
  const finalLevel = state.levelIndex >= levels.length - 1;
  const result = `Bintang ${state.levelStars}/3  |  Muatan ${Math.ceil(state.cargo)}%  |  Prioritas ${state.priorityBonus}`;
  drawOverlay(finalLevel ? "Distribusi Tuntas!" : "Pengiriman Beres!", result, [
    [finalLevel ? "Menu" : "Lanjut", () => (finalLevel ? (state.screen = "menu") : startLevel(state.levelIndex + 1))],
    ["Upgrade", () => (state.screen = "upgrade")],
  ]);
}

function drawFail() {
  const reason = state.cargo <= 0 ? "Muatan rusak total - hindari benturan" : "Waktu habis - kejar rute prioritas";
  drawOverlay("Misi Belum Berhasil", reason, [
    ["Ulangi", () => startLevel(state.levelIndex)],
    ["Menu", () => (state.screen = "menu")],
  ]);
}

function drawPause() {
  ctx.fillStyle = "rgba(10, 16, 18, 0.72)";
  ctx.fillRect(0, 0, W, H);
  drawPanel(390, 245, 500, 190, "PAUSE", "Tekan P atau Esc untuk lanjut");
  button("Lanjut", 535, 368, 210, 54, () => (state.paused = false));
}

function drawOverlay(title, subtitle, actions) {
  ctx.fillStyle = "rgba(10, 16, 18, 0.66)";
  ctx.fillRect(0, 0, W, H);
  drawPanel(350, 210, 580, 280, title, subtitle);
  actions.forEach((a, i) => button(a[0], 425 + i * 230, 402, 190, 58, a[1]));
}

function drawRain() {
  ctx.strokeStyle = "rgba(185, 228, 255, 0.32)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 80; i++) {
    const x = (i * 71 + routePulse * 90) % W;
    const y = (i * 43 + routePulse * 130) % H;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 12, y + 28);
    ctx.stroke();
  }
}

function drawMarker(x, y, done) {
  const marker = done ? sprites.ui?.markerSuccess : sprites.ui?.markerDelivery;
  if (marker) {
    const bob = Math.sin(routePulse) * 5;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.beginPath();
    ctx.ellipse(x, y + bob + 30, 18, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    drawSprite(marker, x - 24, y + bob - 24, 48, 48);
    return;
  }
  ctx.save();
  ctx.translate(x, y + Math.sin(routePulse) * 5);
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(0, 30, 18, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = done ? "#25d66f" : "#ffcf32";
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#243236";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = "#17333a";
  text(done ? "OK" : "!", 0, 7, done ? 14 : 20, "#17333a", "center");
  ctx.restore();
}

function drawCrop(img, crop, x, y, w, h) {
  if (!img || !crop) return;
  ctx.drawImage(img, crop[0], crop[1], crop[2], crop[3], Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function drawSprite(sprite, x, y, w, h) {
  if (!sprite) return;
  ctx.drawImage(sprite, Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function drawRotatedSprite(sprite, x, y, w, h, angle) {
  if (!sprite) return;
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(angle);
  ctx.drawImage(sprite, -w / 2, -h / 2, w, h);
  ctx.restore();
}

function drawHudBox(x, y, w, h) {
  ctx.fillStyle = "rgba(24, 39, 42, 0.84)";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "rgba(255,255,255,0.58)";
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h);
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 5, y + 5, w - 10, h - 10);
}

function drawPanel(x, y, w, h, title, subtitle = "") {
  drawHudBox(x, y, w, h);
  text(title, x + w / 2, y + 74, 36, "#fff4c6", "center");
  if (subtitle) text(subtitle, x + w / 2, y + 122, 20, "#dff7ef", "center");
}

function button(label, x, y, w, h, action) {
  buttons.push({ x, y, w, h, action });
  ctx.fillStyle = "#f7cf4a";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#1d3438";
  ctx.fillRect(x + 5, y + 5, w - 10, h - 10);
  text(label, x + w / 2, y + h / 2 + 8, 24, "#fff4c6", "center");
}

function text(value, x, y, size, color = "#ffffff", align = "left") {
  ctx.font = `700 ${size}px "Trebuchet MS", system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillText(value, x + 1.5, y + 1.5);
  ctx.fillStyle = color;
  ctx.fillText(value, x, y);
}

function loop(now) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;
  buttons.length = 0;
  if (state.screen !== lastTouchScreen) {
    lastTouchScreen = state.screen;
    document.body.classList.toggle("is-playing", state.screen === "play");
  }
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerpAngle(a, b, t) {
  const delta = Math.atan2(Math.sin(b - a), Math.cos(b - a));
  return a + delta * t;
}

function pointerPos(evt) {
  const r = canvas.getBoundingClientRect();
  return {
    x: ((evt.clientX - r.left) / r.width) * W,
    y: ((evt.clientY - r.top) / r.height) * H,
  };
}

function isTouchDevice() {
  return navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;
}

async function enterImmersiveMode() {
  if (!isTouchDevice()) return;
  if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
    try {
      await document.documentElement.requestFullscreen({ navigationUI: "hide" });
    } catch {
      // Some mobile browsers only allow fullscreen after a second explicit tap.
    }
  }
  if (screen.orientation?.lock) {
    try {
      await screen.orientation.lock("landscape");
    } catch {
      // Orientation lock support varies by browser and device.
    }
  }
}

function syncFullscreenState() {
  document.body.classList.toggle("is-fullscreen", Boolean(document.fullscreenElement));
  fullscreenButton?.setAttribute("aria-pressed", String(Boolean(document.fullscreenElement)));
}

canvas.addEventListener("pointerdown", async (evt) => {
  const p = pointerPos(evt);
  const hit = buttons.find((b) => p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h);
  await Promise.allSettled([enterImmersiveMode(), unlockAudio()]);
  if (hit) {
    playSfx("sfxButton");
    hit.action();
  }
  if (audioState.target) playBgm(audioState.target);
});

document.addEventListener("visibilitychange", () => {
  if (!audioState.ready) return;
  if (document.hidden) {
    for (const track of Object.values(audio)) track.pause();
  } else if (audioState.target && audioState.unlocked) {
    playBgm(audioState.target);
  }
});

document.addEventListener("fullscreenchange", syncFullscreenState);
fullscreenButton?.addEventListener("pointerdown", async (evt) => {
  evt.preventDefault();
  evt.stopPropagation();
  await enterImmersiveMode();
});

window.addEventListener("keydown", async (evt) => {
  await unlockAudio();
  if (audioState.target) playBgm(audioState.target);
  const k = evt.key.toLowerCase();
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) evt.preventDefault();
  if ((k === "p" || k === "escape") && state.screen === "play" && !evt.repeat) {
    state.paused = !state.paused;
    state.keys.clear();
    return;
  }
  if (state.paused) return;
  if (["arrowup", "w"].includes(k)) state.keys.add("up");
  if (["arrowdown", "s"].includes(k)) state.keys.add("down");
  if (["arrowleft", "a"].includes(k)) state.keys.add("left");
  if (["arrowright", "d"].includes(k)) state.keys.add("right");
  if (k === " ") state.keys.add("boost");
  if (k === "enter" && state.screen === "menu") {
    startLevel(0);
    if (audioState.target) playBgm(audioState.target);
  }
});

window.addEventListener("keyup", (evt) => {
  const k = evt.key.toLowerCase();
  if (["arrowup", "w"].includes(k)) state.keys.delete("up");
  if (["arrowdown", "s"].includes(k)) state.keys.delete("down");
  if (["arrowleft", "a"].includes(k)) state.keys.delete("left");
  if (["arrowright", "d"].includes(k)) state.keys.delete("right");
});

document.querySelectorAll("#touchControls button").forEach((btn) => {
  const hold = btn.dataset.hold;
  const tap = btn.dataset.tap;
  btn.addEventListener("pointerdown", async (evt) => {
    evt.preventDefault();
    await Promise.allSettled([enterImmersiveMode(), unlockAudio()]);
    if (audioState.target) playBgm(audioState.target);
    if (hold) state.keys.add(hold);
    if (tap) state.keys.add(tap);
  });
  btn.addEventListener("pointerup", () => hold && state.keys.delete(hold));
  btn.addEventListener("pointercancel", () => hold && state.keys.delete(hold));
  btn.addEventListener("pointerleave", () => hold && state.keys.delete(hold));
});

requestAnimationFrame(loop);
boot();
