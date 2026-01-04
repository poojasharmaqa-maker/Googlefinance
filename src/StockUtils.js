export const calculatePERatio = (price, eps) => {
  if (price === 'N/A' || eps === 'N/A' || !price || !eps || eps === 0) {
    return 'N/A';
  }
  return (price / eps).toFixed(2);
};
