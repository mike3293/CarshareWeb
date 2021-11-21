const getDurationString = (durationSec: number) => {
  const hours = Math.floor(durationSec / 3600);
  const minutes = Math.floor((durationSec - hours * 3600) / 60);
  const seconds = durationSec - hours * 3600 - minutes * 60;

  if (!hours && !minutes && seconds) {
    return `${seconds} сек`;
  }

  return `${hours ? `${hours} ч ` : ""}${minutes} мин`;
};

export default getDurationString;
