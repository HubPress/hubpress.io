= How to enable mod_rewrite in Apache?
:hp-tags: apache2, debian


To enable it the rewrite module, run "apache2 enable module rewrite":

sudo a2enmod rewrite

You need to restart the webserver to apply the changes:

sudo service apache2 restart

If you plan on using mod_rewrite in .htaccess files, you also need to enable the use of .htaccess files by changing AllowOverride None to AllowOverride FileInfo. For the default website, edit /etc/apache2/sites-available/default:

    <Directory /var/www/>
            Options Indexes FollowSymLinks MultiViews
            # changed from None to FileInfo
            AllowOverride FileInfo
            Order allow,deny
            allow from all
    </Directory>

After such a change, you need to restart Apache again.