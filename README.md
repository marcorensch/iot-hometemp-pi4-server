## Run Mosquitto on a Test Environment (macOS)
Installing a Mosquitto broker on macOS

Follow these steps to install a Mosquitto broker on macOS (known as OS X before version Sierra):
In case you don't have Homebrew installed, open a Terminal window and run the command indicated in the Homebrew homepage, http://brew.sh , to install this popular package manager for macOS. The following command will do the job. However, it is convenient to check the Homebrew homepage and check all the detailed instructions that are always updated with the newest versions of macOS that become available. In case you already have Homebrew installed, move to the next step.

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
Open a Terminal window and run the following command to request Homebrew to install Mosquitto:
```
brew install mosquitto
```
The following lines show the last messages shown in the Terminal that indicate that Homebrew has installed Mosquitto and the instructions to start the MQTT server.
```
==> Installing mosquitto 
==> Downloading https://homebrew.bintray.com/bottles/mosquitto-      1.4.10.el_capitan.bottle.tar.gz
###################################################### 100.0%
==> Pouring mosquitto-1.4.10.el_capitan.bottle.tar.gz
==> Caveats
mosquitto has been installed with a default configuration file.
You can make changes to the configuration by editing:
/usr/local/etc/mosquitto/mosquitto.conf
To have launchd start mosquitto now and restart at login:
brew services start mosquitto
Or, if you don't want/need a background service you can just run:
mosquitto -c /usr/local/etc/mosquitto/mosquitto.conf
==> Summary
/usr/local/Cellar/mosquitto/1.4.10: 32 files, 618.3K
```
After the Mosquitto installation has been completed, run the following command in a new Terminal window to launch Mosquitto with the default configuration file. The -c option followed by /usr/local/etc/mosquitto/mosquitto.conf specifies that we want to use this configuration file.
```
/usr/local/sbin/mosquitto -c /usr/local/etc/mosquitto/mosquitto.conf
```
The following is the output after you run the previous command:
```
Gastons-MacBook-Pro:~ gaston$ /usr/local/sbin/mosquitto -c       /usr/local/etc/mosquitto/mosquitto.conf
1482518967: mosquitto version 1.4.10       (build date 2016-08-31 20:09:41+0100) starting
1482518967: Config loaded from       /usr/local/etc/mosquitto/mosquitto.conf.
1482518967: Opening ipv4 listen socket on port 1883.
1482518967: Opening ipv6 listen socket on port 1883.
```

Mosquitto Server is now up and running.
[Source](https://subscription.packtpub.com/book/application-development/9781787287815/1/ch01lvl1sec12/installing-a-mosquitto-broker-on-macos)

## Use PM2 (Process Manager 2) to start Client & Server
To run the client & server with PM2, run the following commands:
```
pm2 start npm --name "{CustomProcessName}" -- run startAll
```
This will spawn the Server & client in PM2
Please be aware that the server & client might need at least 20 seconds until they are ready
