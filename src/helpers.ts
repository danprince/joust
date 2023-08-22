export interface Constructor<T> {
  new (...args: any[]): T;
}

export function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function removeFromArray<T>(array: T[], element: T) {
  let index = array.indexOf(element);
  if (index >= 0) array.splice(index, 1);
}

export function chance(probability: number): boolean {
  return Math.random() < probability;
}

export function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}
