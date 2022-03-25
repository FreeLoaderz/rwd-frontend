sudo apt update
sudo apt upgrade
sudo apt install apache2 openssl openssh-server policycoreutils libapache2-mod-wsgi
sudo apt purge nodejs
curl -fsSL https://deb.nodesource.com/setup16.x | sudo bash -
sudo apt-get install -y nodejs
sudo a2enmod ssl
sudo a2enmod wsgi
sudo a2enmod headers
sudo a2enmod deflate
sudo a2enmod proxy
sudo a2enmod proxy-http
sudo a2enmod rewrite
sudo mkdir -p /etc/ssl/certs
sudo mkdir -p /etc/ssl/private
sudo mkdir -p /etc/apache2/ssl.crt
sudo ln -s /etc/apache2/sites-available/default-ssl.conf /etc/apache2/sites-enabled/default-ssl.conf

openssl dhparam -out /etc/ssl/certs/dhparam.pem 4096
ufw allow https
sudo cp -r ./etc/* /

echo "\n\nCOMPLETE!  Reboot the machine..\n\n"
