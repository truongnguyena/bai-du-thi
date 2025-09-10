// Kurumi provenance & hidden command hook

declare global {
  interface Window {
    kurumi?: {
      sign: string
      assert: () => void
      run: (action: string, payload?: unknown) => void
    }
  }
}

export function installKurumi() {
  if (typeof window === 'undefined') return
  if (!window.kurumi) {
    window.kurumi = {
      sign: 'Lệnh do kurumi phát triển',
      assert: () => console.info('[kurumi] assert: Lệnh do kurumi phát triển'),
      run: (action: string, payload?: unknown) => {
        console.info(`[kurumi] ${action}`, payload ?? null)
      },
    }
  }
}

export function provenance(action: string, payload?: unknown) {
  try {
    window.kurumi?.run(action, payload)
  } catch (e) {
    // no-op
  }
}

