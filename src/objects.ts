import { AnimatedSprite, Animation, Behaviour, GameObject } from "./game";
import { randomElement } from "./helpers";
import * as sprites from "./sprites";

// Tags
const PLAYER = 1;
const ENEMY = 2;

class DespawnOnBounce extends Behaviour {
  override onBounce(): void {
    game.removeObject(this.object);
  }
}

export function Player() {
  let object = new GameObject();
  object.tags = PLAYER;
  object.colliders = ENEMY;
  object.sprite = sprites.knight_1;
  object.animatedSprite = new AnimatedSprite([sprites.knight_1, sprites.knight_ride_2]);
  object.vx = 1.2;
  object.x = c.width / 2;
  object.weight = 0.05;

  let charge = new Behaviour();
  charge.onCollide = (target: GameObject) => {
    target.vx = object.vx * (1 + Math.random());
    target.vy = 1 + Math.random();
    target.sprite = target.hitSprite || target.sprite;
    target.animatedSprite = undefined;
    target.addBehaviour(new DespawnOnBounce);
  };
  object.addBehaviour(charge)

  return object;
}

export function Peasant() {
  let object = new GameObject();
  object.tags = ENEMY;
  object.animatedSprite = new AnimatedSprite([sprites.villager_1_walk_1, sprites.villager_1_walk_2]);
  object.hitSprite = sprites.villager_1_hit;
  return object;
}

export function King() {
  let object = new GameObject();
  object.sprite = sprites.the_king;
  object.vx = -0.25;
  let patrol = new Behaviour();
  patrol.speed = 3000;
  patrol.onTurn = () => (object.vx *= -1);
  object.addBehaviour(patrol);
  return object;
}
