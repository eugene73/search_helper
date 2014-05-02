var initialData = [
	{ keywords: 'c#', title: 'c#' },
	{ keywords: 'javascript', title: 'javascript' },
	{ keywords: 'javascript -jquery', title: 'javascript -jquery' },
	{ keywords: 'jquery', title: 'jquery' },
	{ keywords: 'knockoutjs\', \'knockout', title: 'knockoutjs' },
	{ keywords: 'angularjs\', \'angular', title: 'angularjs' },
	{ keywords: 'ms sql server\', \'sql server', title: 'sql server' },
	{ keywords: 'site:stackoverflow.com', title: 'stackoverflow.com' },
	{ keywords: 'site:microsoft.com', title: 'microsoft.com' },
	{ keywords: 'site:asp.net', title: 'asp.net' }
];

var injectKeywords = function() {
	var keywords = '__keywords__ ';
	var inputText = document.querySelector('input[name="q"]');
	if(inputText)
	{
		inputText.setAttribute('value', keywords);
		var strLength= keywords.length;
		inputText.focus();

		setTimeout(function() { inputText.setSelectionRange(strLength, strLength); }, 100);
	}
};

var injectGoogleHelper = function() {

	var ggHelper = document.getElementById('ggHelper');
	if(!ggHelper)
	{
		var data = __data__;
		var s = document.createElement('script');
		s.src = '__script_url__';
		s.onload = function() {
		    this.parentNode.removeChild(this);
		};
		(document.head||document.documentElement).appendChild(s);


		var helperHtml = '<div id="ggHelper" style="position: fixed; right: 1em;; top: 12em; width: 12em; height: ' + (data.length + 5) + 'em; border: 1px solid #a0a0a0; background-color: #f0f0f0; padding-left: 1em; padding-top: 0.4em;">';
		helperHtml += '<ul style="list-style-type: none;">';

		for(var i = 0; i < data.length; i++)
		{
			var dataItem = data[i];
			helperHtml += '<li style=""><a href="javascript: replaceAndSearch(\'' + dataItem.keywords + '\');">' + dataItem.title + '</a></li>';
		}

		helperHtml += '<li><a href="javascript: ggRemoveSpecific();">remove specific</a></li>';
		helperHtml += '<li><a href="javascript: ggSetTimeRange(\'qdr_w\');">week</a> | <a href="javascript: ggSetTimeRange(\'qdr_m\');">month</a> | <a href="javascript: ggSetTimeRange(\'qdr_y\');">year</a> | <a href="javascript: ggSetTimeRange(\'qdr_\');">any</a></li>';
		helperHtml += '</ul></div>';

		var bodyTag = document.querySelector('body');
		if(bodyTag)
		{
			var e = document.createElement('div');
			e.innerHTML = helperHtml;
			bodyTag.appendChild(e.firstChild);
		}
	}
};

window.ggActionData = {};

window.setActionData = function(data)
{
	window.ggActionData = data;
}

function getFunctionBody(f, data)
{
	var s = '' + f;

	if(data.keywords)
		s = s.replace('__keywords__', data.keywords);

	if(data.userData)
		s = s.replace('__data__', data.userData);

	if(data.scriptName)
		s = s.replace('__script_url__', chrome.extension.getURL(data.scriptName));
	else
		s = s.replace('__script_url__', '');

	s = s.replace(/^[^{]*{/, '').replace(/}[^}]*$/, '');

	return s;
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	var url = '';

	if(changeInfo && changeInfo.url)
		url = changeInfo.url.toLowerCase();
	else if(tab && tab.url)
		url = tab.url.toLowerCase();

	if(url && url.length > 0)
	{
		if(/^https?:\/\/www.google.[a-z]{2,3}\/?$/i.test(url) || /^https?:\/\/www.google.[a-z]{2,3}\/search/i.test(url) || /^https?:\/\/www.google.[a-z]{2,3}\/#/i.test(url) )
		{
			chrome.storage.sync.get({
				backgroundJSON: JSON.stringify(initialData, null, 4)
			}, function(items) 
			{
				var scriptCode = getFunctionBody(injectGoogleHelper, { scriptName: 'ggext.js', userData: items.backgroundJSON });
				 chrome.tabs.executeScript(null, { code: scriptCode }); 
			});
		}

		if(url.indexOf(window.ggActionData.url) == 0 && window.ggActionData.keywords)
		{
			var scriptCode = getFunctionBody(injectKeywords, window.ggActionData);
			 chrome.tabs.executeScript(null, { code: scriptCode }); 
		}

		window.ggActionData = {};
	}
});

