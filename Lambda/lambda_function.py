from requests import Request, Session
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
import json
import os
from requests import Request, Session
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
import json
import mysql.connector
from mysql.connector import Error
import os



  
def fetch_cryptocurrency_data():
    try:
        # Establish a connection to the MySQL server
        credentials = mysql.connector.connect(
            host=os.getenv("DB_HOST"), 
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        
        if credentials.is_connected():
            cursor = credentials.cursor()
            print('Conectado')

            # API Connection
            url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'
            parameters = {
                'slug': 'bitcoin,ethereum', 
                'convert': 'USD'
            }
            headers = {
                'Accepts': 'application/json',
                'X-CMC_PRO_API_KEY': '017fd881-c7fc-410c-8f0e-a6ff0d914d8b',
            }
            
            session = Session()
            session.headers.update(headers)
            
            try: 
                response = session.get(url, params=parameters)
                data = json.loads(response.text)
                
                bitcoin_data = data['data']['1']
                ethereum_data = data['data']['1027']
                
                cursor.execute("INSERT INTO cryptocurrency_data(Name, Prices, Last_date) VALUES (%s, %s, %s)",
                               (bitcoin_data['name'], bitcoin_data['quote']['USD']['price'], bitcoin_data['quote']['USD']['last_updated']))
                
                cursor.execute("INSERT INTO cryptocurrency_data(Name, Prices, Last_date) VALUES (%s, %s, %s)",
                               (ethereum_data['name'], ethereum_data['quote']['USD']['price'], ethereum_data['quote']['USD']['last_updated']))
                
                credentials.commit()
                
            except (ConnectionError, Timeout, TooManyRedirects) as e:
                print(e)
            
            cursor.close()
            credentials.close()
    
    except mysql.connector.Error as ex:
        print(f"Error: {ex}")

    return data
    
fetch_cryptocurrency_data() 
  
  
  