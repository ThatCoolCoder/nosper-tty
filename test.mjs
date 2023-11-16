import readlineSync from 'readline-sync';
import { createInterface } from 'readline';

const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
})

var oldaddhist = rl._addHistory;
rl._addHistory = function() {
    var last = rl.history[0];
    var line = oldaddhist.call(rl);
    return line;
}

rl.history.push("toilet");      

process.stdin.setEncoding('utf8');

process.stdout.write("> ");

rl.on('line', (input) => {
    console.log("you said " + input);
    rl.prompt();
});
