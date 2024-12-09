# frameworks assignment 3 - React, Hono, Tanstack, Bun

This project is a simple version of an online marketplace, where users can post items for sale with prices. Users ca deleted their own listings, and update their profile information. Purchasing will be handled off the app. There is not way to actually contact anyone through the app so it doesn't make sense or work as is. I was planning to use this assignment to build an online store for my girlfriend to sell her crochet stuff on but didn't think I had enough time with IDSP and everything else going on to do it how I wanted to. After you grade this I am going to re-use as much of this code as I can and turn it into an online store.

I also wanted to play around with the Aceternity components, was planning to use more but only really used the one hover-effect grid thing and then ran out of time. Will try to add more when I re-build this over the winter break.

## env variables

    - Please check the required variables and their names in the .env.example file

### Kinde Auth

    - You will need to connect a kinde account for auth, I set mine up using the NodeJS template.

### Database

    - I am using neon to hosted my postgres database with drizzle orm.

### AWS

    - I am using an s3 bucket to store product images. The bucket must be accessible to read, put and delete items. I am using my server to generate presigned url's that the client-side react code can use to put the images files in the bucket directly, then storing the key in the database to render the image with a new url before being sent to the client to view in any get requests.

## To install dependencies:

### Root Directory

```bash
bun install
```

To run:

```bash
bun run dev
```

### New Terminal

```bash
cd client
```

```bash
bun install
```

To run:

```bash
bun run dev
```
