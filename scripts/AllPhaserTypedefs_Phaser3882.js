﻿/**
 * An object containing the position and color data for a single pixel in a CanvasTexture.
 *
 * @typedef {object} Phaser.Types.Textures.StampConfig
 * @since 3.60.0
 *
 * @property {number} [alpha=1] -  The alpha value used by the stamp.
 * @property {number} [tint=0xffffff] -  The tint color value used by the stamp. WebGL only.
 * @property {number} [angle=0] - The angle of the stamp in degrees. Rotation takes place around its origin.
 * @property {number} [rotation=0] - The rotation of the stamp in radians. Rotation takes place around its origin.
 * @property {number} [scale=1] - Sets both the horizontal and vertical scale of the stamp with a single value.
 * @property {number} [scaleX=1] - Set the horizontal scale of the stamp. Overrides the scale property, if provided.
 * @property {number} [scaleY=1] - Set the vertical scale of the stamp. Overrides the scale property, if provided.
 * @property {number} [originX=0.5] - The horizontal origin of the stamp. 0 is the left, 0.5 is the center and 1 is the right.
 * @property {number} [originY=0.5] - The vertical origin of the stamp. 0 is the top, 0.5 is the center and 1 is the bottom.
 * @property {(string|Phaser.BlendModes|number)} [blendMode=0] - The blend mode used when drawing the stamp. Defaults to 0 (normal).
 * @property {boolean} [erase=false] - Erase this stamp from the texture?
 * @property {boolean} [skipBatch=false] - Skip beginning and ending a batch with this call. Use if this is part of a bigger batched draw.
 */
/**
 * @typedef {object} Phaser.Types.Textures.SpriteSheetFromAtlasConfig
 * @since 3.0.0
 * 
 * @property {string} atlas - The key of the Texture Atlas in which this Sprite Sheet can be found.
 * @property {string} frame - The key of the Texture Atlas Frame in which this Sprite Sheet can be found.
 * @property {number} frameWidth - The fixed width of each frame.
 * @property {number} [frameHeight] - The fixed height of each frame. If not set it will use the frameWidth as the height.
 * @property {number} [startFrame=0] - Skip a number of frames. Useful when there are multiple sprite sheets in one Texture.
 * @property {number} [endFrame=-1] - The total number of frames to extract from the Sprite Sheet. The default value of -1 means "extract all frames".
 * @property {number} [margin=0] - If the frames have been drawn with a margin, specify the amount here.
 * @property {number} [spacing=0] - If the frames have been drawn with spacing between them, specify the amount here.
 */
/**
 * @typedef {object} Phaser.Types.Textures.SpriteSheetConfig
 * @since 3.0.0
 * 
 * @property {number} frameWidth - The fixed width of each frame.
 * @property {number} [frameHeight] - The fixed height of each frame. If not set it will use the frameWidth as the height.
 * @property {number} [startFrame=0] - Skip a number of frames. Useful when there are multiple sprite sheets in one Texture.
 * @property {number} [endFrame=-1] - The total number of frames to extract from the Sprite Sheet. The default value of -1 means "extract all frames".
 * @property {number} [margin=0] - If the frames have been drawn with a margin, specify the amount here.
 * @property {number} [spacing=0] - If the frames have been drawn with spacing between them, specify the amount here.
 */
/**
 * An object containing the position and color data for a single pixel in a CanvasTexture.
 *
 * @typedef {object} Phaser.Types.Textures.PixelConfig
 * @since 3.16.0
 *
 * @property {number} x - The x-coordinate of the pixel.
 * @property {number} y - The y-coordinate of the pixel.
 * @property {number} color - The color of the pixel, not including the alpha channel.
 * @property {number} alpha - The alpha of the pixel, between 0 and 1.
 */
/**
 * A Mipmap Data entry for a Compressed Texture.
 *
 * @typedef {object} Phaser.Types.Textures.MipmapType
 * @since 3.60.0
 *
 * @property {number} width - The width of this level of the mipmap.
 * @property {number} height - The height of this level of the mipmap.
 * @property {Uint8Array} data - The decoded pixel data.
 */
/**
 * @typedef {object} Phaser.Types.Animations.PlayAnimationConfig
 * @since 3.50.0
 *
 * @property {(string|Phaser.Animations.Animation)} key - The string-based key of the animation to play, or an Animation instance.
 * @property {number} [frameRate] - The frame rate of playback in frames per second (default 24 if duration is null)
 * @property {number} [duration] - How long the animation should play for in milliseconds. If not given its derived from frameRate.
 * @property {number} [delay] - Delay before starting playback. Value given in milliseconds.
 * @property {number} [repeat] - Number of times to repeat the animation (-1 for infinity)
 * @property {number} [repeatDelay] - Delay before the animation repeats. Value given in milliseconds.
 * @property {boolean} [yoyo] - Should the animation yoyo? (reverse back down to the start) before repeating?
 * @property {boolean} [showBeforeDelay] - If this animation has a delay, should it show the first frame immediately (true), or only after the delay (false)
 * @property {boolean} [showOnStart] - Should sprite.visible = true when the animation starts to play?
 * @property {boolean} [hideOnComplete] - Should sprite.visible = false when the animation finishes?
 * @property {boolean} [skipMissedFrames] - Skip frames if the time lags, or always advanced anyway?
 * @property {number} [startFrame] - The frame of the animation to start playback from.
 * @property {number} [timeScale] - The time scale to be applied to playback of this animation.
 * @property {boolean} [randomFrame] - Start playback of this animation from a randomly selected frame?
 */
/**
 * @typedef {object} Phaser.Types.Animations.JSONAnimations
 * @since 3.0.0
 *
 * @property {Phaser.Types.Animations.JSONAnimation[]} anims - An array of all Animations added to the Animation Manager.
 * @property {number} globalTimeScale - The global time scale of the Animation Manager.
 */
/**
 * @typedef {object} Phaser.Types.Animations.JSONAnimationFrame
 * @since 3.0.0
 *
 * @property {string} key - The key of the Texture this AnimationFrame uses.
 * @property {(string|number)} frame - The key of the Frame within the Texture that this AnimationFrame uses.
 * @property {number} duration - Additional time (in ms) that this frame should appear for during playback.
 */
/**
 * @typedef {object} Phaser.Types.Animations.JSONAnimation
 * @since 3.0.0
 *
 * @property {string} key - The key that the animation will be associated with. i.e. sprite.animations.play(key)
 * @property {string} type - A frame based animation (as opposed to a bone based animation)
 * @property {Phaser.Types.Animations.JSONAnimationFrame[]} frames - An array of the AnimationFrame objects inside this Animation.
 * @property {number} frameRate - The frame rate of playback in frames per second (default 24 if duration is null)
 * @property {number} duration - How long the animation should play for in milliseconds. If not given its derived from frameRate.
 * @property {boolean} skipMissedFrames - Skip frames if the time lags, or always advanced anyway?
 * @property {number} delay - Delay before starting playback. Value given in milliseconds.
 * @property {number} repeat - Number of times to repeat the animation (-1 for infinity)
 * @property {number} repeatDelay - Delay before the animation repeats. Value given in milliseconds.
 * @property {boolean} yoyo - Should the animation yoyo? (reverse back down to the start) before repeating?
 * @property {boolean} showBeforeDelay - If this animation has a delay, should it show the first frame immediately (true), or only after the delay (false)
 * @property {boolean} showOnStart - Should sprite.visible = true when the animation starts to play?
 * @property {boolean} hideOnComplete - Should sprite.visible = false when the animation finishes?
 * @property {boolean} [randomFrame] - Start playback of this animation from a randomly selected frame?
 */
/**
 * @typedef {object} Phaser.Types.Animations.GenerateFrameNumbers
 * @since 3.0.0
 *
 * @property {number} [start=0] - The starting frame of the animation.
 * @property {number} [end=-1] - The ending frame of the animation.
 * @property {(boolean|number)} [first=false] - A frame to put at the beginning of the animation, before `start` or `outputArray` or `frames`.
 * @property {Phaser.Types.Animations.AnimationFrame[]} [outputArray=[]] - An array to concatenate the output onto.
 * @property {(boolean|number[])} [frames=false] - A custom sequence of frames.
 */
/**
 * @typedef {object} Phaser.Types.Animations.GenerateFrameNames
 * @since 3.0.0
 *
 * @property {string} [prefix=''] - The string to append to every resulting frame name if using a range or an array of `frames`.
 * @property {number} [start=0] - If `frames` is not provided, the number of the first frame to return.
 * @property {number} [end=0] - If `frames` is not provided, the number of the last frame to return.
 * @property {string} [suffix=''] - The string to append to every resulting frame name if using a range or an array of `frames`.
 * @property {number} [zeroPad=0] - The minimum expected lengths of each resulting frame's number. Numbers will be left-padded with zeroes until they are this long, then prepended and appended to create the resulting frame name.
 * @property {Phaser.Types.Animations.AnimationFrame[]} [outputArray=[]] - The array to append the created configuration objects to.
 * @property {(boolean|number[])} [frames=false] - If provided as an array, the range defined by `start` and `end` will be ignored and these frame numbers will be used.
 */
/**
 * @typedef {object} Phaser.Types.Animations.AnimationFrame
 * @since 3.0.0
 *
 * @property {string} [key] - The key of the texture within the Texture Manager to use for this Animation Frame.
 * @property {(string|number)} [frame] - The key, or index number, of the frame within the texture to use for this Animation Frame.
 * @property {number} [duration=0] - The duration, in ms, of this frame of the animation.
 * @property {boolean} [visible] - Should the parent Game Object be visible during this frame of the animation?
 */
/**
 * @typedef {object} Phaser.Types.Animations.Animation
 * @since 3.0.0
 *
 * @property {string} [key] - The key that the animation will be associated with. i.e. sprite.animations.play(key)
 * @property {string|Phaser.Types.Animations.AnimationFrame[]} [frames] - Either a string, in which case it will use all frames from a texture with the matching key, or an array of Animation Frame configuration objects.
 * @property {boolean} [sortFrames=true] - If you provide a string for `frames` you can optionally have the frame names numerically sorted.
 * @property {string} [defaultTextureKey=null] - The key of the texture all frames of the animation will use. Can be overridden on a per frame basis.
 * @property {number} [frameRate] - The frame rate of playback in frames per second (default 24 if duration is null)
 * @property {number} [duration] - How long the animation should play for in milliseconds. If not given its derived from frameRate.
 * @property {boolean} [skipMissedFrames=true] - Skip frames if the time lags, or always advanced anyway?
 * @property {number} [delay=0] - Delay before starting playback. Value given in milliseconds.
 * @property {number} [repeat=0] - Number of times to repeat the animation (-1 for infinity)
 * @property {number} [repeatDelay=0] - Delay before the animation repeats. Value given in milliseconds.
 * @property {boolean} [yoyo=false] - Should the animation yoyo? (reverse back down to the start) before repeating?
 * @property {boolean} [showBeforeDelay=false] - If this animation has a delay, should it show the first frame immediately (true), or only after the delay (false)
 * @property {boolean} [showOnStart=false] - Should sprite.visible = true when the animation starts to play? This happens _after_ any delay, if set.
 * @property {boolean} [hideOnComplete=false] - Should sprite.visible = false when the animation finishes?
 * @property {boolean} [randomFrame=false] - Start playback of this animation from a randomly selected frame?
 */
/**
 * @typedef {object} Phaser.Types.Actions.GridAlignConfig
 * @since 3.0.0
 *
 * @property {number} [width=-1] - The width of the grid in items (not pixels). -1 means lay all items out horizontally, regardless of quantity.
 *                                  If both this value and height are set to -1 then this value overrides it and the `height` value is ignored.
 * @property {number} [height=-1] - The height of the grid in items (not pixels). -1 means lay all items out vertically, regardless of quantity.
 *                                   If both this value and `width` are set to -1 then `width` overrides it and this value is ignored.
 * @property {number} [cellWidth=1] - The width of the cell, in pixels, in which the item is positioned.
 * @property {number} [cellHeight=1] - The height of the cell, in pixels, in which the item is positioned.
 * @property {number} [position=0] - The alignment position. One of the Phaser.Display.Align consts such as `TOP_LEFT` or `RIGHT_CENTER`.
 * @property {number} [x=0] - Optionally place the top-left of the final grid at this coordinate.
 * @property {number} [y=0] - Optionally place the top-left of the final grid at this coordinate.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Vertex
 * @since 3.50.0
 *
 * @property {number} x - The x coordinate of the vertex.
 * @property {number} y - The y coordinate of the vertex.
 * @property {number} z - The z coordinate of the vertex.
 * @property {number} normalX - The x normal of the vertex.
 * @property {number} normalY - The y normal of the vertex.
 * @property {number} normalZ - The z normal of the vertex.
 * @property {number} u - UV u texture coordinate of the vertex.
 * @property {number} v - UV v texture coordinate of the vertex.
 * @property {number} alpha - The alpha value of the vertex.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.JSONGameObject
 * @since 3.0.0
 *
 * @property {string} name - The name of this Game Object.
 * @property {string} type - A textual representation of this Game Object, i.e. `sprite`.
 * @property {number} x - The x position of this Game Object.
 * @property {number} y - The y position of this Game Object.
 * @property {object} scale - The scale of this Game Object
 * @property {number} scale.x - The horizontal scale of this Game Object.
 * @property {number} scale.y - The vertical scale of this Game Object.
 * @property {object} origin - The origin of this Game Object.
 * @property {number} origin.x - The horizontal origin of this Game Object.
 * @property {number} origin.y - The vertical origin of this Game Object.
 * @property {boolean} flipX - The horizontally flipped state of the Game Object.
 * @property {boolean} flipY - The vertically flipped state of the Game Object.
 * @property {number} rotation - The angle of this Game Object in radians.
 * @property {number} alpha - The alpha value of the Game Object.
 * @property {boolean} visible - The visible state of the Game Object.
 * @property {number} scaleMode - The Scale Mode being used by this Game Object.
 * @property {(number|string)} blendMode - Sets the Blend Mode being used by this Game Object.
 * @property {string} textureKey - The texture key of this Game Object.
 * @property {string} frameKey - The frame key of this Game Object.
 * @property {object} data - The data of this Game Object.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.GetCalcMatrixResults
 * @since 3.50.0
 *
 * @property {Phaser.GameObjects.Components.TransformMatrix} camera - The calculated Camera matrix.
 * @property {Phaser.GameObjects.Components.TransformMatrix} sprite - The calculated Sprite (Game Object) matrix.
 * @property {Phaser.GameObjects.Components.TransformMatrix} calc - The calculated results matrix, factoring all others in.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.GameObjectConfig
 * @since 3.0.0
 *
 * @property {(number|object)} [x=0] - The x position of the Game Object.
 * @property {(number|object)} [y=0] - The y position of the Game Object.
 * @property {number} [depth=0] - The depth of the GameObject.
 * @property {boolean} [flipX=false] - The horizontally flipped state of the Game Object.
 * @property {boolean} [flipY=false] - The vertically flipped state of the Game Object.
 * @property {?(number|object)} [scale=null] - The scale of the GameObject.
 * @property {?(number|object)} [scrollFactor=null] - The scroll factor of the GameObject.
 * @property {(number|object)} [rotation=0] - The rotation angle of the Game Object, in radians.
 * @property {?(number|object)} [angle=null] - The rotation angle of the Game Object, in degrees.
 * @property {(number|object)} [alpha=1] - The alpha (opacity) of the Game Object.
 * @property {?(number|object)} [origin=null] - The origin of the Game Object.
 * @property {number} [scaleMode=ScaleModes.DEFAULT] - The scale mode of the GameObject.
 * @property {number} [blendMode=BlendModes.DEFAULT] - The blend mode of the GameObject.
 * @property {boolean} [visible=true] - The visible state of the Game Object.
 * @property {boolean} [add=true] - Add the GameObject to the scene.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Face
 * @since 3.50.0
 *
 * @property {Phaser.Types.GameObjects.Vertex} vertex1 - The first face vertex.
 * @property {Phaser.Types.GameObjects.Vertex} vertex2 - The second face vertex.
 * @property {Phaser.Types.GameObjects.Vertex} vertex3 - The third face vertex.
 * @property {boolean} isCounterClockwise - Are the vertices counter-clockwise?
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.DecomposeMatrixResults
 * @since 3.60.0
 *
 * @property {number} translateX - The translated x value.
 * @property {number} translateY - The translated y value.
 * @property {number} rotation - The rotation value.
 * @property {number} scaleX - The scale x value.
 * @property {number} scaleY - The scale y value.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Particles.DeathZoneSource
 * @since 3.0.0
 *
 * @property {Phaser.Types.GameObjects.Particles.DeathZoneSourceCallback} contains
 *
 * @see Phaser.Geom.Circle
 * @see Phaser.Geom.Ellipse
 * @see Phaser.Geom.Polygon
 * @see Phaser.Geom.Rectangle
 * @see Phaser.Geom.Triangle
 */
/**
 * @typedef {Phaser.GameObjects.Particles.Zones.DeathZone|Phaser.Types.GameObjects.Particles.ParticleEmitterDeathZoneConfig|Phaser.Types.GameObjects.Particles.DeathZoneSource} Phaser.Types.GameObjects.Particles.DeathZoneObject
 * @since 3.60.0
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.NineSlice.NineSliceConfig
 * @extends Phaser.Types.GameObjects.GameObjectConfig
 * @since 3.60.0
 *
 * @property {string|Phaser.Textures.Texture} [key] - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @property {string|number} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @property {number} [width=256] - The width of the Nine Slice Game Object. You can adjust the width post-creation.
 * @property {number} [height=256] - The height of the Nine Slice Game Object. If this is a 3 slice object the height will be fixed to the height of the texture and cannot be changed.
 * @property {number} [leftWidth=10] - The size of the left vertical column (A).
 * @property {number} [rightWidth=10] - The size of the right vertical column (B).
 * @property {number} [topHeight=0] - The size of the top horiztonal row (C). Set to zero or undefined to create a 3 slice object.
 * @property {number} [bottomHeight=0] - The size of the bottom horiztonal row (D). Set to zero or undefined to create a 3 slice object.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Mesh.MeshConfig
 * @extends Phaser.Types.GameObjects.GameObjectConfig
 * @since 3.0.0
 *
 * @property {string|Phaser.Textures.Texture} [key] - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @property {string|number} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @property {number[]} [vertices] - The vertices array. Either `xy` pairs, or `xyz` if the `containsZ` parameter is `true`.
 * @property {number[]} [uvs] - The UVs pairs array.
 * @property {number[]} [indicies] - Optional vertex indicies array. If you don't have one, pass `null` or an empty array.
 * @property {boolean} [containsZ=false] - Does the vertices data include a `z` component?
 * @property {number[]} [normals] - Optional vertex normals array. If you don't have one, pass `null` or an empty array.
 * @property {number|number[]} [colors=0xffffff] - An array of colors, one per vertex, or a single color value applied to all vertices.
 * @property {number|number[]} [alphas=1] - An array of alpha values, one per vertex, or a single alpha value applied to all vertices.
 */
/**
 * The total number of objects created will be
 *
 *     key.length * frame.length * frameQuantity * (yoyo ? 2 : 1) * (1 + repeat)
 *
 * If `max` is nonzero, then the total created will not exceed `max`.
 *
 * `key` is required. {@link Phaser.GameObjects.Group#defaultKey} is not used.
 *
 * @typedef {object} Phaser.Types.GameObjects.Group.GroupCreateConfig
 * @since 3.0.0
 *
 * @property {(string|string[])} key - The texture key of each new Game Object. Must be provided or not objects will be created.
 * @property {?Function} [classType] - The class of each new Game Object.
 * @property {?(string|string[]|number|number[])} [frame=null] - The texture frame of each new Game Object.
 * @property {?number} [quantity=false] - The number of Game Objects to create. If set, this overrides the `frameQuantity` value. Use `frameQuantity` for more advanced control.
 * @property {?boolean} [visible=true] - The visible state of each new Game Object.
 * @property {?boolean} [active=true] - The active state of each new Game Object.
 * @property {?number} [repeat=0] - The number of times each `key` × `frame` combination will be *repeated* (after the first combination).
 * @property {?boolean} [randomKey=false] - Select a `key` at random.
 * @property {?boolean} [randomFrame=false] - Select a `frame` at random.
 * @property {?boolean} [yoyo=false] - Select keys and frames by moving forward then backward through `key` and `frame`.
 * @property {?number} [frameQuantity=1] - The number of times each `frame` should be combined with one `key`.
 * @property {?number} [max=0] - The maximum number of new Game Objects to create. 0 is no maximum.
 * @property {?object} [setXY]
 * @property {?number} [setXY.x=0] - The horizontal position of each new Game Object.
 * @property {?number} [setXY.y=0] - The vertical position of each new Game Object.
 * @property {?number} [setXY.stepX=0] - Increment each Game Object's horizontal position from the previous by this amount, starting from `setXY.x`.
 * @property {?number} [setXY.stepY=0] - Increment each Game Object's vertical position from the previous by this amount, starting from `setXY.y`.
 * @property {?object} [setRotation]
 * @property {?number} [setRotation.value=0] - Rotation of each new Game Object.
 * @property {?number} [setRotation.step=0] - Increment each Game Object's rotation from the previous by this amount, starting at `setRotation.value`.
 * @property {?object} [setScale]
 * @property {?number} [setScale.x=0] - The horizontal scale of each new Game Object.
 * @property {?number} [setScale.y=0] - The vertical scale of each new Game Object.
 * @property {?number} [setScale.stepX=0] - Increment each Game Object's horizontal scale from the previous by this amount, starting from `setScale.x`.
 * @property {?number} [setScale.stepY=0] - Increment each Game object's vertical scale from the previous by this amount, starting from `setScale.y`.
 * @property {?object} [setOrigin]
 * @property {?number} [setOrigin.x=0] - The horizontal origin of each new Game Object.
 * @property {?number} [setOrigin.y=0] - The vertical origin of each new Game Object.
 * @property {?number} [setOrigin.stepX=0] - Increment each Game Object's horizontal origin from the previous by this amount, starting from `setOrigin.x`.
 * @property {?number} [setOrigin.stepY=0] - Increment each Game object's vertical origin from the previous by this amount, starting from `setOrigin.y`.
 * @property {?object} [setAlpha]
 * @property {?number} [setAlpha.value=0] - The alpha value of each new Game Object.
 * @property {?number} [setAlpha.step=0] - Increment each Game Object's alpha from the previous by this amount, starting from `setAlpha.value`.
 * @property {?object} [setDepth]
 * @property {?number} [setDepth.value=0] - The depth value of each new Game Object.
 * @property {?number} [setDepth.step=0] - Increment each Game Object's depth from the previous by this amount, starting from `setDepth.value`.
 * @property {?object} [setScrollFactor]
 * @property {?number} [setScrollFactor.x=0] - The horizontal scroll factor of each new Game Object.
 * @property {?number} [setScrollFactor.y=0] - The vertical scroll factor of each new Game Object.
 * @property {?number} [setScrollFactor.stepX=0] - Increment each Game Object's horizontal scroll factor from the previous by this amount, starting from `setScrollFactor.x`.
 * @property {?number} [setScrollFactor.stepY=0] - Increment each Game object's vertical scroll factor from the previous by this amount, starting from `setScrollFactor.y`.
 * @property {?*} [hitArea] - A geometric shape that defines the hit area for the Game Object.
 * @property {?Phaser.Types.Input.HitAreaCallback} [hitAreaCallback] - A callback to be invoked when the Game Object is interacted with.
 * @property {?(false|Phaser.Types.Actions.GridAlignConfig)} [gridAlign=false] - Align the new Game Objects in a grid using these settings.
 *
 * @see Phaser.Actions.GridAlign
 * @see Phaser.Actions.SetAlpha
 * @see Phaser.Actions.SetHitArea
 * @see Phaser.Actions.SetRotation
 * @see Phaser.Actions.SetScale
 * @see Phaser.Actions.SetXY
 * @see Phaser.Actions.SetDepth
 * @see Phaser.Actions.SetScrollFactor
 * @see Phaser.GameObjects.Group#createFromConfig
 * @see Phaser.Utils.Array.Range
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Group.GroupConfig
 * @since 3.0.0
 *
 * @property {?Function} [classType=Sprite] - Sets {@link Phaser.GameObjects.Group#classType}.
 * @property {?string} [name=''] - Sets {@link Phaser.GameObjects.Group#name}.
 * @property {?boolean} [active=true] - Sets {@link Phaser.GameObjects.Group#active}.
 * @property {?number} [maxSize=-1] - Sets {@link Phaser.GameObjects.Group#maxSize}.
 * @property {?string} [defaultKey=null] - Sets {@link Phaser.GameObjects.Group#defaultKey}.
 * @property {?(string|number)} [defaultFrame=null] - Sets {@link Phaser.GameObjects.Group#defaultFrame}.
 * @property {?boolean} [runChildUpdate=false] - Sets {@link Phaser.GameObjects.Group#runChildUpdate}.
 * @property {?Phaser.Types.GameObjects.Group.GroupCallback} [createCallback=null] - Sets {@link Phaser.GameObjects.Group#createCallback}.
 * @property {?Phaser.Types.GameObjects.Group.GroupCallback} [removeCallback=null] - Sets {@link Phaser.GameObjects.Group#removeCallback}.
 * @property {?Phaser.Types.GameObjects.Group.GroupMultipleCreateCallback} [createMultipleCallback=null] - Sets {@link Phaser.GameObjects.Group#createMultipleCallback}.
 */
/**
 * Graphics style settings.
 *
 * @typedef {object} Phaser.Types.GameObjects.Graphics.Styles
 * @since 3.0.0
 *
 * @property {Phaser.Types.GameObjects.Graphics.LineStyle} [lineStyle] - The style applied to shape outlines.
 * @property {Phaser.Types.GameObjects.Graphics.FillStyle} [fillStyle] - The style applied to shape areas.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Graphics.RoundedRectRadius
 * @since 3.11.0
 *
 * @property {number} [tl=20] - Top left corner radius. Draw concave arc if this radius is negative.
 * @property {number} [tr=20] - Top right corner radius. Draw concave arc if this radius is negative.
 * @property {number} [br=20] - Bottom right corner radius. Draw concave arc if this radius is negative.
 * @property {number} [bl=20] - Bottom left corner radius. Draw concave arc if this radius is negative.
 */
/**
 * Options for the Graphics Game Object.
 *
 * @typedef {object} Phaser.Types.GameObjects.Graphics.Options
 * @extends Phaser.Types.GameObjects.Graphics.Styles
 * @since 3.0.0
 *
 * @property {number} [x] - The x coordinate of the Graphics.
 * @property {number} [y] - The y coordinate of the Graphics.
 */
/**
 * Graphics line style (or stroke style) settings.
 *
 * @typedef {object} Phaser.Types.GameObjects.Graphics.LineStyle
 * @since 3.0.0
 *
 * @property {number} [width] - The stroke width.
 * @property {number} [color] - The stroke color.
 * @property {number} [alpha] - The stroke alpha.
 */
/**
 * Graphics fill style settings.
 *
 * @typedef {object} Phaser.Types.GameObjects.Graphics.FillStyle
 * @since 3.0.0
 *
 * @property {number} [color] - The fill color.
 * @property {number} [alpha] - The fill alpha.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Container.ContainerConfig
 * @extends Phaser.Types.GameObjects.GameObjectConfig
 * @since 3.50.0
 *
 * @property {Phaser.GameObjects.GameObject[]} [children] - An optional array of Game Objects to add to the Container.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.BitmapText.TintConfig
 * @since 3.0.0
 * 
 * @property {number} topLeft - The top left tint value. Always zero in canvas.
 * @property {number} topRight - The top right tint value. Always zero in canvas.
 * @property {number} bottomLeft - The bottom left tint value. Always zero in canvas.
 * @property {number} bottomRight - The bottom right tint value. Always zero in canvas.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.BitmapText.RetroFontConfig
 * @since 3.6.0
 * 
 * @property {string} image - The key of the image containing the font.
 * @property {number} offset.x - If the font set doesn't start at the top left of the given image, specify the X coordinate offset here.
 * @property {number} offset.y - If the font set doesn't start at the top left of the given image, specify the Y coordinate offset here.
 * @property {number} width - The width of each character in the font set.
 * @property {number} height - The height of each character in the font set.
 * @property {string} chars - The characters used in the font set, in display order. You can use the TEXT_SET consts for common font set arrangements.
 * @property {number} charsPerRow - The number of characters per row in the font set. If not given charsPerRow will be the image width / characterWidth.
 * @property {number} spacing.x - If the characters in the font set have horizontal spacing between them set the required amount here.
 * @property {number} spacing.y - If the characters in the font set have vertical spacing between them set the required amount here.
 * @property {number} lineSpacing - The amount of vertical space to add to the line height of the font.
*/
/**
 * The position and size of the Bitmap Text in local space, taking just the font size into account.
 *
 * @typedef {object} Phaser.Types.GameObjects.BitmapText.LocalBitmapTextSize
 * @since 3.0.0
 *
 * @property {number} x - The x position of the BitmapText.
 * @property {number} y - The y position of the BitmapText.
 * @property {number} width - The width of the BitmapText.
 * @property {number} height - The height of the BitmapText.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.BitmapText.JSONBitmapText
 * @extends {Phaser.Types.GameObjects.JSONGameObject}
 * @since 3.0.0
 *
 * @property {string} font - The name of the font.
 * @property {string} text - The text that this Bitmap Text displays.
 * @property {number} fontSize - The size of the font.
 * @property {number} letterSpacing - Adds / Removes spacing between characters.
 * @property {number} lineSpacing - Adds / Removes spacing between lines in multi-line text.
 * @property {number} align - The alignment of the text in a multi-line BitmapText object.
 */
/**
 * The position and size of the Bitmap Text in global space, taking into account the Game Object's scale and world position.
 *
 * @typedef {object} Phaser.Types.GameObjects.BitmapText.GlobalBitmapTextSize
 * @since 3.0.0
 *
 * @property {number} x - The x position of the BitmapText, taking into account the x position and scale of the Game Object.
 * @property {number} y - The y position of the BitmapText, taking into account the y position and scale of the Game Object.
 * @property {number} width - The width of the BitmapText, taking into account the x scale of the Game Object.
 * @property {number} height - The height of the BitmapText, taking into account the y scale of the Game Object.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.BitmapText.DisplayCallbackConfig
 * @since 3.0.0
 * 
 * @property {Phaser.GameObjects.DynamicBitmapText} parent - The Dynamic Bitmap Text object that owns this character being rendered.
 * @property {Phaser.Types.GameObjects.BitmapText.TintConfig} tint - The tint of the character being rendered. Always zero in Canvas.
 * @property {number} index - The index of the character being rendered.
 * @property {number} charCode - The character code of the character being rendered.
 * @property {number} x - The x position of the character being rendered.
 * @property {number} y - The y position of the character being rendered.
 * @property {number} scale - The scale of the character being rendered.
 * @property {number} rotation - The rotation of the character being rendered.
 * @property {any} data - Custom data stored with the character being rendered.
 */
/**
 * Details about a single world entry in the `BitmapTextSize` object words array.
 *
 * @typedef {object} Phaser.Types.GameObjects.BitmapText.BitmapTextWord
 * @since 3.50.0
 *
 * @property {number} x - The x position of the word in the BitmapText.
 * @property {number} y - The y position of the word in the BitmapText.
 * @property {number} w - The width of the word.
 * @property {number} h - The height of the word.
 * @property {number} i - The index of the first character of this word within the entire string. Note: this index factors in spaces, quotes, carriage-returns, etc.
 * @property {string} word - The word.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.BitmapText.BitmapTextSize
 * @since 3.0.0
 *
 * @property {Phaser.Types.GameObjects.BitmapText.GlobalBitmapTextSize} global - The position and size of the BitmapText, taking into account the position and scale of the Game Object.
 * @property {Phaser.Types.GameObjects.BitmapText.LocalBitmapTextSize} local - The position and size of the BitmapText, taking just the font size into account.
 * @property {Phaser.Types.GameObjects.BitmapText.BitmapTextLines} lines - Data about the lines of text within the BitmapText.
 * @property {Phaser.Types.GameObjects.BitmapText.BitmapTextCharacter[]} characters - An array containing per-character data. Only populated if `includeChars` is `true` in the `getTextBounds` call.
 * @property {Phaser.Types.GameObjects.BitmapText.BitmapTextWord[]} words - An array containing the word data from the BitmapText.
 * @property {number} scale - The scale of the BitmapText font being rendered vs. font size in the text data.
 * @property {number} scaleX - The scale X value of the BitmapText.
 * @property {number} scaleY - The scale Y value of the BitmapText.
 * @property {string} wrappedText - The wrapped text, if wrapping enabled and required.
 */
