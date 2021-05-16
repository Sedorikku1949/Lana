module.exports = (values, weights) => {
  let rand = Math.random();
  for (let i = 0; i < weights.length; i++) {
    if (rand <= weights[i]) return values[i];
    rand -= weights[i];
  }
};
