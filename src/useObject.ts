import { useState, useMemo } from 'react';

export interface ObjectMutator<T> {
    set: (newObject: T) => void;
    update: <K extends keyof T>(key: K, value: T[K]) => void;
}

export function useObject<T>(initialState: T = {} as T): [T, ObjectMutator<T>] {
    const [state, setState] = useState<T>(initialState);

    const mutator = useMemo<ObjectMutator<T>>(() => {
        return {
            set: (newObject: T) => {
                setState(newObject);
            },

            update: (key, value) => {
                setState(prevState => ({
                    ...prevState,
                    [key]: value
                }));
            }
        };
    }, [setState]);

    return [state, mutator];
}