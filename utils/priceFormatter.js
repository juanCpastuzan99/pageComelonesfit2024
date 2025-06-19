/**
 * Formatea un precio para mostrar puntos como separadores de miles
 * @param {number} price - El precio a formatear
 * @param {number} decimals - Número de decimales (por defecto 2)
 * @returns {string} - Precio formateado con puntos
 */
export const formatPrice = (price, decimals = 2) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return `0.${'0'.repeat(decimals)}`;
  }

  // Convertir a string con los decimales especificados
  const priceString = price.toFixed(decimals);
  
  // Separar la parte entera y decimal
  const [integerPart, decimalPart] = priceString.split('.');
  
  // Agregar puntos cada 3 dígitos desde la derecha
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  // Retornar con la parte decimal
  return `${formattedInteger}${decimalPart ? `.${decimalPart}` : ''}`;
};

/**
 * Formatea un precio para mostrar en formato de moneda colombiana
 * @param {number} price - El precio a formatear
 * @param {number} decimals - Número de decimales (por defecto 2)
 * @returns {string} - Precio formateado con símbolo de peso
 */
export const formatCurrency = (price, decimals = 2) => {
  const formattedPrice = formatPrice(price, decimals);
  return `$${formattedPrice}`;
}; 