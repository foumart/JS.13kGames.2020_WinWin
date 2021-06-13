// register ServiceWorker
var debug = true;

window.addEventListener("load", registerSW);

function registerSW(e){
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.getRegistrations().then((registrations) => {
			let isRegistered;
			for(let i = 0; i < registrations.length; i++) {
				if (window.location.href.indexOf(registrations[i].scope) > -1) isRegistered = true;
			}
			if (isRegistered) {
				if (debug) console.log("ServiceWorker already registered");
			} else {
				navigator.serviceWorker.register("service_worker.js", {updateViaCache: "none"}).then(() => {
					if (debug) console.log("ServiceWorker registered successfully");
				}).catch(() => {
					if (debug) console.log("ServiceWorker registration failed");
					init();
				});
			}
		}).catch(() => {
			if (debug) console.log("ServiceWorker bypassed locally");
			init();
		});
		navigator.serviceWorker.ready.then(() => {
			if (debug) console.log('ServiceWorker is now active');
			init();
		});
	} else {
		if (debug) console.log("ServiceWorker not found in navigator");
		init();
	}
}
