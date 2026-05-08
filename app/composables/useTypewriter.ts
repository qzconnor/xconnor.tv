export function useTypewriter(words: string[], options?: { speed?: number; deleteSpeed?: number; pause?: number }) {
  const { speed = 100, deleteSpeed = 60, pause = 2000 } = options || {}
  const displayText = ref('')
  const isDeleting = ref(false)
  const wordIndex = ref(0)
  const charIndex = ref(0)

  let timeout: ReturnType<typeof setTimeout>

  function tick() {
    const currentWord = words[wordIndex.value] ?? ''

    if (!isDeleting.value) {
      displayText.value = currentWord.substring(0, charIndex.value + 1)
      charIndex.value++
      if (charIndex.value === currentWord.length) {
        isDeleting.value = true
        timeout = setTimeout(tick, pause)
        return
      }
    } else {
      displayText.value = currentWord.substring(0, charIndex.value - 1)
      charIndex.value--
      if (charIndex.value === 0) {
        isDeleting.value = false
        wordIndex.value = (wordIndex.value + 1) % words.length
      }
    }

    timeout = setTimeout(tick, isDeleting.value ? deleteSpeed : speed)
  }

  onMounted(() => { timeout = setTimeout(tick, 500) })
  onUnmounted(() => clearTimeout(timeout))

  return { displayText }
}
