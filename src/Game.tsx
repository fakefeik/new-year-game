import React, {useEffect, useRef} from "react";
import type {RoofType, Roof} from "./img";
import {
    santaImg,
    giftImg,
    roofLeftChimney,
    roofLeft,
    roofMiddleChimney,
    roofMiddle,
    roofRightChimney,
    roofRight,
    santaDeadImg,
    CHIMNEY_HEIGHT,
    CHIMNEY_WIDTH
} from "./img";
import {CHIMNEY, currentMin, jump, Point, SANTA_BASELINE, setDefaultState, spawnGift, state} from "./GameState";

export interface GameProps {
    width: number;
    height: number;
}

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

    return between(100, 500);
}

function drawImg(context: CanvasRenderingContext2D, p: Point, img: HTMLImageElement, current?: boolean) {
    context.drawImage(img, p.x - img.width / 2, p.y - img.height / 2);

    if (DEBUG) {
        context.strokeStyle = current ? "red" : "green";
        context.strokeRect(p.x - img.width / 2, p.y - img.height / 2, img.width, img.height);
    }
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

const controls: {[key: string]: () => void} = {
    'r': setDefaultState,
    'к': setDefaultState,
    'f': spawnGift,
    'а': spawnGift,
    ' ': jump,
}

window.addEventListener('keydown', function (event) {
    if (!controls[event.key]) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    controls[event.key]();
});
export function Game({width, height}: GameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D>();
    const requestRef = useRef<number>();
    const previousTimeRef = React.useRef<number>();

    const render = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        drawImg(context, {x: state.prev.pos, y: 400}, state.prev.img);
        drawImg(context, {x: state.current.pos, y: 400}, state.current.img, true);
        drawImg(context, {x: state.next.pos, y: 400}, state.next.img);
        drawImg(context, {x: 512, y: state.santa.height}, state.santa.img);

        for (const p of state.presents) {
            drawImg(context, { x: p.x, y: p.y }, giftImg);
        }

        if (DEBUG) {
            context.font = "bold 48px serif";
            context.fillStyle = "rgb(255, 187, 57)";
            context.fillText(`currentMin:    ${currentMin(state.current)}`, 64, 64);
            context.fillText(`currentPos:    ${state.current.pos}`, 64, 128);
            context.fillText(`currentHeight: ${state.santa.height}`, 64, 200);
            const min = currentMin(state.current);
            context.fillRect(512 - 20, min + 64, 40, 4);
        }
    };

    const update = (canvas: HTMLCanvasElement, previousTime: number, currentTime: number) => {
        if (state.gameOver || state.pause) {
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

        state.presents = state.presents.filter(x => x.y <= CHIMNEY + 30);

        let dt = (currentTime - previousTime) * multiplyer(state.totalJumps);
        const floor = currentMin(state.current);
        if (state.santa.height > floor + 10 || state.santa.height >= floor && floor < SANTA_BASELINE - 10) {
            state.gameOver = true;
            state.santa.img = santaDeadImg;
            return;
        }

        if (state.santa.velocity != 0) {
            state.santa.height -= state.santa.velocity * dt * 0.1;
            state.santa.velocity -= dt * 0.02;
            if (state.santa.height > floor) {
                state.santa.velocity = 0;
                state.santa.height = floor;
                state.jumps = 0;
            }
        } else if (floor === 1000) {
            state.santa.velocity = -5;
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
    };

    const animate = (time: number) => {
        if (previousTimeRef.current != null && contextRef.current != null && canvasRef.current != null) {
            render(canvasRef.current, contextRef.current);
            update(canvasRef.current, previousTimeRef.current, time);
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        const canvas = canvasRef.current as HTMLCanvasElement;
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        contextRef.current = context;

        setDefaultState();

        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current as number);
    }, []);

    return (
        <canvas ref={canvasRef} style={{width, height}}/>
    );
}
