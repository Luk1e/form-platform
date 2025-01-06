const getRandomAccent = () => {
  const colors = [
    "bg-blue-500/10 text-blue-400",
    "bg-emerald-500/10 text-emerald-400",
    "bg-purple-500/10 text-purple-400",
    "bg-amber-500/10 text-amber-400",
    "bg-rose-500/10 text-rose-400",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default getRandomAccent;
