import {backgroundImg, gifts, roofLeft, roofMiddle, roofRightChimney, santaWalk1Img} from "./img";
import {CHIMNEY, currentMin, LAVA, state} from "./GameState";
import {between} from "./GameLoop";

export function setDefaultState() {
    state.prev = {...roofLeft, pos: 256};
    state.current = {...roofMiddle, pos: 768};
    state.next = {...roofRightChimney, pos: 1280};
    state.santa = {
        img: santaWalk1Img,
        changeTime: 0,
        height: 330,
        velocity: 0,
    };
    state.background = backgroundImg;
    state.presents = [];
    state.score = 0;
    state.jumps = 0;
    state.gameOver = false;
    state.debug = false;
    state.totalJumps = 0;
    state.currentChimney = null;
}

export function debug() {
    state.debug = !state.debug;
}

export function jump() {
    const floor = currentMin(state.current);
    if (state.jumps >= 2 || state.santa.velocity === 0 && floor === LAVA) {
        return;
    }
    state.santa.velocity = state.jumps == 0 ? 10 : 7;
    state.jumps++;
    state.totalJumps++;
}

export function spawnGift() {
    const floor = currentMin(state.current);
    if (floor == CHIMNEY && !state.gameOver) {
        if (!state.currentChimney) {
            state.currentChimney = 1;
        } else {
            state.currentChimney++;
        }
        state.score += 2;
        state.presents.push({
            img: gifts[between(0, gifts.length)],
            x: 512,
            y: state.santa.height,
        });
    }
}

