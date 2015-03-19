var sys = require('sys')
var express = require('express');
var exec = require('child_process').exec;

var app = express();

var lirc_devices = {};


