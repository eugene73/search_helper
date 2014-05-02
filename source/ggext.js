function ggRemoveSpecific()
{
	var inputText = document.querySelector('input[name="q"]'); 
	if(inputText.value && inputText.value.indexOf('site:') >= 0) 
	{ 
		var keyword = inputText.value;
		keyword = keyword.replace(/ *site:[^ ]+/, '');

		inputText.value = keyword;

			setTimeout(function() {
				//var btn = document.querySelector('button[name="btnG"]'); 
				var btn = document.querySelector('form[action="/search"]');
				if(btn)
				{
					console.log('btnG click');
					btn.submit();
				} else {
					btn = document.querySelector('button[name="btnK"]'); 
					if(btn)
					{
						console.log('btnK click');
						btn.click();
					}
				}
			}, 100);
	}
}

function ggSetTimeRange(elemId)
{
	var timeLimit = document.querySelector( '#' + elemId + ' a');
	if(timeLimit)
	{
		timeLimit.click();
	}
}

function replaceAndSearch(kw, altKw, altAdd)
{
	var inputText = document.querySelector('input[name="q"]'); 
	if(inputText) 
	{ 
	   setTimeout(function() {

		var keyword = '' + inputText.value;
		if(kw.indexOf('site:') >= 0 && keyword.indexOf('site:') >= 0)
		{
			keyword = keyword.replace(/ *site:[^ ]+/, '');
			console.log('keyword: ' + keyword);
		}
		else if(keyword.indexOf(kw) >= 0)
			return;
		else if(altKw && keyword.indexOf(altKw) >= 0)
			return;

		kw = ' ' + kw;

		if(kw.indexOf('site:') >= 0)
		{
			inputText.value = keyword + ' ' + kw;

			setTimeout(function() {
				//var btn = document.querySelector('button[name="btnG"]'); 
				var btn = document.querySelector('form[action="/search"]');
				if(btn)
				{
					console.log('btnG click');
					btn.submit();
				} else {
					btn = document.querySelector('button[name="btnK"]'); 
					if(btn)
					{
						console.log('btnK click');
						btn.click();
					}
				}
			}, 100);
		}
		else
		{
			inputText.value = kw + ' ' + keyword;

			var strLength = ('' + inputText.value).length;
			inputText.setSelectionRange(strLength, strLength);
		}
	   }, 200);

	   setTimeout(function() {
	   	inputText.focus();
	   }, 100);

	};
};
