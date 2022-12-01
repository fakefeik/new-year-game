import React, {useEffect, useRef} from "react";
import {changeBackground, debug, jump, setDefaultState, spawnGift} from "./GameActions";
import {render, update} from "./GameLoop";
import {state} from "./GameState";
import {background2Img, background3Img, backgroundImg} from "./img";

export interface GameProps {
    width: number;
    height: number;
}

const controls: {[key: string]: () => void} = {
    'KeyR': setDefaultState,
    'BracketLeft': debug,
    'KeyF': spawnGift,
    'Space': jump,
    'Digit1': changeBackground(backgroundImg),
    'Digit2': changeBackground(background2Img),
    'Digit3': changeBackground(background3Img),
}

window.addEventListener('keydown', function (event) {
    if (!controls[event.code]) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    controls[event.code]();
});

export function Game({width, height}: GameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D>();
    const requestRef = useRef<number>();
    const previousTimeRef = React.useRef<number>();

    const animate = (time: number) => {
        if (previousTimeRef.current != null && contextRef.current != null && canvasRef.current != null) {
            render(canvasRef.current, contextRef.current, state);
            update(state, previousTimeRef.current, time);
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
