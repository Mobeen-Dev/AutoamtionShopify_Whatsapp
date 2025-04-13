export class RequestGroup {
  constructor() {
    // Flag to indicate if this client's group is in process
    this.inProcess = false;
    // Array to hold requests, each represented as a tuple [receiver, message]
    this.requests = [];
  }
}

export class RequestQueue {
  constructor() {
    // FIFO queue for ordering client IDs. Using an array: push() to add, shift() to remove.
    this.clientQueue = [];
    // Object for direct access to client groups.
    // Keys are client IDs, and values are RequestGroup instances.
    this.groups = {};
  }

  // Enqueue a new request
  enqueueRequest(clientId, receiver, message) {
    // Try to get the existing group.
    let group = this.groups[clientId];
    // If no group exists for this client, create a new one.
    if (group === undefined) {
      group = new RequestGroup();
      this.groups[clientId] = group;
      this.clientQueue.push(clientId);
    }
    // Append the new request as a tuple [receiver, message].
    group.requests.push([receiver, message]);
  }

  // Process the next client in FIFO order.
  processNext() {
    // If the client queue is empty, return null.
    if (this.clientQueue.length === 0) {
      return null;
    }
    // Remove the first client id (FIFO).
    const clientId = this.clientQueue.shift();
    // Retrieve its associated group.
    const group = this.groups[clientId];
    // Mark the group as being processed.
    group.inProcess = true;
    // Return an object containing the client id and its group.
    return { clientId, group };
  }
}

// ----- Example usage (you can remove or comment this section when importing) -----
// Uncomment the lines below to run an example

// const rq = new RequestQueue();
// // Enqueue some requests for different clients.
// rq.enqueueRequest("client3", 12345, "Hello");
// rq.enqueueRequest("client1", 4212345, "Hello");
// rq.enqueueRequest("client1", 1242345, "Hello");
// rq.enqueueRequest("client1", 122345, "Hello");
// rq.enqueueRequest("client1", 123145, "Hello");
// rq.enqueueRequest("client1", 1422345, "Hello");
// rq.enqueueRequest("client1", 1234425, "Hello");
// rq.enqueueRequest("client1", 1242345, "Hello");
// rq.enqueueRequest("client1", 1422345, "Hello");
// rq.enqueueRequest("client1", 1234425, "Hello");
// rq.enqueueRequest("client2", 6782190, "World");
// rq.enqueueRequest("client2", 6721890, "World");
// rq.enqueueRequest("client2", 6217890, "World");
// rq.enqueueRequest("client2", 2167890, "World");
// rq.enqueueRequest("client2", 6789210, "World");
// rq.enqueueRequest("client2", 6789021, "World");
// rq.enqueueRequest("client1", 154321, "Another message");
// rq.enqueueRequest("client1", 514321, "Another message");
// rq.enqueueRequest("client1", 541321, "Another message");
// rq.enqueueRequest("client1", 543121, "Another message");
// rq.enqueueRequest("client1", 543211, "Another message");

// // Process queued clients until no more remain.
// let result = rq.processNext();
// while (result) {
//   const { clientId, group } = result;
//   console.log(`Processing ${clientId}:`, group.requests);
//   result = rq.processNext();
// }