/**
 * Details about the line data in the `BitmapTextSize` object.
 *
 * @typedef {object} Phaser.Types.GameObjects.BitmapText.BitmapTextLines
 * @since 3.50.0
 *
 * @property {number} shortest - The width of the shortest line of text.
 * @property {number} longest - The width of the longest line of text.
 * @property {number} height - The height of a line of text.
 * @property {number[]} lengths - An array where each entry contains the length of that line of text.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.BitmapText.BitmapTextConfig
 * @extends Phaser.Types.GameObjects.GameObjectConfig
 * @since 3.0.0
 *
 * @property {string} [font=''] - The key of the font to use from the BitmapFont cache.
 * @property {string} [text=''] - The string, or array of strings, to be set as the content of this Bitmap Text.
 * @property {(number|false)} [size=false] - The font size to set.
 */
/**
 * A single entry from the `BitmapTextSize` characters array.
 *
 * The position and dimensions take the font size into account,
 * but are not translated into the local space of the Game Object itself.
 *
 * @typedef {object} Phaser.Types.GameObjects.BitmapText.BitmapTextCharacter
 * @since 3.50.0
 *
 * @property {number} i - The index of this character within the BitmapText wrapped text string.
 * @property {number} idx - The index of this character within the BitmapText text string.
 * @property {string} char - The character.
 * @property {number} code - The character code of the character.
 * @property {number} x - The x position of the character in the BitmapText.
 * @property {number} y - The y position of the character in the BitmapText.
 * @property {number} w - The width of the character.
 * @property {number} h - The height of the character.
 * @property {number} t - The top of the line this character is on.
 * @property {number} r - The right-most point of this character, including xAdvance.
 * @property {number} b - The bottom of the line this character is on.
 * @property {number} line - The line number the character appears on.
 * @property {Phaser.Types.GameObjects.BitmapText.BitmapFontCharacterData} glyph - Reference to the glyph object this character is using.
 */
/**
 * Bitmap Font data that can be used by a BitmapText Game Object.
 *
 * @typedef {object} Phaser.Types.GameObjects.BitmapText.BitmapFontData
 * @since 3.0.0
 *
 * @property {string} font - The name of the font.
 * @property {number} size - The size of the font.
 * @property {number} lineHeight - The line height of the font.
 * @property {boolean} retroFont - Whether this font is a retro font (monospace).
 * @property {Object.<number, Phaser.Types.GameObjects.BitmapText.BitmapFontCharacterData>} chars - The character data of the font, keyed by character code. Each character datum includes a position, size, offset and more.
 */
/**
 * The font data for an individual character of a Bitmap Font.
 *
 * Describes the character's position, size, offset and kerning.
 *
 * As of version 3.50 it also includes the WebGL texture uv data.
 *
 * @typedef {object} Phaser.Types.GameObjects.BitmapText.BitmapFontCharacterData
 * @since 3.0.0
 *
 * @property {number} x - The x position of the character.
 * @property {number} y - The y position of the character.
 * @property {number} width - The width of the character.
 * @property {number} height - The height of the character.
 * @property {number} centerX - The center x position of the character.
 * @property {number} centerY - The center y position of the character.
 * @property {number} xOffset - The x offset of the character.
 * @property {number} yOffset - The y offset of the character.
 * @property {number} u0 - WebGL texture u0.
 * @property {number} v0 - WebGL texture v0.
 * @property {number} u1 - WebGL texture u1.
 * @property {number} v1 - WebGL texture v1.
 * @property {object} data - Extra data for the character.
 * @property {Object.<number>} kerning - Kerning values, keyed by character code.
 */
/**
 * @typedef {object} Phaser.Types.Cameras.Controls.SmoothedKeyControlConfig
 * @since 3.0.0
 *
 * @property {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera that this Control will update.
 * @property {Phaser.Input.Keyboard.Key} [left] - The Key to be pressed that will move the Camera left.
 * @property {Phaser.Input.Keyboard.Key} [right] - The Key to be pressed that will move the Camera right.
 * @property {Phaser.Input.Keyboard.Key} [up] - The Key to be pressed that will move the Camera up.
 * @property {Phaser.Input.Keyboard.Key} [down] - The Key to be pressed that will move the Camera down.
 * @property {Phaser.Input.Keyboard.Key} [zoomIn] - The Key to be pressed that will zoom the Camera in.
 * @property {Phaser.Input.Keyboard.Key} [zoomOut] - The Key to be pressed that will zoom the Camera out.
 * @property {number} [zoomSpeed=0.01] - The speed at which the camera will zoom if the `zoomIn` or `zoomOut` keys are pressed.
 * @property {(number|{x:number,y:number})} [acceleration=0] - The horizontal and vertical acceleration the camera will move.
 * @property {(number|{x:number,y:number})} [drag=0] - The horizontal and vertical drag applied to the camera when it is moving.
 * @property {(number|{x:number,y:number})} [maxSpeed=0] - The maximum horizontal and vertical speed the camera will move.
 * @property {number} [minZoom=0.001] - The smallest zoom value the camera will reach when zoomed out.
 * @property {number} [maxZoom=1000] - The largest zoom value the camera will reach when zoomed in.
 */
/**
 * @typedef {object} Phaser.Types.Cameras.Controls.FixedKeyControlConfig
 * @since 3.0.0
 *
 * @property {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera that this Control will update.
 * @property {Phaser.Input.Keyboard.Key} [left] - The Key to be pressed that will move the Camera left.
 * @property {Phaser.Input.Keyboard.Key} [right] - The Key to be pressed that will move the Camera right.
 * @property {Phaser.Input.Keyboard.Key} [up] - The Key to be pressed that will move the Camera up.
 * @property {Phaser.Input.Keyboard.Key} [down] - The Key to be pressed that will move the Camera down.
 * @property {Phaser.Input.Keyboard.Key} [zoomIn] - The Key to be pressed that will zoom the Camera in.
 * @property {Phaser.Input.Keyboard.Key} [zoomOut] - The Key to be pressed that will zoom the Camera out.
 * @property {number} [zoomSpeed=0.01] - The speed at which the camera will zoom if the `zoomIn` or `zoomOut` keys are pressed.
 * @property {(number|{x:number,y:number})} [speed=0] - The horizontal and vertical speed the camera will move.
 * @property {number} [minZoom=0.001] - The smallest zoom value the camera will reach when zoomed out.
 * @property {number} [maxZoom=1000] - The largest zoom value the camera will reach when zoomed in.
 */
/**
 * @typedef {object} Phaser.Types.Cameras.Scene2D.JSONCameraBounds
 * @since 3.0.0
 * 
 * @property {number} x - The horizontal position of camera
 * @property {number} y - The vertical position of camera
 * @property {number} width - The width size of camera
 * @property {number} height - The height size of camera
 */
/**
 * @typedef {object} Phaser.Types.Cameras.Scene2D.JSONCamera
 * @since 3.0.0
 *
 * @property {string} name - The name of the camera
 * @property {number} x - The horizontal position of camera
 * @property {number} y - The vertical position of camera
 * @property {number} width - The width size of camera
 * @property {number} height - The height size of camera
 * @property {number} zoom - The zoom of camera
 * @property {number} rotation - The rotation of camera
 * @property {boolean} roundPixels - The round pixels indicate the status of the camera
 * @property {number} scrollX - The horizontal scroll of camera
 * @property {number} scrollY - The vertical scroll of camera
 * @property {string} backgroundColor - The background color of camera
 * @property {(Phaser.Types.Cameras.Scene2D.JSONCameraBounds|undefined)} [bounds] - The bounds of camera
 */
/**
 * @typedef {object} Phaser.Types.Cameras.Scene2D.CameraConfig
 * @since 3.0.0
 *
 * @property {string} [name=''] - The name of the Camera.
 * @property {number} [x=0] - The horizontal position of the Camera viewport.
 * @property {number} [y=0] - The vertical position of the Camera viewport.
 * @property {number} [width] - The width of the Camera viewport.
 * @property {number} [height] - The height of the Camera viewport.
 * @property {number} [zoom=1] - The default zoom level of the Camera.
 * @property {number} [rotation=0] - The rotation of the Camera, in radians.
 * @property {boolean} [roundPixels=false] - Should the Camera round pixels before rendering?
 * @property {number} [scrollX=0] - The horizontal scroll position of the Camera.
 * @property {number} [scrollY=0] - The vertical scroll position of the Camera.
 * @property {(false|string)} [backgroundColor=false] - A CSS color string controlling the Camera background color.
 * @property {?object} [bounds] - Defines the Camera bounds.
 * @property {number} [bounds.x=0] - The top-left extent of the Camera bounds.
 * @property {number} [bounds.y=0] - The top-left extent of the Camera bounds.
 * @property {number} [bounds.width] - The width of the Camera bounds.
 * @property {number} [bounds.height] - The height of the Camera bounds.
 */
/**
 * Determines the video support of the browser running this Phaser Game instance.
 *
 * These values are read-only and populated during the boot sequence of the game.
 *
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.video` from within any Scene.
 *
 * In Phaser 3.20 the properties were renamed to drop the 'Video' suffix.
 *
 * @typedef {object} Phaser.Device.Video
 * @since 3.0.0
 *
 * @property {boolean} h264 - Can this device play h264 mp4 video files?
 * @property {boolean} hls - Can this device play hls video files?
 * @property {boolean} mp4 - Can this device play h264 mp4 video files?
 * @property {boolean} m4v - Can this device play m4v (typically mp4) video files?
 * @property {boolean} ogg - Can this device play ogg video files?
 * @property {boolean} vp9 - Can this device play vp9 video files?
 * @property {boolean} webm - Can this device play webm video files?
 * @property {function} getVideoURL - Returns the first video URL that can be played by this browser.
 */
/**
 * Determines the operating system of the device running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.os` from within any Scene.
 *
 * @typedef {object} Phaser.Device.OS
 * @since 3.0.0
 *
 * @property {boolean} android - Is running on android?
 * @property {boolean} chromeOS - Is running on chromeOS?
 * @property {boolean} cordova - Is the game running under Apache Cordova?
 * @property {boolean} crosswalk - Is the game running under the Intel Crosswalk XDK?
 * @property {boolean} desktop - Is running on a desktop?
 * @property {boolean} ejecta - Is the game running under Ejecta?
 * @property {boolean} electron - Is the game running under GitHub Electron?
 * @property {boolean} iOS - Is running on iOS?
 * @property {boolean} iPad - Is running on iPad?
 * @property {boolean} iPhone - Is running on iPhone?
 * @property {boolean} kindle - Is running on an Amazon Kindle?
 * @property {boolean} linux - Is running on linux?
 * @property {boolean} macOS - Is running on macOS?
 * @property {boolean} node - Is the game running under Node.js?
 * @property {boolean} nodeWebkit - Is the game running under Node-Webkit?
 * @property {boolean} webApp - Set to true if running as a WebApp, i.e. within a WebView
 * @property {boolean} windows - Is running on windows?
 * @property {boolean} windowsPhone - Is running on a Windows Phone?
 * @property {number} iOSVersion - If running in iOS this will contain the major version number.
 * @property {number} pixelRatio - PixelRatio of the host device?
 */
/**
 * Determines the input support of the browser running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.input` from within any Scene.
 *
 * @typedef {object} Phaser.Device.Input
 * @since 3.0.0
 *
 * @property {?string} wheelType - The newest type of Wheel/Scroll event supported: 'wheel', 'mousewheel', 'DOMMouseScroll'
 * @property {boolean} gamepads - Is navigator.getGamepads available?
 * @property {boolean} mspointer - Is mspointer available?
 * @property {boolean} touch - Is touch available?
 */
/**
 * @typedef {object} Phaser.DeviceConf
 *
 * @property {Phaser.Device.OS} os - The OS Device functions.
 * @property {Phaser.Device.Browser} browser - The Browser Device functions.
 * @property {Phaser.Device.Features} features - The Features Device functions.
 * @property {Phaser.Device.Input} input - The Input Device functions.
 * @property {Phaser.Device.Audio} audio - The Audio Device functions.
 * @property {Phaser.Device.Video} video - The Video Device functions.
 * @property {Phaser.Device.Fullscreen} fullscreen - The Fullscreen Device functions.
 * @property {Phaser.Device.CanvasFeatures} canvasFeatures - The Canvas Device functions.
 */
/**
 * Determines the full screen support of the browser running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.fullscreen` from within any Scene.
 *
 * @typedef {object} Phaser.Device.Fullscreen
 * @since 3.0.0
 *
 * @property {boolean} available - Does the browser support the Full Screen API?
 * @property {boolean} keyboard - Does the browser support access to the Keyboard during Full Screen mode?
 * @property {string} cancel - If the browser supports the Full Screen API this holds the call you need to use to cancel it.
 * @property {string} request - If the browser supports the Full Screen API this holds the call you need to use to activate it.
 */
/**
 * Determines the features of the browser running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.features` from within any Scene.
 *
 * @typedef {object} Phaser.Device.Features
 * @since 3.0.0
 *
 * @property {boolean} canvas - Is canvas available?
 * @property {?boolean} canvasBitBltShift - True if canvas supports a 'copy' bitblt onto itself when the source and destination regions overlap.
 * @property {boolean} file - Is file available?
 * @property {boolean} fileSystem - Is fileSystem available?
 * @property {boolean} getUserMedia - Does the device support the getUserMedia API?
 * @property {boolean} littleEndian - Is the device big or little endian? (only detected if the browser supports TypedArrays)
 * @property {boolean} localStorage - Is localStorage available?
 * @property {boolean} pointerLock - Is Pointer Lock available?
 * @property {boolean} stableSort - Is Array.sort stable?
 * @property {boolean} support32bit - Does the device context support 32bit pixel manipulation using array buffer views?
 * @property {boolean} vibration - Does the device support the Vibration API?
 * @property {boolean} webGL - Is webGL available?
 * @property {boolean} worker - Is worker available?
 */
/**
 * Determines the canvas features of the browser running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.canvasFeatures` from within any Scene.
 *
 * @typedef {object} Phaser.Device.CanvasFeatures
 * @since 3.0.0
 *
 * @property {boolean} supportInverseAlpha - Set to true if the browser supports inversed alpha.
 * @property {boolean} supportNewBlendModes - Set to true if the browser supports new canvas blend modes.
 */
/**
 * Determines the browser type and version running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.browser` from within any Scene.
 *
 * @typedef {object} Phaser.Device.Browser
 * @since 3.0.0
 *
 * @property {boolean} chrome - Set to true if running in Chrome.
 * @property {boolean} edge - Set to true if running in Microsoft Edge browser.
 * @property {boolean} firefox - Set to true if running in Firefox.
 * @property {boolean} ie - Set to true if running in Internet Explorer 11 or less (not Edge).
 * @property {boolean} mobileSafari - Set to true if running in Mobile Safari.
 * @property {boolean} opera - Set to true if running in Opera.
 * @property {boolean} safari - Set to true if running in Safari.
 * @property {boolean} silk - Set to true if running in the Silk browser (as used on the Amazon Kindle)
 * @property {boolean} trident - Set to true if running a Trident version of Internet Explorer (IE11+)
 * @property {number} chromeVersion - If running in Chrome this will contain the major version number.
 * @property {number} firefoxVersion - If running in Firefox this will contain the major version number.
 * @property {number} ieVersion - If running in Internet Explorer this will contain the major version number. Beyond IE10 you should use Browser.trident and Browser.tridentVersion.
 * @property {number} safariVersion - If running in Safari this will contain the major version number.
 * @property {number} tridentVersion - If running in Internet Explorer 11 this will contain the major version number. See {@link http://msdn.microsoft.com/en-us/library/ie/ms537503(v=vs.85).aspx}
 */
/**
 * Determines the audio playback capabilities of the device running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.audio` from within any Scene.
 *
 * @typedef {object} Phaser.Device.Audio
 * @since 3.0.0
 *
 * @property {boolean} audioData - Can this device play HTML Audio tags?
 * @property {boolean} dolby - Can this device play EC-3 Dolby Digital Plus files?
 * @property {boolean} m4a - Can this device can play m4a files.
 * @property {boolean} aac - Can this device can play aac files.
 * @property {boolean} flac - Can this device can play flac files.
 * @property {boolean} mp3 - Can this device play mp3 files?
 * @property {boolean} ogg - Can this device play ogg files?
 * @property {boolean} opus - Can this device play opus files?
 * @property {boolean} wav - Can this device play wav files?
 * @property {boolean} webAudio - Does this device have the Web Audio API?
 * @property {boolean} webm - Can this device play webm files?
 */
/**
 * @typedef {object} Phaser.Types.Tweens.TweenPropConfig
 * @since 3.18.0
 *
 * @property {(number|number[]|string|Phaser.Types.Tweens.GetEndCallback|Phaser.Types.Tweens.TweenPropConfig)} [value] - What the property will be at the END of the Tween.
 * @property {Phaser.Types.Tweens.GetActiveCallback} [getActive] - What the property will be set to immediately when this tween becomes active.
 * @property {Phaser.Types.Tweens.GetEndCallback} [getEnd] - What the property will be at the END of the Tween.
 * @property {Phaser.Types.Tweens.GetStartCallback} [getStart] - What the property will be at the START of the Tween.
 * @property {(string|function)} [ease] - The ease function this tween uses.
 * @property {number} [delay] - Time in milliseconds before tween will start.
 * @property {number} [duration] - Duration of the tween in milliseconds.
 * @property {boolean} [yoyo] - Determines whether the tween should return back to its start value after hold has expired.
 * @property {number} [hold] - Time in milliseconds the tween will pause before repeating or returning to its starting value if yoyo is set to true.
 * @property {number} [repeat] - Number of times to repeat the tween. The tween will always run once regardless, so a repeat value of '1' will play the tween twice.
 * @property {number} [repeatDelay] - Time in milliseconds before the repeat will start.
 * @property {boolean} [flipX] - Should toggleFlipX be called when yoyo or repeat happens?
 * @property {boolean} [flipY] - Should toggleFlipY be called when yoyo or repeat happens?
 * @property {(string|function)} [interpolation] - The interpolation function to use if the `value` given is an array of numbers.
 */
/**
 * @typedef {object} Phaser.Types.Tweens.TweenFrameDataConfig
 * @since 3.60.0
 *
 * @property {any} target - The target to tween.
 * @property {number} index - The target index within the Tween targets array.
 * @property {string} key - The property of the target being tweened.
 * @property {number} [duration=0] - Duration of the tween in milliseconds, excludes time for yoyo or repeats.
 * @property {number} [totalDuration=0] - The total calculated duration of this TweenData (based on duration, repeat, delay and yoyo)
 * @property {number} [delay=0] - Time in milliseconds before tween will start.
 * @property {number} [hold=0] - Time in milliseconds the tween will pause before running the yoyo or starting a repeat.
 * @property {number} [repeat=0] - Number of times to repeat the tween. The tween will always run once regardless, so a repeat value of '1' will play the tween twice.
 * @property {number} [repeatDelay=0] - Time in milliseconds before the repeat will start.
 * @property {boolean} [flipX=false] - Automatically call toggleFlipX when the TweenData yoyos or repeats
 * @property {boolean} [flipY=false] - Automatically call toggleFlipY when the TweenData yoyos or repeats
 * @property {number} [progress=0] - Between 0 and 1 showing completion of this TweenData.
 * @property {number} [elapsed=0] - Delta counter
 * @property {number} [repeatCounter=0] - How many repeats are left to run?
 * @property {Phaser.Types.Tweens.TweenDataGenConfig} [gen] - LoadValue generation functions.
 * @property {Phaser.Tweens.StateType} [state=0] - TWEEN_CONST.CREATED
 */
/**
 * @typedef {object} Phaser.Types.Tweens.TweenDataGenConfig
 * @since 3.0.0
 *
 * @property {function} delay - Time in milliseconds before tween will start.
 * @property {function} duration - Duration of the tween in milliseconds, excludes time for yoyo or repeats.
 * @property {function} hold - Time in milliseconds the tween will pause before running the yoyo or starting a repeat.
 * @property {function} repeat - Number of times to repeat the tween. The tween will always run once regardless, so a repeat value of '1' will play the tween twice.
 * @property {function} repeatDelay - Time in milliseconds before the repeat will start.
 */
/**
 * @typedef {object} Phaser.Types.Tweens.TweenDataConfig
 * @since 3.0.0
 *
 * @property {any} target - The target to tween.
 * @property {number} index - The target index within the Tween targets array.
 * @property {string} key - The property of the target being tweened.
 * @property {?Phaser.Types.Tweens.GetActiveCallback} getActiveValue - If not null, is invoked _immediately_ as soon as the TweenData is running, and is set on the target property.
 * @property {Phaser.Types.Tweens.GetEndCallback} getEndValue - The returned value sets what the property will be at the END of the Tween.
 * @property {Phaser.Types.Tweens.GetStartCallback} getStartValue - The returned value sets what the property will be at the START of the Tween.
 * @property {function} ease - The ease function this tween uses.
 * @property {number} [duration=0] - Duration of the tween in milliseconds, excludes time for yoyo or repeats.
 * @property {number} [totalDuration=0] - The total calculated duration of this TweenData (based on duration, repeat, delay and yoyo)
 * @property {number} [delay=0] - Time in milliseconds before tween will start.
 * @property {boolean} [yoyo=false] - Cause the tween to return back to its start value after hold has expired.
 * @property {number} [hold=0] - Time in milliseconds the tween will pause before running the yoyo or starting a repeat.
 * @property {number} [repeat=0] - Number of times to repeat the tween. The tween will always run once regardless, so a repeat value of '1' will play the tween twice.
 * @property {number} [repeatDelay=0] - Time in milliseconds before the repeat will start.
 * @property {boolean} [flipX=false] - Automatically call toggleFlipX when the TweenData yoyos or repeats
 * @property {boolean} [flipY=false] - Automatically call toggleFlipY when the TweenData yoyos or repeats
 * @property {number} [progress=0] - Between 0 and 1 showing completion of this TweenData.
 * @property {number} [elapsed=0] - Delta counter
 * @property {number} [repeatCounter=0] - How many repeats are left to run?
 * @property {number} [start=0] - The property value at the start of the ease.
 * @property {number} [current=0] - The current propety value.
 * @property {number} [previous=0] - The previous property value.
 * @property {number} [end=0] - The property value at the end of the ease.
 * @property {Phaser.Types.Tweens.TweenDataGenConfig} [gen] - LoadValue generation functions.
 * @property {Phaser.Tweens.StateType} [state=0] - TWEEN_CONST.CREATED
 */
/**
 * @typedef {object} Phaser.Types.Tweens.TweenChainBuilderConfig
 * @extends object
 * @since 3.60.0
 *
 * @property {any} targets - The object, or an array of objects, to run each tween on.
 * @property {(number|function)} [delay=0] - The number of milliseconds to delay before the chain will start.
 * @property {string|number|function|object|array} [completeDelay=0] - The time the chain will wait before the onComplete event is dispatched once it has completed, in ms.
 * @property {string|number|function|object|array} [loop=0] - The number of times the chain will repeat. (A value of 1 means the chain will play twice, as it repeated once.) The first loop starts after every tween has completed once.
 * @property {string|number|function|object|array} [loopDelay=0] - The time the chain will pause before returning to the start for a repeat.
 * @property {boolean} [paused=false] - Does the chain start in a paused state (true) or playing (false)?
 * @property {Phaser.Types.Tweens.TweenBuilderConfig[]} [tweens] - The tweens to chain together.
 * @property {any} [callbackScope] - The scope (or context) for all of the callbacks. The default scope is the chain.
 * @property {Phaser.Types.Tweens.TweenOnCompleteCallback} [onComplete] - A function to call when the chain completes.
 * @property {array} [onCompleteParams] - Additional parameters to pass to `onComplete`.
 * @property {Phaser.Types.Tweens.TweenOnLoopCallback} [onLoop] - A function to call each time the chain loops.
 * @property {array} [onLoopParams] - Additional parameters to pass to `onLoop`.
 * @property {Phaser.Types.Tweens.TweenOnStartCallback} [onStart] - A function to call when the chain starts playback, after any delays have expired.
 * @property {array} [onStartParams] - Additional parameters to pass to `onStart`.
 * @property {Phaser.Types.Tweens.TweenOnStopCallback} [onStop] - A function to call when the chain is stopped.
 * @property {array} [onStopParams] - Additional parameters to pass to `onStop`.
 * @property {Phaser.Types.Tweens.TweenOnActiveCallback} [onActive] - A function to call when the chain becomes active within the Tween Manager.
 * @property {array} [onActiveParams] - Additional parameters to pass to `onActive`.
 * @property {Phaser.Types.Tweens.TweenOnPauseCallback} [onPause] - A function to call when the chain is paused.
 * @property {array} [onPauseParams] - Additional parameters to pass to `onPause`.
 * @property {Phaser.Types.Tweens.TweenOnResumeCallback} [onResume] - A function to call when the chain is resumed after being paused.
 * @property {array} [onResumeParams] - Additional parameters to pass to `onResume`.
 * @property {boolean} [persist] - Will the Tween be automatically destroyed on completion, or retained for future playback?
 */
/**
 * @typedef {('onActive'|'onComplete'|'onLoop'|'onPause'|'onRepeat'|'onResume'|'onStart'|'onStop'|'onUpdate'|'onYoyo')} Phaser.Types.Tweens.TweenCallbackTypes
 * @since 3.60.0
 */
/**
 * @typedef {object} Phaser.Types.Tweens.TweenCallbacks
 * @since 3.60.0
 *
 * @property {Phaser.Types.Tweens.TweenOnActiveCallback} [onActive] - A function to call when the tween becomes active within the Tween Manager.
 * @property {Phaser.Types.Tweens.TweenOnStartCallback} [onStart] - A function to call when the tween starts playback, after any delays have expired.
 * @property {Phaser.Types.Tweens.TweenOnCompleteCallback} [onComplete] - A function to call when the tween completes.
 * @property {Phaser.Types.Tweens.TweenOnLoopCallback} [onLoop] - A function to call each time the tween loops.
 * @property {Phaser.Types.Tweens.TweenOnPauseCallback} [onPause] - A function to call each time the tween is paused.
 * @property {Phaser.Types.Tweens.TweenOnResumeCallback} [onResume] - A function to call each time the tween is resumed.
 * @property {Phaser.Types.Tweens.TweenOnRepeatCallback} [onRepeat] - A function to call each time the tween repeats. Called once per property per target.
 * @property {Phaser.Types.Tweens.TweenOnStopCallback} [onStop] - A function to call when the tween is stopped.
 * @property {Phaser.Types.Tweens.TweenOnUpdateCallback} [onUpdate] - A function to call each time the tween steps. Called once per property per target.
 * @property {Phaser.Types.Tweens.TweenOnYoyoCallback} [onYoyo] - A function to call each time the tween yoyos. Called once per property per target.
 */
/**
 * @typedef {object} Phaser.Types.Tweens.TweenBuilderConfig
 * @extends object
 * @since 3.18.0
 *
 * @property {any} targets - The object, or an array of objects, to run the tween on.
 * @property {(number|function)} [delay=0] - The number of milliseconds to delay before the tween will start.
 * @property {number} [duration=1000] - The duration of the tween in milliseconds.
 * @property {(string|function)} [ease='Power0'] - The easing equation to use for the tween.
 * @property {array} [easeParams] - Optional easing parameters.
 * @property {number} [hold=0] - The number of milliseconds to hold the tween for before yoyo'ing.
 * @property {number} [repeat=0] - The number of times each property tween repeats.
 * @property {number} [repeatDelay=0] - The number of milliseconds to pause before a repeat.
 * @property {boolean} [yoyo=false] - Should the tween complete, then reverse the values incrementally to get back to the starting tween values? The reverse tweening will also take `duration` milliseconds to complete.
 * @property {boolean} [flipX=false] - Horizontally flip the target of the Tween when it completes (before it yoyos, if set to do so). Only works for targets that support the `flipX` property.
 * @property {boolean} [flipY=false] - Vertically flip the target of the Tween when it completes (before it yoyos, if set to do so). Only works for targets that support the `flipY` property.
 * @property {string|number|function|object|array} [completeDelay=0] - The time the tween will wait before the onComplete event is dispatched once it has completed, in ms.
 * @property {string|number|function|object|array} [loop=0] - The number of times the tween will repeat. (A value of 1 means the tween will play twice, as it repeated once.) The first loop starts after every property in the tween has completed once.
 * @property {string|number|function|object|array} [loopDelay=0] - The time the tween will pause before starting either a yoyo or returning to the start for a repeat.
 * @property {boolean} [paused=false] - Does the tween start in a paused state (true) or playing (false)?
 * @property {Object.<string,(number|string|Phaser.Types.Tweens.GetEndCallback|Phaser.Types.Tweens.TweenPropConfig)>} [props] - The properties to tween.
 * @property {any} [callbackScope] - The scope (or context) for all of the callbacks. The default scope is the tween.
 * @property {Phaser.Types.Tweens.TweenOnCompleteCallback} [onComplete] - A function to call when the tween completes.
 * @property {array} [onCompleteParams] - Additional parameters to pass to `onComplete`.
 * @property {Phaser.Types.Tweens.TweenOnLoopCallback} [onLoop] - A function to call each time the tween loops.
 * @property {array} [onLoopParams] - Additional parameters to pass to `onLoop`.
 * @property {Phaser.Types.Tweens.TweenOnRepeatCallback} [onRepeat] - A function to call each time a property tween repeats. Called once per property per target.
 * @property {array} [onRepeatParams] - Additional parameters to pass to `onRepeat`.
 * @property {Phaser.Types.Tweens.TweenOnStartCallback} [onStart] - A function to call when the tween starts playback, after any delays have expired.
 * @property {array} [onStartParams] - Additional parameters to pass to `onStart`.
 * @property {Phaser.Types.Tweens.TweenOnStopCallback} [onStop] - A function to call when the tween is stopped.
 * @property {array} [onStopParams] - Additional parameters to pass to `onStop`.
 * @property {Phaser.Types.Tweens.TweenOnUpdateCallback} [onUpdate] - A function to call each time the tween steps. Called once per property per target.
 * @property {array} [onUpdateParams] - Additional parameters to pass to `onUpdate`.
 * @property {Phaser.Types.Tweens.TweenOnYoyoCallback} [onYoyo] - A function to call each time a property tween yoyos. Called once per property per target.
 * @property {array} [onYoyoParams] - Additional parameters to pass to `onYoyo`.
 * @property {Phaser.Types.Tweens.TweenOnActiveCallback} [onActive] - A function to call when the tween becomes active within the Tween Manager.
 * @property {array} [onActiveParams] - Additional parameters to pass to `onActive`.
 * @property {Phaser.Types.Tweens.TweenOnPauseCallback} [onPause] - A function to call when the tween is paused.
 * @property {array} [onPauseParams] - Additional parameters to pass to `onPause`.
 * @property {Phaser.Types.Tweens.TweenOnResumeCallback} [onResume] - A function to call when the tween is resumed after being paused.
 * @property {array} [onResumeParams] - Additional parameters to pass to `onResume`.
 * @property {boolean} [persist] - Will the Tween be automatically destroyed on completion, or retained for future playback?
 * @property {(string|function)} [interpolation] - The interpolation function to use if the `value` given is an array of numbers.
 *
 * @example
 * {
 *   targets: null,
 *   delay: 0,
 *   duration: 1000,
 *   ease: 'Power0',
 *   easeParams: null,
 *   hold: 0,
 *   repeat: 0,
 *   repeatDelay: 0,
 *   yoyo: false,
 *   flipX: false,
 *   flipY: false
 * };
 */
/**
 * @typedef {object} Phaser.Types.Tweens.StaggerConfig
 * @since 3.19.0
 *
 * @property {number} [start=0] - The value to start the stagger from. Can be used as a way to offset the stagger while still using a range for the value.
 * @property {(string|function)} [ease='Linear'] - An ease to apply across the staggered values. Can either be a string, such as 'sine.inout', or a function.
 * @property {(string|number)} [from=0] - The index to start the stagger from. Can be the strings `first`, `last` or `center`, or an integer representing the stagger position.
 * @property {number[]} [grid] - Set the stagger to run across a grid by providing an array where element 0 is the width of the grid and element 1 is the height. Combine with the 'from' property to control direction.
 *
 * @example
 * {
 *   grid: [ 20, 8 ],
 *   from: 'center',
 *   ease: 'Power0',
 *   start: 100
 * };
 */
