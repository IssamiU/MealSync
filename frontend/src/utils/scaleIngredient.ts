/**
 * Recalcula a quantidade de um ingrediente baseado na proporção de porções.
 * @param quantity - quantidade original do ingrediente
 * @param baseServings - número de porções original da receita
 * @param targetServings - número de porções desejado pelo usuário
 * @returns quantidade recalculada arredondada em 2 casas decimais
 */
export function scaleIngredient(
  quantity: number,
  baseServings: number,
  targetServings: number
): number {
  if (baseServings === 0) return quantity;
  const scaled = (quantity * targetServings) / baseServings;
  return Math.round(scaled * 100) / 100;
}
