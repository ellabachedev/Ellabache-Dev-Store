// Dynamic Tracking code ellabache.com.au - 2019-09-23
var _ctq = _ctq || [];
_ctq.push(['setCookieDomain', 'ellabache.com.au']);
_ctq.push(['setSiteId', 'FD-24450897']);
_ctq.push(['requires', ['main.phoneNumber']]);
_ctq.push(['replaceText', /1800\s?789\s?234/g, 'main.phoneNumber', { format: 'n' }]);
_ctq.push(['onNumberAvailable', function (num) { if ($) $("#header-phone").attr('href', 'tel:' + num); },
'main.phoneNumber', { format: 'n' }]);
_ctq.push(['trackPageView']);
(function () {
var wca = document.createElement('script'); wca.type = 'text/javascript'; wca.async = !0;
wca.src = "//web-call-analytics.com/wca.js";
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(wca, s);
})();