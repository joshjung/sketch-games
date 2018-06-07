export function seed(i) {
  this.randSeed = i;
}

export function rand(min = 0.0, max = 1.0) {
  if (this.randSeed === undefined) {
    throw new Error('Please provide a seed to the random number generator via M.seed(n)');
  }
  const x = Math.sin(this.randSeed++) * 10000;
  const r = x - Math.floor(x);

  return min + (r * (max - min));
}
