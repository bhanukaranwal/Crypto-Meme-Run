import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TrendingUp, TrendingDown, ChevronsUp, ChevronsDown, Skull, Rocket, Repeat, Shield, Zap, AlertTriangle, Briefcase, Diamond } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- GAME CONFIGURATION ---
const MEME_ASSETS = [
    { id: 'doge', name: 'Dogecoin', icon: '🐶', baseVolatility: 0.7, description: 'The OG meme coin. To the moon!', initialPrice: 100 },
    { id: 'shib', name: 'Shiba Inu', icon: '🐕', baseVolatility: 0.9, description: 'The "Dogecoin Killer". Very unpredictable.', initialPrice: 50 },
    { id: 'pepe', name: 'Pepe', icon: '🐸', baseVolatility: 1.0, description: 'Sad frog, happy gains? Or was it the other way?', initialPrice: 20 },
    { id: 'wojak', name: 'Wojak', icon: '😐', baseVolatility: 0.8, description: 'Represents the feels of the market. Often down.', initialPrice: 30 },
    { id: 'gamestop', name: 'GME', icon: '💎', baseVolatility: 1.3, description: 'Ape strong together. Diamond hands required.', initialPrice: 200 },
    { id: 'bonk', name: 'Bonk', icon: '🏏', baseVolatility: 1.1, description: 'Solana\'s top dog. Goes bonk, up or down.', initialPrice: 15 },
];

const GAME_CONFIG = {
    initialFunds: 1000,
    eventChance: 0.5,
    insuranceCostPercent: 0.10,
    insurancePayoutPercent: 0.50,
    hypeMeterThreshold: 2,
    allInMultiplier: 3,
    diamondHandsBonus: 0.15, // 15% bonus
};

const MEME_EVENTS = [
    { text: (meme) => `${meme.name} was tweeted by a billionaire! 🚀`, impact: 1.7, type: 'positive' },
    { text: (meme) => `${meme.name} becomes a viral TikTok trend.`, impact: 1.5, type: 'positive' },
    { text: (meme) => `A SUPER-MOON event sends ${meme.name} to another galaxy! 🌌`, impact: 2.5, type: 'positive' },
    { text: (meme) => `Rumors of a rug pull tank ${meme.name}! 📉`, impact: 0.3, type: 'negative' },
    { text: (meme) => `The hype around ${meme.name} is fading...`, impact: 0.6, type: 'negative' },
    { text: (meme) => `A Black Swan event cripples ${meme.name}!`, impact: 0.1, type: 'negative' },
    { text: () => `The entire crypto market is in a euphoric bull run!`, impact: 1.4, type: 'market_positive', forAll: true },
    { text: () => `Global economic FUD hits crypto hard.`, impact: 0.7, type: 'market_negative', forAll: true },
];

const NEWS_TICKER_ITEMS = [
    "BREAKING: Local man buys another Dogecoin, says 'it's a solid investment.'",
    "Analysts predict meme coins are 'the future of finance' or 'a complete joke.'",
    "Pepe the Frog seen at a local coffee shop, reportedly 'feeling bullish.'",
    "Wojak holders report 'feeling the usual.'",
    "Shiba Inu community burns another trillion tokens, price moves 0.0001%.",
    "GME Apes still holding. 'Diamond hands,' says one, eating a crayon.",
    "Is Bonk the new king of Solana memes? Sources say 'maybe.'",
];

// --- HELPER COMPONENTS ---

const Icon = ({ name }) => {
    switch (name) {
        case 'positive': return <TrendingUp className="text-green-500" />;
        case 'negative': return <TrendingDown className="text-red-500" />;
        default: return null;
    }
};

