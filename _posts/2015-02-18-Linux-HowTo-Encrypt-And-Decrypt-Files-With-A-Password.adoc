= Linux: HowTo Encrypt And Decrypt Files With A Password
:hp-tags: linux, security

To encrypt and decrypt files with a password, use gpg command. It is an encryption and signing tool for Linux/UNIX like operating system such as FreeBSD/Solaris and others.

:numbered:

== gnupg

GnuPG stands for GNU Privacy Guard and is GNU's tool for secure communication and data storage. It can be used to encrypt data and to create digital signatures. It includes an advanced key management facility.

=== Encrypting a file in linux

To encrypt a single file, use command gpg as follows:

[source,bash]
----
$ gpg -c filename
----

To encrypt myfinancial.info.txt file, type the command:
[source,bash]
----
$ gpg -c myfinancial.info.txt
----

Sample output:
[source,bash]
----
Enter passphrase:<YOUR-PASSWORD>
Repeat passphrase:<YOUR-PASSWORD>
----

This will create a myfinancial.info.txt.gpg file. Where,

-c :: Encrypt with symmetric cipher using a passphrase. The default symmetric cipher used is CAST5, but may be chosen with the --cipher-algo option. This option may be combined with --sign (for a signed and symmetrically encrypted message), --encrypt (for a message that may be decrypted via a secret key or a passphrase), or --sign and --encrypt together (for a signed message that may be decrypted via a secret key or a passphrase).

Please note that if you ever forgot your password (passphrase), you cannot recover the data as it use very strong encryption.

=== Decrypt a file

To decrypt file use the gpg command as follow:
[source,bash]
----
$ gpg myfinancial.info.txt.gpg
----
Sample outputs:
[source,bash]
----
gpg myfinancial.info.txt.gpg
gpg: CAST5 encrypted data
Enter passphrase:<YOUR-PASSWORD>
----
Decrypt file and write output to file vivek.info.txt you can run command:
[source,bash]
----
$ gpg myfinancial.info.gpg –o vivek.info.txt
----
Also note that if file extension is .asc, it is a ASCII encrypted file and if file extension is .gpg, it is a binary encrypted file.

Reblog from link:http://www.cyberciti.biz/tips/linux-how-to-encrypt-and-decrypt-files-with-a-password.html[nixCraft]