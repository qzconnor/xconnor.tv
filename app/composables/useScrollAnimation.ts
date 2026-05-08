export function useScrollAnimation() {
  onMounted(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            io.unobserve(entry.target)
          }
        })
      },
      // threshold 0.05 = barely visible; no negative rootMargin so cards don't need to be well above the fold
      { threshold: 0.05 }
    )

    function observeNew() {
      document.querySelectorAll('[data-animate]:not(.in-view)').forEach(el => io.observe(el))
    }

    // Observe elements present at mount
    observeNew()

    // Watch for elements added later (v-for re-renders, filter switches, async data)
    const mo = new MutationObserver(observeNew)
    mo.observe(document.body, { childList: true, subtree: true })

    onUnmounted(() => {
      io.disconnect()
      mo.disconnect()
    })
  })
}
