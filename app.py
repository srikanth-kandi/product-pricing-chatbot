from flask import Flask, jsonify, render_template
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)


def web_scraping_veg_fruits(url, vegetable_name=""):
    response = requests.get(url)
    html_content = response.content

    soup = BeautifulSoup(html_content, 'html.parser')
    table = soup.find('table', {'id': 'customers'})
    
    vegetable_details = []
    for row in table.find_all('tr')[1:]:  # skip the header row
        columns = row.find_all(['th', 'td'])
        vegetable_name = columns[0].text.strip()
        unit = columns[1].text.strip()
        market_price = columns[2].text.strip()
        retail_price_range = columns[3].text.strip()
        mall_price_range = columns[4].text.strip()

        vegetable_details.append({
            'name': vegetable_name,
            'unit': unit,
            'marketPrice': market_price,
            'retailPriceRange': retail_price_range,
            'mallPriceRange': mall_price_range
        })

    '''table_rows = soup.select('.Table .Row')
    print(table_rows)
    for row in table_rows:
        columns = row.select('.Cell')
        name = columns[0].text.strip()
        unit = columns[1].text.strip()
        market_price = columns[2].text.strip()
        retail_price_range = columns[3].text.strip()
        mall_price_range = columns[4].text.strip()

        if vegetable_name.lower() in name.lower():
            vegetable_details.append({
                'name': name,
                'unit': unit,
                'marketPrice': market_price,
                'retailPriceRange': retail_price_range,
                'mallPriceRange': mall_price_range
            })'''

    return vegetable_details


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
    app.run(debug=True)
