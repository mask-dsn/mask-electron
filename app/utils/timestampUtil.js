function getDateFromTimestamp(timestamp) {
  const date = new Date(timestamp);
  const time = date.toLocaleString();
  return time;
}

export { getDateFromTimestamp };
