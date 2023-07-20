from dotenv import load_dotenv
from flask import Flask, request, jsonify
import mysql.connector
import os
import mysql.connector
from datetime import datetime
from flask_bcrypt import Bcrypt
import json
import bcrypt
from flask import jsonify
from flask_cors import CORS
bcrypt = Bcrypt()


load_dotenv()

# Establish a connection without SSL
connection = mysql.connector.connect(
    host='localhost',
    user='root',
    password='Kirti@1807',
    database='AI'
)



app = Flask(__name__)
CORS(app)
# ===========HOSTS==========
@app.route('/hosts/register', methods=['POST'])
def register_host():
    data = request.get_json()
    host_name = data.get('host_name')
    host_email = data.get('host_email')
    host_password = data.get('host_password')
    image_url = data.get('image_url')  # Get the image_url from the JSON payload

    if not host_name or not host_email or not host_password:
        return "Invalid data. Please provide host_name, host_email, and host_password.", 400

    try:
        if connection.is_connected():
            cursor = connection.cursor()
            query = "INSERT INTO Hosts (host_name, host_email, host_password, image_url) VALUES (%s, %s, %s, %s)"  # Modify the query to include image_url
            hashed_password = bcrypt.generate_password_hash(host_password).decode('utf-8')
            values = (host_name, host_email, hashed_password, image_url)  # Include image_url in the values tuple
            cursor.execute(query, values)
            connection.commit()
            return "Host registered successfully!", 201
    except mysql.connector.Error as error:
        return "Error while registering host: " + str(error), 500


@app.route('/hosts/login', methods=['POST'])
def login_host():
    data = request.get_json()
    host_email = data.get('host_email')
    host_password = data.get('host_password')

    if not host_email or not host_password:
        return jsonify({"message": "Invalid data. Please provide host_email and host_password."}), 400

    try:
        if connection.is_connected():
            cursor = connection.cursor()
            query = "SELECT * FROM Hosts WHERE host_email = %s"
            value = (host_email,)
            cursor.execute(query, value)
            host = cursor.fetchone()

            if host:
                if bcrypt.check_password_hash(host[3], host_password):
                    return jsonify({"message": "Host login successful!"}), 200
                else:
                    return jsonify({"message": "Invalid credentials. Please check your email and password."}), 401
            else:
                return jsonify({"message": "Host not found."}), 404
        else:
            return jsonify({"message": "Error while logging in host."}), 500
    except mysql.connector.Error as error:
        return jsonify({"message": "Error while logging in host: " + str(error)}), 500


@app.route('/hosts', methods=['GET'])
def get_all_hosts():
    try:
        if connection.is_connected():
            cursor = connection.cursor()
            query = "SELECT * FROM Hosts"
            cursor.execute(query)
            rows = cursor.fetchall()
            hosts = []
            for row in rows:
                host = {
                    'host_id': row[0],
                    'host_name': row[1],
                    'host_email': row[2],
                    'host_password': row[3]
                }
                hosts.append(host)
            return jsonify(hosts)
    except mysql.connector.Error as error:
        return "Error while retrieving hosts from MySQL: " + str(error)

@app.route('/hosts/<int:host_id>', methods=['GET'])
def get_host(host_id):
    try:
        if connection.is_connected():
            cursor = connection.cursor()
            query = "SELECT * FROM Hosts WHERE host_id = %s"
            value = (host_id,)
            cursor.execute(query, value)
            row = cursor.fetchone()
            if row:
                host = {
                    'host_id': row[0],
                    'host_name': row[1],
                    'host_email': row[2],
                    'host_password': row[3]
                }
                return jsonify(host)
            else:
                return "Host not found."
    except mysql.connector.Error as error:
        return "Error while retrieving host from MySQL: " + str(error)

@app.route('/hosts/<int:host_id>', methods=['PUT'])
def update_host(host_id):
    host_name = request.json.get('host_name')
    host_email = request.json.get('host_email')
    host_password = request.json.get('host_password')
    try:
        if connection.is_connected():
            cursor = connection.cursor()
            query = "UPDATE Hosts SET host_name = %s, host_email = %s, host_password = %s WHERE host_id = %s"
            values = (host_name, host_email, host_password, host_id)
            cursor.execute(query, values)
            connection.commit()
            return "Host updated successfully!"
    except mysql.connector.Error as error:
        return "Error while updating host in MySQL: " + str(error)

@app.route('/hosts/<int:host_id>', methods=['DELETE'])
def delete_host(host_id):
    try:
        if connection.is_connected():
            cursor = connection.cursor()
            query = "DELETE FROM Hosts WHERE host_id = %s"
            value = (host_id,)
            cursor.execute(query, value)
            connection.commit()
            return "Host deleted successfully!"
    except mysql.connector.Error as error:
        return "Error while deleting host in MySQL: " + str(error)