/**
 * @typedef {object} Phaser.Types.Tweens.NumberTweenBuilderConfig
 * @since 3.18.0
 *
 * @property {number} [from=0] - The start number.
 * @property {number} [to=1] - The end number.
 * @property {number} [delay=0] - The number of milliseconds to delay before the counter will start.
 * @property {number} [duration=1000] - The duration of the counter in milliseconds.
 * @property {(string|function)} [ease='Power0'] - The easing equation to use for the counter.
 * @property {array} [easeParams] - Optional easing parameters.
 * @property {number} [hold=0] - The number of milliseconds to hold the counter for before yoyo'ing.
 * @property {number} [repeat=0] - The number of times to repeat the counter.
 * @property {number} [repeatDelay=0] - The number of milliseconds to pause before the counter will repeat.
 * @property {boolean} [yoyo=false] - Should the counter play forward to the end value and then backwards to the start? The reverse playback will also take `duration` milliseconds to complete.
 * @property {string|number|function|object|array} [completeDelay=0] - The time the counter will wait before the onComplete event is dispatched once it has completed, in ms.
 * @property {string|number|function|object|array} [loop=0] - The number of times the counter will repeat. (A value of 1 means the counter will play twice, as it repeated once.)
 * @property {string|number|function|object|array} [loopDelay=0] - The time the counter will pause before starting either a yoyo or returning to the start for a repeat.
 * @property {boolean} [paused=false] - Does the counter start in a paused state (true) or playing (false)?
 * @property {any} [callbackScope] - Scope (this) for the callbacks. The default scope is the counter.
 * @property {Phaser.Types.Tweens.TweenOnCompleteCallback} [onComplete] - A function to call when the counter completes.
 * @property {array} [onCompleteParams] - Additional parameters to pass to `onComplete`.
 * @property {Phaser.Types.Tweens.TweenOnLoopCallback} [onLoop] - A function to call each time the counter loops.
 * @property {array} [onLoopParams] - Additional parameters to pass to `onLoop`.
 * @property {Phaser.Types.Tweens.TweenOnRepeatCallback} [onRepeat] - A function to call each time the counter repeats.
 * @property {array} [onRepeatParams] - Additional parameters to pass to `onRepeat`.
 * @property {Phaser.Types.Tweens.TweenOnStartCallback} [onStart] - A function to call when the counter starts.
 * @property {array} [onStartParams] - Additional parameters to pass to `onStart`.
 * @property {Phaser.Types.Tweens.TweenOnStopCallback} [onStop] - A function to call when the counter is stopped.
 * @property {array} [onStopParams] - Additional parameters to pass to `onStop`.
 * @property {Phaser.Types.Tweens.TweenOnUpdateCallback} [onUpdate] - A function to call each time the counter steps.
 * @property {array} [onUpdateParams] - Additional parameters to pass to `onUpdate`.
 * @property {Phaser.Types.Tweens.TweenOnYoyoCallback} [onYoyo] - A function to call each time the counter yoyos.
 * @property {array} [onYoyoParams] - Additional parameters to pass to `onYoyo`.
 * @property {Phaser.Types.Tweens.TweenOnPauseCallback} [onPause] - A function to call when the counter is paused.
 * @property {array} [onPauseParams] - Additional parameters to pass to `onPause`.
 * @property {Phaser.Types.Tweens.TweenOnResumeCallback} [onResume] - A function to call when the counter is resumed after being paused.
 * @property {array} [onResumeParams] - Additional parameters to pass to `onResume`.
 * @property {boolean} [persist] - Will the counter be automatically destroyed on completion, or retained for future playback?
 * @property {(string|function)} [interpolation] - The interpolation function to use if the `value` given is an array of numbers.
 */
/**
 * @typedef {string} Phaser.Types.Tweens.Event - A Tween Event.
 * @since 3.19.0
 */
/**
 * @typedef {object} Phaser.Types.Tweens.TweenConfigDefaults
 * @since 3.0.0
 *
 * @property {(object|object[])} targets - The object, or an array of objects, to run the tween on.
 * @property {number} [delay=0] - The number of milliseconds to delay before the tween will start.
 * @property {number} [duration=1000] - The duration of the tween in milliseconds.
 * @property {string} [ease='Power0'] - The easing equation to use for the tween.
 * @property {array} [easeParams] - Optional easing parameters.
 * @property {number} [hold=0] - The number of milliseconds to hold the tween for before yoyo'ing.
 * @property {number} [repeat=0] - The number of times to repeat the tween.
 * @property {number} [repeatDelay=0] - The number of milliseconds to pause before a tween will repeat.
 * @property {boolean} [yoyo=false] - Should the tween complete, then reverse the values incrementally to get back to the starting tween values? The reverse tweening will also take `duration` milliseconds to complete.
 * @property {boolean} [flipX=false] - Horizontally flip the target of the Tween when it completes (before it yoyos, if set to do so). Only works for targets that support the `flipX` property.
 * @property {boolean} [flipY=false] - Vertically flip the target of the Tween when it completes (before it yoyos, if set to do so). Only works for targets that support the `flipY` property.
 * @property {boolean} [persist=false] - Retain the tween within the Tween Manager, even after playback completes?
 * @property {function} [interpolation=null] - The interpolation function to use for array-based tween values.
 */
/**
 * Phaser Tween state constants.
 *
 * @typedef {Phaser.Tweens.States} Phaser.Tweens.StateType
 * @memberof Phaser.Tweens
 * @since 3.60.0
 */
/**
 * @typedef {object} Phaser.Types.Time.TimerEventConfig
 * @since 3.0.0
 *
 * @property {number} [delay=0] - The delay after which the Timer Event should fire, in milliseconds.
 * @property {number} [repeat=0] - The total number of times the Timer Event will repeat before finishing.
 * @property {boolean} [loop=false] - `true` if the Timer Event should repeat indefinitely.
 * @property {function} [callback] - The callback which will be called when the Timer Event fires.
 * @property {*} [callbackScope] - The scope (`this` object) with which to invoke the `callback`. The default is the Timer Event.
 * @property {Array.<*>} [args] - Additional arguments to be passed to the `callback`.
 * @property {number} [timeScale=1] - The scale of the elapsed time.
 * @property {number} [startAt=0] - The initial elapsed time in milliseconds. Useful if you want a long duration with repeat, but for the first loop to fire quickly.
 * @property {boolean} [paused=false] - `true` if the Timer Event should be paused.
 */
/**
 * @typedef {object} Phaser.Types.Time.TimelineEventConfig
 * @since 3.60.0
 *
 * @property {number} [at=0] - The time (in ms) at which the Event will fire. The Timeline starts at 0.
 * @property {number} [in] - If the Timeline is running, this is the time (in ms) at which the Event will fire based on its current elapsed value. If set it will override the `at` property.
 * @property {number} [from] - Fire this event 'from' milliseconds after the previous event in the Timeline. If set it will override the `at` and `in` properties.
 * @property {function} [run] - A function which will be called when the Event fires.
 * @property {function} [loop] - A function which will be called when the Event loops, this does not get called if the `repeat` method is not used or on first iteration.
 * @property {string} [event] - Optional string-based event name to emit when the Event fires. The event is emitted from the Timeline instance.
 * @property {*} [target] - The scope (`this` object) with which to invoke the run `callback`, if set.
 * @property {boolean} [once=false] - If set, the Event will be removed from the Timeline when it fires.
 * @property {boolean} [stop=false] - If set, the Timeline will stop and enter a complete state when this Event fires, even if there are other events after it.
 * @property {Phaser.Types.Tweens.TweenBuilderConfig|Phaser.Types.Tweens.TweenChainBuilderConfig|Phaser.Tweens.Tween|Phaser.Tweens.TweenChain} [tween] - A Tween or TweenChain configuration object or instance. If set, the Event will create this Tween when it fires.
 * @property {object} [set] - A key-value object of properties to set on the `target` when the Event fires. Ignored if no `target` is given.
 * @property {string|object} [sound] - A key from the Sound Manager to play, or a config object for a sound to play when the Event fires. If a config object it must provide two properties: `key` and `config`. The `key` is the key of the sound to play, and the `config` is the config is a Phaser.Types.Sound.SoundConfig object.
 */
/**
 * @typedef {object} Phaser.Types.Time.TimelineEvent
 * @since 3.60.0
 *
 * @property {boolean} complete - Has this event completed yet?
 * @property {boolean} once - Is this a once only event?
 * @property {number} time - The time (in elapsed ms) at which this event will fire.
 * @property {function} [repeat=0] - The amount of times this Event has repeated.
 * @property {function} [if=null] - User-land callback which will be called if set. If it returns `true` then this event run all of its actions, otherwise it will be skipped.
 * @property {function} [run=null] - User-land callback which will be called when the Event fires.
 * @property {function} [loop=null] - User-land callback which will be called when the Event loops.
 * @property {Phaser.Types.Tweens.TweenBuilderConfig|Phaser.Types.Tweens.TweenChainBuilderConfig|Phaser.Tweens.Tween|Phaser.Tweens.TweenChain} [tween=null] - Tween configuration object which will be used to create a Tween when the Event fires if set.
 * @property {object} [set=null] - Object containing properties to set on the `target` when the Event fires if set.
 * @property {string|object} [sound=null] - Sound configuration object which will be used to create a Sound when the Event fires if set.
 * @property {*} [target] - The scope (`this` object) with which to invoke the run `callback`.
 * @property {string} [event] - Optional event name to emit when the Event fires.
 * @property {Phaser.Tweens.Tween|Phaser.Tweens.TweenChain} [tweenInstance=null] - If this Event is using a Tween to manage its actions, this property will contain a reference to it.
 */
/**
 * @typedef {object} Phaser.Types.Tilemaps.TilemapConfig
 * @since 3.0.0
 * 
 * @property {string} [key] - The key in the Phaser cache that corresponds to the loaded tilemap data.
 * @property {number[][]} [data] - Instead of loading from the cache, you can also load directly from a 2D array of tile indexes.
 * @property {number} [tileWidth=32] - The width of a tile in pixels.
 * @property {number} [tileHeight=32] - The height of a tile in pixels.
 * @property {number} [width=10] - The width of the map in tiles.
 * @property {number} [height=10] - The height of the map in tiles.
 * @property {boolean} [insertNull=false] - Controls how empty tiles, tiles with an index of -1,
 * in the map data are handled. If `true`, empty locations will get a value of `null`. If `false`,
 * empty location will get a Tile object with an index of -1. If you've a large sparsely populated
 * map and the tile data doesn't need to change then setting this value to `true` will help with
 * memory consumption. However if your map is small or you need to update the tiles dynamically,
 * then leave the default value set.
 */
/**
 * @typedef {object} Phaser.Types.Tilemaps.TiledObject
 * @since 3.0.0
 *
 * @property {number} id - The unique object ID.
 * @property {string} name - The name this object was assigned in Tiled.
 * @property {string} type - The string type of this instance, as assigned in Tiled. Tiled supports inheriting instance types from tilesets; in that case, the type will be set in the tile's data, but will be `''` here; use the `gid` to fetch the tile data or properties.
 * @property {boolean} [visible] - The visible state of this object.
 * @property {number} [x] - The horizontal position of this object, in pixels, relative to the tilemap.
 * @property {number} [y] - The vertical position of this object, in pixels, relative to the tilemap.
 * @property {number} [width] - The width of this object, in pixels.
 * @property {number} [height] - The height of this object, in pixels.
 * @property {number} [rotation] - The rotation of the object in clockwise degrees.
 * @property {any} [properties] - Custom properties object.
 * @property {number} [gid] - Only set if of type 'tile'.
 * @property {boolean} [flippedHorizontal] - Only set if a tile object. The horizontal flip value.
 * @property {boolean} [flippedVertical] - Only set if a tile object. The vertical flip value.
 * @property {boolean} [flippedAntiDiagonal] - Only set if a tile object. The diagonal flip value.
 * @property {Phaser.Types.Math.Vector2Like[]} [polyline] - Only set if a polyline object. An array of objects corresponding to points, where each point has an `x` property and a `y` property.
 * @property {Phaser.Types.Math.Vector2Like[]} [polygon] - Only set if a polygon object. An array of objects corresponding to points, where each point has an `x` property and a `y` property.
 * @property {any} [text] - Only set if a text object. Contains the text objects properties.
 * @property {boolean} [rectangle] - Only set, and set to `true`, if a rectangle object.
 * @property {boolean} [ellipse] - Only set, and set to `true`, if a ellipse object.
 * @property {boolean} [point] - Only set, and set to `true`, if a point object.
 */
/**
 * @typedef {object} Phaser.Types.Tilemaps.StyleConfig
 * @since 3.0.0
 * 
 * @property {?(Phaser.Display.Color|number|null)} [tileColor=blue] - Color to use for drawing a filled rectangle at non-colliding tile locations. If set to null, non-colliding tiles will not be drawn.
 * @property {?(Phaser.Display.Color|number|null)} [collidingTileColor=orange] - Color to use for drawing a filled rectangle at colliding tile locations. If set to null, colliding tiles will not be drawn.
 * @property {?(Phaser.Display.Color|number|null)} [faceColor=grey] - Color to use for drawing a line at interesting tile faces. If set to null, interesting tile faces will not be drawn.
 */
/**
 * @typedef {object} Phaser.Types.Tilemaps.ObjectLayerConfig
 * @since 3.0.0
 * 
 * @property {string} [name='object layer'] - The name of the Object Layer.
 * @property {number} [opacity=1] - The opacity of the layer, between 0 and 1.
 * @property {any} [properties] - The custom properties defined on the Object Layer, keyed by their name.
 * @property {any} [propertytypes] - The type of each custom property defined on the Object Layer, keyed by its name.
 * @property {string} [type='objectgroup'] - The type of the layer, which should be `objectgroup`.
 * @property {boolean} [visible=true] - Whether the layer is shown (`true`) or hidden (`false`).
 * @property {any[]} [objects] - An array of all objects on this Object Layer.
 */
/**
 * @typedef {object} Phaser.Types.Tilemaps.MapDataConfig
 * @since 3.0.0
 * 
 * @property {string} [name] - The key in the Phaser cache that corresponds to the loaded tilemap data.
 * @property {number} [width=0] - The width of the entire tilemap.
 * @property {number} [height=0] - The height of the entire tilemap.
 * @property {number} [tileWidth=0] - The width of the tiles.
 * @property {number} [tileHeight=0] - The height of the tiles.
 * @property {number} [widthInPixels] - The width in pixels of the entire tilemap.
 * @property {number} [heightInPixels] - The height in pixels of the entire tilemap.
 * @property {number} [format] - The format of the Tilemap, as defined in Tiled.
 * @property {(string|Phaser.Tilemaps.Orientation)} [orientation] - The orientation of the map data (i.e. orthogonal, isometric, hexagonal), default 'orthogonal'.
 * @property {string} [renderOrder] - Determines the draw order of tilemap. Default is right-down.
 * @property {number} [version] - The version of Tiled the map uses.
 * @property {number} [properties] - Map specific properties (can be specified in Tiled).
 * @property {Phaser.Tilemaps.LayerData[]} [layers] - The layers of the tilemap.
 * @property {array} [images] - An array with all the layers configured to the MapData.
 * @property {object} [objects] - An array of Tiled Image Layers.
 * @property {object} [collision] - An object of Tiled Object Layers.
 * @property {Phaser.Tilemaps.Tileset[]} [tilesets] - The tilesets the map uses.
 * @property {array} [imageCollections] - The collection of images the map uses(specified in Tiled).
 * @property {array} [tiles] - Array of Tile instances.
 */
/**
 * @typedef {object} Phaser.Types.Tilemaps.LayerDataConfig
 * @since 3.0.0
 *
 * @property {string} [name] - The name of the layer, if specified in Tiled.
 * @property {number} [x=0] - The x offset of where to draw from the top left.
 * @property {number} [y=0] - The y offset of where to draw from the top left.
 * @property {number} [width=0] - The width of the layer in tiles.
 * @property {number} [height=0] - The height of the layer in tiles.
 * @property {number} [tileWidth=0] - The pixel width of the tiles.
 * @property {number} [tileHeight=0] - The pixel height of the tiles.
 * @property {number} [baseTileWidth=0] - The base tile width.
 * @property {number} [baseTileHeight=0] - The base tile height.
 * @property {number} [widthInPixels=0] - The width in pixels of the entire layer.
 * @property {number} [heightInPixels=0] - The height in pixels of the entire layer.
 * @property {number} [alpha=1] - The alpha value of the layer.
 * @property {boolean} [visible=true] - Is the layer visible or not?
 * @property {object[]} [properties] - Layer specific properties (can be specified in Tiled)
 * @property {array} [indexes] - Tile ID index map.
 * @property {array} [collideIndexes] - Tile Collision ID index map.
 * @property {array} [callbacks] - An array of callbacks.
 * @property {array} [bodies] - An array of physics bodies.
 * @property {array} [data] - An array of the tile data indexes.
 * @property {Phaser.Tilemaps.TilemapLayer} [tilemapLayer] - A reference to the Tilemap layer that owns this data.
 */
/**
 * @typedef {object} Phaser.Types.Tilemaps.GIDData
 * @since 3.0.0
 * 
 * @property {number} gid - The Tiled GID.
 * @property {boolean} flippedHorizontal - Horizontal flip flag.
 * @property {boolean} flippedVertical - Vertical flip flag.
 * @property {boolean} flippedAntiDiagonal - Diagonal flip flag.
 * @property {number} rotation - Amount of rotation.
 * @property {boolean} flipped - Is flipped?
 */
/**
 * @typedef {object} Phaser.Types.Tilemaps.FilteringOptions
 * @since 3.0.0
 * 
 * @property {boolean} [isNotEmpty=false] - If true, only return tiles that don't have -1 for an index.
 * @property {boolean} [isColliding=false] - If true, only return tiles that collide on at least one side.
 * @property {boolean} [hasInterestingFace=false] - If true, only return tiles that have at least one interesting face.
 */
/**
 * @typedef {object} Phaser.Types.Tilemaps.DebugStyleOptions
 * @since 3.0.0
 * 
 * @property {?Phaser.Display.Color} [styleConfig.tileColor=blue] - Color to use for drawing a filled rectangle at
 * non-colliding tile locations. If set to null, non-colliding tiles will not be drawn.
 * @property {?Phaser.Display.Color} [styleConfig.collidingTileColor=orange] - Color to use for drawing a filled
 * rectangle at colliding tile locations. If set to null, colliding tiles will not be drawn.
 * @property {?Phaser.Display.Color} [styleConfig.faceColor=grey] - Color to use for drawing a line at interesting
 * tile faces. If set to null, interesting tile faces will not be drawn.
 */
/**
 * @typedef {object} Phaser.Types.Tilemaps.CreateFromObjectLayerConfig
 * @since 3.50.0
 *
 * @property {number} [id] - A unique Object ID to convert.
 * @property {number} [gid] - An Object GID to convert.
 * @property {string} [name] - An Object Name to convert.
 * @property {string} [type] - An Object Type to convert.
 * @property {function} [classType] - A custom class type to convert the objects in to. The default is {@link Phaser.GameObjects.Sprite}. A custom class should resemble Sprite or Image; see {@link Phaser.Types.Tilemaps.CreateFromObjectsClassTypeConstructor}.
 * @property {boolean} [ignoreTileset] - By default, gid-based objects copy properties and respect the type of the tile at that gid and treat the object as an override. If this is true, they don't, and use only the fields set on the object itself.
 * @property {Phaser.Scene} [scene] - A Scene reference, passed to the Game Objects constructors.
 * @property {Phaser.GameObjects.Container} [container] - Optional Container to which the Game Objects are added.
 * @property {(string|Phaser.Textures.Texture)} [key] - Optional key of a Texture to be used, as stored in the Texture Manager, or a Texture instance. If omitted, the object's gid's tileset key is used if available.
 * @property {(string|number)} [frame] - Optional name or index of the frame within the Texture. If omitted, the tileset index is used, assuming that spritesheet frames exactly match tileset indices & geometries -- if available.
 */
/**
 * Phaser Tilemap constants for orientation.
 *
 * To find out what each mode does please see [Phaser.Tilemaps.Orientation]{@link Phaser.Tilemaps.Orientation}.
 *
 * @typedef {Phaser.Tilemaps.Orientation} Phaser.Tilemaps.OrientationType
 * @memberof Phaser.Tilemaps
 * @since 3.50.0
 */
/**
 * @typedef {object} Phaser.Types.Math.Vector4Like
 * @since 3.50.0
 *
 * @property {number} [x] - The x component.
 * @property {number} [y] - The y component.
 * @property {number} [z] - The z component.
 * @property {number} [w] - The w component.
 */
/**
 * @typedef {object} Phaser.Types.Math.Vector3Like
 * @since 3.50.0
 *
 * @property {number} [x] - The x component.
 * @property {number} [y] - The y component.
 * @property {number} [z] - The z component.
 */
/**
 * @typedef {object} Phaser.Types.Math.Vector2Like
 * @since 3.0.0
 *
 * @property {number} x - The x component.
 * @property {number} y - The y component.
 */
/**
 * @typedef {object} Phaser.Types.Math.SinCosTable
 * @since 3.0.0
 *
 * @property {number} sin - The sine value.
 * @property {number} cos - The cosine value.
 * @property {number} length - The length.
 */
/**
 * @typedef {object} Phaser.Types.Math.RectangleLike
 * @since 3.80.0
 *
 * @property {number} x - The x component.
 * @property {number} y - The y component.
 * @property {number} width - The width component.
 * @property {number} height - The height component.
 */
/**
 * @typedef {object} Phaser.Types.Loader.XHRSettingsObject
 * @since 3.0.0
 *
 * @property {XMLHttpRequestResponseType} responseType - The response type of the XHR request, i.e. `blob`, `text`, etc.
 * @property {boolean} [async=true] - Should the XHR request use async or not?
 * @property {string} [user=''] - Optional username for the XHR request.
 * @property {string} [password=''] - Optional password for the XHR request.
 * @property {number} [timeout=0] - Optional XHR timeout value.
 * @property {(object|undefined)} [headers] - This value is used to populate the XHR `setRequestHeader` and is undefined by default.
 * @property {(string|undefined)} [header] - This value is used to populate the XHR `setRequestHeader` and is undefined by default.
 * @property {(string|undefined)} [headerValue] - This value is used to populate the XHR `setRequestHeader` and is undefined by default.
 * @property {(string|undefined)} [requestedWith] - This value is used to populate the XHR `setRequestHeader` and is undefined by default.
 * @property {(string|undefined)} [overrideMimeType] - Provide a custom mime-type to use instead of the default.
 * @property {boolean} [withCredentials=false] - The withCredentials property indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies, authorization headers or TLS client certificates. Setting withCredentials has no effect on same-site requests.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileConfig
 * @since 3.0.0
 *
 * @property {string} type - The name of the Loader method that loads this file, e.g., 'image', 'json', 'spritesheet'.
 * @property {string} key - Unique cache key (unique within its file type)
 * @property {object|string} [url] - The URL of the file, not including baseURL.
 * @property {string} [path] - The path of the file, not including the baseURL.
 * @property {string} [extension] - The default extension this file uses.
 * @property {XMLHttpRequestResponseType} [responseType] - The responseType to be used by the XHR request.
 * @property {(Phaser.Types.Loader.XHRSettingsObject|false)} [xhrSettings=false] - Custom XHR Settings specific to this file and merged with the Loader defaults.
 * @property {any} [config] - A config object that can be used by file types to store transitional data.
 * @property {string} [textureURL] - The absolute or relative URL to load the texture image file from.
 * @property {string} [textureExtension='png'] - The default file extension to use for the image texture if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [textureXhrSettings] - Extra XHR Settings specifically for the texture image file.
 * @property {object|string} [atlasURL] - The absolute or relative URL to load the atlas json file from. Or, a well formed JSON object to use instead.
 * @property {string} [atlasExtension='json'] - The default file extension to use for the atlas json if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [atlasXhrSettings] - Extra XHR Settings specifically for the atlas json file.
 * @property {string} [normalMap] - The filename of an associated normal map. It uses the same path and url to load as the texture image.
 * @property {AudioContext} [context] - The optional AudioContext this file will use to process itself (only used by Sound objects).
 * @property {string} [jsonURL] - The absolute or relative URL to load the json file from. Or a well formed JSON object to use instead.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [jsonXhrSettings] - Extra XHR Settings specifically for the json file.
 * @property {{(string|string[])}} [audioURL] - The absolute or relative URL to load the audio file from.
 * @property {any} [audioConfig] - The audio configuration options.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [audioXhrSettings] - Extra XHR Settings specifically for the audio file.
 * @property {any} [dataType] - Optional type to cast the binary file to once loaded. For example, `Uint8Array`.
 * @property {string} [fontDataURL] - The absolute or relative URL to load the font data xml file from.
 * @property {string} [fontDataExtension='xml'] - The default file extension to use for the font data xml if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [fontDataXhrSettings] - Extra XHR Settings specifically for the font data xml file.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [ETC] - The string, or file entry object, for an ETC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [ETC1] - The string, or file entry object, for an ETC1 format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [ATC] - The string, or file entry object, for an ATC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [ASTC] - The string, or file entry object, for an ASTC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [BPTC] - The string, or file entry object, for an BPTC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [RGTC] - The string, or file entry object, for an RGTC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [PVRTC] - The string, or file entry object, for an PVRTC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [S3TC] - The string, or file entry object, for an S3TC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [S3TCSRGB] - The string, or file entry object, for an S3TCSRGB format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [IMG] - The string, or file entry object, for the fallback image file.
 * @property {string} [shaderType='fragment'] - The type of shader. Either `fragment` for a fragment shader, or `vertex` for a vertex shader. This is ignored if you load a shader bundle.
 * @property {number} [width=512] - The width of the texture the HTML will be rendered to.
 * @property {number} [height=512] - The height of the texture the HTML will be rendered to.
 * @property {Phaser.Types.Loader.FileTypes.ImageFrameConfig} [frameConfig] - The frame configuration object. Only provided for, and used by, Sprite Sheets.
 * @property {string} [dataKey] - If specified instead of the whole JSON file being parsed and added to the Cache, only the section corresponding to this property key will be added. If the property you want to extract is nested, use periods to divide it.
 * @property {string} [baseURL] - Optional Base URL to use when loading the textures defined in the atlas data.
 * @property {boolean} [flipUV] - Flip the UV coordinates stored in the model data?
 * @property {string} [matURL] - An optional absolute or relative URL to the object material file from. If undefined or `null`, no material file will be loaded.
 * @property {string} [matExtension='mat'] - The default material file extension to use if no url is provided.
 * @property {boolean} [start=false] - Automatically start the plugin after loading?
 * @property {string} [mapping] - If this plugin is to be injected into the Scene, this is the property key used.
 * @property {string} [systemKey] - If this plugin is to be added to Scene.Systems, this is the property key for it.
 * @property {string} [sceneKey] - If this plugin is to be added to the Scene, this is the property key for it.
 * @property {Phaser.Types.Loader.FileTypes.SVGSizeConfig} [svgConfig] - The svg size configuration object.
 * @property {number} [maxRetries=2] - The number of times to retry the file load if it fails.
 */
/**
 * @typedef {object} Phaser.Types.Input.InteractiveObject
 * @since 3.0.0
 *
 * @property {Phaser.GameObjects.GameObject} gameObject - The Game Object to which this Interactive Object is bound.
 * @property {boolean} enabled - Is this Interactive Object currently enabled for input events?
 * @property {boolean} draggable - Is this Interactive Object draggable? Enable with `InputPlugin.setDraggable`.
 * @property {boolean} dropZone - Is this Interactive Object a drag-targets drop zone? Set when the object is created.
 * @property {(boolean|string)} cursor - Should this Interactive Object change the cursor (via css) when over? (desktop only)
 * @property {?Phaser.GameObjects.GameObject} target - An optional drop target for a draggable Interactive Object.
 * @property {Phaser.Cameras.Scene2D.Camera} camera - The most recent Camera to be tested against this Interactive Object.
 * @property {any} hitArea - The hit area for this Interactive Object. Typically a geometry shape, like a Rectangle or Circle.
 * @property {Phaser.Types.Input.HitAreaCallback} hitAreaCallback - The 'contains' check callback that the hit area shape will use for all hit tests.
 * @property {Phaser.GameObjects.Shape} hitAreaDebug - If this Interactive Object has been enabled for debug, via `InputPlugin.enableDebug` then this property holds its debug shape.
 * @property {boolean} customHitArea - Was the hitArea for this Interactive Object created based on texture size (false), or a custom shape? (true)
 * @property {number} localX - The x coordinate that the Pointer interacted with this object on, relative to the Game Object's top-left position.
 * @property {number} localY - The y coordinate that the Pointer interacted with this object on, relative to the Game Object's top-left position.
 * @property {(0|1|2)} dragState - The current drag state of this Interactive Object. 0 = Not being dragged, 1 = being checked for drag, or 2 = being actively dragged.
 * @property {number} dragStartX - The x coordinate of the Game Object that owns this Interactive Object when the drag started.
 * @property {number} dragStartY - The y coordinate of the Game Object that owns this Interactive Object when the drag started.
 * @property {number} dragStartXGlobal - The x coordinate that the Pointer started dragging this Interactive Object from.
 * @property {number} dragStartYGlobal - The y coordinate that the Pointer started dragging this Interactive Object from.
 * @property {number} dragX - The x coordinate that this Interactive Object is currently being dragged to.
 * @property {number} dragY - The y coordinate that this Interactive Object is currently being dragged to.
 */
/**
 * @typedef {object} Phaser.Types.Input.InputPluginContainer
 * @since 3.0.0
 *
 * @property {string} key - The unique name of this plugin in the input plugin cache.
 * @property {function} plugin - The plugin to be stored. Should be the source object, not instantiated.
 * @property {string} [mapping] - If this plugin is to be injected into the Input Plugin, this is the property key map used.
 */
/**
 * @typedef {object} Phaser.Types.Input.InputConfiguration
 * @since 3.0.0
 *
 * @property {any} [hitArea] - The object / shape to use as the Hit Area. If not given it will try to create a Rectangle based on the texture frame.
 * @property {Phaser.Types.Input.HitAreaCallback} [hitAreaCallback] - The callback that determines if the pointer is within the Hit Area shape or not.
 * @property {boolean} [draggable=false] - If `true` the Interactive Object will be set to be draggable and emit drag events.
 * @property {boolean} [dropZone=false] - If `true` the Interactive Object will be set to be a drop zone for draggable objects.
 * @property {boolean} [useHandCursor=false] - If `true` the Interactive Object will set the `pointer` hand cursor when a pointer is over it. This is a short-cut for setting `cursor: 'pointer'`.
 * @property {string} [cursor] - The CSS string to be used when the cursor is over this Interactive Object.
 * @property {boolean} [pixelPerfect=false] - If `true` the a pixel perfect function will be set for the hit area callback. Only works with image texture based Game Objects, not Render Textures.
 * @property {number} [alphaTolerance=1] - If `pixelPerfect` is set, this is the alpha tolerance threshold value used in the callback. A value of 255 will match only fully opaque pixels.
 */
/**
 * A Phaser Input Event Data object.
 *
 * This object is passed to the registered event listeners and allows you to stop any further propagation.
 *
 * @typedef {object} Phaser.Types.Input.EventData
 * @since 3.15.1
 *
 * @property {boolean} [cancelled=false] - The cancelled state of this Event.
 * @property {function} stopPropagation - Call this method to stop this event from passing any further down the event chain.
 */
/**
 * An object containing the dimensions and mipmap data for a Compressed Texture.
 *
 * @typedef {object} Phaser.Types.Textures.CompressedTextureData
 * @since 3.60.0
 *
 * @property {boolean} compressed - Is this a compressed texture?
 * @property {boolean} generateMipmap - Should this texture have mipmaps generated?
 * @property {number} width - The width of the maximum size of the texture.
 * @property {number} height - The height of the maximum size of the texture.
 * @property {GLenum} internalFormat - The WebGL internal texture format.
 * @property {Phaser.Types.Textures.MipmapType[]} mipmaps - An array of MipmapType objects.
 */
/**
 * An entry in the Web Audio Decoding Queue.
 *
 * @typedef {object} Phaser.Types.Sound.WebAudioDecodeEntry
 * @since 3.60.0
 *
 * @property {string} key - The key of the sound.
 * @property {function} success - The callback to invoke on successful decoding.
 * @property {function} failure - The callback to invoke if the decoding fails.
 * @property {boolean} decoding - Has the decoding of this sound file started?
 */
