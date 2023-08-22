import { Game, GameObject } from "./game";
import { chance, randomElement } from "./helpers";
import { Player, Peasant, King, Charging, Knight } from "./objects";
import { render, resize } from "./renderer";

declare global {
  let c: HTMLCanvasElement;
  let s: HTMLImageElement;
  let game: Game;
  interface Window {
    game: Game;
  }
}

const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_SPACE = 32;

onkeydown = ({ which: key }) => {
  if (key === KEY_LEFT) {
    game.player.removeBehaviourType(Charging);
    game.player.vx = -Math.abs(game.player.vx);
  }

  if (key === KEY_RIGHT) {
    game.player.removeBehaviourType(Charging);
    game.player.vx = Math.abs(game.player.vx);
  }

  if (key === KEY_SPACE) {
    if (!game.player.hasBehaviourType(Charging)) {
      game.player.addBehaviour(new Charging);
    }
  }
};

let lastTickTime = 0;
let spawnTimer = 0;
let spawnRate = 800;

function loop(now: number) {
  let dt = now - lastTickTime;
  spawnTimer += dt;
  lastTickTime = now;

  while (spawnTimer > spawnRate) {
    spawnTimer -= spawnRate;
    spawn();
  }

  requestAnimationFrame(loop);
  game.update(dt);
  render();
}

function spawn() {
  let unit: GameObject;
  let direction = randomElement([1, -1])

  if (chance(0.2)) {
    unit = Knight();
  } else {
    unit = Peasant();
  }

  unit.vx *= -direction;

  if (direction > 0) {
    unit.x = c.width;
  }

  game.addObject(unit);
}

function init() {
  window.game = new Game();

  let king = King();
  king.x = c.width / 2;
  game.addObject(king);

  game.player = Player();
  game.addObject(game.player);

  resize();
  onresize = resize;
  requestAnimationFrame(loop);
}

init();
