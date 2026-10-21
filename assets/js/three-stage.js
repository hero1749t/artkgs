// ArtKGS 3D Interactive Pencil Stage using Three.js
// Procedurally sculpted graphite lead with interactive turntable & microscopic detail modes

class PencilStage3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.currentMode = 'temple'; // 'temple', 'bridge', 'veena', 'pure'
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.targetRotation = { x: 0.2, y: -0.6 };
    this.rotation = { x: 0.2, y: -0.6 };
    this.targetZoom = 4.8;
    this.zoom = 4.8;

    this.init();
  }

  init() {
    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    
    const width = this.container.clientWidth || 500;
    const height = this.container.clientHeight || 500;

    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 0.8, this.zoom);

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.container.appendChild(this.renderer.domElement);

    // 3. Lighting
    this.setupLighting();

    // 4. Create Pencil & Miniature Sculpture Group
    this.stageGroup = new THREE.Group();
    this.scene.add(this.stageGroup);

    this.buildPedestal();
    this.buildPencil();
    this.buildSculptures();
    this.buildAtmosphere();

    // 5. Events
    this.bindEvents();

    // 6. Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.9);
    this.scene.add(ambientLight);

    // Key Studio Light (warm gold rim)
    const keyLight = new THREE.DirectionalLight(0xffecd2, 2.2);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    this.scene.add(keyLight);

    // Soft Blue Fill Light (Ganga reflection)
    const fillLight = new THREE.DirectionalLight(0x76b4bd, 1.4);
    fillLight.position.set(-5, 3, -3);
    this.scene.add(fillLight);

    // Dramatic Rim Light (Graphite Sheen)
    const rimLight = new THREE.PointLight(0xffffff, 2.5, 15);
    rimLight.position.set(0, 4, -4);
    this.scene.add(rimLight);
  }

  buildPedestal() {
    // Exhibition circular pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.25, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x141414,
      roughness: 0.35,
      metalness: 0.85
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.6;
    pedestal.receiveShadow = true;
    this.stageGroup.add(pedestal);

    // Brass Accent Ring
    const ringGeo = new THREE.TorusGeometry(1.61, 0.02, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.2,
      metalness: 0.95
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.48;
    this.stageGroup.add(ring);
  }

  buildPencil() {
    this.pencilGroup = new THREE.Group();
    this.pencilGroup.position.y = -1.45;

    // 1. Hexagonal Wooden Body (Black / Gold lacquer)
    const bodyGeo = new THREE.CylinderGeometry(0.35, 0.35, 2.0, 6);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1c1b18, // Matte black luxury pencil
      roughness: 0.4,
      metalness: 0.2
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.0;
    body.castShadow = true;
    this.pencilGroup.add(body);

    // Gold Lettering band
    const bandGeo = new THREE.CylinderGeometry(0.352, 0.352, 0.15, 6);
    const bandMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.2
    });
    const band = new THREE.Mesh(bandGeo, bandMat);
    band.position.y = 1.8;
    this.pencilGroup.add(band);

    // 2. Whittled Cedar Wood Cone (Sharpened wood grain)
    const woodGeo = new THREE.ConeGeometry(0.35, 0.9, 16);
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0xdeb887, // Natural pale cedar wood
      roughness: 0.85,
      metalness: 0.05
    });
    const woodCone = new THREE.Mesh(woodGeo, woodMat);
    woodCone.position.y = 2.45;
    woodCone.castShadow = true;
    this.pencilGroup.add(woodCone);

    // 3. Exposed Graphite Lead Core
    // Graphite has high specular shine and deep charcoal tone
    const graphiteMat = new THREE.MeshStandardMaterial({
      color: 0x1c1e22,
      roughness: 0.28,
      metalness: 0.65,
      bumpScale: 0.05
    });

    const leadBaseGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.65, 24);
    const leadBase = new THREE.Mesh(leadBaseGeo, graphiteMat);
    leadBase.position.y = 2.85;
    leadBase.castShadow = true;
    this.pencilGroup.add(leadBase);

    this.graphiteMat = graphiteMat;
    this.stageGroup.add(this.pencilGroup);
  }

  buildSculptures() {
    this.sculptures = {};

    // 1. Temple Shikhara Sculpture (Bhootnath Mandir)
    const templeGroup = new THREE.Group();
    templeGroup.position.y = 3.18; // At top of graphite lead

    // Stepped tiers
    const tiers = [
      { r: 0.11, h: 0.08 },
      { r: 0.095, h: 0.07 },
      { r: 0.08, h: 0.07 },
      { r: 0.065, h: 0.06 },
      { r: 0.048, h: 0.05 },
      { r: 0.03, h: 0.05 }
    ];

    let currentY = 0;
    tiers.forEach((t, i) => {
      const tierGeo = new THREE.CylinderGeometry(t.r * 0.88, t.r, t.h, 12);
      const tierMesh = new THREE.Mesh(tierGeo, this.graphiteMat);
      tierMesh.position.y = currentY + t.h / 2;
      tierMesh.castShadow = true;
      templeGroup.add(tierMesh);

      // Micro decorative ribs
      for (let j = 0; j < 6; j++) {
        const angle = (j / 6) * Math.PI * 2;
        const ribGeo = new THREE.BoxGeometry(0.012, t.h * 0.9, 0.012);
        const rib = new THREE.Mesh(ribGeo, this.graphiteMat);
        rib.position.set(Math.cos(angle) * t.r * 0.95, currentY + t.h / 2, Math.sin(angle) * t.r * 0.95);
        templeGroup.add(rib);
      }

      currentY += t.h;
    });

    // Kalash & Finial pinnacle on top
    const kalashGeo = new THREE.SphereGeometry(0.024, 12, 12);
    const kalash = new THREE.Mesh(kalashGeo, this.graphiteMat);
    kalash.position.y = currentY + 0.024;
    templeGroup.add(kalash);

    const spireGeo = new THREE.ConeGeometry(0.012, 0.08, 8);
    const spire = new THREE.Mesh(spireGeo, this.graphiteMat);
    spire.position.y = currentY + 0.06;
    templeGroup.add(spire);

    this.sculptures['temple'] = templeGroup;
    this.pencilGroup.add(templeGroup);

    // 2. Suspension Bridge Sculpture (Janki Jhula)
    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.y = 3.25;

    // Archway & roadway curve
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.35, 0.05, 0),
      new THREE.Vector3(-0.15, -0.05, 0),
      new THREE.Vector3(0, -0.08, 0),
      new THREE.Vector3(0.15, -0.05, 0),
      new THREE.Vector3(0.35, 0.05, 0)
    ]);
    const bridgeTubeGeo = new THREE.TubeGeometry(curve, 32, 0.018, 8, false);
    const bridgeMesh = new THREE.Mesh(bridgeTubeGeo, this.graphiteMat);
    bridgeMesh.castShadow = true;
    bridgeGroup.add(bridgeMesh);

    // Suspension Pylons (Towers)
    [-0.32, 0.32].forEach(posX => {
      const pylonGeo = new THREE.BoxGeometry(0.035, 0.28, 0.035);
      const pylon = new THREE.Mesh(pylonGeo, this.graphiteMat);
      pylon.position.set(posX, 0.12, 0);
      bridgeGroup.add(pylon);
    });

    // Tiny vertical suspension cables
    for (let x = -0.28; x <= 0.28; x += 0.06) {
      const cableGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.16, 4);
      const cable = new THREE.Mesh(cableGeo, this.graphiteMat);
      cable.position.set(x, 0.06, 0);
      bridgeGroup.add(cable);
    }

    bridgeGroup.visible = false;
    this.sculptures['bridge'] = bridgeGroup;
    this.pencilGroup.add(bridgeGroup);

    // 3. Veena Sculpture
    const veenaGroup = new THREE.Group();
    veenaGroup.position.y = 3.22;

    // Large resonator gourd
    const gourdGeo = new THREE.SphereGeometry(0.09, 16, 16);
    gourdGeo.scale(1, 0.9, 0.9);
    const gourd = new THREE.Mesh(gourdGeo, this.graphiteMat);
    gourd.position.set(0, -0.02, 0);
    veenaGroup.add(gourd);

    // Fretboard neck
    const neckGeo = new THREE.CylinderGeometry(0.02, 0.025, 0.45, 12);
    const neck = new THREE.Mesh(neckGeo, this.graphiteMat);
    neck.position.set(0, 0.2, 0);
    veenaGroup.add(neck);

    // Dragon/peacock carved headstock
    const headGeo = new THREE.ConeGeometry(0.035, 0.08, 12);
    const head = new THREE.Mesh(headGeo, this.graphiteMat);
    head.rotation.z = Math.PI;
    head.position.set(0.02, 0.45, 0);
    veenaGroup.add(head);

    veenaGroup.visible = false;
    this.sculptures['veena'] = veenaGroup;
    this.pencilGroup.add(veenaGroup);
  }

  buildAtmosphere() {
    // Subtle floating graphite dust particles
    const particleCount = 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 6;
      positions[i + 1] = Math.random() * 4 - 1;
      positions[i + 2] = (Math.random() - 0.5) * 6;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.035,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  setMode(mode) {
    if (!this.sculptures[mode] && mode !== 'pure') return;
    this.currentMode = mode;

    Object.keys(this.sculptures).forEach(key => {
      this.sculptures[key].visible = (key === mode);
    });

    // Update active button state in UI
    document.querySelectorAll('.model-switcher-btn').forEach(btn => {
      btn.classList.toggle('active-mode', btn.dataset.mode === mode);
    });

    // Trigger slight focal animation
    this.targetZoom = (mode === 'bridge') ? 4.4 : 4.8;
  }

  bindEvents() {
    const el = this.renderer.domElement;

    // Mouse drag rotation
    el.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) {
        // Subtle ambient parallax tilt when moving cursor
        const rect = el.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          const normX = (e.clientX - rect.left) / rect.width - 0.5;
          const normY = (e.clientY - rect.top) / rect.height - 0.5;
          this.targetRotation.x = 0.2 + normY * 0.4;
          this.targetRotation.y = -0.6 + normX * 0.8;
        }
        return;
      }

      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.targetRotation.y += deltaX * 0.008;
      this.targetRotation.x += deltaY * 0.006;
      this.targetRotation.x = Math.max(-0.4, Math.min(0.8, this.targetRotation.x));

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch events for mobile
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    el.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
      const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

      this.targetRotation.y += deltaX * 0.01;
      this.targetRotation.x += deltaY * 0.008;
      this.targetRotation.x = Math.max(-0.4, Math.min(0.8, this.targetRotation.x));

      this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    el.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // Scroll Wheel Zoom
    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.targetZoom += e.deltaY * 0.003;
      this.targetZoom = Math.max(3.2, Math.min(6.5, this.targetZoom));
    }, { passive: false });

    // Resize handling
    window.addEventListener('resize', () => {
      if (!this.container) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  animate() {
    requestAnimationFrame(this.animate);

    // Smooth inertia interpolation
    this.rotation.x += (this.targetRotation.x - this.rotation.x) * 0.06;
    this.rotation.y += (this.targetRotation.y - this.rotation.y) * 0.06;
    this.zoom += (this.targetZoom - this.zoom) * 0.08;

    this.camera.position.z = this.zoom;

    // Continuous subtle turntable spin if not dragging
    if (!this.isDragging) {
      this.targetRotation.y += 0.0025;
    }

    this.stageGroup.rotation.x = this.rotation.x;
    this.stageGroup.rotation.y = this.rotation.y;

    // Slowly float particles
    if (this.particles) {
      this.particles.rotation.y += 0.0008;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Global initialization helper
window.initPencil3DStage = function(containerId) {
  return new PencilStage3D(containerId);
};