const Modal = ({ title, children, onClose, titleIcon }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg w-full max-w-md text-white">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center"><div className="flex items-center">{titleIcon && <div className="mr-3">{titleIcon}</div>}<h2 className="text-2xl font-bold text-cyan-400">{title}</h2></div>{onClose && <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-3xl">&times;</button>}</div>
            <div className="p-6">{children}</div>
        </div>
    </div>
);

const AssetCard = ({ asset, onInvest, investment, isLocked }) => {
    const investmentAmount = investment ? investment.amount : 0;
    const chartData = asset.history.map((price, index) => ({ year: index, price }));

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col justify-between transform hover:scale-105 transition-transform duration-300 shadow-lg">
            <div>
                <div className="flex items-center mb-2"><span className="text-4xl mr-3">{asset.icon}</span><div><h3 className="text-xl font-bold text-white">{asset.name}</h3><p className="text-sm text-gray-400">${asset.currentPrice.toFixed(2)}</p></div></div>
                <div className="h-20 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <Line type="monotone" dataKey="price" stroke="#06b6d4" strokeWidth={2} dot={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} labelStyle={{ color: '#9ca3af' }} />
                            <XAxis dataKey="year" hide />
                            <YAxis domain={['dataMin', 'dataMax']} hide />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-sm text-gray-300 mb-4 h-10">{asset.description}</p>
            </div>
            <div>{investmentAmount > 0 && (<div className="mb-2 text-center text-sm text-cyan-300">Invested: ${investmentAmount.toFixed(2)}</div>)}<input type="number" min="0" placeholder="0" className="w-full bg-gray-900 text-white p-2 rounded-md mb-2 border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none" onChange={(e) => onInvest(asset.id, parseFloat(e.target.value) || 0)} disabled={isLocked} value={investmentAmount === 0 ? '' : investmentAmount}/></div>
        </div>
    );
};

const NewsTicker = ({ newsItems }) => {
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex(prev => (prev + 1) % newsItems.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [newsItems.length]);

    return (
        <div className="bg-gray-800/50 p-2 rounded-lg border border-gray-700 mb-4 overflow-hidden"><p className="whitespace-nowrap animate-marquee text-gray-300">{newsItems[index]}</p></div>
    );
};

