import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../app/firebase/firebaseConfig";

async function getDashboardMetrics() {
    try {
        const usersCollection = collection(db, 'users');
        const productsCollection = collection(db, 'productos');
        const ordersCollection = collection(db, 'ordenes');

        const usersSnapshot = await getDocs(usersCollection);
        const productsSnapshot = await getDocs(productsCollection);
        const ordersSnapshot = await getDocs(ordersCollection);

        const usersCount = usersSnapshot.size;
        const productsCount = productsSnapshot.size;
        const ordersCount = ordersSnapshot.size;

        const sales = ordersSnapshot.docs.reduce((total, order) => {
            return total + (order.data().total || 0);
        }, 0);

        return {
            usersCount,
            productsCount,
            ordersCount,
            sales
        };

    } catch (error) {
        console.error("Error al obtener las métricas del dashboard:", error);
        return {
            usersCount: 0,
            productsCount: 0,
            ordersCount: 0,
            sales: 0
        };
    }
}

async function main() {
    const metrics = await getDashboardMetrics();
    // Salida en formato JSON para que pueda ser procesada por otros scripts
    process.stdout.write(JSON.stringify(metrics));
}

main(); 