# Properties
@app.route('/properties/<int:property_id>', methods=['GET'])
def get_property(property_id):
    try:
        if connection.is_connected():
            cursor = connection.cursor()
            query = "SELECT * FROM Properties WHERE property_id = %s"
            value = (property_id,)
            cursor.execute(query, value)
            row = cursor.fetchone()
            if row:
                property_info = {
                    'property_id': row[0],
                    'property_name': row[1],
                    'property_type': row[2],
                    'property_price': row[3],
                    'host_id': row[4],
                    'image_url': row[5],
                    'location': row[6]  # Added the location field
                }
                return jsonify(property_info)
            else:
                return "Property not found."
    except mysql.connector.Error as error:
        return "Error while retrieving property from MySQL: " + str(error)

@app.route('/properties/<int:property_id>', methods=['PUT'])
def update_property(property_id):
    property_name = request.json.get('property_name')
    property_type = request.json.get('property_type')
    property_price = request.json.get('property_price')
    host_id = request.json.get('host_id')
    image_url = request.json.get('image_url')
    location = request.json.get('location')  # Get the location from the request

    try:
        if connection.is_connected():
            cursor = connection.cursor()
            query = "UPDATE Properties SET property_name = %s, property_type = %s, property_price = %s, host_id = %s, image_url = %s, location = %s WHERE property_id = %s"
            values = (property_name, property_type, property_price, host_id, image_url, location, property_id)
            cursor.execute(query, values)
            connection.commit()
            return "Property updated successfully!"
    except mysql.connector.Error as error:
        return "Error while updating property in MySQL: " + str(error)


@app.route('/properties/<int:property_id>', methods=['DELETE'])
def delete_property(property_id):
    try:
        if connection.is_connected():
            cursor = connection.cursor()
            query = "DELETE FROM Properties WHERE property_id = %s"
            value = (property_id,)
            cursor.execute(query, value)
            connection.commit()
            return "Property deleted successfully!"
    except mysql.connector.Error as error:
        return "Error while deleting property in MySQL: " + str(error)


@app.route('/properties', methods=['GET'])
def get_all_properties():
    try:
        if connection.is_connected():
            cursor = connection.cursor()
            query = "SELECT * FROM Properties"
            cursor.execute(query)
            rows = cursor.fetchall()
            properties = []
            for row in rows:
                property_info = {
                    'property_id': row[0],
                    'property_name': row[1],
                    'property_type': row[2],
                    'property_price': row[3],
                    'host_id': row[4],
                    'image_url': row[5],
                    'location': row[6]  # Added the location field
                }
                properties.append(property_info)
            return jsonify(properties)
    except mysql.connector.Error as error:
        return "Error while retrieving properties from MySQL: " + str(error)

@app.route('/properties', methods=['POST'])
def create_property():
    property_name = request.json['property_name']
    property_type = request.json['property_type']
    property_price = request.json['property_price']
    host_id = request.json['host_id']
    image_url = request.json['image_url']
    location = request.json['location']  # Get the location from the request
    try:
        if connection.is_connected():
            cursor = connection.cursor()
            query = "INSERT INTO Properties (property_name, property_type, property_price, host_id, image_url, location) VALUES (%s, %s, %s, %s, %s, %s)"
            values = (property_name, property_type, property_price, host_id, image_url, location)
            cursor.execute(query, values)
            connection.commit()
            response_data = {"message": "Property created successfully!"}
            return jsonify(response_data)  # Send a JSON response
    except mysql.connector.Error as error:
        response_data = {"message": "Error while creating property in MySQL: " + str(error)}
        return jsonify(response_data)  # Send a JSON response



