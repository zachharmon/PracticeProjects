import requests
from bs4 import BeautifulSoup
import sqlite3
from datetime import datetime, timedelta
import time

def send_email(email, result):
    print(f'Sending email to {email} with message: {result}')
    pass

def get_refreshables():
    
    now = datetime.now()
    
    db = sqlite3.connect('monitoring.db')
    
    cursor = db.cursor()
    
    refreshables = cursor.execute('''
        SELECT * FROM Monitored_Urls WHERE Active = 1
    ''').fetchall()
        
    needs_refresh = []
    
    for refreshable in refreshables:
                
        recent = cursor.execute('''
            SELECT Result, Created_At FROM Monitored_Results WHERE Monitored_Url_Id = ? ORDER BY Created_At DESC LIMIT 1
        ''', (refreshable[0],)).fetchone()
        
        if not recent:
            needs_refresh.append(refreshable)
        else:
            
            date = datetime.strptime(recent[1], '%Y-%m-%d %H:%M:%S')
            
            print(now, date, (now - date).seconds)
            
            # If the last refresh was more than 5 minutes ago, refresh
            if (now - date).seconds > 300:
                print(refreshable[1], 'needs to be refreshed')
                needs_refresh.append(refreshable)
            
    if len(needs_refresh) == 0:
        print('No refreshables need to be refreshed')
                
    for refreshable in needs_refresh:
        
        try:
            response = requests.get(refreshable[1], timeout=10, verify=False)
            
            if refreshable[2] == 'html':
                soup = BeautifulSoup(response.content, 'html.parser')
                result = soup.select_one(refreshable[3])
            elif refreshable[2] == 'json':
                result = response.json()
                steps = eval(refreshable[3])
                
                for step in steps:
                    result = result[step]
            elif refreshable[2] == 'xml':
                soup = BeautifulSoup(response.content, 'xml')
                steps = eval(refreshable[3])
                
                for step in steps:
                    result = soup.find(step)
            else:
                print('Invalid Type')
                return
            
            recent = cursor.execute('''
                SELECT Result FROM Monitored_Results WHERE Monitored_Url_Id = ? ORDER BY Created_At DESC LIMIT 1
            ''', (refreshable[0],)).fetchone()
            
            if str(result) != recent[0]:
                
                message = f'''
                    The data at {refreshable[1]} has changed.
                    This change was detected at {now.strftime('%Y-%m-%d %H:%M:%S')}.
                '''
                
                send_email(refreshable[4], message)
            
            else:
                print('No change detected')
            
            cursor.execute('''
                INSERT INTO Monitored_Results (Monitored_Url_Id, Result, Created_At) VALUES (?, ?, ?)
            ''', (refreshable[0], str(result), now.strftime('%Y-%m-%d %H:%M:%S')))
        except Exception as e:
            print(f'Error: {e}')
           
    db.commit()
    db.close()
    
    
            
if __name__ == '__main__':
    while True:
        get_refreshables()
        time.sleep(60)
        
    
    