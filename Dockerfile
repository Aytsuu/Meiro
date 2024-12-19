# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY ./backend /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV FLASK_APP=main.py

# Run app.py when the container launches
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]

# Use a basic web server like Nginx to serve static files
FROM nginx:alpine

# Copy the HTML files into the Nginx container
COPY ./frontend /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80