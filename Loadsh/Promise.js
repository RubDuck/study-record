const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MinePromise {
  constructor(fn) {
    this._status = PENDING;
    this._resolveFn = [];
    this._rejectFn = [];

    const _resolve = (val) => {
      if (this._status !== PENDING) return;
      this._status = REJECTED;
      if (this._resolveFn.length) {
        this._resolveFn.forEach((item) => {
          item(val);
        })
      }
    };

    const _reject = (val) => {
      if (this._status !== PENDING) return;
      this._status = FULFILLED;
      if (this._rejectFn.length) {
        this._rejectFn.forEach((item) => { 
          item(val);
        });
      }
    };

    setTimeout(() => {
      fn(_resolve, _reject);
    }, 0);
  }

  then(resolveCallback, rejectCallback) {
    return new MinePromise((resolve, reject) => {
      const success = (val) => {
        console.log('-------  modify successful', val);
        try {
          const x = resolveCallback(val);
          x instanceof MinePromise ? x.then(resolve, reject) : resolve(x);
        } catch (err) {
          reject(err);
        }
      }

      const fail = (val) => {
        console.log('----------  modify fail ', val);
        try {
          const x = rejectCallback(val);
          x instanceof MinePromise ? x.then(resolve, reject) : resolve(x);
        } catch (err) {
          reject(err);
        }
      }

      if (this._status === PENDING) {
        this._resolveFn.push(success);
        this._rejectFn.push(fail);
      }
      
      if (this._status === FULFILLED) {
        fail();
      }

      if (this._status === REJECTED) {
        success();
      }

    });
  }
}


const a = new MinePromise((resolve , reject) => {
  setTimeout(() => {
    resolve(10)
  }, 3000);
  setTimeout(() => {
    reject('错误');
  }, 2000);
});

a.then((res) => {
  console.log('------  测试resolve ', res);
  return 1
}, (err) => {
  console.log('-----  错误捕获？？？', err);
}).then(res => {
  console.log('----  链式操作：', res);
}).then((e) => {
  console.log('???????//')
})