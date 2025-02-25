'use client'

import { useEffect, useState } from "react";

export default function Username({ id }: { id: string }) {
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setUser("กำลังโหลด...");
                const res = await fetch(`/api/users/${id}`);
                if (!res.ok) throw new Error("Failed to fetch users");

                const data = await res.json();
                
                setUser(data.displayName);
            } catch (e) {
                setUser("โหลดล้มเหลว...");
            }
        };

        fetchUser();
    }, [id]);  

    return <>{user}</>;
}
