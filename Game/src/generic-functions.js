// File for generic useful functions
import 'phaser';
import { BLOCK_SIZE } from "./constants";

// Returns an object describing which block the coordinates are in
export function currentBlock(x, y) {
  return {
    x: Math.floor(x / BLOCK_SIZE),
    y: Math.floor(y / BLOCK_SIZE)
  };
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
