# Crypto Meme Gamble Game - Chart Edition

![Game Screenshot](https://placehold.co/800x450/1f2937/7dd3fc?text=Crypto+Meme+Gamble+UI)

Welcome to the Crypto Meme Gamble Game! This is a high-octane, interactive simulation where you can invest in your favorite crypto memes, ride the waves of viral trends, and try to outsmart the market. It's faster, more chaotic, and more fun than ever.

## 🚀 Key Features

* **Live Price Charts:** Each meme asset includes a dynamic chart showing its price history, powered by `recharts`.
* **Interactive News Ticker:** A scrolling news ticker keeps the world feeling alive with flavorful and funny market updates.
* **Hype Meter & All-In Mode:** Winning builds your "Hype Meter." Fill it up to unleash **All-In Mode** for a massive 3x multiplier on your next round's gains *and* losses!
* **Investment Insurance:** Play it safe by purchasing insurance. For a 10% premium on your investment, you can cover 50% of any potential net losses for the round.
* **Diamond Hands Bonus:** Rewarded for your loyalty! If you hold a losing asset that turns profitable in the next year, you get a 15% bonus on those gains.
* **Detailed Portfolio:** A dedicated modal to view your current holdings, purchase price, and unrealized profit/loss.
* **Dynamic Events:** Random market and meme-specific events can cause massive price swings, keeping you on your toes.

## 🎮 How to Play

1.  **Start the Game:** You begin with `$1,000` in virtual funds.
2.  **Place Your Bets:** Allocate your funds across the available meme assets. Use the charts to guide your strategy!
3.  **Manage Your Risk:** Decide if you want to purchase insurance for the round.
4.  **Run the Simulation:**
    * Click **"Run Simulation"** for a standard round.
    * If your Hype Meter is full, click **"Activate ALL-IN!"** for a high-risk, high-reward round!
5.  **See the Results:** A summary will pop up showing how your investments performed, including any bonuses or insurance payouts.
6.  **Continue:** Move to the next year with your updated funds and try again! The game ends if you lose all your money.

## 🛠️ Tech Stack

* **Frontend:** React (with Hooks)
* **Charting:** Recharts
* **Styling:** Tailwind CSS
* **Icons:** Lucide React

## 📂 Repository Structure

/crypto-meme-game├── .gitignore├── package.json├── public/│   └── index.html└── src/├── App.jsx         // Main game component├── index.css       // Tailwind directives & custom animations└── index.js        // Renders the React app
## ⚙️ Setup and Installation

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd crypto-meme-game
    ```

2.  **Install dependencies:**
    You'll need Node.js and npm installed.
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm start
    ```
    This will open the application in your browser, usually at `http://localhost:3000`.

---

This is a simulation for entertainment purposes only. No real money is involved. Play responsibly, enjoy the memes, and may the odds be ever in your favor!
