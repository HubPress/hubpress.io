= Let's Chat on Ubuntu
:hp-tags: docker,chat,hot

Self-hosted chat app for small teams http://sdelements.github.io/lets-chat.

image::https://camo.githubusercontent.com/6c55e0f17d53d100977a8c6d49ce9575681da0fd/687474703a2f2f692e696d6775722e636f6d2f7644626858756c2e706e67[let's chat]

:numbered:

== Features and Stuff

* BYOS (bring your own server)
* Persistent messages
* Multiple rooms
* New message alerts / notifications
* Mentions (hey @you)
* Image embeds
* Code pasting
* File uploads (Local / Amazon S3)
* Transcripts / chat history
* XMPP Multi-user chat (MUC)
* Local / Kerberos / LDAP authentication
* Hubot Adapter
* EST-like API
* MIT Licensed

== Installation

=== Docker

The current Docker file creates a Let's Chat container, with no on-board MongoDB instance. It requires a link to a separate Mongo container.

Make sure you have Docker installed. The following is a basic example of how to use the Dockerfile. We recommend reading documentation and/or tutorials, if you have never used Docker before.

[source,bash]
----
docker pull mongo
----

[source,bash]
----
git clone https://github.com/sdelements/lets-chat.git
cd lets-chat
docker build -t lets-chat .
----

[source,bash]
----
docker run -d --name db mongo
docker run -p 5000:5000 --link db:db lets-chat
----

You can now access the app at http://localhost:5000.

Restart the service
[source,bash]
----
docker run start db
docker run -p 5000:5000 --link db:db lets-chat
----

image::https://camo.githubusercontent.com/f59d2c3525b16e008c018fa3925841d69b8124a3/687474703a2f2f692e696d6775722e636f6d2f4334754d4436372e706e67[let's chat]