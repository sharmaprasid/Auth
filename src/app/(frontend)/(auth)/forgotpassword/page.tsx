"use client"
import React from 'react';
import { MdEmail } from 'react-icons/md';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';

interface User {
    email: string;
}

const url = '/verifypassword';

const formDetails = [
    {
        id: 1,
        icon: <MdEmail size={20} />,
        placeholder: 'johndoe@gmail.com',
        type: 'email',
        name: 'email',
    },
];

const validationSchemaYup = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
});

const LoginPage: React.FC = () => {
    const router = useRouter();

    const handleSubmit = async (values: User) => {
        try {

            await validationSchemaYup.validate(values, { abortEarly: false });
            const response = await axios.post('/api/users/forgotpassword', values);
            router.push(url);
            if (response.status === 200) {
                router.push(url);

            }
        } catch (error) {
            console.error(error);

        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 max-w-md">
                <h1 className="text-3xl font-bold mb-4 text-center">Forgot Password</h1>
                <p className="text-gray-600 text-center mb-6">
                    Enter the email associated with your account,    we&apos;ll send you a link to reset your password.
                </p>
                <Formik
                    initialValues={{ email: '' }}
                    validationSchema={validationSchemaYup}
                    onSubmit={handleSubmit}
                >
                    {() => (
                        <Form className="space-y-4">
                            {formDetails.map(({ id, icon, type, name, placeholder }) => (
                                <div key={id}>
                                    <div className="flex items-center gap-4">
                                        <div>{icon}</div>
                                        <Field
                                            type={type}
                                            name={name}
                                            className="outline-none text-gray-600 rounded-md px-3 py-2 w-full focus:ring focus:ring-blue-300"
                                            placeholder={placeholder}
                                        />
                                    </div>
                                    <ErrorMessage name={name} component="div" className="text-red-500" />
                                </div>
                            ))}

                            <div className="flex justify-center">
                                <button
                                    className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    type="submit"
                                >
                                    Continue
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default LoginPage;
