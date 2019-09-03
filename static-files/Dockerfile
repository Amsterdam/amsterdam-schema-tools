FROM amsterdam/python3.6

WORKDIR /app/target
RUN rm -rf *

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
RUN rm requirements.txt

COPY validate.py /app/validate.py
COPY upload.py /app/upload.py
COPY static-files.sh /app/static-files.sh
