Team Name: JumboVision

Goal: Out goal for this project was to make a application for the visually impaired,
where they can use their camera to detect what is in front of them in real time, 
and get it relayed to them through Text to Speech. Over the weekend, we were able
to accomplish .....

The Team:
    - Cameron Griswold: Mostly helped build the front end and the Arrowkey TTS functionality
    - Catherine Ting: Design concept, frontend + website functionality
    - Donald Reith: Create websocket connection from frontend webcam to FASTAPI server and implemented YOLOv8n for object detection & convert to usable speech
    - 

Aknowledgements:
    We used YOLOv8n to create object identificiation and location text by sending it
    frames from the camera




This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
