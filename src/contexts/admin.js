import React, { createContext, useState } from 'react';

const AdminContext = createContext({
    state: { 
        meetingNumber: '',
        passWord: '',
        affiliation: 'HYU',
        lectureName: '',
        name: '',
    },
    actions: {
        setMeetingNumber: () => {},
        setPassWord: () => {},
        setAffiliation: () => {},
        setLectureName: () => {},
        setName: () => {},
    }
});

const AdminProvider = ({ children }) => {
    const [meetingNumber, setMeetingNumber] = useState('');
    const [passWord, setPassWord] = useState('');
    const [affiliation, setAffiliation] = useState('');
    const [lectureName, setLectureName] = useState('');
    const [name, setName] = useState('');

    const value = {
        state: { meetingNumber, passWord, affiliation, lectureName, name },
        actions: { setMeetingNumber, setPassWord, setAffiliation, setLectureName, setName }
    };

    return (
        <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
    );
};

const { Consumer: AdminConsumer } = AdminContext;

export { AdminProvider, AdminConsumer };

export default AdminContext;