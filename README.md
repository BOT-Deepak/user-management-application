This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Access the [webpage for user-management-application](https://user-management-application-qhphjsfb1.vercel.app/) here.

## Understanding the Pages

- LoginPage: It asks for `Email`, `Password` and `Organization` details for login. You can only `login` after `registration` and `email verification`.
- RegisterPage: It asks for `Full Name`, `Email`, `Password` and `Organization` details for registering. You `cannot register if you are verified with this email with this organization`.
  You can `register with same email but for another organization` but again verifying your email.
- ResetPage: It asks for `Email` and `Organization` details for `password-reset`. Will send a mail with a link for resetting the password.

## After Successful Login

- Dashboard: The user dashboard shows information about the current logged in user's `Name`, `Email`, `Organization` and `Permission` (which is given by role)
- There are two buttons on the dashboard:
  1) Fetch Data: This button fetches the data of all members present in the database ( however, it somehow depends on the user role ).
  2) Log Out: Moves out of the session and sign out the user.

## Understanding the Roles

- Roles are of 3 types:
- `admin` 2) `manager` 3) `user` (by default every new user added in database is given `user` role)
- `admin`: I limit the `admin` to only be one user, who can maintain positions, roles and even delete any data from the database. This role has no scope of boundaries.
- `manager`: This role is given to the head of a single organization ( like moderators, given to zero or many users ). The user can only fetch list of data from his organization.
- `user`: This is the default role given to every new user, which can be changed by manager and admin.
- Both `user` can fetch data of their organization, but admin has no limit of scope.

## Deploy on Vercel

I used Vercel to deploy the Nextjs application.
Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
