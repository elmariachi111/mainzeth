mariabackup --backup \
   --target-dir=/root/backup/ \
   --databases='foo' \
   --user=root --password=mainz

tar -czvf bak.tgz /root/backup

docker cp relational_master_1:/root/bak.tgz relational_slave2_1:/root/backup/bak.tgz

tar -xzvf /root/bak.tgz

mariabackup --prepare --export --target-dir=/root/backup/

mariabackup  --target-dir=/root/backup/