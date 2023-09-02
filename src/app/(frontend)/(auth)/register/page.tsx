"use client"
import React from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';
import { AiFillLock, AiOutlineLock } from 'react-icons/ai';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Joi from 'joi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormValues {
    username: string;
    email: string;
    password: string;
    confirmpassword: string;
    agree: boolean;
}

const url = '/login';

const formdetail = [
    { id: 1, icon: <BsFillPersonFill size={20} />, placeholder: 'Username', type: 'text', name: 'username' },
    { id: 2, icon: <MdEmail size={20} />, placeholder: 'Email', type: 'email', name: 'email' },
    { id: 3, icon: <AiFillLock size={20} />, placeholder: 'Password', type: 'password', name: 'password' },
    { id: 4, icon: <AiOutlineLock size={20} />, placeholder: 'Confirm Password', type: 'password', name: 'confirmpassword' },
];

const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    confirmpassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm Password is required'),
    agree: Yup.boolean().oneOf([true], 'You must agree to the terms'),
});

const validationSchemaJoi = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(), // Adjust the email validation as per your requirements
    password: Joi.string().required(),
    confirmpassword: Joi.any()
        .equal(Joi.ref('password'))
        .required()
        .label('Confirm Password')
        .options({ messages: { 'any.only': '{{#label}} does not match' } }),
    agree: Joi.boolean().valid(true).required(),
});


const RegisterPage = () => {
    const router = useRouter();

    const handleSubmit = async (values: FormValues) => {
        try {
            await validationSchemaJoi.validateAsync(values, { abortEarly: false });

            const response = await axios.post('/api/users/register', values);

            if (response.status === 200) {
                toast.success("User Sign Up successfully")
                router.push(url);
            }
        } catch (error) {
            if (error instanceof Joi.ValidationError) {
                const errorMessages = error.details.map((detail: any) => detail.message).join('\n');
                toast.error(errorMessages);
            } else {
                console.error(error);
                alert('Something went wrong');
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 w-full max-w-md">
                <h1 className="text-3xl font-bold mb-8 text-center">Sign Up</h1>
                <Formik
                    initialValues={{ username: '', email: '', password: '', confirmpassword: '', agree: false }}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                >
                    {({ isValid }) => (
                        <Form className="space-y-4">
                            {formdetail.map((items) => (
                                <div key={items.id}>
                                    <div className="flex items-center gap-4">
                                        <div>{items.icon}</div>
                                        <Field
                                            type={items.type}
                                            name={items.name}
                                            className="outline-none text-gray-600 rounded-md px-3 py-2 w-full focus:ring focus:ring-blue-300"
                                            placeholder={items.placeholder}
                                        />
                                    </div>
                                    <ErrorMessage name={items.name} component="div" className="text-red-500" />
                                    <hr className="my-2" />
                                </div>
                            ))}

                            <div className="flex gap-5 py-6">
                                <Field type="checkbox" name="agree" id="agree" className="mr-2" />
                                <label htmlFor="agree" className="text-sm">
                                    I agree to all statements in{' '}
                                    <Link href="/Terms and Conditions.pdf">Terms of Service</Link>
                                </label>
                                <ErrorMessage name="agree" component="div" className="text-red-500" />
                            </div>
                            <div className="flex justify-between items-center">
                                <button
                                    className={`${!isValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
                                        } text-white font-bold py-2 px-4 rounded `}
                                    type="submit"
                                    disabled={!isValid}
                                >
                                    Register
                                </button>
                                <Link href={url} className="underline">
                                    I am already a member
                                </Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default RegisterPage;
