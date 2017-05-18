var Fiber = require('fibers');
 
function sleep(ms) {
    var fiber = Fiber.current;
    setTimeout(function() {
        console.log('a')
        fiber.run();

    }, ms);
    Fiber.yield();
    console.log('ssdf');
}
function sleep1(ms) {
    var fiber = Fiber.current;
    setTimeout(function() {
        fiber.run();
    }, ms);

}
Fiber(function() {
    console.log('wait1... ' + new Date);
    sleep(1000);
    console.log('ok1... ' + new Date);
}).run();
Fiber(function() {
    console.log('wait2... ' + new Date);
    sleep(1000);
    console.log('ok2... ' + new Date);
}).run();
console.log('back in main');