import * as THREE from 'three';
import gsap from 'gsap';

// ========================================
// 1. PRELOADER & INIT
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  // Hide preloader after a small delay
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('loaded');
    
    // Trigger initial hero animations
    initHeroAnimations();
  }, 1000);

  initTypingEffect();
  initCustomCursor();
  initNavigation();
  initTheme();
  initScrollAnimations();
  initThreeJSBackground();
  initCountingStats();
  initInteractiveAnimations();
});

// ========================================
// 1.7. INTERACTIVE ANIMATIONS
// ========================================
function initInteractiveAnimations() {
  // Project Card Tilt & Glow Effect
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        scale: 1.02,
        duration: 0.5,
        ease: "power2.out"
      });
      
      const glow = card.querySelector('.project-card-glow');
      if (glow) {
        gsap.to(glow, {
          x: x - 100,
          y: y - 100,
          opacity: 1,
          duration: 0.3
        });
      }
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.5,
        ease: "power2.out"
      });
      
      const glow = card.querySelector('.project-card-glow');
      if (glow) {
        gsap.to(glow, {
          opacity: 0,
          duration: 0.5
        });
      }
    });
  });

  // Skill Tags Floating Animation
  const skillTags = document.querySelectorAll('.skill-tag');
  skillTags.forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      gsap.to(tag, {
        y: -5,
        scale: 1.1,
        backgroundColor: "var(--accent-1)",
        color: "#fff",
        duration: 0.3,
        ease: "back.out(1.7)"
      });
    });
    
    tag.addEventListener('mouseleave', () => {
      gsap.to(tag, {
        y: 0,
        scale: 1,
        backgroundColor: "var(--bg-glass)",
        color: "var(--text-primary)",
        duration: 0.3,
        ease: "power2.out"
      });
    });
  });

  // Nav Logo Animation
  const navLogo = document.querySelector('.nav-logo');
  if (navLogo) {
    navLogo.addEventListener('mouseenter', () => {
      gsap.to('.logo-bracket', {
        x: (i) => i === 0 ? -5 : 5,
        duration: 0.3,
        stagger: 0.1,
        ease: "power2.out"
      });
    });
    navLogo.addEventListener('mouseleave', () => {
      gsap.to('.logo-bracket', {
        x: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  }
}

// ========================================
// 1.5. THEME MANAGEMENT
// ========================================
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  
  // 1. Check current time for automatic theme
  const checkTimeTheme = () => {
    const hour = new Date().getHours();
    const isDayTime = hour >= 6 && hour < 18;
    
    if (isDayTime) {
      body.classList.add('light-theme');
    } else {
      body.classList.remove('light-theme');
    }
    
    // Dispatch custom event for Three.js background
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isLight: isDayTime } }));
  };

  // 2. Initial check
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light-theme');
  } else if (savedTheme === 'dark') {
    body.classList.remove('light-theme');
  } else {
    checkTimeTheme();
  }

  // 3. Manual toggle
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    
    // Dispatch custom event for Three.js background
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isLight: isLight } }));
  });
}

// ========================================
// 2. HERO ANIMATIONS
// ========================================
function initHeroAnimations() {
  const heroElements = document.querySelectorAll('#hero [data-animate="fade-up"]');
  const scrollIndicator = document.querySelector('.hero-scroll-indicator');
  
  heroElements.forEach(el => {
    const delay = parseFloat(el.getAttribute('data-delay') || 0);
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 1,
      delay: delay,
      ease: "power3.out"
    });
  });

  // Hide scroll indicator on mouse move or scroll
  if (scrollIndicator) {
    const hideScrollIndicator = () => {
      gsap.to(scrollIndicator, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          scrollIndicator.style.display = 'none';
        }
      });
      window.removeEventListener('mousemove', hideScrollIndicator);
      window.removeEventListener('scroll', hideScrollIndicator);
    };

    window.addEventListener('mousemove', hideScrollIndicator);
    window.addEventListener('scroll', hideScrollIndicator);
  }
}

function initTypingEffect() {
  const roles = [
    "Software Developer",
    "AI & ML Enthusiast",
    "Full-Stack Engineer",
    "Problem Solver"
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;
  let erasingDelay = 50;
  let newTextDelay = 2000;
  
  const typedSpan = document.getElementById('typed-role');
  
  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typedSpan.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedSpan.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }
    
    let typeSpeed = isDeleting ? erasingDelay : typingDelay;
    
    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = newTextDelay;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 500;
    }
    
    setTimeout(type, typeSpeed);
  }
  
  if (typedSpan) {
    setTimeout(type, 1500); // Start after preloader
  }
}

