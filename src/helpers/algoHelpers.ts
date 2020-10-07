// Shallow equality check
export const arraysAreEqual = <T>(arrayA: Array<T>, arrayB: Array<T>) =>
  arrayA.length === arrayB.length &&
  arrayA.every((valueA, index) => valueA === arrayB[index]);

// Shallow equality check
export const objectsAreEqual = <T extends object>(a: T, b: T) => {
  const entriesA = Object.entries(a);
  if (Object.keys(b).length !== entriesA.length) {
    return false;
  }
  return entriesA.every(([key, valueA]) => b[key as keyof T] === valueA);
};

export const dedupe = <T, K extends keyof T>(array: Array<T>, key: K) => {
  const alreadySeen = new Set<T[K]>();
  const included: Array<T> = [];
  for (const item of array) {
    const identifier = item[key];
    if (!alreadySeen.has(identifier)) {
      alreadySeen.add(identifier);
      included.push(item);
    }
  }
  return included;
};
