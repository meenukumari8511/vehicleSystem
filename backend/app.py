from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="vishmee@25126",
        database="vehicleSystem"
    )

def execute_query(query, args=None, fetch=False):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(query, args or ())
    if fetch:
        result = cur.fetchall()
        cur.close()
        conn.close()
        return result
    conn.commit()
    cur.close()
    conn.close()
    return None

@app.route('/')
def home():
    return "Vehicle System Backend is running!"

# ------------------- Holder Routes -------------------
@app.route('/holders', methods=['GET'])
def get_holders():
    holders = execute_query("SELECT * FROM holders", fetch=True)
    return jsonify([{'holder_id': h[0],'name': h[1],'address': h[2]} for h in holders])

@app.route('/holders', methods=['POST'])
def add_holder():
    data = request.get_json()
    query = "INSERT INTO holders (name, address) VALUES (%s, %s)"
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(query, (data['name'], data.get('address')))
    holder_id = cur.lastrowid
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message': 'Holder added successfully!', 'holder_id': holder_id})

# ------------------- Vehicle Routes -------------------
@app.route('/vehicles', methods=['GET'])
def get_vehicles():
    vehicles = execute_query("""
        SELECT v.vehicle_id, v.vehicle_number, v.vehicle_type, v.fuel_type, v.registration_year, v.expiry_year,
               h.holder_id, h.name
        FROM vehicles v
        JOIN holders h ON v.holder_id = h.holder_id
    """, fetch=True)
    return jsonify([
        {
            'vehicle_id': v[0],
            'vehicle_number': v[1],
            'vehicle_type': v[2],
            'fuel_type': v[3],
            'registration_year': v[4],
            'expiry_year': v[5],
            'holder_id': v[6],
            'holder_name': v[7]
        } for v in vehicles
    ])

@app.route('/vehicles', methods=['POST'])
def add_vehicle():
    data = request.get_json()
    expiry_year = int(data['registration_year']) + 10
    query = """INSERT INTO vehicles
               (holder_id, vehicle_number, vehicle_type, fuel_type, registration_year, expiry_year)
               VALUES (%s, %s, %s, %s, %s, %s)"""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(query, (
        data['holder_id'], data['vehicle_number'], data['vehicle_type'],
        data['fuel_type'], data['registration_year'], expiry_year
    ))
    vehicle_id = cur.lastrowid
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message': 'Vehicle added successfully!', 'vehicle_id': vehicle_id})

if __name__ == '__main__':
    app.run(debug=True)
