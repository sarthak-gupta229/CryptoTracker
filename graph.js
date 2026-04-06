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
