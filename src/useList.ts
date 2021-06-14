import { useState, useMemo } from 'react';

export interface ListMutator<T> {
    set: (newList: T[]) => void;
    push: (...items: T[]) => void;
    update: (predicate: ListPredicate<T>, action: UpdateAction<T>) => void;
    updateAt: (index: number, action: UpdateAction<T>) => void;
    replace: (predicate: ListPredicate<T>, newItem: T) => void;
    replaceAt: (index: number, newItem: T) => void;
    remove: (predicate: ListPredicate<T>) => void;
    removeAt: (index: number) => void;
    clear: () => void;
}

export type ListPredicate<T> = (item: T) => boolean;
export type UpdateAction<T> = (draftItem: T) => T;

export function useList<T>(initialState: T[] = []): [T[], ListMutator<T>] {
    const [list, setList] = useState<T[]>(initialState);

    const mutator = useMemo<ListMutator<T>>(() => {
        return {
            set: (newList: T[]) => {
                setList(newList);
            },

            push: (...items: T[]) => {
                if (items.length === 0) return;

                setList(prevList => [...prevList, ...items]);
            },

            update: (predicate: ListPredicate<T>, action: UpdateAction<T>) => {
                setList(prevList => prevList.map(item => predicate(item) ? action({ ...item }) : item));
            },

            updateAt: (index: number, action: UpdateAction<T>) => {
                setList(prevList => prevList.map((item, itemIndex) => itemIndex === index ? action({ ...item }) : item));
            },

            replace: (predicate: ListPredicate<T>, newItem: T) => {
                setList(prevList => prevList.map(item => predicate(item) ? newItem : item));
            },

            replaceAt: (index: number, newItem: T) => {
                setList(prevList => prevList.map((item, itemIndex) => itemIndex === index ? newItem : item));
            },

            remove: (predicate: ListPredicate<T>) => {
                setList(prevList => prevList.filter(item => !predicate(item)));
            },

            removeAt: (index: number) => {
                setList(prevList => prevList.filter((_, itemIndex) => index !== itemIndex));
            },

            clear: () => {
                setList([]);
            }
        };
    }, [setList]);

    return [list, mutator];
}