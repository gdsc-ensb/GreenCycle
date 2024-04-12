# GreenCycle
A web platform empowering individuals and recycling companies to collaborate for a greener future.
## GreenCycle: Connecting Eco-Warriors for a Sustainable Future
### Project Overview:

**GreenCycle** is a web platform designed to empower individuals (eco-warriors) and recycling companies to collaborate towards achieving responsible consumption, sustainable cities, and climate action. By connecting the two, GreenCycle aims to make recycling more accessible and efficient, contributing to a greener future for all.

### Features:

- **Connect with Recyclers:** Easily locate the nearest recycling company that accepts your specific materials through our intuitive map-based search function.
- **Learn and Grow:** Access comprehensive educational resources and tips to become a more informed and responsible consumer, making informed choices about consumption and waste management.
- **Track Your Impact:** Earn points and unlock achievements for your recycling efforts, motivating you to make a positive difference and encouraging healthy competition within the community.
- **Celebrate Success:** Be recognized for your contributions with badges and prizes, fostering a sense of community, accomplishment, and continued participation.
### Technology Stack:

- **Front-End:** HTML, CSS, JavaScript, jQuery, Bootstrap, Google Maps API
- **Back-End:** Python (Django & Django REST Framework)
- **Database:** PostgreSQL
- **Deployment:** Google Cloud Platform
### Dependencies:
- **PostgreSQL** installed
- **Python3** installed

### Instalation:
- **Clone Repository:** 
run following command
```bash
$ git clone https://github.com/gdsc-ensb/GreenCycle.git
```
Or download ZIP file from [here](https://github.com/gdsc-ensb/GreenCycle/).
- **Create Database:**
run following command:
```bash
psql -U postgres
```
past the following commands:
```bash
CREATE USER your_username WITH PASSWORD 'your_password';
CREATE DATABASE greencycledb;
ALTER ROLE your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE greencycledb TO your_username;
ALTER DATABASE greencycledb OWNER TO your_username;

ALTER ROLE your_username SET client_encoding TO 'utf8';
ALTER ROLE your_username SET default_transaction_isolation TO 'read committed';
ALTER ROLE your_username SET timezone TO 'UTC';

\q
```
- **Update Settings:**
  - open the file **'settings.py'** in your text editor
  ```bash
  path of file: ..../GreenCycle/back-end/greencycle/settings.py
  ```
  change the username and password in the database settings (line 96-97) to your username and password.
  - open the file **'base.html'** in your text editor
  ```bash
  path of file: ..../GreenCycle/back-end/templates/base.html
  ```
  put you JS Google Maps API Key in the line 17

### Installing Dependencies:

- **Create Virtual Environment:**
run following commands:
```bash
$ cd GreenCycle/back-end
$ python -m pip install -U pip
$ python -m venv ./greencyclevenv
$ .\greencyclevenv\Scripts\activate
$ pip install -r requirements.txt
$ python manage.py collectstatic
```
- **Migrate Tables to Database:**
run following commands:
```bash
$ python manage.py makemigrations
$ python manage.py migrate
```

- ### Creating Superuser:
run following commands:
```bash
$ python manage.py createsuperuser
```
then follow the instructions to create a superuser.


- ### Starting Server:
run following commands:
```bash
$ .\venv_name\Scripts\activate
$ python manage.py runserver
```

### Note for use:
- The server will start at http://127.0.0.1:8000/
- you should remember your Id from the profile page after creating an account to use it in login.
- you should create at least one company account to use the website.
- you should create at least one material and one sub_material from the admin panel to use the website.
- you can access the admin panel at http://127.0.0.1:8000/admin/


### Developed by:

- **The developer:** [Akram Bengueddoudj](https://github.com/akrambengueddoudj)
- National School of Biotechnology - Algeria [GDSC ENSB](https://github.com/gdsc-ensb/)
### Additional Notes:

- Watch the GreenCycle video [here]()
- This project is aligned with the UN Sustainable Development Goals (SDGs) of responsible consumption, sustainable cities, and climate action.
- Stay tuned for further developments and the official launch of GreenCycle!
