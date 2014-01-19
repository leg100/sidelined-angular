/**
 * redirect javascript bookmarklet
 */
// javascript:location.href='http://example.com/?uri='+encodeURIComponent(location.href)

/**
 * bookmarklet loaded on site
 */
(function(){

  var div = document.createElement('div');
  div.setAttribute('style', 'width: 350px; height: 100%; position: fixed; top: 0px; right: 0px; padding: 5px');

  var script = document.createElement('script');
  script.src = 'https://localhost:9000/scripts/bookmarklet/close.js';
  script.type = 'text/javascript';
  document.body.appendChild(script);

  var iframe = document.createElement('iframe');
  iframe.setAttribute('src', 'https://localhost:9000/views/bookmarklet/iframe.html');
  iframe.setAttribute('id', 'sidelinedIFrame');
  iframe.setAttribute('height', '100%');
  iframe.setAttribute('width', '100%');
  div.appendChild(iframe);
  document.body.appendChild(div);
})();
