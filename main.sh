#!/bin/sh

set -eu


# Prepare Docker Install
sudo apt-get remove -y docker docker-engine docker.io \
    && sudo apt update \
    && sudo apt install -y apt-transport-https ca-certificates curl software-properties-common \
    && curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - \
	&& sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable" \
	&& sudo apt update \
    && apt-cache policy docker-ce \
   

# Install Docker
sudo apt-get install -y docker-ce \
	&& printf '\n=== Docker installed successfully\n\n'


# Allow Docker to Run as user
sudo usermod -aG docker "$USER" \
	&& sudo systemctl enable docker \
	&& printf '\n=== Docker enabled successfully\n\n'


# Install Docker Compose Install
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
	&& sudo chmod +x /usr/local/bin/docker-compose \
 	&& printf '\n=== Docker Compose installed successfully\n\n'

APP_ENV=Production docker-compose up -d --force-recreate


# Uninstall Docker

# sudo apt-get purge -y docker-ce
# sudo apt-get autoremove -y --purge docker-ce
# sudo apt-get autoclean
# sudo rm -rf /var/lib/docker
# sudo rm /etc/apparmor.d/docker
# sudo groupdel docker

# Uninstall Docker Compose
# sudo rm /usr/local/bin/docker-compose