/**
 * Config object containing settings for the source of the spatial sound.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Web_audio_spatialization_basics
 *
 * @typedef {object} Phaser.Types.Sound.SpatialSoundConfig
 * @since 3.60.0
 *
 * @property {number} [x=0] - The horizontal position of the audio in a right-hand Cartesian coordinate system.
 * @property {number} [y=0] - The vertical position of the audio in a right-hand Cartesian coordinate system.
 * @property {number} [z=0] - Represents the longitudinal (back and forth) position of the audio in a right-hand Cartesian coordinate system.
 * @property {('equalpower'|'HRTF')} [panningModel='equalpower'] - An enumerated value determining which spatialization algorithm to use to position the audio in 3D space.
 * @property {('linear'|'inverse'|'exponential')} [distanceModel='inverse'] - Which algorithm to use to reduce the volume of the audio source as it moves away from the listener. Possible values are "linear", "inverse" and "exponential". The default value is "inverse".
 * @property {number} [orientationX=0] - The horizontal position of the audio source's vector in a right-hand Cartesian coordinate system.
 * @property {number} [orientationY=0] - The vertical position of the audio source's vector in a right-hand Cartesian coordinate system.
 * @property {number} [orientationZ=-1] - Represents the longitudinal (back and forth) position of the audio source's vector in a right-hand Cartesian coordinate system.
 * @property {number} [refDistance=1] - A double value representing the reference distance for reducing volume as the audio source moves further from the listener. For distances greater than this the volume will be reduced based on `rolloffFactor` and `distanceModel`.
 * @property {number} [maxDistance=10000] - The maximum distance between the audio source and the listener, after which the volume is not reduced any further.
 * @property {number} [rolloffFactor=1] - A double value describing how quickly the volume is reduced as the source moves away from the listener. This value is used by all distance models.
 * @property {number} [coneInnerAngle=360] - The angle, in degrees, of a cone inside of which there will be no volume reduction.
 * @property {number} [coneOuterAngle=0] - The angle, in degrees, of a cone outside of which the volume will be reduced by a constant value, defined by the `coneOuterGain` property.
 * @property {number} [coneOuterGain=0] - The amount of volume reduction outside the cone defined by the `coneOuterAngle` attribute. Its default value is 0, meaning that no sound can be heard. A value between 0 and 1.
 * @property {Phaser.Types.Math.Vector2Like} [follow] - Set this Sound object to automatically track the x/y position of this object. Can be a Phaser Game Object, Vec2 or anything that exposes public x/y properties.
 */
/**
 * Marked section of a sound represented by name, and optionally start time, duration, and config object.
 *
 * @typedef {object} Phaser.Types.Sound.SoundMarker
 * @since 3.0.0
 *
 * @property {string} name - Unique identifier of a sound marker.
 * @property {number} [start=0] - Sound position offset at witch playback should start.
 * @property {number} [duration] - Playback duration of this marker.
 * @property {Phaser.Types.Sound.SoundConfig} [config] - An optional config object containing default marker settings.
 */
/**
 * Config object containing various sound settings.
 *
 * @typedef {object} Phaser.Types.Sound.SoundConfig
 * @since 3.0.0
 *
 * @property {boolean} [mute=false] - Boolean indicating whether the sound should be muted or not.
 * @property {number} [volume=1] - A value between 0 (silence) and 1 (full volume).
 * @property {number} [rate=1] - Defines the speed at which the sound should be played.
 * @property {number} [detune=0] - Represents detuning of sound in [cents](https://en.wikipedia.org/wiki/Cent_%28music%29).
 * @property {number} [seek=0] - Position of playback for this sound, in seconds.
 * @property {boolean} [loop=false] - Whether or not the sound or current sound marker should loop.
 * @property {number} [delay=0] - Time, in seconds, that should elapse before the sound actually starts its playback.
 * @property {number} [pan=0] - A value between -1 (full left pan) and 1 (full right pan). 0 means no pan.
 * @property {Phaser.Types.Sound.SpatialSoundConfig} [source=null] - An optional config object containing default spatial sound settings.
 */
/**
 * A Audio Data object.
 * 
 * You can pass an array of these objects to the WebAudioSoundManager `decodeAudio` method to have it decode
 * them all at once.
 *
 * @typedef {object} Phaser.Types.Sound.DecodeAudioConfig
 * @since 3.18.0
 *
 * @property {string} key - The string-based key to be used to reference the decoded audio in the audio cache.
 * @property {(ArrayBuffer|string)} data - The audio data, either a base64 encoded string, an audio media-type data uri, or an ArrayBuffer instance.
 */
/**
 * Audio sprite sound type.
 *
 * @typedef {object} Phaser.Types.Sound.AudioSpriteSound
 * @since 3.0.0
 *
 * @property {object} spritemap - Local reference to 'spritemap' object form json file generated by audiosprite tool.
 */
/**
 * @typedef {object} Phaser.Types.Scenes.SettingsObject
 * @since 3.0.0
 *
 * @property {number} status - The current status of the Scene. Maps to the Scene constants.
 * @property {string} key - The unique key of this Scene. Unique within the entire Game instance.
 * @property {boolean} active - The active state of this Scene. An active Scene updates each step.
 * @property {boolean} visible - The visible state of this Scene. A visible Scene renders each step.
 * @property {boolean} isBooted - Has the Scene finished booting?
 * @property {boolean} isTransition - Is the Scene in a state of transition?
 * @property {?Phaser.Scene} transitionFrom - The Scene this Scene is transitioning from, if set.
 * @property {number} transitionDuration - The duration of the transition, if set.
 * @property {boolean} transitionAllowInput - Is this Scene allowed to receive input during transitions?
 * @property {object} data - a data bundle passed to this Scene from the Scene Manager.
 * @property {(false|Phaser.Types.Loader.FileTypes.PackFileSection)} pack - Files to be loaded before the Scene begins.
 * @property {?(Phaser.Types.Cameras.Scene2D.CameraConfig|Phaser.Types.Cameras.Scene2D.CameraConfig[])} cameras - The Camera configuration object.
 * @property {Object.<string, string>} map - The Scene's Injection Map.
 * @property {Phaser.Types.Core.PhysicsConfig} physics - The physics configuration object for the Scene.
 * @property {Phaser.Types.Core.LoaderConfig} loader - The loader configuration object for the Scene.
 * @property {(false|*)} plugins - The plugin configuration object for the Scene.
 */
/**
 * @typedef {object} Phaser.Types.Scenes.SettingsConfig
 * @since 3.0.0
 *
 * @property {string} [key] - The unique key of this Scene. Must be unique within the entire Game instance.
 * @property {boolean} [active=false] - Does the Scene start as active or not? An active Scene updates each step.
 * @property {boolean} [visible=true] - Does the Scene start as visible or not? A visible Scene renders each step.
 * @property {(false|Phaser.Types.Loader.FileTypes.PackFileSection)} [pack=false] - Files to be loaded before the Scene begins.
 * @property {?(Phaser.Types.Cameras.Scene2D.CameraConfig|Phaser.Types.Cameras.Scene2D.CameraConfig[])} [cameras=null] - An optional Camera configuration object.
 * @property {Object.<string, string>} [map] - Overwrites the default injection map for a scene.
 * @property {Object.<string, string>} [mapAdd] - Extends the injection map for a scene.
 * @property {Phaser.Types.Core.PhysicsConfig} [physics={}] - The physics configuration object for the Scene.
 * @property {Phaser.Types.Core.LoaderConfig} [loader={}] - The loader configuration object for the Scene.
 * @property {(false|*)} [plugins=false] - The plugin configuration object for the Scene.
 */
/**
 * @typedef {(Phaser.Scene|Phaser.Types.Scenes.SettingsConfig|Phaser.Types.Scenes.CreateSceneFromObjectConfig|function)} Phaser.Types.Scenes.SceneType
 * @since 3.60.0
 */
/**
 * @typedef {object} Phaser.Types.Scenes.SceneTransitionConfig
 * @since 3.5.0
 *
 * @property {string} target - The Scene key to transition to.
 * @property {number} [duration=1000] - The duration, in ms, for the transition to last.
 * @property {boolean} [sleep=false] - Will the Scene responsible for the transition be sent to sleep on completion (`true`), or stopped? (`false`)
 * @property {boolean} [remove=false] - Will the Scene responsible for the transition be removed from the Scene Manager after the transition completes?
 * @property {boolean} [allowInput=false] - Will the Scenes Input system be able to process events while it is transitioning in or out?
 * @property {boolean} [moveAbove] - Move the target Scene to be above this one before the transition starts.
 * @property {boolean} [moveBelow] - Move the target Scene to be below this one before the transition starts.
 * @property {function} [onUpdate] - This callback is invoked every frame for the duration of the transition.
 * @property {any} [onUpdateScope] - The context in which the callback is invoked.
 * @property {Phaser.Types.Scenes.SceneTransitionOnStartCallback} [onStart] - This callback is invoked when transition starting.
 * @property {any} [onStartScope] - The context in which the callback is invoked.
 * @property {any} [data] - An object containing any data you wish to be passed to the target scene's init / create methods (if sleep is false) or to the target scene's wake event callback (if sleep is true).
 */
/**
 * @typedef {object} Phaser.Types.Scenes.CreateSceneFromObjectConfig
 * @since 3.17.0
 *
 * @property {Phaser.Types.Scenes.SceneInitCallback} [init] - The scene's init callback.
 * @property {Phaser.Types.Scenes.ScenePreloadCallback} [preload] - The scene's preload callback.
 * @property {Phaser.Types.Scenes.SceneCreateCallback} [create] - The scene's create callback.
 * @property {Phaser.Types.Scenes.SceneUpdateCallback} [update] - The scene's update callback. See {@link Phaser.Scene#update}.
 * @property {any} [extend] - Any additional properties, which will be copied to the Scene after it's created (except `data` or `sys`).
 * @property {any} [extend.data] - Any values, which will be merged into the Scene's Data Manager store.
 */
/**
 * Phaser Scale Manager constants for zoom modes.
 *
 * To find out what each mode does please see [Phaser.Scale.Zoom]{@link Phaser.Scale.Zoom}.
 *
 * @typedef {Phaser.Scale.Zoom} Phaser.Scale.ZoomType
 * @memberof Phaser.Scale
 * @since 3.16.0
 */
/**
 * Phaser Scale Manager constants for the different scale modes available.
 *
 * To find out what each mode does please see [Phaser.Scale.ScaleModes]{@link Phaser.Scale.ScaleModes}.
 *
 * @typedef {Phaser.Scale.ScaleModes} Phaser.Scale.ScaleModeType
 * @memberof Phaser.Scale
 * @since 3.16.0
 */
/**
 * Phaser Scale Manager constants for orientation.
 *
 * To find out what each mode does please see [Phaser.Scale.Orientation]{@link Phaser.Scale.Orientation}.
 *
 * @typedef {Phaser.Scale.Orientation} Phaser.Scale.OrientationType
 * @memberof Phaser.Scale
 * @since 3.16.0
 */
/**
 * Phaser Scale Manager constants for centering the game canvas.
 *
 * To find out what each mode does please see [Phaser.Scale.Center]{@link Phaser.Scale.Center}.
 *
 * @typedef {Phaser.Scale.Center} Phaser.Scale.CenterType
 * @memberof Phaser.Scale
 * @since 3.16.0
 */
/**
 * @typedef {object} Phaser.Types.Plugins.GlobalPlugin
 * @since 3.0.0
 *
 * @property {string} key - The unique name of this plugin within the plugin cache.
 * @property {function} plugin - An instance of the plugin.
 * @property {boolean} [active] - Is the plugin active or not?
 * @property {string} [mapping] - If this plugin is to be injected into the Scene Systems, this is the property key map used.
 */
/**
 * @typedef {object} Phaser.Types.Plugins.CustomPluginContainer
 * @since 3.8.0
 *
 * @property {string} key - The unique name of this plugin in the custom plugin cache.
 * @property {function} plugin - The plugin to be stored. Should be the source object, not instantiated.
 */
/**
 * @typedef {object} Phaser.Types.Plugins.CorePluginContainer
 * @since 3.8.0
 *
 * @property {string} key - The unique name of this plugin in the core plugin cache.
 * @property {function} plugin - The plugin to be stored. Should be the source object, not instantiated.
 * @property {string} [mapping] - If this plugin is to be injected into the Scene Systems, this is the property key map used.
 * @property {boolean} [custom=false] - Core Scene plugin or a Custom Scene plugin?
 */
/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.WebGLTextureCompression
 * @since 3.55.0
 *
 * @property {object|undefined} ASTC - Indicates if ASTC compression is supported (mostly iOS).
 * @property {object|undefined} ATC - Indicates if ATC compression is supported.
 * @property {object|undefined} BPTC - Indicates if BPTC compression is supported.
 * @property {object|undefined} ETC - Indicates if ETC compression is supported (mostly Android).
 * @property {object|undefined} ETC1 - Indicates if ETC1 compression is supported (mostly Android).
 * @property {object|undefined} IMG - Indicates the browser supports true color images (all browsers).
 * @property {object|undefined} PVRTC - Indicates if PVRTC compression is supported (mostly iOS).
 * @property {object|undefined} RGTC - Indicates if RGTC compression is supported (mostly iOS).
 * @property {object|undefined} S3TC - Indicates if S3TC compression is supported on current device (mostly Windows).
 * @property {object|undefined} S3TCSRGB - Indicates if S3TCSRGB compression is supported on current device (mostly Windows).
 */
/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.WebGLPipelineUniformsConfig
 * @since 3.55.1
 *
 * @property {string} name - The name of the uniform as defined in the shader.
 * @property {number} location - The location of the uniform.
 * @property {?function} setter - The setter function called on the WebGL context to set the uniform value.
 * @property {number} [value1] - The first cached value of the uniform.
 * @property {number} [value2] - The first cached value of the uniform.
 * @property {number} [value3] - The first cached value of the uniform.
 * @property {number} [value4] - The first cached value of the uniform.
 */
/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.WebGLPipelineShaderConfig
 * @since 3.50.0
 *
 * @property {string} [name] - The name of the shader. Doesn't have to be unique, but makes shader look-up easier if it is.
 * @property {string} [vertShader] - The source code, as a string, for the vertex shader. If not given, uses the `Phaser.Types.Renderer.WebGL.WebGLPipelineConfig.vertShader` property instead.
 * @property {string} [fragShader] - The source code, as a string, for the fragment shader. Can include `%count%` and `%forloop%` declarations for multi-texture support. If not given, uses the `Phaser.Types.Renderer.WebGL.WebGLPipelineConfig.fragShader` property instead.
 * @property {Phaser.Types.Renderer.WebGL.WebGLPipelineAttributeConfig[]} [attributes] - An array of shader attribute data. All shaders bound to this pipeline must use the same attributes.
 */
/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.WebGLPipelineConfig
 * @since 3.50.0
 *
 * @property {Phaser.Game} game - The Phaser.Game instance that owns this pipeline.
 * @property {string} [name] - The name of the pipeline.
 * @property {GLenum} [topology=gl.TRIANGLES] - How the primitives are rendered. The default value is GL_TRIANGLES. Here is the full list of rendering primitives: (https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants).
 * @property {string} [vertShader] - The source code, as a string, for the vertex shader. If you need to assign multiple shaders, see the `shaders` property.
 * @property {string} [fragShader] - The source code, as a string, for the fragment shader. Can include `%count%` and `%forloop%` declarations for multi-texture support. If you need to assign multiple shaders, see the `shaders` property.
 * @property {number} [batchSize] - The number of quads to hold in the batch. Defaults to `RenderConfig.batchSize`. This amount * 6 gives the vertex capacity.
 * @property {number} [vertexSize] - The size, in bytes, of a single entry in the vertex buffer. Defaults to Float32Array.BYTES_PER_ELEMENT * 6 + Uint8Array.BYTES_PER_ELEMENT * 4.
 * @property {(number[]|Float32Array)} [vertices] - An optional Array or Typed Array of pre-calculated vertices data that is copied into the vertex data.
 * @property {Phaser.Types.Renderer.WebGL.WebGLPipelineAttributeConfig[]} [attributes] - An array of shader attribute data. All shaders bound to this pipeline must use the same attributes.
 * @property {Phaser.Types.Renderer.WebGL.WebGLPipelineShaderConfig[]} [shaders] - An array of shaders, all of which are created for this one pipeline. Uses the `vertShader`, `fragShader`, `attributes` and `uniforms` properties of this object as defaults.
 * @property {boolean} [forceZero=false] - Force the shader to use just a single sampler2d? Set for anything that extends the Single Pipeline.
 * @property {(boolean|number|Phaser.Types.Renderer.WebGL.RenderTargetConfig[])} [renderTarget] - Create Render Targets for this pipeline. Can be a number, which determines the quantity, a boolean (sets quantity to 1), or an array of Render Target configuration objects.
 * @property {string} [resizeUniform=''] - If the WebGL renderer resizes, this uniform will be set with the new width and height values as part of the pipeline resize call.
 */
/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.WebGLPipelineBatchEntry
 * @since 3.60.0
 *
 * @property {number} start - The vertext count this batch entry starts from.
 * @property {number} count - The total number of vertices in this batch entry.
 * @property {number} unit - The current texture unit of the batch entry.
 * @property {number} maxUnit - The maximum number of texture units in this batch entry.
 * @property {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper[]} texture - An array of WebGLTextureWrapper references used in this batch entry.
 */
/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.WebGLPipelineAttributeConfig
 * @since 3.50.0
 *
 * @property {string} name - The name of the attribute as defined in the vertex shader.
 * @property {number} size - The number of components in the attribute, i.e. 1 for a float, 2 for a vec2, 3 for a vec3, etc.
 * @property {Phaser.Types.Renderer.WebGL.WebGLConst} type - The data type of the attribute, one of the `WEBGL_CONST` values, i.e. `WEBGL_CONST.FLOAT`, `WEBGL_CONST.UNSIGNED_BYTE`, etc.
 * @property {boolean} [normalized=false] - Should the attribute data be normalized?
 */
/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.WebGLPipelineAttribute
 * @since 3.50.0
 *
 * @property {string} name - The name of the attribute as defined in the vertex shader.
 * @property {number} size - The number of components in the attribute, i.e. 1 for a float, 2 for a vec2, 3 for a vec3, etc.
 * @property {GLenum} type - The data type of the attribute. Either `gl.BYTE`, `gl.SHORT`, `gl.UNSIGNED_BYTE`, `gl.UNSIGNED_SHORT` or `gl.FLOAT`.
 * @property {number} offset - The offset, in bytes, of this attribute data in the vertex array. Equivalent to `offsetof(vertex, attrib)` in C.
 * @property {boolean} normalized - Should the attribute data be normalized?
 * @property {boolean} enabled - You should set this to `false` by default. The pipeline will enable it on boot.
 * @property {(number|Phaser.Renderer.WebGL.Wrappers.WebGLAttribLocationWrapper)} location - You should set this to `-1` by default. The pipeline will set it on boot.
 */
/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.WebGLConst
 * @since 3.50.0
 *
 * @property {GLenum} enum - The data type of the attribute, i.e. `gl.BYTE`, `gl.SHORT`, `gl.UNSIGNED_BYTE`, `gl.FLOAT`, etc.
 * @property {number} size - The size, in bytes, of the data type.
 */
/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.RenderTargetConfig
 * @since 3.50.0
 *
 * @property {number} [scale=1] - A value between 0 and 1. Controls the size of this Render Target in relation to the Renderer. A value of 1 matches it. 0.5 makes the Render Target half the size of the renderer, etc.
 * @property {number} [minFilter=0] - The minFilter mode of the texture. 0 is `LINEAR`, 1 is `NEAREST`.
 * @property {boolean} [autoClear=true] - Controls if this Render Target is automatically cleared (via `gl.COLOR_BUFFER_BIT`) during the bind.
 * @property {boolean} [autoResize=false] - Controls if this Render Target is automatically resized when the Renderer resizes.
 * @property {number} [width] - The width of the Render Target. This is optional. If given it overrides the `scale` property.
 * @property {number} [height=width] - The height of the Render Target. This is optional. If not given, it will be set to the same as the `width` value.
 */
/**
 * @typedef {object} Phaser.Types.Renderer.Snapshot.SnapshotState
 * @since 3.16.1
 *
 * @property {Phaser.Types.Renderer.Snapshot.SnapshotCallback} callback - The function to call after the snapshot is taken.
 * @property {string} [type='image/png'] - The format of the image to create, usually `image/png` or `image/jpeg`.
 * @property {number} [encoderOptions=0.92] - The image quality, between 0 and 1. Used for image formats with lossy compression, such as `image/jpeg`.
 * @property {number} [x=0] - The x coordinate to start the snapshot from.
 * @property {number} [y=0] - The y coordinate to start the snapshot from.
 * @property {number} [width] - The width of the snapshot.
 * @property {number} [height] - The height of the snapshot.
 * @property {boolean} [getPixel=false] - Is this a snapshot to get a single pixel, or an area?
 * @property {boolean} [isFramebuffer=false] - Is this snapshot grabbing from a frame buffer or a canvas?
 * @property {number} [bufferWidth] - The width of the frame buffer, if a frame buffer grab.
 * @property {number} [bufferHeight] - The height of the frame buffer, if a frame buffer grab.
 */
