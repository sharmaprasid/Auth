"use client"
import React, { useEffect, useState } from 'react';
import {
    AiFillLock,
    AiOutlineEye,
    AiOutlineEyeInvisible,
    AiOutlineLock,
} from 'react-icons/ai';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Joi from 'joi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

const PASSWORD_FIELD = 'password';
const CONFIRM_PASSWORD_FIELD = 'confirmpassword';

interface FormValues {
    password: string;
    confirmpassword: string;
}

const formdetail = [
    { id: 1, icon: <AiFillLock size={20} />, placeholder: 'Password', type: 'password', name: 'password' },
    { id: 2, icon: <AiOutlineLock size={20} />, placeholder: 'Confirm Password', type: 'password', name: 'confirmpassword' },
];

const validationSchema = Yup.object({
    password: Yup.string().required('Password is required'),
    confirmpassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
});

const validationSchemaJoi = Joi.object({
    password: Joi.string().required(),
    confirmpassword: Joi.any()
        .equal(Joi.ref('password'))
        .required()
        .label('Confirm Password')
        .options({ messages: { 'any.only': '{{#label}} does not match' } }),
});

const UpdatePasswordPage = () => {
    const [token, setToken] = useState('');

    const [error, setError] = useState(false);
    const [passwordToggle, setPasswordToggle] = useState(true);
    const [confirmPasswordToggle, setConfirmPasswordToggle] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const urlToken = window.location.search.split('=')[1];
        setToken(urlToken || '');
    }, []);

    const handlePasswordToggle = () => {
        setPasswordToggle(!passwordToggle);
    };

    const handleConfirmPasswordToggle = () => {
        setConfirmPasswordToggle(!confirmPasswordToggle);
    };

    const getPasswordFieldType = () => {
        return passwordToggle ? 'password' : 'text';
    };
    const handlesubmit = async (values: FormValues) => {
        {
            try {
                await validationSchemaJoi.validateAsync(values, { abortEarly: false });
                const data = {
                    password: values.password,
                    token,
                };
                const response = await axios.post('/api/users/verifypasswordemail',
                    data
                );


                if (response.status === 200) {
                    toast.success('Password updated successfully');
                    router.push('/login');
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
        }
    }

    const getConfirmPasswordFieldType = () => {
        return confirmPasswordToggle ? 'password' : 'text';
    };

    const PasswordToggle: React.FC<{
        togglePassword: () => void;
        isPasswordVisible: boolean;
    }> = ({ togglePassword, isPasswordVisible }) => (
        <div>
            <button onClick={togglePassword} type="button">
                {isPasswordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">

            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-8 text-center">Update Password</h1>
                    <Formik
                        initialValues={{ password: '', confirmpassword: '' }}
                        onSubmit={handlesubmit}
                        validationSchema={validationSchema}
                    >
                        {({ isValid }) => (
                            <Form className="space-y-4">
                                {formdetail.map((items) => (
                                    <div key={items.id}>
                                        <div className="flex items-center gap-4">
                                            <div>{items.icon}</div>
                                            <Field
                                                type={
                                                    items.name === PASSWORD_FIELD
                                                        ? getPasswordFieldType()
                                                        : items.name === CONFIRM_PASSWORD_FIELD
                                                            ? getConfirmPasswordFieldType()
                                                            : 'text'
                                                }
                                                name={items.name}
                                                className="outline-none text-gray-600 rounded-md px-3 py-2 w-full focus:ring focus:ring-blue-300"
                                                placeholder={items.placeholder}
                                            />
                                            {items.name === PASSWORD_FIELD && (
                                                <PasswordToggle togglePassword={handlePasswordToggle} isPasswordVisible={passwordToggle} />
                                            )}
                                            {items.name === CONFIRM_PASSWORD_FIELD && (
                                                <PasswordToggle togglePassword={handleConfirmPasswordToggle} isPasswordVisible={confirmPasswordToggle} />
                                            )}
                                        </div>
                                        <ErrorMessage name={items.name} component="div" className="text-red-500" />
                                        <hr className="my-2" />
                                    </div>
                                ))}

                                <div className="flex justify-between items-center">
                                    <button
                                        className={`${!isValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
                                            } text-white font-bold py-2 px-4 rounded`}
                                        type="submit"
                                        disabled={!isValid}
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

        </div>
    );
};

export default UpdatePasswordPage;
