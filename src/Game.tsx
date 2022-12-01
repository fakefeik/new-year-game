import React, { useEffect, useRef } from "react";

export interface GameProps {
    width: number;
    height: number;
}

interface Point {
    x: number;
    y: number;
}

interface SantaState {
    height: number;
}

interface GameState {
    roofs: Point[];
    santa: SantaState;
}

const state: GameState = {
    roofs: [],
    santa: { height: 0 },
};

function setDefaultState() {
    state.roofs = [];
}

export function Game({ width, height }: GameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D>();
    const requestRef = useRef<number>();
    const previousTimeRef = React.useRef<number>();

    const render = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {

    };

    const update = (canvas: HTMLCanvasElement, previousTime: number, currentTime: number) => {

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
        <canvas ref={canvasRef} style={{ width, height }} />
    );
}
