export const insertDefaultIfNotFound =
  <T>(array: T[]) =>
  (predicate: (elem: T) => boolean) =>
  (defaultElem: T): T[] =>
    array.find(predicate) ? array : [...array, defaultElem]
