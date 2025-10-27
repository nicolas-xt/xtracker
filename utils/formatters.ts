export const parseDuration = (duration: string): number => {
  let totalSeconds = 0;
  const minMatch = duration.match(/(\d+)min/);
  const secMatch = duration.match(/(\d+)s/);

  if (minMatch) {
    totalSeconds += parseInt(minMatch[1], 10) * 60;
  }
  if (secMatch) {
    totalSeconds += parseInt(secMatch[1], 10);
  }
  return totalSeconds;
};