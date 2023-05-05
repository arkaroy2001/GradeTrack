# Use official Python image as the base image
FROM python:3.9-slim-buster

# Set up the working directory
WORKDIR /src

# Install necessary libraries
COPY requirements.txt ./
RUN pip3 install -r requirements.txt

# Copy the application code to the Docker container
COPY . /src

# Expose necessary ports
EXPOSE 4998
EXPOSE 5432
# Set up environment variables
ENV PYTHONUNBUFFERED 1
ENV FLASK_APP calc.py

ENV DATABASE_URL postgresql://postgres:8t8rbjoNt70cOmO@gradetrack-postgres.flycast:5432
ENV DATABASE_USERNAME postgres
ENV DATABASE_PASSWORD 8t8rbjoNt70cOmO

# Run necessary services
# CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
CMD [ "flask", "run","--host=0.0.0.0","--port","4998"]
