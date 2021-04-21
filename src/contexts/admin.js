import React, { createContext, useState } from 'react';

const AdminContext = createContext({
    // default state (rapido300@gmail.com)
    state: { 
        meetingNumber: '4515514600',
        passWord: '951810'
    },
    actions: {
        setMeetingNumber: () => {},
        setPassWord: () => {}
    }
});

const AdminProvider = ({ children }) => {
    const [meetingNumber, setMeetingNumber] = useState('4515514600');
    const [passWord, setPassWord] = useState('951810');

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