import React, { createContext, useState } from 'react';

const AttendanceContext = createContext({
    state: { 
        isIn: false
    },
    actions: {
        setIsIn: () => {}
    }
});

const AttendanceProvider = ({ children }) => {
    const [isIn, setIsIn] = useState(false);

    const value = {
        state: { isIn },
        actions: { setIsIn }
    };

    return (
        <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>
    );
};

const { Consumer: AttendanceConsumer } = AttendanceContext;

export { AttendanceProvider, AttendanceConsumer };

export default AttendanceContext;