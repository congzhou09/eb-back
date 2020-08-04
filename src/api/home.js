import fetch from 'utils/fetch';

export function homeInfo() {
  return fetch({
    url: '/total/back',
    method: 'post'
  });
}
