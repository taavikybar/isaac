class NonFatalError extends Error {
  constructor(message, options) {
    super(message, options);
  }
}

module.exports = NonFatalError