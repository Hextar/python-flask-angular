# Data Analysis and Visualization

## Description

This project aims to ​ collect, visualise and forecast​ financial data with python.
In specific, we want to download stock closing price for Corn, Gasoline and Nasdaq and plot
them on a same chart where at least 1 month of data is available.


### Dependencies

 - Python 3.6


### Install

```
python main.py
```

OR

```
APP_ENV=Production docker-compose up -d --force-recreate
```

Ps: the main.sh in the directory need to have execution permission


### Usage


The Client is available at the following address:

```
http://localhost:80
```

The Server is available the Server at the address:

```
http://localhost:5000
```


### Documentation

A Swagger documentation is available accessing using a browser the address:

```
http://localhost:5000
```


### Tests

## Server

Access the '/server/tests' directory

```
pytest --cov-report html --cov=../.
```

The test coverage results will be available at the director 'htmlcov'

## Client

Access the '/client' directory

```
npm run test:coverage
```

The test coverage results will be available at the director 'coverage'


### Email

For any info you contact me at st.salidu@gmail.com
