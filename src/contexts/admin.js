import React, { createContext, useState } from 'react';

const AdminContext = createContext({
    state: { 
        meetingNumber: '',
        passWord: ''
    },
    actions: {
        setMeetingNumber: () => {},
        setPassWord: () => {}
    }
});

const AdminProvider = ({ children }) => {
    const [meetingNumber, setMeetingNumber] = useState('');
    const [passWord, setPassWord] = useState('');

    const value = {
        state: { meetingNumber, passWord },
        actions: { setMeetingNumber, setPassWord }
    };

    return (
        <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
    );
};

const { Consumer: AdminConsumer } = AdminContext;

export { AdminProvider, AdminConsumer };

export default AdminContext;