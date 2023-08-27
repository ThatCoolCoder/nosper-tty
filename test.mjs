import readlineSync from 'readline-sync';
import { createInterface } from 'readline';

const input = process.stdin;

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

rl.history.push.apply(rl.history,["toilet"]);      


input.setEncoding('utf8');

// input.on('data', (char) => {
//     char = char.toString()
//     switch (char) {
//         case '\n':
//         case '\r':
//         case '\u0004':
//             stdin.removeListener('data', onData)
//             break
//         case '\u0004':
//             stdin.removeListener('data', onData)
//             break
//         default:
//             process.stdout.write(char);
//             break;
//     }
// });

process.stdout.write("> ");

rl.on('line', (input) => {
    console.log("ball");
    rl.prompt();
});
