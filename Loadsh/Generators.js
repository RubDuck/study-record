var GenPrototype = {
  next() {},
  return() {},
  throw() {},
  toString() {},
  Symbol() {},
};

var runtime = {
  wrap: function(innerFn, outFn, self, localList) {
    var generator = Object.create(outFn).prototype;
    var context = new Context(localList || []);
    generator._invoke = makeInvokenMethod(innerFn, self, context);;
  },
  mark: function(genFn) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFn, GenPrototype)
    } else {
      genFn.__proto__ = GenPrototype;
    }
    return genFn;
  },

}


var marked = [example].map(runtime.mark);

function example() {
  return runtime.wrap(function ogn(context) {
    while(1) {
      switch (context.prev = context.next) {
        case 0:
          context.next = 2;
          return 1;
        case 2:
          context.next = 4;
          return 2;
        case 4:
          context = 6;
          return 3;
        case 'end':
          return context.stop();
      }
    }
  }, marked[0], this);
}

function makeInvokenMethod() {}



/**
 * simple generators
 */

function gen$(_context) {
  while(1) {
    switch (_context.prev = _context.next) {
      case 0:
        _context.next = 2;
        return 'result1';

      case 2:
        _context.next = 4;
        return 'result2';

      case 4:
        _context.next = 6;
        return 'result3';

      case 6:
      case "end":
        return _context.stop();
      }
    }
  }
}

// 低配版context  
var context = {
  next:0,
  prev: 0,
  done: false,
  stop: function stop () {
    this.done = true
  }
}

// 低配版invoke
let gen = function() {
  return {
    next: function() {
      value = context.done ? undefined: gen$(context)
      done = context.done
      return {
        value,
        done
      }
    }
  }
} 

// 测试使用
var g = gen() 
