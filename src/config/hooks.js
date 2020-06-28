import { useParams, useLocation, useHistory, useRouteMatch } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { toastController } from '@ionic/core';
import * as compress from 'client-compress'

// Hook
export function useLocalStorage(key, initialValue) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.log(error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = value => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.log(error);
        }
    };

    return [storedValue, setValue];
}



// Hook
export function useRouter() {
    const params = useParams();
    const location = useLocation();
    const history = useHistory();
    const match = useRouteMatch();

    // Return our custom router object
    // Memoize so that a new object is only returned if something changes
    return useMemo(() => {
        return {
            // For convenience add push(), replace(), pathname at top level
            push: history.push,
            replace: history.replace,
            pathname: location.pathname,
            // Merge params and parsed query string into single "query" object
            // so that they can be used interchangeably.
            // Example: /:topic?sort=popular -> { topic: "react", sort: "popular" }
            // query: {
            //     ...queryString.parse(location.search), // Convert string to object
            //     ...params
            // },
            // Include match, location, history objects so we have
            // access to extra React Router functionality if needed.
            match,
            location,
            history
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params, match, location, history]);
}


export function useDebounce(value, delay) {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(
        () => {
            // Update debounced value after delay
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            // Cancel the timeout if value changes (also on delay change or unmount)
            // This is how we prevent debounced value from updating if value is changed ...
            // .. within the delay period. Timeout gets cleared and restarted.
            return () => {
                clearTimeout(handler);
            };
        },
        [value, delay] // Only re-call effect if value or delay changes
    );

    return debouncedValue;
}

export function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};


export function useTabHide() {
    useEffect(() => {
        setTimeout(() => {
            const tabbar = document.querySelector("ion-tab-bar");
            tabbar.classList.toggle('ion-hide', true);
            return () => {
                const tabbar = document.querySelector("ion-tab-bar");
                tabbar.classList.toggle('ion-hide', false);
                console.log('showed tab');

            }
        })
    }, [])
}

const useInfiniteScroll = (callback) => {
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!isFetching) return;
        callback(() => {
            console.log('called back');
        });
    }, [isFetching]);

    function handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetching) return;
        setIsFetching(true);
    }

    return [isFetching, setIsFetching];
};

export default useInfiniteScroll;

export function createToast(msg, color = 'success', position='bottom', duration=800) {
    toastController.create({
        buttons: [{
            text: 'OK'
        }],
        color: color,
        duration: duration,
        position: position,
        message: msg,
    }).then(r => r.present()).catch(err => console.log(err));
}

const options = {
    targetSizes: 0.12,
    quality: 0.75,
    maxWidth: 1024,
    maxHeight: 1024,
}

const Compress = new compress()

export async function compressImage(images) {
    const files = [...images]
    let conversions = await Compress.compress(files)
    console.log(conversions[0]);
    // return conversion
    const { photo, info } = conversions[0]
    return { photo, info };
}

export const isUrl = string => {
    try { return Boolean(new URL(string)); }
    catch (e) { return false; }
}