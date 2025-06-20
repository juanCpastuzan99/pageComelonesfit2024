"use client";
import React from 'react';
import { FaBoxOpen, FaShoppingCart, FaUsers, FaChartLine, FaUserShield, FaPlusSquare, FaListAlt, FaUserCog } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import QuickAccessCard from '../../../components/QuickAccessCard';
import { configUtils } from '../../config/appConfig';
import UserStats from './UserStats';
import ProductosDestacados from '../../../components/ProductosDestacados';

const DashboardPage = () => {
    const { user } = useAuth();
    const { isAdmin, isOwner, userRole, can, loading: permissionsLoading } = usePermissions();

    const adminLinks = [
        {
            title: 'Gestionar Productos',
            description: 'Añadir, editar y eliminar productos.',
            href: '/productos',
            icon: <FaBoxOpen className="h-6 w-6 text-green-500" />,
            permission: 'manage_products',
        },
        {
            title: 'Ver Pedidos',
            description: 'Revisa y gestiona los pedidos de los clientes.',
            href: '/admin/pedidos',
            icon: <FaListAlt className="h-6 w-6 text-green-500" />,
            permission: 'access_admin',
        },
        {
            title: 'Gestionar Usuarios',
            description: 'Administra los roles y permisos de los usuarios.',
            href: '/admin/users',
            icon: <FaUsers className="h-6 w-6 text-green-500" />,
            permission: 'access_admin',
            ownerOnly: true,
        },
        {
            title: 'Panel de Seguridad',
            description: 'Verifica y corrige la seguridad del sistema.',
            href: '/admin/security',
            icon: <FaUserShield className="h-6 w-6 text-green-500" />,
            permission: 'access_admin',
            ownerOnly: true,
        }
    ];

    const visitorLinks = [
        {
            title: 'Explorar Productos',
            description: 'Navega por nuestro catálogo completo.',
            href: '/productos',
            icon: <FaShoppingCart className="h-6 w-6 text-green-500" />,
            permission: 'view_products',
        },
        {
            title: 'Mis Pedidos',
            description: 'Revisa el historial de tus compras.',
            href: '/pedidos',
            icon: <FaListAlt className="h-6 w-6 text-green-500" />,
            permission: 'view_products',
        },
        {
            title: 'Mi Perfil',
            description: 'Actualiza tu información personal.',
            href: '/perfil',
            icon: <FaUserCog className="h-6 w-6 text-green-500" />,
            permission: 'view_products',
        },
    ];

    const linksToShow = isAdmin 
        ? adminLinks.filter(link => !link.ownerOnly || isOwner)
        : visitorLinks;
        
    const roleName = configUtils.getRoleInfo(userRole).name || userRole;

    if (permissionsLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Bienvenido de nuevo, {user?.displayName?.toUpperCase() || user?.email}!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
                Aquí tienes tus accesos rápidos. Tu rol actual es: <span className="font-semibold text-green-500">{roleName}</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {linksToShow.filter(link => can(link.permission)).map(link => (
                    <QuickAccessCard
                        key={link.title}
                        icon={link.icon}
                        title={link.title}
                        description={link.description}
                        href={link.href}
                    />
                ))}
            </div>
            <div className="mt-8">
                <UserStats />
            </div>
            <div className="mt-8">
                <ProductosDestacados />
            </div>
        </div>
    );
};

export default DashboardPage;