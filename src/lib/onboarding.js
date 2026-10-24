const KEY = 'heartwise.onboarded.v1'

// If storage is blocked, skip the intro instead of showing it on every load.
export function hasOnboarded() {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return true
  }
}

export function markOnboarded() {
  try {
    localStorage.setItem(KEY, '1')
  } catch {
    // storage blocked: the intro just shows again next time
  }
}
