# PostIT: Share with your group

This is a repository for my submission for Zero To One Hackathon by Convex, which took place from January 23 until March 18, 2024 (5:00 pm Pacific Time) 2024.

Features:

- Create Public and Private Groups
- DM other users
- Nested Comment section on post
- Bookmark post for future purpose.
- Implementaion of functionality to send request to join a private group
- Personalized feed for authenticated users

### Prerequisites

**Node version 18.x.x**

### Cloning the repository

```shell
git clone https://github.com/trace2798/convex_feedit/.git
```

### Install packages

```shell
npm i
```

### Setup .env file

```js
# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

AUTH_SECRET=

OPENAI_API_KEY=YOUR_ANYSCALE_API_KEY_HERE
ANYSCALE_API_BASE_URL=https://api.endpoints.anyscale.com/v1
```

### Setup Convex

```shell
npx convex dev

```

### Start the app

```shell
npm run dev
```
