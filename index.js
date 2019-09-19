import axios from "axios";

const url = "https://en.wikipedia.org/w/api.php";

/**
 *
 * @param {*} value
 * @param {*} limit
 * @param {*} page
 */
const search = (value, limit = 20, page = 0) => {
  if (!value) {
    return Promise.reject(new Error("The search value cannot be empty!"));
  }

  const params = {
    action: 'query',
    format: 'json',
    list: 'search',
    srsearch: value,
    srlimit: limit,
    sroffset: page * limit
  };

  const onSuccess = (res) => {
    const data = res.data;
    const result = {
      search: data.query.search,
      limit: limit,
      page: page,
      total: data.query.searchinfo.totalhits
    };

    console.debug(`Search successfully! Total hits ${result.total}, current page ${result.page} with page limitiation ${result.limit}`);
    return result;
  };

  const onError = function (error) {
    console.error('Request Failed:', error.config);

    if (error.response) {
      // Request was made but server responded with something
      // other than 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);

    } else {
      // Something else happened while setting up the request
      // triggered the error
      console.error('Error Message:', error.message);
    }

    return Promise.reject(error.response || error.message);
  }


  return axios.get(url, { params })
           .then(onSuccess)
           .catch(onError);
};

const wiki = {
  search
};

export default wiki;
