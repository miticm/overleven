// File for generic useful functions
import { BLOCK_SIZE } from "./constants";

// Returns an object describing which block the coordinates are in
export function currentBlock(x, y) {
    return {
        x: Math.floor(x / BLOCK_SIZE),
        y: Math.floor(y / BLOCK_SIZE)
    };
}