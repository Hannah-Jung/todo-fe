function timeStamps(dateInput) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "";

  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diffSec < 5) return "just now";
  if (diffSec < 60)
    return `${diffSec} ${diffSec === 1 ? "second" : "seconds"} ago`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60)
    return `${diffMin} ${diffMin === 1 ? "minute" : "minutes"} ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} ${diffHr === 1 ? "hour" : "hours"} ago`;

  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} ${diffDay === 1 ? "day" : "days"} ago`;
}

export default timeStamps;
