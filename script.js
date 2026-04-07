async function fetchTrending() {
  let container = document.getElementById("container");
  let err = document.getElementById("err");
  try {
    let res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true",
    );
    let data = await res.json();
    console.log(data);
    renderHighlightCards(data);
    data.forEach((obj) => {
      let card = document.createElement("div");
      card.className = "trendingcard";
      let isFav = getFavorites().includes(obj.id);
      card.innerHTML = `
        <span id="star-${obj.id}" onclick="toggleFavorite('${obj.id}')" style="cursor:pointer; width: 20px; text-align: center; font-size: 1.2rem; color: ${isFav ? '#eab308' : 'inherit'};">${isFav ? '★' : '☆'}</span>
        <p style="width:40px; text-align:center">${obj.market_cap_rank}</p>
        <img src="${obj.image}" style="height:30px; width:30px;"/>
        <span style="width:180px; display:flex; flex-direction:column;">
            <p style="margin:1px">${obj.name}</p>
            <p style="margin:1px; color:gray;">${obj.symbol}</p>
        </span>
        <p style="width:120px;">$${obj.current_price}</p>
        <p style="width:120px; color: ${obj.price_change_percentage_24h < 0 ? "red" : "green"}">
            ${obj.price_change_percentage_24h < 0 ? "▼" : "▲"}
            ${obj.price_change_percentage_24h?.toFixed(2)}%
        </p>
        <p style="width:160px;">$${obj.total_volume}</p>
        <p style="width:180px;">$${obj.market_cap}</p>
        <canvas class="sparkline-chart"></canvas>
        `;
      container.appendChild(card);

      const canvas = card.querySelector(".sparkline-chart");
      if (canvas && obj.sparkline_in_7d) {
        createGraph(canvas, obj);
      }
    });
  } catch (error) {
    err.innerHTML = "failed to fetch data";
    console.log(error);
  }
}
fetchTrending();
////
function renderHighlightCards(data) {
  const wrapper = document.getElementById("highlight-cards");
  if (!wrapper) return;

  const trending = data.find((c) => c.id === "bitcoin") || data[0];
  const topGainer = [...data].sort(
    (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
  )[0];
  const mostActive = [...data].sort(
    (a, b) => b.total_volume - a.total_volume,
  )[0];

  const featured = [
    { coin: trending, label: "Trending Now" },
    { coin: topGainer, label: "Top Gainer" },
    { coin: mostActive, label: "Most Active" },
  ];

  featured.forEach(({ coin, label }) => {
    const isPositive = coin.price_change_percentage_24h >= 0;
    const changeColor = isPositive ? "#059669" : "#ef4444";
    const changeSign = isPositive ? "+" : "";

    const card = document.createElement("div");
    card.className = "highlight-card";
    card.innerHTML = `
      <div class="hc-top">
        <div class="hc-coin-info">
          <img src="${coin.image}" class="hc-img" />
          <div>
            <p class="hc-name">${coin.name}</p>
            <p class="hc-label">${label}</p>
          </div>
        </div>
        <div class="hc-price-info">
          <p class="hc-price">$${coin.current_price.toLocaleString()}</p>
          <p class="hc-change" style="color:${changeColor}">
            ${changeSign}${coin.price_change_percentage_24h?.toFixed(1)}%
          </p>
        </div>
      </div>
      <div class="hc-chart-wrap">
        <canvas class="hc-canvas"></canvas>
      </div>
    `;

    wrapper.appendChild(card);

    const canvas = card.querySelector(".hc-canvas");
    if (canvas && coin.sparkline_in_7d) {
      createBarGraph(canvas, coin);
    }
  });
}
///
async function fetchGlobalStats() {
  let statsbar = document.getElementById("stats-bar");
  try {
    let res = await fetch("https://api.coingecko.com/api/v3/global");
    let json = await res.json();
    let data = json.data;
    console.log(data);
    const marketCap = data.total_market_cap.usd;
    const marketCapFormatted =
      "$" + (marketCap / 1000000000000).toFixed(2) + "T";

    const change = data.market_cap_change_percentage_24h_usd;
    const changeFormatted = change.toFixed(1) + "%";

    const volume = data.total_volume.usd;
    const volumeFormatted = "$" + (volume / 1000000000).toFixed(1) + "B";

    const btcDominance = data.market_cap_percentage.btc;
    const btcFormatted = btcDominance.toFixed(1) + "%";

    let MarketCapH = document.getElementById("Market-Cap");
    MarketCapH.innerText = marketCapFormatted;

    let ChangeH = document.getElementById("Change");
    ChangeH.innerText = changeFormatted;

    let VolumeH = document.getElementById("volume");
    VolumeH.innerText = volumeFormatted;

    let BTCDominanceH = document.getElementById("dominance");
    BTCDominanceH.innerText = btcFormatted;
  } catch (err) {
    console.log(err);
  }
}
fetchGlobalStats();

async function searchCrypto() {
  let id = document.getElementById("search").value;
  if (id == "") {
    alert("Please enter a coin name");
    return;
  }
  try {
    let res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
    let data = await res.json();
    let graphres = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`,
    );
    let graphdata = await graphres.json();
    let searchresult = document.getElementById("search-result");
    searchresult.innerHTML = `
    <div class="searched-card" style="display:flex; flex-direction:row; align-items:stretch; background:white; border-radius:12px; padding:1.5rem; gap:2rem; box-shadow:0 1px 8px rgba(0,0,0,0.07);">
    <div class="left-data" style="width:320px; flex-shrink:0; display:flex; flex-direction:column; gap:10px; border-right:1px solid #e1e3e5; padding-right:2rem;">
    <div style="display:flex; align-items:center; gap:10px;">
    <img src="${data.image.small}" alt="">
    <p style="font-weight:600; font-size:1.2rem;">${data.name}</p>
    <p>${data.symbol}</p>
    </div>
    <div style="display:flex; align-items:center; gap:10px;">
    <h1>$${data.market_data.current_price.usd}</h1>
    <p style="width:120px; color: ${data.market_data.price_change_percentage_24h < 0 ? "red" : "green"}">
            ${data.market_data.price_change_percentage_24h < 0 ? "▼" : "▲"}
            ${data.market_data.price_change_percentage_24h?.toFixed(2)}%
            (24h)
        </p>
    </div>
    <div class="data" style="display:flex; flex-direction:column; gap:10px;">
    <div style="display:flex; align-items:center; gap:10px; border-bottom: 1px solid #e1e3e5; justify-content: space-between;">
    <p>Market Cap:</p>
    <p>$${data.market_data.market_cap.usd}</p>
    </div>
    <div style="display:flex; align-items:center; gap:10px; border-bottom: 1px solid #e1e3e5; justify-content: space-between;">
    <p>Volume:</p>
    <p>$${data.market_data.total_volume.usd}</p>
    </div>
    <div style="display:flex; align-items:center; gap:10px; border-bottom: 1px solid #e1e3e5; justify-content: space-between;">
    <p>All Time High:</p>
    <p>$${data.market_data.ath.usd}</p>
    </div>
    <div style="display:flex; align-items:center; gap:10px; border-bottom: 1px solid #e1e3e5; justify-content: space-between;">
    <p>All Time Low:</p>
    <p>$${data.market_data.atl.usd}</p>
    </div>
    <div style="display:flex; align-items:center; gap:10px; border-bottom: 1px solid #e1e3e5; justify-content: space-between;">
    <p>Total Supply:</p>
    <p>$${data.market_data.total_supply.toFixed(2)}</p>
    </div>
    <div style="display:flex; align-items:center; gap:10px; border-bottom: 1px solid #e1e3e5; justify-content: space-between;">
    <p>Circulating Supply:</p>
    <p>$${data.market_data.circulating_supply.toFixed(2)}</p>
    </div>
    </div>
    </div>
    <div class="right-graph" style="flex:1; min-width:0; height:400px; position:relative; display:flex; align-items:center; justify-content:center;">
    <canvas id="search-graph" style="width:100%;height:100%;"></canvas>
    </div>
    </div>
    `;
    const canvas = document.getElementById("search-graph");
    if (canvas && graphdata) {
      createSearchGraph(canvas, graphdata);
    }
    console.log(graphdata);
  } catch (err) {
    console.log(err);
  }
}

let themeBtn = document.getElementById("theme-toggle");

if (themeBtn) {
  themeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      themeBtn.innerText = "Light Mode";
    } else {
      themeBtn.innerText = "Dark Mode";
    }
  });
}

function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}

function toggleFavorite(id) {
  let favs = getFavorites();
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }
  localStorage.setItem('favorites', JSON.stringify(favs));
  const star = document.getElementById(`star-${id}`);
  if (star) {
    let isFav = favs.includes(id);
    star.innerText = isFav ? '★' : '☆';
    star.style.color = isFav ? '#eab308' : 'inherit';
  }
}

async function renderFavoritesList() {
  const container = document.getElementById("favorites-list");
  if (!container) return;
  
  const favs = getFavorites();
  if (favs.length === 0) {
    container.innerHTML = `<p style="text-align:center; padding: 2rem; color: gray;">No favorite assets found. Add some from the Home page!</p>`;
    return;
  }
  
  try {
    let res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${favs.join(',')}`);
    let data = await res.json();
    
    container.innerHTML = "";
    data.forEach(obj => {
      let isPositive = obj.price_change_percentage_24h >= 0;
      let div = document.createElement("div");
      div.className = "portfolio-item";
      div.innerHTML = `
        <div style="flex: 2; min-width: 200px; display: flex; align-items: center; gap: 10px;">
          <img src="${obj.image}" style="width: 32px; height: 32px; border-radius: 50%;" />
          <div style="display: flex; flex-direction: column;">
            <p style="margin: 0; font-weight: bold; font-size: 1rem;">${obj.name}</p>
            <p style="margin: 0; font-size: 0.8rem; color: gray; text-transform: uppercase;">${obj.symbol}</p>
          </div>
        </div>
        <p style="flex: 1; text-align: right; margin: 0;">0.00 ${obj.symbol.toUpperCase()}</p>
        <p style="flex: 1; text-align: right; margin: 0;">$${obj.current_price.toLocaleString()}</p>
        <p style="flex: 1; text-align: right; margin: 0; font-weight: bold;">$0.00</p>
        <p style="flex: 1; text-align: right; margin: 0; color: ${isPositive ? '#00d084' : '#ef4444'};">
          ${isPositive ? '+' : ''}${obj.price_change_percentage_24h?.toFixed(2)}%
        </p>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    container.innerHTML = `<p style="text-align:center; padding: 2rem; color: red;">Failed to fetch favorite assets.</p>`;
  }
}

renderFavoritesList();