// --- MAIN APP COMPONENT ---
export default function App() {
    const [gameState, setGameState] = useState('welcome');
    const [funds, setFunds] = useState(GAME_CONFIG.initialFunds);
    const [year, setYear] = useState(1);
    const [investments, setInvestments] = useState({});
    const [assets, setAssets] = useState(MEME_ASSETS.map(a => ({ ...a, currentPrice: a.initialPrice, history: [a.initialPrice], purchasePrice: null, wasLosing: false })));
    const [roundResults, setRoundResults] = useState(null);
    const [showHelp, setShowHelp] = useState(false);
    const [showPortfolio, setShowPortfolio] = useState(false);
    const [showInvestWarning, setShowInvestWarning] = useState(false);
    const [hypeMeter, setHypeMeter] = useState(0);
    const [isAllInMode, setAllInMode] = useState(false);
    const [insurancePurchased, setInsurancePurchased] = useState(false);

    const totalInvested = useMemo(() => Object.values(investments).reduce((sum, val) => sum + val, 0), [investments]);
    const insuranceCost = useMemo(() => insurancePurchased ? totalInvested * GAME_CONFIG.insuranceCostPercent : 0, [insurancePurchased, totalInvested]);
    const totalCost = useMemo(() => totalInvested + insuranceCost, [totalInvested, insuranceCost]);

    const handleInvestment = useCallback((assetId, amount) => {
        setInvestments(prev => {
            const tempInvestments = { ...prev, [assetId]: amount };
            const currentTotal = Object.values(tempInvestments).reduce((sum, val) => sum + val, 0);
            const tempInsuranceCost = insurancePurchased ? currentTotal * GAME_CONFIG.insuranceCostPercent : 0;
            if (currentTotal + tempInsuranceCost > funds) { return prev; }
            return { ...prev, [assetId]: Math.max(0, amount) };
        });
    }, [funds, insurancePurchased]);
    
    const handleInsuranceToggle = useCallback(() => {
        setInsurancePurchased(prev => {
            const newInsuranceState = !prev;
            const newInsuranceCost = newInsuranceState ? totalInvested * GAME_CONFIG.insuranceCostPercent : 0;
            if (totalInvested + newInsuranceCost > funds) { return prev; }
            return newInsuranceState;
        });
    }, [totalInvested, funds]);

    const resetGame = () => {
        setFunds(GAME_CONFIG.initialFunds);
        setYear(1);
        setInvestments({});
        setAssets(MEME_ASSETS.map(a => ({ ...a, currentPrice: a.initialPrice, history: [a.initialPrice], purchasePrice: null, wasLosing: false })));
        setRoundResults(null);
        setHypeMeter(0);
        setAllInMode(false);
        setInsurancePurchased(false);
        setGameState('playing');
    };
    
    useEffect(() => {
        if(gameState === 'welcome') setShowHelp(true);
    }, [gameState]);

    const runSimulation = () => {
        if (totalInvested <= 0) {
            setShowInvestWarning(true);
            return;
        }

        let eventLog = [];
        let marketEvent = null;
        if (Math.random() < GAME_CONFIG.eventChance) {
            const possibleMarketEvents = MEME_EVENTS.filter(e => e.forAll);
            if (possibleMarketEvents.length > 0) {
                marketEvent = possibleMarketEvents[Math.floor(Math.random() * possibleMarketEvents.length)];
                eventLog.push({ text: marketEvent.text(), type: marketEvent.type });
            }
        }

        const newAssets = assets.map(asset => {
            let priceChangeFactor = 1;
            const volatility = asset.baseVolatility;
            priceChangeFactor += (Math.random() - 0.5) * volatility;
            if (marketEvent) priceChangeFactor *= marketEvent.impact;
            if (Math.random() < GAME_CONFIG.eventChance / 2) {
                const event = MEME_EVENTS.filter(e => !e.forAll)[Math.floor(Math.random() * MEME_EVENTS.filter(e => !e.forAll).length)];
                priceChangeFactor *= event.impact;
                eventLog.push({ text: event.text(asset), type: event.type });
            }
            const newPrice = Math.max(asset.currentPrice * priceChangeFactor, 1);
            return { ...asset, previousPrice: asset.currentPrice, currentPrice: newPrice, history: [...asset.history, newPrice] };
        });

        let totalWinnings = 0, totalLosses = 0, diamondHandsBonus = 0;
        const resultsByAsset = Object.entries(investments).map(([assetId, amount]) => {
            if (amount <= 0) return null;
            const oldAsset = assets.find(a => a.id === assetId);
            const newAsset = newAssets.find(a => a.id === assetId);
            const profit = amount * (newAsset.currentPrice / oldAsset.currentPrice) - amount;
            
            if (oldAsset.wasLosing && profit > 0) {
                const bonus = profit * GAME_CONFIG.diamondHandsBonus;
                diamondHandsBonus += bonus;
            }

            if (profit > 0) totalWinnings += profit;
            else totalLosses += profit;
            return { id: assetId, name: oldAsset.name, icon: oldAsset.icon, invested: amount, returned: amount + profit, profit: profit, change: (newAsset.currentPrice / oldAsset.currentPrice) };
        }).filter(Boolean);

        let netGain = totalWinnings + totalLosses;
        let allInBonus = 0;
        if (isAllInMode) {
            allInBonus = netGain * (GAME_CONFIG.allInMultiplier - 1);
            netGain += allInBonus;
        }
        
        netGain += diamondHandsBonus;

        let insurancePayout = 0;
        if (insurancePurchased && netGain < 0) {
            insurancePayout = Math.abs(netGain) * GAME_CONFIG.insurancePayoutPercent;
            netGain += insurancePayout;
        }
        
        const newFunds = funds - totalCost + totalInvested + netGain;

        if (netGain > 0 && !isAllInMode) setHypeMeter(prev => Math.min(prev + 1, GAME_CONFIG.hypeMeterThreshold));
        else if (netGain < 0) setHypeMeter(0);

        setAssets(newAssets.map(asset => {
            const investment = investments[asset.id] || 0;
            if (investment > 0) {
                const profit = investment * (asset.currentPrice / asset.previousPrice) - investment;
                return { ...asset, purchasePrice: asset.previousPrice, wasLosing: profit < 0 };
            }
            return { ...asset, purchasePrice: null, wasLosing: false };
        }));

        setRoundResults({ resultsByAsset, eventLog, totalInvested, netGain, newFunds, insurancePayout, allInBonus, diamondHandsBonus, isAllInMode });
        setFunds(newFunds);
        setGameState('results');
    };

    const nextYear = () => {
        setYear(prev => prev + 1);
        setInvestments({});
        setRoundResults(null);
        setInsurancePurchased(false);
        if (isAllInMode) {
            setHypeMeter(0);
            setAllInMode(false);
        }
        setGameState('playing');
    };
    
    const activateAllIn = () => {
        if (hypeMeter >= GAME_CONFIG.hypeMeterThreshold) {
            setAllInMode(true);
            runSimulation();
        }
    };
    
    if (gameState === 'welcome') {
        return (<div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center justify-center p-4"><div className="text-center"><h1 className="text-6xl font-bold mb-4 text-cyan-400 animate-pulse">Crypto Meme Gamble</h1><p className="text-xl text-gray-300 mb-8">Charts, news, and pure chaos. Get rich or get rekt.</p><button onClick={resetGame} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 px-8 rounded-full text-2xl transition-all duration-300 transform hover:scale-110 shadow-lg shadow-cyan-500/50">Start Gambling</button><button onClick={() => setShowHelp(true)} className="mt-4 text-gray-400 hover:text-white">How to Play?</button></div>{showHelp && (<Modal title="How to Play" onClose={() => setShowHelp(false)}><div className="space-y-4 text-gray-300"><p><strong>1. Invest:</strong> Allocate funds to memes and watch their price charts.</p><p><strong><Zap className="inline h-5 w-5 text-yellow-400"/> Hype Meter:</strong> Win to build Hype. When full, you can activate <span className="font-bold text-red-500">ALL-IN MODE</span> for a 3x multiplier!</p><p><strong><Shield className="inline h-5 w-5 text-blue-400"/> Insurance:</strong> Buy insurance for 10% of your investment to cover 50% of any net losses.</p><p><strong><Diamond className="inline h-5 w-5 text-teal-300"/> Diamond Hands:</strong> Hold a losing asset that turns profitable for a 15% bonus on the gains!</p></div></Modal>)}</div>);
    }
    
    if (funds <= 0) {
         return (<div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center justify-center p-4"><div className="text-center bg-gray-800 p-10 rounded-2xl shadow-2xl border border-red-500"><Skull className="w-24 h-24 mx-auto text-red-500 mb-4" /><h1 className="text-5xl font-bold mb-4 text-red-400">YOU GOT REKT</h1><p className="text-xl text-gray-300 mb-8">You've lost all your funds. Better luck next time!</p><button onClick={resetGame} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-full text-xl transition-all duration-300 transform hover:scale-110 shadow-lg shadow-cyan-500/50 flex items-center mx-auto"><Repeat className="mr-2 h-5 w-5"/>Play Again</button></div></div>);
    }

    if (gameState === 'results' && roundResults) {
        return (<Modal title={`Year ${year} Results`} onClose={nextYear}><div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">{roundResults.isAllInMode && <div className="p-3 text-center bg-red-500/20 border border-red-500 rounded-lg"><h3 className="text-lg font-bold text-red-400 animate-pulse">ALL-IN MODE WAS ACTIVE!</h3></div>}<div className="bg-gray-900 p-4 rounded-lg"><h3 className="font-bold text-lg mb-2 text-cyan-400">Market Events</h3><ul className="space-y-2 text-sm">{roundResults.eventLog.length > 0 ? roundResults.eventLog.map((event, i) => (<li key={i} className="flex items-center"><Icon name={event.type} /><span className="ml-2 text-gray-300">{event.text}</span></li>)) : <li className="text-gray-500">A quiet year in the markets...</li>}</ul></div><div className="space-y-2">{roundResults.resultsByAsset.map(res => (<div key={res.id} className={`p-3 rounded-lg flex items-center justify-between ${res.profit >= 0 ? 'bg-green-900/50' : 'bg-red-900/50'}`}><div className="flex items-center"><span className="text-2xl mr-3">{res.icon}</span><div><p className="font-bold text-white">{res.name}</p><p className={`text-sm ${res.change >= 1 ? 'text-green-400' : 'text-red-400'}`}>{res.change >= 1 ? <ChevronsUp className="inline h-4 w-4"/> : <ChevronsDown className="inline h-4 w-4"/>}{(res.change * 100 - 100).toFixed(2)}%</p></div></div><div className="text-right"><p className={`font-bold text-lg ${res.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{res.profit >= 0 ? '+' : ''}${res.profit.toFixed(2)}</p><p className="text-xs text-gray-400">${res.invested.toFixed(2)} → ${res.returned.toFixed(2)}</p></div></div>))}</div><div className="bg-gray-900 p-4 rounded-lg text-sm space-y-2">{roundResults.allInBonus !== 0 && <div className="flex justify-between font-bold"><span className="text-red-400">All-In Multiplier Bonus:</span> <span className={roundResults.allInBonus >= 0 ? 'text-green-400' : 'text-red-400'}>${roundResults.allInBonus.toFixed(2)}</span></div>}{roundResults.diamondHandsBonus > 0 && <div className="flex justify-between font-bold"><span className="text-teal-300">Diamond Hands Bonus:</span> <span className="text-green-400">+${roundResults.diamondHandsBonus.toFixed(2)}</span></div>}{roundResults.insurancePayout > 0 && <div className="flex justify-between"><span className="text-blue-400">Insurance Payout:</span> <span className="text-green-400">+${roundResults.insurancePayout.toFixed(2)}</span></div>}<hr className="border-gray-700"/><div className="flex justify-between font-bold text-lg"><span className="text-white">Net Year Gain/Loss:</span> <span className={roundResults.netGain >= 0 ? 'text-green-400' : 'text-red-400'}>${roundResults.netGain.toFixed(2)}</span></div></div></div><button onClick={nextYear} className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">Continue to Next Year</button></Modal>);
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-wrap justify-between items-center mb-4 bg-gray-800/50 p-4 rounded-xl border border-gray-700"><div><h1 className="text-2xl sm:text-3xl font-bold text-cyan-400">Crypto Meme Gamble</h1><p className="text-gray-400">Year: {year}</p></div><div className="text-right mt-2 sm:mt-0"><p className="text-lg text-gray-400">Funds:</p><p className="text-3xl font-bold text-green-400">${funds.toFixed(2)}</p></div></header>
                <NewsTicker newsItems={NEWS_TICKER_ITEMS} />
                <div className="mb-6"><div className="flex justify-between text-sm mb-1"><span className="text-gray-300">Total Cost: ${totalCost.toFixed(2)}</span><span className="text-gray-400">Remaining: ${(funds - totalCost).toFixed(2)}</span></div><div className="w-full bg-gray-700 rounded-full h-4"><div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-4 rounded-full transition-all duration-300" style={{ width: `${(totalCost / funds) * 100}%` }}></div></div></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">{assets.map(asset => (<AssetCard key={asset.id} asset={asset} onInvest={handleInvestment} investment={investments[asset.id] ? { amount: investments[asset.id] } : null} isLocked={gameState !== 'playing'}/>))}</div>
                <footer className="sticky bottom-0 py-4 bg-gray-900/80 backdrop-blur-sm space-y-4"><div className="flex justify-center items-center gap-4 md:gap-8"><div className="flex items-center gap-2"><Zap className={`h-6 w-6 ${hypeMeter > 0 ? 'text-yellow-400' : 'text-gray-600'}`} /><div className="w-32 bg-gray-700 rounded-full h-4"><div className="bg-yellow-400 h-4 rounded-full" style={{width: `${(hypeMeter / GAME_CONFIG.hypeMeterThreshold) * 100}%`}}></div></div></div><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={insurancePurchased} onChange={handleInsuranceToggle} className="form-checkbox h-5 w-5 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500" disabled={totalInvested <= 0} /><Shield className="h-6 w-6 text-blue-400" /><span className="text-sm">Insure (${insuranceCost.toFixed(2)})</span></label><button onClick={() => setShowPortfolio(true)} className="flex items-center gap-2 text-gray-300 hover:text-white"><Briefcase className="h-6 w-6" /> <span className="text-sm">Portfolio</span></button></div><div className="text-center"><button onClick={hypeMeter >= GAME_CONFIG.hypeMeterThreshold ? activateAllIn : runSimulation} disabled={totalInvested <= 0 || gameState !== 'playing'} className={`font-bold py-4 px-12 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:bg-gray-600 disabled:shadow-none disabled:cursor-not-allowed disabled:scale-100 ${hypeMeter >= GAME_CONFIG.hypeMeterThreshold ? 'bg-red-600 hover:bg-red-700 shadow-red-500/50 animate-pulse' : 'bg-green-600 hover:bg-green-700 shadow-green-500/50'}`}>{hypeMeter >= GAME_CONFIG.hypeMeterThreshold ? 'Activate ALL-IN!' : 'Run Simulation'}</button></div><button onClick={() => setShowHelp(true)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white" title="How to Play"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button></footer>
                {showHelp && (<Modal title="How to Play" onClose={() => setShowHelp(false)}><div className="space-y-4 text-gray-300"><p><strong>1. Invest:</strong> Allocate funds to memes and watch their price charts.</p><p><strong><Zap className="inline h-5 w-5 text-yellow-400"/> Hype Meter:</strong> Win to build Hype. When full, you can activate <span className="font-bold text-red-500">ALL-IN MODE</span> for a 3x multiplier!</p><p><strong><Shield className="inline h-5 w-5 text-blue-400"/> Insurance:</strong> Buy insurance for 10% of your investment to cover 50% of any net losses.</p><p><strong><Diamond className="inline h-5 w-5 text-teal-300"/> Diamond Hands:</strong> Hold a losing asset that turns profitable for a 15% bonus on the gains!</p></div></Modal>)}
                {showInvestWarning && (<Modal title="Investment Required" onClose={() => setShowInvestWarning(false)} titleIcon={<AlertTriangle className="text-yellow-400 h-8 w-8"/>}><div className="text-center"><p className="text-lg text-gray-300">You must invest some funds before you can run the simulation.</p><button onClick={() => setShowInvestWarning(false)} className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">OK</button></div></Modal>)}
                {showPortfolio && (<Modal title="Your Portfolio" onClose={() => setShowPortfolio(false)} titleIcon={<Briefcase className="h-8 w-8 text-cyan-400" />}><div className="space-y-3">{Object.entries(investments).filter(([,amount])=>amount > 0).length > 0 ? Object.entries(investments).filter(([,amount])=>amount > 0).map(([id, amount]) => { const asset = assets.find(a => a.id === id); const profit = amount * (asset.currentPrice / asset.purchasePrice) - amount || 0; return (<div key={id} className="p-3 rounded-lg flex items-center justify-between bg-gray-900/50"><div className="flex items-center"><span className="text-2xl mr-3">{asset.icon}</span><div><p className="font-bold text-white">{asset.name}</p><p className="text-xs text-gray-400">Invested: ${amount.toFixed(2)}</p></div></div><div className="text-right"><p className={`font-bold text-lg ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{profit >= 0 ? '+' : ''}${profit.toFixed(2)}</p><p className="text-xs text-gray-400">Value: ${(amount + profit).toFixed(2)}</p></div></div>);}) : <p className="text-center text-gray-500">You have no active investments.</p>}</div></Modal>)}
            </div>
        </div>
    );
}
