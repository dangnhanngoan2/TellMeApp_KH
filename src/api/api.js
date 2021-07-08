import qs from 'querystringify'
import _ from 'lodash'

let DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
}

const MULTIPART_FORM_HEADER = {
  'Content-Type': 'multipart/form-data',
  'Mime-Type': 'jpg|jpeg|png'
}
// production: http://backend.nghelangnghe.com:8888/api/
//dev:  167.172.89.187:8888
// export const baseUrl = 'http://167.172.89.187:8888/api/';
// export const imageUrl = 'http://167.172.89.187:8888/storage/';
const baseUrl = 'http://backend.nghelangnghe.com:8888/api/';
export const imageUrl = 'http://backend.nghelangnghe.com:8888/storage/';

export const socketUrl = 'http://167.172.89.187:8888';
export const socketUrlNew = 'http://167.172.89.187:8888';

export function setAccessToken(token: string): void {
  DEFAULT_HEADERS = {
    ...DEFAULT_HEADERS,
    Authorization: `Bearer ${token}`
  }
}

export const api = {
  get: (endpoint: string, params: Object) => {
    const options = {
      method: 'GET',
      headers: {
        ...DEFAULT_HEADERS
      }
    }
    return fetch(baseUrl + endpoint + qs.stringify(params, true), options).then(
      result => {
        console.log('Request-----', { request: { endpoint, options, params }, result });
        return result.json()
      }
    )
  },

  post: (endpoint: string, params: Object) => {
    const options = {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        ...DEFAULT_HEADERS
      }
    }

    console.log('baseUrl + endpoint: ', DEFAULT_HEADERS)
    return fetch(baseUrl + endpoint, options).then(result => {
      console.log('result: ', result)
      console.log('Request-----', { request: { endpoint, options, params }, result });
      return result.json()
    })
  },

  postImage: (endpoint: string, params: Object) => {
    const formData = new FormData()
    _.forIn(params, (value, key) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value)
      }
    })
    const options = {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'multipart/form-data',
        'Content-Type': 'multipart/form-data'
      }
    }
    return fetch(baseUrl + endpoint, options).then(result => result.json())
  },

  postRaw: (endpoint: string, params: Object) => {
    const options = {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        ...DEFAULT_HEADERS,
        'Content-Type': 'application/json'
      }
    }
    return fetch(baseUrl + endpoint, options).then(result => {
      return result.json()
    })
  },

  put: (endpoint: string, params: Object) => {
    const options = {
      method: 'PUT',
      body: JSON.stringify(params),
      headers: {
        ...DEFAULT_HEADERS,
        'Content-Type': 'application/json'
      }
    }
    return fetch(baseUrl + endpoint, options).then(result => {
      return result.json()
    })
  },

  postFormData: (endpoint: string, params): Promise => {
    let formData = new FormData()
    _.forIn(params, (value, key) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value)
      }
    });

    const options = {
      method: 'POST',
      body: formData,
      headers: {
        ...DEFAULT_HEADERS,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    }

    return fetch(baseUrl + endpoint, options).then(result => {
      console.log('result: ', result)
      return result.json()
    })
  },

  postUrlFormEncoded: (
    endpoint: string,
    params: Object,
    extraConfig: Object
  ): Promise => {
    const options = {
      method: 'POST',
      headers: {
        ...DEFAULT_HEADERS,
        ...extraConfig.headers
      },
      body: qs.stringify(params)
    }
    return fetch(baseUrl + endpoint, options).then(result => {
      return result.json()
    })
  }
}
