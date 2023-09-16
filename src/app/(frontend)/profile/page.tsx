"use client"
import axios from "axios"

import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react'
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import Link from "next/link";
interface userData {
    _id: string;
    email: string;
    username: string;

}
const ProfilePage = () => {
    const [data, setData] = useState<userData>({
        _id: '', email: '', username: ''
    });
    const router = useRouter()
    const getUserDetails = async () => {
        const res = await axios.get('/api/users/me');
        console.log(res.data)
        setData(res.data.data)
    }
    const handleLogout = async () => {
        try {
            await axios.get('/api/users/logout');
            toast.success("Logout Successfully")
            router.push('/')


        } catch (error: any) {
            toast.error(error.message)
            console.log(error)
        }
    }
    return (
        <div className='flex flex-col items-center justify-center py-2 min-h-screen'>
            <h1>Profile</h1>
            <hr />ProfilePage
            <h1>{data._id == '' ? '' : <Link href={`/profile/${data._id}`}> {data._id && (
                <div>
                    <p>Email: {data.email}</p>
                    <p>Username: {data.username}</p>
                </div>
            )}</Link>}</h1>
            <hr />
            <button onClick={handleLogout}>Logout</button>
            <button onClick={getUserDetails}>GetDetaail</button>
        </div >
    )
}

export default ProfilePage