import mysql.connector

def get_connection():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="vishmee@25126",
        database="vehicleSystem"
    )
    return conn
