from flask import Flask, jsonify, render_template
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)


def web_scraping_veg_fruits(url):
    try:
        # First try with HTTPS
        response = requests.get(url, timeout=10)
        response.raise_for_status()  # Raise an exception for bad status codes
    except (requests.exceptions.RequestException, requests.exceptions.Timeout):
        # If HTTPS fails, try with HTTP
        try:
            http_url = url.replace('https://', 'http://')
            response = requests.get(http_url, timeout=10)
            response.raise_for_status()
        except (requests.exceptions.RequestException, requests.exceptions.Timeout) as e:
            # If both HTTPS and HTTP fail, return empty list
            print(f"Failed to fetch data from both HTTPS and HTTP URLs: {e}")
            return []

    html_content = response.content
    soup = BeautifulSoup(html_content, 'html.parser')
    table = soup.find('table', {'id': 'customers'})

    # Guard against missing table
    if table is None:
        print("Table with id='customers' not found on the page.")
        return []

    details = []
    for row in table.find_all('tr')[1:]:  # skip the header row
        columns = row.find_all(['th', 'td'])
        if len(columns) < 4:
            continue  # skip malformed/header/city-link rows

        name = columns[0].text.strip()
        unit = columns[1].text.strip()

        # The market-price cell contains the price as direct text and an
        # optional nested <span> with the trend arrow + percentage (e.g. "▲ 8.9%").
        price_cell = columns[2]
        # Direct text node (the numeric price)
        market_price = price_cell.find(text=True, recursive=False)
        market_price = market_price.strip() if market_price else price_cell.text.strip()
        # Trend span – may be absent on some rows
        trend_span = price_cell.find('span')
        price_trend = trend_span.text.strip() if trend_span else ''

        retail_price_range = columns[3].text.strip()

        details.append({
            'name': name,
            'unit': unit,
            'marketPrice': market_price,
            'priceTrend': price_trend,
            'retailPriceRange': retail_price_range,
        })

    return details


@app.route('/')
def hello_world():
    return render_template("index.html")


@app.route('/reqVeg', methods=['GET'])
def reqVeg():
    url = 'https://market.todaypricerates.com/Andhra-Pradesh-vegetables-price'
    vegetable_prices = web_scraping_veg_fruits(url)
    json_vegetable_prices = jsonify(vegetable_prices)
    return json_vegetable_prices


@app.route('/reqFruit', methods=['GET'])
def reqFruit():
    url = 'https://market.todaypricerates.com/Andhra-Pradesh-fruits-price'
    fruits_prices = web_scraping_veg_fruits(url)
    json_fruit_prices = jsonify(fruits_prices)
    return json_fruit_prices


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0')
