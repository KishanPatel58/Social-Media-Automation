import { createContext, useEffect, useState } from "react";
import Lenis from "lenis";

export const lenisContext = createContext();

const LenisProvider = ({ children }) => {

    const [lenis, setLenis] = useState(null);

    useEffect(() => {

        const lenisInstance = new Lenis({
            autoRaf: true,
        });

        setLenis(lenisInstance);

        return () => {
            lenisInstance.destroy();
        };

    }, []);

    return (
        <lenisContext.Provider value={lenis}>
            {children}
        </lenisContext.Provider>
    );
};

export default LenisProvider;