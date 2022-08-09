

const CHIP8 = (LOGGER) => {


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
    this.opMap = {};

    // Represents Address Of Specific Registers
    this.vx = 0;
    this.vy = 0;

    // Calls machine code routine NNN
    this._0NNN = () => {
        const extracted_op = this.opcode & 0xf0ff
    }


}