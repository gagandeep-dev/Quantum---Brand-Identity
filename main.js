import * as THREE from './vendor/three.module.js'; // or three.min.js depending on packaging
import { gsap } from './vendor/gsap.min.js';
import ScrollTrigger from './vendor/ScrollTrigger.min.js';

gsap.registerPlugin(ScrollTrigger);

// Respect reduced motion
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Simple Three.js energy sphere (lightweight)
function initThreeHero() {
  if (reduceMotion) return; // skip for reduced motion users
  const canvas = document.getElementById('heroCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / 500, 0.1, 1000);
  camera.position.z = 3;

  // geometry: low-poly icosahedron with subtle emissive material
  const geo = new THREE.IcosahedronGeometry(1.0, 3); // keep polycount low
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#E50914'),
    metalness: 0.6,
    roughness: 0.4,
    emissive: new THREE.Color('#3a0000'),
    emissiveIntensity: 0.7,
    flatShading: true
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  // soft lights
  const light = new THREE.DirectionalLight(0xffffff, 1.0);
  light.position.set(5, 5, 5);
  scene.add(light);
  const amb = new THREE.AmbientLight(0x111111);
  scene.add(amb);

  function resize() {
    const width = canvas.clientWidth || window.innerWidth;
    const height = 500; // fixed hero height; adapt per CSS
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  // gentle rotation using GSAP ticker for sync
  gsap.ticker.add(() => {
    mesh.rotation.y += 0.003;
    mesh.rotation.x += 0.0015;
    renderer.render(scene, camera);
  });
}

// GSAP reveals
function initAnimations() {
  // Hero text intro
  gsap.from('.hero-title', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' });
  gsap.from('.hero-lead', { y: 20, opacity: 0, duration: 0.9, delay: 0.1, ease: 'power3.out' });
  gsap.from('.hero-cta a', { y: 12, opacity: 0, duration: 0.7, delay: 0.25, stagger: 0.08 });

  // Section reveals
  const sections = document.querySelectorAll('main .section');
  sections.forEach(sec => {
    gsap.from(sec, {
      scrollTrigger: {
        trigger: sec,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 20, opacity: 0, duration: 0.8, ease: 'power2.out'
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initThreeHero();
  initAnimations();
});
