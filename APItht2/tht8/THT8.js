document.getElementById('analyzeBtn').addEventListener('click', async () => {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  if (!startDate || !endDate) {
    alert("Please select both start and end dates.");
    return;
  }

  const fromTimestamp = new Date(startDate).getTime() / 1000;
  const toTimestamp = (new Date(endDate).getTime() / 1000) + 3600; // Add 1 hour to include end date

  try {
    const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${fromTimestamp}&to=${toTimestamp}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.prices && data.total_volumes) {
      const prices = data.prices.map(([timestamp, price]) => ({ date: new Date(timestamp).toISOString().split('T')[0], price }));
      const volumes = data.total_volumes.map(([timestamp, volume]) => ({ date: new Date(timestamp).toISOString().split('T')[0], volume }));

      displayResults(prices, volumes);
    } else {
      alert("No data available for the selected range.");
    }
  } catch (error) {
    alert("Failed to fetch data. Please try again.");
  }
});

function displayResults(prices, volumes) {
  // A: Longest bearish trend
  let longestTrend = 0, currentTrend = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i].price < prices[i - 1].price) {
      currentTrend++;
      longestTrend = Math.max(longestTrend, currentTrend);
    } else {
      currentTrend = 0;
    }
  }
  document.getElementById('longestTrend').innerText = `Longest Bearish Trend: ${longestTrend} days`;

  // B: Highest trading volume
  const highestVolume = volumes.reduce((max, day) => day.volume > max.volume ? day : max, volumes[0]);
  document.getElementById('highestVolume').innerText = `Highest Volume: ${highestVolume.volume.toFixed(2)} EUR on ${highestVolume.date}`;

  // C: Best buy and sell days
  let minPrice = Infinity, minIndex = -1, maxProfit = 0, buyDay = null, sellDay = null;
  for (let i = 0; i < prices.length; i++) {
    if (prices[i].price < minPrice) {
      minPrice = prices[i].price;
      minIndex = i;
    }
    const profit = prices[i].price - minPrice;
    if (profit > maxProfit) {
      maxProfit = profit;
      buyDay = prices[minIndex].date;
      sellDay = prices[i].date;
    }
  }
  if (maxProfit > 0) {
    document.getElementById('bestTrade').innerText = `Best Buy: ${buyDay}, Best Sell: ${sellDay}, Profit: ${maxProfit.toFixed(2)} EUR`;
  } else {
    document.getElementById('bestTrade').innerText = `No profitable trade within the selected range.`;
  }
}
