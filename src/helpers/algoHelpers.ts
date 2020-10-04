export const arraysAreEqual = <T>(arrayA: Array<T>, arrayB: Array<T>) =>
  arrayA.length === arrayB.length &&
  arrayA.every((valueA, index) => valueA === arrayB[index]);
