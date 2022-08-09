import CHIP8 from "./CHIP8.js"


function Logger() {
    this.log = function (msg) {
        console.log(msg);
    }
}

const cpu = new CHIP8(new Logger());
cpu._0NNN();