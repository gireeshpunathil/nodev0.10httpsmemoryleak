# nodev0.10httpsmemoryleak
Contains a standalone test case which demonstrates how Buffer, CleartextStream, IncomingMessage objects are leaking across completely recycled transactions.

Steps:

1. node server.js
2. node httpsclient.js

a. Make sure that the client is running in node v0.10.* 
b. The test runs roughly for around 200 seconds, and produces heapdumps before and after the transactions.
c. Ideally, we wont expect any 'traces' of the transactions in the heapdump, but there are buffers, and other artifacts pertinent to https module hanging around.
d. The code has dependency on heapdump module.
