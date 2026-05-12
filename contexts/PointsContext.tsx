"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getProfile } from "@/services/user.service";

interface PointsContextType {
    points: number | null;
    addPoints: (amount: number) => void;
    subtractPoints: (amount: number) => void;
    refreshPoints: () => void;
}

const PointsContext = createContext<PointsContextType>({
    points: null,
    addPoints: () => {},
    subtractPoints: () => {},
    refreshPoints: () => {},
});

export function PointsProvider({ children }: { children: ReactNode }) {
    const [points, setPoints] = useState<number | null>(null);

    useEffect(() => {
        getProfile()
            .then((user) => setPoints(user.pointsBalance ?? 0))
            .catch(() => {});
    }, []);

    const addPoints = (amount: number) => {
        setPoints((prev) => (prev !== null ? prev + amount : amount));
    };

    const subtractPoints = (amount: number) => {
        setPoints((prev) => (prev !== null ? prev - amount : 0));
    };

    const refreshPoints = () => {
        getProfile()
            .then((user) => setPoints(user.pointsBalance ?? 0))
            .catch(() => {});
    };

    return (
        <PointsContext.Provider value={{ points, addPoints, subtractPoints, refreshPoints }}>
            {children}
        </PointsContext.Provider>
    );
}

export const usePoints = () => useContext(PointsContext);
