# Powermouse
Powerful http(s) web proxy compatible with a variety of websites, and flagship TitaniumNetwork proxy
#### Maintained by <b>Divide#1335</b> on Discord

<a href="https://heroku.com/deploy?template=https://github.com/vibedivide/powermouse/tree/master" title="Deploy to Heroku"><img alt="Deploy to Heroku" src="https://sys32.dev/assets/src/media/heroku.svg" width="140" height="30"><img></a>
&nbsp;
<a href="https://azuredeploy.net/" title="Deploy to Azure"><img alt="Deploy to Azure" src="https://sys32.dev/assets/src/media/azure.svg" width="140" height="30"><img></a>
&nbsp;
<a href="https://repl.it/github/vibedivide/powermouse" title="Run on Repl.it"><img alt="Run on Repl.it" src="https://sys32.dev/assets/src/media/replit.svg" width="140" height="30"><img></a>
&nbsp;
<a href="https://glitch.com/edit/#!/import/github/vibedivide/powermouse" title="Remix on glitch"><img alt="Remix on glitch" src="https://sys32.dev/assets/src/media/glitch.svg" width="140" height="30"><img></a>

### notice:
deploying on glitch.me will probably fail and cough up errors then eventually deleting your thing quickly, they are bad!

## Quick start guide:

Run in a terminal:
```
git clone https://github.com/vibedivide/powermouse ./powermouse/ && cd ./powermouse/ && npm i && npm start
```
then the URL http://localhost:8080 will be available in your browser if all went as intended

1. clone repository
2. cd into repository
3. install packages
4. start app

## Installation:
### Local Installation (Windows)
1. Install NodeJS and NPM from [here](https://nodejs.org/en/download/).
2. Download this repo as a zip archive from [here](https://github.com/vibedivide/powermouse/archive/master.zip).
3. Extract the zip archive to its own directory (try the desktop).
4. Open the command line. Press Windows Key (superkey/command) + R. Type "cmd". Click enter.
5. Wait for a black box (cmd) to appear.
6. Type in `cd `, then either manually type the absolute location of the install directory, or simply drag the folder into the cmd. Then hit enter. Example:
```
cd C:\Users\john\Documents\powermouse
```
7. Now type the below code, then press enter.
```
npm install
```
8. If all packages were successfully installed, you will see no errors returned. If you have any issues with this process, refer to the troubleshooting section. If that does not help, message someone on the discord, or open a Github issue.
9. Once the installation is complete, in your terminal you can run the line below to start the proxy
```
npm start
```
10. The page will be available at http://127.0.0.1:8080/ or whatever you set it to in the config.json file. Note: this will only be accessible from your local computer. If you want to set this up for others to use (or you to use elsewhere), refer to the VPS Installation section.
### Local Installation (MacOS)
1. Install NodeJS and NPM from [here](https://nodejs.org/en/download/).
2. Download this repo as a zip archive from [here](https://github.com/titaniumnetwork-dev/powermouse/archive/master.zip).
3. Extract the zip archive to its own directory (try the desktop).
4. Open the terminal. Press Command (superkey/windows key) + Space. This should open spotlight. Type "terminal", and hit enter. 
5. A white box will appear. Wait 1-10 seconds until there is a dollar sign ($) at the end of the last line.
6. Type in `cd `, then either manually type the absolute location of the install directory, or simply drag the folder into the cmd. Then hit enter. Example:
```
cd /Users/john/Desktop/powermouse
```
7. Now type the below code, then press enter.
```
npm install
```
8. If all packages were successfully installed, you will see no errors returned. If you have any issues with this process, refer to the troubleshooting section. If that does not help, message someone on the discord, or open a Github issue.
9. Once the installation is complete, in your terminal you can run the line below to start the proxy
```
npm
```
10. The page will be available at http://127.0.0.1:8080/ or whatever you set it to in the config.json file. Note: this will only be accessible from your local computer. If you want to set this up for others to use (or you to use elsewhere), refer to the VPS Installation section.
### Local Installation (Linux)
These are the same instructions as VPS Installation, besides for instead of SSHing into a console, you just open a terminal with CTRL + ALT + T
### VPS Installation (Linux)
1. SSH into your VPS. If on windows, you can do this via PUTTY. If on MacOS/Linux, you can use the ssh CLI. Refer to google if you are stuck here.
2. Install dependencies. Run the following command.
```
sudo apt install git curl -y && curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash - && sudo apt install nodejs -y 
```
3. Download Powermouse. Run the following command.
```
git clone https://github.com/titaniumnetwork-dev/powermouse.git
```
4. Install more dependencies. Run the following command.
```
cd powermouse && npm install
```
5. Edit the configuration file to listen on 0.0.0.0:8080, instead of localhost.
6. Run Powermouse.
```
npm start
```
7. Run Powermouse in background: Enter the following command
```
screen npm start
```
Then press CTRL + A + D. You are now safe to exit the ssh connection.
## Configuration:
### Running under a VPN
1. open config.json
2. under proxy look for vpn, set enabled under vpn to true
3. set socks5 under vpn to a socks5 proxy or leave it blank, many can be found at https://api.proxyscrape.com/?request=getproxies&proxytype=socks5&timeout=10000&country=US
4. save your config.json after modifying then start the app, it should be running under a vpn


### Enabling SSL
1. Point a domain name at your VPS's IP address, using an A record.
2. Install certbot. Follow prompts.
```
sudo add-apt-repository ppa:certbot/certbot -y && sudo apt update -y && sudo apt install certbot -y 
```
3. Stop all webservers running on port 80 and 443 (including powermouse).
4. Get a certificate. Follow the prompts, and enter your domain name exactly.
```
certbot certonly --standalone
```
5. Move the certificates. Locate the new SSL files in your current directory (list all files in dir using `ls`). One should be default.crt and some should be default.key. If not, change the first occurence of "cert/default.key" in the command below, accordingly.
```
mv default.crt ssl/default.crt
mv default.key ssl/default.key
```
6. Edit the config.json. Set SSL to true. Restart powermouse.
### Port Changing
To change the port your instance is running on, in config.json there is a value named port and you can set it to what you need (http: 80, most nodejs apps: 8080, https: 443). If you wish to listen externally and not on localhost, change listenip to 0.0.0.0

![terminal](https://sys32.dev/assets/src/pm-media/terminal.png)
![homepage](https://sys32.dev/assets/src/pm-media/homepage.png)
![coolmath](https://sys32.dev/assets/src/pm-media/coolmath.png)
![discord](https://sys32.dev/assets/src/pm-media/discord.png)

Licensed under [GNU General Public License v3.0](LICENSE)
