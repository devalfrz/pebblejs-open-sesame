# pebblejs-open-sesame
Simple Pebble.js impementation of illumination and home security.

This project requires the installation of Arduino Yun and Lockitron hardware. The source of this is located in:
 
https://github.com/devalfrz/arduino-yun-lights <br>
https://github.com/devalfrz/arduino-yun-lockitron

## Installing on Pebble
After installing the [Pebble command line tool](https://developer.pebble.com/guides/publishing-tools/)
and enabling the _developer mode_ on your Pebble App in your phone, do the following:
```
git clone https://github.com/devalfrz/pebblejs-open-sesame
cd pebblejs-open-sesame
pebble build
pebble install --phone <the-ip-of-your-phone>
```
