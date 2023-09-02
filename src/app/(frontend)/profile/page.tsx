"use client"
import axios from "axios"

import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react'
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import Link from "next/link";

const ProfilePage = () => {
    const [data, setData] = useState('');
    const router = useRouter()
    const getUserDetails = async () => {
        const res = await axios.get('/api/users/me');
        setData(res.data.data._id)
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
            <h1>{data == '' ? '' : <Link href={`/profile/${data}`}>{data}</Link>}</h1>
            <hr />
            <button onClick={handleLogout}>Logout</button>
            <button onClick={getUserDetails}>GetDetaail</button>
        </div >
    )
}

export default ProfilePage