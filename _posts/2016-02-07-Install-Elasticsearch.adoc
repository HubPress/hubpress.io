# Install Elasticsearch
:hp-tags: elk, ubuntu

Download and install the Public Signing Key:

[source,bash]
----
wget -qO - https://packages.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
----

Save the repository definition to /etc/apt/sources.list.d/elasticsearch-2.x.list:

[source,bash]
----
echo "deb http://packages.elastic.co/elasticsearch/2.x/debian stable main" | sudo tee -a /etc/apt/sources.list.d/elasticsearch-2.x.list
----

Run apt-get update and the repository is ready for use. You can install it with:

[source,bash]
----
sudo apt-get update && sudo apt-get install elasticsearch
----

Configure Elasticsearch to automatically start during bootup. If your distribution is using SysV init, then you will need to run:

[source,bash]
----
sudo update-rc.d elasticsearch defaults 95 10
----