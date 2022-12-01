import {CHIMNEY_HEIGHT, CHIMNEY_WIDTH, Roof} from "./img";

export interface Point {
    x: number;
    y: number;
}

interface RoofState extends Roof {
    pos: number;
}

interface SantaState {
    img: HTMLImageElement;
    height: number;
    velocity: number;
}

export interface GameState {
    prev: RoofState;
    current: RoofState;
    next: RoofState;
    santa: SantaState;
    presents: Point[];
    currentChimney?: null | number;
    score: number;
    jumps: number;
    gameOver: boolean;
    pause: boolean;
    totalJumps: number;
}

const BASELINE = 400;
export const SANTA_BASELINE = BASELINE - 66;
export const CHIMNEY = SANTA_BASELINE - CHIMNEY_HEIGHT;
export const LAVA = 768;
const INDENT = 64;
const SLOPE_START = 256;

export const state = {} as GameState;

export function currentMin(roof: RoofState) {
    const pos = roof.pos - 256;
    if (roof.type == "start") {
        if (pos > SLOPE_START && pos < roof.img.width - INDENT) {
            const y = pos - SLOPE_START;
            return y + SANTA_BASELINE;
        } else if (pos > roof.img.width - INDENT) {
            return LAVA;
        }
    } else if (roof.type == "end") {
        if (pos > INDENT && pos < SLOPE_START) {
            const y = SLOPE_START - pos
            return y + SANTA_BASELINE;
        } else if (pos < INDENT) {
            return LAVA;
        }
    }

    const current = 512 - pos;
    if (roof.chimney && current > roof.chimney && current < roof.chimney + CHIMNEY_WIDTH) {
        return CHIMNEY;
    }
    return SANTA_BASELINE;
}
