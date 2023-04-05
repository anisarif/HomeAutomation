from flask import Flask, request, flash, render_template, redirect, url_for
from . import app
from .models import db, UserHome


@app.route("/user/add")
def adduser():
    return 

@app.route("/user/update")
def updateuser():
    return 

@app.route("/user/delete")
def deleteuser():
    return 

@app.route("/auth/logout")
def logout():
    return 



