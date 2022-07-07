export const uniqArray = (array) => {
  const hash = {};
  return array.filter((item) => {
    return hash[item] ? false : (hash[item] = true);
  });
};

export const checkNull = (obj, ...args) => {
  return args.reduce((acc, method) => {
    if (acc) {
      return acc[method];
    } else return null;
  }, obj);
};
