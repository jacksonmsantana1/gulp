# gulp


In case of happen this problem : Error: watch ENOSPC
This is related to the max number of watched files by nodemon.

Use this command for linux users
-->echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
