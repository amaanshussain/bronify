// const fs = require('fs')
import fs from 'fs'

export async function convertWavToBinary(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        return uint8Array;
    } catch (error) {
        console.error("Error reading or processing the file:", error);
        return null;
    }
}

async function main() {
    const wav = fs.readFileSync('audio/alarm.wav');
    console.log(wav);

}

main();