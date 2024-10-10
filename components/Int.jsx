// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID, // Asegúrate de definir esta variable en tu .env
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Asegúrate de definir esta variable en tu .env
    }),
  ],
  // Puedes agregar más opciones aquí si es necesario
});
