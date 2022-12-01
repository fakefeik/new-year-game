import {CHIMNEY_HEIGHT, CHIMNEY_WIDTH, Roof, roofLeft, roofMiddle, roofRightChimney, santaImg} from "./img";

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

interface GameState {
    prev: RoofState;
    current: RoofState;
    next: RoofState;
    santa: SantaState;
    presents: Point[];
    score: number;
    jumps: number;
    gameOver: boolean;
    pause: boolean;
    totalJumps: number;
}

const BASELINE = 400;
export const SANTA_BASELINE = BASELINE - 66;
export const CHIMNEY = SANTA_BASELINE - CHIMNEY_HEIGHT;
const LAVA = 1000;

export const state: GameState = {
    prev: null!,
    current: null!,
    next: null!,
    santa: null!,
    presents: [],
    score: 0,
    jumps: 0,
    gameOver: false,
    pause: false,
    totalJumps: 0,
};

export function setDefaultState() {
    state.prev = {...roofLeft, pos: 256};
    state.current = {...roofMiddle, pos: 768};
    state.next = {...roofRightChimney, pos: 1280};
    state.santa = {
        img: santaImg,
        height: 330,
        velocity: 0,
    };
    state.presents = [];
    state.score = 0;
    state.jumps = 0;
    state.gameOver = false;
    state.pause = false;
    state.totalJumps = 0;
}

export function currentMin(roof: RoofState) {
    if (roof.type == "start") {
        if (roof.pos > 512 && roof.pos < 768) {
            const y = roof.pos - 512;
            return y + SANTA_BASELINE;
        } else if (roof.pos > 768) {
            return LAVA;
        }
    } else if (roof.type == "end") {
        if (roof.pos > 256 && roof.pos < 512) {
            const y = 512 - roof.pos
            return y + SANTA_BASELINE;
        }
    }

    const current = 768 - roof.pos;
    if (roof.chimney && current > roof.chimney && current < roof.chimney + CHIMNEY_WIDTH) {
        return CHIMNEY;
    }
    return SANTA_BASELINE;
}

export function jump() {
    const floor = currentMin(state.current);
    if (state.jumps >= 2 || state.santa.velocity == 0 && floor == LAVA) {
        return;
    }
    state.santa.velocity = state.jumps == 0 ? 10 : 7;
    state.jumps++;
    state.totalJumps++;
}

export function spawnGift() {
    const floor = currentMin(state.current);
    if (floor == CHIMNEY) {
        console.info("hEre")
        state.presents.push({
            x: 512,
            y: state.santa.height,
        });
    }
}