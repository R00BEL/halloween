const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function wrapperFetch(url, config, isAnswer = true) {
  const response = await fetch(url, config);

  if (!response.ok) {
    throw { code: response.code };
  }

  if (isAnswer) {
    return response.json();
  }
}

module.exports = {
  wrapperFetch,
};
