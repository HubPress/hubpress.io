# Install Kibana
:hp-tags: elk, ubuntu

Download and install the Public Signing Key:

[source,bash]
----
wget -qO - https://packages.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
----

Add the repository definition to your /etc/apt/sources.list file: 

[source,bash]
----
echo "deb http://packages.elastic.co/kibana/4.4/debian stable main" | sudo tee -a /etc/apt/sources.list
----

Run apt-get update and the repository is ready for use. You can install it with:

[source,bash]
----
sudo apt-get update && sudo apt-get install kibana
----

Configure Kibana to automatically start during bootup. If your distribution is using the System V version of init, run the following command: 

[source,bash]
----
sudo update-rc.d kibana defaults 95 10
----