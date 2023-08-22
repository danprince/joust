import * as sprites from "./sprites";
import { GameObject, Sprite } from "./game";
import { KING } from "./objects";
const CANVAS_WIDTH = (c.width = 340);
const CANVAS_HEIGHT = (c.height = 180);
const CELL_SIZE = 16;
const FLOOR = c.height - CELL_SIZE;

let ctx = c.getContext("2d")!;
let scale = 1;

export function render() {
  drawScene();
  drawUI();
}

export function resize() {
  scale = Math.min(innerWidth / CANVAS_WIDTH, innerHeight / CANVAS_HEIGHT);
  c.style.width = `${CANVAS_WIDTH * scale}px`;
  c.style.height = `${CANVAS_HEIGHT * scale}px`;
}

function drawScene() {
  ctx.save();
  ctx.fillStyle = "skyblue";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.translate(0, FLOOR);

  for (let x = 0; x < c.width; x += CELL_SIZE) {
    drawSprite(sprites.tile_crowd, x, - CELL_SIZE * 2);
    drawSprite(sprites.tile_wood, x, - CELL_SIZE);
  }

  for (let object of game.objects) {
    if (object.layer === 0) {
      drawGameObject(object);
    }
  }

  for (let x = 0; x < c.width; x += CELL_SIZE) {
    drawSprite(sprites.tile_rail, x, - CELL_SIZE);
    drawSprite(sprites.tile_dirt, x, - 2);
  }

  for (let object of game.objects) {
    if (object.layer === 1) {
      drawGameObject(object);
    }
  }

  ctx.restore();
}

function drawUI() {
  ctx.save();
  writeText("DEFEND THE KING", 130, 10, "#fff", "#000");
  writeText("Press [SPACE] to charge", 120, 30, "#ffa423", "#9b510d");
  ctx.restore();
}

function drawSprite(sprite: Sprite, x: number, y: number, w = sprite.w, h = sprite.h) {
  ctx.drawImage(
    s,
    sprite.x,
    sprite.y,
    sprite.w,
    sprite.h,
    x | 0,
    y | 0,
    w | 0,
    h | 0,
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
  if (object.tags & KING) {
    drawHealthBar(object.x, object.y + 2, 21, object.hitpoints / object.maxHitpoints);
  }
}

function drawHealthBar(x: number, y: number, width: number, value: number) {
  ctx.save();
  ctx.translate((x - width / 2) | 0, y | 0);
  ctx.fillStyle = "#222034";
  ctx.fillRect(0, 0, width, 3);
  ctx.fillStyle = "#45283c";
  ctx.fillRect(1, 1, width - 2, 1);
  ctx.fillStyle = "#ac3232";
  ctx.fillRect(1, 1, (width - 2) * value, 1);
  ctx.restore();
}

const GLYPH_WIDTH = 5;
const GLYPH_HEIGHT = 7;

const GLYPH_WIDTH_OVERRIDES: Record<string | number, number> = {
  i: 3,
  j: 3,
  l: 3,
  c: 4,
  t: 4,
  y: 4,
  r: 4,
  e: 4,
  f: 4,
  g: 4,
  h: 4,
  o: 4,
  q: 4,
  p: 4,
  v: 4,
  z: 3,
  s: 4,
  n: 4,
  I: 4,
  N: 6,

  m: 6,
  w: 6,
  "[": 3,
  "]": 3,
  "|": 2,
  " ": 3,
};

let tintCache: Record<string, HTMLCanvasElement> = {};

function tint(color: string): HTMLCanvasElement {
  if (tintCache[color]) return tintCache[color];
  let canvas = document.createElement("canvas");

  // Sprites haven't loaded yet, but we still need to give back a canvas
  if (!s.width) return canvas;

  let ctx = canvas.getContext("2d")!;
  canvas.width = s.width;
  canvas.height = s.height;
  ctx.fillStyle = color;
  ctx.globalCompositeOperation = "multiply";
  ctx.fillRect(0, 0, s.width, s.height);
  ctx.drawImage(s, 0, 0);
  ctx.globalCompositeOperation = "destination-atop";
  ctx.drawImage(s, 0, 0);
  return tintCache[color] = canvas;
}

function writeText(text: string, x: number, y: number, color: string, shadow?: string): void {
  let dx = Math.round(x);
  let dy = Math.round(y);
  let source = tint(color);

  for (let ch of text) {
    let code = ch.charCodeAt(0) - 32;
    let gx = code % 32;
    let gy = code / 32 | 0;
    let sx = sprites.font.x + gx * GLYPH_WIDTH;
    let sy = sprites.font.y + gy * GLYPH_HEIGHT;
    let sw = GLYPH_WIDTH;
    let sh = GLYPH_HEIGHT;

    if (shadow) {
      let source = tint(shadow);
      ctx.drawImage(source, sx, sy, sw, sh, dx + 1, dy, sw, sh);
      ctx.drawImage(source, sx, sy, sw, sh, dx, dy + 1, sw, sh);
      ctx.drawImage(source, sx, sy, sw, sh, dx + 1, dy + 1, sw, sh);
    }

    ctx.drawImage(source, sx, sy, sw, sh, dx, dy, sw, sh);
    dx += GLYPH_WIDTH_OVERRIDES[ch] ?? GLYPH_WIDTH;
  }
}
