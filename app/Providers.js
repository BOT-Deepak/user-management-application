"use client";

import { SessionProvider } from 'next-auth/react';

export const AuthProviderTempo = ({ children }) => {
    return <SessionProvider> {children} </SessionProvider>;
};
