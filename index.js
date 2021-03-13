global.__basedir = __dirname;
const config = require('./config/config');
const express = require('express');
const path = require('path');
const cors = require("cors");
const mongoose = require('mongoose');

const app = expess();