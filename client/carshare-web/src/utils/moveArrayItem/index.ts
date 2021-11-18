function moveArrayItem<T>(array: T[], fromIndex: number, toIndex: number) {
  const smallerIndex = Math.min(fromIndex, toIndex);
  const largerIndex = Math.max(fromIndex, toIndex);

  return [
    ...array.slice(0, smallerIndex),
    ...(fromIndex < toIndex
      ? array.slice(smallerIndex + 1, largerIndex + 1)
      : []),
    array[fromIndex],
    ...(fromIndex > toIndex ? array.slice(smallerIndex, largerIndex) : []),
    ...array.slice(largerIndex + 1),
  ];
}

export default moveArrayItem;
