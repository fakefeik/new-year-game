import {
    backgroundImg,
    giftImg,
    roofLeft,
    roofLeftChimney,
    roofMiddle,
    roofMiddleChimney,
    roofRight,
    roofRightChimney,
} from "./img";
import type { Roof, RoofType } from "./img";

import {CHIMNEY, currentMin, LAVA} from "./GameState";
import type { GameState, Point } from "./GameState";

const DEBUG = true;

const possibleRoofs: { [key in RoofType]: Roof[] } = {
    "start": [roofLeft, roofLeftChimney],
    "middle": [roofMiddle, roofMiddleChimney],
    "end": [roofRight, roofRightChimney],
};

const possibleRoofsFor: { [key in RoofType]: Roof[] } = {
    "start": [...possibleRoofs["middle"], ...possibleRoofs["end"]],
    "middle": [...possibleRoofs["middle"], ...possibleRoofs["end"]],
    "end": possibleRoofs["start"],
};

function between(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}

function nextRoof(prev: RoofType) {
    return possibleRoofsFor[prev][between(0, possibleRoofsFor[prev].length)];
}

function roofsDistance(next: RoofType) {
    if (next != "start") {
        return 0;
    }

    return between(100, 400);
}

function multiplyer(totalJumps: number) {
    if (totalJumps < 10) {
        return 1;
    } else if (totalJumps < 20) {
        return 1.2;
    } else if (totalJumps < 50) {
        return 1.5;
    } else {
        return 1.7;
    }
}

function drawImg(context: CanvasRenderingContext2D, p: Point, img: HTMLImageElement, current?: boolean) {
    context.drawImage(img, p.x - img.width / 2, p.y - img.height / 2);

    if (DEBUG) {
        context.strokeStyle = current ? "red" : "green";
        context.strokeRect(p.x - img.width / 2, p.y - img.height / 2, img.width, img.height);
    }
}

export function render(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, state: GameState) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#2B3280";
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawImg(context, { x: backgroundImg.width / 2, y: backgroundImg.height / 2 }, backgroundImg)
    drawImg(context, {x: state.prev.pos, y: 400}, state.prev.img);
    drawImg(context, {x: state.current.pos, y: 400}, state.current.img, true);
    drawImg(context, {x: state.next.pos, y: 400}, state.next.img);
    drawImg(context, {x: 512, y: state.santa.height}, state.santa.img);

    for (const p of state.presents) {
        drawImg(context, { x: p.x, y: p.y }, giftImg);
    }

    context.font = "bold 48px serif";
    context.fillStyle = "rgb(255, 187, 57)";
    context.fillText(`Score: ${state.score}`, 64, 64);
    if (DEBUG) {
        context.fillText(`currentMin:    ${currentMin(state.current)}`, 64, 128);
        context.fillText(`currentPos:    ${state.current.pos}`, 64, 192);
        context.fillText(`currentHeight: ${state.santa.height}`, 64, 256);
        const min = currentMin(state.current);
        context.fillRect(512 - 20, min + 64, 40, 4);
    }
}

export function update(state: GameState, previousTime: number, currentTime: number) {
    if (state.gameOver) {
        state.presents = [];
        return;
    }

    if (state.current.pos < 256) {
        state.prev = state.current;
        state.current = state.next;
        const next = nextRoof(state.current.type)
        state.next = {
            ...next,
            pos: state.current.pos + 512 + roofsDistance(next.type),
        };
    }

    state.presents = state.presents.filter(x => !state.gameOver && x.y <= CHIMNEY + 32);

    let dt = (currentTime - previousTime) * multiplyer(state.totalJumps);
    const floor = currentMin(state.current);
    if (state.santa.height === LAVA || state.current.type === "start" && floor !== LAVA && state.santa.height > 540) {
        state.santa.velocity = 0;
        state.gameOver = true;
        return;
    }

    if (floor === CHIMNEY && !state.currentChimney) {
        state.currentChimney = 0;
    }

    if (floor !== CHIMNEY) {
        if (state.currentChimney === 0) {
            state.score = Math.max(state.score - 1, 0);
        }
        state.currentChimney = null;
    }

    if (state.santa.velocity != 0) {
        state.santa.height -= state.santa.velocity * dt * 0.1;
        state.santa.velocity -= dt * 0.02;
        if (state.santa.height > floor) {
            state.santa.velocity = 0;
            state.santa.height = floor;
            state.jumps = 0;
        }
    } else if (floor === LAVA) {
        state.santa.velocity = -5;
    } else if (floor === CHIMNEY) {
        state.gameOver = true;
    } else {
        state.santa.height = floor;
    }

    state.prev.pos -= dt * 0.3;
    state.current.pos -= dt * 0.3;
    state.next.pos -= dt * 0.3;

    for (let p of state.presents) {
        p.x -= dt * 0.3;
        p.y += dt * 0.3;
    }
}
