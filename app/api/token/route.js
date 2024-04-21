// importing required libraries

import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import db from '../../firebaseConfig';
import {doc, updateDoc } from "firebase/firestore";

// POST() function to update a random token into the database, and returning the token.

export async function POST(req) {

    try {
        const { docid, organization } = await req.json();
        const newToken = uuidv4();
        
        await updateDoc(doc(db, 'users', docid), {
            token: newToken,
        });

        console.log('User data updated with id: ', docid);

        return NextResponse.json(
            { data: newToken },
            { message: 'Token generated.' },
            { status: 201 },
        );
    } catch(e) {
        console.error('Problem with token: ', e);
        return NextResponse.json(
            { data: ""},
            { message: 'An error occured.'},
            { status: 500 },
        );
    }
}