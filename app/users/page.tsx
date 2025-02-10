'use client';

import { useEffect, useState } from 'react';

interface User {
    id: string;
    displayName: string | null;
    mail: string | null;
    jobTitle: string | null;
}

export default function UsersList() {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchBy, setSearchBy] = useState<'displayName' | 'jobTitle'>('displayName');


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/users");
                if (!res.ok) throw new Error("Failed to fetch users");

                const data = await res.json();
                setUsers(data.value || []);
            } catch (error) {
                setError("Error fetching users");
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        if (searchBy === 'jobTitle') {
            return user.jobTitle && user.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (searchBy === 'displayName') {
            return user.displayName && user.displayName.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
    });
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Users List</h2>

            <div className='flex justify-center'>
                <div className='flex justify-center mb-4'>
                    <select
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value as 'displayName' | 'jobTitle')}
                        className="border px-4 rounded-s-xl"
                    >
                        <option value="displayName">Search by Name</option>
                        <option value="jobTitle">Search by Job Title</option>
                    </select>
                </div>
                <div className='flex justify-center mb-4'>
                    <input
                        type="text"
                        placeholder={searchBy === 'displayName' ? "Enter name" : "Enter job title"}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border px-4  rounded-r-xl"
                    />
                </div>
            </div>
            <div className='flex justify-center mx-8'>
                <table className="table-auto min-w-max w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-black">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400 text-center">
                        <tr className="bg-gray-100 text-center">
                            <th className="px-4 py-2">id</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Job Title</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <tr key={user.id} className="hover:bg-gray-100 border border-black text-center cursor-pointer">
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2">{user.displayName}</td>
                                <td className="px-4 py-2 text-sm text-gray-500">{user.mail}</td>
                                <td className="px-4 py-2 text-sm text-gray-500">{user.jobTitle}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