// ========================================
// 3. CUSTOM CURSOR
// ========================================
function initCustomCursor() {
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  
  // Follow mouse movement
  window.addEventListener('mousemove', (e) => {
    // Dot follows exactly
    gsap.to(cursorDot, {
      x: e.clientX - 3,
      y: e.clientY - 3,
      duration: 0.1,
      ease: "power2.out"
    });
    
    // Ring follows with slight lag
    gsap.to(cursorRing, {
      x: e.clientX - 18,
      y: e.clientY - 18,
      duration: 0.3,
      ease: "power2.out"
    });
  });
  
  // Hover effects on interactive elements
  const interactives = document.querySelectorAll('a, button, .project-card, .skill-tag, .timeline-content');
  
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.classList.remove('hovering');
    });
  });
  
  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
  });
}

// ========================================
// 4. NAVIGATION & SCROLL EVENTS
// ========================================
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollProgress = document.getElementById('scroll-progress');
  
  // Navbar scroll effect & scroll progress bar
  window.addEventListener('scroll', () => {
    // Navbar styling
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Scroll progress indicator
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgress.style.width = scrolled + "%";
    
    // Highlight active section link
    updateActiveLink();
  });
  
  // Mobile Menu Toggle
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    
    if (mobileMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  // Mobile Links Click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // Active Link logic
  function updateActiveLink() {
    const sections = document.querySelectorAll('.section, #hero');
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  }
}

// ========================================
// 5. SCROLL ANIMATIONS (Intersection Observer)
// ========================================
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]:not(#hero [data-animate])');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.getAttribute('data-delay') || 0);
        const animationType = el.getAttribute('data-animate');
        
        setTimeout(() => {
          el.classList.add('visible');
        }, delay * 1000);
        
        observer.unobserve(el);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(el => {
    observer.observe(el);
  });
}

// ========================================
// 6. COUNTING STATS ANIMATION
// ========================================
function initCountingStats() {
  const stats = document.querySelectorAll('.stat-number');
  let hasCounted = false;

  const startCounting = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasCounted) {
        hasCounted = true;
        stats.forEach(stat => {
          const target = parseFloat(stat.getAttribute('data-count'));
          const duration = 2000; // ms
          const isFloat = target % 1 !== 0; // Check if float like 8.72
          
          gsap.to(stat, {
            innerHTML: target,
            duration: duration / 1000,
            ease: "power2.out",
            snap: isFloat ? { innerHTML: 0.01 } : { innerHTML: 1 },
            onUpdate: function() {
              if (isFloat) {
                // Ensure float format
                stat.innerHTML = parseFloat(this.targets()[0].innerHTML).toFixed(2);
              } else {
                stat.innerHTML = Math.ceil(this.targets()[0].innerHTML);
              }
            }
          });
        });
        observer.disconnect();
      }
    });
  };

  const statSectionObj = new IntersectionObserver(startCounting, { threshold: 0.5 });
  const heroSection = document.getElementById('hero');
  if(heroSection) {
    statSectionObj.observe(heroSection);
  }
}