/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterWorldConfig
 * @since 3.0.0
 *
 * @property {Phaser.Types.Math.Vector2Like} [gravity] - Sets {@link Phaser.Physics.Matter.World#gravity}.
 * @property {(object|boolean)} [setBounds] - Should the world have bounds enabled by default?
 * @property {number} [setBounds.x=0] - The x coordinate of the world bounds.
 * @property {number} [setBounds.y=0] - The y coordinate of the world bounds.
 * @property {number} [setBounds.width] - The width of the world bounds.
 * @property {number} [setBounds.height] - The height of the world bounds.
 * @property {number} [setBounds.thickness=64] - The thickness of the walls of the world bounds.
 * @property {boolean} [setBounds.left=true] - Should the left-side world bounds wall be created?
 * @property {boolean} [setBounds.right=true] - Should the right-side world bounds wall be created?
 * @property {boolean} [setBounds.top=true] - Should the top world bounds wall be created?
 * @property {boolean} [setBounds.bottom=true] - Should the bottom world bounds wall be created?
 * @property {number} [positionIterations=6] - The number of position iterations to perform each update. The higher the value, the higher quality the simulation will be at the expense of performance.
 * @property {number} [velocityIterations=4] - The number of velocity iterations to perform each update. The higher the value, the higher quality the simulation will be at the expense of performance.
 * @property {number} [constraintIterations=2] - The number of constraint iterations to perform each update. The higher the value, the higher quality the simulation will be at the expense of performance.
 * @property {boolean} [enableSleeping=false] - A flag that specifies whether the engine should allow sleeping via the `Matter.Sleeping` module. Sleeping can improve stability and performance, but often at the expense of accuracy.
 * @property {number} [timing.timestamp=0] - A `Number` that specifies the current simulation-time in milliseconds starting from `0`. It is incremented on every `Engine.update` by the given `delta` argument.
 * @property {number} [timing.timeScale=1] - A `Number` that specifies the global scaling factor of time for all bodies. A value of `0` freezes the simulation. A value of `0.1` gives a slow-motion effect. A value of `1.2` gives a speed-up effect.
 * @property {boolean} [enabled=true] - Toggles if the world is enabled or not.
 * @property {number} [correction=1] - An optional Number that specifies the time correction factor to apply to the update.
 * @property {function} [getDelta] - This function is called every time the core game loop steps, which is bound to the Request Animation Frame frequency unless otherwise modified.
 * @property {boolean} [autoUpdate=true] - Automatically call Engine.update every time the game steps.
 * @property {number} [restingThresh=4] - Sets the Resolver resting threshold property.
 * @property {number} [restingThreshTangent=6] - Sets the Resolver resting threshold tangent property.
 * @property {number} [positionDampen=0.9] - Sets the Resolver position dampen property.
 * @property {number} [positionWarming=0.8] - Sets the Resolver position warming property.
 * @property {number} [frictionNormalMultiplier=5] - Sets the Resolver friction normal multiplier property.
 * @property {(boolean|Phaser.Types.Physics.Matter.MatterDebugConfig)} [debug=false] - Controls the Matter Debug Rendering options. If a boolean it will use the default values, otherwise, specify a Debug Config object.
 * @property {Phaser.Types.Physics.Matter.MatterRunnerConfig} [runner] - Sets the Matter Runner options.
 */
/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterWalls
 * @since 3.0.0
 *
 * @property {MatterJS.BodyType} [left=null] - The left wall for the Matter World.
 * @property {MatterJS.BodyType} [right=null] - The right wall for the Matter World.
 * @property {MatterJS.BodyType} [top=null] - The top wall for the Matter World.
 * @property {MatterJS.BodyType} [bottom=null] - The bottom wall for the Matter World.
 */
/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterTileOptions
 * @since 3.0.0
 * 
 * @property {MatterJS.BodyType} [body=null] - An existing Matter body to be used instead of creating a new one.
 * @property {boolean} [isStatic=true] - Whether or not the newly created body should be made static. This defaults to true since typically tiles should not be moved.
 * @property {boolean} [addToWorld=true] - Whether or not to add the newly created body (or existing body if options.body is used) to the Matter world.
 */
/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterSetBodyConfig
 * @since 3.22.0
 *              
 * @property {string} [type='rectangle'] - The shape type. Either `rectangle`, `circle`, `trapezoid`, `polygon`, `fromVertices`, `fromVerts` or `fromPhysicsEditor`.
 * @property {number} [x] - The horizontal world position to place the body at.
 * @property {number} [y] - The vertical world position to place the body at.
 * @property {number} [width] - The width of the body.
 * @property {number} [height] - The height of the body.
 * @property {number} [radius] - The radius of the body. Used by `circle` and `polygon` shapes.
 * @property {number} [maxSides=25] - The max sizes of the body. Used by the `circle` shape.
 * @property {number} [slope=0.5] - Used by the `trapezoid` shape. The slope of the trapezoid. 0 creates a rectangle, while 1 creates a triangle. Positive values make the top side shorter, while negative values make the bottom side shorter.
 * @property {number} [sides=5] - Used by the `polygon` shape. The number of sides the polygon will have.
 * @property {(string|array)} [verts] - Used by the `fromVerts` shape. The vertices data. Either a path string or an array of vertices.
 * @property {boolean} [flagInternal=false] - Used by the `fromVerts` shape. Flag internal edges (coincident part edges)
 * @property {number} [removeCollinear=0.01] - Used by the `fromVerts` shape. Whether Matter.js will discard collinear edges (to improve performance).
 * @property {number} [minimumArea=10] - Used by the `fromVerts` shape. During decomposition discard parts that have an area less than this.
 * @property {boolean} [addToWorld=true] - Should the new body be automatically added to the world?
 */
/**
 * Configuration for the Matter Physics Runner.
 *
 * Set only one of `fps` and `delta`.
 *
 * `delta` is the size of the Runner's fixed time step (one physics update).
 * The "frame delta" is the time elapsed since the last game step.
 * Depending on the size of the frame delta, the Runner makes zero or more updates per game step.
 *
 * @typedef {object} Phaser.Types.Physics.Matter.MatterRunnerConfig
 * @since 3.22.0
 *
 * @property {number} [fps] - The number of physics updates per second. If set, this overrides `delta`.
 * @property {number} [delta=16.666] - The size of the update time step in milliseconds. If `fps` is set, it overrides `delta`.
 * @property {boolean} [frameDeltaSmoothing=true] - Whether to smooth the frame delta values.
 * @property {boolean} [frameDeltaSnapping=true] - Whether to round the frame delta values to the nearest 1 Hz.
 * @property {number} [frameDeltaHistorySize=100] - The number of frame delta values to record, when smoothing is enabled. The 10th to 90th percentiles are sampled.
 * @property {number} [maxUpdates=null] - The maximum number of updates per frame.
 * @property {number} [maxFrameTime=33.333] - The maximum amount of time to simulate in one frame, in milliseconds.
 * @property {boolean} [enabled=true] - Whether the Matter Runner is enabled.
 *
 * @see Phaser.Physics.Matter.World#runner
 */
/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterDebugConfig
 * @since 3.22.0
 *              
 * @property {boolean} [showAxes=false] - Render all of the body axes?
 * @property {boolean} [showAngleIndicator=false] - Render just a single body axis?
 * @property {number} [angleColor=0xe81153] - The color of the body angle / axes lines.
 * @property {boolean} [showBroadphase=false] - Render the broadphase grid?
 * @property {number} [broadphaseColor=0xffb400] - The color of the broadphase grid.
 * @property {boolean} [showBounds=false] - Render the bounds of the bodies in the world?
 * @property {number} [boundsColor=0xffffff] - The color of the body bounds.
 * @property {boolean} [showVelocity=false] - Render the velocity of the bodies in the world?
 * @property {number} [velocityColor=0x00aeef] - The color of the body velocity line.
 * @property {boolean} [showCollisions=false] - Render the collision points and normals for colliding pairs.
 * @property {number} [collisionColor=0xf5950c] - The color of the collision points.
 * @property {boolean} [showSeparation=false] - Render lines showing the separation between bodies.
 * @property {number} [separationColor=0xffa500] - The color of the body separation line.
 * @property {boolean} [showBody=true] - Render the dynamic bodies in the world to the Graphics object?
 * @property {boolean} [showStaticBody=true] - Render the static bodies in the world to the Graphics object?
 * @property {boolean} [showInternalEdges=false] - When rendering bodies, render the internal edges as well?
 * @property {boolean} [renderFill=false] - Render the bodies using a fill color.
 * @property {boolean} [renderLine=true] - Render the bodies using a line stroke.
 * @property {number} [fillColor=0x106909] - The color value of the fill when rendering dynamic bodies.
 * @property {number} [fillOpacity=1] - The opacity of the fill when rendering dynamic bodies, a value between 0 and 1.
 * @property {number} [lineColor=0x28de19] - The color value of the line stroke when rendering dynamic bodies.
 * @property {number} [lineOpacity=1] - The opacity of the line when rendering dynamic bodies, a value between 0 and 1.
 * @property {number} [lineThickness=1] - If rendering lines, the thickness of the line.
 * @property {number} [staticFillColor=0x0d177b] - The color value of the fill when rendering static bodies.
 * @property {number} [staticLineColor=0x1327e4] - The color value of the line stroke when rendering static bodies.
 * @property {boolean} [showSleeping=false] - Render any sleeping bodies (dynamic or static) in the world to the Graphics object?
 * @property {number} [staticBodySleepOpacity=0.7] - The amount to multiply the opacity of sleeping static bodies by.
 * @property {number} [sleepFillColor=0x464646] - The color value of the fill when rendering sleeping dynamic bodies.
 * @property {number} [sleepLineColor=0x999a99] - The color value of the line stroke when rendering sleeping dynamic bodies.
 * @property {boolean} [showSensors=true] - Render bodies or body parts that are flagged as being a sensor?
 * @property {number} [sensorFillColor=0x0d177b] - The fill color when rendering body sensors.
 * @property {number} [sensorLineColor=0x1327e4] - The line color when rendering body sensors.
 * @property {boolean} [showPositions=true] - Render the position of non-static bodies?
 * @property {number} [positionSize=4] - The size of the rectangle drawn when rendering the body position.
 * @property {number} [positionColor=0xe042da] - The color value of the rectangle drawn when rendering the body position.
 * @property {boolean} [showJoint=true] - Render all world constraints to the Graphics object?
 * @property {number} [jointColor=0xe0e042] - The color value of joints when `showJoint` is set.
 * @property {number} [jointLineOpacity=1] - The line opacity when rendering joints, a value between 0 and 1.
 * @property {number} [jointLineThickness=2] - The line thickness when rendering joints.
 * @property {number} [pinSize=4] - The size of the circles drawn when rendering pin constraints.
 * @property {number} [pinColor=0x42e0e0] - The color value of the circles drawn when rendering pin constraints.
 * @property {number} [springColor=0xe042e0] - The color value of spring constraints.
 * @property {number} [anchorColor=0xefefef] - The color value of constraint anchors.
 * @property {number} [anchorSize=4] - The size of the circles drawn as the constraint anchors.
 * @property {boolean} [showConvexHulls=false] - When rendering polygon bodies, render the convex hull as well?
 * @property {number} [hullColor=0xd703d0] - The color value of hulls when `showConvexHulls` is set.
 */
/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterConstraintRenderConfig
 * @since 3.22.0
 *              
 * @property {boolean} [visible=true] - Should this constraint be rendered by the Debug Renderer?
 * @property {boolean} [anchors=true] - If this constraint has anchors, should they be rendered? Pin constraints never have anchors.
 * @property {number} [lineColor] - The color value of the line stroke when rendering this constraint.
 * @property {number} [lineOpacity] - The opacity of the line when rendering this constraint, a value between 0 and 1.
 * @property {number} [lineThickness] - If rendering lines, the thickness of the line.
 * @property {number} [pinSize=4] - The size of the circles drawn when rendering pin constraints.
 * @property {number} [anchorSize=4] - The size of the circles drawn as the constraint anchors.
 * @property {number} [anchorColor=0xefefef] - The color value of constraint anchors.
 */
/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterConstraintConfig
 * @since 3.22.0
 * 
 * @property {string} [label='Constraint'] - An arbitrary string-based name to help identify this constraint.
 * @property {MatterJS.BodyType} [bodyA] - The first possible `Body` that this constraint is attached to.
 * @property {MatterJS.BodyType} [bodyB] - The second possible `Body` that this constraint is attached to.
 * @property {Phaser.Types.Math.Vector2Like} [pointA] - A `Vector` that specifies the offset of the constraint from center of the `constraint.bodyA` if defined, otherwise a world-space position.
 * @property {Phaser.Types.Math.Vector2Like} [pointB] - A `Vector` that specifies the offset of the constraint from center of the `constraint.bodyB` if defined, otherwise a world-space position.
 * @property {number} [stiffness=1] - A `Number` that specifies the stiffness of the constraint, i.e. the rate at which it returns to its resting `constraint.length`. A value of `1` means the constraint should be very stiff. A value of `0.2` means the constraint acts like a soft spring.
 * @property {number} [angularStiffness=0] - A `Number` that specifies the angular stiffness of the constraint.
 * @property {number} [angleA=0] - The angleA of the constraint. If bodyA is set, the angle of bodyA is used instead.
 * @property {number} [angleB=0] - The angleB of the constraint. If bodyB is set, the angle of bodyB is used instead.
 * @property {number} [damping=0] - A `Number` that specifies the damping of the constraint, i.e. the amount of resistance applied to each body based on their velocities to limit the amount of oscillation. Damping will only be apparent when the constraint also has a very low `stiffness`. A value of `0.1` means the constraint will apply heavy damping, resulting in little to no oscillation. A value of `0` means the constraint will apply no damping.
 * @property {number} [length] - A `Number` that specifies the target resting length of the constraint. It is calculated automatically in `Constraint.create` from initial positions of the `constraint.bodyA` and `constraint.bodyB`.
 * @property {any} [plugin] - An object reserved for storing plugin-specific properties.
 * @property {Phaser.Types.Physics.Matter.MatterConstraintRenderConfig} [render] - The Debug Render configuration object for this constraint.
 */
/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterCollisionPair
 * @since 3.22.0
 * 
 * @property {string} id - The unique auto-generated collision pair id. A combination of the body A and B IDs.
 * @property {MatterJS.BodyType} bodyA - A reference to the first body involved in the collision.
 * @property {MatterJS.BodyType} bodyB - A reference to the second body involved in the collision.
 * @property {MatterJS.Vector[]} contacts - An array containing all of the active contacts between bodies A and B.
 * @property {number} separation - The amount of separation that occurred between bodies A and B.
 * @property {boolean} isActive - Is the collision still active or not?
 * @property {boolean} confirmedActive - Has Matter determined the collision are being active yet?
 * @property {boolean} isSensor - Is either body A or B a sensor?
 * @property {number} timeCreated - The timestamp when the collision pair was created.
 * @property {number} timeUpdated - The timestamp when the collision pair was most recently updated.
 * @property {Phaser.Types.Physics.Matter.MatterCollisionData} collision - The collision data object.
 * @property {number} inverseMass - The resulting inverse mass from the collision.
 * @property {number} friction - The resulting friction from the collision.
 * @property {number} frictionStatic - The resulting static friction from the collision.
 * @property {number} restitution - The resulting restitution from the collision.
 * @property {number} slop - The resulting slop from the collision.
 */
/**
 * An `Object` that specifies the collision filtering properties of this body.
 *
 * Collisions between two bodies will obey the following rules:
 * - If the two bodies have the same non-zero value of `collisionFilter.group`,
 *   they will always collide if the value is positive, and they will never collide
 *   if the value is negative.
 * - If the two bodies have different values of `collisionFilter.group` or if one
 *   (or both) of the bodies has a value of 0, then the category/mask rules apply as follows:
 *
 * Each body belongs to a collision category, given by `collisionFilter.category`. This
 * value is used as a bit field and the category should have only one bit set, meaning that
 * the value of this property is a power of two in the range [1, 2^31]. Thus, there are 32
 * different collision categories available.
 *
 * Each body also defines a collision bitmask, given by `collisionFilter.mask` which specifies
 * the categories it collides with (the value is the bitwise AND value of all these categories).
 *
 * Using the category/mask rules, two bodies `A` and `B` collide if each includes the other's
 * category in its mask, i.e. `(categoryA & maskB) !== 0` and `(categoryB & maskA) !== 0`
 * are both true.
 * 
 * @typedef {object} Phaser.Types.Physics.Matter.MatterCollisionFilter
 * @since 3.22.0
 * 
 * @property {number} [category=0x0001] - A bit field that specifies the collision category this body belongs to. The category value should have only one bit set, for example `0x0001`. This means there are up to 32 unique collision categories available.
 * @property {number} [mask=0xFFFFFFFF] - A bit mask that specifies the collision categories this body may collide with.
 * @property {number} [group=0] - An Integer `Number`, that specifies the collision group this body belongs to.
 */
/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterCollisionData
 * @since 3.22.0
 * 
 * @property {boolean} collided - Have the pair collided or not?
 * @property {MatterJS.BodyType} bodyA - A reference to the first body involved in the collision.
 * @property {MatterJS.BodyType} bodyB - A reference to the second body involved in the collision.
 * @property {MatterJS.BodyType} axisBody - A reference to the dominant axis body.
 * @property {number} axisNumber - The index of the dominant collision axis vector (edge normal)
 * @property {number} depth - The depth of the collision on the minimum overlap.
 * @property {MatterJS.BodyType} parentA - A reference to the parent of Body A, or to Body A itself if it has no parent.
 * @property {MatterJS.BodyType} parentB - A reference to the parent of Body B, or to Body B itself if it has no parent.
 * @property {MatterJS.Vector} normal - The collision normal, facing away from Body A.
 * @property {MatterJS.Vector} tangent - The tangent of the collision normal.
 * @property {MatterJS.Vector} penetration - The penetration distances between the two bodies.
 * @property {MatterJS.Vector[]} supports - An array of support points, either exactly one or two points.
 * @property {number} inverseMass - The resulting inverse mass from the collision.
 * @property {number} friction - The resulting friction from the collision.
 * @property {number} frictionStatic - The resulting static friction from the collision.
 * @property {number} restitution - The resulting restitution from the collision.
 * @property {number} slop - The resulting slop from the collision.
 */
/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterChamferConfig
 * @since 3.22.0
 * 
 * @property {(number|number[])} [radius=8] - A single number, or an array, to specify the radius for each vertex.
 * @property {number} [quality=-1] - The quality of the chamfering. -1 means 'auto'.
 * @property {number} [qualityMin=2] - The minimum quality of the chamfering. The higher this value, the more vertices are created.
 * @property {number} [qualityMax=14] - The maximum quality of the chamfering. The higher this value, the more vertices are created.
 */
/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterBodyTileOptions
 * @since 3.0.0
 * 
 * @property {boolean} [isStatic=true] - Whether or not the newly created body should be made static. This defaults to true since typically tiles should not be moved.
 * @property {boolean} [addToWorld=true] - Whether or not to add the newly created body (or existing body if options.body is used) to the Matter world.
 */
/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterBodyRenderConfig
 * @since 3.22.0
 *              
 * @property {boolean} [visible=true] - Should this body be rendered by the Debug Renderer?
 * @property {number} [opacity=1] - The opacity of the body and all parts within it.
 * @property {number} [fillColor] - The color value of the fill when rendering this body.
 * @property {number} [fillOpacity] - The opacity of the fill when rendering this body, a value between 0 and 1.
 * @property {number} [lineColor] - The color value of the line stroke when rendering this body.
 * @property {number} [lineOpacity] - The opacity of the line when rendering this body, a value between 0 and 1.
 * @property {number} [lineThickness] - If rendering lines, the thickness of the line.
 * @property {object} [sprite] - Controls the offset between the body and the parent Game Object, if it has one.
 * @property {number} [sprite.xOffset=0] - The horizontal offset between the body and the parent Game Object texture, if it has one.
 * @property {number} [sprite.yOffset=0] - The vertical offset between the body and the parent Game Object texture, if it has one.
 */
/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterBodyConfig
 * @since 3.22.0
 *
 * @property {string} [label='Body'] - An arbitrary string-based name to help identify this body.
 * @property {(string|Phaser.Types.Physics.Matter.MatterSetBodyConfig)} [shape=null] - Set this Game Object to create and use a new Body based on the configuration object given.
 * @property {MatterJS.BodyType[]} [parts] - An array of bodies that make up this body. The first body in the array must always be a self reference to the current body instance. All bodies in the `parts` array together form a single rigid compound body.
 * @property {any} [plugin] - An object reserved for storing plugin-specific properties.
 * @property {any} [wrapBounds] - An object for storing wrap boundaries.
 * @property {number} [angle=0] - A number specifying the angle of the body, in radians.
 * @property {Phaser.Types.Math.Vector2Like[]} [vertices=null] - An array of `Vector` objects that specify the convex hull of the rigid body. These should be provided about the origin `(0, 0)`.
 * @property {Phaser.Types.Math.Vector2Like} [position] - A `Vector` that specifies the current world-space position of the body.
 * @property {Phaser.Types.Math.Vector2Like} [force] - A `Vector` that specifies the force to apply in the current step. It is zeroed after every `Body.update`. See also `Body.applyForce`.
 * @property {number} [torque=0] - A `Number` that specifies the torque (turning force) to apply in the current step. It is zeroed after every `Body.update`.
 * @property {boolean} [isSensor=false] - A flag that indicates whether a body is a sensor. Sensor triggers collision events, but doesn't react with colliding body physically.
 * @property {boolean} [isStatic=false] - A flag that indicates whether a body is considered static. A static body can never change position or angle and is completely fixed.
 * @property {number} [sleepThreshold=60] - A `Number` that defines the number of updates in which this body must have near-zero velocity before it is set as sleeping by the `Matter.Sleeping` module (if sleeping is enabled by the engine).
 * @property {number} [density=0.001] - A `Number` that defines the density of the body, that is its mass per unit area. If you pass the density via `Body.create` the `mass` property is automatically calculated for you based on the size (area) of the object. This is generally preferable to simply setting mass and allows for more intuitive definition of materials (e.g. rock has a higher density than wood).
 * @property {number} [restitution=0] - A `Number` that defines the restitution (elasticity) of the body. The value is always positive and is in the range `(0, 1)`.
 * @property {number} [friction=0.1] - A `Number` that defines the friction of the body. The value is always positive and is in the range `(0, 1)`. A value of `0` means that the body may slide indefinitely. A value of `1` means the body may come to a stop almost instantly after a force is applied.
 * @property {number} [frictionStatic=0.5] - A `Number` that defines the static friction of the body (in the Coulomb friction model). A value of `0` means the body will never 'stick' when it is nearly stationary and only dynamic `friction` is used. The higher the value (e.g. `10`), the more force it will take to initially get the body moving when nearly stationary. This value is multiplied with the `friction` property to make it easier to change `friction` and maintain an appropriate amount of static friction.
 * @property {number} [frictionAir=0.01] - A `Number` that defines the air friction of the body (air resistance). A value of `0` means the body will never slow as it moves through space. The higher the value, the faster a body slows when moving through space.
 * @property {Phaser.Types.Physics.Matter.MatterCollisionFilter} [collisionFilter] - An `Object` that specifies the collision filtering properties of this body.
 * @property {number} [slop=0.05] - A `Number` that specifies a tolerance on how far a body is allowed to 'sink' or rotate into other bodies. Avoid changing this value unless you understand the purpose of `slop` in physics engines. The default should generally suffice, although very large bodies may require larger values for stable stacking.
 * @property {number} [timeScale=1] - A `Number` that allows per-body time scaling, e.g. a force-field where bodies inside are in slow-motion, while others are at full speed.
 * @property {(number|number[]|Phaser.Types.Physics.Matter.MatterChamferConfig)} [chamfer=null] - A number, or array of numbers, to chamfer the vertices of the body, or a full Chamfer configuration object.
 * @property {number} [circleRadius=0] - The radius of this body if a circle.
 * @property {number} [mass=0] - A `Number` that defines the mass of the body, although it may be more appropriate to specify the `density` property instead. If you modify this value, you must also modify the `body.inverseMass` property (`1 / mass`).
 * @property {number} [inverseMass=0] - A `Number` that defines the inverse mass of the body (`1 / mass`). If you modify this value, you must also modify the `body.mass` property.
 * @property {Phaser.Types.Math.Vector2Like} [scale] - A `Vector` that specifies the initial scale of the body.
 * @property {Phaser.Types.Math.Vector2Like} [gravityScale] - A `Vector` that scales the influence of World gravity when applied to this body.
 * @property {boolean} [ignoreGravity=false] - A boolean that toggles if this body should ignore world gravity or not.
 * @property {boolean} [ignorePointer=false] - A boolean that toggles if this body should ignore pointer / mouse constraints or not.
 * @property {Phaser.Types.Physics.Matter.MatterBodyRenderConfig} [render] - The Debug Render configuration object for this body.
 * @property {function} [onCollideCallback] - A callback that is invoked when this Body starts colliding with any other Body. You can register callbacks by providing a function of type `( pair: Matter.Pair) => void`.
 * @property {function} [onCollideEndCallback] - A callback that is invoked when this Body stops colliding with any other Body. You can register callbacks by providing a function of type `( pair: Matter.Pair) => void`.
 * @property {function} [onCollideActiveCallback] - A callback that is invoked for the duration that this Body is colliding with any other Body. You can register callbacks by providing a function of type `( pair: Matter.Pair) => void`.
 * @property {any} [onCollideWith] - A collision callback dictionary used by the `Body.setOnCollideWith` function.
 */
/**
 * @typedef {(MatterJS.BodyType|Phaser.GameObjects.GameObject|Phaser.Physics.Matter.Image|Phaser.Physics.Matter.Sprite|Phaser.Physics.Matter.TileBody)} Phaser.Types.Physics.Matter.MatterBody
 * @since 3.22.0
 */
/**
 * @typedef {object} Phaser.Physics.Matter.Events.CollisionStartEvent
 *
 * @property {Phaser.Types.Physics.Matter.MatterCollisionPair[]} pairs - A list of all affected pairs in the collision.
 * @property {number} timestamp - The Matter Engine `timing.timestamp` value for the event.
 * @property {any} source - The source object of the event.
 * @property {string} name - The name of the event.
 */
/**
 * @typedef {object} Phaser.Physics.Matter.Events.CollisionEndEvent
 *
 * @property {Phaser.Types.Physics.Matter.MatterCollisionPair[]} pairs - A list of all affected pairs in the collision.
 * @property {number} timestamp - The Matter Engine `timing.timestamp` value for the event.
 * @property {any} source - The source object of the event.
 * @property {string} name - The name of the event.
 */
/**
 * @typedef {object} Phaser.Physics.Matter.Events.CollisionActiveEvent
 *
 * @property {Phaser.Types.Physics.Matter.MatterCollisionPair[]} pairs - A list of all affected pairs in the collision.
 * @property {number} timestamp - The Matter Engine `timing.timestamp` value for the event.
 * @property {any} source - The source object of the event.
 * @property {string} name - The name of the event.
 */
/**
 * @typedef {object} Phaser.Physics.Matter.Events.BeforeUpdateEvent
 *
 * @property {number} timestamp - The Matter Engine `timing.timestamp` value for the event.
 * @property {any} source - The source object of the event.
 * @property {string} name - The name of the event.
 */
/**
 * @typedef {object} Phaser.Physics.Matter.Events.BeforeRemoveEvent
 *
 * @property {any[]} object - An array of the object(s) to be removed. May be a single body, constraint, composite or a mixture of these.
 * @property {any} source - The source object of the event.
 * @property {string} name - The name of the event.
 */
/**
 * @typedef {object} Phaser.Physics.Matter.Events.BeforeAddEvent
 *
 * @property {any[]} object - An array of the object(s) to be added. May be a single body, constraint, composite or a mixture of these.
 * @property {any} source - The source object of the event.
 * @property {string} name - The name of the event.
 */
/**
 * @typedef {object} Phaser.Physics.Matter.Events.AfterUpdateEvent
 *
 * @property {number} timestamp - The Matter Engine `timing.timestamp` value for the event.
 * @property {any} source - The source object of the event.
 * @property {string} name - The name of the event.
 */
/**
 * @typedef {object} Phaser.Physics.Matter.Events.AfterRemoveEvent
 *
 * @property {any[]} object - An array of the object(s) that were removed. May be a single body, constraint, composite or a mixture of these.
 * @property {any} source - The source object of the event.
 * @property {string} name - The name of the event.
 */
/**
 * @typedef {object} Phaser.Physics.Matter.Events.AfterAddEvent
 *
 * @property {any[]} object - An array of the object(s) that have been added. May be a single body, constraint, composite or a mixture of these.
 * @property {any} source - The source object of the event.
 * @property {string} name - The name of the event.
 */
/**
 * @typedef {object} Phaser.Types.Input.Keyboard.CursorKeys
 * @since 3.0.0
 *
 * @property {Phaser.Input.Keyboard.Key} up - A Key object mapping to the UP arrow key.
 * @property {Phaser.Input.Keyboard.Key} down - A Key object mapping to the DOWN arrow key.
 * @property {Phaser.Input.Keyboard.Key} left - A Key object mapping to the LEFT arrow key.
 * @property {Phaser.Input.Keyboard.Key} right - A Key object mapping to the RIGHT arrow key.
 * @property {Phaser.Input.Keyboard.Key} space - A Key object mapping to the SPACE BAR key.
 * @property {Phaser.Input.Keyboard.Key} shift - A Key object mapping to the SHIFT key.
 */
/**
 * The Gamepad object, as extracted from GamepadEvent.
 * 
 * @typedef {object} Phaser.Types.Input.Gamepad.Pad
 * @since 3.10.0
 *
 * @property {string} id - The ID of the Gamepad.
 * @property {number} index - The index of the Gamepad.
 */
/**
 * @typedef {object} Phaser.Types.Geom.Mesh.UV
 * @since 3.50.0
 *
 * @property {number} u - The u component.
 * @property {number} v - The v component.
 * @property {number} w - The w component.
 */
/**
 * @typedef {object} Phaser.Types.Geom.Mesh.OBJModel
 * @since 3.50.0
 *
 * @property {Phaser.Types.Geom.Mesh.OBJFace[]} faces - An array of Faces.
 * @property {string} name - The name of the model.
 * @property {Phaser.Types.Geom.Mesh.UV[]} textureCoords - An array of texture coordinates.
 * @property {Phaser.Types.Math.Vector3Like[]} vertexNormals - An array of vertex normals.
 * @property {Phaser.Types.Math.Vector3Like[]} vertices - An array of vertices in the model.
 */
/**
 * @typedef {object} Phaser.Types.Geom.Mesh.OBJFaceVertice
 * @since 3.50.0
 *
 * @property {number} textureCoordsIndex - The index in the `textureCoords` array that this vertex uses.
 * @property {number} vertexIndex - The index in the `vertices` array that this vertex uses.
 * @property {number} vertexNormalIndex - The index in the `vertexNormals` array that this vertex uses.
 */
/**
 * @typedef {object} Phaser.Types.Geom.Mesh.OBJFace
 * @since 3.50.0
 *
 * @property {string} group - The name of the Group this Face is in.
 * @property {string} material - The name of the material this Face uses.
 * @property {Phaser.Types.Geom.Mesh.OBJFaceVertice[]} vertices - An array of vertices in this Face.
 */
/**
 * @typedef {object} Phaser.Types.Geom.Mesh.OBJData
 * @since 3.50.0
 *
 * @property {string[]} materialLibraries - An array of material library filenames found in the OBJ file.
 * @property {object} materials - If the obj was loaded with an mtl file, the parsed material names are stored in this object.
 * @property {Phaser.Types.Geom.Mesh.OBJModel[]} models - An array of parsed models extracted from the OBJ file.
 */
/**
 * @typedef {object} Phaser.Types.Geom.Mesh.GenerateVertsResult
 * @since 3.50.0
 *
 * @property {Phaser.Geom.Mesh.Face[]} faces - An array of Face objects generated from the OBJ Data.
 * @property {Phaser.Geom.Mesh.Vertex[]} vertices - An array of Vertex objects generated from the OBJ Data.
 */
/**
 * @typedef {object} Phaser.Types.Geom.Mesh.GenerateGridVertsResult
 * @since 3.50.0
 *
 * @property {number[]} verts - An array of vertex values in x, y pairs.
 * @property {number[]} indices - An array of vertex indexes. This array will be empty if the `tile` parameter was `true`.
 * @property {number[]} uvs - An array of UV values, two per vertex.
 * @property {number|number[]} [colors=0xffffff] - An array of colors, one per vertex, or a single color value applied to all vertices.
 * @property {number|number[]} [alphas=1] - An array of alpha values, one per vertex, or a single alpha value applied to all vertices.
 */
/**
 * @typedef {object} Phaser.Types.Geom.Mesh.GenerateGridConfig
 * @since 3.50.0
 *
 * @property {(string|Phaser.Textures.Texture)} texture - The texture to be used for this Grid. Must be a Texture instance. Can also be a string but only if the `mesh` property is set.
 * @property {(string|number)} [frame] - The name or index of the frame within the Texture.
 * @property {Phaser.GameObjects.Mesh} [mesh] - If specified, the vertices of the generated grid will be added to this Mesh Game Object.
 * @property {number} [width=1] - The width of the grid in 3D units. If you wish to get a pixel accurate grid based on a texture, you can use an Ortho Mesh or the `isOrtho` parameter.
 * @property {number} [height=width] - The height of the grid in 3D units.
 * @property {number} [widthSegments=1] - The number of segments to split the grid horizontally in to.
 * @property {number} [heightSegments=widthSegments] - The number of segments to split the grid vertically in to.
 * @property {number} [x=0] - Offset the grid x position by this amount.
 * @property {number} [y=0] - Offset the grid y position by this amount.
 * @property {number|number[]} [colors=0xffffff] - An array of colors, one per vertex, or a single color value applied to all vertices.
 * @property {number|number[]} [alphas=1] - An array of alpha values, one per vertex, or a single alpha value applied to all vertices.
 * @property {boolean} [tile=false] - Should the texture tile (repeat) across the grid segments, or display as a single texture?
 * @property {boolean} [isOrtho=false] - If set and using a texture with an ortho Mesh, the `width` and `height` parameters will be calculated based on the frame size for you.
 * @property {boolean} [flipY=false] - If set and using a texture, vertically flipping render result.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Zone.ZoneConfig
 * @extends Phaser.Types.GameObjects.GameObjectConfig
 * @since 3.50.0
 *
 * @property {number} [width=1] - The width of the Game Object.
 * @property {number} [height=1] - The height of the Game Object.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Video.VideoConfig
 * @extends Phaser.Types.GameObjects.GameObjectConfig
 * @since 3.50.0
 *
 * @property {string} [key] - Optional key of the Video this Game Object will play, as stored in the Video Cache.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.TileSprite.TileSpriteConfig
 * @extends Phaser.Types.GameObjects.GameObjectConfig
 * @since 3.0.0
 *
 * @property {number} [x=0] - The x coordinate of the Tile Sprite.
 * @property {number} [y=0] - The y coordinate of the Tile Sprite.
 * @property {number} [width=512] - The width of the Tile Sprite. If zero it will use the size of the texture frame.
 * @property {number} [height=512] - The height of the Tile Sprite. If zero it will use the size of the texture frame.
 * @property {string} [key=''] - The key of the Texture this Tile Sprite will use to render with, as stored in the Texture Manager.
 * @property {(number|string|Phaser.Textures.Frame)} [frame=''] - An optional frame from the Texture this Tile Sprite is rendering with.
 */
/**
 * A Text Word Wrap configuration object as used by the Text Style configuration.
 *
 * @typedef {object} Phaser.Types.GameObjects.Text.TextWordWrap
 * @since 3.0.0
 *
 * @property {number} [width] - The width at which text should be considered for word-wrapping.
 * @property {TextStyleWordWrapCallback} [callback] - Provide a custom callback when word wrapping is enabled.
 * @property {any} [callbackScope] - The context in which the word wrap callback is invoked.
 * @property {boolean} [useAdvancedWrap=false] - Use basic or advanced word wrapping?
 */
/**
 * A Text Style configuration object as used by the Text Game Object.
 *
 * @typedef {object} Phaser.Types.GameObjects.Text.TextStyle
 * @since 3.0.0
 *
 * @property {string} [fontFamily='Courier'] - The font the Text object will render with. This is a Canvas style font string.
 * @property {(number|string)} [fontSize='16px'] - The font size, as a CSS size string.
 * @property {string} [fontStyle] - Any addition font styles, such as 'bold'.
 * @property {string} [font] - The font family or font settings to set. Overrides the other font settings.
 * @property {string} [backgroundColor] - A solid fill color that is rendered behind the Text object. Given as a CSS string color such as `#ff0`.
 * @property {(string|CanvasGradient|CanvasPattern)} [color='#fff'] - The color the Text is drawn in. Given as a CSS string color such as `#fff` or `rgb()`.
 * @property {(string|CanvasGradient|CanvasPattern)} [stroke='#fff'] - The color used to stroke the Text if the `strokeThickness` property is greater than zero.
 * @property {number} [strokeThickness=0] - The thickness of the stroke around the Text. Set to zero for no stroke.
 * @property {Phaser.Types.GameObjects.Text.TextShadow} [shadow] - The Text shadow configuration object.
 * @property {Phaser.Types.GameObjects.Text.TextPadding} [padding] - A Text Padding object.
 * @property {string} [align='left'] - The alignment of the Text. This only impacts multi-line text. Either `left`, `right`, `center` or `justify`.
 * @property {number} [maxLines=0] - The maximum number of lines to display within the Text object.
 * @property {number} [fixedWidth=0] - Force the Text object to have the exact width specified in this property. Leave as zero for it to change accordingly to content.
 * @property {number} [fixedHeight=0] - Force the Text object to have the exact height specified in this property. Leave as zero for it to change accordingly to content.
 * @property {number} [resolution=0] - Sets the resolution (DPI setting) of the Text object. Leave at zero for it to use the game resolution.
 * @property {boolean} [rtl=false] - Set to `true` if this Text object should render from right-to-left.
 * @property {string} [testString='|MÃ‰qgy'] - This is the string used to aid Canvas in calculating the height of the font.
 * @property {number} [baselineX=1.2] - The amount of horizontal padding added to the width of the text when calculating the font metrics.
 * @property {number} [baselineY=1.4] - The amount of vertical padding added to the height of the text when calculating the font metrics.
 * @property {Phaser.Types.GameObjects.Text.TextWordWrap} [wordWrap] - The Text Word wrap configuration object.
 * @property {Phaser.Types.GameObjects.Text.TextMetrics} [metrics] - A Text Metrics object. Use this to avoid expensive font size calculations in text heavy games.
 * @property {number} [lineSpacing] - The amount to add to the font height to achieve the overall line height.
 * @property {number} [letterSpacing] - The amount to add to the spacing between characters. Can be a negative or positive number.
 */
/**
 * A Text Shadow configuration object as used by the Text Style.
 *
 * @typedef {object} Phaser.Types.GameObjects.Text.TextShadow
 * @since 3.0.0
 *
 * @property {number} [offsetX=0] - The horizontal offset of the shadow.
 * @property {number} [offsetY=0] - The vertical offset of the shadow.
 * @property {string} [color='#000'] - The color of the shadow, given as a CSS string value.
 * @property {number} [blur=0] - The amount of blur applied to the shadow. Leave as zero for a hard shadow.
 * @property {boolean} [stroke=false] - Apply the shadow to the stroke effect on the Text object?
 * @property {boolean} [fill=false] - Apply the shadow to the fill effect on the Text object?
 */
/**
 * A Text Padding configuration object as used by the Text Style.
 *
 * @typedef {object} Phaser.Types.GameObjects.Text.TextPadding
 * @since 3.18.0
 *
 * @property {number} [x] - If set this value is used for both the left and right padding.
 * @property {number} [y] - If set this value is used for both the top and bottom padding.
 * @property {number} [left] - The amount of padding added to the left of the Text object.
 * @property {number} [right] - The amount of padding added to the right of the Text object.
 * @property {number} [top] - The amount of padding added to the top of the Text object.
 * @property {number} [bottom] - The amount of padding added to the bottom of the Text object.
 */
/**
 * Font metrics for a Text Style object.
 *
 * @typedef {object} Phaser.Types.GameObjects.Text.TextMetrics
 * @since 3.0.0
 *
 * @property {number} ascent - The ascent of the font.
 * @property {number} descent - The descent of the font.
 * @property {number} fontSize - The size of the font.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Text.TextConfig
 * @extends Phaser.Types.GameObjects.GameObjectConfig
 * @since 3.0.0
 *
 * @property {(string|string[])} [text] - The text this Text object will display.
 * @property {Phaser.Types.GameObjects.Text.TextStyle} [style] - The Text style configuration object.
 * @property {Phaser.Types.GameObjects.Text.TextPadding} [padding] - A Text Padding object.
 */
/**
 * Results object from a call to GetTextSize.
 *
 * @typedef {object} Phaser.Types.GameObjects.Text.GetTextSizeObject
 * @since 3.0.0
 *
 * @property {number} width - The width of the longest line in the Text object.
 * @property {number} height - The height of the Text object.
 * @property {number} lines - The number of lines in the Text object.
 * @property {number[]} lineWidths - An array of the lines for each line in the Text object.
 * @property {number} lineSpacing - The line spacing of the Text object.
 * @property {number} lineHeight - The height of a line factoring in font and stroke.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Sprite.SpriteConfig
 * @extends Phaser.Types.GameObjects.GameObjectConfig
 * @since 3.0.0
 *
 * @property {(string|Phaser.Textures.Texture)} [key] - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @property {(string|number)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @property {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} [anims] - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
 * @property {boolean} [useSpriteSheet] - This property is used exclusively by `Tilemap.createFromTiles`. Set to `true` if this Sprite is being created by a Tilemap and is part of a spritesheet.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Shader.ShaderConfig
 * @extends Phaser.Types.GameObjects.GameObjectConfig
 * @since 3.50.0
 *
 * @property {(string|Phaser.Display.BaseShader)} key - The key of the shader to use from the shader cache, or a BaseShader instance.
 * @property {number} [width=128] - The width of the Game Object.
 * @property {number} [height=128] - The height of the Game Object.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Rope.RopeConfig
 * @extends Phaser.Types.GameObjects.GameObjectConfig
 * @since 3.50.0
 *
 * @property {string} [key] - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager. If not given, `__DEFAULT` is used.
 * @property {(string|integer|null)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @property {(integer|Phaser.Types.Math.Vector2Like[])} [points=2] - An array containing the vertices data for this Rope, or a number that indicates how many segments to split the texture frame into. If none is provided a simple quad is created. See `setPoints` to set this post-creation.
 * @property {boolean} [horizontal=true] - Should the vertices of this Rope be aligned horizontally (`true`), or vertically (`false`)?
 * @property {number[]} [colors] - An optional array containing the color data for this Rope. You should provide one color value per pair of vertices.
 * @property {number[]} [alphas] - An optional array containing the alpha data for this Rope. You should provide one alpha value per pair of vertices.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.RenderTexture.RenderTextureConfig
 * @since 3.2.0
 *
 * @property {number} [x=0] - The x coordinate of the RenderTextures position.
 * @property {number} [y=0] - The y coordinate of the RenderTextures position.
 * @property {number} [width=32] - The width of the RenderTexture.
 * @property {number} [height=32] - The height of the RenderTexture.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Plane.PlaneConfig
 * @extends Phaser.Types.GameObjects.GameObjectConfig
 * @since 3.60.0
 *
 * @property {(string|Phaser.Textures.Texture)} [key] - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @property {(string|number)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @property {number} [width=8] - The width of this Plane, in cells, not pixels.
 * @property {number} [height=8] - The height of this Plane, in cells, not pixels.
 * @property {boolean} [tile=false] - Is the texture tiled? I.e. repeated across each cell.
 * @property {Phaser.Types.GameObjects.Plane.PlaneCheckerboardConfig} [checkerboard] - Plane checkerboard configuration object.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Plane.PlaneCheckerboardConfig
 * @since 3.60.0
 *
 * @property {number} [color1=0xffffff] - The odd cell color, specified as a hex value.
 * @property {number} [color2=0x0000ff] - The even cell color, specified as a hex value.
 * @property {number} [alpha1=255] - The odd cell alpha value, specified as a number between 0 and 255.
 * @property {number} [alpha2=255] - The even cell alpha value, specified as a number between 0 and 255.
 * @property {number} [height=128] - The view height of the Plane after creation, in pixels.
 */
/**
 * Settings for a PathFollower.
 *
 * @typedef {object} Phaser.Types.GameObjects.PathFollower.PathConfig
 * @since 3.0.0
 *
 * @property {number} [duration=1000] - The duration of the path follow in ms. Must be `> 0`.
 * @property {number} [from=0] - The start position of the path follow, between 0 and 1. Must be less than `to`.
 * @property {number} [to=1] - The end position of the path follow, between 0 and 1. Must be more than `from`.
 * @property {boolean} [positionOnPath=false] - Whether to position the PathFollower on the Path using its path offset.
 * @property {boolean} [rotateToPath=false] - Should the PathFollower automatically rotate to point in the direction of the Path?
 * @property {number} [rotationOffset=0] - If the PathFollower is rotating to match the Path, this value is added to the rotation value. This allows you to rotate objects to a path but control the angle of the rotation as well.
 * @property {number} [startAt=0] - Current start position of the path follow, must be between `from` and `to`.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Particles.RandomZoneSource
 * @since 3.0.0
 *
 * @property {Phaser.Types.GameObjects.Particles.RandomZoneSourceCallback} getRandomPoint - A function modifying its point argument.
 *
 * @see Phaser.Geom.Circle
 * @see Phaser.Geom.Ellipse
 * @see Phaser.Geom.Line
 * @see Phaser.Geom.Polygon
 * @see Phaser.Geom.Rectangle
 * @see Phaser.Geom.Triangle
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Particles.ParticleEmitterRandomZoneConfig
 * @since 3.0.0
 *
 * @property {Phaser.Types.GameObjects.Particles.RandomZoneSource} source - A shape representing the zone. See {@link Phaser.GameObjects.Particles.Zones.RandomZone#source}.
 * @property {string} [type] - 'random'.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Particles.ParticleEmitterOps
 * @since 3.60.0
 *
 * @property {Phaser.GameObjects.Particles.EmitterOp} accelerationX - The accelerationX EmitterOp instance. This is an onEmit and onUpdate operator.
 * @property {Phaser.GameObjects.Particles.EmitterOp} accelerationY - The accelerationY EmitterOp instance. This is an onEmit and onUpdate operator.
 * @property {Phaser.GameObjects.Particles.EmitterOp} alpha - The alpha EmitterOp instance. This is an onEmit and onUpdate operator.
 * @property {Phaser.GameObjects.Particles.EmitterOp} angle - The angle EmitterOp instance. This is an onEmit operator only.
 * @property {Phaser.GameObjects.Particles.EmitterOp} bounce - The bounce EmitterOp instance. This is an onEmit and onUpdate operator.
 * @property {Phaser.GameObjects.Particles.EmitterColorOp} color - The color EmitterColorOp instance. This is an onEmit and onUpdate operator.
 * @property {Phaser.GameObjects.Particles.EmitterOp} delay - The delay EmitterOp instance. This is an onEmit operator only.
 * @property {Phaser.GameObjects.Particles.EmitterOp} hold - The hold EmitterOp instance. This is an onEmit operator only.
 * @property {Phaser.GameObjects.Particles.EmitterOp} lifespan - The lifespan EmitterOp instance. This is an onEmit operator only.
 * @property {Phaser.GameObjects.Particles.EmitterOp} maxVelocityX - The maxVelocityX EmitterOp instance. This is an onEmit and onUpdate operator.
 * @property {Phaser.GameObjects.Particles.EmitterOp} maxVelocityY - The maxVelocityY EmitterOp instance. This is an onEmit and onUpdate operator.
 * @property {Phaser.GameObjects.Particles.EmitterOp} moveToX - The moveToX EmitterOp instance. This is an onEmit and onUpdate operator.
 * @property {Phaser.GameObjects.Particles.EmitterOp} moveToY - The moveToY EmitterOp instance. This is an onEmit and onUpdate operator.
 * @property {Phaser.GameObjects.Particles.EmitterOp} quantity - The quantity EmitterOp instance. This is an onEmit operator only.
 * @property {Phaser.GameObjects.Particles.EmitterOp} rotate - The rotate EmitterOp instance. This is an onEmit and onUpdate operator.
 * @property {Phaser.GameObjects.Particles.EmitterOp} scaleX - The scaleX EmitterOp instance. This is an onEmit and onUpdate operator.
 * @property {Phaser.GameObjects.Particles.EmitterOp} scaleY - The scaleY EmitterOp instance. This is an onEmit and onUpdate operator.
 * @property {Phaser.GameObjects.Particles.EmitterOp} speedX - The speedX EmitterOp instance. This is an onEmit operator only.
 * @property {Phaser.GameObjects.Particles.EmitterOp} speedY - The speedY EmitterOp instance. This is an onEmit operator only.
 * @property {Phaser.GameObjects.Particles.EmitterOp} tint - The tint EmitterOp instance. This is an onEmit and onUpdate operator.
 * @property {Phaser.GameObjects.Particles.EmitterOp} x - The x EmitterOp instance. This is an onEmit and onUpdate operator.
 * @property {Phaser.GameObjects.Particles.EmitterOp} y - The y EmitterOp instance. This is an onEmit and onUpdate operator.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Particles.ParticleEmitterFrameConfig
 * @since 3.0.0
 *
 * @property {number[]|string[]|Phaser.Textures.Frame[]} [frames] - Array of texture frames.
 * @property {boolean} [cycle] - Whether texture frames will be assigned consecutively (true) or at random (false).
 * @property {number} [quantity] - The number of consecutive particles receiving each texture frame, when `cycle` is true.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Particles.ParticleEmitterEdgeZoneConfig
 * @since 3.0.0
 *
 * @property {Phaser.Types.GameObjects.Particles.EdgeZoneSource} source - A shape representing the zone. See {@link Phaser.GameObjects.Particles.Zones.EdgeZone#source}.
 * @property {string} type - 'edge'.
 * @property {number} quantity - The number of particles to place on the source edge. Set to 0 to use `stepRate` instead.
 * @property {number} [stepRate] - The distance between each particle. When set, `quantity` is implied and should be set to 0.
 * @property {boolean} [yoyo=false] - Whether particles are placed from start to end and then end to start.
 * @property {boolean} [seamless=true] - Whether one endpoint will be removed if it's identical to the other.
 * @property {number} [total=1] - The total number of particles this zone will emit before passing over to the next emission zone in the Emitter.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Particles.ParticleEmitterDeathZoneConfig
 * @since 3.0.0
 *
 * @property {Phaser.Types.GameObjects.Particles.DeathZoneSource} source - A shape representing the zone. See {@link Phaser.GameObjects.Particles.Zones.DeathZone#source}.
 * @property {string} [type='onEnter'] - 'onEnter' or 'onLeave'.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Particles.ParticleEmitterCreatorConfig
 * @extends Phaser.Types.GameObjects.GameObjectConfig
 * @since 3.60.0
 *
 * @property {string} [key] - The key of the Texture this Emitter will use to render particles, as stored in the Texture Manager.
 * @property {Phaser.Types.GameObjects.Particles.ParticleEmitterConfig} [config] - The Particle Emitter configuration object.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Particles.ParticleEmitterConfig
 * @since 3.0.0
 *
 * @property {boolean} [active] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#active}. Setting this to false will stop the emitter from running at all. If you just wish to stop particles from emitting, set `emitting` property instead.
 * @property {Phaser.BlendModes|string} [blendMode] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#blendMode}.
 * @property {*} [callbackScope] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#deathCallbackScope} and {@link Phaser.GameObjects.Particles.ParticleEmitter#emitCallbackScope}.
 * @property {boolean} [collideBottom] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#collideBottom}.
 * @property {boolean} [collideLeft] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#collideLeft}.
 * @property {boolean} [collideRight] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#collideRight}.
 * @property {boolean} [collideTop] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#collideTop}.
 * @property {function} [deathCallback] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#deathCallback}.
 * @property {*} [deathCallbackScope] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#deathCallbackScope}.
 * @property {function} [emitCallback] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#emitCallback}.
 * @property {*} [emitCallbackScope] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#emitCallbackScope}.
 * @property {Phaser.Types.Math.Vector2Like} [follow] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#follow}.
 * @property {number} [frequency] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#frequency}.
 * @property {number} [gravityX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#gravityX}.
 * @property {number} [gravityY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#gravityY}.
 * @property {number} [maxParticles] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#maxParticles}.
 * @property {number} [maxAliveParticles] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#maxAliveParticles}.
 * @property {string} [name] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#name}.
 * @property {boolean} [emitting] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#emitting}.
 * @property {boolean} [particleBringToTop] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleBringToTop}.
 * @property {function} [particleClass] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleClass}.
 * @property {boolean} [radial] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#radial}.
 * @property {number} [timeScale] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#timeScale}.
 * @property {boolean} [trackVisible] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#trackVisible}.
 * @property {boolean} [visible] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#visible}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [accelerationX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#accelerationX}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [accelerationY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#accelerationY}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [alpha] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleAlpha}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [angle] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleAngle} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [bounce] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#bounce}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [delay] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#delay} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [hold] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#hold} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [lifespan] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#lifespan} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [maxVelocityX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#maxVelocityX}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [maxVelocityY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#maxVelocityY}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [moveToX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#moveToX}. If set, overrides `angle` and `speed` properties.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [moveToY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#moveToY}. If set, overrides `angle` and `speed` properties.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [quantity] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#quantity} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [rotate] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleRotate}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [scale] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setScale}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [scaleX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleScaleX}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [scaleY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleScaleY}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [speed] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setSpeed} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [speedX] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#speedX} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType} [speedY] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#speedY} (emit only).
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [tint] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleTint}.
 * @property {number[]} [color] - An array of color values that the Particles interpolate through during their life. If set, overrides any `tint` property.
 * @property {string} [colorEase] - The string-based name of the Easing function to use if you have enabled Particle color interpolation via the `color` property, otherwise has no effect.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [x] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleX}.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType|Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType} [y] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#particleY}.
 * @property {Phaser.Types.GameObjects.Particles.EmitZoneData|Phaser.Types.GameObjects.Particles.EmitZoneData[]} [emitZone] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setEmitZone}.
 * @property {Phaser.Types.GameObjects.Particles.DeathZoneObject|Phaser.Types.GameObjects.Particles.DeathZoneObject[]} [deathZone] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setDeathZone}.
 * @property {Phaser.Types.GameObjects.Particles.ParticleEmitterBounds|Phaser.Types.GameObjects.Particles.ParticleEmitterBoundsAlt} [bounds] - As {@link Phaser.GameObjects.Particles.ParticleEmitter#setBounds}.
 * @property {Phaser.Types.Math.Vector2Like} [followOffset] - Offset coordinates that assigns to {@link Phaser.GameObjects.Particles.ParticleEmitter#followOffset}.
 * @property {string|string[]|Phaser.Types.GameObjects.Particles.ParticleEmitterAnimConfig} [anim] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#anims}.
 * @property {number|number[]|string|string[]|Phaser.Textures.Frame|Phaser.Textures.Frame[]|Phaser.Types.GameObjects.Particles.ParticleEmitterFrameConfig} [frame] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#frames}.
 * @property {string|Phaser.Textures.Texture} [texture] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#texture}. Overrides any texture already set on the Emitter.
 * @property {number} [reserve] - Creates specified number of inactive particles and adds them to this emitter's pool. {@link Phaser.GameObjects.Particles.ParticleEmitter#reserve}
 * @property {number} [advance] - If you wish to 'fast forward' the emitter in time, set this value to a number representing the amount of ms the emitter should advance. Doing so implicitly sets `emitting` to `true`.
 * @property {number} [duration] - Limit the emitter to emit particles for a maximum of `duration` ms. Default to zero, meaning 'forever'.
 * @property {number} [stopAfter] - Limit the emitter to emit this exact number of particles and then stop. Default to zero, meaning no limit.
 * @property {Phaser.Types.GameObjects.Particles.ParticleSortCallback} [sortCallback] - A custom callback that sorts particles prior to rendering. Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#sortCallback}.
 * @property {boolean} [sortOrderAsc] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#sortOrderAsc}.
 * @property {string} [sortProperty] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#sortProperty}.
 * @property {boolean} [tintFill] - Sets {@link Phaser.GameObjects.Particles.ParticleEmitter#tintFill}.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Particles.ParticleEmitterBoundsAlt
 * @since 3.0.0
 *
 * @property {number} x - The left edge of the rectangle.
 * @property {number} y - The top edge of the rectangle.
 * @property {number} w - The width of the rectangle.
 * @property {number} h - The height of the rectangle.
 *
 * @see Phaser.GameObjects.Particles.ParticleEmitter#addParticleBounds
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Particles.ParticleEmitterBounds
 * @since 3.0.0
 *
 * @property {number} x - The left edge of the rectangle.
 * @property {number} y - The top edge of the rectangle.
 * @property {number} width - The width of the rectangle.
 * @property {number} height - The height of the rectangle.
 *
 * @see Phaser.GameObjects.Particles.ParticleEmitter#addParticleBounds
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Particles.ParticleEmitterAnimConfig
 * @since 3.60.0
 *
 * @property {string|string[]|Phaser.Types.Animations.PlayAnimationConfig|Phaser.Types.Animations.PlayAnimationConfig[]} [anims] - One or more animations names, or Play Animation Config objects.
 * @property {boolean} [cycle=false] - Whether animations will be assigned consecutively (true) or at random (false).
 * @property {number} [quantity=1] - The number of consecutive particles receiving each animation, when `cycle` is true.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Particles.ParticleDataValue
 * @since 3.60.0
 *
 * @property {number} min - The minimum value.
 * @property {number} max - The maximum value.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Particles.ParticleData
 * @since 3.60.0
 *
 * @property {Phaser.Types.GameObjects.Particles.ParticleDataValue} [tint={min:0xffffff,max:0xffffff}]
 * @property {Phaser.Types.GameObjects.Particles.ParticleDataValue} [alpha={min:1,max:1}]
 * @property {Phaser.Types.GameObjects.Particles.ParticleDataValue} [rotate={min:0,max:0}]
 * @property {Phaser.Types.GameObjects.Particles.ParticleDataValue} [scaleX={min:1,max:1}]
 * @property {Phaser.Types.GameObjects.Particles.ParticleDataValue} [scaleY={min:1,max:1}]
 * @property {Phaser.Types.GameObjects.Particles.ParticleDataValue} [x={min:0,max:0}]
 * @property {Phaser.Types.GameObjects.Particles.ParticleDataValue} [y={min:0,max:0}]
 * @property {Phaser.Types.GameObjects.Particles.ParticleDataValue} [accelerationX={min:0,max:0}]
 * @property {Phaser.Types.GameObjects.Particles.ParticleDataValue} [accelerationY={min:0,max:0}]
 * @property {Phaser.Types.GameObjects.Particles.ParticleDataValue} [maxVelocityX={min:0,max:0}]
 * @property {Phaser.Types.GameObjects.Particles.ParticleDataValue} [maxVelocityY={min:0,max:0}]
 * @property {Phaser.Types.GameObjects.Particles.ParticleDataValue} [moveToX={min:0,max:0}]
 * @property {Phaser.Types.GameObjects.Particles.ParticleDataValue} [moveToY={min:0,max:0}]
 * @property {Phaser.Types.GameObjects.Particles.ParticleDataValue} [bounce={min:0,max:0}]
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Particles.GravityWellConfig
 * @since 3.0.0
 *
 * @property {number} [x=0] - The x coordinate of the Gravity Well, in world space.
 * @property {number} [y=0] - The y coordinate of the Gravity Well, in world space.
 * @property {number} [power=0] - The strength of the gravity force - larger numbers produce a stronger force.
 * @property {number} [epsilon=100] - The minimum distance for which the gravity force is calculated.
 * @property {number} [gravity=50] - The gravitational force of this Gravity Well.
 */
/**
 * @typedef {Phaser.GameObjects.Particles.Zones.EdgeZone|Phaser.GameObjects.Particles.Zones.RandomZone} Phaser.Types.GameObjects.Particles.EmitZoneObject
 * @since 3.60.0
 */
/**
 * @typedef {Phaser.Types.GameObjects.Particles.ParticleEmitterEdgeZoneConfig|Phaser.Types.GameObjects.Particles.ParticleEmitterRandomZoneConfig|Phaser.GameObjects.Particles.Zones.EdgeZone|Phaser.GameObjects.Particles.Zones.RandomZone} Phaser.Types.GameObjects.Particles.EmitZoneData
 * @since 3.60.0
 */
/**
 * Defines an operation yielding a value incremented by steps across a range.
 * 
 * @typedef {object} Phaser.Types.GameObjects.Particles.EmitterOpSteppedConfig
 * @since 3.0.0
 *
 * @property {number} start - The starting value.
 * @property {number} end - The ending value.
 * @property {number} steps - The number of steps between start and end.
 */
/**
 * Defines an operation yielding a random value within a range.
 * 
 * @typedef {object} Phaser.Types.GameObjects.Particles.EmitterOpRandomMinMaxConfig
 * @since 3.0.0
 *
 * @property {number} min - The minimum value.
 * @property {number} max - The maximum value.
 * @property {boolean} [int] - If true, only integers are selected from the range.
 */
/**
 * Defines an operation yielding a random value within a range.
 * 
 * @typedef {object} Phaser.Types.GameObjects.Particles.EmitterOpRandomConfig
 * @since 3.0.0
 *
 * @property {number[]} random - The minimum and maximum values, as [min, max].
 */
/**
 * @typedef {(Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateCallback|Phaser.Types.GameObjects.Particles.EmitterOpEaseConfig|Phaser.Types.GameObjects.Particles.EmitterOpCustomUpdateConfig|Phaser.Types.GameObjects.Particles.EmitterOpInterpolationConfig)} Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateType
 * @since 3.18.0
 */
/**
 * @typedef {(number|number[]|Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback|Phaser.Types.GameObjects.Particles.EmitterOpRandomConfig|Phaser.Types.GameObjects.Particles.EmitterOpRandomMinMaxConfig|Phaser.Types.GameObjects.Particles.EmitterOpSteppedConfig|Phaser.Types.GameObjects.Particles.EmitterOpCustomEmitConfig)} Phaser.Types.GameObjects.Particles.EmitterOpOnEmitType
 * @since 3.18.0
 */
/**
 * Defines an operation yielding a value incremented continuously across an interpolated data set.
 *
 * @typedef {object} Phaser.Types.GameObjects.Particles.EmitterOpInterpolationConfig
 * @since 3.60.0
 *
 * @property {number[]} values - The array of number values to interpolate through.
 * @property {(string|function)} [interpolation='Linear'] - The interpolation function to use. Typically one of `linear`, `bezier` or `catmull` or a custom function.
 * @property {(string|function)} [ease='Linear'] - An optional ease function to use. This can be either a string from the EaseMap, or a custom function.
 * @property {number[]} [easeParams] - An optional array of ease parameters to go with the ease.
 */
/**
 * Defines an operation yielding a value incremented continuously across a range.
 *
 * @typedef {object} Phaser.Types.GameObjects.Particles.EmitterOpEaseConfig
 * @since 3.0.0
 *
 * @property {number} start - The starting value.
 * @property {number} end - The ending value.
 * @property {boolean} [random] - If true, the particle starts with a minimum random value between the start and end values.
 * @property {(string|function)} [ease='Linear'] - The ease to find. This can be either a string from the EaseMap, or a custom function.
 * @property {number[]} [easeParams] - An optional array of ease parameters to go with the ease.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Particles.EmitterOpCustomUpdateConfig
 * @since 3.0.0
 *
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback} [onEmit] - A callback that is invoked each time the emitter emits a particle.
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateCallback} onUpdate - A callback that is invoked each time the emitter updates.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Particles.EmitterOpCustomEmitConfig
 * @since 3.0.0
 *
 * @property {Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback} onEmit - A callback that is invoked each time the emitter emits a particle.
 */
/**
 * @typedef {object} Phaser.Types.GameObjects.Particles.EdgeZoneSource
 * @since 3.0.0
 *
 * @property {Phaser.Types.GameObjects.Particles.EdgeZoneSourceCallback} getPoints - A function placing points on the sources edge or edges.
 *
 * @see Phaser.Curves.Curve
 * @see Phaser.Curves.Path
 * @see Phaser.Geom.Circle
 * @see Phaser.Geom.Ellipse
 * @see Phaser.Geom.Line
 * @see Phaser.Geom.Polygon
 * @see Phaser.Geom.Rectangle
 * @see Phaser.Geom.Triangle
 */
/**
 * @typedef {object} Phaser.Types.Display.InputColorObject
 * @since 3.0.0
 *
 * @property {number} [r] - The red color value in the range 0 to 255.
 * @property {number} [g] - The green color value in the range 0 to 255.
 * @property {number} [b] - The blue color value in the range 0 to 255.
 * @property {number} [a] - The alpha color value in the range 0 to 255.
 */
/**
 * @typedef {object} Phaser.Types.Display.HSVColorObject
 * @since 3.0.0
 *
 * @property {number} h - The hue color value. A number between 0 and 1
 * @property {number} s - The saturation color value. A number between 0 and 1
 * @property {number} v - The lightness color value. A number between 0 and 1
 */
/**
 * @typedef {object} Phaser.Types.Display.ColorObject
 * @since 3.0.0
 *
 * @property {number} r - The red color value in the range 0 to 255.
 * @property {number} g - The green color value in the range 0 to 255.
 * @property {number} b - The blue color value in the range 0 to 255.
 * @property {number} a - The alpha color value in the range 0 to 255.
 * @property {number} color - The combined color value.
 */
/**
 * @typedef {object} Phaser.Types.Curves.JSONPath
 * @since 3.0.0
 *
 * @property {string} type - The of the curve.
 * @property {number} x - The X coordinate of the curve's starting point.
 * @property {number} y - The Y coordinate of the path's starting point.
 * @property {boolean} autoClose - The path is auto closed.
 * @property {Phaser.Types.Curves.JSONCurve[]} curves - The list of the curves
 */
/**
 * @typedef {object} Phaser.Types.Curves.JSONEllipseCurve
 * @since 3.0.0
 *
 * @property {string} type - The of the curve.
 * @property {number} x - The x coordinate of the ellipse.
 * @property {number} y - The y coordinate of the ellipse.
 * @property {number} xRadius - The horizontal radius of ellipse.
 * @property {number} yRadius - The vertical radius of ellipse.
 * @property {number} startAngle - The start angle of the ellipse, in degrees.
 * @property {number} endAngle - The end angle of the ellipse, in degrees.
 * @property {boolean} clockwise - Sets if the the ellipse rotation is clockwise (true) or anti-clockwise (false)
 * @property {number} rotation - The rotation of ellipse, in degrees.
 */
/**
 * @typedef {object} Phaser.Types.Curves.JSONCurve
 * @since 3.0.0
 *
 * @property {string} type - The of the curve
 * @property {number[]} points - The arrays of points like `[x1, y1, x2, y2]`
 */
/**
 * @typedef {object} Phaser.Types.Curves.EllipseCurveConfig
 *
 * @property {number} [x=0] - The x coordinate of the ellipse.
 * @property {number} [y=0] - The y coordinate of the ellipse.
 * @property {number} [xRadius=0] - The horizontal radius of the ellipse.
 * @property {number} [yRadius=0] - The vertical radius of the ellipse.
 * @property {number} [startAngle=0] - The start angle of the ellipse, in degrees.
 * @property {number} [endAngle=360] - The end angle of the ellipse, in degrees.
 * @property {boolean} [clockwise=false] - Sets if the the ellipse rotation is clockwise (true) or anti-clockwise (false)
 * @property {number} [rotation=0] - The rotation of the ellipse, in degrees.
 */
/**
 * @typedef {object} Phaser.Types.Create.Palette
 * @since 3.0.0
 *
 * @property {string} 0 - Color value 1.
 * @property {string} 1 - Color value 2.
 * @property {string} 2 - Color value 3.
 * @property {string} 3 - Color value 4.
 * @property {string} 4 - Color value 5.
 * @property {string} 5 - Color value 6.
 * @property {string} 6 - Color value 7.
 * @property {string} 7 - Color value 8.
 * @property {string} 8 - Color value 9.
 * @property {string} 9 - Color value 10.
 * @property {string} A - Color value 11.
 * @property {string} B - Color value 12.
 * @property {string} C - Color value 13.
 * @property {string} D - Color value 14.
 * @property {string} E - Color value 15.
 * @property {string} F - Color value 16.
 */
/**
 * @typedef {object} Phaser.Types.Create.GenerateTextureConfig
 * @since 3.0.0
 *
 * @property {array} [data=[]] - An array of data, where each row is a string of single values 0-9A-F, or the period character.
 * @property {HTMLCanvasElement} [canvas=null] - The HTML Canvas to draw the texture to.
 * @property {Phaser.Types.Create.Palette} [palette=Arne16] - The indexed palette that the data cell values map to.
 * @property {number} [pixelWidth=1] - The width of each 'pixel' in the generated texture.
 * @property {number} [pixelHeight=1] - The height of each 'pixel' in the generated texture.
 * @property {boolean} [resizeCanvas=true] - Should the canvas be resized before the texture is drawn?
 * @property {boolean} [clearCanvas=true] - Should the canvas be cleared before the texture is drawn?
 * @property {Phaser.Types.Create.GenerateTextureCallback} [preRender] - A callback to send the canvas to prior to the texture being drawn.
 * @property {Phaser.Types.Create.GenerateTextureCallback} [postRender] - A callback to send the canvas to after the texture has been drawn.
 */
/**
 * @typedef {object} Phaser.Types.Core.WidthHeight
 * @since 3.16.0
 *
 * @property {number} [width=0] - The width.
 * @property {number} [height=0] - The height.
 */
/**
 * @typedef {object} Phaser.Types.Core.TouchInputConfig
 * @since 3.0.0
 *
 * @property {*} [target=null] - Where the Touch Manager listens for touch input events. The default is the game canvas.
 * @property {boolean} [capture=true] - Whether touch input events have preventDefault() called on them.
 */
/**
 * @typedef {object} Phaser.Types.Core.ScaleConfig
 * @since 3.16.0
 *
 * @property {(number|string)} [width=1024] - The base width of your game. Can be an integer or a string: '100%'. If a string it will only work if you have set a parent element that has a size.
 * @property {(number|string)} [height=768] - The base height of your game. Can be an integer or a string: '100%'. If a string it will only work if you have set a parent element that has a size.
 * @property {(Phaser.Scale.ZoomType|number)} [zoom=1] - The zoom value of the game canvas.
 * @property {?(HTMLElement|string)} [parent] - The DOM element that will contain the game canvas, or its `id`. If undefined, or if the named element doesn't exist, the game canvas is inserted directly into the document body. If `null` no parent will be used and you are responsible for adding the canvas to your environment.
 * @property {boolean} [expandParent=true] - Is the Scale Manager allowed to adjust the CSS height property of the parent and/or document body to be 100%?
 * @property {Phaser.Scale.ScaleModeType} [mode=Phaser.Scale.ScaleModes.NONE] - The scale mode.
 * @property {WidthHeight} [min] - The minimum width and height the canvas can be scaled down to.
 * @property {WidthHeight} [max] - The maximum width the canvas can be scaled up to.
 * @property {WidthHeight} [snap] - Set the snapping values used by the Scale Manager when resizing the canvas. See `ScaleManager.setSnap` for details.
 * @property {boolean} [autoRound=false] - Automatically round the display and style sizes of the canvas. This can help with performance in lower-powered devices.
 * @property {Phaser.Scale.CenterType} [autoCenter=Phaser.Scale.Center.NO_CENTER] - Automatically center the canvas within the parent?
 * @property {number} [resizeInterval=500] - How many ms should elapse before checking if the browser size has changed?
 * @property {?(HTMLElement|string)} [fullscreenTarget] - The DOM element that will be sent into full screen mode, or its `id`. If undefined Phaser will create its own div and insert the canvas into it when entering fullscreen mode.
 */
/**
 * @typedef {object} Phaser.Types.Core.RenderConfig
 * @since 3.0.0
 *
 * @property {boolean} [antialias=true] - When set to `true`, WebGL uses linear interpolation to draw scaled or rotated textures, giving a smooth appearance. When set to `false`, WebGL uses nearest-neighbor interpolation, giving a crisper appearance. `false` also disables antialiasing of the game canvas itself, if the browser supports it, when the game canvas is scaled.
 * @property {boolean} [antialiasGL=true] - Sets the `antialias` property when the WebGL context is created. Setting this value does not impact any subsequent textures that are created, or the canvas style attributes.
 * @property {boolean} [desynchronized=false] - When set to `true` it will create a desynchronized context for both 2D and WebGL. See https://developers.google.com/web/updates/2019/05/desynchronized for details.
 * @property {boolean} [pixelArt=false] - Sets `antialias` to false and `roundPixels` to true. This is the best setting for pixel-art games.
 * @property {boolean} [roundPixels=false] - Draw texture-based Game Objects at only whole-integer positions. Game Objects without textures, like Graphics, ignore this property.
 * @property {boolean} [transparent=false] - Whether the game canvas will be transparent. Boolean that indicates if the canvas contains an alpha channel. If set to false, the browser now knows that the backdrop is always opaque, which can speed up drawing of transparent content and images.
 * @property {boolean} [clearBeforeRender=true] - Whether the game canvas will be cleared between each rendering frame.
 * @property {boolean} [preserveDrawingBuffer=false] - If the value is true the WebGL buffers will not be cleared and will preserve their values until cleared or overwritten by the author.
 * @property {boolean} [premultipliedAlpha=true] - In WebGL mode, the drawing buffer contains colors with pre-multiplied alpha.
 * @property {boolean} [failIfMajorPerformanceCaveat=false] - Let the browser abort creating a WebGL context if it judges performance would be unacceptable.
 * @property {string} [powerPreference='default'] - "high-performance", "low-power" or "default". A hint to the browser on how much device power the game might use.
 * @property {number} [batchSize=4096] - The default WebGL batch size. Represents the number of _quads_ that can be added to a single batch.
 * @property {number} [maxLights=10] - The maximum number of lights allowed to be visible within range of a single Camera in the LightManager.
 * @property {number} [maxTextures=-1] - When in WebGL mode, this sets the maximum number of GPU Textures to use. The default, -1, will use all available units. The WebGL1 spec says all browsers should provide a minimum of 8.
 * @property {string} [mipmapFilter=''] - The mipmap magFilter to be used when creating WebGL textures. Don't set unless you wish to create mipmaps. Set to one of the following: 'NEAREST', 'LINEAR', 'NEAREST_MIPMAP_NEAREST', 'LINEAR_MIPMAP_NEAREST', 'NEAREST_MIPMAP_LINEAR' or 'LINEAR_MIPMAP_LINEAR'.
 * @property {Phaser.Types.Core.PipelineConfig} [pipeline] - The WebGL Pipeline configuration object.
 * @property {boolean} [autoMobilePipeline=true] - Automatically enable the Mobile Pipeline if iOS or Android detected?
 * @property {string} [defaultPipeline='MultiPipeline'] - The WebGL Pipeline that Game Objects will use by default. Set to 'MultiPipeline' as standard.
 */
/**
 * @typedef {object} Phaser.Types.Core.PluginObjectItem
 * @since 3.8.0
 *
 * @property {string} [key] - A key to identify the plugin in the Plugin Manager.
 * @property {*} [plugin] - The plugin itself. Usually a class/constructor.
 * @property {boolean} [start] - Whether the plugin should be started automatically.
 * @property {string} [systemKey] - For a scene plugin, add the plugin to the scene's systems object under this key (`this.sys.KEY`, from the scene).
 * @property {string} [sceneKey] - For a scene plugin, add the plugin to the scene object under this key (`this.KEY`, from the scene).
 * @property {string} [mapping] - If this plugin is to be injected into the Scene Systems, this is the property key map used.
 * @property {*} [data] - Arbitrary data passed to the plugin's init() method.
 *
 * @example
 * // Global plugin
 * { key: 'BankPlugin', plugin: BankPluginV3, start: true, data: { gold: 5000 } }
 * @example
 * // Scene plugin
 * { key: 'WireFramePlugin', plugin: WireFramePlugin, systemKey: 'wireFramePlugin', sceneKey: 'wireframe' }
 */
/**
 * @typedef {object} Phaser.Types.Core.PluginObject
 * @since 3.8.0
 *
 * @property {?Phaser.Types.Core.PluginObjectItem[]} [global] - Global plugins to install.
 * @property {?Phaser.Types.Core.PluginObjectItem[]} [scene] - Scene plugins to install.
 * @property {string[]} [default] - The default set of scene plugins (names).
 * @property {string[]} [defaultMerge] - Plugins to *add* to the default set of scene plugins.
 */
/**
 * @typedef {Phaser.Renderer.WebGL.WebGLPipeline[]|object.<string, Phaser.Renderer.WebGL.WebGLPipeline>} Phaser.Types.Core.PipelineConfig
 * @since 3.50.0
 *
 * @property {number} [frameInc=32] - Sets the `PipelineManager.frameInc` value to control the dimension increase in the Render Targets.
 */
/**
 * @typedef {object} Phaser.Types.Core.PhysicsConfig
 * @since 3.0.0
 *
 * @property {string} [default] - The default physics system. It will be started for each scene. Phaser provides 'arcade', 'impact', and 'matter'.
 * @property {Phaser.Types.Physics.Arcade.ArcadeWorldConfig} [arcade] - Arcade Physics configuration.
 * @property {Phaser.Types.Physics.Matter.MatterWorldConfig} [matter] - Matter Physics configuration.
 */
/**
 * @typedef {object} Phaser.Types.Core.MouseInputConfig
 * @since 3.0.0
 *
 * @property {*} [target=null] - Where the Mouse Manager listens for mouse input events. The default is the game canvas.
 * @property {boolean} [preventDefaultDown=true] - If `true` the DOM `mousedown` event will have `preventDefault` set.
 * @property {boolean} [preventDefaultUp=true] - If `true` the DOM `mouseup` event will have `preventDefault` set.
 * @property {boolean} [preventDefaultMove=true] - If `true` the DOM `mousemove` event will have `preventDefault` set.
 * @property {boolean} [preventDefaultWheel=true] - If `true` the DOM `wheel` event will have `preventDefault` set.
 */
/**
 * @typedef {object} Phaser.Types.Core.LoaderConfig
 * @since 3.0.0
 *
 * @property {string} [baseURL] - A URL used to resolve paths given to the loader. Example: 'http://labs.phaser.io/assets/'.
 * @property {string} [path] - A URL path used to resolve relative paths given to the loader. Example: 'images/sprites/'.
 * @property {number} [maxParallelDownloads=32] - The maximum number of resources the loader will start loading at once.
 * @property {(string|undefined)} [crossOrigin=undefined] - 'anonymous', 'use-credentials', or `undefined`. If you're not making cross-origin requests, leave this as `undefined`. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes}.
 * @property {string} [responseType] - The response type of the XHR request, e.g. `blob`, `text`, etc.
 * @property {boolean} [async=true] - Should the XHR request use async or not?
 * @property {string} [user] - Optional username for all XHR requests.
 * @property {string} [password] - Optional password for all XHR requests.
 * @property {number} [timeout=0] - Optional XHR timeout value, in ms.
 * @property {string[]} [localScheme] - An optional array of schemes that the Loader considers as being 'local' files. Defaults to: `[ 'file://', 'capacitor://' ]` if not specified.
 * @property {boolean} [withCredentials=false] - Optional XHR withCredentials value.
 * @property {string} [imageLoadType='XHR'] - Optional load type for image, `XHR` is default, or `HTMLImageElement` for a lightweight way.
 * @property {number} [maxRetries=2] - The number of times to retry the file load if it fails.
 */
/**
 * @typedef {object} Phaser.Types.Core.KeyboardInputConfig
 * @since 3.0.0
 *
 * @property {*} [target=window] - Where the Keyboard Manager listens for keyboard input events.
 * @property {?number[]} [capture] - `preventDefault` will be called on every non-modified key which has a key code in this array. By default it is empty.
 */
/**
 * @typedef {object} Phaser.Types.Core.InputConfig
 * @since 3.0.0
 *
 * @property {(boolean|Phaser.Types.Core.KeyboardInputConfig)} [keyboard=true] - Keyboard input configuration. `true` uses the default configuration and `false` disables keyboard input.
 * @property {(boolean|Phaser.Types.Core.MouseInputConfig)} [mouse=true] - Mouse input configuration. `true` uses the default configuration and `false` disables mouse input.
 * @property {(boolean|Phaser.Types.Core.TouchInputConfig)} [touch=true] - Touch input configuration. `true` uses the default configuration and `false` disables touch input.
 * @property {(boolean|Phaser.Types.Core.GamepadInputConfig)} [gamepad=false] - Gamepad input configuration. `true` enables gamepad input.
 * @property {number} [activePointers=1] - The maximum number of touch pointers. See {@link Phaser.Input.InputManager#pointers}.
 * @property {number} [smoothFactor=0] - The smoothing factor to apply during Pointer movement. See {@link Phaser.Input.Pointer#smoothFactor}.
 * @property {boolean} [windowEvents=true] - Should Phaser listen for input events on the Window? If you disable this, events like 'POINTER_UP_OUTSIDE' will no longer fire.
 */
/**
 * @typedef {object} Phaser.Types.Core.ImagesConfig
 * @since 3.0.0
 *
 * @property {(string|undefined|null)} [default] - A base64 encoded image file to use as the 'default' texture.
 * @property {(string|undefined|null)} [missing] - A base64 encoded image file to use as the 'missing' texture.
 * @property {(string|undefined|null)} [white] - A base64 encoded image file to use as the 'white' texture.
 */
/**
 * @typedef {object} Phaser.Types.Core.GamepadInputConfig
 * @since 3.0.0
 *
 * @property {*} [target=window] - Where the Gamepad Manager listens for gamepad input events.
 */
/**
 * @typedef {object} Phaser.Types.Core.GameConfig
 * @since 3.0.0
 *
 * @property {(number|string)} [width=1024] - The width of the game, in game pixels.
 * @property {(number|string)} [height=768] - The height of the game, in game pixels.
 * @property {number} [zoom=1] - Simple scale applied to the game canvas. 2 is double size, 0.5 is half size, etc.
 * @property {number} [type=CONST.AUTO] - Which renderer to use. Phaser.AUTO, Phaser.CANVAS, Phaser.HEADLESS, or Phaser.WEBGL. AUTO picks WEBGL if available, otherwise CANVAS.
 * @property {(number|boolean)} [stableSort=-1] - `true` or `1` = Use the built-in StableSort (needed for older browsers), `false` or `0` = Rely on ES2019 Array.sort being stable (modern browsers only), or `-1` = Try and determine this automatically based on browser inspection (not guaranteed to work, errs on side of caution).
 * @property {(HTMLElement|string|null)} [parent=undefined] - The DOM element that will contain the game canvas, or its `id`. If undefined, or if the named element doesn't exist, the game canvas is appended to the document body. If `null` no parent will be used and you are responsible for adding the canvas to the dom.
 * @property {HTMLCanvasElement} [canvas=null] - Provide your own Canvas element for Phaser to use instead of creating one.
 * @property {string} [canvasStyle=null] - CSS styles to apply to the game canvas instead of Phasers default styles.
 * @property {boolean}[customEnvironment=false] - Is Phaser running under a custom (non-native web) environment? If so, set this to `true` to skip internal Feature detection. If `true` the `renderType` cannot be left as `AUTO`.
 * @property {CanvasRenderingContext2D} [context] - Provide your own Canvas Context for Phaser to use, instead of creating one.
 * @property {(Phaser.Types.Scenes.SceneType|Phaser.Types.Scenes.SceneType[])} [scene=null] - A scene or scenes to add to the game. If several are given, the first is started; the remainder are started only if they have `{ active: true }`. See the `sceneConfig` argument in `Phaser.Scenes.SceneManager#add`.
 * @property {string[]} [seed] - Seed for the random number generator.
 * @property {string} [title=''] - The title of the game. Shown in the browser console.
 * @property {string} [url='https://phaser.io'] - The URL of the game. Shown in the browser console.
 * @property {string} [version=''] - The version of the game. Shown in the browser console.
 * @property {boolean} [autoFocus=true] - Automatically call window.focus() when the game boots. Usually necessary to capture input events if the game is in a separate frame.
 * @property {(boolean|Phaser.Types.Core.InputConfig)} [input] - Input configuration, or `false` to disable all game input.
 * @property {boolean} [disableContextMenu=false] - Disable the browser's default 'contextmenu' event (usually triggered by a right-button mouse click).
 * @property {(boolean|Phaser.Types.Core.BannerConfig)} [banner=false] - Configuration for the banner printed in the browser console when the game starts.
 * @property {Phaser.Types.Core.DOMContainerConfig} [dom] - The DOM Container configuration object.
 * @property {Phaser.Types.Core.FPSConfig} [fps] - Game loop configuration.
 * @property {Phaser.Types.Core.RenderConfig} [render] - Game renderer configuration.
 * @property {Phaser.Types.Core.CallbacksConfig} [callbacks] - Optional callbacks to run before or after game boot.
 * @property {Phaser.Types.Core.LoaderConfig} [loader] - Loader configuration.
 * @property {Phaser.Types.Core.ImagesConfig} [images] - Images configuration.
 * @property {Phaser.Types.Core.PhysicsConfig} [physics] - Physics configuration.
 * @property {Phaser.Types.Core.PluginObject|Phaser.Types.Core.PluginObjectItem[]} [plugins] - Plugins to install.
 * @property {Phaser.Types.Core.ScaleConfig} [scale] - The Scale Manager configuration.
 * @property {Phaser.Types.Core.AudioConfig} [audio] - The Audio Configuration object.
 * @property {Phaser.Types.Core.PipelineConfig} [pipeline] - The WebGL Pipeline configuration object. Can also be part of the `RenderConfig`.
 * @property {(string|number)} [backgroundColor=0x000000] - The background color of the game canvas. The default is black.
 * @property {boolean} [antialias=true] - When set to `true`, WebGL uses linear interpolation to draw scaled or rotated textures, giving a smooth appearance. When set to `false`, WebGL uses nearest-neighbor interpolation, giving a crisper appearance. `false` also disables antialiasing of the game canvas itself, if the browser supports it, when the game canvas is scaled.
 * @property {boolean} [antialiasGL=true] - Sets the `antialias` property when the WebGL context is created. Setting this value does not impact any subsequent textures that are created, or the canvas style attributes.
 * @property {boolean} [desynchronized=false] - When set to `true` it will create a desynchronized context for both 2D and WebGL. See https://developers.google.com/web/updates/2019/05/desynchronized for details.
 * @property {boolean} [pixelArt=false] - Sets `antialias` to false and `roundPixels` to true. This is the best setting for pixel-art games.
 * @property {boolean} [roundPixels=false] - Draw texture-based Game Objects at only whole-integer positions. Game Objects without textures, like Graphics, ignore this property.
 * @property {boolean} [transparent=false] - Whether the game canvas will be transparent. Boolean that indicates if the canvas contains an alpha channel. If set to false, the browser now knows that the backdrop is always opaque, which can speed up drawing of transparent content and images.
 * @property {boolean} [clearBeforeRender=true] - Whether the game canvas will be cleared between each rendering frame.
 * @property {boolean} [preserveDrawingBuffer=false] - If the value is true the WebGL buffers will not be cleared and will preserve their values until cleared or overwritten by the author.
 * @property {boolean} [premultipliedAlpha=true] - In WebGL mode, the drawing buffer contains colors with pre-multiplied alpha.
 * @property {boolean} [failIfMajorPerformanceCaveat=false] - Let the browser abort creating a WebGL context if it judges performance would be unacceptable.
 * @property {string} [powerPreference='default'] - "high-performance", "low-power" or "default". A hint to the browser on how much device power the game might use.
 * @property {number} [batchSize=4096] - The default WebGL batch size. Represents the number of _quads_ that can be added to a single batch.
 * @property {number} [maxLights=10] - The maximum number of lights allowed to be visible within range of a single Camera in the LightManager.
 * @property {number} [maxTextures=-1] - When in WebGL mode, this sets the maximum number of GPU Textures to use. The default, -1, will use all available units. The WebGL1 spec says all browsers should provide a minimum of 8.
 * @property {string} [mipmapFilter='LINEAR'] - The mipmap magFilter to be used when creating WebGL textures.
 * @property {boolean} [autoMobilePipeline=true] - Automatically enable the Mobile Pipeline if iOS or Android detected?
 * @property {string} [defaultPipeline='MultiPipeline'] - The WebGL Pipeline that Game Objects will use by default. Set to 'MultiPipeline' as standard.
 * @property {boolean} [expandParent=true] - Is the Scale Manager allowed to adjust the CSS height property of the parent and/or document body to be 100%?
 * @property {Phaser.Scale.ScaleModeType} [mode=Phaser.Scale.ScaleModes.NONE] - The scale mode.
 * @property {WidthHeight} [min] - The minimum width and height the canvas can be scaled down to.
 * @property {WidthHeight} [max] - The maximum width the canvas can be scaled up to.
 * @property {boolean} [autoRound=false] - Automatically round the display and style sizes of the canvas. This can help with performance in lower-powered devices.
 * @property {Phaser.Scale.CenterType} [autoCenter=Phaser.Scale.Center.NO_CENTER] - Automatically center the canvas within the parent?
 * @property {number} [resizeInterval=500] - How many ms should elapse before checking if the browser size has changed?
 * @property {?(HTMLElement|string)} [fullscreenTarget] - The DOM element that will be sent into full screen mode, or its `id`. If undefined Phaser will create its own div and insert the canvas into it when entering fullscreen mode.
 * @property {boolean} [disablePreFX=false] - Disables the automatic creation of the Pre FX Pipelines. If disabled, you cannot use the built-in Pre FX on Game Objects.
 * @property {boolean} [disablePostFX=false] - Disables the automatic creation of the Post FX Pipelines. If disabled, you cannot use the built-in Post FX on Game Objects.
 */
/**
 * @typedef {object} Phaser.Types.Core.FPSConfig
 * @since 3.0.0
 *
 * @property {number} [min=5] - The minimum acceptable rendering rate, in frames per second.
 * @property {number} [target=60] - The optimum rendering rate, in frames per second. This does not enforce the fps rate, it merely tells Phaser what rate is considered optimal for this game.
 * @property {number} [limit=0] - Enforces an fps rate limit that the game step will run at, regardless of browser frequency. 0 means 'no limit'. Never set this higher than RAF can handle.
 * @property {boolean} [forceSetTimeOut=false] - Use setTimeout instead of requestAnimationFrame to run the game loop.
 * @property {number} [deltaHistory=10] - Calculate the average frame delta from this many consecutive frame intervals.
 * @property {number} [panicMax=120] - The amount of frames the time step counts before we trust the delta values again.
 * @property {boolean} [smoothStep=true] - Apply delta smoothing during the game update to help avoid spikes?
 */
/**
 * @typedef {object} Phaser.Types.Core.DOMContainerConfig
 * @since 3.12.0
 *
 * @property {boolean} [createContainer=false] - Should the game create a div element to act as a DOM Container? Only enable if you're using DOM Element objects. You must provide a parent object if you use this feature.
 * @property {boolean} [behindCanvas=false] - Should the DOM Container that is created (if `dom.createContainer` is true) be positioned behind (true) or over the top (false, the default) of the game canvas?
 * @property {string} [pointerEvents='none'] - The default `pointerEvents` attribute set on the DOM Container.
 */
/**
 * @typedef {object} Phaser.Types.Core.CallbacksConfig
 * @since 3.0.0
 *
 * @property {Phaser.Types.Core.BootCallback} [preBoot=Phaser.Types.Core.NOOP] - A function to run at the start of the boot sequence.
 * @property {Phaser.Types.Core.BootCallback} [postBoot=Phaser.Types.Core.NOOP] - A function to run at the end of the boot sequence. At this point, all the game systems have started and plugins have been loaded.
 */
/**
 * @typedef {object} Phaser.Types.Core.BannerConfig
 * @since 3.0.0
 *
 * @property {boolean} [hidePhaser=false] - Omit Phaser's name and version from the banner.
 * @property {string} [text='#ffffff'] - The color of the banner text.
 * @property {string[]} [background] - The background colors of the banner.
 */
/**
 * Config object containing various sound settings.
 *
 * @typedef {object} Phaser.Types.Core.AudioConfig
 * @since 3.0.0
 *
 * @property {boolean} [disableWebAudio=false] - Use HTML5 Audio instead of Web Audio.
 * @property {AudioContext} [context] - An existing Web Audio context.
 * @property {boolean} [noAudio=false] - Disable all audio output.
 *
 * @see Phaser.Sound.SoundManagerCreator
 */
/**
 * @typedef {object} Phaser.Physics.Matter.Events.SleepStartEvent
 *
 * @property {any} source - The source object of the event.
 * @property {string} name - The name of the event.
 */
/**
 * @typedef {object} Phaser.Physics.Matter.Events.SleepEndEvent
 *
 * @property {any} source - The source object of the event.
 * @property {string} name - The name of the event.
 */
/**
 * @typedef {object} Phaser.Types.Physics.Arcade.SpriteWithStaticBody
 * @extends Phaser.Physics.Arcade.Sprite
 *
 * @property {Phaser.Physics.Arcade.StaticBody} body
 */
/**
 * @typedef {object} Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
 * @extends Phaser.Physics.Arcade.Sprite
 *
 * @property {Phaser.Physics.Arcade.Body} body
 */
/**
 * @typedef {object} Phaser.Types.Physics.Arcade.PhysicsGroupDefaults
 * @since 3.0.0
 *
 * @property {boolean} setCollideWorldBounds - As {@link Phaser.Physics.Arcade.Body#setCollideWorldBounds}.
 * @property {Phaser.Geom.Rectangle} setBoundsRectangle - As {@link Phaser.Physics.Arcade.Body#setBoundsRectangle}.
 * @property {number} setAccelerationX - As {@link Phaser.Physics.Arcade.Body#setAccelerationX}.
 * @property {number} setAccelerationY - As {@link Phaser.Physics.Arcade.Body#setAccelerationY}.
 * @property {boolean} setAllowDrag - As {@link Phaser.Physics.Arcade.Body#setAllowDrag}.
 * @property {boolean} setAllowGravity - As {@link Phaser.Physics.Arcade.Body#setAllowGravity}.
 * @property {boolean} setAllowRotation - As {@link Phaser.Physics.Arcade.Body#setAllowRotation}.
 * @property {boolean} setDamping - As {@link Phaser.Physics.Arcade.Body#setDamping}.
 * @property {number} setBounceX - As {@link Phaser.Physics.Arcade.Body#setBounceX}.
 * @property {number} setBounceY - As {@link Phaser.Physics.Arcade.Body#setBounceY}.
 * @property {number} setDragX - As {@link Phaser.Physics.Arcade.Body#setDragX}.
 * @property {number} setDragY - As {@link Phaser.Physics.Arcade.Body#setDragY}.
 * @property {boolean} setEnable - As {@link Phaser.Physics.Arcade.Body#setEnable}.
 * @property {number} setGravityX - As {@link Phaser.Physics.Arcade.Body#setGravityX}.
 * @property {number} setGravityY - As {@link Phaser.Physics.Arcade.Body#setGravityY}.
 * @property {number} setFrictionX - As {@link Phaser.Physics.Arcade.Body#setFrictionX}.
 * @property {number} setFrictionY - As {@link Phaser.Physics.Arcade.Body#setFrictionY}.
 * @property {number} setMaxSpeed - As {@link Phaser.Physics.Arcade.Body#setMaxSpeed}.
 * @property {number} setVelocityX - As {@link Phaser.Physics.Arcade.Body#setVelocityX}.
 * @property {number} setVelocityY - As {@link Phaser.Physics.Arcade.Body#setVelocityY}.
 * @property {number} setAngularVelocity - As {@link Phaser.Physics.Arcade.Body#setAngularVelocity}.
 * @property {number} setAngularAcceleration - As {@link Phaser.Physics.Arcade.Body#setAngularAcceleration}.
 * @property {number} setAngularDrag - As {@link Phaser.Physics.Arcade.Body#setAngularDrag}.
 * @property {number} setMass - As {@link Phaser.Physics.Arcade.Body#setMass}.
 * @property {boolean} setImmovable - As {@link Phaser.Physics.Arcade.Body#setImmovable}.
 */
/**
 * @typedef {object} Phaser.Types.Physics.Arcade.PhysicsGroupConfig
 * @extends Phaser.Types.GameObjects.Group.GroupConfig
 * @since 3.0.0
 *
 * @property {boolean} [collideWorldBounds=false] - Sets {@link Phaser.Physics.Arcade.Body#collideWorldBounds}.
 * @property {Phaser.Geom.Rectangle} [customBoundsRectangle=null] - Sets {@link Phaser.Physics.Arcade.Body#setBoundsRectangle setBoundsRectangle}.
 * @property {number} [accelerationX=0] - Sets {@link Phaser.Physics.Arcade.Body#acceleration acceleration.x}.
 * @property {number} [accelerationY=0] - Sets {@link Phaser.Physics.Arcade.Body#acceleration acceleration.y}.
 * @property {boolean} [allowDrag=true] - Sets {@link Phaser.Physics.Arcade.Body#allowDrag}.
 * @property {boolean} [allowGravity=true] - Sets {@link Phaser.Physics.Arcade.Body#allowGravity}.
 * @property {boolean} [allowRotation=true] - Sets {@link Phaser.Physics.Arcade.Body#allowRotation}.
 * @property {boolean} [useDamping=false] - Sets {@link Phaser.Physics.Arcade.Body#useDamping useDamping}.
 * @property {number} [bounceX=0] - Sets {@link Phaser.Physics.Arcade.Body#bounce bounce.x}.
 * @property {number} [bounceY=0] - Sets {@link Phaser.Physics.Arcade.Body#bounce bounce.y}.
 * @property {number} [dragX=0] - Sets {@link Phaser.Physics.Arcade.Body#drag drag.x}.
 * @property {number} [dragY=0] - Sets {@link Phaser.Physics.Arcade.Body#drag drag.y}.
 * @property {boolean} [enable=true] - Sets {@link Phaser.Physics.Arcade.Body#enable enable}.
 * @property {number} [gravityX=0] - Sets {@link Phaser.Physics.Arcade.Body#gravity gravity.x}.
 * @property {number} [gravityY=0] - Sets {@link Phaser.Physics.Arcade.Body#gravity gravity.y}.
 * @property {number} [frictionX=0] - Sets {@link Phaser.Physics.Arcade.Body#friction friction.x}.
 * @property {number} [frictionY=0] - Sets {@link Phaser.Physics.Arcade.Body#friction friction.y}.
 * @property {number} [maxSpeed=-1] - Sets {@link Phaser.Physics.Arcade.Body#maxSpeed maxSpeed}.
 * @property {number} [maxVelocityX=10000] - Sets {@link Phaser.Physics.Arcade.Body#maxVelocity maxVelocity.x}.
 * @property {number} [maxVelocityY=10000] - Sets {@link Phaser.Physics.Arcade.Body#maxVelocity maxVelocity.y}.
 * @property {number} [velocityX=0] - Sets {@link Phaser.Physics.Arcade.Body#velocity velocity.x}.
 * @property {number} [velocityY=0] - Sets {@link Phaser.Physics.Arcade.Body#velocity velocity.y}.
 * @property {number} [angularVelocity=0] - Sets {@link Phaser.Physics.Arcade.Body#angularVelocity}.
 * @property {number} [angularAcceleration=0] - Sets {@link Phaser.Physics.Arcade.Body#angularAcceleration}.
 * @property {number} [angularDrag=0] - Sets {@link Phaser.Physics.Arcade.Body#angularDrag}.
 * @property {number} [mass=0] - Sets {@link Phaser.Physics.Arcade.Body#mass}.
 * @property {boolean} [immovable=false] - Sets {@link Phaser.Physics.Arcade.Body#immovable}.
 */
/**
 * @typedef {object} Phaser.Types.Physics.Arcade.ImageWithStaticBody
 * @extends Phaser.Physics.Arcade.Image
 *
 * @property {Phaser.Physics.Arcade.StaticBody} body
 */
/**
 * @typedef {object} Phaser.Types.Physics.Arcade.ImageWithDynamicBody
 * @extends Phaser.Physics.Arcade.Image
 *
 * @property {Phaser.Physics.Arcade.Body} body
 */
/**
 * @typedef {object} Phaser.Types.Physics.Arcade.GameObjectWithStaticBody
 * @extends Phaser.GameObjects.GameObject
 *
 * @property {Phaser.Physics.Arcade.StaticBody} body
 */
/**
 * @typedef {object} Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody
 * @extends Phaser.GameObjects.GameObject
 *
 * @property {Phaser.Physics.Arcade.Body} body
 */
/**
 * @typedef {object} Phaser.Types.Physics.Arcade.GameObjectWithBody
 * @extends Phaser.GameObjects.GameObject
 *
 * @property {(Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody)} body
 */
/**
 * @typedef {object} Phaser.Types.Physics.Arcade.CheckCollisionObject
 * @since 3.0.0
 *
 * @property {boolean} up - Will bodies collide with the top side of the world bounds?
 * @property {boolean} down - Will bodies collide with the bottom side of the world bounds?
 * @property {boolean} left - Will bodies collide with the left side of the world bounds?
 * @property {boolean} right - Will bodies collide with the right side of the world bounds?
 */
/**
 * @typedef {object} Phaser.Types.Physics.Arcade.ArcadeWorldTreeMinMax
 * @since 3.0.0
 *
 * @property {number} minX - The minimum x value used in RTree searches.
 * @property {number} minY - The minimum y value used in RTree searches.
 * @property {number} maxX - The maximum x value used in RTree searches.
 * @property {number} maxY - The maximum y value used in RTree searches.
 */
/**
 * @typedef {object} Phaser.Types.Physics.Arcade.ArcadeWorldDefaults
 * @since 3.0.0
 *
 * @property {boolean} debugShowBody - Set to `true` to render dynamic body outlines to the debug display.
 * @property {boolean} debugShowStaticBody - Set to `true` to render static body outlines to the debug display.
 * @property {boolean} debugShowVelocity - Set to `true` to render body velocity markers to the debug display.
 * @property {number} bodyDebugColor - The color of dynamic body outlines when rendered to the debug display.
 * @property {number} staticBodyDebugColor - The color of static body outlines when rendered to the debug display.
 * @property {number} velocityDebugColor - The color of the velocity markers when rendered to the debug display.
 */
/**
 * @typedef {object} Phaser.Types.Physics.Arcade.ArcadeWorldConfig
 * @since 3.0.0
 *
 * @property {number} [fps=60] - Sets {@link Phaser.Physics.Arcade.World#fps}.
 * @property {boolean} [fixedStep=true] - Sets {@link Phaser.Physics.Arcade.World#fixedStep}.
 * @property {number} [timeScale=1] - Sets {@link Phaser.Physics.Arcade.World#timeScale}.
 * @property {Phaser.Types.Math.Vector2Like} [gravity] - Sets {@link Phaser.Physics.Arcade.World#gravity}.
 * @property {number} [x=0] - Sets {@link Phaser.Physics.Arcade.World#bounds bounds.x}.
 * @property {number} [y=0] - Sets {@link Phaser.Physics.Arcade.World#bounds bounds.y}.
 * @property {number} [width=0] - Sets {@link Phaser.Physics.Arcade.World#bounds bounds.width}.
 * @property {number} [height=0] - Sets {@link Phaser.Physics.Arcade.World#bounds bounds.height}.
 * @property {Phaser.Types.Physics.Arcade.CheckCollisionObject} [checkCollision] - Sets {@link Phaser.Physics.Arcade.World#checkCollision}.
 * @property {number} [overlapBias=4] - Sets {@link Phaser.Physics.Arcade.World#OVERLAP_BIAS}.
 * @property {number} [tileBias=16] - Sets {@link Phaser.Physics.Arcade.World#TILE_BIAS}.
 * @property {boolean} [forceX=false] - Sets {@link Phaser.Physics.Arcade.World#forceX}.
 * @property {boolean} [isPaused=false] - Sets {@link Phaser.Physics.Arcade.World#isPaused}.
 * @property {boolean} [debug=false] - Sets {@link Phaser.Physics.Arcade.World#debug}.
 * @property {boolean} [debugShowBody=true] - Sets {@link Phaser.Physics.Arcade.World#defaults debugShowBody}.
 * @property {boolean} [debugShowStaticBody=true] - Sets {@link Phaser.Physics.Arcade.World#defaults debugShowStaticBody}.
 * @property {boolean} [debugShowVelocity=true] - Sets {@link Phaser.Physics.Arcade.World#defaults debugShowStaticBody}.
 * @property {number} [debugBodyColor=0xff00ff] - Sets {@link Phaser.Physics.Arcade.World#defaults bodyDebugColor}.
 * @property {number} [debugStaticBodyColor=0x0000ff] - Sets {@link Phaser.Physics.Arcade.World#defaults staticBodyDebugColor}.
 * @property {number} [debugVelocityColor=0x00ff00] - Sets {@link Phaser.Physics.Arcade.World#defaults velocityDebugColor}.
 * @property {number} [maxEntries=16] - Sets {@link Phaser.Physics.Arcade.World#maxEntries}.
 * @property {boolean} [useTree=true] - Sets {@link Phaser.Physics.Arcade.World#useTree}.
 * @property {boolean} [customUpdate=false] - If enabled, you need to call `World.update` yourself.
 */
/**
 * An Arcade Physics Collider Type.
 *
 * @typedef {(Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody|Phaser.GameObjects.GameObject|Phaser.GameObjects.Group|Phaser.Physics.Arcade.Sprite|Phaser.Physics.Arcade.Image|Phaser.Physics.Arcade.StaticGroup|Phaser.Physics.Arcade.Group|Phaser.Tilemaps.TilemapLayer|Phaser.Physics.Arcade.Body[]|Phaser.GameObjects.GameObject[]|Phaser.Physics.Arcade.Sprite[]|Phaser.Physics.Arcade.Image[]|Phaser.Physics.Arcade.StaticGroup[]|Phaser.Physics.Arcade.Group[]|Phaser.Tilemaps.TilemapLayer[])} Phaser.Types.Physics.Arcade.ArcadeColliderType
 * @since 3.0.0
 */
/**
 * An Arcade Physics Collider Type.
 *
 * @typedef {(Phaser.Physics.Arcade.Sprite|Phaser.Physics.Arcade.Image|Phaser.Physics.Arcade.StaticGroup|Phaser.Physics.Arcade.Group|Phaser.Tilemaps.TilemapLayer)} Phaser.Types.Physics.Arcade.ArcadeCollider
 * @since 3.70.0
 */
/**
 * @typedef {object} Phaser.Types.Physics.Arcade.ArcadeBodyCollision
 * @since 3.0.0
 *
 * @property {boolean} none - True if the Body is not colliding.
 * @property {boolean} up - True if the Body is colliding on its upper edge.
 * @property {boolean} down - True if the Body is colliding on its lower edge.
 * @property {boolean} left - True if the Body is colliding on its left edge.
 * @property {boolean} right - True if the Body is colliding on its right edge.
 */
/**
 * @typedef {object} Phaser.Types.Physics.Arcade.ArcadeBodyBounds
 * @since 3.0.0
 *
 * @property {number} x - The left edge.
 * @property {number} y - The upper edge.
 * @property {number} right - The right edge.
 * @property {number} bottom - The lower edge.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.XMLFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Text Cache.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='xml'] - The default file extension to use if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.VideoFileURLConfig
 *
 * @property {string} type - The video file format. See property names in {@link Phaser.Device.Video}.
 * @property {string} url - The absolute or relative URL of the video file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.VideoFileConfig
 *
 * @property {(string|Phaser.Types.Loader.FileTypes.VideoFileConfig)} key - The key to use for this file, or a file configuration object.
 * @property {(string|string[]|Phaser.Types.Loader.FileTypes.VideoFileURLConfig|Phaser.Types.Loader.FileTypes.VideoFileURLConfig[])} [url] - The absolute or relative URLs to load the video files from.
 * @property {boolean} [noAudio] - Does the video have an audio track? If not you can enable auto-playing on it.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.UnityAtlasFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @property {string} [textureURL] - The absolute or relative URL to load the texture image file from.
 * @property {string} [textureExtension='png'] - The default file extension to use for the image texture if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [textureXhrSettings] - Extra XHR Settings specifically for the texture image file.
 * @property {string} [normalMap] - The filename of an associated normal map. It uses the same path and url to load as the texture image.
 * @property {string} [atlasURL] - The absolute or relative URL to load the atlas data file from.
 * @property {string} [atlasExtension='txt'] - The default file extension to use for the atlas data if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [atlasXhrSettings] - Extra XHR Settings specifically for the atlas data file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.TilemapJSONFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Tilemap Cache.
 * @property {object|string} [url] - The absolute or relative URL to load the file from. Or, a well formed JSON object.
 * @property {string} [extension='json'] - The default file extension to use if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.TilemapImpactFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Tilemap Cache.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='json'] - The default file extension to use if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.TilemapCSVFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Tilemap Cache.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='csv'] - The default file extension to use if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.TextFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Text Cache.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='txt'] - The default file extension to use if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.SVGSizeConfig
 *
 * @property {number} [width] - An optional width. The SVG will be resized to this size before being rendered to a texture.
 * @property {number} [height] - An optional height. The SVG will be resized to this size before being rendered to a texture.
 * @property {number} [scale] - An optional scale. If given it overrides the width / height properties. The SVG is scaled by the scale factor before being rendered to a texture.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.SVGFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='svg'] - The default file extension to use if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 * @property {Phaser.Types.Loader.FileTypes.SVGSizeConfig} [svgConfig] - The svg size configuration object.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.SpriteSheetFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='png'] - The default file extension to use if no url is provided.
 * @property {string} [normalMap] - The filename of an associated normal map. It uses the same path and url to load as the image.
 * @property {Phaser.Types.Loader.FileTypes.ImageFrameConfig} [frameConfig] - The frame configuration object.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.ScriptFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within the Loader.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='js'] - The default file extension to use if no url is provided.
 * @property {string} [type='script'] - The script type. Should be either 'script' for classic JavaScript, or 'module' if the file contains an exported module.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.ScenePluginFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within the Loader.
 * @property {(string|function)} [url] - The absolute or relative URL to load the file from. Or, a Scene Plugin.
 * @property {string} [extension='js'] - The default file extension to use if no url is provided.
 * @property {string} [systemKey] - If this plugin is to be added to Scene.Systems, this is the property key for it.
 * @property {string} [sceneKey] - If this plugin is to be added to the Scene, this is the property key for it.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.SceneFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Text Cache.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='js'] - The default file extension to use if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.PluginFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within the Loader.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='js'] - The default file extension to use if no url is provided.
 * @property {boolean} [start=false] - Automatically start the plugin after loading?
 * @property {string} [mapping] - If this plugin is to be injected into the Scene, this is the property key used.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.PackFileSection
 *
 * @property {Phaser.Types.Loader.FileConfig[]} files - The files to load. See {@link Phaser.Types.Loader.FileTypes}.
 * @property {string} [baseURL] - A URL used to resolve paths in `files`. Example: 'http://labs.phaser.io/assets/'.
 * @property {string} [defaultType] - The default {@link Phaser.Types.Loader.FileConfig} `type`.
 * @property {string} [path] - A URL path used to resolve relative paths in `files`. Example: 'images/sprites/'.
 * @property {string} [prefix] - An optional prefix that is automatically prepended to each file key.
 *
 * @example
 * var packFileSection = {
 *      "prefix": "TEST2.",
 *      "path": "assets/pics",
 *      "defaultType": "image",
 *      "files": [
 *          {
 *              "key": "donuts",
 *              "extension": "jpg"
 *          },
 *          {
 *              "key": "ayu"
 *          }
 *      ]
 *  }
 * // Result:
 * // --------------------------------------------
 * // assets/pics/ayu.png    -> image TEST2.ayu
 * // assets/pics/donuts.jpg -> image TEST2.donuts
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.PackFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the JSON Cache.
 * @property {string|any} [url] - The absolute or relative URL to load the file from. Or can be a ready formed JSON object, in which case it will be directly processed.
 * @property {string} [extension='json'] - The default file extension to use if no url is provided.
 * @property {string} [dataKey] - If specified instead of the whole JSON file being parsed, only the section corresponding to this property key will be added. If the property you want to extract is nested, use periods to divide it.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.OBJFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the OBJ Cache.
 * @property {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.obj`, i.e. if `key` was "alien" then the URL will be "alien.obj".
 * @property {string} [extension='obj'] - The default file extension to use if no url is provided.
 * @property {boolean} [flipUV] - Flip the UV coordinates stored in the model data?
 * @property {string} [matURL] - An optional absolute or relative URL to the object material file from. If undefined or `null`, no material file will be loaded.
 * @property {string} [matExtension='mat'] - The default material file extension to use if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.MultiScriptFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within the Loader.
 * @property {string[]} [url] - An array of absolute or relative URLs to load the script files from. They are processed in the order given in the array.
 * @property {string} [extension='js'] - The default file extension to use if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for these files.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.MultiAtlasFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @property {string} [atlasURL] - The absolute or relative URL to load the multi atlas json file from. Or, a well formed JSON object.
 * @property {string} [url] - An alias for 'atlasURL'. If given, it overrides anything set in 'atlasURL'.
 * @property {string} [atlasExtension='json'] - The default file extension to use for the atlas json if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [atlasXhrSettings] - Extra XHR Settings specifically for the atlas json file.
 * @property {string} [path] - Optional path to use when loading the textures defined in the atlas data.
 * @property {string} [baseURL] - Optional Base URL to use when loading the textures defined in the atlas data.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [textureXhrSettings] - Extra XHR Settings specifically for the texture files.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.JSONFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the JSON Cache.
 * @property {string|any} [url] - The absolute or relative URL to load the file from. Or can be a ready formed JSON object, in which case it will be directly added to the Cache.
 * @property {string} [extension='json'] - The default file extension to use if no url is provided.
 * @property {string} [dataKey] - If specified instead of the whole JSON file being parsed and added to the Cache, only the section corresponding to this property key will be added. If the property you want to extract is nested, use periods to divide it.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.ImageFrameConfig
 *
 * @property {number} frameWidth - The width of the frame in pixels.
 * @property {number} [frameHeight] - The height of the frame in pixels. Uses the `frameWidth` value if not provided.
 * @property {number} [startFrame=0] - The first frame to start parsing from.
 * @property {number} [endFrame] - The frame to stop parsing at. If not provided it will calculate the value based on the image and frame dimensions.
 * @property {number} [margin=0] - The margin in the image. This is the space around the edge of the frames.
 * @property {number} [spacing=0] - The spacing between each frame in the image.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.ImageFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='png'] - The default file extension to use if no url is provided.
 * @property {string} [normalMap] - The filename of an associated normal map. It uses the same path and url to load as the image.
 * @property {Phaser.Types.Loader.FileTypes.ImageFrameConfig} [frameConfig] - The frame configuration object. Only provided for, and used by, Sprite Sheets.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.HTMLTextureFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='html'] - The default file extension to use if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 * @property {number} [width=512] - The width of the texture the HTML will be rendered to.
 * @property {number} [height=512] - The height of the texture the HTML will be rendered to.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.HTMLFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Text Cache.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='html'] - The default file extension to use if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.GLSLFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Text Cache.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [shaderType='fragment'] - The type of shader. Either `fragment` for a fragment shader, or `vertex` for a vertex shader. This is ignored if you load a shader bundle.
 * @property {string} [extension='glsl'] - The default file extension to use if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.FontFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within the Loader.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='ttf'] - The default file extension to use if no url is provided.
 * @property {string} [format='truetype'] - The font type. Should be a string, like 'truetype' or 'opentype'.
 * @property {object} [descriptors] - An optional object containing font descriptors for the Font Face.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.CSSFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within the Loader.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='css'] - The default file extension to use if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry
 *
 * @property {string} [format] - The texture compression base format that the browser must support in order to load this file. Can be any of: 'ETC', 'ETC1', 'ATC', 'ASTC', 'BPTC', 'RGTC', 'PVRTC', 'S3TC', 'S3TCSRGB' or the fallback format of 'IMG'.
 * @property {string} [type] - The container format, either PVR or KTX. If not given it will try to extract it from the textureURL extension.
 * @property {string} [textureURL] - The URL of the compressed texture file to load.
 * @property {string} [atlasURL] - Optional URL of a texture atlas JSON data file. If not given, the texture will be loaded as a single image.
 * @property {string} [multiAtlasURL] - Optional URL of a multi-texture atlas JSON data file as created by Texture Packer Pro.
 * @property {string} [multiPath] - Optional path to use when loading the textures defined in the multi atlas data.
 * @property {string} [multiBaseURL] - Optional Base URL to use when loading the textures defined in the multi atlas data.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.CompressedTextureFileConfig
 *
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [ETC] - The string, or file entry object, for an ETC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [ETC1] - The string, or file entry object, for an ETC1 format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [ATC] - The string, or file entry object, for an ATC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [ASTC] - The string, or file entry object, for an ASTC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [BPTC] - The string, or file entry object, for an BPTC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [RGTC] - The string, or file entry object, for an RGTC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [PVRTC] - The string, or file entry object, for an PVRTC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [S3TC] - The string, or file entry object, for an S3TC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [S3TCSRGB] - The string, or file entry object, for an S3TCSRGB format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [IMG] - The string, or file entry object, for the fallback image file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.BitmapFontFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @property {string} [textureURL] - The absolute or relative URL to load the texture image file from.
 * @property {string} [textureExtension='png'] - The default file extension to use for the image texture if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [textureXhrSettings] - Extra XHR Settings specifically for the texture image file.
 * @property {string} [normalMap] - The filename of an associated normal map. It uses the same path and url to load as the texture image.
 * @property {string} [fontDataURL] - The absolute or relative URL to load the font data xml file from.
 * @property {string} [fontDataExtension='xml'] - The default file extension to use for the font data xml if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [fontDataXhrSettings] - Extra XHR Settings specifically for the font data xml file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.BinaryFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Binary Cache.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='bin'] - The default file extension to use if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 * @property {any} [dataType] - Optional type to cast the binary file to once loaded. For example, `Uint8Array`.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.AudioSpriteFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Audio Cache.
 * @property {string} jsonURL - The absolute or relative URL to load the json file from. Or a well formed JSON object to use instead.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [jsonXhrSettings] - Extra XHR Settings specifically for the json file.
 * @property {{(string|string[])}} [audioURL] - The absolute or relative URL to load the audio file from.
 * @property {any} [audioConfig] - The audio configuration options.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [audioXhrSettings] - Extra XHR Settings specifically for the audio file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.AudioFileURLConfig
 *
 * @property {string} type - The audio file format. See property names in {@link Phaser.Device.Audio}.
 * @property {string} url - The absolute or relative URL of the audio file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.AudioFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within the Loader and Audio Cache.
 * @property {(string|string[]|Phaser.Types.Loader.FileTypes.AudioFileURLConfig|Phaser.Types.Loader.FileTypes.AudioFileURLConfig[])} [url] - The absolute or relative URLs to load the audio files from.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 * @property {AudioContext} [context] - The optional AudioContext this file will use to process itself.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.AtlasXMLFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @property {string} [textureURL] - The absolute or relative URL to load the texture image file from.
 * @property {string} [textureExtension='png'] - The default file extension to use for the image texture if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [textureXhrSettings] - Extra XHR Settings specifically for the texture image file.
 * @property {string} [normalMap] - The filename of an associated normal map. It uses the same path and url to load as the texture image.
 * @property {string} [atlasURL] - The absolute or relative URL to load the atlas xml file from.
 * @property {string} [atlasExtension='xml'] - The default file extension to use for the atlas xml if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [atlasXhrSettings] - Extra XHR Settings specifically for the atlas xml file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.AtlasJSONFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @property {string} [textureURL] - The absolute or relative URL to load the texture image file from.
 * @property {string} [textureExtension='png'] - The default file extension to use for the image texture if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [textureXhrSettings] - Extra XHR Settings specifically for the texture image file.
 * @property {string} [normalMap] - The filename of an associated normal map. It uses the same path and url to load as the texture image.
 * @property {object|string} [atlasURL] - The absolute or relative URL to load the atlas json file from. Or, a well formed JSON object to use instead.
 * @property {string} [atlasExtension='json'] - The default file extension to use for the atlas json if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [atlasXhrSettings] - Extra XHR Settings specifically for the atlas json file.
 */
/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.AsepriteFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @property {string} [textureURL] - The absolute or relative URL to load the texture image file from.
 * @property {string} [textureExtension='png'] - The default file extension to use for the image texture if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [textureXhrSettings] - Extra XHR Settings specifically for the texture image file.
 * @property {object|string} [atlasURL] - The absolute or relative URL to load the atlas json file from. Or, a well formed JSON object to use instead.
 * @property {string} [atlasExtension='json'] - The default file extension to use for the atlas json if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [atlasXhrSettings] - Extra XHR Settings specifically for the atlas json file.
 */
/**
 * @typedef {object} Phaser.Types.Input.Keyboard.KeyComboConfig
 * @since 3.0.0
 *
 * @property {boolean} [resetOnWrongKey=true] - If they press the wrong key do we reset the combo?
 * @property {number} [maxKeyDelay=0] - The max delay in ms between each key press. Above this the combo is reset. 0 means disabled.
 * @property {boolean} [resetOnMatch=false] - If previously matched and they press the first key of the combo again, will it reset?
 * @property {boolean} [deleteOnMatch=false] - If the combo matches, will it delete itself?
 */
/**
 * @callback Phaser.Types.Physics.Arcade.ArcadePhysicsCallback
 *
 * A callback receiving two Game Objects.
 *
 * When colliding a single sprite with a Group or TilemapLayer, `object1` is always the sprite.
 *
 * For all other cases, `object1` and `object2` match the same arguments in `collide()` or `overlap()`.
 *
 * Note you can receive back only a body if you passed in a body directly.
 * 
 * You should only do this if the body intentionally has no associated game object (sprite, .etc).
 * 
 * @param {(Phaser.Types.Physics.Arcade.GameObjectWithBody|Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody|Phaser.Tilemaps.Tile)} object1 - The first Game Object.
 * @param {(Phaser.Types.Physics.Arcade.GameObjectWithBody|Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody|Phaser.Tilemaps.Tile)} object2 - The second Game Object.
 */
/**
 * @callback CenterFunction
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to return the center coordinates of.
 *
 * @return {Phaser.Math.Vector2} The center point of the Triangle according to the function.
 */
/**
 * @callback ContentLoadedCallback
 */
/**
 * @callback DataEachCallback
 *
 * @param {*} parent - The parent object of the DataManager.
 * @param {string} key - The key of the value.
 * @param {*} value - The value.
 * @param {...*} [args] - Additional arguments that will be passed to the callback, after the game object, key, and data.
 */
/**
 * @callback Phaser.Types.Actions.CallCallback
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} item - The Game Object to run the callback on.
 */
/**
 * A predicate, to test each element of the array.
 *
 * @callback TilemapFilterCallback
 *
 * @param {Phaser.GameObjects.GameObject} value - An object found in the filtered area.
 * @param {number} index - The index of the object within the array.
 * @param {Phaser.GameObjects.GameObject[]} array - An array of all the objects found.
 *
 * @return {boolean} A value that coerces to `true` to keep the element, or to `false` otherwise.
 */
/**
 * @callback TilemapFindCallback
 *
 * @param {Phaser.GameObjects.GameObject} value - An object found.
 * @param {number} index - The index of the object within the array.
 * @param {Phaser.GameObjects.GameObject[]} array - An array of all the objects found.
 *
 * @return {boolean} `true` if the callback should be invoked, otherwise `false`.
 */
/**
 * @callback EachTextureCallback
 *
 * @param {Phaser.Textures.Texture} texture - Each texture in Texture Manager.
 * @param {...*} [args] - Additional arguments that will be passed to the callback, after the child.
 */
/**
 * @callback EachSetCallback<E>
 *
 * @param {E} entry - The Set entry.
 * @param {number} index - The index of the entry within the Set.
 *
 * @return {?boolean} The callback result.
 */
/**
 * @callback EachMapCallback<E>
 *
 * @param {string} key - The key of the Map entry.
 * @param {E} entry - The value of the Map entry.
 *
 * @return {?boolean} The callback result.
 */
/**
 * @callback EachListCallback<I>
 *
 * @param {I} item - The item which is currently being processed.
 * @param {...*} [args] - Additional arguments that will be passed to the callback, after the child.
 */
/**
 * @callback Phaser.Types.Input.Keyboard.KeyboardKeydownCallback
 * @since 3.0.0
 *
 * @param {KeyboardEvent} event - The Keyboard Event.
 */
/**
 * @callback Phaser.Types.GameObjects.Group.GroupMultipleCreateCallback
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject[]} items - The newly created group members
 */
/**
 * @callback Phaser.Types.GameObjects.Group.GroupClassTypeConstructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {(string|Phaser.Textures.Texture)} texture - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|number)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 */
/**
 * @callback Phaser.Types.GameObjects.Group.GroupCallback
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} item - A group member
 */
/**
 * @callback Phaser.Types.GameObjects.BitmapText.DisplayCallback
 *
 * @param {Phaser.Types.GameObjects.BitmapText.DisplayCallbackConfig} display - Settings of the character that is about to be rendered.
 *
 * @return {Phaser.Types.GameObjects.BitmapText.DisplayCallbackConfig} Altered position, scale and rotation values for the character that is about to be rendered.
 */
/**
 * @callback Phaser.Types.Cameras.Scene2D.CameraZoomCallback
 * @since 3.11.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera on which the effect is running.
 * @param {number} progress - The progress of the effect. A value between 0 and 1.
 * @param {number} zoom - The Camera's new zoom value.
 */
/**
 * @callback Phaser.Types.Cameras.Scene2D.CameraShakeCallback
 * @since 3.5.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera on which the effect is running.
 * @param {number} progress - The progress of the effect. A value between 0 and 1.
 */
/**
 * @callback Phaser.Types.Cameras.Scene2D.CameraPanCallback
 * @since 3.5.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera on which the effect is running.
 * @param {number} progress - The progress of the effect. A value between 0 and 1.
 * @param {number} x - The Camera's new scrollX coordinate.
 * @param {number} y - The Camera's new scrollY coordinate.
 */
/**
 * @callback Phaser.Types.Cameras.Scene2D.CameraFlashCallback
 * @since 3.5.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera on which the effect is running.
 * @param {number} progress - The progress of the effect. A value between 0 and 1.
 */
/**
 * @callback Phaser.Types.Cameras.Scene2D.CameraFadeCallback
 * @since 3.5.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera on which the effect is running.
 * @param {number} progress - The progress of the effect. A value between 0 and 1.
 */
/**
         * @callback CameraRotateCallback
         *
         * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera on which the effect is running.
         * @param {number} progress - The progress of the effect. A value between 0 and 1.
         * @param {number} angle - The Camera's new angle in radians.
         */
/**
 * @callback Phaser.Types.Sound.EachActiveSoundCallback
 * @since 3.0.0
 *
 * @param {Phaser.Sound.BaseSoundManager} manager - The SoundManager
 * @param {Phaser.Sound.BaseSound} sound - The current active Sound
 * @param {number} index - The index of the current active Sound
 * @param {Phaser.Sound.BaseSound[]} sounds - All sounds
 */
/**
 * @callback Phaser.Types.Scenes.SceneUpdateCallback
 * @since 3.0.0
 *
 * @this Phaser.Scene
 * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
 */
/**
 * @callback Phaser.Types.Scenes.SceneTransitionOnStartCallback
 * @since 3.60.0
 *
 * @this Phaser.Scene
 * @param {Phaser.Scene} fromScene - Scene instance to transition from.
 * @param {Phaser.Scene} toScene - Scene instance to transition to.
 * @property {number} [duration=1000] - The duration, in ms, for the transition to last.
 */
/**
 * Can be defined on your own Scenes. Use it to load assets.
 * This method is called by the Scene Manager, after `init()` and before `create()`, only if the Scene has a LoaderPlugin.
 * After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically.
 *
 * @callback Phaser.Types.Scenes.ScenePreloadCallback
 * @since 3.0.0
 *
 * @this Phaser.Scene
 */
/**
 * Can be defined on your own Scenes.
 * This method is called by the Scene Manager when the scene starts, before `preload()` and `create()`.
 *
 * @callback Phaser.Types.Scenes.SceneInitCallback
 * @since 3.0.0
 *
 * @this Phaser.Scene
 * @param {object} data - Any data passed via `ScenePlugin.add()` or `ScenePlugin.start()`. Same as Scene.settings.data.
 */
/**
 * Can be defined on your own Scenes. Use it to create your game objects.
 * This method is called by the Scene Manager when the scene starts, after `init()` and `preload()`.
 * If the LoaderPlugin started after `preload()`, then this method is called only after loading is complete.
 *
 * @callback Phaser.Types.Scenes.SceneCreateCallback
 * @since 3.0.0
 *
 * @this Phaser.Scene
 * @param {object} data - Any data passed via `ScenePlugin.add()` or `ScenePlugin.start()`. Same as Scene.settings.data.
 */
/**
 * @callback WebGLContextCallback
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGL Renderer which owns the context.
 */
/**
 * @callback Phaser.Types.Input.HitAreaCallback
 * @since 3.0.0
 *
 * @param {any} hitArea - The hit area object.
 * @param {number} x - The translated x coordinate of the hit test event.
 * @param {number} y - The translated y coordinate of the hit test event.
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that invoked the hit test.
 *
 * @return {boolean} `true` if the coordinates fall within the space of the hitArea, otherwise `false`.
 */
/**
 * @callback LightForEach
 *
 * @param {Phaser.GameObjects.Light} light - The Light.
 */
/**
 * @callback Phaser.Types.Renderer.Snapshot.SnapshotCallback
 * @since 3.16.1
 *
 * @param {(Phaser.Display.Color|HTMLImageElement)} snapshot - Either a Color object if a single pixel is being grabbed, or a new Image which contains a snapshot of the canvas contents.
 */
/**
 * An attractor function calculates the force to be applied
 * to `bodyB`, it should either:
 * - return the force vector to be applied to `bodyB`
 * - or apply the force to the body(s) itself
 * @callback AttractorFunction
 * @param {Matter.Body} bodyA
 * @param {Matter.Body} bodyB
 * @returns {(Vector|undefined)} a force vector (optional)
 */
/**
 * @callback Phaser.Types.Tweens.TweenOnYoyoCallback
 * @since 3.18.0
 *
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween.
 * @param {any} target - The current target of the Tween. If this Tween has multiple targets, this will be a reference to just the single one being updated prior to this callback.
 * @param {string} key - The property that is being updated on the target.
 * @param {number} current - The current value of the property being set on the target.
 * @param {number} previous - The previous value of the property being set on the target.
 * @param {...any} param - Any value passed in `onYoyoParams`.
 */
/**
 * @callback Phaser.Types.Tweens.TweenOnUpdateCallback
 * @since 3.18.0
 *
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween.
 * @param {any} target - The current target of the Tween. If this Tween has multiple targets, this will be a reference to just the single one being updated prior to this callback.
 * @param {string} key - The property that is being updated on the target.
 * @param {number} current - The current value of the property being set on the target.
 * @param {number} previous - The previous value of the property being set on the target.
 * @param {...any} param - Any value passed in `onUpdateParams`.
 */
/**
 * @callback Phaser.Types.Tweens.TweenOnStopCallback
 * @since 3.24.0
 *
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween.
 * @param {(any|any[])} targets - The targets of the Tween. If this Tween has multiple targets this will be an array of the targets.
 * @param {...any} param - Any value passed in `onStopParams`.
 */
/**
 * @callback Phaser.Types.Tweens.TweenOnStartCallback
 * @since 3.18.0
 *
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween.
 * @param {(any|any[])} targets - The targets of the Tween. If this Tween has multiple targets this will be an array of the targets.
 * @param {...any} param - Any value passed in `onStartParams`.
 */
/**
 * @callback Phaser.Types.Tweens.TweenOnResumeCallback
 * @since 3.60.0
 *
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween.
 * @param {(any|any[])} targets - The targets of the Tween. If this Tween has multiple targets this will be an array of the targets.
 * @param {...any} param - Any value passed in `onPauseParams`.
 */
/**
 * @callback Phaser.Types.Tweens.TweenOnRepeatCallback
 * @since 3.18.0
 *
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween.
 * @param {any} target - The current target of the Tween. If this Tween has multiple targets, this will be a reference to just the single one being updated prior to this callback.
 * @param {string} key - The property that is being updated on the target.
 * @param {number} current - The current value of the property being set on the target.
 * @param {number} previous - The previous value of the property being set on the target.
 * @param {...any} param - Any value passed in `onRepeatParams`.
 */
/**
 * @callback Phaser.Types.Tweens.TweenOnPauseCallback
 * @since 3.60.0
 *
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween.
 * @param {(any|any[])} targets - The targets of the Tween. If this Tween has multiple targets this will be an array of the targets.
 * @param {...any} param - Any value passed in `onPauseParams`.
 */
/**
 * @callback Phaser.Types.Tweens.TweenOnLoopCallback
 * @since 3.18.0
 *
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween.
 * @param {(any|any[])} targets - The targets of the Tween. If this Tween has multiple targets this will be an array of the targets.
 * @param {...any} param - Any value passed in `onLoopParams`.
 */
/**
 * @callback Phaser.Types.Tweens.TweenOnCompleteCallback
 * @since 3.18.0
 *
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween.
 * @param {(any|any[])} targets - The targets of the Tween. If this Tween has multiple targets this will be an array of the targets.
 * @param {...any} param - Any value passed in `onCompleteParams`.
 */
/**
 * @callback Phaser.Types.Tweens.TweenOnActiveCallback
 * @since 3.19.0
 *
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween.
 * @param {(any|any[])} targets - The targets of the Tween. If this Tween has multiple targets this will be an array of the targets.
 * @param {...any} param - Any value passed in `onActiveParams`.
 */
/**
 * @callback Phaser.Types.Tweens.GetStartCallback
 * @since 3.18.0
 *
 * @param {any} target - The tween target.
 * @param {string} key - The target property.
 * @param {number} value - The current value of the target property.
 * @param {number} targetIndex - The index of the target within the Tween.
 * @param {number} totalTargets - The total number of targets in this Tween.
 * @param {Phaser.Tweens.Tween} tween - The Tween that invoked this callback.
 *
 * @return {number} - The new value.
 */
/**
 * @callback Phaser.Types.Tweens.GetEndCallback
 * @since 3.18.0
 *
 * @param {any} target - The tween target.
 * @param {string} key - The target property.
 * @param {number} value - The current value of the target property.
 * @param {number} targetIndex - The index of the target within the Tween.
 * @param {number} totalTargets - The total number of targets in this Tween.
 * @param {Phaser.Tweens.Tween} tween - The Tween that invoked this callback.
 *
 * @return {number} - The new value.
 */
/**
 * @callback Phaser.Types.Tweens.GetActiveCallback
 * @since 3.19.0
 *
 * @param {any} target - The tween target.
 * @param {string} key - The target property.
 * @param {number} value - The current value of the target property.
 * @param {number} targetIndex - The index of the target within the Tween.
 * @param {number} totalTargets - The total number of targets in this Tween.
 * @param {Phaser.Tweens.Tween} tween - The Tween that invoked this callback.
 *
 * @return {number} - The new value.
 */
/**
 * @callback Phaser.Types.Tilemaps.CreateFromObjectsClassTypeConstructor
 * @since 3.60.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 */
/**
 * @callback EachTileCallback
 *
 * @param {Phaser.Tilemaps.Tile} value - The Tile.
 * @param {number} index - The index of the tile.
 * @param {Phaser.Tilemaps.Tile[]} array - An array of Tile objects.
 */
/**
 * @callback FindTileCallback
 *
 * @param {Phaser.Tilemaps.Tile} value - The Tile.
 * @param {number} index - The index of the tile.
 * @param {Phaser.Tilemaps.Tile[]} array - An array of Tile objects.
 *
 * @return {boolean} Return `true` if the callback should run, otherwise `false`.
 */
/**
     * @callback EachContainerCallback
     * @generic I - [item]
     *
     * @param {*} item - The child Game Object of the Container.
     * @param {...*} [args] - Additional arguments that will be passed to the callback, after the child.
     */
/**
 * @callback CreateCallback
 *
 * @param {Phaser.GameObjects.Bob} bob - The Bob that was created by the Blitter.
 * @param {number} index - The position of the Bob within the Blitter display list.
 */
/**
 * @callback Phaser.Types.Create.GenerateTextureCallback
 * @since 3.0.0
 *
 * @param {HTMLCanvasElement} canvas - The HTML Canvas element to operate on.
 * @param {CanvasRenderingContext2D} context - The context of the HTML Canvas element.
 */
/**
 * @callback Phaser.Types.Core.TimeStepCallback
 * @since 3.0.0
 *
 * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param {number} average - The Delta average.
 */
/**
 * This callback type is completely empty, a no-operation.
 *
 * @callback Phaser.Types.Core.NOOP
 * @since 3.0.0
 */
/**
 * @callback Phaser.Types.Core.BootCallback
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - The game.
 */
/**
 * A custom function that will be responsible for wrapping the text.
 * @callback TextStyleWordWrapCallback
 *
 * @param {string} text - The string to wrap.
 * @param {Phaser.GameObjects.Text} textObject - The Text instance.
 *
 * @return {(string|string[])} Should return the wrapped lines either as an array of lines or as a string with
 * newline characters in place to indicate where breaks should happen.
 */
/**
 * @callback Phaser.Types.GameObjects.Particles.RandomZoneSourceCallback
 * @since 3.0.0
 *
 * @param {Phaser.Types.Math.Vector2Like} point - A point to modify.
 */
/**
 * @callback Phaser.Types.GameObjects.Particles.ParticleSortCallback
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.Particles.Particle} a - The first Particle being compared.
 * @param {Phaser.GameObjects.Particles.Particle} b - The second Particle being compared.
*/
/**
 * @callback Phaser.Types.GameObjects.Particles.ParticleEmitterCallback
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Particles.Particle} particle - The particle associated with the call.
 * @param {Phaser.GameObjects.Particles.ParticleEmitter} emitter - This particle emitter associated with the call.
 */
/**
 * @callback Phaser.Types.GameObjects.Particles.ParticleDeathCallback
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Particles.Particle} particle - The particle that died.
*/
/**
 * @callback Phaser.Types.GameObjects.Particles.ParticleClassConstructor
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Particles.ParticleEmitter} emitter - The Emitter to which this Particle belongs.
*/
/**
 * The returned value updates the property for the duration of the particle's life.
 * 
 * @callback Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateCallback
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Particles.Particle} particle - The particle.
 * @param {string} key - The name of the property.
 * @param {number} t - The normalized lifetime of the particle, between 0 (start) and 1 (end).
 * @param {number} value - The current value of the property.
 *
 * @return {number} The new value of the property.
 */
/**
 * The returned value sets what the property will be at the START of the particle's life, on emit.
 * 
 * @callback Phaser.Types.GameObjects.Particles.EmitterOpOnEmitCallback
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Particles.Particle} [particle] - The particle.
 * @param {string} [key] - The name of the property.
 * @param {number} [value] - The current value of the property.
 *
 * @return {number} The new value of the property.
 */
/**
 * @callback Phaser.Types.GameObjects.Particles.EdgeZoneSourceCallback
 * @since 3.0.0
 *
 * @param {number} quantity - The number of particles to place on the source edge. If 0, `stepRate` should be used instead.
 * @param {number} [stepRate] - The distance between each particle. When set, `quantity` is implied and should be set to `0`.
 *
 * @return {Phaser.Types.Math.Vector2Like[]} - The points placed on the source edge.
 */
/**
 * @callback Phaser.Types.GameObjects.Particles.DeathZoneSourceCallback
 * @since 3.0.0
 *
 * @param {number} x - The x coordinate of the particle to check against this source area.
 * @param {number} y - The y coordinate of the particle to check against this source area.
 *
 * @return {boolean} - True if the coordinates are within the source area.
 */
