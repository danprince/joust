import { Constructor, removeFromArray } from "./helpers";

export interface Sprite {
  x: number;
  y: number;
  w: number;
  h: number;
  pivot?: { x: number; y: number };
}

export interface Rectangle {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

type Easing = (t: number) => number;

export class AnimatedSprite {
  frames: Sprite[] = [];
  speed: number = 0;
  private elapsed: number = 0;
  private index = 0;

  constructor(frames: Sprite[], speed: number = 300) {
    this.frames = frames;
    this.speed = speed;
  }

  update() {
    this.elapsed += game.dt;
    while (this.elapsed >= this.speed) {
      this.elapsed -= this.speed;
      this.index += 1;
      this.index %= this.frames.length;
    }
  }

  get sprite() {
    return this.frames[this.index];
  }
}

export class Animation {
  duration: number;
  elapsed: number = 0;
  easing: Easing;
  step: (k: number, t: number) => void;

  constructor({
    duration,
    step,
    easing = t => t,
  }: {
    duration: number;
    step: Animation["step"];
    easing?: Easing;
  }) {
    this.easing = easing;
    this.duration = duration;
    this.step = step;
  }

  reset() {
    this.elapsed = 0;
  }

  update(): boolean {
    this.elapsed += game.dt;
    let t = Math.min(this.elapsed / this.duration, 1);
    let k = this.easing(t);
    this.step(k, t);
    return this.elapsed <= this.duration;
  }
}

export class Behaviour {
  speed = 1000;
  private timer = this.speed;
  object: GameObject = undefined!;

  onTurn() {}
  onAdded() {}
  onRemoved() {}
  onBounce() {}
  onUpdate() {}
  onCollide(target: GameObject) {}

  update() {
    this.onUpdate();
    if (this.timer <= 0) {
      this.timer = this.speed;
      this.onTurn();
    } else {
      this.timer -= game.dt;
    }
  }
}

export class GameObject {
  sprite: Sprite = { x: 0, y: 0, w: 0, h: 0 };
  hitSprite: Sprite | undefined;
  animatedSprite: AnimatedSprite | undefined;

  x: number = 0;
  y: number = 0;
  vx: number = 0;
  vy: number = 0;
  weight: number = 0.025;
  bounds: Rectangle = { x1: 0, y1: 0, x2: 0, y2: 0 };
  colliders: number = 0;
  tags: number = 0;
  behaviours: Behaviour[] = [];

  addBehaviour(behaviour: Behaviour) {
    this.behaviours.push(behaviour);
    behaviour.object = this;
    behaviour.onAdded();
  }

  getBehaviourByType(type: Constructor<Behaviour>): Behaviour | undefined {
    return this.behaviours.find(b => b instanceof type);
  }

  removeBehaviourType(type: Constructor<Behaviour>) {
    let behaviour = this.getBehaviourByType(type);
    behaviour?.onRemoved();
    removeFromArray(this.behaviours, behaviour);
  }

  hasBehaviourType(type: Constructor<Behaviour>) {
    return this.getBehaviourByType(type) != null;
  }

  update() {
    this.updateSprite();
    this.updatePhysics();
    this.updateBounds();
    for (let behaviour of this.behaviours) {
      behaviour.update();
    }
  }

  updateSprite() {
    if (this.animatedSprite) {
      this.animatedSprite?.update();
      this.sprite = this.animatedSprite.sprite;
    }
  }

  updateBounds() {
    this.bounds.x1 = this.x - this.sprite.w / 2;
    this.bounds.y1 = this.y;
    this.bounds.x2 = this.bounds.x1 + this.sprite.w;
    this.bounds.y2 = this.bounds.y1 + this.sprite.h;
  }

  updatePhysics() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.y > 0) {
      this.vy -= this.weight;
    } else {
      this.vy = this.y = 0;
      for (let behaviour of this.behaviours) {
        behaviour.onBounce();
      }
    }
  }
}

function doRectanglesIntersect(a: Rectangle, b: Rectangle): boolean {
  return a.x1 < b.x2 && a.y1 < b.y2 && a.x2 > b.x1 && a.y2 > b.y1;
}

export class Game {
  player: GameObject = undefined!;
  objects: GameObject[] = [];
  animations: Animation[] = [];
  dt: number = 0;
  timer: number = 0;

  addAnimation(animation: Animation) {
    this.animations.push(animation);
  }

  addObject(object: GameObject) {
    this.objects.push(object);
  }

  removeObject(object: GameObject) {
    removeFromArray(this.objects, object);
  }

  update(dt: number) {
    this.dt = dt;
    this.timer += dt;

    this.animations = this.animations.filter(animation => animation.update());

    for (let object of this.objects) {
      object.update();
    }

    for (let object of this.objects) {
      for (let other of this.objects) {
        if (object.colliders & other.tags) {
          if (doRectanglesIntersect(object.bounds, other.bounds)) {
            for (let behaviour of object.behaviours) {
              behaviour.onCollide(other);
            }
          }
        }
      }
    }
  }
}
