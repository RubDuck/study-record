function Instanceof(leftvalue, rightvalue) {
  let child = leftvalue.__proto__;
  let parent = rightvalue.prototype;

  while(true) {
    if (!child) return false;
    if (child === parent) {
      return true;
    }
    child = child.__proto__;
  }
}