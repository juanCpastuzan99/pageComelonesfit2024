"use client";

import Sidebar from "../../components/Sidebar";

export default function ProtectedLayout({ children }) {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <main style={{ 
                marginLeft: '250px', 
                width: 'calc(100% - 250px)',
                padding: '20px'
            }}>
                {children}
            </main>
        </div>
    );
} 