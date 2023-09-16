"use client"
import React, { useState } from 'react';
import { AiFillLock, AiFillFacebook, AiFillGoogleSquare, AiFillTwitterSquare, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Joi from 'joi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdEmail } from 'react-icons/md';

// Constants for field names
const EMAIL_FIELD = 'email';
const PASSWORD_FIELD = 'password';

interface User {
    email: string;
    password: string;
}

const url = '/profile';

const formDetails = [
    { id: 1, icon: <MdEmail size={20} />, placeholder: 'johndoe@gmail.com', name: EMAIL_FIELD },
    { id: 2, icon: <AiFillLock size={20} />, placeholder: 'Password', name: PASSWORD_FIELD },
];

const socialHandleLogin = [
    { id: 1, icon: <AiFillFacebook size={20} color="#3B5998" /> },
    { id: 2, icon: <AiFillTwitterSquare size={20} color="#1DA0F2" /> },
    { id: 3, icon: <AiFillGoogleSquare size={20} color="#E72734" /> }
];

// Password toggle button component
const PasswordToggle: React.FC<{ togglePassword: () => void, isPasswordVisible: boolean }> = ({ togglePassword, isPasswordVisible }) => (
    <div>
        <button onClick={togglePassword} type="button">
            {isPasswordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </button>
    </div>
);

const LoginPage = () => {
    const [user, setUser] = useState<User>({ email: '', password: '' });
    const [passwordToggle, setPasswordToggle] = useState(true);
    const router = useRouter();

    const handlePasswordToggle = () => {
        setPasswordToggle(!passwordToggle);
    };

    const getPasswordFieldType = () => {
        return passwordToggle ? 'password' : 'text';
    };

    const handleSubmit = async (values: User) => {
        try {
            // Server-side validation using Joi
            const validationSchemaJoi = Joi.object({
                [EMAIL_FIELD]: Joi.string().required(),
                [PASSWORD_FIELD]: Joi.string().required(),
            });

            const { error } = validationSchemaJoi.validate(values);
            if (error) {
                alert(error.details.map((detail) => detail.message).join('\n'));
                return;
            }

            const response = await axios.post('/api/users/login', values);

            if (response.status === 200) {
                toast.success('Login successful');
                router.push(url);
            }
        } catch (error) {
            console.error(error);
            toast.error('Login Failed. Try again');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
                <Formik
                    initialValues={{ [EMAIL_FIELD]: '', [PASSWORD_FIELD]: '' }}
                    validationSchema={Yup.object({
                        [EMAIL_FIELD]: Yup.string().required('Email is required'),
                        [PASSWORD_FIELD]: Yup.string().required('Password is required'),
                    })}
                    onSubmit={handleSubmit}
                >
                    {() => (
                        <Form className="space-y-4">
                            {formDetails.map((item) => (
                                <div key={item.id}>
                                    <div className="flex items-center gap-4">
                                        <div>{item.icon}</div>
                                        <Field
                                            type={item.name === PASSWORD_FIELD ? getPasswordFieldType() : 'text'}
                                            name={item.name}
                                            className="outline-none text-gray-600 rounded-md px-3 py-2 w-full focus:ring focus:ring-blue-300"
                                            placeholder={item.placeholder}
                                        />
                                        {item.name === PASSWORD_FIELD && (
                                            <PasswordToggle togglePassword={handlePasswordToggle} isPasswordVisible={passwordToggle} />
                                        )}
                                    </div>
                                    <ErrorMessage name={item.name} component="div" className="text-red-500" />
                                    <hr className="my-2" />
                                </div>
                            ))}

                            <div className="flex justify-between items-center">
                                <button
                                    className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    type="submit"
                                >
                                    Login
                                </button>
                            </div>
                            <div className="mt-4 text-center">
                                <Link href="/register" className="text-blue-500 underline">
                                    Create Account
                                </Link>
                            </div>
                            <div className="mt-6 text-center">
                                <Link href="/forgotpassword" className="text-blue-500 underline">
                                    Forgot Password?
                                </Link>
                            </div>
                            <hr />
                            <div className="mt-6 text-center">
                                <p className="mb-2">Or login with:</p>
                                <div className="flex gap-2 items-center justify-center">
                                    {socialHandleLogin.map((item) => (
                                        <div key={item.id} className="text-blue-500 cursor-pointer">
                                            {item.icon}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default LoginPage;
