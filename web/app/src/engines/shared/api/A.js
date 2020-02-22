export function getAsset(game, assetId) {
  return game.assets.find(a => a.assetId === assetId);
}