# Guest
@app.route('/guests/register', methods=['POST'])
def register_guest():
    try:
        data = request.get_json()
        guest_name = data['guest_name']
        guest_email = data['guest_email']
        guest_password = data['guest_password']

        # Hash the password before storing it in the database
        hashed_password = bcrypt.generate_password_hash(guest_password).decode('utf-8')

        # Assuming you have a 'guests' table to store guest information in the database
        cursor = connection.cursor()
        query = "INSERT INTO Guests (guest_name, guest_email, guest_password) VALUES (%s, %s, %s)"
        values = (guest_name, guest_email, hashed_password)
        cursor.execute(query, values)
        connection.commit()

        return jsonify({'message': 'Guest registered successfully!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/guests/login', methods=['POST'])
def login_guest():
    try:
        data = request.get_json()
        guest_email = data['guest_email']
        guest_password = data['guest_password']

        # Retrieve guest information from the database based on the provided email
        cursor = connection.cursor()
        query = "SELECT * FROM Guests WHERE guest_email = %s"
        value = (guest_email,)
        cursor.execute(query, value)
        guest = cursor.fetchone()

        if not guest:
            return jsonify({'message': 'Guest not found.'}), 404

        # Check if the provided password matches the hashed password stored in the database
        if bcrypt.check_password_hash(guest[3], guest_password):  # Using index 3 for the hashed password
            # Passwords match, guest is authenticated
            return jsonify({'message': 'Login successful!'})
        else:
            # Passwords do not match, guest is not authenticated
            return jsonify({'message': 'Invalid credentials.'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/bookings', methods=['GET'])
def get_all_bookings():
    try:
        if connection.is_connected():
            cursor = connection.cursor()
            query = "SELECT * FROM Bookings"
            cursor.execute(query)
            rows = cursor.fetchall()
            bookings = []
            for row in rows:
                booking = {
                    'booking_id': row[0],
                    'checkin_date': row[1].strftime('%Y-%m-%d'),
                    'checkout_date': row[2].strftime('%Y-%m-%d'),
                    'total_price': row[3],
                    'property_id': row[4],
                    'guest_id': row[5]
                }
                bookings.append(booking)
            return jsonify(bookings)
    except mysql.connector.Error as error:
        return "Error while retrieving bookings from MySQL: " + str(error)

@app.route('/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()
    checkin_date = data.get('checkin_date')
    checkout_date = data.get('checkout_date')
    property_ids = data.get('property_ids', [])  # List of property IDs booked
    guest_id = data.get('guest_id')
    
    if not checkin_date or not checkout_date or not property_ids or not guest_id:
        return jsonify({"error": "Invalid data. Please provide checkin_date, checkout_date, property_ids, and guest_id."}), 400
    
    try:
        if connection.is_connected():
            cursor = connection.cursor()

            total_price = 0

            # Loop through each property booked
            for property_id in property_ids:
                # Get the price of the property from the Properties table
                get_property_price_query = "SELECT property_price FROM Properties WHERE property_id = %s"
                cursor.execute(get_property_price_query, (property_id,))
                property_price = cursor.fetchone()

                if not property_price:
                    return jsonify({"error": f"Property with ID {property_id} not found."}), 404

                # Convert checkin_date and checkout_date strings to datetime objects
                checkin_date_dt = datetime.strptime(checkin_date, '%Y-%m-%d')
                checkout_date_dt = datetime.strptime(checkout_date, '%Y-%m-%d')

                # Calculate the total price for this property based on the property price and number of days booked
                total_price_property = property_price[0] * (checkout_date_dt - checkin_date_dt).days
                total_price += total_price_property

                # Insert the booking into the Bookings table
                query = "INSERT INTO Bookings (checkin_date, checkout_date, property_id, guest_id, total_price) VALUES (%s, %s, %s, %s, %s)"
                values = (checkin_date, checkout_date, property_id, guest_id, total_price_property)
                cursor.execute(query, values)
                connection.commit()

            return jsonify({"message": f"Booking created successfully! Total price: {total_price}"}), 201
    except mysql.connector.Error as error:
        return jsonify({"error": "Error while creating booking: " + str(error)}), 500



@app.route('/bookings/<int:booking_id>', methods=['PUT'])
def update_booking(booking_id):
    data = request.get_json()
    checkin_date = data.get('checkin_date')
    checkout_date = data.get('checkout_date')
    property_id = data.get('property_id')
    guest_id = data.get('guest_id')
    total_price = data.get('total_price')

    if not checkin_date or not checkout_date or not property_id or not guest_id or total_price is None:
        return "Invalid data. Please provide checkin_date, checkout_date, property_id, guest_id, and total_price.", 400

    try:
        if connection.is_connected():
            cursor = connection.cursor()
            query = "UPDATE Bookings SET checkin_date = %s, checkout_date = %s, property_id = %s, guest_id = %s, total_price = %s WHERE booking_id = %s"
            values = (checkin_date, checkout_date, property_id, guest_id, total_price, booking_id)
            cursor.execute(query, values)
            connection.commit()
            return "Booking updated successfully!"
    except mysql.connector.Error as error:
        return "Error while updating booking:", str(error), 500

@app.route('/bookings/<int:booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    try:
        if connection.is_connected():
            cursor = connection.cursor()
            query = "DELETE FROM Bookings WHERE booking_id = %s"
            value = (booking_id,)
            cursor.execute(query, value)
            connection.commit()
            return "Booking deleted successfully!"
    except mysql.connector.Error as error:
        return "Error while deleting booking:", str(error), 500


if __name__ == '__main__':
    app.run()

