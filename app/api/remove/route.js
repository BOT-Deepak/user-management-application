// importing required libraries

import { NextResponse } from "next/server";
import db from '../../firebaseConfig';
import {doc, deleteDoc } from "firebase/firestore";

// POST() function to delete the document with the user information from the database

export async function POST(req) {

    try {
        const { rep, organization } = await req.json();

        await deleteDoc(doc(db, 'users', rep));
        console.log('User data deleted with id: ', rep);

        return NextResponse.json(
            { message: 'User data deleted.' },
            { status: 201 },
        );
    } catch(e) {
        console.error('Error deleting document: ', e);
        return NextResponse.json(
            { message: 'An error occured.'},
            { status: 500 },
        );
    }
}