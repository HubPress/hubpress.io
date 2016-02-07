# Install Logstash
:hp-tags: elk, ubuntu

Download and install the Public Signing Key:

[source,bash]
----
wget -qO - https://packages.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
----

Save the repository definition to /etc/apt/sources.list.d/elasticsearch-2.x.list:

[source,bash]
----
echo "deb http://packages.elastic.co/logstash/2.2/debian stable main" | sudo tee -a /etc/apt/sources.list
----

Run sudo apt-get update and the repository is ready for use. You can install it with:

[source,bash]
----
sudo apt-get update && sudo apt-get install logstash
----