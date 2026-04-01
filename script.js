async function fetchTrending() {
  let container = document.getElementById("container");
  try {
    let res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true",
    );
    let data = await res.json();
    console.log(data);
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
         
        `;
      container.appendChild(card);
    });
  } catch (error) {
    console.log(err);
  }
}
fetchTrending()


async function fetchGlobalStats(){
    try{
        let res= await fetch("https://api.coingecko.com/api/v3/global")
        let json= await res.json()
        let data=json.data
        console.log(data)
        let 
        
    }catch(err){
         console.log(err)
    }
    
}
fetchGlobalStats()
