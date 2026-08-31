function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retryOperation(operation, { delaysMs = [], delay = wait } = {}) {
  let lastError;

  for (let attempt = 0; attempt <= delaysMs.length; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt >= delaysMs.length) break;
      await delay(delaysMs[attempt]);
    }
  }

  throw lastError;
}
