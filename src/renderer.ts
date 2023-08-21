import * as sprites from "./sprites";
import { GameObject, Sprite } from "./game";
const CANVAS_WIDTH = (c.width = 340);
const CANVAS_HEIGHT = (c.height = 180);
const CELL_SIZE = 16;
const FLOOR = c.height - CELL_SIZE;

let ctx = c.getContext("2d")!;
let scale = 1;

export function render() {
  ctx.save();
  ctx.fillStyle = "skyblue";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.translate(0, FLOOR);

  for (let x = 0; x < c.width; x += CELL_SIZE) {
    drawSprite(sprites.tile_crowd, x, - CELL_SIZE * 2);
    drawSprite(sprites.tile_wood, x, - CELL_SIZE);
    drawSprite(sprites.tile_rail, x, - CELL_SIZE);
    drawSprite(sprites.tile_dirt, x, 0);
  }

  for (let object of game.objects) {
    drawGameObject(object);
  }

  ctx.restore();
}

export function resize() {
  scale = Math.min(innerWidth / CANVAS_WIDTH, innerHeight / CANVAS_HEIGHT);
  c.style.width = `${CANVAS_WIDTH * scale}px`;
  c.style.height = `${CANVAS_HEIGHT * scale}px`;
}

function drawSprite(sprite: Sprite, x: number, y: number) {
  ctx.drawImage(
    s,
    sprite.x,
    sprite.y,
    sprite.w,
    sprite.h,
    x | 0,
    y | 0,
    sprite.w,
    sprite.h,
  );
}

function drawGameObject(object: GameObject) {
  let offset = object.sprite.w / 2;
  let dy = -object.y - object.sprite.h;
  let flip = object.vx < 0;
  ctx.save();
  ctx.translate(object.x | 0, 0)
  if (flip) ctx.scale(-1, 1);
  drawSprite(object.sprite, -offset, dy);
  ctx.restore();
}
