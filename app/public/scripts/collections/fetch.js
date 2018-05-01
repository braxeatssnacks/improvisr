export function parameterize(params) {
  var encoded = '';
  for (var prop in params) {
    if (params.hasOwnProperty(prop)) {
      if (encoded.length > 0) encoded += '&';
      encoded += encodeURI(prop+'='+params[prop]);
    }
  }
  return encoded;
}

export function getAjax(url, params, $elements, callback) {
  var xhttp = new XMLHttpRequest();
  var encodedUrl = (Object.keys(params).length > 0) ?
    url+'?'+parameterize(params): url;
  xhttp.open('GET', encodedUrl, true);
  xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
     var respData = JSON.parse(xhttp.responseText);
     return callback(null, $elements, respData);
    } else if (xhttp.readyState == 4) {
     var err = new Error(xhttp.status);
     return callback(err, $elements, null);
    }
  };
  xhttp.send();
}

export default { getAjax, parameterize }
