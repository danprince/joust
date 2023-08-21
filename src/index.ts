import { Game } from "./game";
import { Player, Peasant, King, Couched } from "./objects";
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
    game.player.removeBehaviourType(Couched);
    game.player.vx = -Math.abs(game.player.vx);
  }

  if (key === KEY_RIGHT) {
    game.player.removeBehaviourType(Couched);
    game.player.vx = Math.abs(game.player.vx);
  }

  if (key === KEY_SPACE) toggleCouch();
};

function toggleCouch() {
  if (game.player.hasBehaviourType(Couched)) {
    game.player.removeBehaviourType(Couched);
  } else {
    game.player.addBehaviour(new Couched);
  }
}

let lastTickTime = 0;

function loop(now: number) {
  let dt = now - lastTickTime;
  lastTickTime = now;
  requestAnimationFrame(loop);
  game.update(dt);
  render();
}

function init() {
  window.game = new Game();

  let king = King();
  king.x = c.width / 2;
  game.addObject(king);

  game.player = Player();
  game.addObject(game.player);

  for (let i = 0; i < 100; i++) {
    let unit = Peasant();
    let direction = Math.random() > 0.5 ? 1 : -1;
    unit.x = c.width / 2 + Math.random() * 1000 * direction;
    unit.vx = direction * -Math.random();
    unit.animatedSprite!.speed = 100 + (1 - Math.abs(unit.vx)) * 500;
    game.addObject(unit);
  }

  resize();
  onresize = resize;
  requestAnimationFrame(loop);
}

init();
