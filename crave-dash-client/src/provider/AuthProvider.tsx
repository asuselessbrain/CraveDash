"use client"
import { UserProvider } from '@/context/UserContext'
import React from 'react'

export default function Provider({ children }: { children: React.ReactNode }) {
    return <UserProvider>{children}</UserProvider>
}