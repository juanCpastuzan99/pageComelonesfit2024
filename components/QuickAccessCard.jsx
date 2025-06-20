import React from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

const QuickAccessCard = ({ icon, title, description, href }) => {
    return (
        <Link href={href}>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                            {icon}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
                        </div>
                    </div>
                    <FaArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
            </div>
        </Link>
    );
};

export default QuickAccessCard; 