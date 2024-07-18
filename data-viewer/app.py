from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import sqlite3

app = Flask(__name__)
CORS(app)

@app.route('/html', methods=['POST'])
def get_html():
    url = request.get_data().decode('utf-8')
    response = requests.get(url, timeout=20, verify=False)
    return response.text

@app.route('/json', methods=['POST'])
def get_json():
    url = request.get_data().decode('utf-8')
    response = requests.get(url, timeout=20, verify=False)
    return jsonify(response.json())

@app.route('/xml', methods=['POST'])
def get_xml():
    url = request.get_data().decode('utf-8')
    response = requests.get(url, timeout=20, verify=False)
    return response.text

@app.route('/monitor', methods=['POST'])
def monitor():
    data = request.get_json()
    
    msg = f"""
        Monitoring: {data['url']}
        With Type: {data['type']}
        And {'Selector:' if data['type'] == 'html' else 'Key Steps:'} {str(data['steps'])}
    """
    
    initial_response = requests.get(data['url'], timeout=20, verify=False)
    
    if data['type'] == 'html':
        parser = BeautifulSoup(initial_response.text, 'html.parser')
        initial_response = parser.select_one(data['steps'])
    
    elif data['type'] == 'json':
        initial_response = initial_response.json()
        
        for step in data['steps']:
            initial_response = initial_response[step]
            
    elif data['type'] == 'xml':
        parser = BeautifulSoup(initial_response.text, 'xml')
        
        for step in data['steps']:
            initial_response = parser.find(step)
            
    else:
        return jsonify({'message': 'Invalid Type'}), 400
    
    print(msg)
    
    
    '''
        The monitoring data is stored in the database. We will use SQLite for this purpose.
        Tables:
            Monitored_Urls:
                Id
                Url
                Type
                Steps
                Email
                Created_At
                Active
            Monitored_Results:
                Id
                Monitored_Url_Id
                Result
                Created_At
    '''
    
    db = sqlite3.connect('monitoring.db')
    
    cursor = db.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Monitored_Urls (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Url TEXT NOT NULL,
            Type TEXT NOT NULL,
            Steps TEXT NOT NULL,
            Email TEXT NOT NULL,
            Created_At TEXT NOT NULL,
            Active BOOLEAN NOT NULL
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Monitored_Results (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Monitored_Url_Id INTEGER NOT NULL,
            Result TEXT NOT NULL,
            Created_At TEXT NOT NULL,
            FOREIGN KEY(Monitored_Url_Id) REFERENCES Monitored_Urls(Id)
        )
    ''')
    
    cursor.execute('''
        INSERT INTO Monitored_Urls (Url, Type, Steps, Email, Created_At, Active) VALUES (?, ?, ?, ?, ?, 1)
    ''', (data['url'], data['type'], str(data['steps']), data['email'], datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    )
    
    monitored_url_id = cursor.lastrowid
    
    cursor.execute('''
        INSERT INTO Monitored_Results (Monitored_Url_Id, Result, Created_At) VALUES (?, ?, ?)
    ''', (monitored_url_id, str(initial_response), datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    )
    
    db.commit()
    
    cursor.close()
    
    db.close()
    
    return jsonify({'message': 'Monitoring Started'})

@app.route('/monitors', methods=['GET'])
def monitors():
    try:
        db = sqlite3.connect('monitoring.db')
        
        cursor = db.cursor()
        
        cursor.execute('''
            SELECT * FROM Monitored_Urls WHERE Active = 1
        ''')
        
        urls = cursor.fetchall()
        
        cursor.close()
        
        db.close()
        
        return jsonify(urls)
    
    except:
        return jsonify([])
    
@app.route('/monitors/remove/<int:id>', methods=['DELETE'])
def remove_monitor(id):
    try:
        db = sqlite3.connect('monitoring.db')
        
        cursor = db.cursor()
        
        cursor.execute('''
            UPDATE Monitored_Urls SET Active = 0 WHERE Id = ?
        ''', (id,))
        
        db.commit()
        
        cursor.close()
        
        db.close()
        
        return jsonify({'message': 'Monitor Removed'})
    
    except:
        return jsonify({'message': 'Monitor Not Found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
