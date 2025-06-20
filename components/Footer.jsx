import React from 'react';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    { name: 'GitHub', icon: FaGithub, url: 'https://github.com/juancarlos-1996' },
    { name: 'LinkedIn', icon: FaLinkedin, url: 'https://www.linkedin.com/in/juan-carlos-pastuzan-8a6a25225/' },
    { name: 'Twitter', icon: FaTwitter, url: '#' },
  ];

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            {socialLinks.map((item) => (
              <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500">
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Comelones Fit. Todos los derechos reservados.
            </p>
            <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-1">
              Desarrollado con ❤️ por Juan Carlos Pastuzan.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 