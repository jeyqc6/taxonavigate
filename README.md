# 🏠 Find Your Soulful Home

> _A critical design prototype that reveals the commodification beneath algorithmic warmth._

---

## 📌 Overview

**Find Your Soulful Home** is a satirical, interactive web platform that mimics a home customization assistant — but subverts user expectations by revealing how their emotional and aesthetic data is packaged for commercial profiling.

This project critically explores how platforms extract, categorize, and repurpose personal preferences under the guise of personalization.

---

## 🎯 Concept & Critical Reflection

> _You thought you were designing your dream home. In reality, your dream was being turned into data._

The platform critiques:

- **🧠 Algorithmic Governance** (Gillespie, 2014): User choices are subtly guided by the system's aesthetic logic.
- **🕵️‍♀️ Surveillance Capitalism** (Zuboff, 2019): Emotional and behavioral data are extracted and sold.
- **🎨 Platform Aesthetics & Social Sorting** (Bourdieu, 1984): "Personal taste" is flattened into marketable style profiles.

At the end of the experience, users receive both:
- a **poetic, friendly persona copy** (their “ideal home”),
- and a hidden **consumer data report**, revealing how they’re profiled for ads.

---

## 🧩 Features

- 🤖 **Conversational AI**  
  GPT-powered home consultant asks users questions about emotions, lifestyle, values, and home rituals.

- 🖼️ **Image-Based Preference Selection**  
  Users select rooms they “feel drawn to.” CLIP semantic search generates aesthetic tags.

- 🧠 **Dual Output Reports**  
  - `persona_copy`: user-facing poetic summary  
  - `internal_report`: hidden structured profile (ad tone, aesthetic, trend alignment, emotional ratio, etc.)

- 🎭 **Satirical Easter Egg Reveal**  
  Clicking a personalized ad or sharing the “ideal home” reveals:  
  _“You just sold yourself by clicking this ad.”_

---

## 🛠️ Tech Stack

| Layer       | Tools/Frameworks                                      |
|-------------|--------------------------------------------------------|
| Frontend    | React / Next.js                              |
| Backend     | Python Flask / FastAPI                                |
| AI API      | OpenAI GPT-4o-mini + local CLIP semantic engine     |
| Semantic    | CLIP Embedding → Cosine Similarity                    |
| Data Flow   | JSON-based user profiling & style tagging             |

---

## 🚀 Run Locally

1. **Backend (Flask)**  
   ```bash
   cd backend/
   pip install -r requirements.txt
   python app.py

2. Frontend(Next.js)
    cd frontend/
    npm install
    npm run dev

3. Access: http://localhost:3000

## References
Gillespie, T. (2014). The Relevance of Algorithms. Media Technologies.
Zuboff, S. (2019). The Age of Surveillance Capitalism.
Bourdieu, P. (1984). Distinction: A Social Critique of the Judgement of Taste.