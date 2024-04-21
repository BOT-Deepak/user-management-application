// this is the dashboard page of the logged-in user

"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

import db from '../firebaseConfig';
import { getDocs, query, collection, where } from "firebase/firestore";
import { toast } from "sonner";

export default function UserInfo() {

    const { data: session } = useSession();
    let [show, setShow] = useState("false");

    let notShowTable = (
        <div></div>
    );

    let spaceForDataShowing = notShowTable;

    // function addItems() takes document information from the database and add the data into the table
    // handles the properties for switching role and deleting the user from the database

    function addItems(doc) {

        const res = doc.data();
        const rep = doc.id;

        let place = document.getElementById("datadiv");
        let { name, email, organization, role} = res;

        let design = "py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white";

        let newRow = place.insertRow(-1);

        let newCell0 = newRow.insertCell(0);
        let newCell1 = newRow.insertCell(1);
        let newCell2 = newRow.insertCell(2);
        let newCell3 = newRow.insertCell(3);
        let newCell4 = newRow.insertCell(4);
        let newCell5 = newRow.insertCell(5);

        let nameText = document.createElement("span");
        nameText.textContent = name;
        newCell0.appendChild(nameText);
        newCell0.className = design;

        let emailText = document.createElement("span");
        emailText.textContent = email;
        newCell1.appendChild(emailText);
        newCell1.className = design;

        let organizationText = document.createElement("span");
        organizationText.textContent = organization;
        newCell2.appendChild(organizationText);
        newCell2.className = design;

        let roleText = document.createElement("span");
        roleText.textContent = role;
        newCell3.appendChild(roleText);
        newCell3.className = design;

        // checking if the current role of user is 'user', then he/she should not be able to see the option to switch role or delete.
        // checking if the role of the document data is admin, noOne can change that, because there can only be one admin.

        if(session?.user?.role == "user" || role == "admin" || (session?.user?.role == "manager" && role == "manager")) {
            newRow.className = "hover:bg-gray-100 dark:hover:bg-gray-700";
            return;
        } 

        let link = document.createElement("a");
        link.href = "#";
        link.textContent = "Switch Role";
        link.className = "text-blue-600 dark:text-blue-500 hover:underline";

        // event listener function to switch the roles.

        link.addEventListener("click", async () => {
            if(role == "manager") {
                role = "user";
            }
            else {
                role = "manager";
            }

            await fetch('api/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rep, organization, role }),
            })

            toast.success(`${name}'s role change to ${role}`);
            roleText.textContent = role;
        });

        newCell4.appendChild(link);
        newCell4.className = "py-4 px-6 text-sm font-medium text-right whitespace-nowrap";

        let del = document.createElement("a");
        del.href = "#";
        del.textContent = "Delete User";
        del.className = "text-orange-600 dark:text-orange-500 hover:underline";

        // event listener function to delete the document.

        del.addEventListener("click", async () => {
            
            await fetch('api/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rep, organization }),
            });

            toast.warning(`${name}'s data has been deleted from ${organization}`);
            
            nameText.style.textDecoration = "line-through";
            emailText.style.textDecoration = "line-through";
            organizationText.style.textDecoration = "line-through";
            roleText.style.textDecoration = "line-through";
            link.textContent = "";
            del.textContent = "";
        });


        newCell5.appendChild(del);
        newCell5.className = "py-4 px-6 text-sm font-medium text-right whitespace-nowrap";

        newRow.className = "hover:bg-gray-100 dark:hover:bg-gray-700";
    }

    // showList() function is used to fetch the list from database and show in the table.

    const showList = async (e) => {
        e.preventDefault();

        if(show == "true") {
            return;
        }

        setShow("true");
        toast.info("Fetching list .*.*.*.");

        if(session?.user?.role == "admin") {
            const q = query(collection(db, 'users'));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                addItems(doc);
            });
        } else {
            const q = query(collection(db, 'users'), where("organization", "==", session?.user?.organization));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                addItems(doc);
            });
        }
    }

    // this is the structure of the table

    let showTable = (
        <div>
            <div class="max-w-3xl mx-auto">
                    <div class="flex flex-col">
                    <div class="overflow-x-auto shadow-md sm:rounded-lg">
                        <div class="inline-block min-w-full align-middle">
                            <div class="overflow-hidden ">
                                <table class="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
                                    <thead class="bg-gray-100 dark:bg-gray-700">
                                        <tr>
                                            <th scope="col" class="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                Name
                                            </th>
                                            <th scope="col" class="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                Email
                                            </th>
                                            <th scope="col" class="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                Organization
                                            </th>
                                            <th scope="col" class="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                Role
                                            </th>
                                            <th scope="col" class="p-4">
                                                <span class="sr-only">Switch</span>
                                            </th>
                                            <th scope="col" class="p-4">
                                                <span class="sr-only">Delete</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody id="datadiv" class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if(show == "true") {
        spaceForDataShowing = showTable;
    } else {
        spaceForDataShowing = notShowTable;
    } 

    return (
        <div className="grid place-items-center h-screen">
            <div className="shadow-lg p-10 rounded-lg border-4 border-gray-400 ">
                <div className="text-xl font-bold">Name: <span className="font-bold text-orange-800">{session?.user?.name}</span></div>
                <div className="text-xl font-bold">Email: <span className="font-bold text-orange-700">{session?.user?.email}</span></div>
                <div className="text-xl font-bold">Organization: <span className="font-bold text-orange-700">{session?.user?.organization}</span></div>
                <div className="text-xl font-bold">Permission: <span className="font-bold text-orange-700">{session?.user?.role}</span></div>
                <div>
                    <button 
                        onClick={showList}
                        className="bg-blue-500 text-white font-bold px-6 py-2 my-3 mx-3">
                        Fetch List
                    </button>
                    <button 
                        onClick={() => signOut()}
                        className="bg-red-500 text-white font-bold px-6 py-2 my-3 mx-3">
                        Log Out
                    </button>
                </div>
                
        {spaceForDataShowing}
        </div>
    </div>
    )
}