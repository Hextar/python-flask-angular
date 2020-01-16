FROM python:3.7.2

MAINTAINER Stefano st.salidu@gmail.com

# We copy just the requirements.txt first to leverage Docker cache
COPY ./requirements.txt /src/requirements.txt

WORKDIR /src

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

COPY . /src

EXPOSE 5000

CMD gunicorn --bind 0.0.0.0:5000 wsgi:app --max-requests 10000 --timeout 5 --keep-alive 5 --log-level info