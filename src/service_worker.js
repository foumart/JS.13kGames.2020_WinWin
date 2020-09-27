/* To force update on all clients you have to change the version number.
   Keep in mind that browsers consider the service worker updated only
   if it is byte-different and changing a single digit is not enough..
   Just type a random string here to ensure update: qweqweqhdfhdfh
*/

var version = "JS13k_0.92";
var debug;
//var logfetches;
var name = "[SW] "+version+": ";

if (debug) console.log(name+"%cService Worker script initialized", "color:#3333cc");

/* The install event fires when the service worker is first installed.
   You can use this event to prepare the service worker to be able to serve
   files while visitors are offline.
*/
self.addEventListener("install", (event) => {
	if (debug) console.log(name+"%cInstalling", "color:#3399cc");

	/* In an update process when a new service worker is installed it will wait for the opportunity
	   to become activated. The outdated but currently active worker must be released first and this
	   happens only if the user navigates away from the page, or a specified period of time has passed.
	   It can be also triggered manually by calling self.skipWaiting()
	*/
	self.skipWaiting();

	event.waitUntil(
		/* The caches built-in is a promise-based API that helps you cache responses,
		   as well as finding and deleting them.
		*/
		caches.open(version).then((cache) => {
			/* After the cache is opened, it is filled with the resources needed for
			   the offline functioning of the app.
			*/
			return cache.addAll(
				[
					"index.html", "icon_224.png"
				]
			);
		}).then(() => {
			if(debug) console.log(name+"%cInstall complete", "color:#339933");
		})
	);
});


/* The activate event fires after a service worker has been successfully installed.
   It is most useful when phasing out an older version of a service worker, as at
   this point you know that the new worker was installed correctly.
   Old caches that don't match the version of the newly installed worker are deleted.
*/
self.addEventListener("activate", (event) => {
	/* Just like with the install event, event.waitUntil blocks activate on a promise.
	   Activation will fail unless the promise is fulfilled.
	*/
	if(debug) console.log(name+"%cActivate version: " + version, "color:#3333cc");

	event.waitUntil(
		// This method returns a promise which will resolve to an array of available cache keys.
		caches.keys().then((cacheNames) => {
			// Return a promise that settles when all outdated caches are deleted.
			return Promise.all(
				cacheNames.filter((cacheName) => {
					if(cacheName != version){
						if(debug) console.log(name+"%cDelete Cache ("+cacheName+")", "color:#cc3333");
						return true;
					}
				}).map((cacheName) => {
					return caches.delete(cacheName);
				})
			);
		}).then(() => {
			if(debug) console.log(name+"%cClaiming clients for version: "+version, "color:#3333cc");
			return self.clients.claim();
		})
	);
});


/* The fetch event fires whenever a page controlled by this service worker requests
   a resource. This isn't limited to 'fetch' or even XMLHttpRequest. Instead, it
   comprehends even the request for the HTML page on first load, as well as JS and
   CSS resources, fonts, any images, etc.
*/
self.addEventListener("fetch", (event) => {
	if (event.request.url == self.registration.scope) {
		//if (debug && logfetches) console.log(name+"%cFetch (bypass) " + event.request.url, "color:grey");
		return;
	}
	var request = event.request;
	var options = {};
	event.respondWith(
		caches.match(request, options).then((cached) => {
			//var report;
			var synonym = event.request.url == request.url;
			/*if (logfetches) {
				if(cached) console.log(name+"%cFetch ("+(synonym?"resolve":"cached")+") "+event.request.url, "color:grey");
				else report = [name+"%cFetch ("+(synonym?"resolve":"request")+") "+event.request.url, "color:grey"];
			}*/
			return cached || fetch(event.request).then((response) => {
				var cacheCopy = response.clone();
				caches.open(version).then((cache) => {
					//if (logfetches) console.log(name+"%cFetch "+event.request.url, "color:#3333cc");
					//report = null;
					return cache.put(event.request, cacheCopy);
				});
				//if(report) console.log(report[0], report[1]);
				return response;
			});
		})
	);
});

/*
   Service Worker by Noncho Savov
   email: inthewoodsbg@gmail.com
   https://www.FoumartGames.com
*/
