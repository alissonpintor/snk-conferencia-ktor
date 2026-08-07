export const getRandomInt = (min: number, max: number): number => {
  const minCeiled: number = Math.ceil(min);
  const maxFloored: number = Math.floor(max);
  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}