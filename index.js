import axios from "axios";

const url = "https://en.wikipedia.org/w/api.php";

/**
 * Pre-process response, reject warning and error
 * @param {Object} res: response of wiki api
 *
 * @return {Promise}
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
}

const onError = function (error) {
  console.error('Request Failed:', error);

  return Promise.reject(error.response || error.message || error);
}

/**
 *
 * @param {*} value
 * @param {*} limit
 * @param {*} page
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

const wiki = {
  search
};

export default wiki;
