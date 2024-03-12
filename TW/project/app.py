from flask import Flask, render_template
from cs50 import SQL
app = Flask(__name__)
app.static_folder = 'static'

db = SQL("sqlite:///tasks.db")

@app.route("/")
def index():
    user_info = db.execute("SELECT name, title, XP, LVL FROM user")
    
    return render_template("layout.html", name = user_info[0]['name'], title = user_info[0]['title'], XP = user_info[0]['XP'], LVL = user_info[0]['LVL'])