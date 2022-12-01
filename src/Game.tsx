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
    roofRight
} from "./img";

export interface GameProps {
    width: number;
    height: number;
}

interface Point {
    x: number;
    y: number;
}

interface RoofState {
    img: HTMLImageElement;
    type: RoofType;
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
}

const BASELINE = 400;
const SANTA_BASELINE = BASELINE - 66;

const state: GameState = {
    prev: null!,
    current: null!,
    next: null!,
    santa: null!,
    jumps: 0,
};

const possibleRoofs: { [key in RoofType]: Roof[] } = {
    "start": [roofLeft, roofLeftChimney],
    "middle": [roofMiddle, roofMiddleChimney],
    "end": [roofRight, roofRightChimney],
};

const possibleRoofsFor: { [key in RoofType]: Roof[] } = {
    "start": [...possibleRoofs["middle"], ...possibleRoofs["end"]],
    "middle": possibleRoofs["end"],
    "end": possibleRoofs["start"],
};

function setDefaultState() {
    state.prev = {
        img: roofLeft.img,
        type: "start",
        pos: 256,
    };
    state.current = {
        img: roofMiddleChimney.img,
        type: "middle",
        pos: 768,
    };
    state.next = {
        img: roofRight.img,
        type: "end",
        pos: 1280,
    };
    state.santa = {
        img: santaImg,
        height: 330,
        velocity: 0,
    };
    state.jumps = 0;
}

function between(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}

function nextRoof(prev: RoofType) {
    return possibleRoofsFor[prev][between(0, possibleRoofsFor[prev].length)];
}

function drawImg(context: CanvasRenderingContext2D, p: Point, img: HTMLImageElement) {
    context.drawImage(img, p.x - img.width / 2, p.y - img.height / 2);

    // debug
    context.strokeStyle = "green";
    context.strokeRect(p.x - img.width / 2, p.y - img.height / 2, img.width, img.height);
}

function currentMin(type: RoofType, pos: number) {
    if (type == "start") {
        if (pos > 512 && pos < 768) {
            const y = pos - 512;
            return y + SANTA_BASELINE;
        }
    } else if (type == "end") {
        if (pos > 256 && pos < 512) {
            const y = 512 - pos
            return y + SANTA_BASELINE;
        }
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
        drawImg(context, {x: state.current.pos, y: 400}, state.current.img);
        drawImg(context, {x: state.next.pos, y: 400}, state.next.img);
        drawImg(context, {x: 512, y: state.santa.height}, state.santa.img);
    };

    const update = (canvas: HTMLCanvasElement, previousTime: number, currentTime: number) => {
        if (state.prev.pos < -256) {
            state.prev = state.current;
            state.current = state.next;
            state.next = {
                ...nextRoof(state.current.type),
                pos: state.current.pos + 512,
            };
        }

        const dt = currentTime - previousTime;

        const floor = currentMin(state.current.type, state.current.pos);
        if (state.santa.velocity != 0) {
            state.santa.height -= state.santa.velocity * dt * 0.1;
            state.santa.velocity -= dt * 0.03;
            if (state.santa.height > floor) {
                state.santa.velocity = 0;
                state.santa.height = floor;
                state.jumps = 0;
            }
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
        if (state.jumps >= 2) {
            return;
        }
        state.santa.velocity = 10;
        state.jumps++;
    }

    return (
        <canvas onMouseUp={shoot} ref={canvasRef} style={{width, height}}/>
    );
}
