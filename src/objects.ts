import { AnimatedSprite, Behaviour, GameObject } from "./game";
import { randomInt } from "./helpers";
import * as sprites from "./sprites";

// Tags
export const NONE = 0;
export const PLAYER = 1;
export const ENEMY = 2;
export const KING = 4;

export class DespawnOnBounce extends Behaviour {
  override onBounce(): void {
    game.removeObject(this.object);
  }
}

export class Charging extends Behaviour {
  private originalSprite: AnimatedSprite | undefined;
  private speedModifier: number = 1.5;
  override speed: number = 1000;

  override onAdded(): void {
    this.object.vx *= this.speedModifier;
    this.originalSprite = this.object.animatedSprite;
    this.object.animatedSprite = new AnimatedSprite([
      sprites.knight_couch_1,
      sprites.knight_couch_2,
    ]);
  }

  override onTurn(): void {
    this.object.removeBehaviourType(Charging);
  }

  override onRemoved(): void {
    this.object.vx /= this.speedModifier;
    this.object.animatedSprite = this.originalSprite;
  }

  override onCollide(target: GameObject) {
    target.vx = randomInt(this.object.vx * 2);
    target.vy = 50 + randomInt(50);
    target.sprite = target.hitSprite || target.sprite;
    target.animatedSprite = undefined;
    target.tags = NONE;
    target.bounces = false;
    target.addBehaviour(new DespawnOnBounce());
  }
}

export function Player() {
  let object = new GameObject();
  object.tags = PLAYER;
  object.colliders = ENEMY;
  object.layer = 0;
  object.animatedSprite = new AnimatedSprite([
    sprites.knight_ride_1,
    sprites.knight_ride_2,
  ]);
  object.vx = 50;
  object.x = c.width / 2;
  return object;
}

export function Footman() {
  let object = new GameObject();
  object.tags = ENEMY;
  object.vx = 25;
  object.animatedSprite = new AnimatedSprite([
    sprites.footman_walk_1,
    sprites.footman_walk_2,
  ]);
  object.hitSprite = sprites.footman_hit;
  return object;
}

export function Bearer() {
  let object = Footman();
  object.vx = 15;
  object.animatedSprite = new AnimatedSprite([
    sprites.bearer_walk_1,
    sprites.bearer_walk_2,
  ]);
  return object;
}

export function King() {
  let object = new GameObject();
  object.tags |= KING;
  object.colliders |= ENEMY;
  object.hitpoints = object.maxHitpoints = 10;
  object.animatedSprite = new AnimatedSprite([
    sprites.the_king_walk_1,
    sprites.the_king_walk_2,
  ]);
  object.vx = 10;

  let combat = new Behaviour();
  combat.onCollide = target => {
    game.removeObject(target);
    object.hitpoints -= 1;
    if (object.hitpoints <= 0) {
      game.speed = 0;
    }
  };
  object.addBehaviour(combat);

  let patrol = new Behaviour();
  patrol.speed = 3000;
  patrol.onTurn = () => (object.vx *= -1);
  object.addBehaviour(patrol);

  return object;
}

export function Knight() {
  let object = new GameObject();
  object.vx = 50;
  object.tags = ENEMY;
  object.layer = 1;
  object.hitSprite = sprites.knight_2_hit;
  object.animatedSprite = new AnimatedSprite([
    sprites.knight_2_ride_1,
    sprites.knight_2_ride_2,
  ]);
  return object;
}
