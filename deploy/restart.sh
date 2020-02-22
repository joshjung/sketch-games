#!/bin/bash

date
hostname

echo "Restarting nginx..."
sudo nginx -s reload

echo "PM2 Stop everything..."
pm2 stop all
pm2 delete all

echo "PM2 Restarting..."
pm2 start ecosystem.config.js