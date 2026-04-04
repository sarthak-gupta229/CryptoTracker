function createGraph(canvas, coin) {
  const prices = coin.sparkline_in_7d.price.slice(-20);
  const isPositive = coin.price_change_percentage_24h >= 0;

  new Chart(canvas, {
    type: "line",
    data: {
      labels: prices.map((_, i) => i),
      datasets: [
        {
          data: prices,
          borderColor: isPositive ? "#059669" : "#ef4444",
          backgroundColor: isPositive
            ? "rgba(5, 150, 105, 0.08)"
            : "rgba(239, 68, 68, 0.08)",
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: { display: false },
        y: { display: false },
      },
      animation: { duration: 600 },
    },
  });
}

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
      card.innerHTML = `
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
function createBarGraph(canvas, coin) {
  const prices = coin.sparkline_in_7d.price.slice(-10);
  const isPositive = coin.price_change_percentage_24h >= 0;
  const baseColor = isPositive ? "34,197,94" : "239,68,68";

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const padding = (max - min) * 0.1;

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: prices.map((_, i) => i),
      datasets: [
        {
          data: prices,
          backgroundColor: prices.map(
            (_, i) => `rgba(${baseColor}, ${0.2 + (i / prices.length) * 0.8})`,
          ),
          borderRadius: 4,
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: {
        x: { display: false },
        y: { display: false, min: min - padding, max: max + padding },
      },
      animation: { duration: 700 },
    },
  });
}

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

function createSearchGraph(canvas, graphdata) {
  const prices = graphdata.prices;
  const labels = prices.map(([timestamp]) =>
    new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  );
  const values = prices.map(([, price]) => price);

  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(
    0,
    0,
    0,
    canvas.offsetHeight || 300,
  );
  gradient.addColorStop(0, "rgba(34, 197, 94, 0.3)");
  gradient.addColorStop(1, "rgba(34, 197, 94, 0.0)");

  new Chart(canvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          borderColor: "#16a34a",
          backgroundColor: gradient,
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: (ctx) => {
              const val = ctx.raw;
              return (
                " $" +
                (val >= 1000 ? (val / 1000).toFixed(2) + "K" : val.toFixed(2))
              );
            },
          },
        },
      },
      scales: {
        x: {
          display: true,
          grid: { display: false },
          ticks: {
            maxTicksLimit: 7,
            color: "#9ca3af",
            font: { size: 11 },
          },
        },
        y: {
          position: "right",
          display: true,
          grid: { color: "rgba(0,0,0,0.05)" },
          ticks: {
            color: "#9ca3af",
            font: { size: 11 },
            callback: (val) =>
              "$" +
              (val >= 1000 ? (val / 1000).toFixed(1) + "K" : val.toFixed(2)),
          },
        },
      },
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
    },
  });
}

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
    <p>${data.market_data.total_supply.toFixed(2)}</p>
    </div>
    <div style="display:flex; align-items:center; gap:10px; border-bottom: 1px solid #e1e3e5; justify-content: space-between;">
    <p>Circulating Supply:</p>
    <p>${data.market_data.circulating_supply.toFixed(2)}</p>
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
