const convertToNumber = (input) =>
  Object.keys(input).reduce((acc, val) => {
    acc[val] = +input[val];
    return acc;
  }, {});

module.exports = convertToNumber;
