import axios from "axios";

const url = "https://en.wikipedia.org/w/api.php";

/**
 * @summary: Pre-process response, reject warning and error
 * @param {Object} res - response of wiki api
 *
 * @return {Promise} - response data
 */
const wikiResponseProcess = (res) => {
  const data = res.data;

  if (data.error) {
    return Promise.reject(`Error! ${data.error.info}`);
  }

  if (data.warnings) {
    let msg = '';
    for (let key in data.warnings) {
      msg += `${key}: `;
      msg += Object.values(data.warnings[key]).join(' ');
    }

    return Promise.reject(`Warning! ${msg}`);
  }

  return Promise.resolve(data);
};

/**
 * @summary error handler
 * @param {*} error
 * @return {Promise} - reject promise, return parsed error message
 */
const onError = (error) => {
  console.error('Request Failed:', error);

  return Promise.reject(error.response || error.message || error);
};

/**
 * @summary search for page by title or content
 * @param {string} value - Search for page titles or content matching this value.
 * @param {Number} limit - How many total result pages
 * @param {Number} page - The index of 'search' papge, eg. if page == 0, return the first limit number of page, if page == 2, return the second limit number of page
 * @return {Promise} - result object { search: array of result pages, limit, page, total: total hit pages number }
 *
 */
const search = (value, limit = 20, page = 0) => {
  if (!value) {
    return Promise.reject("The search value cannot be empty!").catch(onError);
  }

  const params = {
    action: 'query',
    format: 'json',
    list: 'search',
    srsearch: value,
    srlimit: limit,
    sroffset: page * limit
  };

  const onSuccess = (data) => {
    const result = {
      search: data.query.search,
      limit: limit,
      page: page,
      total: data.query.searchinfo.totalhits
    };

    console.debug(`Search successfully! Total hits ${result.total}, current page ${result.page} with page limitiation ${result.limit}`);
    return result;
  };

  return axios.get(url, { params })
           .then(wikiResponseProcess)
           .then(onSuccess)
           .catch(onError);
};

const random = (limit = 20, rncontinue = null)=> {
  const params = {
    action: 'query',
    format: 'json',
    list: 'random',
    rnlimit: limit,
    rncontinue
  };

  const onSuccess = (data) => {
    const result = {
      random: data.query.random,
      rncontinue: data.continue.rncontinue,
      limit: limit
    };

    console.debug(`Get ${limit} random pages successfully!`);
    return result;
  };

  return axios.get(url, { params })
    .then(wikiResponseProcess)
    .then(onSuccess)
    .catch(onError);
};

const wiki = {
  search,
  random
};

export default wiki;
