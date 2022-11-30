import React, { useEffect, useRef } from "react";

import {
    bigShootableImg,
    candyImg,
    caviarImg,
    champagneImg,
    chickenImg,
    crosshairImg,
    projectileImg,
    saladImg,
    sausageImg,
    shootableImg,
    spratsImg,
    treeImg,
} from "./img";

export interface GameProps {
    incrementScore: (score: number) => void;
    backgroundColor: string;
    width: number;
    height: number;
}

interface Point {
    x: number;
    y: number;
}

interface Target {
    img: HTMLImageElement[];
    chance: number;
    radius: number;
    score: number;
}

interface Shootable extends Omit<Target, "img"> {
    start: Point;
    current: Point;
    finish: Point;
    img: HTMLImageElement;
}

interface GameState {
    crosshair: null | Point;
    projectile: null | Shootable;
    shootables: Shootable[];
    killTime: number;
    killNumber: number;
    shotTarget: null | Shootable;
}

const state: GameState = {
    crosshair: null,
    projectile: null,
    shootables: [],
    killTime: 0,
    killNumber: 0,
    shotTarget: null,
};

function setDefaultState() {
    state.crosshair = null;
    state.projectile = null;
    state.shootables = [];
    state.killTime = 0;
    state.killNumber = 0;
    state.shotTarget = null;
}

const targetCounts = [
    { kills: 10, targets: 5 },
    { kills: 15, targets: 6 },
    { kills: 20, targets: 7 },
    { kills: 25, targets: 8 },
    { kills: 30, targets: 9 },
    { kills: 35, targets: 10 },
];

const targets: Target[] = [
    {
        radius: 3000,
        img: [treeImg],
        score: 10,
        chance: 0.195,
    },
    {
        radius: 2500,
        img: [saladImg, chickenImg],
        score: 20,
        chance: 0.3,
    },
    {
        radius: 2000,
        img: [spratsImg],
        score: 40,
        chance: 0.2,
    },
    {
        radius: 1500,
        img: [sausageImg, champagneImg, caviarImg],
        score: 60,
        chance: 0.2,
    },
    {
        radius: 1000,
        img: [candyImg, shootableImg],
        score: 90,
        chance: 0.1,
    },
    {
        radius: 10000,
        img: [bigShootableImg],
        score: 666,
        chance: 0.005,
    },
];

function distance(p1: Point, p2: Point) {
    return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
}

function inside(p: Point, width: number, height: number): boolean {
    return p.x >= 0 && p.y >= 0 && p.x <= width && p.y <= height;
}

function between(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}

function drawImg(context: CanvasRenderingContext2D, p: Point, img: HTMLImageElement) {
    context.drawImage(img, p.x - img.width / 2, p.y - img.height / 2);
}

function getTargetGroup(): Target {
    const targetGroupValue = Math.random();
    let prevValue = 0;
    for (const t of targets) {
        const nextValue = prevValue + t.chance;
        if (targetGroupValue >= prevValue && targetGroupValue <= nextValue) {
            return t;
        }
        prevValue += t.chance;
    }
    return targets[0];
}

function getTargets(killNumber: number) {
    const prevValue = 0;
    for (const e of targetCounts) {
        if (killNumber >= prevValue && killNumber <= e.kills) {
            return e.targets;
        }
    }
    return 10;
}

function spawnShootable(width: number, height: number): Shootable {
    const fromLeft = Math.random() < 0.5;
    const group = getTargetGroup();
    const img = group.img[between(0, group.img.length)];
    return {
        start: { x: fromLeft ? 0 : width, y: between(0, height) },
        current: { x: fromLeft ? 0 : width, y: between(0, height) },
        finish: { x: fromLeft ? width : 0, y: between(0, height) },
        ...group,
        img,
    };
}

export function Game({ incrementScore, backgroundColor, width, height }: GameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D>();
    const requestRef = useRef<number>();
    const previousTimeRef = React.useRef<number>();

    const render = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
        const { crosshair, projectile, shotTarget } = state;
        for (const shootable of state.shootables) {
            drawImg(context, shootable.current, shootable.img);
        }
        if (projectile) {
            drawImg(context, projectile.current, projectile.img);
        }
        if (crosshair) {
            drawImg(context, crosshair, crosshairImg);
        }
        if (shotTarget) {
            context.font = "bold 48px serif";
            context.fillStyle = "rgb(255, 187, 57)";
            context.fillText(`+${shotTarget.score}!`, shotTarget.current.x, shotTarget.current.y);
        }
    };

    const update = (canvas: HTMLCanvasElement, previousTime: number, currentTime: number) => {
        const { projectile } = state;
        for (const e of state.shootables) {
            const dx = e.start.x - e.finish.x;
            const dy = e.start.y - e.finish.y;
            let n = 1;
            if (state.killNumber > 50) {
                n = 1.25;
            } else if (state.killNumber > 100) {
                n = 1.5;
            }
            e.current.x -= (dx * (currentTime - previousTime) * n) / 7000;
            e.current.y -= (dy * (currentTime - previousTime) * n) / 7000;
        }
        state.shootables = state.shootables.filter(
            e => inside(e.current, canvas.width, canvas.height) && distance(e.current, e.finish) > 10
        );

        if (state.killTime + 1500 < currentTime) {
            state.shotTarget = null;
        }

        if (state.shootables.length < getTargets(state.killNumber)) {
            state.shootables = [...state.shootables, spawnShootable(canvas.width, canvas.height)];
        }

        if (projectile) {
            const dx = projectile.start.x - projectile.finish.x;
            const dy = projectile.start.y - projectile.finish.y;
            if (distance(projectile.current, projectile.finish) < 20) {
                for (let i = 0; i < state.shootables.length; i++) {
                    const shootable = state.shootables[i];
                    if (distance(shootable.current, projectile.current) < shootable.radius) {
                        state.shootables = [...state.shootables.slice(0, i), ...state.shootables.slice(i + 1)];
                        state.shotTarget = shootable;
                        state.killTime = currentTime;
                        state.killNumber++;
                        incrementScore(shootable.score);
                        break;
                    }
                }
                state.projectile = null;
            } else {
                projectile.current.x -= (dx * (currentTime - previousTime)) / 70;
                projectile.current.y -= (dy * (currentTime - previousTime)) / 70;
            }
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

    const shoot = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas || state.projectile) {
            return;
        }

        const projectileStart = {
            x: Math.floor(canvas.width / 2) - 50,
            y: Math.floor(canvas.height) - 50,
        };

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        state.projectile = {
            start: projectileStart,
            current: projectileStart,
            finish: { x, y },
            img: projectileImg,
            radius: 1000,
            score: 100,
            chance: 1.0,
        };
    };

    const moveCursor = (e: React.MouseEvent) => {
        if (!canvasRef.current) {
            return;
        }

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        state.crosshair = { x, y };
    };

    return (
        <canvas onMouseUp={shoot} onMouseMove={moveCursor} ref={canvasRef} style={{ cursor: "none", width, height }} />
    );
}
