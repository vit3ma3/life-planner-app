// Подключается в service worker (workbox importScripts): нажатие на напоминание открывает
// приложение на нужном экране. Если окно уже открыто — переключает его, иначе открывает новое.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const link = (event.notification.data && event.notification.data.link) || ''
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      const client = windows.find((c) => c.url.startsWith(self.registration.scope))
      if (client) {
        await client.focus()
        client.postMessage({ type: 'open-link', link })
        return
      }
      const url = new URL(self.registration.scope)
      url.hash = link
      await self.clients.openWindow(url.href)
    })(),
  )
})
