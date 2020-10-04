export const arraysAreEqual = <T>(arrayA: Array<T>, arrayB: Array<T>) =>
  arrayA.length === arrayB.length &&
  arrayA.every((valueA, index) => valueA === arrayB[index]);

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
