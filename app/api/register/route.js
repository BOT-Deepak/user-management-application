// importing required libraries

import { NextResponse } from "next/server";
import db from '../../firebaseConfig';
import { query, collection, addDoc, where, getDocs } from "firebase/firestore";

// POST() function to register the user into the database

export async function POST(req) {

    try {
        const { name, email, password, organization } = await req.json();

        const q = query(collection(db, 'users'), where("email", "==", email), where("organization", "==", organization));
        const querySnapshot = await getDocs(q);

        let rep = "";

        querySnapshot.forEach((doc) => {
            rep = doc.id;
        })

        if(rep != "") {
            return NextResponse.json(
                { docid: rep },
                { message: 'User already present.' },
                { status: 201 },
            );
        }

        // adding docuement with data, into a collection named 'users'

        const docRef = await addDoc(collection(db, 'users'), {
            name: name,
            email: email,
            role: 'user',
            organization: organization,
            token: "",
            password: password,
            verified: "false",
        });
        console.log('User added with id: ', docRef.id);

        return NextResponse.json(
            { docid: docRef.id },
            { message: 'User registered.' },
            { status: 201 },
        );
    } catch(e) {
        console.error('Error adding document: ', e);
        return NextResponse.json(
            { docid: " "},
            { message: 'An error occured.'},
            { status: 500 },
        );
    }
}