var popupInitialData = [
  { keywords: 'c#', title: 'c#' , 
	subitems: [ 
                    { keywords: 'c#', title: 'c#' },
                    { keywords: 'c# generic', title: 'generic' },
                    { keywords: 'c# linq', title: 'linq' }
                  ]
  },
  { keywords: 'css', title: 'css' },
  { keywords: 'javascript', title: 'javascript' },
  { keywords: 'javascript -jquery', title: 'javascript -jquery' },
  { keywords: 'jquery', title: 'jquery' , 
	subitems: [ 
                    { keywords: 'jquery', title: 'jquery' },
                    { keywords: 'jquery ajax', title: 'ajax' },
                    { keywords: 'jquery animation', title: 'animation' }
                  ]
  },
  { keywords: 'angularjs', title: 'angularjs', 
	subitems: [ 
                    { keywords: 'angularjs', title: 'angularjs' },
                    { keywords: 'angularjs controller', title: 'controller' },
                    { keywords: 'angularjs directive', title: 'directive' },
                    { keywords: 'angularjs provider', title: 'provider' },
                    { keywords: 'angularjs scope', title: 'scope' }
                  ]
  },
  { keywords: 'knockout', title: 'knockout' },
  { keywords: 'kendo ui', title: 'kendo ui' },
  { keywords: 'ms sql server', title: 'ms sql server', 
	subitems: [ 
                    { keywords: 'ms sql server', title: 'ms sql server' },
                    { keywords: 'ms sql server stored procedure', title: 'stored proc' },
                    { keywords: 'ms sql server tsql', title: 'tsql' }
                  ]
  }
];

var backgroundInitialData = [
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



function save_options() 
{
	var statusMessage = '';
	var popupData;
	var backgroundData;

	try
	{
		popupData = JSON.parse(document.getElementById('popupJSON').value);
	} catch(ex) {
		statusMessage = "Panel JSON " + ex;
	}

	try
	{
		backgroundData = JSON.parse(document.getElementById('backgroundJSON').value);
	} catch(ex) {
		statusMessage += "\r\n Background JSON " + ex;
	}

	if(statusMessage)
	{
		var status = document.getElementById('status');
		status.textContent = statusMessage;
		setTimeout(function() { status.textContent = ''; }, 750);
	}
	else
	{
		chrome.storage.sync.set({
			popupJSON: JSON.stringify(popupData, null, 4),
			backgroundJSON: JSON.stringify(backgroundData, null, 4)
		}, function() {
			var status = document.getElementById('status');
			status.textContent = 'Options saved.';

    			setTimeout(function() { status.textContent = ''; }, 750);
		});
	}
}

function restore_options() 
{
	chrome.storage.sync.get({
		popupJSON: JSON.stringify(popupInitialData, null, 4),
		backgroundJSON: JSON.stringify(backgroundInitialData, null, 4)
	}, function(items) 
	{
		document.getElementById('popupJSON').value = items.popupJSON;
		document.getElementById('backgroundJSON').value = items.backgroundJSON;
	});
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
