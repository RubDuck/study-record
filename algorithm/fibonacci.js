/**
 * fibonacci
 * @param {*} fn 
 * @returns 
 */
const decorate = function(fn) {
  let result = [];
  return function(x) {
    if (result[x] == undefined) {
      result[x] = fn(x);
    }
    return result[x];
  }
}

const fibonacci = decorate(function(x) {
  if (x == 1 || x == 2) return 1;
  return fibonacci(x - 1) + fibonacci(x - 2);
});

