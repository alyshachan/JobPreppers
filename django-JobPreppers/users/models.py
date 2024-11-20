# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Jobs(models.Model):
    jobid = models.AutoField(db_column='jobID', primary_key=True)  # Field name made lowercase.
    title = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    pay_range = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)
    postedat = models.DateTimeField(db_column='postedAt', blank=True, null=True)  # Field name made lowercase.
    fill_by_date = models.DateTimeField()
    company = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'Jobs'


class Resume(models.Model):
    resumeid = models.AutoField(db_column='resumeID', primary_key=True)  # Field name made lowercase.
    userid = models.ForeignKey('Users', models.DO_NOTHING, db_column='userID', blank=True, null=True)  # Field name made lowercase.
    resume_pdf = models.TextField(blank=True, null=True)
    upload_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Resume'


class Users(models.Model):
    userid = models.AutoField(db_column='userID', primary_key=True)  # Field name made lowercase.
    username = models.CharField(unique=True, max_length=50)
    password = models.CharField(max_length=255)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.CharField(unique=True, max_length=100)

    class Meta:
        managed = False
        db_table = 'Users'


class Test(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'test'
