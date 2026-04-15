"use client";

import * as THREE from 'three'
import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Image, Environment, useTexture } from '@react-three/drei'
import { easing } from 'maath'
import './utils'

export default function ServiceCarousel3D() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative" style={{ touchAction: 'none' }}>
      <Canvas camera={{ position: [0, 0, 100], fov: 15 }} className="fade-in-canvas">
        <fog attach="fog" args={['#B8CDD1', 8.5, 12]} />
        <Rig rotation={[0, 0, 0.15]}>
          <Carousel />
        </Rig>
        <Banner position={[0, -0.15, 0]} />
        {/* Adjusted environment preset for better match with overall theme */}
        <Environment preset="city" background={false} />
      </Canvas>
    </div>
  )
}

function Rig(props: any) {
  const ref = useRef<any>(null)
  
  // Référence pour garder une trace de la rotation continue
  const autoRotate = useRef(0)

  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Calculer la rotation automatique (défilement continu)
    autoRotate.current -= delta * 0.15;
    
    // Combiner la rotation continue avec l'influence de la souris
    const targetRotation = autoRotate.current - (state.pointer?.x || 0) * Math.PI;
    
    // Appliquer la rotation combinée avec un adoucissement (easing)
    easing.damp(ref.current.rotation, 'y', targetRotation, 0.25, delta)
    
    // Raycasts every frame rather than on pointer-move
    if (state.events && typeof state.events.update === 'function') {
      state.events.update()
    }
    easing.damp3(state.camera.position, [-(state.pointer?.x || 0) * 2, (state.pointer?.y || 0) + 1.5, 12], 0.3, delta) // Move camera further back to reduce size
    state.camera.lookAt(0, 0, 0) // Look at center
  })
  return <group ref={ref} {...props} />
}

function Carousel({ radius = 1.4, count = 8 }) {
  const images = [
    '/1.jpg',
    '/2.jpg',
    '/3.jpg',
    '/4.png',
    '/5.jpg',
    '/6.jpg'
  ];

  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const url = i < images.length ? images[i] : '/2.jpg';
        return (
          <Card
            key={i}
            url={url}
            position={[Math.sin((i / count) * Math.PI * 2) * radius, 0, Math.cos((i / count) * Math.PI * 2) * radius]}
            rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
          />
        )
      })}
    </>
  )
}

function Card({ url, ...props }: any) {
  const ref = useRef<any>(null)
  const [hovered, hover] = useState(false)
  const pointerOver = (e: any) => (e.stopPropagation(), hover(true))
  const pointerOut = () => hover(false)
  useFrame((state, delta) => {
    if (!ref.current) return;
    easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta)
    easing.damp(ref.current.material, 'radius', hovered ? 0.25 : 0.1, 0.2, delta)
    easing.damp(ref.current.material, 'zoom', hovered ? 1 : 1.5, 0.2, delta)
  })
  return (
    <Image ref={ref} url={url} transparent side={THREE.DoubleSide} onPointerOver={pointerOver} onPointerOut={pointerOut} {...props}>
      {/* @ts-ignore */}
      <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
    </Image>
  )
}

function Banner(props: any) {
  const ref = useRef<any>(null)
  
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (ctx) {
      canvas.height = 128
      
      // Configuration initiale pour mesurer proprement le texte
      ctx.font = '900 60px "Inter", "Helvetica Neue", sans-serif'
      const baseText = "M3ALLAM CONNECT     ✦     "
      const textWidth = Math.ceil(ctx.measureText(baseText).width)
      
      // On ajuste le canvas exactement à la largeur d'UN SEUL motif
      canvas.width = textWidth
      
      // Le changement de dimension réinitialise le contexte, on doit redéfinir le style
      ctx.font = '900 60px "Inter", "Helvetica Neue", sans-serif'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      
      // Fond blanc
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Créer un gradient pour le texte avec les couleurs M3allam
      const gradient = ctx.createLinearGradient(0, 0, textWidth, 0)
      gradient.addColorStop(0, '#0B3B24') // Vert foncé M3allam
      gradient.addColorStop(1, '#4A8B71') // Vert clair M3allam
      
      // Texte avec gradient M3allam
      ctx.fillStyle = gradient
      ctx.fillText(baseText, 0, canvas.height / 2 + 2)
    }
    
    // Création de la texture avec répétition
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    
    // Le canvas contient désormais UN motif parfait sans coupure.
    // On le répète 10 fois autour du cylindre.
    tex.repeat.set(10, 1) 
    tex.anisotropy = 16
    return tex
  }, [])

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.15;
    }
  })

  return (
    <mesh ref={ref} {...props}>
      <cylinderGeometry args={[1.65, 1.65, 0.15, 64, 1, true]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} fog={false} />
    </mesh>
  )
}
