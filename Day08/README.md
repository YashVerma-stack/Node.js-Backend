# Part 1 — Event-Driven Architecture
### Node.js is heavily based on an event-driven architecture.
- The basic idea is:
```
something happens
|
Event is emitted
|
Listener receives event
|
Listener executes function
```

---
## For Example
```
User craetes a note
|
"noteCreated" event
|
Listener
|
Log "New note created"
```

- This is useful because different parts of an application can react to the same event without being tightly connected.


## What is `pipeline()`?

- Node.js provide:
```
import { pipeline } from "node:stream/promises";
```

- `pipeline()` connects multiple streams and gives us better error handling and cleanup.