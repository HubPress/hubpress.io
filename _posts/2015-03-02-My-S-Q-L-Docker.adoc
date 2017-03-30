= MySQL Docker
:hp-tags: docker, mysql


== What is MySQL?

MySQL is (as of March 2014) the world's second most widely used open-source relational database management system (RDBMS). It is named after co-founder Michael Widenius's daughter, My. The SQL phrase stands for Structured Query Language.

MySQL is a popular choice of database for use in web applications, and is a central component of the widely used LAMP open source web application software stack (and other 'AMP' stacks). LAMP is an acronym for “Linux, Apache, MySQL, Perl/PHP/Python.” Free-software-open source projects that require a full-featured database management system often use MySQL.

Oracle Corporation and/or affiliates own the copyright and trademark for MySQL.

== How to use this image
Start a mysql instance

[source,bash]
----
docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=mysecretpassword -d mysql
----

Start a mysql instance and bind it on machine port.

[source,bash]
----
docker run --name some-mysql --env-file ./env.list -p 3306:3306 -d mysql 
----

The env.list file
[source,bash]
----
MYSQL_USER=<name>
MYSQL_PASSWORD=<pass>
MYSQL_ROOT_PASSWORD=<pass>
MYSQL_DATABASE=<db>
----

=== Environment Variables

The MySQL image uses several environment variables which are easy to miss. While not all the variables are required, they may significantly aid you in using the image.

==== MYSQL_ROOT_PASSWORD

This is the one environment variable that is required for you to use the MySQL image. This environment variable should be what you want to set the root password for MySQL to. In the above example, it is being set to “mysecretpassword”.

==== MYSQL_USER, MYSQL_PASSWORD

These optional environment variables are used in conjunction to set both a MySQL user and password, which will subsequently be granted all permissions for the database specified by the optional MYSQL_DATABASE variable. Note that if you only have one of these two environment variables, then neither will actually do anything - these two are meant to be used in conjunction with one another. When these variables are used, it will create a new user with the given password in the MySQL database - there is no need to specify MYSQL_USER with root, as the root user already exists in the default MySQL and the password is controlled by MYSQL_ROOT_PASSWORD.

==== MYSQL_DATABASE

This optional environment variable denotes the name of a database to create. If a user/password was supplied (via the MYSQL_USER and MYSQL_PASSWORD environment variables) then that user account will be granted (GRANT ALL) access to this database.