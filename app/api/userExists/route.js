import { NextResponse } from "next/server";
import db from '../../firebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";

// function to check if user exists with the given email and organization, then return true;
// POST request which returns NextResponse, with information about the data and status code.
export async function POST(req) {
    try {
        const { email, organization } = await req.json();

        const q = query(collection(db, 'users'), where("email", "==", email), where("organization", "==", organization));
        const querySnapshot = await getDocs(q);

        let user = null;

        querySnapshot.forEach((doc) => {
            user = doc.data();
        });
        
        return NextResponse.json(
            { data: user },
            { message: 'User Exists found.' },
            { status: 201 },
        );
        
    } catch(e) {
        console.error('There is some problem handling the request: ', e);
        return NextResponse.json(
            { data: null },
            { message: 'An error occured.'},
            { status: 500 },
        );
    }
}
