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

type Comparator<T> = (a: T, b: T) => number;

export const spliceIntoSortedArray = <T>(
  array: Array<T>,
  newItem: T,
  comparator: Comparator<T>
) => {
  const index = findPositionInSortedArray(array, newItem, comparator);
  if (index === -1) {
    array.push(newItem);
  } else {
    array.splice(index, 0, newItem);
  }
  return array;
};

const findPositionInSortedArrayRecursive = <T>(
  array: Array<T>,
  searchItem: T,
  comparator: Comparator<T>,
  startIndex: number,
  endIndex: number
): number => {
  if (startIndex > endIndex) {
    return -1;
  }
  const midIndex = Math.floor((endIndex + startIndex) / 2);
  const compareResults = comparator(searchItem, array[midIndex]);

  if (compareResults < 0) {
    if (!midIndex || comparator(searchItem, array[midIndex - 1]) > 0) {
      return midIndex;
    }
    return findPositionInSortedArrayRecursive(
      array,
      searchItem,
      comparator,
      startIndex,
      midIndex - 1
    );
  } else if (compareResults > 0) {
    return findPositionInSortedArrayRecursive(
      array,
      searchItem,
      comparator,
      midIndex + 1,
      endIndex
    );
  } else {
    return midIndex;
  }
};

export const findPositionInSortedArray = <T>(
  array: Array<T>,
  searchItem: T,
  comparator: Comparator<T>
) =>
  findPositionInSortedArrayRecursive(
    array,
    searchItem,
    comparator,
    0,
    array.length - 1
  );
