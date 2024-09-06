"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {  Music2Icon } from "lucide-react"

export function Appbar() {
    const session = useSession();

    return <div className="flex justify-between px-20 pt-4">
        <div className="text-lg font-bold flex flex-col justify-center text-white">
        <div className="flex items-center space-x-2">
            <Music2Icon className="h-6 w-6 text-white p-0.5" /> 
          <div className="text-lg font-bold text-white p-3">Muzi</div>
        </div>
        </div>
        <div>
            {session.data?.user && <Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={() => signOut()}>Logout</Button>}
            {!session.data?.user &&<Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={() => signIn()}>Signin</Button>}
        </div>
    </div>
}