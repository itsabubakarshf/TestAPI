const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

app.post('/fetchData', async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.body;

    if (!dateFrom || !dateTo) {
      return res.status(400).json({ error: 'dateFrom and dateTo are required' });
    }

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9',
            'Origin': 'https://sslecal2.investing.com',
            'Referer': 'https://sslecal2.investing.com/?columns=exc_flags,exc_currency,exc_importance&importance=3&features=datepicker,timezone&countries=25,4,39,72,6,37,43,5,35&calType=day&timeZone=73&lang=1',
            'Sec-Ch-Ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': 'Windows',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest',
          }
    };

    const payload = {
      dateFrom,
      dateTo,
      timeframe: '',
      'columns[]': ['exc_flags', 'exc_currency', 'exc_importance'],
      timeZone: 73,
      'country[]': [25, 4, 39, 72, 6, 37, 43, 5, 35],
      'importance[]': [3],
      'category[]': [
        '_employment',
        '_economicActivity',
        '_inflation',
        '_credit',
        '_centralBanks',
        '_confidenceIndex',
        '_balance',
        '_Bonds'
      ],
      action: 'filter',
      lang: 1
    };

    const response = await axios.post(
      'https://sslecal2.investing.com/ajax.php',
      querystring.stringify(payload),
      config
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
