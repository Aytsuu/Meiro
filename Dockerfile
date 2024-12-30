# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory to /app
WORKDIR /app

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY ./backend /app

# Set the environment to production
ENV FLASK_ENV=production

# Expose port 5000 (the port Flask uses)
EXPOSE 5000

# Run the app using gunicorn with eventlet worker for WebSocket
CMD ["gunicorn", "-k", "eventlet", "-w", "1", "app:app"]