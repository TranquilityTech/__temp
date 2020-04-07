// https://github.com/Troland/how-javascript-works/blob/master/push-notifications.md
const publicVapidKey = "BKhn1c1rb9L-h9Ztiq-Fp8ndg0WguDIWDtIYsJ9rIqClVXgvT5h0ipA29f6dTjuTkzENKqDKSgYfN9_bX-fX_2o";

// Check for service worker
if ("serviceWorker" in navigator) {
    webNotificationSend().catch(err => console.error(err));
}

// Register SW, Register Push, webNotificationSend Push
async function webNotificationSend() {
    // Register Service Worker
    const register = await navigator.serviceWorker.register("/worker.js");

    // Register Push
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });

    // webNotificationSend Push Notification
    await fetch("/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            "content-type": "application/json",
            "CSRF-Token": $STATE.csrfToken
        },
        "withCredentials": true
    });
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}
