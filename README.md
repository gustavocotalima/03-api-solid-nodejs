# App

A gympass style app to study SOLID, Design Patterns, Docker, JWT and Refresh Token, RBAC, Prisma in Node.js

## Functional Requirements

- [x] Should be able to sign up
- [x] Should be able to sign in
- [x] Should be able to get logged user's profile
- [ ] Should be able to get the number of check-ins of the logged user
- [ ] Should be able to get the history of check-ins of the logged user
- [ ] Should be able to search for a nearby gym
- [ ] Should be able to search gyms by name
- [x] Should be able to check-in in a gym
- [ ] Should be able to validate a check-in
- [ ] Should be able to sign up a gym

## Non-Functional Requirements

- [x] A user can't sign up with an email that is already in use
- [ ] A user can't check-in twice in the same day 
- [ ] A user can't check-in in a gym that is too far away (100m)
- [ ] Check-ins should be validated within 20 minutes after creation
- [ ] Check-ins should be validated by the gym owner (admins)
- [ ] A gym only can be signed up by an admin


## Business Rules

- [x] User's password should be encrypted
- [x] App data should be persisted in a PostgreSQL database
- [ ] All data list endpoints should be paginated with 20 items per page
- [ ] User should be identified by an access token (JWT)