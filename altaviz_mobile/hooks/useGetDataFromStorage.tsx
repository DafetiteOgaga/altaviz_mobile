import { useAsyncStorageMethods } from '../context/AsyncMethodsContext';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'expo-router'

const useGetDataFromStorage = (key: string) => {
    const path:string|null = usePathname();
    const [,urlPath] = path?.split('/')
    const { getItem } = useAsyncStorageMethods();
    const [data, setData] = useState<any>(null); // State to store the fetched data
    const intervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to store the interval ID

    const fetchData = async () => {
        const storedData = await getItem(key);
        console.log({key, urlPath})
        console.log('### Fetched data:', JSON.stringify(storedData).slice(0, 30));

        if (storedData
            ||(!storedData&&(key==='loginData'||key==='headerDetails'||key==='baseUrl'))
        ) {
            setData(storedData); // Update state with the fetched data
            if (intervalRef.current) {
                clearInterval(intervalRef.current); // Stop the interval once data is found
            }
        }
    };

    useEffect(() => {
        // Start fetching data immediately
        fetchData();

        // Set up an interval to keep trying to fetch data
        intervalRef.current = setInterval(fetchData, 500); // Retry every 1 second

        // Cleanup: Clear the interval when the component unmounts
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [key, urlPath]); // Re-run effect if the key changes

    return data; // Return the fetched data (or null if not yet available)
};

export { useGetDataFromStorage };