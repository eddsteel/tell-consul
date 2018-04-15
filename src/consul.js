const consulURL = "https://localhost:8543/v1/kv/"

const consulValue = (objs) => {
  var val = objs[0]["Value"]
  var str = atob(val)
  return JSON.parse(str);
}

export default class Consul {
  static publish(key, data) {
    return fetch(consulURL + key, {
      method: 'PUT',
      body: JSON.stringify(data),
    }).then(res => res.json())
      .then(response => {
        console.log('Success:', response)
        return response
      }, error =>console.error('Error:', error));
  }

  static retrieve(key) {
    return fetch(consulURL + key).then(res => res.json())
      .then(response => {
        console.log('Success:', response)
        return consulValue(response)
      },
      error => console.error('Error:', error))
  }
}
