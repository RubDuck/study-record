Function.prototype.myCall = function(context) {
  const parent = context || window;
  const args = arguments.slice(1);
  parent.fn = this;
  const result = parent.fn(...args);
  delete parent.fn;
  return result;
}

Function.prototype.myApply = function(context, argss) {
  let result;
  const parent = context || window;
  const args = argss;
  parent.fn = this;
  if (args) {
    result = parent.fn(...args);
  } else {
    result = parent.fn();
  }
  delete parent.fn;
  return result;
}

Function.prototype.myBind = function(context) {
  let result;
  const parent = context || window;
  const self = this;
  const argument = [...arguments].slice(1);
  const fn = function () {};
  result = function (args) {
    return self.call(this instanceof result ? this : context, argument.concat(args));
  }
  fn.prototype = this.prototype;
  result.prototype = new fn();
  return result; 
}