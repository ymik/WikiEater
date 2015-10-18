(function (pluginName){
	new adriver.Plugin(pluginName);

	adriver.extendL = function(l, r){for(var i in l){if(l.hasOwnProperty(i) && r.hasOwnProperty(i)) l[i] = r[i]}; return l}

	adriver.toQueryString = function(o, delimiter, assign){
		delimiter = delimiter || "&";
		assign = assign || "=";
		var l = [];
		for (var i in o){if(o.hasOwnProperty(i)) l.push(i + assign + escape(o[i]))}
		return l.join(delimiter)
	}

	adriver.parseJSON = function(text){
		var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
		if(cx.test(text)){text = text.replace(cx, function(a){return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)})}
		if(!(/^\s*\{.*\}\s*$/).test(text)) text = "{" + text + "}";
		text = text.replace(/'/g,"\"");

		try{
			return /^[\],:{}\s]*$/.
				test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").
				replace(/\w+(?=\s+|,|}|:)|"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").
				replace(/(?:^|:|,)(?:\s*\[)+/g, "")) ? eval("(" + text + ")") : {};
		}
		catch(e){}

		return {}
	}

	adriver.request = function(req){
		var def = adriver.toQueryString(adriver.defaults);
		adriver.loadScript(adriver.redirectHost + '/cgi-bin/merle.cgi?rnd=![rnd]' + (def ? '&' + def : '') + (req ? '&' + req : ''));
	}

	adriver.prototype.init = function(){
		var _ = this, p = _.p,
			prm = adriver.parseJSON(p.getAttribute('data-Adriver') || p.title || '');
		p.title = "";

		_.reqPrm = {sid: 0, ad: 0, pid: 0, bid: 0, bn: 0, bt: 0, pz: 0, rnd: 0, sz: '', ph: '', keyword: '', custom: '', pass: ''};

		adriver.extend(_.prm, {defer: _.defer}, prm);
		adriver.extendL(_.reqPrm, _.prm);

		_.reqPrm.custom = adriver.toQueryString(_.prm.custom, ';');

		for (var i in _.reqPrm) if (!_.reqPrm[i]) delete _.reqPrm[i];

		_.className = p.className.match(/\w+\b/);

		adriver.onDomReady(function(){_.domReady()});
		if (!_.prm.defer) _.load();
	}
	adriver.prototype.load = function(){
		try {
			if(!this.isLoading){
				this.isLoading = 1;
				adriver.request(adriver.toQueryString(this.reqPrm||this.prm));
			}
		}catch(e){}
		return this
	}
	adriver.prototype.reload = function(){
		this.isLoading = 0;
		this.load();
		return this
	}
	adriver.prototype.loadComplete = function(){
		this.isLoading = 2;
		this.loadCompleteQueue.execute();
		return this;
	}
	adriver.prototype.domReady = function(){
		this.domReadyQueue.execute();
		return this;
	}

	new adriver.Plugin.require("old.adriver").onLoadComplete(function(){
		adriver.Plugin(pluginName).loadComplete();
	});
})("autoUpdate.adriver");