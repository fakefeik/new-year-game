import React, {useEffect, useRef} from "react";
import {jump, setDefaultState, spawnGift} from "./GameActions";
import {render, update} from "./GameLoop";
import {state} from "./GameState";

export interface GameProps {
    width: number;
    height: number;
}

const controls: {[key: string]: () => void} = {
    'KeyR': setDefaultState,
    'KeyF': spawnGift,
    'Space': jump,
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
