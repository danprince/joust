import { AnimatedSprite, Behaviour, GameObject } from "./game";
import * as sprites from "./sprites";

// Tags
const PLAYER = 1;
const ENEMY = 2;

export class DespawnOnBounce extends Behaviour {
  override onBounce(): void {
    game.removeObject(this.object);
  }
}

export class Couched extends Behaviour {
  private originalSprite: AnimatedSprite | undefined;
  private originalVx: number = 0;
  override speed: number = 1000;

  override onAdded(): void {
    this.originalVx = this.object.vx;
    this.object.vx *= 1.5;
    this.originalSprite = this.object.animatedSprite;
    this.object.animatedSprite = new AnimatedSprite([
      sprites.knight_couch_1,
      sprites.knight_couch_2,
    ]);
  }

  override onTurn(): void {
    this.object.removeBehaviourType(Couched);
  }

  override onRemoved(): void {
    this.object.vx = this.originalVx;
    this.object.animatedSprite = this.originalSprite;
  }

  override onCollide(target: GameObject) {
    target.vx = this.object.vx * (1 + Math.random() / 10);
    target.vy = 30;
    target.sprite = target.hitSprite || target.sprite;
    target.animatedSprite = undefined;
    target.addBehaviour(new DespawnOnBounce());
  };
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
  object.weight = 0.05;
  return object;
}

export function Peasant() {
  let object = new GameObject();
  object.tags = ENEMY;
  object.vx = 25;
  object.animatedSprite = new AnimatedSprite([
    sprites.villager_1_walk_1,
    sprites.villager_1_walk_2,
  ]);
  object.hitSprite = sprites.villager_1_hit;
  return object;
}

export function King() {
  let object = new GameObject();
  object.animatedSprite = new AnimatedSprite([
    sprites.the_king_walk_1,
    sprites.the_king_walk_2,
  ]);
  object.vx = 10;
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
