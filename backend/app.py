from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# ------------------- MySQL Connection -------------------
def get_db_connection():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",      # Replace with your MySQL username
        password="vishmee@25126",  # Replace with your MySQL password
        database="vehicleSystem"
    )
    return conn

# ------------------- Helper function -------------------
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

# ------------------- Root Route -------------------
@app.route('/')
def home():
    return "Vehicle System Backend is running!"

# ------------------- Holder APIs -------------------
@app.route('/holders', methods=['GET'])
def get_holders():
    holders = execute_query("SELECT * FROM holders", fetch=True)
    result = []
    for h in holders:
        result.append({
            'holder_id': h[0],
            'name': h[1],
            'address': h[2]
        })
    return jsonify(result)

@app.route('/holders/<int:id>', methods=['GET'])
def get_holder(id):
    holder = execute_query("SELECT * FROM holders WHERE holder_id=%s", (id,), fetch=True)
    if not holder:
        return jsonify({'error': 'Holder not found'}), 404
    h = holder[0]
    return jsonify({
        'holder_id': h[0],
        'name': h[1],
        'address': h[2]
    })

@app.route('/holders', methods=['POST'])
def add_holder():
    data = request.get_json()
    query = "INSERT INTO holders (name, address) VALUES (%s, %s)"
    execute_query(query, (data['name'], data.get('address')))
    return jsonify({'message': 'Holder added successfully!'})

@app.route('/holders/<int:id>', methods=['PUT'])
def update_holder(id):
    data = request.get_json()
    query = "UPDATE holders SET name=%s, address=%s WHERE holder_id=%s"
    execute_query(query, (data['name'], data.get('address'), id))
    return jsonify({'message': 'Holder updated successfully!'})

@app.route('/holders/<int:id>', methods=['DELETE'])
def delete_holder(id):
    execute_query("DELETE FROM holders WHERE holder_id=%s", (id,))
    return jsonify({'message': 'Holder deleted successfully!'})

# ------------------- Vehicle APIs -------------------
@app.route('/vehicles', methods=['GET'])
def get_vehicles():
    vehicles = execute_query("""
        SELECT v.vehicle_id, v.vehicle_number, v.vehicle_type, v.fuel_type, v.registration_year, v.expiry_year,
               h.holder_id, h.name
        FROM vehicles v
        JOIN holders h ON v.holder_id = h.holder_id
    """, fetch=True)
    result = []
    for v in vehicles:
        result.append({
            'vehicle_id': v[0],
            'vehicle_number': v[1],
            'vehicle_type': v[2],
            'fuel_type': v[3],
            'registration_year': v[4],
            'expiry_year': v[5],
            'holder_id': v[6],
            'holder_name': v[7]
        })
    return jsonify(result)

@app.route('/vehicles/<int:id>', methods=['GET'])
def get_vehicle(id):
    vehicle = execute_query("""
        SELECT v.vehicle_id, v.vehicle_number, v.vehicle_type, v.fuel_type, v.registration_year, v.expiry_year,
               h.holder_id, h.name
        FROM vehicles v
        JOIN holders h ON v.holder_id = h.holder_id
        WHERE v.vehicle_id=%s
    """, (id,), fetch=True)
    if not vehicle:
        return jsonify({'error': 'Vehicle not found'}), 404
    v = vehicle[0]
    return jsonify({
        'vehicle_id': v[0],
        'vehicle_number': v[1],
        'vehicle_type': v[2],
        'fuel_type': v[3],
        'registration_year': v[4],
        'expiry_year': v[5],
        'holder_id': v[6],
        'holder_name': v[7]
    })

@app.route('/vehicles', methods=['POST'])
def add_vehicle():
    data = request.get_json()
    query = """INSERT INTO vehicles 
               (holder_id, vehicle_number, vehicle_type, fuel_type, registration_year, expiry_year)
               VALUES (%s, %s, %s, %s, %s, %s)"""
    execute_query(query, (
        data['holder_id'], data['vehicle_number'], data['vehicle_type'],
        data['fuel_type'], data['registration_year'], data['expiry_year']
    ))
    return jsonify({'message': 'Vehicle added successfully!'})

@app.route('/vehicles/<int:id>', methods=['PUT'])
def update_vehicle(id):
    data = request.get_json()
    query = """UPDATE vehicles SET holder_id=%s, vehicle_number=%s, vehicle_type=%s, fuel_type=%s,
               registration_year=%s, expiry_year=%s WHERE vehicle_id=%s"""
    execute_query(query, (
        data['holder_id'], data['vehicle_number'], data['vehicle_type'], data['fuel_type'],
        data['registration_year'], data['expiry_year'], id
    ))
    return jsonify({'message': 'Vehicle updated successfully!'})

@app.route('/vehicles/<int:id>', methods=['DELETE'])
def delete_vehicle(id):
    execute_query("DELETE FROM vehicles WHERE vehicle_id=%s", (id,))
    return jsonify({'message': 'Vehicle deleted successfully!'})

# ------------------- Run App -------------------
if __name__ == '__main__':
    app.run(debug=True)
