export const getBaseUnitParams = (units) => {
  let params = {};

  units.forEach((unit) => {
    if (unit.base) {
      params = unit;
    }
  });

  return params;
};