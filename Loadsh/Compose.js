/**
 * Promise
 */

const compose = function(...args) {
  let init = args.pop();
  return function(...arg) {
    return args.reverse().reduce(function(sequence, fn) {
      return sequence.then((result) => {
        return fn.call(null, result);
      })
    }, Promise.resolve(init.apply(null, arg)))
  }
}