// importing required libraries

import { NextResponse } from "next/server";
import db from '../../firebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";

// POST() function to get the id of the document with the information to make update and delete operations
// will be useful in handling permissions and updating the database

export async function POST(req) {

    try {
        const { email, organization } = await req.json();

        const q = query(collection(db, 'users'), where("email", "==", email), where("organization", "==", organization));
        const querySnapshot = await getDocs(q);

        let rep = "";

        querySnapshot.forEach((doc) => {
            const { verified } = doc.data();
            if(verified == "true") {
                rep = doc.id;
            }
        })
        
        return NextResponse.json(
            { docid: rep },
            { message: 'User registered.' },
            { status: 201 },
        );
        
    } catch(e) {
        console.error('There is some problem handling the request: ', e);
        return NextResponse.json(
            { data: "" },
            { message: 'An error occured.'},
            { status: 500 },
        );
    }
}
