import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function LoadingScreen({ label = 'Loading' }: { label?: string }) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const w = container.clientWidth
    const h = container.clientHeight
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
    camera.position.z = 5
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambient)
    const dir = new THREE.PointLight(0xff3344, 2.5, 18)
    dir.position.set(2, 2, 4)
    scene.add(dir)
    const dir2 = new THREE.PointLight(0xf59e0b, 1.6, 18)
    dir2.position.set(-3, -2, 3)
    scene.add(dir2)

    const group = new THREE.Group()
    scene.add(group)

    const chipGeo = new THREE.CylinderGeometry(1, 1, 0.22, 64)
    chipGeo.rotateX(Math.PI / 2)
    const chipMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      metalness: 0.5,
      roughness: 0.3,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.4,
    })
    const chip = new THREE.Mesh(chipGeo, chipMat)
    group.add(chip)

    const ringGeo = new THREE.TorusGeometry(1.05, 0.04, 16, 80)
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.6,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    group.add(ring)

    const pipsCount = 8
    for (let i = 0; i < pipsCount; i++) {
      const a = (i / pipsCount) * Math.PI * 2
      const pip = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 16, 16),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0xffffff,
          emissiveIntensity: 0.4,
        }),
      )
      pip.position.set(Math.cos(a) * 0.78, Math.sin(a) * 0.78, 0.13)
      group.add(pip)
    }

    let raf = 0
    const start = performance.now()
    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = (performance.now() - start) / 1000
      group.rotation.y = t * 1.6
      group.rotation.x = Math.sin(t * 0.8) * 0.3
      ring.rotation.z = -t * 2
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      if (!container) return
      const cw = container.clientWidth
      const ch = container.clientHeight
      camera.aspect = cw / ch
      camera.updateProjectionMatrix()
      renderer.setSize(cw, ch)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      container.removeChild(renderer.domElement)
      chipGeo.dispose()
      chipMat.dispose()
      ringGeo.dispose()
      ringMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-black via-[#0a0303] to-black">
      <div ref={ref} className="h-48 w-48" />
      <div className="mt-2 flex items-center gap-2">
        <span className="display-title text-sm font-bold uppercase tracking-[0.4em] text-red-400">
          {label}
        </span>
        <span className="loading-dots flex gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-red-500 [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-yellow-400 [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-red-500" />
        </span>
      </div>
    </div>
  )
}
