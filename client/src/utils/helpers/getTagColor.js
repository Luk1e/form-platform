const getTagColor = (count, maxCount) => {
  const ratio = count / maxCount;
  if (ratio > 0.7) return "blue";
  if (ratio > 0.4) return "geekblue";
  if (ratio > 0.2) return "cyan";
  return "default";
};

export default getTagColor;
