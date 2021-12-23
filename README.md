# Demo of the Serverless Stack (SST)

- https://github.com/serverless-stack
- https://github.com/serverless-stack/serverless-stack


create

curl -X POST \
-H 'Content-Type: application/json' \
-d '{"content":"Hello World","attachment":"hello.jpg"}' \
https://96v2abmggg.execute-api.us-east-1.amazonaws.com/notes

get

curl https://5bv7x0iuga.execute-api.us-east-1.amazonaws.com/notes/{noteId}

list

curl https://96v2abmggg.execute-api.us-east-1.amazonaws.com/notes

update

curl -X PUT \
-H 'Content-Type: application/json' \
-d '{"content":"New World","attachment":"new.jpg"}' \
https://96v2abmggg.execute-api.us-east-1.amazonaws.com/notes/{noteId}

delete

curl -X DELETE https://96v2abmggg.execute-api.us-east-1.amazonaws.com/notes/{noteId}
