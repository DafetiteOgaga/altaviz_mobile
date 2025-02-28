import React, { createContext, useContext, useState } from 'react';

// Define the type for the context value
interface HeaderContextType {
    headerTitle: string;
    setHeaderTitle: React.Dispatch<React.SetStateAction<string>>;
}

// Initialize the context with the correct type
const HeaderContext = createContext<HeaderContextType | null>(null);

// Create the provider component
export const HeaderProvider = ({ children }: { children: React.ReactNode }) => {
    const [headerTitle, setHeaderTitle] = useState<string>('DefaultHeader');

    return (
        <HeaderContext.Provider value={{ headerTitle, setHeaderTitle }}>
            {children}
        </HeaderContext.Provider>
    );
};

// Create a custom hook to use the context
export const useHeader = () => {
    const context = useContext(HeaderContext);
    if (!context) {
        throw new Error('useHeader must be used within a HeaderProvider');
    }
    return context;
};