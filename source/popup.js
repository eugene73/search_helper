var initialData = [
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

function click(e) {
	var data = { 
		url: e.target.getAttribute("data-url"),
		keywords: e.target.getAttribute("data-keywords")
	};

	chrome.extension.getBackgroundPage().setActionData(data);

	if(data.url)
	{
		chrome.tabs.create({ url: data.url });
		var evt = e ? e:window.event;
		if (evt.stopPropagation)    evt.stopPropagation();
		if (evt.cancelBubble!=null) evt.cancelBubble = true;
	}
}

function setPanelData(userData) {

	var mainTemplate = document.getElementById('mainItemRow').innerHTML;
	var subItemTemplate = document.getElementById('subItemRow').innerHTML;

	var mainContrlHtml = '';
	for(var i = 0; i < userData.length; i++)
	{
		var row = mainTemplate;
		var data = userData[i];
		for(var k in data)
		{
			row = row.replace('{{' + k + '}}', data[k]);
		}
		mainContrlHtml += row.replace(/\{\{idx\}\}/g, i);
	}

	document.getElementById("mainContainer").innerHTML = mainContrlHtml;

	for(var i = 0; i < userData.length; i++)
	{
		var data = userData[i];
		if(data.subitems && data.subitems.length > 0)
		{
			azName = data.title.replace(/[^a-z0-9]/gi, '');
			if(azName.length > 0)
			{
				var subContrlHtml = document.getElementById('subItemContainer').innerHTML;
				subContrlHtml = subContrlHtml.replace(/\{\{azName\}\}/g, azName).replace(/\{\{idx\}\}/g, i);
				var rowsHtml = '';

				for(var j = 0; j < data.subitems.length; j++)
				{
					var subdata = data.subitems[j];
					var row = subItemTemplate;

					for(var k in subdata)
					{
						row = row.replace('{{' + k + '}}', subdata[k]);
					}
					rowsHtml += row;
				}				

				var availableFromBottom = userData.length - i;
				var topEm = data.subitems.length < availableFromBottom ? i : (userData.length - data.subitems.length + 0.7);
				if(topEm < 1)
					topEm = 1.6;

				var rowsStyle = 'top: ' + topEm + 'em;';
				subContrlHtml = subContrlHtml.replace('{{subItemsHtml}}', rowsHtml).replace('{{substyle}}', rowsStyle);
				
				var newDiv = document.createElement('div');
				newDiv.innerHTML = subContrlHtml;

				var mainCntrl = document.getElementById("main_" + i);
				mainCntrl.insertBefore(newDiv.firstChild, mainCntrl.firstChild);
			}
		}
	}


	var divs = document.querySelectorAll('div');
	for (var i = 0; i < divs.length; i++) {
		if(divs[i].getAttribute('data-url'))
			divs[i].addEventListener('click', click);
	}

	document.getElementById("settingsItem").addEventListener('click', clickSettings);
};


function restoreOptions()
{
	chrome.storage.sync.get({
		popupJSON: JSON.stringify(initialData, null, 4)
	}, function(items) 
	{
		setPanelData(JSON.parse(items.popupJSON));
	});
}

document.addEventListener('DOMContentLoaded', restoreOptions);
