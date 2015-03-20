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
sudo chmod pi /var/piestation
sudo apt-get update && sudo apt-get install git npm -y
wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb
git clone https://github.com/RobQuistNL/PieStation.git /var/piestation
cd /var/piestation
npm config set registry http://registry.npmjs.org/
npm install
sudo cp /var/piestation/piestation.init /etc/init.d/piestation
sudo update-rc.d piestation defaults
```

- To install LIRC (for IR support) run the following:
```bash
sudo apt-get update && sudo apt-get install lirc -y
sudo cp /var/piestation/dist/hardware.conf.lirc /etc/lirc/hardware.conf
sudo echo "
lirc_dev
lirc_rpi gpio_in_pin=23 gpio_out_pin=22" >> /etc/modules
sudo /etc/init.d/lirc restart
```


- Run ``npm install``
- Edit piestation.init to your wish (change locations) - copy file to /etc/init.d, run update-rc.d piestation

# Local HTML
This is the local HTML to be displayed on the raspberry (connect to e.g. your TV for a nice overview)