const JSONLog = (log) => {
  if (process.env.DEBUG) {
    console.log(JSON.stringify(log, null, 2))
  }
};

const log = function () {
  if (process.env.DEBUG) {
    const args = Array.prototype.slice.call(arguments);
    console.log.apply(console, args);
  }
};

module.exports = {
  assertEventFired: ({ logs }, eventName) => {
    JSONLog(logs);
    const event = logs.find(log => log.event === eventName);
    assert.equal(!!event, true, `Event ${eventName} didn't happened`);
  },

  assertTransaction: ({ receipt: { status } }) => {
    JSONLog(status);
    assert.equal(status, '0x1', "Transaction failed");
  },

  assertTransactionFailed: ({ receipt: { status } }) => {
    JSONLog(status);
    assert.equal(status, '0x0', "Transaction worked");
  },

  JSONLog,
  log
};
