import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function CasinoBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x060606, 0.045)

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    )
    camera.position.z = 10

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambient)
    const dir = new THREE.DirectionalLight(0xff3344, 1.2)
    dir.position.set(5, 8, 6)
    scene.add(dir)
    const dir2 = new THREE.DirectionalLight(0xf59e0b, 0.7)
    dir2.position.set(-6, -3, 4)
    scene.add(dir2)

    const chips: Array<{
      mesh: THREE.Mesh
      rot: THREE.Vector3
      drift: THREE.Vector3
    }> = []

    const chipColors = [0xdc2626, 0xf59e0b, 0x111111, 0x7f1d1d, 0xefefef]
    const chipGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.14, 48, 1)
    chipGeo.rotateX(Math.PI / 2)

    for (let i = 0; i < 22; i++) {
      const color = chipColors[i % chipColors.length]
      const mat = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.45,
        roughness: 0.35,
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.08,
      })
      const mesh = new THREE.Mesh(chipGeo, mat)
      mesh.position.set(
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 14 - 4,
      )
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      )
      const scale = 0.6 + Math.random() * 0.8
      mesh.scale.setScalar(scale)
      scene.add(mesh)
      chips.push({
        mesh,
        rot: new THREE.Vector3(
          (Math.random() - 0.5) * 0.012,
          (Math.random() - 0.5) * 0.012,
          (Math.random() - 0.5) * 0.012,
        ),
        drift: new THREE.Vector3(
          (Math.random() - 0.5) * 0.004,
          (Math.random() - 0.5) * 0.004,
          0,
        ),
      })
    }

    const sparkGeo = new THREE.BufferGeometry()
    const sparkCount = 220
    const positions = new Float32Array(sparkCount * 3)
    for (let i = 0; i < sparkCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 4
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const sparkMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    })
    const sparks = new THREE.Points(sparkGeo, sparkMat)
    scene.add(sparks)

    let mouseX = 0
    let mouseY = 0
    const onMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 1.4
      mouseY = (e.clientY / window.innerHeight - 0.5) * 1.0
    }
    window.addEventListener('mousemove', onMove)

    const onResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', onResize)

    let raf = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      for (const c of chips) {
        c.mesh.rotation.x += c.rot.x
        c.mesh.rotation.y += c.rot.y
        c.mesh.rotation.z += c.rot.z
        c.mesh.position.x += c.drift.x
        c.mesh.position.y += c.drift.y
        if (c.mesh.position.x > 12) c.mesh.position.x = -12
        if (c.mesh.position.x < -12) c.mesh.position.x = 12
        if (c.mesh.position.y > 8) c.mesh.position.y = -8
        if (c.mesh.position.y < -8) c.mesh.position.y = 8
      }
      sparks.rotation.y += 0.0007
      sparks.rotation.x += 0.0003
      camera.position.x += (mouseX - camera.position.x) * 0.03
      camera.position.y += (-mouseY - camera.position.y) * 0.03
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      container.removeChild(renderer.domElement)
      chipGeo.dispose()
      sparkGeo.dispose()
      sparkMat.dispose()
      chips.forEach((c) => (c.mesh.material as THREE.Material).dispose())
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-60"
    />
  )
}
