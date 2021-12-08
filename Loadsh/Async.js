function run(gen) {
  return new Promise((resolve, reject) => {
    var fn = gen();
    function _next(val) {
      try {
        var g = fn.next(val);
      } catch(err) {
        return reject(err);
      }

      if (g.done) {
        return resolve(g.value)
      }
  
      Promise.resolve(g.value).then((values) => {
        _next(values);
      });
    }
    _next();
  });
}

function* test() {
  yield 1;
  yield 2;
  yield 3;
}

run(test);