export const filterConsecutive = <T>(
  array: Array<T>,
  predicate: (value: T, index: number, array: Array<T>) => boolean,
  startIndex: number
) => {
  const filteredItems: Array<T> = [];
  for (let index = startIndex; index < array.length; index++) {
    const value = array[index];
    if (predicate(value, index, array)) {
      filteredItems.push(value);
    } else {
      return filteredItems;
    }
  }
  return filteredItems;
};

export const arraysAreEqual = <T>(arrayA: Array<T>, arrayB: Array<T>) =>
  arrayA.length === arrayB.length &&
  arrayA.every((valueA, index) => valueA === arrayB[index]);
