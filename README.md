# CryptoTracker

A real-time cryptocurrency tracking web app built using Vanilla JavaScript, HTML, and CSS.
Track the top 100 cryptocurrencies, search, filter, sort, and explore detailed stats in a clean user interface.

## Tech Stack
HTML5 — Structure and layout
CSS3 — Styling and responsive design
JavaScript (ES6+) — Application logic and DOM manipulation
CoinGecko API — Real-time cryptocurrency data


## Functionality
Displays the top 100 cryptocurrencies with real-time data
Allows searching coins by name or symbol
Provides filtering options such as gainers, losers, and top N coins
Supports sorting by price, market cap, volume, and 24-hour percentage change
Shows detailed information for each coin including description, ATH, ATL, supply, and external links
Includes dark and light mode with preference saved in localStorage
Supports saving and retrieving favorite coins
Implements loading indicators during API requests
Designed to be responsive across different screen sizes

## Higher Order Functions (HOF) Usage
map() — Used to render cryptocurrency data into UI components
filter() — Used for search functionality and category-based filtering
sort() — Used to reorder data based on selected metrics
reduce() — Used to compute aggregate values such as total market cap
find() — Used to locate a specific coin for displaying detailed information

## APIs
### CoinGecko API

Get Market Data
https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1

Get Coin Details
https://api.coingecko.com/api/v3/coins/{id}
