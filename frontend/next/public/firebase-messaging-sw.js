importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Firebase設定はアプリからpostMessageで受け取る
let firebaseConfig = null;

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'FIREBASE_CONFIG') {
        firebaseConfig = event.data.config;
        initializeFirebase();
    }
});

function initializeFirebase() {
    if (!firebaseConfig) {
        return;
    }

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
        console.log('Received background message:', payload);

        const notificationTitle = payload.notification?.title || '新しい通知';
        const notificationOptions = {
            body: payload.notification?.body || '',
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png',
            data: payload.data,
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
    });
}

self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event);

    event.notification.close();

    const data = event.notification.data;
    let url = '/';

    if (data) {
        switch (data.type) {
            case 'review_like':
                if (data.review_id) {
                    url = `/locations/${data.review_id}`;
                }
                break;
            default:
                url = '/';
        }
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.focus();
                    client.navigate(url);
                    return;
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
