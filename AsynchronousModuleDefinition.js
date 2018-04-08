/*
 * 2018年4月8日 by Hkk
 * 浏览器异步模块
 **/
! function(G) {
	// body...
	var moduleCache = {},
		loadModule = function(modName, cb) {
			// body...
			var _module;
			if (moduleCache[modName]) {
				_module = moduleCache[modName];
			} else {
				moduleCache[modName] = {
					moduleName: modName,
					status: 'ing',
					exports: null,
					onload: [cb]
				}; 
				loadScript(getUrl(modName));
			}
		},
		getUrl = function(modName) {
			// body...
			return String(modName).replace(/\.js$/g, '') + '.js';
		},
		loadScript = function(src) {
			var _script = document.creatElement('script');
			_script.type = 'text/javascript';
			_script.charsrt = 'utf-8';
			_script.async = true;
			_script.src = src;
			document.getElementsByTagName('head')[0].appendChild(_script);
		},
		setModule = function(modName, params, cb) {
			var _module, fn;
			if (moduleCache[modName]) {
				_module = moduleCache[modName];
				_module.status = 'ed';
				_module.exports = cb ? cb.apply(_module, params) : null;
				while (fn = _module.onload.shift()) {
					fn(_module.exports);
				}
			} else {
				cb && cb.apply(null, params);
			}
		}

	//url:modID
	//modDeps
	//modCb: mod construction
	G.module = function(url, modDeps, modCb) {
		var args = [].slice.call(arguments),
			cb = args.pop(),
			deps = (args.length && args[args.length - 1] instanceof Array) ? args.pop() : [],
			url = args.pop(),
			params = [],
			depsCount = 0,
			i = 0,
			len;
		if (len = deps.length) {
			while (i < len) {
				(function(I) {
					depsCount++;
					loadModule(deps[I], function(mod) {
						params[I] = mod;
						depsCount--;
						if (depsCount === 0) {
							setModule(url, params, cb);
						}
					})
				}(i));
				i++;
			}
		} else {
			setModule(url, [], cb);
		}
	}
}((function() {
	return window.G = {}
}()))