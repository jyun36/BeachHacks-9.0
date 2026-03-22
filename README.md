# CompostScan

A mobile app that uses AI to identify items and determine if they're compostable — then rates the health of your compost pile.

Built for BeachHacks 9.0. Made with React Native, Expo, Google Gemini, and Fetch.ai.

---

## The Idea

Most people don't know what's actually compostable. This app lets you point your camera at any item, instantly find out if it belongs in your compost bin, and track the health of your pile over time based on real science — carbon-to-nitrogen ratio, methane output, decomposition time, and more.

---

## Features

- **Scan any item** — point your camera and get an instant compostable / not compostable result
- **AI powered** — Google Gemini Vision identifies the object and reasons about compostability
- **Compost pile tracker** — add items to your pile and track what's in it
- **Pile health rating** — get a score based on C:N ratio, methane output, and decomposition rate
- **Fetch.ai agent** — an AI agent that gives personalized suggestions to improve your pile
- **Disposal tips** — if an item isn't compostable, learn how to properly dispose of it

---

## Setup

### Mobile app

```bash
cd BeachHacks-9.0
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone.

### Fetch.ai agent (optional — enables live suggestions)

```bash
cd compost-agent
pip install uagents
python compost_advisor.py
```

Then update the `AGENT_URL` in `app/health.tsx` with your ngrok HTTPS URL.

---

## Tech Stack

- React Native + Expo
- Google Gemini Vision API
- Fetch.ai uagents
- AsyncStorage
- TypeScript
