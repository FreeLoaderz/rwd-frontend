cp mainnetpools mainnetpools.sh
rm allpools.json
sed -i -- "s/^/curl -H \"project_id: $(cat blockfrost.txt)\"  https:\/\/cardano-mainnet.blockfrost.io\/api\/v0\/pools\//g" mainnetpools.sh
sed -i -- "s/$/\/metadata >> allpools.json/g" mainnetpools.sh
sh mainnetpools.sh
grep -oP "\"url\".?:.?\"http[s]?://[a-zA-Z0-9|\.|\/|\-|\_]+\"" allpools.json > metadataurl.sh
sed -i -- "s/.*http/curl -L http/g" metadataurl.sh
sed -i -- "s/\"$/ >> fullmetadata.json;echo ',' >> fullmetadata.json/g" metadataurl.sh
echo "[" > fullmetadata.json
sh metadataurl.sh
truncate -s -2 fullmetadata.json
echo "]" >> fullmetadata.json
grep -oP "\"extended\".?:.?\"http[s]?://[a-zA-Z0-9|\.|\/|\-|\_]+\"" fullmetadata.json > extended.sh
sed -i -- "s/.*http/curl -L http/g" extended.sh
sed -i -- "s/\"$/ >> fullextended.json;echo ',' >> fullextended.json/g" extended.sh
echo "[" > fullextended.json
sh extended.sh
truncate -s -2 fullextended.json
echo "]" >> fullextended.json
sed -i -- "s/^[a-z].*$/{}/g" fullextended.json
