import {useEffect, useState} from "react";

const useFetch =<T> ( fetchFunction : ()=> Promise<T> , autoFetch = true) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(autoFetch);
    const[error, setError] = useState<Error | null>(null);

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const results = await fetchFunction();
                setData(results);
            } catch (error) {
                setError(error instanceof Error ? error : new Error("Unknown error"));
            } finally {
                setLoading(false);
            }
        }
        const reset = ()=>{
            setData(null);
            setError(null);
            setLoading(false);
        }
    useEffect(() => {
        if(autoFetch){
            fetchData()
        }
    }, []);
        return {data, loading, error, refetch : fetchData, reset}
};


export default useFetch;