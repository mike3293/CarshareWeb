docker build --progress=plain -t carshare-web .
docker tag carshare-web mikhailgorodilov/carshare-web:latest
docker push mikhailgorodilov/carshare-web:latest
Read-Host -Prompt "Press Enter to exit"