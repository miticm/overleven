// Constants for the whole file
export const HEIGHT = window.innerHeight;
export const WIDTH = window.innerWidth;
export const BLOCK_SIZE = 64;

// Computed
export const BLOCK_WIDTH = Math.floor(WIDTH / BLOCK_SIZE);
export const BLOCK_HEIGHT = Math.floor(HEIGHT / BLOCK_SIZE);
export const HALF_BLOCK = BLOCK_SIZE / 2;
