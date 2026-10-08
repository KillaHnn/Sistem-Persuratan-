"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseIdleTimeoutOptions {
    /** Durasi idle (ms) sebelum callback `onIdle` dipanggil (sebelum warning) */
    idleTime: number;
    /** Durasi warning (ms). Jika user tidak bereaksi, `onLogout` dipanggil */
    warningTime: number;
    onIdle: () => void;
    onActive: () => void;
    onLogout: () => void;
}

const ACTIVITY_EVENTS = [
    "mousemove",
    "mousedown",
    "keydown",
    "touchstart",
    "scroll",
    "click",
];

export function useIdleTimeout({
    idleTime,
    warningTime,
    onIdle,
    onActive,
    onLogout,
}: UseIdleTimeoutOptions) {
    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isIdle = useRef(false);

    const clearTimers = useCallback(() => {
        if (idleTimer.current) clearTimeout(idleTimer.current);
        if (warningTimer.current) clearTimeout(warningTimer.current);
    }, []);

    const resetTimer = useCallback(() => {
        clearTimers();

        if (isIdle.current) {
            isIdle.current = false;
            onActive();
        }

        // Mulai timer idle — saat expired tampilkan warning
        idleTimer.current = setTimeout(() => {
            isIdle.current = true;
            onIdle();

            // Setelah warning, tunggu warningTime lalu logout
            warningTimer.current = setTimeout(() => {
                onLogout();
            }, warningTime);
        }, idleTime);
    }, [clearTimers, idleTime, warningTime, onIdle, onActive, onLogout]);

    useEffect(() => {
        ACTIVITY_EVENTS.forEach((event) =>
            window.addEventListener(event, resetTimer, { passive: true })
        );
        resetTimer();

        return () => {
            clearTimers();
            ACTIVITY_EVENTS.forEach((event) =>
                window.removeEventListener(event, resetTimer)
            );
        };
    }, [resetTimer, clearTimers]);
}
