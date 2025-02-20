'use client'
import axios from "axios";
import { useEffect, useState } from "react";

interface User {
    id: string;
    displayName: string | null;
    mail: string | null;
    jobTitle: string | null;
}

export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [searchJob, setSearchJob] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("/api/users");
                setUsers(response.data.value);
                setFilteredUsers(response.data.value);
            } catch (err) {
                setError("Failed to load users");
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(user =>
            (user.displayName?.toLowerCase().includes(search.toLowerCase()) || search === "") &&
            (user.jobTitle?.toLowerCase().includes(searchJob.toLowerCase()) || searchJob === "") 
        );
        setFilteredUsers(filtered);
    }, [search, searchJob, users]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 mt-4 w-full text-center">User List</h1>
            <div className="flex w-full justify-center">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4 p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    placeholder="Search by job title..."
                    value={searchJob}
                    onChange={(e) => setSearchJob(e.target.value)}
                    className="mb-4 ml-2 p-2 border border-gray-300 rounded"
                /></div>

            <div className="mx-24">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2">id</th>
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">Email</th>
                            <th className="border border-gray-300 px-4 py-2">Job Title</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers
                            .filter(user => user.jobTitle !== null)
                            .map((user,index) => (
                                <tr key={user.id} className="border border-gray-300">
                                    <td className="border border-gray-300 px-4 py-2">{index+1}</td>
                                    <td className="border border-gray-300 px-4 py-2">{user.displayName || "N/A"}</td>
                                    <td className="border border-gray-300 px-4 py-2">{user.mail || "N/A"}</td>
                                    <td className="border border-gray-300 px-4 py-2">{user.jobTitle || "N/A"}</td>
                                </tr>
                            ))}

                    </tbody>
                </table>
            </div>
        </div>
    );
};
