# How do I fix the GPG error “NO_PUBKEY”?
:hp-tags: gpg, debian, apt

[source,bash]
----
W: GPG error: http://packages.elasticsearch.org stable Release: 
The following signatures couldn't be verified because the public 
key is not available: NO_PUBKEY D27D666CD88E42B4
----

Execute the following commands in terminal

[source,bash]
----
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys D27D666CD88E42B4
----

and then update 

[source,bash]
----
sudo apt-get update
----

