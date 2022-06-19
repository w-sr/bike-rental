# Bike rental app

Simple bike rental app that allows users can reserve bike and submit rate

## Features

- Managers can create, delete, update, read users and managers
- Managers can create, delete, update, read bikes
- Users can reserve bikes for some dates
- Users can cancel reservation and also submit rates

## Tech

- React 18.1.0
- React router v6
- Mui v5
- Formik
- Yup
- Node
- Express
- Mongoose
- JWT
- Apollo client/server

## Installation

### Frontend

To run frontend, in project root directory you can run:

```sh
cd client
npm i
npm run start
```

After running, you can access to http://localhost:3000

### Backend

To run backend, in project root directory you can run:

```sh
cd server
npm i
npm run db:seed
npm run graphql
```

After running, you can access to http://localhost:4000/graphql
