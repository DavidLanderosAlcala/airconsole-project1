var Benchmark = require("benchmark");

function compile_fib() {
  "use asm";
 
  function fib(n) {
    n = n|0;
    var f1=0;
    var f2=0;
    if (n >>> 0 < 3) {
      return 1|0;
    }
    f1=fib(n-1|0)|0;
    f2=fib(n-2|0)|0;
    return (f1 + f2)|0;
  }
 
  return fib;
}

var fib = compile_fib();

update1();
update2();

var suite = new Benchmark.Suite;

// add tests
suite.add('asm.js', update1)
.add('normal js', update2)


.on('cycle', function(event) {
  console.log(String(event.target));
})

.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})

.run({ 'async': true });


function update1()
{
    fib(10);
}

function update2()
{
    fibonacci(10);
}

function fibonacci(n) {
   return n < 1 ? 0
        : n <= 2 ? 1
        : fibonacci(n - 1) + fibonacci(n - 2);
}