export function getRandomId(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomElement(array: Array<any>) {
  return array[Math.floor(Math.random() * array.length - 1)];
}
