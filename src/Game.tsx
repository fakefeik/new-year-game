import React, {isValidElement, useEffect, useRef} from "react";
import type {RoofType, Roof} from "./img";
import {
    santaImg,
    giftImg,
    roofLeftChimney,
    roofLeft,
    roofMiddleChimney,
    roofMiddle,
    roofRightChimney,
    roofRight, santaDeadImg
} from "./img";

export interface GameProps {
    width: number;
    height: number;
}

interface Point {
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
    jumps: number;
    gameOver: boolean;
    pause: boolean;
}

const DEBUG = true;
const BASELINE = 400;
const SANTA_BASELINE = BASELINE - 66;

const state: GameState = {
    prev: null!,
    current: null!,
    next: null!,
    santa: null!,
    jumps: 0,
    gameOver: false,
    pause: false,
};

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

function setDefaultState() {
    state.prev = {...roofLeft, pos: 256 };
    state.current = { ...roofMiddleChimney, pos: 768 };
    state.next = { ...roofRight, pos: 1280 };
    state.santa = {
        img: santaImg,
        height: 330,
        velocity: 0,
    };
    state.jumps = 0;
    state.gameOver = false;
    state.pause = false;
}

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

function currentMin(roof: RoofState) {
    if (roof.type == "start") {
        if (roof.pos > 512 && roof.pos < 768) {
            const y = roof.pos - 512;
            return y + SANTA_BASELINE;
        } else if (roof.pos > 768) {
            return 1000;
        }
    } else if (roof.type == "end") {
        if (roof.pos > 256 && roof.pos < 512) {
            const y = 512 - roof.pos
            return y + SANTA_BASELINE;
        }
    }
    if (roof.chimney && roof.pos + roof.chimney > 256 ) {
        // console.info(roof.chimney);
        // console.info(roof.pos);
    }
    return SANTA_BASELINE;
}

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

        let dt = currentTime - previousTime;
        dt *= 0.3;

        const floor = currentMin(state.current);

        if (state.santa.height > floor + 10) {
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

    const shoot = (e: React.MouseEvent) => {
        console.info(e);
        if (e.button == 2) {
            e.preventDefault();
            state.pause = !state.pause;
            return;
        }

        if (state.jumps >= 2 || state.santa.velocity == 0 && currentMin(state.current) == 1000) {
            return;
        }
        state.santa.velocity = 10;
        state.jumps++;
    }

    return (
        <canvas onMouseUp={shoot} ref={canvasRef} style={{width, height}}/>
    );
}
