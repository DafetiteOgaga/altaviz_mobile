import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, ReactNode, useMemo } from 'react';

interface AsyncMethodsContextType {
    setItem: (key: string, value: any) => Promise<void>;
    getItem: (key: string) => Promise<any>;
    removeItem: (key: string) => Promise<void>;
}

const AsyncMethodsContext = createContext<AsyncMethodsContextType | null>(null);

export const AsyncStorageProvider = ({ children }: { children: ReactNode }) => {
    const setItem = async (key: string, value: any) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
            console.log(`Data saved: ${key}`);
        } catch (error) {
            console.error(`Error saving key "${key}":`, error);
        }
    };

    const getItem = async (key: string) => {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error(`Error fetching key "${key}":`, error);
            return null;
        }
    };
    const removeItem = async (key: string) => {
        try {
            await AsyncStorage.removeItem(key);
            console.log(`Data removed: ${key}`);
        } catch (error) {
            console.error(`Error removing key "${key}":`, error);
        }
    }

    const contextValue = useMemo(() => ({ setItem, getItem, removeItem }), []);

    return (
        <AsyncMethodsContext.Provider value={contextValue}>
            {children}
        </AsyncMethodsContext.Provider>
    );
};

export const useAsyncStorageMethods = () => {
    const context = useContext(AsyncMethodsContext);
    if (!context) {
        throw new Error('useAsyncStorageMethods must be used within an AsyncStorageProvider');
    }
    return context;
};