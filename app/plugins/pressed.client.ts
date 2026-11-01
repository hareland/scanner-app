/**
 * WebKit on iOS only applies `:active` while a touch listener is registered, so without this the pressed states Nuxt UI
 * already styles (`active:bg-*` on buttons and menu items) never show on a phone.
 */
export default defineNuxtPlugin(() => {
  document.addEventListener('touchstart', () => {}, { passive: true })
})