// ========================================
// 7. THREE.JS 3D BACKGROUND
// ========================================
function initThreeJSBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  // Scene setup
  const scene = new THREE.Scene();
  
  // Theme colors
  const themes = {
    dark: {
      bg: 0x050510,
      particles: ['#6c5ce7', '#a855f7', '#06b6d4'],
      shapes: [0x6c5ce7, 0x06b6d4],
      fog: 0x050510
    },
    light: {
      bg: 0xf8fafc,
      particles: ['#4f46e5', '#8b5cf6', '#0ea5e9'],
      shapes: [0x4f46e5, 0x0ea5e9],
      fog: 0xf8fafc
    }
  };

  let currentTheme = document.body.classList.contains('light-theme') ? themes.light : themes.dark;

  // Enable local fog for depth
  scene.fog = new THREE.FogExp2(currentTheme.fog, 0.002);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true,
    antialias: true 
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // --- Particle System ---
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1500;
  
  const posArray = new Float32Array(particlesCount * 3);
  const colorArray = new Float32Array(particlesCount * 3);
  const sizeArray = new Float32Array(particlesCount);
  
  // Colors for particles (brand gradients)
  const colorPalette = currentTheme.particles.map(c => new THREE.Color(c));

  for(let i = 0; i < particlesCount * 3; i+=3) {
    // Spread widely
    posArray[i] = (Math.random() - 0.5) * 150;     // x
    posArray[i+1] = (Math.random() - 0.5) * 150;   // y
    posArray[i+2] = (Math.random() - 0.5) * 100;   // z

    // Assign random color from palette
    const randColor = Math.random();
    let particleColor;
    if (randColor < 0.33) particleColor = colorPalette[0];
    else if (randColor < 0.66) particleColor = colorPalette[1];
    else particleColor = colorPalette[2];

    colorArray[i] = particleColor.r;
    colorArray[i+1] = particleColor.g;
    colorArray[i+2] = particleColor.b;
    
    // Varying sizes
    sizeArray[i/3] = Math.random() * 2;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
  
  // Modern points material
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: currentTheme === themes.light ? 0.3 : 0.6,
    sizeAttenuation: true,
    blending: currentTheme === themes.light ? THREE.NormalBlending : THREE.AdditiveBlending
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // --- Abstract Geometry (Wireframe Icosahedron) ---
  const shapeGeometry = new THREE.IcosahedronGeometry(12, 1);
  const shapeMaterial = new THREE.MeshBasicMaterial({
    color: currentTheme.shapes[0],
    wireframe: true,
    transparent: true,
    opacity: currentTheme === themes.light ? 0.08 : 0.05
  });
  const shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
  shapeMesh.position.set(15, 0, -20);
  scene.add(shapeMesh);
  
  const shapeGeometry2 = new THREE.OctahedronGeometry(8, 0);
  const shapeMaterial2 = new THREE.MeshBasicMaterial({
    color: currentTheme.shapes[1],
    wireframe: true,
    transparent: true,
    opacity: currentTheme === themes.light ? 0.05 : 0.03
  });
  const shapeMesh2 = new THREE.Mesh(shapeGeometry2, shapeMaterial2);
  shapeMesh2.position.set(-20, 10, -30);
  scene.add(shapeMesh2);

  // --- Theme Change Listener ---
  window.addEventListener('themeChanged', (e) => {
    const isLight = e.detail.isLight;
    currentTheme = isLight ? themes.light : themes.dark;
    
    // Update Fog
    scene.fog.color.setHex(currentTheme.fog);
    
    // Update Particles
    particlesMaterial.opacity = isLight ? 0.3 : 0.6;
    particlesMaterial.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
    
    const newPalette = currentTheme.particles.map(c => new THREE.Color(c));
    const colors = particlesGeometry.attributes.color.array;
    for(let i = 0; i < particlesCount * 3; i+=3) {
      const randColor = Math.random();
      let particleColor;
      if (randColor < 0.33) particleColor = newPalette[0];
      else if (randColor < 0.66) particleColor = newPalette[1];
      else particleColor = newPalette[2];
      
      colors[i] = particleColor.r;
      colors[i+1] = particleColor.g;
      colors[i+2] = particleColor.b;
    }
    particlesGeometry.attributes.color.needsUpdate = true;
    
    // Update Shapes
    shapeMaterial.color.setHex(currentTheme.shapes[0]);
    shapeMaterial.opacity = isLight ? 0.08 : 0.05;
    
    shapeMaterial2.color.setHex(currentTheme.shapes[1]);
    shapeMaterial2.opacity = isLight ? 0.05 : 0.03;
  });

  // --- Interaction & Animation ---
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
  });
  
  // Parallax on scroll
  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  const clock = new THREE.Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Mouse easing
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    // Rotate particle system slowly
    particlesMesh.rotation.y += 0.0005;
    particlesMesh.rotation.x += 0.0002;
    
    // Add subtle wave movement to particles
    const positions = particlesGeometry.attributes.position.array;
    for(let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      // create slight waving based on time and distinct particle position
      const x = positions[i3];
      const z = positions[i3 + 2];
      positions[i3 + 1] += Math.sin(elapsedTime * 0.5 + x) * 0.01;
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    // Camera parallax based on mouse
    camera.position.x += (mouseX * 0.005 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.005 - camera.position.y) * 0.05;
    
    // Parallax scrolling effect
    camera.position.y = -scrollY * 0.01;

    // Rotate abstract shapes
    shapeMesh.rotation.x = elapsedTime * 0.1;
    shapeMesh.rotation.y = elapsedTime * 0.15;
    
    shapeMesh2.rotation.x = elapsedTime * -0.05;
    shapeMesh2.rotation.y = elapsedTime * -0.1;

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}
