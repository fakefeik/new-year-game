import {roofLeft, roofMiddle, roofRightChimney, santaImg} from "./img";
import {CHIMNEY, currentMin, LAVA, state} from "./GameState";

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
        state.presents.push({
            x: 512,
            y: state.santa.height,
        });
    }
}
