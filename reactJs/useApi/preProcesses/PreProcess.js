import ApiHeader from './ApiHeader';

export default function PreProcess(apiAddress, urlName, params) {
  let apiData = apiAddress.find((obj) => obj.name === urlName);
  if (apiData === undefined) {
    return false;
  }
  return {
    urlName: urlName,
    method: apiData.method,
    url: apiData.url,
    data: params,
    headers: ApiHeader(apiData.auth, apiData.media),
  };
}
