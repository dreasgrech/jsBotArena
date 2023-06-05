(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('phaser'), require('tweakpane')) :
  typeof define === 'function' && define.amd ? define(['exports', 'phaser', 'tweakpane'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.PhaserPluginInspector = {}, global.Phaser, global.Tweakpane));
}(this, (function (exports, Phaser, tweakpane) { 'use strict';

  Phaser = Phaser && Object.prototype.hasOwnProperty.call(Phaser, 'default') ? Phaser['default'] : Phaser;

  const FXMap = {
    4: 'GLOW',
    5: 'SHADOW',
    6: 'PIXELATE',
    7: 'VIGNETTE',
    8: 'SHINE',
    9: 'BLUR',
    12: 'GRADIENT',
    13: 'BLOOM',
    14: 'COLOR_MATRIX',
    15: 'CIRCLE',
    16: 'BARREL',
    17: 'DISPLACEMENT',
    18: 'WIPE',
    19: 'BOKEH'
  };

  const TAU = 2 * Math.PI;
  const CacheNames = ['audio', 'binary', 'bitmapFont', 'html', 'json', 'obj', 'physics', 'shader', 'text', 'tilemap', 'video', 'xml'];
  const CameraEvents = Phaser.Cameras.Scene2D.Events;
  const SceneEvents = Phaser.Scenes.Events;
  const GameObjectEvents = Phaser.GameObjects.Events;
  const { BlendModes } = Phaser;
  const { GetFirst } = Phaser.Utils.Array;

  function animToPrint ({ key, delay, duration, frameRate, repeat, repeatDelay }) {
    return { key, delay, duration, frameRate, repeat, repeatDelay };
  }

  function sceneToPrint (scene) {
    const { key, status, active, visible } = scene.sys.settings;

    return { key, status, active, visible };
  }

  function soundToPrint ({ key, isPaused, isPlaying, seek, totalDuration, volume }) {
    return { key, isPaused, isPlaying, seek, totalDuration, volume };
  }

  function textureToPrint ({ key, firstFrame, frameTotal }) {
    return { key, firstFrame, frameTotal };
  }

  function copyToSafeObj (obj) {
    var out = {};

    for (var key in obj) {
      var val = obj[key];
      var typ = typeof val;

      if (!val || typ === 'boolean' || typ === 'number' || typ === 'string') {
        out[key] = val;
      }
    }

    return out;
  }

  function copyToSafeTable (obj) {
    var out = {};

    for (var key in obj) {
      var val = obj[key];

      out[key] = typeof val === 'object' ? copyToSafeObj(obj[key]) : val;
    }

    return out;
  }

  function printCaches (manager) {
    for (const name of CacheNames) {
      printCache(name, manager[name]);
    }

    for (const name in manager.custom) {
      printCache(name, manager.custom[name]);
    }
  }

  function printCache (name, cache) {
    const { size } = cache.entries;

    if (size > 0) {
      console.info(`${name} cache (${size})`);

      console.table(copyToSafeTable(cache.entries.entries));
    } else {
      console.info(`${name} cache is empty`);
    }
  }

  function printDevice (device) {
    for (const key in device) {
      console.info(key);
      console.table(copyToSafeObj(device[key]));
    }
  }

  function snapshot (img) {
    img.style.width = '256px';
    img.style.height = 'auto';
    document.body.appendChild(img);
  }

  function AddPointer (pointer, pane) {
    const folder = pane.addFolder({ title: `Pointer ${pointer.id}`, expanded: false });

    folder.addMonitor(pointer, 'active');
    folder.addMonitor(pointer, 'angle');
    folder.addMonitor(pointer, 'buttons');
    folder.addMonitor(pointer, 'deltaX');
    folder.addMonitor(pointer, 'deltaY');
    folder.addMonitor(pointer, 'deltaZ');
    folder.addMonitor(pointer, 'distance');
    folder.addMonitor(pointer, 'downX');
    folder.addMonitor(pointer, 'downY');
    folder.addMonitor(pointer, 'id');
    folder.addMonitor(pointer, 'isDown');
    folder.addMonitor(pointer, 'locked');
    folder.addMonitor(pointer, 'movementX');
    folder.addMonitor(pointer, 'movementY');
    folder.addMonitor(pointer, 'primaryDown');
    folder.addMonitor(pointer, 'upX');
    folder.addMonitor(pointer, 'upY');
    folder.addMonitor(pointer.velocity, 'x', { label: 'velocity x' });
    folder.addMonitor(pointer.velocity, 'y', { label: 'velocity y' });
    folder.addMonitor(pointer, 'worldX');
    folder.addMonitor(pointer, 'worldY');
    folder.addMonitor(pointer, 'x');
    folder.addMonitor(pointer, 'y');

    return folder;
  }

  function AddSound (sound, pane) {
    const folder = pane.addFolder({ title: `Sound “${sound.key}”`, expanded: false });

    sound.once('destroy', () => { folder.dispose(); });

    if (sound.currentMarker) {
      folder.addMonitor(sound.currentMarker, 'name');
    }

    folder.addMonitor(sound, 'duration');
    folder.addMonitor(sound, 'isPaused');
    folder.addMonitor(sound, 'isPlaying');
    folder.addMonitor(sound, 'seek');
    folder.addMonitor(sound, 'totalDuration');

    folder.addMonitor(sound, 'loop');
    folder.addInput(sound, 'mute');
    folder.addInput(sound, 'volume', { min: 0, max: 1 });

    folder.addButton({ title: 'Play' }).on('click', () => { console.info('Play sound “%s”', sound.key); sound.play(); });
    folder.addButton({ title: 'Pause' }).on('click', () => { console.info('Pause sound “%s”', sound.key); sound.pause(); });
    folder.addButton({ title: 'Resume' }).on('click', () => { console.info('Resume sound “%s”', sound.key); sound.resume(); });
    folder.addButton({ title: 'Stop' }).on('click', () => { console.info('Stop sound “%s”', sound.key); sound.stop(); });
    folder.addButton({ title: 'Remove' }).on('click', () => { console.info('Remove sound “%s”', sound.key); sound.destroy(); });

    for (const name in sound.markers) {
      folder.addButton({ title: `Play “${name}”` }).on('click', () => { console.info('Play sound “%s” marker “%s”', sound.key, name); sound.play(name); });
    }

    return folder;
  }

  function displayListItemToPrint ({ name, type, x, y, visible, depth }) {
    return { name, type, x, y, visible, depth };
  }

  function updateListItemToPrint ({ name, type, active }) {
    return { name, type, active };
  }

  function tweenToPrint ({ duration, elapsed, paused, progress, state, totalElapsed, totalProgress }) {
    return { duration, elapsed, paused, progress, state, totalElapsed, totalProgress };
  }

  function timerEventToPrint ({ delay, elapsed, loop, paused, repeat, repeatCount }) {
    return { delay, elapsed, loop, paused, repeat, repeatCount };
  }

  function keyToPrint ({ duration, emitOnRepeat, enabled, isDown, isUp, location, repeats, timeDown, timeUp }) {
    return { duration, emitOnRepeat, enabled, isDown, isUp, location, repeats, timeDown, timeUp };
  }

  function cameraToPrint ({ name, id, x, y, width, height, visible, alpha }) {
    return { name, id, x, y, width, height, visible, alpha };
  }

  function lightToPrint ({ x, y, radius, color, intensity, visible }) {
    return { x, y, radius, color: `rgb(${color.r.toFixed(2)}, ${color.g.toFixed(2)}, ${color.b.toFixed(2)})`, intensity, visible };
  }

  function AddCamera (camera, pane) {
    const defaultCamera = camera.cameraManager.default;
    const w = defaultCamera.width;
    const h = defaultCamera.height;
    const folder = pane.addFolder({ title: `Camera ${camera.id} ${camera.name || ''}`, expanded: false });

    folder.addMonitor(camera, 'name');
    folder.addInput(camera, 'alpha', { min: 0, max: 1, step: 0.05 });
    folder.addInput(camera, 'backgroundColor');
    folder.addInput(camera, 'x', { min: -w, max: w, step: 10 });
    folder.addInput(camera, 'y', { min: -h, max: h, step: 10 });
    folder.addInput(camera, 'width', { min: 0, max: w, step: 10 });
    folder.addInput(camera, 'height', { min: 0, max: h, step: 10 });
    folder.addInput(camera, 'scrollX', { min: -w, max: w, step: 10 });
    folder.addInput(camera, 'scrollY', { min: -h, max: h, step: 10 });
    folder.addInput(camera, 'originX', { min: 0, max: 1, step: 0.05 });
    folder.addInput(camera, 'originY', { min: 0, max: 1, step: 0.05 });
    folder.addInput(camera, 'rotation', { min: 0, max: TAU });
    folder.addInput(camera, 'zoom', { min: 0.1, max: 10, step: 0.05 });
    folder.addInput(camera, 'followOffset');
    folder.addInput(camera, 'disableCull');
    folder.addInput(camera, 'inputEnabled');
    folder.addInput(camera, 'roundPixels');
    folder.addInput(camera, 'useBounds');
    folder.addInput(camera, 'visible');
    folder.addMonitor(camera, 'centerX');
    folder.addMonitor(camera, 'centerY');
    folder.addMonitor(camera.midPoint, 'x', { label: 'midPoint x' });
    folder.addMonitor(camera.midPoint, 'y', { label: 'midPoint y' });
    folder.addMonitor(camera.worldView, 'x', { label: 'world x' });
    folder.addMonitor(camera.worldView, 'y', { label: 'world y' });
    folder.addMonitor(camera.worldView, 'width', { label: 'world width' });
    folder.addMonitor(camera.worldView, 'height', { label: 'world height' });

    // TODO
    const { deadzone } = camera;
    if (deadzone) {
      folder.addMonitor(deadzone, 'x', { label: 'deadzone x' });
      folder.addMonitor(deadzone, 'y', { label: 'deadzone y' });
      folder.addMonitor(deadzone, 'width', { label: 'deadzone width' });
      folder.addMonitor(deadzone, 'height', { label: 'deadzone height' });
    }

    if (camera.hasPostPipeline) {
      AddPipelines(camera.postPipelines, folder, { title: 'Post Pipelines' });
    }

    folder.addButton({ title: 'Fade in' }).on('click', () => { camera.fadeIn(); });
    folder.addButton({ title: 'Fade out' }).on('click', () => { camera.fadeOut(); });
    folder.addButton({ title: 'Flash' }).on('click', () => { camera.flash(); });
    folder.addButton({ title: 'Shake' }).on('click', () => { camera.shake(); });
    folder.addButton({ title: 'Reset effects' }).on('click', () => { camera.resetFX(); });
    folder.addButton({ title: 'Reset post pipeline' }).on('click', () => { camera.resetPostPipeline(); });

    camera.on(CameraEvents.DESTROY, () => {
      folder.dispose();
    });

    return folder;
  }

  function AddArcadePhysicsWorld (world, pane) {
    const { arcadePhysics, events } = world.scene.sys;
    const folder = pane.addFolder({ title: 'Arcade Physics', expanded: false });

    folder.addMonitor(world.bodies, 'size', { label: 'bodies' });
    folder.addInput(world, 'fixedStep');
    folder.addInput(world, 'forceX');
    folder.addInput(world, 'fps', { min: 5, max: 300, step: 5 }).on('change', ({ value }) => { world.setFPS(value); });
    folder.addMonitor(world, '_frameTimeMS');
    folder.addInput(world, 'gravity', { x: { min: -1000, max: 1000 }, y: { min: -1000, max: 1000 } });
    folder.addInput(world, 'isPaused');
    folder.addInput(world, 'OVERLAP_BIAS', { label: 'overlap bias', min: 0, max: 32, step: 1 });
    folder.addMonitor(world.staticBodies, 'size', { label: 'staticBodies' });
    folder.addInput(world, 'TILE_BIAS', { label: 'tile bias', min: 0, max: 32, step: 1 });
    folder.addInput(world, 'timeScale', { min: 0.1, max: 10, step: 0.1 });
    folder.addInput(world, 'useTree');
    if (world.debugGraphic) {
      folder.addInput(world.debugGraphic, 'visible', { label: 'debug' });
    }
    folder.addButton({ title: 'Enable update' }).on('click', () => { arcadePhysics.enableUpdate(); });
    folder.addButton({ title: 'Disable update' }).on('click', () => { arcadePhysics.disableUpdate(); });
    folder.addButton({ title: 'Update' }).on('click', () => { world.update(0, world._frameTimeMS || (1000 / 60)); });
    folder.addButton({ title: 'Print colliders' }).on('click', () => { console.info('Colliders', world.colliders.getActive()); });

    events.once(SceneEvents.SHUTDOWN, () => {
      folder.dispose();
    });

    return folder;
  }

  function AddMatterPhysicsWorld (world, pane) {
    const { events } = world.scene.sys;
    const folder = pane.addFolder({ title: 'Matter Physics', expanded: false });
    folder.addInput(world, 'autoUpdate');
    folder.addInput(world, 'correction', { min: 0.1, max: 1, step: 0.05 });
    folder.addInput(world, 'enabled');
    folder.addInput(world.localWorld, 'gravity');
    folder.addInput(world.localWorld.gravity, 'scale', { label: 'gravity scale', min: 0, max: 0.1, step: 0.001 });
    if (world.debugGraphic) {
      folder.addInput(world.debugGraphic, 'visible', { label: 'debug' });
    }
    folder.addButton({ title: 'Pause' }).on('click', () => { world.pause(); });
    folder.addButton({ title: 'Resume' }).on('click', () => { world.resume(); });
    folder.addButton({ title: 'Step' }).on('click', () => { world.step(); });

    events.once(SceneEvents.SHUTDOWN, () => {
      folder.dispose();
    });

    return folder;
  }

  function AddGameObject (obj, pane, options = { title: `${obj.type} “${obj.name}”` }) {
    const folder = pane.addFolder(options);

    folder.addInput(obj, 'active');
    folder.addMonitor(obj, 'cameraFilter');
    folder.addMonitor(obj, 'state');

    if ('texture' in obj && obj.texture && obj.texture.key) {
      const proxy = {
        get 'texture.key' () { return obj.texture.key; },
        get 'frame.name' () { return obj.frame.name; }
      };

      folder.addMonitor(proxy, 'texture.key');
      folder.addMonitor(proxy, 'frame.name', { format: String });
    }

    if ('displayTexture' in obj) {
      const proxy = {
        get 'displayTexture.key' () { return obj.displayTexture.key; },
        get 'displayFrame.name' () { return obj.displayFrame.name; }
      };

      folder.addMonitor(proxy, 'displayTexture.key');
      folder.addMonitor(proxy, 'displayFrame.name', { format: String });
    }

    if ('alpha' in obj) {
      folder.addInput(obj, 'alpha', { min: 0, max: 1, step: 0.05 });
    }

    if ('blendMode' in obj) {
      folder.addInput(obj, 'blendMode', { options: BlendModes });
    }

    if ('depth' in obj) {
      folder.addMonitor(obj, 'depth');
    }

    if ('width' in obj) {
      folder.addMonitor(obj, 'width');
      folder.addMonitor(obj, 'height');
    }

    if ('displayWidth' in obj) {
      folder.addMonitor(obj, 'displayWidth');
      folder.addMonitor(obj, 'displayHeight');
    }

    if ('originX' in obj) {
      folder.addMonitor(obj, 'originX');
      folder.addMonitor(obj, 'originY');
    }

    if ('displayOriginX' in obj) {
      folder.addMonitor(obj, 'displayOriginX');
      folder.addMonitor(obj, 'displayOriginY');
    }

    if ('scaleX' in obj) {
      folder.addMonitor(obj, 'scaleX');
      folder.addMonitor(obj, 'scaleY');
      folder.addInput(obj, 'scale', { min: 0.1, max: 10, step: 0.1 });
    }

    if ('flipX' in obj) {
      folder.addInput(obj, 'flipX');
      folder.addInput(obj, 'flipY');
    }

    if ('angle' in obj) {
      folder.addMonitor(obj, 'angle');
    }

    if ('rotation' in obj) {
      folder.addInput(obj, 'rotation', { min: 0, max: TAU, step: 0.01 * TAU });
    }

    if ('visible' in obj) {
      folder.addInput(obj, 'visible');
    }

    if ('x' in obj) {
      folder.addMonitor(obj, 'x');
      folder.addMonitor(obj, 'y');
      folder.addMonitor(obj, 'z');
      folder.addMonitor(obj, 'w');
    }

    if ('modelPosition' in obj) {
      folder.addInput(obj, 'modelPosition');
      folder.addInput(obj, 'modelScale');
      folder.addInput(obj, 'modelRotation');
    }

    if ('fov' in obj) {
      folder.addMonitor(obj, 'fov');
    }

    if ('faces' in obj && 'length' in obj.faces) {
      folder.addMonitor(obj.faces, 'length', { label: 'faces.length', format: FormatLength });
    }

    if ('vertices' in obj && 'length' in obj.vertices) {
      folder.addMonitor(obj.vertices, 'length', { label: 'vertices.length', format: FormatLength });
    }

    if ('totalRendered' in obj) {
      folder.addMonitor(obj, 'totalRendered', { format: FormatLength });
    }

    if ('getPipelineName' in obj) {
      const proxy = { get 'getPipelineName()' () { return obj.getPipelineName(); } };

      folder.addMonitor(proxy, 'getPipelineName()', { label: 'getPipelineName()' });
    }

    if ('hasPostPipeline' in obj) {
      folder.addMonitor(obj, 'hasPostPipeline');
    }

    if ('preFX' in obj && obj.preFX && obj.preFX.list.length > 0) {
      AddFXComponent(obj.preFX, folder);
    }

    if (obj.hasPostPipeline) {
      AddPipelines(obj.postPipelines, folder, { title: 'Post Pipelines' });
    }

    if ('children' in obj && 'length' in obj.children) {
      folder.addMonitor(obj.children, 'length', { label: 'children (length)', format: FormatLength });
    }

    // The `postFX` controller doesn't seem to show any relevant state.

    if ('resetPipeline' in obj) {
      folder.addButton({ title: 'Reset Pipeline' }).on('click', () => { console.info('Reset pipeline', obj.type, obj.name); obj.resetPipeline(); });
    }

    if ('resetPostPipeline' in obj) {
      folder.addButton({ title: 'Reset Post Pipeline' }).on('click', () => { console.info('Reset post pipeline', obj.type, obj.name); obj.resetPostPipeline(); });
    }

    folder.addButton({ title: 'Destroy' }).on('click', () => { console.info('Destroy', obj.type, obj.name); obj.destroy(); });

    obj.once(GameObjectEvents.DESTROY, () => { folder.dispose(); });

    return folder;
  }

  function AddGroup (group, pane, options = { title: `${group.type} “${group.name}”` }) {
    const folder = pane.addFolder(options);
    const graphOptions = { view: 'graph', min: 0, max: group.maxSize === -1 ? 100 : group.maxSize };

    folder.addMonitor(group.getChildren(), 'length', graphOptions);

    const proxy = {
      get active () { return group.countActive(true); },
      get inactive () { return group.countActive(false); },
      get free () { return group.getTotalFree(); },
      get full () { return group.isFull(); }
    };

    folder.addMonitor(proxy, 'active', graphOptions);
    folder.addMonitor(proxy, 'inactive', graphOptions);
    if (group.maxSize > -1) { folder.addMonitor(proxy, 'free', graphOptions); }
    folder.addMonitor(group, 'maxSize');
    folder.addMonitor(proxy, 'full');

    folder.addButton({ title: 'Clear' }).on('click', () => { console.info('Clear group', group.name); group.clear(); });
    folder.addButton({ title: 'Destroy' }).on('click', () => { console.info('Destroy group', group.name); group.destroy(); });
    folder.addButton({ title: 'Destroy group members' }).on('click', () => { console.info('Destroy group members', group.name); group.clear(true, true); });

    group.once(GameObjectEvents.DESTROY, () => { folder.dispose(); });

    return folder;
  }

  function AddLight (light, pane, options = { title: 'Light' }) {
    const folder = pane.addFolder(options);

    folder.addInput(light, 'color', { color: { type: 'float' } });
    folder.addInput(light, 'intensity', { min: 0, max: 10, step: 0.1 });
    folder.addInput(light, 'radius', { min: 0, max: 1024, step: 8 });
    folder.addInput(light, 'visible');
    folder.addMonitor(light, 'x');
    folder.addMonitor(light, 'y');

    return folder;
  }

  function AddParticleEmitter (emitter, pane, options = { title: `Particle Emitter “${emitter.name}”` }) {
    const folder = pane.addFolder(options);

    const max = emitter.maxParticles || 100;

    folder.addMonitor(emitter, 'active');
    folder.addMonitor(emitter, 'animQuantity');
    folder.addMonitor(emitter, 'delay');
    folder.addMonitor(emitter, 'duration');
    folder.addMonitor(emitter, 'emitting');
    folder.addMonitor(emitter, 'frameQuantity');
    folder.addMonitor(emitter, 'maxAliveParticles');
    folder.addMonitor(emitter, 'maxParticles');
    folder.addMonitor(emitter, 'quantity');
    folder.addMonitor(emitter, 'stopAfter');

    folder.addInput(emitter, 'blendMode', { options: BlendModes });
    folder.addInput(emitter, 'frequency', { min: -1, max: 1000 });
    folder.addInput(emitter, 'moveTo');
    folder.addInput(emitter, 'particleBringToTop');
    folder.addInput(emitter, 'radial');
    folder.addInput(emitter, 'randomFrame');
    folder.addInput(emitter, 'timeScale', { min: 0.1, max: 10, step: 0.1 });
    folder.addInput(emitter, 'visible');

    const graphsFolder = folder.addFolder({ title: 'Counters', expanded: false });

    graphsFolder.addMonitor(emitter.alive, 'length', { view: 'graph', min: 0, max: max, label: 'alive (length)', format: FormatLength });
    graphsFolder.addMonitor(emitter.dead, 'length', { view: 'graph', min: 0, max: max, label: 'dead (length)', format: FormatLength });

    if (emitter.frequency > 0) {
      graphsFolder.addMonitor(emitter, 'flowCounter', { view: 'graph', min: 0, max: emitter.frequency });
    }

    if (emitter.frameQuantity > 1) {
      graphsFolder.addMonitor(emitter, 'frameCounter', { view: 'graph', min: 0, max: emitter.frameQuantity });
    }

    if (emitter.animQuantity > 1) {
      graphsFolder.addMonitor(emitter, 'animCounter', { view: 'graph', min: 0, max: emitter.animQuantity });
    }

    if (emitter.duration > 0) {
      graphsFolder.addMonitor(emitter, 'elapsed', { view: 'graph', min: 0, max: emitter.duration });
    }

    if (emitter.stopAfter > 0) {
      graphsFolder.addMonitor(emitter, 'stopCounter', { view: 'graph', min: 0, max: emitter.stopAfter });
    }

    if (emitter.emitZones.length > 1) {
      graphsFolder.addMonitor(emitter, 'zoneIndex', { view: 'graph', min: 0, max: emitter.emitZones.length });
    }

    if (emitter.frames.length > 1) {
      graphsFolder.addMonitor(emitter, 'currentFrame', { view: 'graph', min: 0, max: emitter.frames.length });
    }

    if (emitter.anims.length > 1) {
      graphsFolder.addMonitor(emitter, 'currentAnim', { view: 'graph', min: 0, max: emitter.anims.length });
    }

    const { processors } = emitter;

    if (processors.length > 0) {
      const processorsFolder = folder.addFolder({ title: 'Processors' });

      for (const processor of processors.list) {
        processorsFolder.addInput(processor, 'active', { label: `${processor.name || 'Processor'} active` });
      }
    }

    folder.addButton({ title: 'Start' }).on('click', () => { emitter.start(); });
    folder.addButton({ title: 'Stop' }).on('click', () => { emitter.stop(); });
    folder.addButton({ title: 'Pause' }).on('click', () => { emitter.pause(); });
    folder.addButton({ title: 'Resume' }).on('click', () => { emitter.resume(); });
    folder.addButton({ title: 'Kill all' }).on('click', () => { emitter.killAll(); });
    folder.addButton({ title: 'Print JSON' }).on('click', () => { console.log(JSON.stringify(emitter.toJSON())); });

    emitter.once(GameObjectEvents.DESTROY, () => { folder.dispose(); });

    return folder;
  }

  function AddTween (tween, pane, options = { title: 'Tween' }) {
    const folder = pane.addFolder(options);

    // > When creating a Tween, you can no longer pass a function for the following properties:
    // > duration, hold, repeat and repeatDelay.
    // > These should be numbers only. You can, however, still provide a function for delay, to keep it compatible with the StaggerBuilder.

    folder.addMonitor(tween, 'countdown');
    folder.addMonitor(tween, 'duration');
    folder.addMonitor(tween, 'elapsed');
    folder.addMonitor(tween, 'loop');
    folder.addMonitor(tween, 'loopCounter');
    folder.addMonitor(tween, 'state');
    folder.addInput(tween, 'timeScale', { min: 0.1, max: 10, step: 0.1 });
    folder.addMonitor(tween, 'totalData');
    folder.addMonitor(tween, 'totalDuration');
    folder.addMonitor(tween, 'totalElapsed');
    folder.addMonitor(tween, 'totalProgress', { view: 'graph', min: 0, max: 1 });

    for (const dat of tween.data) {
      folder.addMonitor(dat, 'progress', { view: 'graph', min: 0, max: 1, label: `${dat.key} progress` });
    }

    for (const dat of tween.data) {
      folder.addMonitor(dat, 'current', { label: `${dat.key} current` });
    }

    folder.addButton({ title: 'Play' }).on('click', () => { console.info('Play tween'); tween.play(); });
    folder.addButton({ title: 'Pause' }).on('click', () => { console.info('Pause tween'); tween.pause(); });
    folder.addButton({ title: 'Resume' }).on('click', () => { console.info('Resume tween'); tween.resume(); });
    folder.addButton({ title: 'Stop' }).on('click', () => { console.info('Stop tween'); tween.stop(); });
    folder.addButton({ title: 'Restart' }).on('click', () => { console.info('Restart tween'); tween.restart(); });
    folder.addButton({ title: 'Remove' }).on('click', () => { console.info('Remove tween'); tween.remove(); });

    return folder;
  }

  function AddTimerEvent (timer, pane, options = { title: 'Timer Event' }) {
    const folder = pane.addFolder(options);

    folder.addMonitor(timer, 'elapsed', { view: 'graph', min: 0, max: timer.delay });
    folder.addMonitor(timer, 'elapsed');
    folder.addMonitor(timer, 'hasDispatched');
    folder.addMonitor(timer, 'loop');
    folder.addInput(timer, 'paused');
    folder.addMonitor(timer, 'repeat');
    folder.addMonitor(timer, 'repeatCount');

    folder.addButton({ title: 'Remove' }).on('click', () => { timer.remove(); });
    folder.addButton({ title: 'Reset' }).on('click', () => { timer.reset(); });

    return folder;
  }

  function AddInput (input, pane, options = { title: `Input (${input.gameObject.type} “${input.gameObject.name}”)` }) {
    const folder = pane.addFolder(options);

    folder.addMonitor(input, 'cursor');
    folder.addMonitor(input, 'customHitArea');
    folder.addMonitor(input, 'draggable');
    folder.addMonitor(input, 'dragStartX');
    folder.addMonitor(input, 'dragStartXGlobal');
    folder.addMonitor(input, 'dragStartY');
    folder.addMonitor(input, 'dragStartYGlobal');
    folder.addMonitor(input, 'dragState');
    folder.addMonitor(input, 'dragX');
    folder.addMonitor(input, 'dragY');
    folder.addMonitor(input, 'dropZone');
    folder.addMonitor(input, 'enabled');
    folder.addMonitor(input, 'localX');
    folder.addMonitor(input, 'localY');

    input.gameObject.once(GameObjectEvents.DESTROY, () => { folder.dispose(); });

    return folder;
  }

  function AddArcadeBody (body, pane, options = { title: `Body (${body.gameObject.type} “${body.gameObject.name}”)` }) {
    const folder = pane.addFolder(options);

    folder.addMonitor(body, 'enable');
    folder.addInput(body, 'debugShowBody');
    folder.addInput(body, 'debugShowVelocity');
    folder.addInput(body, 'debugBodyColor', { view: 'color' });
    folder.addMonitor(body.velocity, 'x', { label: 'velocity x' });
    folder.addMonitor(body.velocity, 'y', { label: 'velocity y' });
    folder.addMonitor(body, 'speed');
    folder.addMonitor(body, 'angle');
    folder.addMonitor(body, '_dx', { label: 'deltaX' });
    folder.addMonitor(body, '_dy', { label: 'deltaY' });
    folder.addMonitor(body, '_tx', { label: 'deltaXFinal' });
    folder.addMonitor(body, '_ty', { label: 'deltaYFinal' });

    body.gameObject.once(GameObjectEvents.DESTROY, () => { folder.dispose(); });

    return folder;
  }

  function AddAnimationState (state, pane, options = { title: `Animation (${state.parent.type} “${state.parent.name}”)` }) {
    const folder = pane.addFolder(options);

    const proxy = {
      get 'getName()' () { return state.getName(); },
      get 'getFrameName()' () { return state.getFrameName(); },
      get nextAnim () { return state.nextAnim ? (state.nextAnim.key || state.nextAnim) : ''; }
    };

    folder.addMonitor(proxy, 'getName()');
    folder.addMonitor(proxy, 'getFrameName()');
    folder.addMonitor(state, 'delay');
    folder.addMonitor(state, 'delayCounter');
    folder.addMonitor(state, 'duration');
    folder.addMonitor(state, 'forward');
    folder.addMonitor(state, 'frameRate');
    folder.addMonitor(state, 'hasStarted');
    folder.addMonitor(state, 'isPaused');
    folder.addMonitor(state, 'isPlaying');
    folder.addMonitor(state, 'msPerFrame');
    folder.addMonitor(proxy, 'nextAnim', { label: 'nextAnim (key)' });
    folder.addMonitor(state.nextAnimsQueue, 'length', { label: 'nextAnimsQueue (length)', format: FormatLength });
    folder.addMonitor(state, 'repeat');
    folder.addMonitor(state, 'repeatCounter');
    folder.addMonitor(state, 'repeatDelay');
    folder.addInput(state, 'skipMissedFrames');
    folder.addInput(state, 'timeScale', { min: 0.1, max: 10, step: 0.1 });
    folder.addMonitor(state, 'yoyo');

    folder.addButton({ title: 'Stop' }).on('click', () => { console.info('Stop animation'); state.stop(); });
    folder.addButton({ title: 'Pause' }).on('click', () => { console.info('Pause animation'); state.pause(); });
    folder.addButton({ title: 'Resume' }).on('click', () => { console.info('Resume animation'); state.resume(); });
    folder.addButton({ title: 'Restart' }).on('click', () => { console.info('Restart animation'); state.restart(); });
    folder.addButton({ title: 'Reverse' }).on('click', () => { console.info('Reverse animation'); state.reverse(); });
    folder.addButton({ title: 'Next frame' }).on('click', () => { console.info('Next animation frame'); state.nextFrame(); });
    folder.addButton({ title: 'Previous frame' }).on('click', () => { console.info('Previous animation frame'); state.previousFrame(); });

    state.parent.once(GameObjectEvents.DESTROY, () => { folder.dispose(); });

    return folder;
  }

  function AddKey (key, pane, options = { title: `Key (${key.keyCode})` }) {
    const folder = pane.addFolder(options);

    folder.addMonitor(key, 'duration');
    folder.addInput(key, 'emitOnRepeat');
    folder.addInput(key, 'enabled');
    folder.addMonitor(key, 'isDown');
    folder.addMonitor(key, 'isUp');
    folder.addMonitor(key, 'location');
    folder.addMonitor(key, 'repeats');
    folder.addMonitor(key, 'timeDown');
    folder.addMonitor(key, 'timeUp');

    folder.addButton({ title: 'Destroy' }).on('click', () => { console.info('Destroy key'); key.destroy(); folder.dispose(); });

    return folder;
  }

  function AddKeys (keys, pane, options = { title: 'Keys' }) {
    const folder = pane.addFolder(options);

    for (const name in keys) {
      const key = keys[name];

      folder.addMonitor(key, 'isDown', { label: `${name} isDown` });
    }

    return folder;
  }

  function AddFXComponent (comp, pane, options = { title: `${comp.isPost ? 'Post' : 'Pre'} FX` }) {
    const folder = pane.addFolder(options);

    folder.addMonitor(comp, 'enabled');

    folder.addInput(comp, 'padding', { min: 0, max: 32, step: 1 });

    folder.addButton({ title: 'Clear' }).on('click', () => { comp.clear(); });
    folder.addButton({ title: 'Disable' }).on('click', () => { comp.disable(); });
    folder.addButton({ title: 'Enable' }).on('click', () => { comp.enable(); });

    for (const ctrl of comp.list) {
      AddFXController(ctrl, folder);
    }

    return folder;
  }

  function AddFXController (ctrl, pane, options = { title: `FX ${FXMap[ctrl.type]}` }) {
    const folder = pane.addFolder(options);

    for (const key in ctrl) {
      if (key.startsWith('_')) continue;

      if (key === 'type') continue;

      const val = ctrl[key];
      const typ = typeof val;

      if (typ !== 'number' && typ !== 'boolean') continue;

      if (key === 'alpha') {
        folder.addInput(ctrl, key, { min: 0, max: 1 });

        continue;
      }

      if (key === 'axis' || key === 'direction') {
        folder.addInput(ctrl, key, { min: 0, max: 1, step: 1 });

        continue;
      }

      if (key === 'color' || key === 'color1' || key === 'color2' || key === 'backgroundColor') {
        folder.addInput(ctrl, key, { view: 'color' });

        continue;
      }

      if (key === 'progress') {
        folder.addInput(ctrl, key, { min: 0, max: 1 });

        continue;
      }

      if (key === 'quality') {
        folder.addInput(ctrl, key, { options: { low: 0, medium: 1, high: 2 } });

        continue;
      }

      if (key === 'samples') {
        folder.addInput(ctrl, key, { min: 1, max: 12, step: 1 });

        continue;
      }

      if (key === 'steps') {
        folder.addInput(ctrl, key, { min: 1, max: 10, step: 1 });

        continue;
      }

      folder.addInput(ctrl, key);
    }

    return folder;
  }

  function AddPipelines (pipelines, pane, options = { title: 'Pipelines' }) {
    const folder = pane.addFolder(options);

    for (const pipeline of pipelines) {
      folder.addInput(pipeline, 'active', { label: `${pipeline.name} active` });
    }

    return folder;
  }

  function AddPipeline (pipeline, pane, options = { title: `${pipeline.isPost ? 'Post Pipeline' : 'Pipeline'} “${pipeline.name}”` }) {
    const folder = pane.addFolder(options);

    folder.addInput(pipeline, 'active');
    // What else?

    return folder;
  }

  function FormatLength (len) {
    return len.toFixed(0);
  }

  function InspectByName (name, gameObjects, pane) {
    if (name === null) return;

    const gameObject = GetFirst(gameObjects, 'name', name);

    if (!gameObject) {
      console.info('No game object found with name "%s"', name);

      return;
    }

    const newPane = AddGameObject(gameObject, pane);

    console.info('Added folder %s to folder %s', newPane.title, pane.title);
  }

  function InspectByType (type, gameObjects, pane) {
    if (!type) return;

    const gameObject = GetFirst(gameObjects, 'type', type);

    if (!gameObject) {
      console.info('No game object found with type "%s"', type);

      return;
    }

    const newPane = AddGameObject(gameObject, pane);

    console.info('Added folder %s to folder %s', newPane.title, pane.title);
  }

  function InspectByIndex (index, gameObjects, pane) {
    if (index === null || index < 0) return;

    index = Number(index);

    const gameObject = gameObjects[index];

    if (!gameObject) {
      console.info('No game object found at index %s', index);

      return;
    }

    const newPane = AddGameObject(gameObject, pane);

    console.info('Added folder %s to folder %s', newPane.title, pane.title);
  }

  class InspectorGlobalPlugin extends Phaser.Plugins.BasePlugin {
    constructor (pluginManager) {
      if (Phaser.VERSION.split('.')[1] < 60) {
        throw new Error('Phaser v3.60 is required');
      }

      super(pluginManager);

      this.pane = null;
      this.style = null;
    }

    init (data) {
    }

    start () {
      this.pane = new tweakpane.Pane({ title: 'Inspector' });

      this.add();

      this.style = document.createElement('style');
      this.style.innerText = '.tp-dfwv { top: 8px; bottom: 8px; width: 320px; overflow: auto; }';
      document.head.appendChild(this.style);
    }

    stop () {
      document.head.removeChild(this.style);
      this.style = null;
      this.pane.dispose();
      this.pane = null;
    }

    destroy () {
      this.stop();
      super.destroy();
    }

    add () {
      const { game, pane } = this;
      const { anims, cache, device, input, loop, registry, renderer, scale, scene, sound, textures } = game;
      const { keyboard, touch } = input;

      pane.addButton({ title: 'Refresh' }).on('click', () => { console.time('refresh'); pane.refresh(); console.timeEnd('refresh'); });

      const folder = pane.addFolder({ title: 'Game', expanded: false });

      folder.addMonitor(game, 'hasFocus');
      folder.addMonitor(game, 'isPaused');
      folder.addButton({ title: 'Pause' }).on('click', () => { console.info('Pause game'); game.pause(); });
      folder.addButton({ title: 'Resume' }).on('click', () => { console.info('Resume game'); game.pause(); });
      folder.addButton({ title: 'Step' }).on('click', () => { const t = performance.now(); const dt = loop._target; console.info('step', t, dt); game.step(t, dt); });
      folder.addButton({ title: 'Destroy' }).on('click', () => { console.info('Destroy game'); game.destroy(true); });

      const animsFolder = folder.addFolder({ title: 'Animations', expanded: false });
      animsFolder.addButton({ title: 'Pause all' }).on('click', () => { console.info('Pause all animations'); anims.pauseAll(); });
      animsFolder.addButton({ title: 'Resume all' }).on('click', () => { console.info('Resume all animations'); anims.resumeAll(); });
      animsFolder.addButton({ title: 'Print animations' }).on('click', () => { console.info('Animations:'); console.table(anims.anims.getArray().map(animToPrint)); });
      animsFolder.addButton({ title: 'Print JSON' }).on('click', () => { console.info(JSON.stringify(anims.toJSON())); });

      const cacheFolder = folder.addFolder({ title: 'Cache', expanded: false });
      cacheFolder.addButton({ title: 'Print cache contents' }).on('click', () => { printCaches(cache); });

      const configFolder = folder.addFolder({ title: 'Config', expanded: false });
      configFolder.addButton({ title: 'Print game config' }).on('click', () => { console.info('Game config (partial):'); console.table(copyToSafeObj(game.config)); });

      const deviceFolder = folder.addFolder({ title: 'Device', expanded: false });
      deviceFolder.addButton({ title: 'Print device info' }).on('click', () => { console.info('Device:'); printDevice(device); });

      const inputFolder = folder.addFolder({ title: 'Input', expanded: false });
      inputFolder.addMonitor(input, 'isOver');
      inputFolder.addInput(input, 'enabled');
      inputFolder.addInput(input, 'globalTopOnly');

      for (const pointer of input.pointers) {
        AddPointer(pointer, inputFolder);
      }

      const keyboardFolder = folder.addFolder({ title: 'Keyboard', expanded: false });
      keyboardFolder.addInput(keyboard, 'enabled');
      keyboardFolder.addMonitor(keyboard, 'preventDefault');

      if (touch) {
        const touchFolder = folder.addFolder({ title: 'Touch', expanded: false });
        touchFolder.addInput(touch, 'capture');
        touchFolder.addInput(touch, 'enabled');
      }

      const loopProxy = {
        get 'getDuration()' () { return loop.getDuration(); }
      };
      const loopFolder = folder.addFolder({ title: 'Loop', expanded: false });
      loopFolder.addMonitor(loop, 'actualFps', { view: 'graph', min: 0, max: 120 });
      loopFolder.addMonitor(loop, 'delta', { view: 'graph', min: 0, max: 50 });
      loopFolder.addMonitor(loop, 'frame', { format: Math.floor });
      loopFolder.addMonitor(loopProxy, 'getDuration()');
      loopFolder.addMonitor(loop, 'now');
      loopFolder.addMonitor(loop, 'rawDelta', { view: 'graph', min: 0, max: 50 });
      loopFolder.addMonitor(loop, 'running');
      loopFolder.addMonitor(loop, 'startTime');
      loopFolder.addMonitor(loop, 'time');
      loopFolder.addButton({ title: 'Sleep' }).on('click', () => { console.info('Sleep game loop'); loop.sleep(); });
      loopFolder.addButton({ title: 'Wake' }).on('click', () => { console.info('Wake game loop'); loop.wake(); });
      loopFolder.addButton({ title: 'Step' }).on('click', () => { const t = performance.now(); console.info('step', t); loop.step(t); });

      const registryFolder = folder.addFolder({ title: 'Registry', expanded: false });
      registryFolder.addButton({ title: 'Print registry values' }).on('click', () => { console.info('Registry:'); console.table(registry.getAll()); });

      const rendererFolder = folder.addFolder({ title: 'Renderer', expanded: false });
      if (renderer.type === Phaser.CANVAS) {
        rendererFolder.addInput(renderer, 'antialias');
        rendererFolder.addMonitor(renderer, 'drawCount', { view: 'graph', min: 0, max: 100 });
      }
      rendererFolder.addButton({ title: 'Snapshot' }).on('click', () => {
        console.info('Snapshot');
        renderer.snapshot(snapshot);
      });
      rendererFolder.addButton({ title: 'Print config' }).on('click', () => { console.info('Renderer config:'); console.table(copyToSafeObj(renderer.config)); });

      const scaleFolder = folder.addFolder({ title: 'Scale', expanded: false });
      scaleFolder.addMonitor(scale, 'width');
      scaleFolder.addMonitor(scale, 'height');
      scaleFolder.addButton({ title: 'Start full screen' }).on('click', () => { console.info('Start fullscreen'); scale.startFullscreen(); });
      scaleFolder.addButton({ title: 'Stop full screen' }).on('click', () => { console.info('Stop fullscreen'); scale.stopFullscreen(); });

      const sceneFolder = folder.addFolder({ title: 'Scenes', expanded: false });
      sceneFolder.addButton({ title: 'Print scenes' }).on('click', () => { console.info('Scenes:'); console.table(scene.scenes.map(sceneToPrint)); });

      const soundFolder = folder.addFolder({ title: 'Sound', expanded: false });
      soundFolder.addInput(sound, 'mute');
      soundFolder.addInput(sound, 'pauseOnBlur');
      soundFolder.addMonitor(sound.sounds, 'length', { label: 'sounds (length)', format: FormatLength });
      soundFolder.addInput(sound, 'volume', { min: 0, max: 1, step: 0.1 });
      soundFolder.addButton({ title: 'Pause all' }).on('click', () => { console.info('Pause all sounds'); sound.pauseAll(); });
      soundFolder.addButton({ title: 'Remove all' }).on('click', () => { console.info('Remove all sounds'); sound.removeAll(); });
      soundFolder.addButton({ title: 'Resume all' }).on('click', () => { console.info('Resume all sounds'); sound.resumeAll(); });
      soundFolder.addButton({ title: 'Stop all' }).on('click', () => { console.info('Stop all sounds'); sound.stopAll(); });
      soundFolder.addButton({ title: 'Print sounds' }).on('click', () => { console.info('Sounds:'); console.table(sound.sounds.map(soundToPrint)); });

      const texturesFolder = folder.addFolder({ title: 'Textures', expanded: false });
      texturesFolder.addButton({ title: 'Print textures' }).on('click', () => { console.info('Textures:'); console.table(Object.values(textures.list).map(textureToPrint)); });
    }
  }

  const GLOBAL_PLUGIN_KEY = 'InspectorGlobalPlugin';
  const GLOBAL_PLUGIN_MAPPING = 'inspectorGame';
  const SCENE_PLUGIN_KEY = 'InspectorScenePlugin';
  const SCENE_PLUGIN_SCENE_MAPPING = 'inspectorScene';
  const SCENE_PLUGIN_SYS_MAPPING = 'inspectorScene';

  const {
    CREATE,
    DESTROY,
    START
  } = Phaser.Scenes.Events;

  class InspectorScenePlugin extends Phaser.Plugins.ScenePlugin {
    constructor (scene, pluginManager) {
      super(scene, pluginManager);

      this.folder = null;
      this.pane = null;
    }

    boot () {
      this.pane = this.pluginManager.get(GLOBAL_PLUGIN_KEY).pane;
      this.folder = this.pane.addFolder({ title: `Scene “${this.systems.settings.key}”`, expanded: false });

      this.systems.events
        .on(DESTROY, this.sceneDestroy, this);

      this.add();
    }

    destroy () {
      this.folder.dispose();
      this.folder = null;

      this.systems.events
        .off(DESTROY, this.sceneDestroy, this);

      super.destroy();
    }

    sceneDestroy () {
      this.destroy();
    }

    add () {
      const { arcadePhysics, cameras, data, displayList, events, input, load, lights, matterPhysics, scenePlugin, time, tweens, updateList } = this.systems;
      const sceneKey = scenePlugin.settings.key;

      const camerasFolder = this.folder.addFolder({ title: 'Cameras', expanded: false });
      camerasFolder.addButton({ title: 'Print cameras' }).on('click', () => { console.info('Cameras:'); console.table(cameras.cameras.map(cameraToPrint)); });

      if (data) {
        const dataFolder = this.folder.addFolder({ title: 'Data', expanded: false });
        dataFolder.addButton({ title: 'Print data' }).on('click', () => { console.info('Data:'); console.table(data.getAll()); });
      }

      const displayListFolder = this.folder.addFolder({ title: 'Display List', expanded: false });
      displayListFolder.addMonitor(displayList, 'length', { format: FormatLength });
      displayListFolder.addButton({ title: 'Print' }).on('click', () => { console.info('Display list:'); console.table(displayList.getChildren().map(displayListItemToPrint)); });
      displayListFolder.addButton({ title: 'Save JSON' }).on('click', () => { load.saveJSON(displayList.getChildren(), `${sceneKey} displayList.json`); });
      displayListFolder.addButton({ title: 'Inspect by name …' }).on('click', () => { InspectByName(prompt('Inspect first game object on display list with name:'), displayList.getChildren(), this.pane); });
      displayListFolder.addButton({ title: 'Inspect by type …' }).on('click', () => { InspectByType(prompt('Inspect first game object on display list with type:'), displayList.getChildren(), this.pane); });
      displayListFolder.addButton({ title: 'Inspect by index …' }).on('click', () => { InspectByIndex(prompt(`Inspect game object on display list at index (0 to ${displayList.length - 1}):`), displayList.getChildren(), this.pane); });

      if (input) {
        const { gamepad, keyboard } = input;
        const inputFolder = this.folder.addFolder({ title: 'Input', expanded: false });
        inputFolder.addInput(input, 'dragDistanceThreshold', { min: 0, max: 32, step: 1 });
        inputFolder.addInput(input, 'dragTimeThreshold', { min: 0, max: 100, step: 10 });
        inputFolder.addInput(input, 'enabled');
        inputFolder.addMonitor(input, 'pollRate');
        inputFolder.addInput(input, 'topOnly');
        inputFolder.addMonitor(input, 'x');
        inputFolder.addMonitor(input, 'y');
        inputFolder.addButton({ title: 'Set poll always' }).on('click', () => { console.info('Poll always'); input.setPollAlways(); });
        inputFolder.addButton({ title: 'Set poll on move' }).on('click', () => { console.info('Poll on move'); input.setPollOnMove(); });
        inputFolder.addButton({ title: 'Print game objects' }).on('click', () => { console.info('Interactive game objects: '); console.table(input._list.map(displayListItemToPrint)); });

        if (gamepad) {
          const gamepadFolder = this.folder.addFolder({ title: 'Gamepads', expanded: false });
          gamepadFolder.addInput(gamepad, 'enabled');
          gamepadFolder.addMonitor(gamepad, 'total');
        }

        const keyboardFolder = this.folder.addFolder({ title: 'Keyboard', expanded: false });
        keyboardFolder.addInput(keyboard, 'enabled');
        keyboardFolder.addButton({ title: 'Clear captures' }).on('click', () => { console.info('Clear key captures'); keyboard.clearCaptures(); });
        keyboardFolder.addButton({ title: 'Remove all keys' }).on('click', () => { console.info('Remove all keys'); keyboard.removeAllKeys(); });
        keyboardFolder.addButton({ title: 'Reset keys' }).on('click', () => { console.info('Reset keys'); keyboard.resetKeys(); });
        keyboardFolder.addButton({ title: 'Print captures' }).on('click', () => { console.info('Key captures:'); console.table(keyboard.getCaptures()); });
        keyboardFolder.addButton({ title: 'Print keys' }).on('click', () => { console.info('Keys:'); console.table(keyboard.keys.map(keyToPrint)); });
      }

      if (lights) {
        const lightsFolder = this.folder.addFolder({ title: 'Lights', expanded: false });
        lightsFolder.addInput(lights, 'active');
        lightsFolder.addInput(lights, 'ambientColor', { color: { type: 'float' } });
        lightsFolder.addMonitor(lights, 'visibleLights', { format: FormatLength });
        lightsFolder.addButton({ title: 'Print lights' }).on('click', () => { console.info('Lights:'); console.table(lights.lights.map(lightToPrint)); });
      }

      if (load) {
        const loadFolder = this.folder.addFolder({ title: 'Load', expanded: false });
        loadFolder.addMonitor(load, 'progress', { view: 'graph', min: 0, max: 1 });
        loadFolder.addMonitor(load, 'totalComplete');
        loadFolder.addMonitor(load, 'totalFailed');
        loadFolder.addMonitor(load, 'totalToLoad');
      }

      const scenePluginFolder = this.folder.addFolder({ title: 'Scene', expanded: false });
      scenePluginFolder.addMonitor(scenePlugin.settings, 'active');
      scenePluginFolder.addMonitor(scenePlugin.settings, 'visible');
      scenePluginFolder.addMonitor(scenePlugin.settings, 'status');
      scenePluginFolder.addButton({ title: 'Pause' }).on('click', () => { console.info('Pause scene', sceneKey); scenePlugin.pause(); });
      scenePluginFolder.addButton({ title: 'Resume' }).on('click', () => { console.info('Resume scene', sceneKey); scenePlugin.resume(); });
      scenePluginFolder.addButton({ title: 'Sleep' }).on('click', () => { console.info('Sleep scene', sceneKey); scenePlugin.sleep(); });
      scenePluginFolder.addButton({ title: 'Wake' }).on('click', () => { console.info('Wake scene', sceneKey); scenePlugin.wake(); });
      scenePluginFolder.addButton({ title: 'Stop' }).on('click', () => { console.info('Stop scene', sceneKey); scenePlugin.stop(); });
      scenePluginFolder.addButton({ title: 'Restart' }).on('click', () => { console.info('Restart scene', sceneKey); scenePlugin.restart(); });
      scenePluginFolder.addButton({ title: 'Remove' }).on('click', () => { console.info('Remove scene', sceneKey); scenePlugin.remove(); });
      scenePluginFolder.addButton({ title: 'Print scene data' }).on('click', () => { console.info(`Scene data for ${sceneKey}:`); console.table(scenePlugin.settings.data); });

      if (time) {
        const timeFolder = this.folder.addFolder({ title: 'Time', expanded: false });
        timeFolder.addMonitor(time._active, 'length', { label: 'events (length)', format: FormatLength });
        timeFolder.addMonitor(time, 'now');
        timeFolder.addInput(time, 'paused');
        timeFolder.addButton({ title: 'Print timer events' }).on('click', () => { console.info('Timer events:'); console.table(time._active.map(timerEventToPrint)); });
      }

      if (tweens) {
        const tweensFolder = this.folder.addFolder({ title: 'Tweens', expanded: false });
        tweensFolder.addInput(tweens, 'timeScale', { min: 0.1, max: 10, step: 0.1 });
        tweensFolder.addButton({ title: 'Pause all' }).on('click', () => { console.info('Pause all tweens'); tweens.pauseAll(); });
        tweensFolder.addButton({ title: 'Resume all' }).on('click', () => { console.info('Resume all tweens'); tweens.resumeAll(); });
        tweensFolder.addButton({ title: 'Stop all' }).on('click', () => { console.info('Stop all tweens'); tweens.killAll(); });
        tweensFolder.addButton({ title: 'Print tweens' }).on('click', () => { console.info('Tweens:'); console.table(tweens.getTweens().map(tweenToPrint)); });
      }

      const updateListFolder = this.folder.addFolder({ title: 'Update List', expanded: false });
      updateListFolder.addMonitor(updateList, 'length', { format: FormatLength });
      updateListFolder.addButton({ title: 'Print' }).on('click', () => { console.info('Update list:'); console.table(updateList.getActive().map(updateListItemToPrint)); });
      updateListFolder.addButton({ title: 'Save JSON' }).on('click', () => { load.saveJSON(updateList.getActive(), `${sceneKey} updateList.json`); });
      updateListFolder.addButton({ title: 'Inspect by name …' }).on('click', () => { InspectByName(prompt('Inspect first game object on update list with name:'), updateList.getActive(), this.pane); });
      updateListFolder.addButton({ title: 'Inspect by type …' }).on('click', () => { InspectByType(prompt('Inspect first game object on update list with type:'), updateList.getActive(), this.pane); });
      updateListFolder.addButton({ title: 'Inspect by index …' }).on('click', () => { InspectByIndex(prompt(`Inspect game object on update list at index (0 to ${updateList.length - 1}):`), updateList.getActive(), this.pane); });

      events.on(CREATE, () => {
        for (const cam of cameras.cameras) { AddCamera(cam, camerasFolder); }
      });

      if (arcadePhysics) {
        events.on(START, () => { AddArcadePhysicsWorld(arcadePhysics.world, this.folder); });
      }

      if (matterPhysics) {
        events.on(START, () => { AddMatterPhysicsWorld(matterPhysics.world, this.folder); });
      }
    }
  }

  const DefaultPluginsConfig = {
    global: [{ key: GLOBAL_PLUGIN_KEY, plugin: InspectorGlobalPlugin, mapping: GLOBAL_PLUGIN_MAPPING }],
    scene: [{ key: SCENE_PLUGIN_KEY, plugin: InspectorScenePlugin, mapping: SCENE_PLUGIN_SCENE_MAPPING }]
  };

  function Install (pluginsManager) {
    pluginsManager.install(GLOBAL_PLUGIN_KEY, InspectorGlobalPlugin, true, GLOBAL_PLUGIN_MAPPING);
    pluginsManager.installScenePlugin(SCENE_PLUGIN_KEY, InspectorScenePlugin, SCENE_PLUGIN_SCENE_MAPPING);

    for (const scene of pluginsManager.game.scene.scenes) {
      const plugin = new InspectorScenePlugin(scene, pluginsManager);

      scene[SCENE_PLUGIN_SCENE_MAPPING] = plugin;
      scene.sys[SCENE_PLUGIN_SYS_MAPPING] = plugin;

      plugin.boot();
    }
  }

  exports.AddAnimationState = AddAnimationState;
  exports.AddArcadeBody = AddArcadeBody;
  exports.AddArcadePhysicsWorld = AddArcadePhysicsWorld;
  exports.AddCamera = AddCamera;
  exports.AddFXComponent = AddFXComponent;
  exports.AddFXController = AddFXController;
  exports.AddGameObject = AddGameObject;
  exports.AddGroup = AddGroup;
  exports.AddInput = AddInput;
  exports.AddKey = AddKey;
  exports.AddKeys = AddKeys;
  exports.AddLight = AddLight;
  exports.AddMatterPhysicsWorld = AddMatterPhysicsWorld;
  exports.AddParticleEmitter = AddParticleEmitter;
  exports.AddPipeline = AddPipeline;
  exports.AddPointer = AddPointer;
  exports.AddSound = AddSound;
  exports.AddTimerEvent = AddTimerEvent;
  exports.AddTween = AddTween;
  exports.DefaultPluginsConfig = DefaultPluginsConfig;
  exports.InspectorGlobalPlugin = InspectorGlobalPlugin;
  exports.InspectorScenePlugin = InspectorScenePlugin;
  exports.Install = Install;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
