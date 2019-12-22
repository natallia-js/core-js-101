/* *********************************************************************************************
 *                                                                                             *
 * Plese read the following tutorial before implementing tasks:                                *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions                     *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments       *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures                            *
 *                                                                                             *
 ********************************************************************************************* */


/**
 * Returns the functions composition of two specified functions f(x) and g(x).
 * The result of compose is to be a function of one argument, (lets call the argument x),
 * which works like applying function f to the result of applying function g to x, i.e.
 *  getComposition(f,g)(x) = f(g(x))
 *
 * @param {Function} f
 * @param {Function} g
 * @return {Function}
 *
 * @example
 *   getComposition(Math.sin, Math.asin)(x) => Math.sin(Math.asin(x))
 *
 */
function getComposition(f, g) {
  function compF(...args) {
    return f.call(this, g.call(this, ...args));
  }
  return compF;
}


/**
 * Returns the math power function with the specified exponent
 *
 * @param {number} exponent
 * @return {Function}
 *
 * @example
 *   const power2 = getPowerFunction(2); // => x^2
 *   power2(2) => 4
 *   power2(4) => 16
 *
 *   const power05 = getPowerFunction(0.5); // => x^0.5
 *   power05(4) => 2
 *   power05(16) => 4
 *
 */
function getPowerFunction(exponent) {
  function f(arg) {
    return arg ** exponent;
  }
  return f;
}


/**
 * Returns the polynom function of one argument based on specified coefficients.
 * See: https://en.wikipedia.org/wiki/Polynomial#Definition
 *
 * @params {integer}
 * @return {Function}
 *
 * @example
 *   getPolynom(2,3,5) => y = 2*x^2 + 3*x + 5
 *   getPolynom(1,-3)  => y = x - 3
 *   getPolynom(8)     => y = 8
 *   getPolynom()      => null
 */
function getPolynom(...args) {
  function f(x) {
    let coefNum = args.length - 1;
    return args.reduce((sum, coef) => {
      const res = coef * (x ** coefNum);
      coefNum -= 1;
      return sum + res;
    }, 0);
  }
  return args ? f : null;
}


/**
 * Memoizes passed function and returns function
 * which invoked first time calls the passed function and then always returns cached result.
 *
 * @params {Function} func - function to memoize
 * @return {Function} memoized function
 *
 * @example
 *   const memoizer = memoize(() => Math.random());
 *   memoizer() => some random number  (first run, evaluates the result of Math.random())
 *   memoizer() => the same random number  (second run, returns the previous cached result)
 *   ...
 *   memoizer() => the same random number  (next run, returns the previous cached result)
 */
function memoize(func) {
  let res;

  function memoizer() {
    if (!res) {
      res = func.call();
    }
    return res;
  }
  return memoizer;
}


/**
 * Returns the function trying to call the passed function and if it throws,
 * retrying it specified number of attempts.
 *
 * @param {Function} func
 * @param {number} attempts
 * @return {Function}
 *
 * @example
 * const attempt = 0, retryer = retry(() => {
 *      if (++attempt % 2) throw new Error('test');
 *      else return attempt;
 * }, 2);
 * retryer() => 2
 */
/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
function retry(func, attempts) {
  function trier() {
    let res;
    for (let i = 0; i < attempts + 1; i += 1) {
      try {
        res = func.call();
        break;
      } catch (e) {
      }
    }
    return res;
  }
  return trier;
}


/**
 * Returns the logging wrapper for the specified method,
 * Logger has to log the start and end of calling the specified function.
 * Logger has to log the arguments of invoked function.
 * The fromat of output log is:
 * <function name>(<arg1>, <arg2>,...,<argN>) starts
 * <function name>(<arg1>, <arg2>,...,<argN>) ends
 *
 *
 * @param {Function} func
 * @param {Function} logFunc - function to output log with single string argument
 * @return {Function}
 *
 * @example
 *
 * const cosLogger = logger(Math.cos, console.log);
 * const result = cosLogger(Math.PI));     // -1
 *
 * log from console.log:
 * cos(3.141592653589793) starts
 * cos(3.141592653589793) ends
 *
 */
function logger(func, logFunc) {
  function f(...args) {
    function getArgStringRepresentation(arg) {
      switch (typeof arg) {
        case 'string':
          return `"${arg.toString()}"`;
        case 'object':
          if (Array.isArray(arg)) {
            return `[${arg.reduce((acc, el, index) => {
              let r = acc + getArgStringRepresentation(el);
              if (index !== arg.length - 1) {
                r += ',';
              }
              return r;
            }, '')}]`;
          }
          break;
        default:
          break;
      }
      return arg.toString();
    }
    const argsStr = args.map((el) => getArgStringRepresentation(el)).join(',');

    logFunc.call(this, `${func.name}(${argsStr}) starts`);
    const res = func.call(this, ...args);
    logFunc.call(this, `${func.name}(${argsStr}) ends`);
    return res;
  }
  return f;
}


/**
 * Return the function with partial applied arguments
 *
 * @param {Function} fn
 * @return {Function}
 *
 * @example
 *   const fn = function(x1,x2,x3,x4) { return  x1 + x2 + x3 + x4; };
 *   partialUsingArguments(fn, 'a')('b','c','d') => 'abcd'
 *   partialUsingArguments(fn, 'a','b')('c','d') => 'abcd'
 *   partialUsingArguments(fn, 'a','b','c')('d') => 'abcd'
 *   partialUsingArguments(fn, 'a','b','c','d')() => 'abcd'
 */
function partialUsingArguments(fn, ...args1) {
  function f(...args2) {
    return fn.call(this, ...args1, ...args2);
  }
  return f;
}


/**
 * Returns the id generator function that returns next integer starting
 * from specified number every time when invoking.
 *
 * @param {Number} startFrom
 * @return {Function}
 *
 * @example
 *   const getId4 = getIdGenerator(4);
 *   const getId10 = gerIdGenerator(10);
 *   getId4() => 4
 *   getId10() => 10
 *   getId4() => 5
 *   getId4() => 6
 *   getId4() => 7
 *   getId10() => 11
 */
function getIdGeneratorFunction(startFrom) {
  let nextId = startFrom - 1;

  function f() {
    nextId += 1;
    return nextId;
  }

  return f;
}


module.exports = {
  getComposition,
  getPowerFunction,
  getPolynom,
  memoize,
  retry,
  logger,
  partialUsingArguments,
  getIdGeneratorFunction,
};
