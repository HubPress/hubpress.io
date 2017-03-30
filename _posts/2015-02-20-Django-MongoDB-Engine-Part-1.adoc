= Django MongoDB Engine [Part 1]
:hp-tags: python,mongo,django

:numbered:

== Installation

Django MongoDB Engine depends on

* link:http://django-nonrel.org/[Django-nonrel], a fork of Django that adds support for non-relational databases.
* link:https://github.com/django-nonrel/djangotoolbox[djangotoolbox], a bunch of utilities for non-relational Django applications and backends.

It’s highly recommended (although not required) to use a link:http://www.virtualenv.org/[virtualenv] for your project to not mess up other Django setups.

=== virtualenv

*virtualenv* is a tool to create isolated Python environments.

If not already installed, grab a copy from the Cheeseshop:

[source,bash]
----
pip install virtualenv
----

To set up a virtual environment for your project, use

[source,bash]
----
virtualenv myproject
----

To join the environment, use (in Bash):

[source,bash]
----
source myproject/bin/activate
----

=== Django-nonrel
Django fork with support for NoSQL databases

[source,bash]
----
pip install git+https://github.com/django-nonrel/django@nonrel-1.7
----

=== djangotoolbox

Djangotoolbox provides a common API for running Django on non-relational/NoSQL databases.

[source,bash]
----
pip install git+https://github.com/django-nonrel/djangotoolbox
----

The djangotoolbox.admin module provides admin overrides for making django.contrib.auth work correctly in the admin UI. Simply add 'djangotoolbox' to INSTALLED_APPS after django.contrib.admin.

This will disable features that require JOINs. If you still need permission handling you should use the nonrel permission backend.

==== django-permission-backend-nonrel

A Django authentication backend that supports Django's user and group permissions on Django-Nonrel.

* Get the code from Github:

  git clone https://github.com/django-nonrel/django-permission-backend-nonrel.git

* add *permission_backend_nonrel.backends.NonrelPermissionBackend* to your AUTHENTICATION_BACKENDS and *permission_backend_nonrel* to your INSTALLED_APPS


    settings.py:

    AUTHENTICATION_BACKENDS = (
        ...
        'permission_backend_nonrel.backends.NonrelPermissionBackend',
    )

    INSTALLED_APPS = (
        ...
        'permission_backend_nonrel',
    )

* It's important to put 'permission_backend_nonrel after djangotoolbox, because permission_backend_nonrel.admin replaces djangotoolbox's User admin site.
+
Permission and groups can be assigned and modified via Django's admin interface:
+
link:https://camo.githubusercontent.com/603ca1906c7fe866050b50b90337e9a8925a3301/687474703a2f2f666c6f6f6f6f66696c65732e61707073706f742e636f6d2f73657276652f66696c65732f61646d696e2e6a7065672f[Django-nonrel admin with user_permissions and groups]
+
Django-gaeauth admin interface with user_permissions and groups

* Now you should be able to use all the standard Django permission methods and decorators, like user.has_perm('foo') and so on.


=== Django MongoDB Engine

You should use the latest Git
revision.

[source,bash]
----
pip install git+https://github.com/django-nonrel/mongodb-engine
----

== Configuration

Database setup is easy (see also the link:https://docs.djangoproject.com/en/dev/ref/settings/#databases[Django database setup docs]):

[source,python]
----
DATABASES = {
   'default' : {
      'ENGINE' : 'django_mongodb_engine',
      'NAME' : 'my_database'
   }
}
----

Django MongoDB Engine also takes into account the HOST, PORT, USER, PASSWORD and OPTIONS settings.

Possible values of OPTIONS are described in the link:https://django-mongodb-engine.readthedocs.org/en/latest/reference/settings.html[settings reference].
