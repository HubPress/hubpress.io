= Install Laravel Administrator on Laravel 5
:hp-tags: php,laravel 5,sql server

Administrator is an administrative interface builder for Laravel. With Administrator you can visually manage your Eloquent models and their relations, and also create stand-alone settings pages for storing site data and performing site tasks.

:numbered:

== Installation

To install Administrator as a Composer package to be used with Laravel 5, simply add this to your composer.json:

[source,json]
----
"frozennode/administrator": "5.*"
----

..and run composer update. Once it's installed, you can register the service provider in config/app.php in the providers array:

[source,php]
----
'providers' => [
    'Frozennode\Administrator\AdministratorServiceProvider',
]
----

Then publish Administrator's assets with **php artisan vendor:publish**. 

This will add the file config/administrator.php. This config file is the primary way you interact with Administrator. This command will also publish all of the assets, views, and translation files.

== Settings Configuration

