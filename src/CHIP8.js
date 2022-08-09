

function CHIP8(LOGGER) {


    this.Logger = LOGGER;

    // Program Memory
    this.memory = new Array(4096).fill(0);

    // General Purpose Registers 
    this.rGPIO = new Array(16).fill(0);

    // Display Buffer
    this.displayBuffer = new Uint8ClampedArray(32 * 64).fill(0);

    // Stack
    this.stack = new Array()

    // Current State Of Each Key (0-F, Hex)
    this.keyStates = new Array(16).fill(0);


    // Fonts
    this.fonts = [
        0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
        0x20, 0x60, 0x20, 0x20, 0x70, // 1
        0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
        0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
        0x90, 0x90, 0xF0, 0x10, 0x10, // 4
        0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
        0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
        0xF0, 0x10, 0x20, 0x40, 0x40, // 7
        0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
        0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
        0xF0, 0x90, 0xF0, 0x90, 0x90, // A
        0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
        0xF0, 0x80, 0x80, 0x80, 0xF0, // C
        0xE0, 0x90, 0x90, 0x90, 0xE0, // D
        0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
        0xF0, 0x80, 0xF0, 0x80, 0x80  // F
    ];

    // Current Opcode Being Executed
    this.opcode = 0;

    // 16-bit register for storing memory address
    this.rI = 0;

    // Program Counter
    this.pc = 0;


    // Timers
    this.delay_timer = 0;
    this.sound_timer = 0;


    // OP Map
    this.opMap = {
        0: () => { console.log('op1'); }
    };

    // Represents Address Of Specific Registers
    this.vx = 0;
    this.vy = 0;

    // Calls machine code routine NNN
    this._0NNN = () => {

        // Get Op
        const extracted_op = this.opcode & 0xf0ff;

        // Test If Op Exists And If So Execute
        const opToExecute = this.opMap?.[extracted_op];
        if (opToExecute) {
            opToExecute();
        } else {
            this?.Logger?.warn(`Recieved Unknown Instruction: ${this.opcode}.`);
        }
    }

    // Clear Screen
    this._00E0 = () => {
        this?.Logger?.log("00E0: Cleared Screen.");
        this.displayBuffer.fill(0);
    }

    // Return
    this._00EE = () => {
        this?.Logger?.log("00EE: Returned From Subroutine.");
        this.pc = this.stack.pop();
    }

    // Jump PC To Address NNN
    this._1NNN = () => {
        const address = this.opcode & 0x0fff;
        this.pc = address;
        this?.Logger?.log(`1NNN: Jumped To Address: ${address}.`);
    }

    // Calls Subroutine At NNN.
    this._2NNN = () => {
        const address = this.opcode & 0x0fff;

        // Push Current PC To Stack
        // So that we know where to return from.
        this.stack.push(this.pc);

        // Move Program Counter To Provided Value
        this.pc = address;

        this?.Logger?.log(`2NNN: Call Subroutine At Address: ${address}.`);

    }
    //Skips the next instruction if VX equals NN.
    // (Usually the next instruction is a jump to skip a code block); 
    this._3XNN = () => {
        const NN = this.opcode & 0x00ff;

        if (this.rGPIO[this.vx] === NN) {
            this?.Logger?.log(`3XNN: Skipping.`);
            this.pc += 2;
        } else {
            this?.Logger?.log(`3XNN: Not Skipping.`);
        }
    }
    /*
    Skips the next instruction if VX does not equal NN.
     (Usually the next instruction is a jump to skip a code block); 
    */
    this._4XNN = () => {
        const NN = this.opcode & 0x00ff;

        if (this.rGPIO[this.vx] !== NN) {
            this?.Logger?.log(`4XNN: Skipping.`);
            this.pc += 2;
        } else {
            this?.Logger?.log(`4XNN: Not Skipping.`);
        }
    }

    /*
    Skips the next instruction if VX equals VY.
     (Usually the next instruction is a jump to skip a code block); 
    */
    this._5XY0 = () => {

        if (this.rGPIO[this.vx] === this.rGPIO(this.vy)) {
            this?.Logger?.log(`5XY0: Skipping.`);
            this.pc += 2;
        } else {
            this?.Logger?.log(`5XY0: Not Skipping.`);
        }
    }
    /*
    Sets VX to NN. 
    */
    this._6XNN = () => {
        const NN = thsi.opcode & 0x00ff;
        this.rGPIO[this.vx] = NN;
        this?.Logger?.log(`6XNN: Setting Register "${this.vx}" To Value "${NN}".`);
    }

    /*
    Adds NN to VX. (Carry flag is not changed)
    */
    this._7XNN = () => {
        const NN = this.opcode & 0x00ff;
        this?.Logger?.log(`7XNN: Adding "${NN}" To Register "${this.vx}".`);
        this.rGPIO[this.vx] += NN;
    }

    /*
    Sets VX to the value of VY. 
    */
    this._8XY0 = () => {
        this?.Logger?.log(`8XY0: Setting Value Of Register VX: "${this.vx}", To Value Of Register VY: "${this.vy}".`);
        this.rGPIO[this.vx] = this.rGPIO[this.vy];
        this.rGPIO[this.vx] &= 0xff;
    }

    /*
    Sets VX to VX or VY. (Bitwise OR operation); 
    */
    this._8XY1 = () => {
        this?.Logger?.log(`8XY1: Setting Register ${this.vx} To Logical OR of Registers ${this.vx} and ${this.vy}.`);
        this.rGPIO[this.vx] |= this.rGPIO[this.vy];
        this.rGPIO[this.vx] &= 0xff;
    }

    /*
    Sets VX to VX AND VY. (Bitwise AND operation); 
    */
    this._8XY2 = () => {
        this?.Logger?.log(`8XY2: Setting Register ${this.vx} To Logical AND of Registers ${this.vx} and ${this.vy}.`);
        this.rGPIO[this.vx] &= this.rGPIO[this.vy];
        this.rGPIO[this.vx] &= 0xff;
    }

    /*
    Sets VX to VX XOR VY. (Bitwise XOR operation); 
    */
    this._8XY3 = () => {
        this?.Logger?.log(`8XY3: Setting Register ${this.vx} To Logical XOR of Registers ${this.vx} and ${this.vy}.`);
        this.rGPIO[this.vx] ^= this.rGPIO[this.vy];
        this.rGPIO[this.vx] &= 0xff;
    }

    /*
    Adds VY to VX. VF is set to 1 when there's a carry, and to 0 when there is not. 
    */
    this._8XY4 = () => {
        this?.Logger?.log(`8XY4: Setting Register ${this.vx} To Addition Of Registers ${this.vx} and ${this.vy}.`);

        if (this.rGPIO[this.vx] + this.rGPIO[this.vy] > 0xff) {
            this.rGPIO[0xf] = 1;
        } else {
            this.rGPIO[0xf] = 0;
        }
        this.rGPIO[this.vx] += this.rGPIO[this.vy];
        this.rGPIO[this.vx] &= 0xff;

    }

    /*
    VY is subtracted from VX. VF is set to 0 when there's a borrow, and 1 when there is not.
    */
    this._8XY5 = () => {
        this?.Logger?.log(`8XY4: Setting Register ${this.vx} To Subtraction Of Registers ${this.vx} and ${this.vy}.`);

        if (this.rGPIO[this.vx] - this.rGPIO[this.vy] < 0) {
            this.rGPIO[0xf] = 0;
        } else {
            this.rGPIO[0xf] = 1;
        }
        this.rGPIO[this.vx] -= this.rGPIO[this.vy];
        this.rGPIO[this.vx] &= 0xff;

    }




}


export default CHIP8;