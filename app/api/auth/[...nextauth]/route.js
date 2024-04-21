// importing required libraries

import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

import db from '../../../firebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";

// Making an authentication handler to verify the signIn with details and storing session of the user.

export const authOptions = {

    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},
            async authorize(credentials) {

                // getting all the required credentials
                const { email, password, organization } = credentials;

                try {

                    // query in db ( NoSql database ) for matching email, password with current organization.
                    // checking organization so that user won't be albe to login in another organization if email and password are correct for one.
                    const q = query(
                        collection(db, 'users'),
                        where("email", "==", email),
                        where("password", "==", password),
                        where("organization", "==", organization),
                    );
                    
                    const querySnapshot = await getDocs(q);
                    var user = null;

                    // Store the data into user object to be later used for session management.

                    querySnapshot.forEach((doc) => {
                        const { name, email, role, verified } = doc.data();

                        if(verified == "true") {
                            user = {
                                name: name,
                                email: email,
                                organization: organization,
                                role: role,
                            }                            
                        }
                    });

                    return user;

                } catch(e) {
                    console.log("Error: ", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {

        // assigning the user properties to the current token and session for session management.

        jwt: async ({ token, user }) => {
            user && (token.user = user)
            return token;
        },
        session: async ({ session, token }) => {
            session.user = token.user
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/",
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };