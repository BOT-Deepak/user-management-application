// importing required libraries

import { NextResponse } from "next/server";
import db from '../../firebaseConfig';
import {doc, updateDoc } from "firebase/firestore";

// POST() function to update role into the database of the user.

export async function POST(req) {

    try {
        const { rep, organization, role } = await req.json();

        await updateDoc(doc(db, 'users', rep), {
            role: role
        });

        console.log('User data updated with id: ', rep);

        return NextResponse.json(
            { message: 'User data updated.' },
            { status: 201 },
        );
    } catch(e) {
        console.error('Error updating document: ', e);
        return NextResponse.json(
            { message: 'An error occured.'},
            { status: 500 },
        );
    }
}