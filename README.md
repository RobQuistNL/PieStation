# PieStation
Raspberry Pi software for remote controlling your house. IR, 434mhz, audio, video, beacons and more! Domotica for the win!

# Hardware used
- Raspberry Pi 1
- IR Led
- Breadboard
- IR Receiver (TSOP2236)
- 434mhz module (TX433)

# Software used
- NodeJS
- lirc
- Raspbian

# Installation guide

**STILL TODO**

## On your Pi
- Install raspbian (e.g. via NOOB -> http://www.raspberrypi.org/downloads/)
- To install and make sure the service runs every time you boot the pi, run:
```bash
sudo mkdir /var/piestation
sudo chown pi /var/piestation
sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get install git -y
wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb
git clone https://github.com/RobQuistNL/PieStation.git /var/piestation
cd /var/piestation
npm config set registry http://registry.npmjs.org/
npm install
sudo npm install -g nodemon
sudo cp /var/piestation/dist/piestation.init /etc/init.d/piestation
sudo chmod +x /etc/init.d/piestation
sudo update-rc.d piestation defaults
```

### To install LIRC (for IR support) run the following:
```bash
sudo apt-get update && sudo apt-get install lirc -y
sudo cp /var/piestation/dist/hardware.conf.lirc /etc/lirc/hardware.conf
echo 'lirc_dev' | sudo tee --append /etc/modules > /dev/null
echo 'lirc_rpi gpio_in_pin=23 gpio_out_pin=22' | sudo tee --append /etc/modules > /dev/null
sudo /etc/init.d/lirc restart
```

Edit your /boot/config.txt file and add:
```
dtoverlay=lirc-rpi,gpio_in_pin=23,gpio_out_pin=22
```

Make sure you put in the right lirc.conf files with your remotes into /etc/lirc/lircd.conf - check out the lirc docs on how to do so.

#### Making your own remotes:
```
irrecord --list-namespace # Check out what keys you can use
sudo /etc/init.d/lirc stop # Disable the lirc service
irrecord -d /dev/lirc0 ~/lircd.conf # Record!
```

When you're done, edit the conf file nano ~/lircd.conf and change the name line to the name you want your device to be.
Lastly, move the new configuration into LIRC and start it back up!

```
sudo cp ~/lircd.conf /etc/lirc/lircd.conf
```

### Using 434Mhz transmitters to power on/off devices

Thanks to: http://weejewel.tweakblogs.net/blog/8665/lampen-schakelen-met-een-raspberry-pi.html

Install wiringPi + compile custom binaries (Check blog to see what versions you need, I needed the KaKu version)

```
cd /var/
git clone git://git.drogon.net/wiringPi
git pull origin
cd wiringPi
./build
cd examples
wget -O lights.zip https://www.dropbox.com/s/nxdrkuk94w9fpqo/lights.zip?dl=1
unzip lights.zip
cd lights
g++ -o kaku kaku.cpp -I/usr/local/include -L/usr/local/lib -lwiringPi
```

Check out the app.js for the proper commands etc.

### Setup local browser to be opened fullscreen (the local PieStation screen, for your TV or something)

Copied from here: https://github.com/MobilityLab/TransitScreen/wiki/Raspberry-Pi

```
sudo apt-get install matchbox midori chromium unclutter x11-xserver-utils -y
sudo chmod +x /var/piestation/dist/openbrowser
```

Make sure to enable auto login:
http://elinux.org/RPi_Debian_Auto_Login

Then add the following to your users' .profile
```
xinit /var/piestation/dist/openbrowser
```

# Local HTML
This is the local HTML to be displayed on the raspberry (connect to e.g. your TV for a nice overview)