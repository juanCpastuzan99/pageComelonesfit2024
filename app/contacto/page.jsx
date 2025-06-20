'use client';
import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const ContactoPage = () => {
    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            <div className="py-20 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                            Contáctanos
                        </h2>
                        <p className="mt-4 text-lg leading-6 text-gray-500 dark:text-gray-400">
                            Estamos aquí para ayudarte. Rellena el formulario o contáctanos directamente.
                        </p>
                    </div>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Formulario de Contacto */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                            <form action="#" method="POST" className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="sr-only">Nombre</label>
                                    <input type="text" name="name" id="name" placeholder="Tu Nombre" className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"/>
                                </div>
                                <div>
                                    <label htmlFor="email" className="sr-only">Email</label>
                                    <input id="email" name="email" type="email" autoComplete="email" placeholder="Tu Email" className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"/>
                                </div>
                                <div>
                                    <label htmlFor="message" className="sr-only">Mensaje</label>
                                    <textarea id="message" name="message" rows="4" placeholder="Tu Mensaje" className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-green-500 focus:border-green-500 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"></textarea>
                                </div>
                                <div>
                                    <button type="submit" className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                        Enviar Mensaje
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Información de Contacto */}
                        <div className="space-y-8">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <FaEnvelope className="h-6 w-6 text-green-500" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email</h3>
                                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                                        <a href="mailto:pastuzanjuancarlos@gmail.com" className="hover:text-green-500">pastuzanjuancarlos@gmail.com</a>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <FaPhone className="h-6 w-6 text-green-500" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Teléfono</h3>
                                    <p className="mt-1 text-gray-600 dark:text-gray-400">3102887973</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <FaMapMarkerAlt className="h-6 w-6 text-green-500" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Dirección</h3>
                                    <p className="mt-1 text-gray-600 dark:text-gray-400">Mocoa, Putumayo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactoPage; 