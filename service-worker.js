const CACHE_NAME = "geocoach-julie-v1";

const ASSETS_TO_CACHE = [
    "./",
    "./index.html",

    "./css/style.css",
    "./js/app.js",

    "./data/questions.json",
    "./data/flashcards.json",

    "./manifest.json",

    "./assets/icon-192.png",
    "./assets/icon-512.png"
];

/*
 * Installation
 */
self.addEventListener("install", (event) => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then((cache) => {

                console.log("Cache initialisé");

                return cache.addAll(ASSETS_TO_CACHE);

            })

    );

    self.skipWaiting();

});


/*
 * Activation
 */
self.addEventListener("activate", (event) => {

    event.waitUntil(

        caches.keys()
            .then((keys) => {

                return Promise.all(

                    keys.map((key) => {

                        if (key !== CACHE_NAME) {

                            return caches.delete(key);

                        }

                    })

                );

            })

    );

    self.clients.claim();

});


/*
 * Requêtes
 */
self.addEventListener("fetch", (event) => {

    event.respondWith(

        caches.match(event.request)

            .then((cachedResponse) => {

                if (cachedResponse) {

                    return cachedResponse;

                }

                return fetch(event.request)

                    .then((networkResponse) => {

                        if (
                            !networkResponse ||
                            networkResponse.status !== 200 ||
                            networkResponse.type !== "basic"
                        ) {
                            return networkResponse;
                        }

                        const responseClone =
                            networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {

                                cache.put(
                                    event.request,
                                    responseClone
                                );

                            });

                        return networkResponse;

                    })

                    .catch(() => {

                        if (
                            event.request.mode === "navigate"
                        ) {

                            return caches.match(
                                "./index.html"
                            );

                        }

                    });

            })

    );

});


/*
 * Message de mise à jour
 */
self.addEventListener("message", (event) => {

    if (
        event.data &&
        event.data.type === "SKIP_WAITING"
    ) {

        self.skipWaiting();

    }

});