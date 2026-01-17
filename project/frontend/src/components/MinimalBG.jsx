import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const MinimalBG = () => {
  const mountRef = useRef(null);
  const animationRef = useRef();
  const rendererRef = useRef();

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.offsetWidth;
    const height = mount.offsetHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 10;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // 3D Objects
    const shapes = [];
    const geometry = new THREE.IcosahedronGeometry(1, 0);

    const material1 = new THREE.MeshStandardMaterial({
      color: '#10B981',
      metalness: 0.1,
      roughness: 0.6,
    });
    const shape1 = new THREE.Mesh(geometry, material1);
    shape1.position.set(-2, 1, 0);
    shape1.scale.set(0.8, 0.8, 0.8);
    scene.add(shape1);
    shapes.push(shape1);

    const material2 = new THREE.MeshStandardMaterial({
      color: '#0E9F6E',
      metalness: 0.1,
      roughness: 0.4,
    });
    const shape2 = new THREE.Mesh(geometry, material2);
    shape2.position.set(2, -1, 0);
    shape2.scale.set(1.2, 1.2, 1.2);
    scene.add(shape2);
    shapes.push(shape2);

    const material3 = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      metalness: 0,
      roughness: 0.8,
    });
    const shape3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.6, 0.05, 100, 16), material3);
    shape3.position.set(3, 2, -2);
    shape3.scale.set(0.5, 0.5, 0.5);
    scene.add(shape3);
    shapes.push(shape3);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      shapes.forEach((shape, index) => {
        shape.rotation.x = elapsedTime * 0.1 * (index + 1);
        shape.rotation.y = elapsedTime * 0.15 * (index + 1);
      });
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mount) return;
      const w = mount.offsetWidth;
      const h = mount.offsetHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      while (mount.firstChild) mount.removeChild(mount.firstChild);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    />
  );
};

export default MinimalBG; 