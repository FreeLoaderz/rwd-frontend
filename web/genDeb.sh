#!/bin/bash
ng build --configuration production
npm pack
node_modules/node-deb/node-deb -- dist/*

