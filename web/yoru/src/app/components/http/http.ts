const BaseUrl = "/api";

export const $http = async (
  method: string,
  url: string,
  data: any,
  isFormData: boolean = false
) => {
  let headers: Record<string, string> = {};

  const token = localStorage.getItem("token");
  if (token !== undefined) {
    headers['Authorization'] = `${token}`;
  }

  let fullUrl = `${BaseUrl}${url}`;
  let body: any = null;

  if (isFormData) {
    body = new FormData();
    for (const key in data) {
      body.append(key, data[key]);
    }
  } else {
    headers['Content-Type'] = 'application/json';
    const queryParams = new URLSearchParams(data).toString();
    fullUrl += queryParams ? `?${queryParams}` : '';
  }

  return fetch(fullUrl, {
    method: method,
    headers: headers,
  }).then(response => response.json());
};
