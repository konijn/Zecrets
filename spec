#To create a new key; gpg --batch --generate-key spec
%echo Generating an encryption key for Zecrets
Key-Type: default
Subkey-Type: default
Name-Real: diary
Name-Comment: [Zecrets][quick]
Name-Email: zecrets@taryss.fr
Expire-Date: 0
Passphrase: Z3cr3ts
%commit
%echo done