"use client";

import { useEffect, useState } from "react";
import { Modal } from "../components/modal";
import axios from "axios";

interface User {
    id: string;
    displayName: string | null;
    mail: string | null;
    jobTitle: string | null;
}

export default function UsersList() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [fetchedUserData, setFetchedUserData] = useState<any>(null); // State to hold fetched user data

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/users");
                if (!res.ok) throw new Error("Failed to fetch users");

                const data = await res.json();
                setUsers(data.value || []);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(
        (user) =>
            user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) &&
            ["IT Officer"].includes(user.jobTitle ?? "")
    );

    const handleUserCheckboxChange = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleSubmit = async () => {
        try {
            await Promise.all(
                selectedUsers.map(async (userId) => {
                    const res = await fetch("/api/selected_users", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId: userId }),
                    });
                    if (!res.ok) throw new Error(`Failed to save user ${userId}`);
                })
            );

            alert("บันทึกข้อมูลสำเร็จ!");

            // After saving, fetch additional user data for each selected user
            const userDataArray = await Promise.all(
                selectedUsers.map(async (userId) => {
                    try {
                        const response = await axios.get(`/api/users/${userId}`);
                        return response.data; // Return the user data
                    } catch (error) {
                        console.error(`Failed to fetch user data for ${userId}:`, error);
                        return null;
                    }
                })
            );

            // Set the fetched data (just for the first user as an example)
            setFetchedUserData(userDataArray[0]); // You can customize this to handle multiple users

            setOpen(false);
            setSelectedUsers([]);
        } catch (error) {
            console.error("Error saving users:", error);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col place-items-center">
                <h2 className="text-xl font-semibold">Users List</h2>
                <button onClick={() => setOpen(true)} className="cursor-pointer border px-4 py-4 font-black">
                    ส่งอีเมล
                </button>
            </div>

            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="select-name">
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">เลือกผู้มีส่วนเกี่ยวข้อง:</h3>
                        <ul className="list-disc pl-5 border py-2 px-4 rounded-lg">
                            {selectedUsers.map((userId) => {
                                const user = users.find((u) => u.id === userId);
                                return user ? (
                                    <li key={userId} className="flex justify-between">
                                        {user.displayName} ({user.mail})
                                        <button
                                            onClick={() => setSelectedUsers(selectedUsers.filter((id) => id !== userId))}
                                            className="text-red-500 ml-2 border px-2"
                                        >
                                            X
                                        </button>
                                    </li>
                                ) : null;
                            })}
                        </ul>
                    </div>

                    <div className="mb-4 px-4">
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อ"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border px-4 py-1 rounded-lg w-full"
                        />
                    </div>

                    <div className="flex flex-col mb-4 max-h-60 overflow-y-auto">
                        {filteredUsers.map((user) => (
                            <div key={user.id} className="flex items-center mb-2 gap-2">
                                <input
                                    type="checkbox"
                                    id={`user-${user.id}`}
                                    value={user.id}
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => handleUserCheckboxChange(user.id)}
                                    className="mr-2"
                                />
                                <label htmlFor={`user-${user.id}`} className="text-sm">
                                    {user.displayName}
                                </label>
                                <span className="text-xs text-gray-500">({user.jobTitle})</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mb-4">
                        <button onClick={handleSubmit} className="px-6 py-2 bg-green-500 text-white rounded-md">
                            ยืนยัน
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Display fetched user data if available */}
            {fetchedUserData && (
                <div className="mt-4">
                    <h3 className="font-semibold">User Details:</h3>
                    <ul className="list-disc pl-5 border py-2 px-4 rounded-lg">
                        <li>Name: {fetchedUserData.displayName}</li>
                        <li>Job Title: {fetchedUserData.jobTitle}</li>
                        <li>Email: {fetchedUserData.mail}</li>
                        {/* Add other user details here */}
                    </ul>
                </div>
            )}
        </div>
    );
}

