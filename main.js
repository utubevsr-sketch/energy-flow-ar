// Energy Flow AR: point at any surface in your room, pinch, and a torrent of luminous energy flows to you.
// Meta Quest 3 mixed reality (passthrough), hands only. WebXR + Three.js, no build step.
// ===================================================================================================
// GLOSSARY OF DIVINE NAMES
// Every variable, constant, function, class, shader name and own object key in this file carries a divine
// name. Each entry: divine name, what it was called before, and what it does. Names not listed here belong
// to Three.js, WebXR, the DOM or GLSL and are unchanged, as are the quality data, the text you see, the
// URL parameters and the saved-settings keys (set, q, intensity, recv, sacred).
//
// Main parts:
//   Ganga             (Flow)  one energy flow (class): the torrent from a surface to you
//   triveni           (flows)  all live flows
//   vishnupadi        (castFlow)  casts a new flow from a surface point (Ganga springs from Vishnu's foot)
//   rudra             (clearFlows)  fades out every flow
//   varna             (palette)  the shared quality palette (5 colours) that tints every layer
//   gunanidhi         (selectedQualities)  the selected quality or the whole set
//   GUNASAGARA        (QUALITY_SETS)  the 5 sets of 24 qualities and colours, from Puja VR
//   MAHAVIRYA         (INTENSITIES)  Gentle / Strong / Torrent settings
//   SHARANAGATI       (RECEIVE)  Receive into: Auto / Heart / Palms labels
//   TRIMURTI          (MAX_FLOWS)  most flows at once (3)
//   sankalpa          (state)  the menu choices, saved in localStorage (its keys are unchanged)
//   smarana           (save)  saves the menu choices
//   shruti            (params)  URL parameters
//   vishvakarma       (renderer)  the WebGL renderer (the divine architect)
//   vishvarupa        (scene)  the scene: the whole visible universe
//   sahasraksha       (camera)  the camera (Indra, the thousand-eyed)
//   kalachakra        (clock)  the frame clock
//   mahakala          (clockNow)  app time in seconds
//   POORNAM           (TAU)  2 pi, the full circle
//   HIRANYAGARBHA     (PHI)  the golden ratio
//   SURYANARAYANA     (GOLDEN_ANGLE)  the golden angle, 137.5 degrees
//   URDHVAGA          (UP)  the up vector
//   shanta            (smooth)  smoothstep in JavaScript
//   PRAKASHA          (GLOW_BLEND)  additive-light blending settings for passthrough
//   MAYA              (NOISE)  GLSL noise functions
//   GANGOTRI          (FLOW)  GLSL shared by every flow layer: uniforms, path, funnel radius, colours
//   BHAGIRATHI        (FLOW_POS)  GLSL particle position along the flow
//   jahnavi           (streakGeos)  instanced streak geometry, one per intensity
//   alakananda        (streakMat)  material of the torrent streak particles
//   shesha            (tubeGeo)  the tube grid used by the core beam and sheath
//   jyoti             (coreMat)  the white-hot core beam
//   kavachadhara      (sheathMat)  the hurricane wall sheath
//   mayadevi          (hazeMat)  soft haze billboards in the funnel
//   sudarshana        (diskMat)  the vortex disk on the surface
//   hridayeshvara     (chestMat)  the impact glow at the heart or palms
//   setubandha        (bez)  point on the flow's curve
//   margadarshi       (bezT)  direction of the flow's curve
//   chakradhara       (funnelR)  hurricane funnel radius along the flow
//   varnadhara        (colorAt)  palette colour by index (GLSL)
//   varnamala         (colorSmooth)  blended palette colour (GLSL)
//   pravaha           (flowPos)  where a torrent particle is (GLSL)
//   avatarana         (arrPos)  where a pass-through particle is (GLSL)
//   mayapati          (fbmP)  wrapping fractal noise (GLSL)
//   mayini            (vnoiseP)  wrapping value noise (GLSL)
//   chitragupta       (hash12)  hash (GLSL)
//   shakti            (empower)  the arrival / empowerment stage
//   parashakti        (eu)  uniforms shared by the arrival effects
//   SHAKTIPEETHA      (EMP_COMMON)  GLSL shared by the arrival effects
//   avatara           (arrivalMesh)  particles passing through you into the body swirl
//   avataradhara      (arrivalGeo)  their instanced geometry
//   tejomaya          (aura)  the body aura shells
//   tejasvi           (auraMat)  aura shell material
//   damaru            (shock)  the crescendo shockwave at chest height
//   damarudhara       (shockFloor)  the shockwave on the floor
//   nataraja          (shockMat)  shockwave material
//   natesha           (shockFloorMat)  floor shockwave material
//   vajra             (bolts)  the lightning system
//   indra             (bolt)  builds one jagged branching bolt
//   agni              (sparks)  sparks and embers
//   hastajyoti        (handGlow)  glow on fingertips and palms
//   kripa             (handMotes)  motes drawn into the palms and up the forearms
//   panduranga        (xrHands)  the two WebXR hands
//   hastamalaka       (readHands)  reads tracked hands: palm, normal, wrist, forearm, tips
//   abhaya            (demoHands)  stand-in hands for the desktop demo
//   varadahasta       (menuDemoHand)  stand-in left palm for ?demo=menu
//   hastadvaya        (handsNow)  tracked hands this frame
//   pratigraha        (receivingNow)  which hand received the flow last frame
//   surya             (flare)  head-locked flare and bloom overlay
//   purusha           (phantomBody)  translucent stand-in body for the demo
//   shaktimandala     (empowerGroup)  group of the arrival effects
//   hridaya           (chest)  the heart target
//   sahasrara         (head)  head (eye) position
//   sahasraradisha    (headQ)  head orientation
//   purvadisha        (fwd)  where you look
//   purvottara        (fwdYaw)  where you look, level
//   NARAYANA          (PHANTOM)  the stand-in person's eyes in the demo
//   saraswati         (panel)  the menu panel
//   jagadguru         (menuHint)  the floating 'turn your left palm' hint
//   chakrapani        (pointers)  the two hand pointers (ray + reticle)
//   mushika           (mouse)  the desktop mouse pointer (Ganesha's mouse)
//   lakshya           (aim)  aims a pointer: panel, surface or air
//   ashirvada         (onSelect)  handles a pinch or click
//   bindu             (makeReticle)  builds the glowing reticle ring
//   tarjani           (makePointer)  builds a pointer
//   drishti           (raycaster)  raycaster
//   nadabrahma        (audio)  all sound
//   vastu             (room)  the desktop stand-in room
//   vastupurusha      (roomMat)  room grid material
//   leela             (startDemo)  sets up ?demo views
//   LEELADHARA        (DEMO)  ?demo is on
//   shriyantradhara   (sacredU)  sacred geometry on/off fade
//   lalita            (sriYantraTex)  Sri Yantra line texture
//   kartikeya         (ringTex)  hexagram / Seed of Life ring texture
//   hrishikesha       (anahataTex)  Anahata (heart) mandala texture
//   brahma            (metatronTex)  Metatron's Cube / Fruit of Life texture
//   chitrakara        (lineTex)  draws a line texture once
//   tripurasundari    (yantraMat)  the Sri Yantra on the source vortex
//   sudarshanachakra  (ringMat)  golden-ratio rings along the torrent
//   chakrarupa        (ringGeo)  instanced ring geometry
//   mandaleshvara     (sacredAround)  Anahata, palm yantras and Metatron's Cube
//   SHRICHAKRA        (SACRED_FRAG)  GLSL glow of the sacred line textures
//   yantreshvari      (plainSacredMat)  material for the sacred textures around you
//
// Page elements (index.html): dwarakadhisha = the Enter AR button (was #enter), margabandhu = the desktop
//   hint (was #hint), leelamaya = the body class in demo mode (was .demo).
//
// Hand-tracking smoke test (?demo=palms&xrhands):
//   KARAKA         fake XRHand joints are on
//   mudra          builds XRHand-like joints on the real hand objects and sends 'connected' with handedness
//   kamalanayana   one hand object       gadadhari  its index     sharngi    -1 left, +1 right
//   chakri         a WebXR joint name    shankhi    a joint       nandaki    the joints of a hand
//   vanamali       palm centre           kaustubha  palm normal   pitambara  forearm line   yashoda  fingertip index
//   mudrita        (hand userData) joints already built
//
// Shader names and helpers:
//   abhu              (env)  GLSL variable
//   achyuta           (anahata)  constant
//   adhishthana       (flow)  variable
//   adhokshaja        (rad)  GLSL variable
//   adideva           (burst)  constant
//   aditya            (_hov)  constant
//   adrishya          (spawn)  constant
//   agrahya           (b)  parameter, GLSL variable
//   agrani            (below)  parameter
//   ahas              (d)  constant, GLSL variable
//   aja               (yb)  parameter
//   akshara           (sofa)  constant
//   amaraprabhu       (i)  variable, GLSL variable
//   ameyatma          (metatron)  constant
//   amitashana        (uReveal)  shader uniform
//   amogha            (cols)  parameter
//   amrita            (qualities)  parameter
//   amritamshudbhava  (width)  parameter
//   amritapa          (hoverId)  object property
//   amrityu           (color)  parameter
//   anadinidhana      (label)  parameter
//   anagha            (side)  parameter, GLSL variable
//   anala             (p1)  constant
//   anantajit         (palm)  constant, GLSL variable
//   anaya             (w2)  GLSL variable
//   anila             (controller)  parameter
//   animisha          (p)  constant, GLSL parameter
//   aniruddha         (_l)  constant
//   anirvinna         (t2)  GLSL variable
//   anukula           (y2)  constant
//   anuttama          (size)  parameter
//   apamnidhi         (tArr)  variable
//   apramatta         (frames)  variable
//   aprameya          (qs)  parameter
//   aprameyatma       (dy)  constant
//   aravindaksha      (pulse)  constant, GLSL variable
//   artha             (ph)  GLSL parameter
//   asankhyeya        (dx)  constant
//   ashoka            (nWrap)  constant
//   atindra           (hoverKey)  variable
//   atindriya         (place)  function
//   atmavan           (cy)  parameter
//   atula             (per)  GLSL parameter
//   aushadha          (steps)  parameter
//   avartana          (local)  constant
//   avijnata          (uWash)  shader uniform
//   avyanga           (w)  parameter, GLSL parameter
//   avyaya            (hexagram)  constant
//   babhru            (mu)  constant
//   bahushira         (au)  constant
//   bhanu             (d0)  constant
//   bharta            (needPlace)  variable
//   bhaskaradyuti     (perp2)  constant
//   BHAVA             (N_MAX)  constant
//   bhavana           (hint)  constant
//   bhima             (uN)  shader uniform
//   bhojana           (point)  parameter
//   bhokta            (normal)  parameter
//   bhrajishnu        (kc)  constant
//   BHUGARBHA         (NW)  constant
//   bhujagottama      (y)  parameter, GLSL variable
//   bhuridakshina     (arrive)  object property
//   bhutabhavana      (hazeGeo)  constant
//   BHUTABHAVYA       (DEMO_MENU)  constant
//   BHUTABHRIT        (PHANTOM_MODE)  constant
//   bhutadi           (ndc)  constant
//   BHUTAKRIT         (STOP_AT)  constant
//   bhutamaheshvara   (arrived)  object property
//   bhutatma          (planeGeo)  constant
//   bija              (th)  GLSL parameter
//   brihadbhanu       (build)  function
//   brihadrupa        (session)  constant
//   chandramshu       (perp1)  constant
//   chaturatma        (sc)  constant
//   chaturbhuja       (age)  constant
//   chaturdamshtra    (pn)  constant
//   chaturvyuha       (sd)  constant
//   daksha            (base)  GLSL variable
//   damana            (lines)  constant
//   damodara          (uLen)  shader uniform
//   deva              (uTwist)  shader uniform
//   devabhrit         (pnSet)  object property
//   devesha           (recvCount)  object property
//   dhama             (cur)  parameter
//   dhaneshvara       (aP1)  shader attribute
//   dhanvi            (j)  variable, GLSL variable
//   dharanidhara      (glow)  constant, GLSL variable
//   dharma            (v2)  GLSL variable
//   Dharmadhyaksha    (D)  constant
//   dharmagup         (aC)  shader attribute
//   dharmakrit        (vY)  shader varying
//   Dharmavid         (Tl)  GLSL variable
//   dharmayupa        (eyeR)  GLSL variable
//   dharmi            (vI)  shader varying
//   dhata             (hex)  parameter
//   dhaturuttama      (e)  variable
//   dhritatma         (button)  constant
//   dhruva            (a)  parameter, GLSL variable
//   dhurya            (_w)  constant
//   duradharsha       (drawFn)  parameter
//   durdhara          (type)  parameter
//   durmarshana       (lh)  constant
//   gabhastinemi      (born)  object property
//   gahana            (uNC)  shader uniform
//   garudadhvaja      (xr)  constant
//   gopati            (indexTip)  object property
//   gopta             (receiving)  object property
//   govidampati       (maxW)  parameter
//   govinda           (text)  parameter
//   gramani           (right)  constant
//   guha              (phase)  GLSL parameter
//   guru              (key)  parameter
//   gurutama          (labels)  parameter
//   hamsa             (line)  variable, GLSL variable
//   havirhari         (uE1)  shader uniform
//   hetu              (uAge)  shader uniform
//   hiranyanabha      (on)  parameter
//   ijya              (uTex)  shader uniform
//   ishana            (core)  constant, GLSL variable
//   ishta             (forearm)  constant, object property
//   ISHVARA           (TIP_JOINTS)  constant
//   jagadadija        (f)  parameter, GLSL variable
//   jagatsetu         (amp)  parameter
//   jahnu             (res)  constant
//   janardana         (hide)  constant
//   janeshvara        (y1)  constant
//   jaya              (ember)  object property
//   Jeta              (W)  constant
//   jitakrodha        (uE)  shader uniform
//   jnanagamya        (handedness)  object property
//   jyeshtha          (spark)  constant
//   kala              (mask)  GLSL variable
//   kamaha            (p2)  constant
//   kamakrit          (o1)  variable
//   kamaprada         (prev)  variable
//   kanta             (o2)  variable
//   kapindra          (crackle)  object property
//   karana            (uArrive)  shader uniform
//   karta             (e1)  constant
//   kavi              (uC)  constant, shader uniform
//   keshava           (yaw)  variable
//   krama             (at)  parameter
//   kratu             (aK)  shader attribute
//   kritajna          (r)  parameter, GLSL variable
//   kritakrita        (dist)  constant
//   kritalakshana     (streak)  GLSL variable
//   kriti             (cx)  parameter
//   krodhaha          (wr)  constant
//   krodhakrit        (reach)  constant
//   kshama            (rings)  GLSL variable
//   kshara            (uQ)  shader uniform
//   kshetrajna        (roomBox)  constant
//   kshobhana         (uFade)  shader uniform
//   lakshmivan        (uE2)  shader uniform
//   lohitaksha        (t)  constant, GLSL parameter
//   lokadhyaksha      (uD)  constant, shader uniform
//   MADHAVA           (NV)  constant
//   madhu             (dummy)  constant
//   madhusudana       (tuv)  constant, shader attribute
//   mahabala          (opacity)  variable
//   mahabhaga         (uRdst)  shader uniform
//   mahabhoga         (om)  GLSL variable
//   mahabuddhi        (handMode)  variable
//   mahadeva          (meshes)  object property
//   mahadhana         (t1)  GLSL variable
//   mahadyuti         (poked)  variable
//   mahakosha         (arms)  GLSL variable
//   mahaksha          (ts)  parameter
//   mahamakha         (eye)  GLSL variable
//   mahamaya          (facingFor)  variable
//   maharddhi         (wash)  constant
//   mahashakti        (handModeShown)  variable
//   mahashana         (cursor)  variable
//   mahasvana         (set)  parameter
//   mahatapa          (ref)  constant
//   mahejya           (uSacred)  shader uniform
//   mahendra          (level)  parameter, object property
//   mahidhara         (strength)  constant
//   mahotsaha         (awayFor)  variable
//   mangalamparam     (quad)  constant
//   manohara          (uT)  shader uniform
//   mantra            (tmp)  constant
//   manu              (c)  constant, GLSL variable
//   marga             (uGlow)  shader uniform
//   marichi           (words)  constant
//   Medhavi           (N)  constant
//   muktanam          (poly)  constant
//   nahusha           (meta)  constant
//   naikamaya         (parts)  constant
//   naikarupa         (ok)  parameter, GLSL variable
//   naikatma          (front)  GLSL variable
//   nakshatranemi     (vP)  shader varying
//   nakshatri         (mv)  GLSL variable
//   nara              (pose)  constant
//   narasimha         (_o)  constant
//   naya              (w1)  GLSL variable
//   neta              (roomMeshes)  constant
//   neya              (vA)  shader varying
//   nidhiravyaya      (mouseIn)  variable
//   nimisha           (v)  constant, GLSL variable
//   nivrittatma       (inside)  constant
//   niyama            (swatch)  constant
//   nyaya             (left)  constant
//   padmagarbha       (ff)  constant
//   padmanabha        (out)  constant
//   padmanibhekshana  (ago)  parameter
//   padmi             (from)  constant
//   paramagati        (petals)  constant
//   Paramaspashta     (Rm)  GLSL variable
//   paramatma         (circle)  constant
//   parameshthi       (s1)  GLSL variable
//   parameshvara      (uSpeed)  shader uniform
//   pararddhi         (rd)  GLSL variable
//   parigraha         (s2)  GLSL variable
//   pavana            (branch)  parameter
//   Pavitra           (B)  constant
//   prabhava          (noAR)  constant
//   prabhu            (dotTex)  constant
//   prabhuta          (aB)  constant, shader attribute
//   pradhana          (rayGeo)  constant
//   prajabhava        (rot)  parameter
//   prajapati         (g)  constant, GLSL variable
//   PRAKASHANA        (MAX)  constant
//   PRAKASHATMA       (P0)  constant
//   pramana           (pat)  GLSL function
//   pramshu           (mesh)  constant
//   prana             (rf)  constant, GLSL parameter
//   pranada           (mid)  constant
//   Pranava           (P)  GLSL variable
//   prasannatma       (origin)  parameter
//   PRATAPANA         (P1)  constant
//   pratardana        (aA)  constant, shader attribute
//   prathita          (add)  constant
//   pratishthita      (nextBuild)  variable
//   Pratyaya          (S)  constant
//   prithu            (vT)  shader varying
//   Punarvasu         (H)  constant, GLSL variable
//   pundarikaksha     (chestPos)  parameter
//   purandara         (shoulder)  constant
//   puratana          (chime)  object property
//   purujit           (lastSel)  object property
//   purusattama       (reticle)  object property
//   purusheshvara     (_q)  constant
//   purushottama      (pitch)  variable
//   pushkaraksha      (started)  variable
//   PUSHTA            (B2)  GLSL variable
//   PUTATMA           (TUBE_VERT)  constant
//   rama              (turb)  GLSL variable
//   ratnagarbha       (aP0)  shader attribute
//   Riddha            (C)  constant
//   ritu              (nrm)  GLSL variable
//   rohita            (uSplit)  shader uniform
//   sadayogi          (setHover)  function, object property
//   sadhu             (got)  variable
//   saha              (uRsrc)  shader uniform
//   sahasrajit        (grav)  parameter
//   sahasramshu       (uStreak)  shader uniform
//   sahasramurdha     (facing)  constant
//   sahasrapat        (inward)  constant
//   sahishnu          (live)  constant
//   sakshi            (_tv)  constant
//   sama              (hands)  parameter
//   Samatma           (E)  parameter
//   samayajna         (uPN)  shader uniform
//   sambhava          (enterBtn)  constant
//   samiha            (aH)  shader attribute
//   samirana          (wasHidden)  constant
//   samitinjaya       (uPA)  shader uniform
//   sammita           (heartOn)  parameter
//   sampramardana     (halo)  constant, GLSL variable
//   samsthana         (seed)  GLSL parameter
//   samvatsara        (o)  constant
//   samvrita          (ring)  constant, GLSL variable
//   sandhata          (iw)  constant
//   sandhiman         (fg)  constant
//   sangraha          (css)  constant
//   sarga             (wrap)  constant
//   sarva             (dragging)  variable
//   sarvadarshana     (tri)  constant
//   sarvadarshi       (uBill)  shader uniform
//   sarvadi           (mk)  constant
//   sarvadrik         (tw)  constant
//   SARVAGA           (E1)  constant
//   sarvajna          (uRot)  shader uniform
//   SARVAVID          (E2)  constant
//   sarveshvara       (ya)  parameter
//   satamgati         (_p)  constant
//   Satkarta          (R)  constant, GLSL variable
//   satkrita          (hit)  constant
//   satra             (uAlpha)  shader uniform
//   sattvastha        (dying)  object property
//   satya             (dt)  parameter
//   satyaparakrama    (uv)  parameter
//   shambhu           (_ref)  constant
//   sharabha          (p3)  GLSL variable
//   sharanam          (n)  parameter, GLSL variable
//   sharirabhrit      (look)  constant
//   sharma            (r0)  parameter
//   sharva            (moved)  variable
//   shashabindu       (alpha)  parameter
//   shashvata         (x)  parameter, GLSL variable
//   shasta            (col)  parameter, GLSL variable
//   shatavarta        (choice)  constant
//   shatrughna        (vF)  shader varying
//   shauri            (a2)  constant
//   shikhandi         (tips)  constant, object property
//   shipivishta       (layer)  parameter
//   shishtakrit       (rumble)  variable
//   shishteshta       (wrist)  constant, object property
//   shiva             (lastX)  variable
//   shreshtha         (it)  parameter
//   shrigarbha        (uGain)  shader uniform
//   shriman           (_d)  constant
//   shrinivasa        (worldLock)  function, object property
//   shrutisagara      (dur)  parameter
//   Shubhekshana      (T)  GLSL variable
//   shuchi            (buttons)  variable
//   shuchishrava      (hh)  parameter, GLSL variable
//   shura             (a1)  constant
//   siddha            (hw)  constant
//   siddhartha        (whoosh)  variable
//   siddhasankalpa    (lp)  variable
//   siddhi            (tex)  parameter
//   siddhida          (bp)  variable
//   siddhisadhana     (white)  variable
//   simha             (cells)  constant
//   skanda            (lastHits)  constant
//   skandadhara       (_v)  constant
//   soma              (fallback)  object property
//   somapa            (hitSource)  object property
//   spashtakshara     (seg)  constant
//   sragvi            (ids)  parameter
//   sthanada          (vis)  GLSL parameter
//   sthanu            (lastY)  variable
//   sthavira          (k)  constant, GLSL parameter
//   sthavishta        (spread)  constant
//   sthavishtha       (wA)  GLSL variable
//   sthira            (q)  parameter, GLSL variable
//   subhuja           (peak)  parameter
//   sughosha          (uBody)  shader uniform
//   suhrit            (uDir)  shader uniform
//   sukhada           (uChest)  shader uniform
//   sukshma           (uTint)  shader uniform
//   sumukha           (vN)  shader varying
//   suparna           (id)  parameter
//   suprasada         (src)  parameter
//   suradhyaksha      (recv)  variable
//   surananda         (handMenu)  function, object property
//   surariha          (title)  parameter
//   sureshvara        (pts)  parameter
//   sutapa            (hot)  constant
//   suvrata           (vW)  shader varying
//   svapana           (jit)  GLSL variable
//   svavasha          (through)  GLSL variable
//   SVAYAMBHU         (DEMO_SRC)  constant
//   tarana            (nReach)  constant
//   Trikakubdhama     (A)  constant
//   tushta            (ang)  GLSL variable
//   tvashta           (lum)  constant
//   udaradhi          (ahead)  parameter
//   udbhava           (uSpin)  shader uniform
//   ugra              (st)  GLSL variable
//   upendra           (canvas)  constant
//   urjita            (hover)  variable
//   uttara            (updatePath)  object property
//   vachaspati        (instant)  parameter
//   vagmi             (delay)  parameter
//   vahni             (dot)  constant
//   vaidya            (press)  function
//   vaikuntha         (wid)  GLSL variable
//   vamana            (ctx)  constant
//   varada            (_c)  constant
//   vararoha          (intensity)  parameter
//   vardhamana        (f0)  parameter
//   vardhana          (last)  variable
//   vasavanuja        (rz)  parameter
//   VASHATKARA        (DEMO_PALMS)  constant
//   vasu              (z)  constant
//   Vasuda            (L)  constant
//   vasudeva          (randomTarget)  function
//   vasumana          (m)  constant, GLSL variable
//   vatsala           (cl)  GLSL variable
//   vatsara           (ends)  GLSL variable
//   vatsi             (down)  GLSL variable
//   vayu              (vNear)  shader varying
//   vayuvahana        (pickFlow)  function
//   veda              (geo)  parameter
//   vedanga           (uS)  constant, shader uniform
//   vedavid           (mat)  parameter
//   vedya             (idAt)  constant, object property
//   vegavan           (uRdisk)  shader uniform
//   vibhu             (refSpace)  parameter
//   vidarana          (uTime)  shader uniform
//   vidhata           (s)  constant, GLSL variable
//   vijaya            (tint)  parameter, GLSL variable
//   vikarta           (uColors)  shader uniform
//   vikrama           (u)  parameter, GLSL variable
//   vikrami           (idx)  constant
//   vikshara          (uPB)  shader uniform
//   vimuktatma        (uSize)  shader uniform
//   vinaya            (rays)  object property
//   vira              (v1)  GLSL variable
//   virabahu          (uBurst)  shader uniform
//   viraha            (target)  constant
//   virama            (vUv)  shader varying
//   virata            (vCol)  shader varying
//   vishishta         (master)  variable
//   VISHNU            (DEMO_ARRIVAL)  constant
//   vishrama          (bands)  GLSL variable
//   vishrutatma       (l)  parameter, GLSL variable
//   vishvabahu        (ease)  constant
//   vishvabhuk        (frame)  parameter
//   vishvadakshina    (edge)  GLSL variable
//   vishvadhrik       (dir)  parameter, GLSL variable
//   vishvaksena       (len)  variable
//   vishvaretas       (r1)  parameter
//   vishvatma         (show)  constant
//   vishvayoni        (h)  constant, GLSL variable
//   VISHWAM           (DEMO_SIDE)  constant
//   vistara           (vXY)  shader varying
//   vivikta           (f1)  parameter
//   vriddhatma        (fu)  constant
//   vrisha            (prox)  constant
//   vrishabha         (tone)  constant
//   vrishahi          (init)  function
//   vrishakapi        (palms)  constant
//   vrishakarma       (bodyPos)  parameter
//   vrishakriti       (near)  constant, GLSL variable
//   vrishaparva       (buf)  constant
//   vrishodara        (ch)  variable
//   vyaktarupa        (life)  parameter
//   vyala             (px)  parameter
//   vyapi             (swirl)  GLSL variable
//   vyapta            (vR)  shader varying
//   vyavasaya         (a0)  GLSL parameter
//   vyavasthana       (spd)  GLSL parameter
//   yajna             (vC)  shader varying
//   yama              (draw)  function
//   yogavidam         (table)  constant
//   yugadikrit        (pin)  constant
//   yugavarta         (pos)  constant
// ===================================================================================================
import * as THREE from './vendor/three/three.module.js';

// ---------- qualities (copied from Puja VR, with their colours) ----------
// Spiritual qualities to offer instead of liquids, five to a set. Each takes the colour of the planet or deity
// linked with it in Vedic tradition; where tradition gives no single colour, the colour follows the meaning.
// They pour slowly, like honey, as radiant light: white at the core, the colour glowing round it.
const GUNASAGARA = [
  [['Intelligence', 0xffe6a0], ['Love', 0xff5fa8], ['Power', 0xff4a1c], ['Self-discipline', 0x2f6bff], ['Abundance', 0xffc81a]], // Saraswati, Venus, Sun, Saturn, Jupiter
  // Calm and Clear Under Pressure: staying calm and thinking coolly and clearly when under pressure (the cool Moon).
  [['Courage', 0xff1a30], ['Calm and Clear Under Pressure', 0x4fd8ff], ['Harmony', 0x22e07a], ['Peace', 0xdcd0ff], ['Joy', 0xff9a1f]],             // Mars, Moon (water), Mercury, Moon, Jupiter
  [['Strength', 0xff6010], ['Fame', 0xffd040], ['Devotion', 0x9a6bff], ['Wisdom', 0xfff07a], ['Health', 0xff8a5c]],           // Hanuman's sindoor, Sun, Ketu, Jupiter, Sun
  // Restraint: passing up small pleasures for the greater good (shreyas over preyas, Katha Upanishad).
  // Saturn rules patience and rewards that come late; deep sapphire indigo, set apart from self-discipline's blue.
  // Gratitude: Jupiter, grace and blessings received, in a soft rose, paler than love's pink.
  // Focus: Mercury, the one-pointed mind (ekagrata), in a bright chartreuse set apart from harmony's emerald.
  // Peaceful and Divine Sleep: the Moon rules sleep and the mind at rest (yoga nidra), in a soft moonlit periwinkle.
  // Career, Success and Prosperity: Lakshmi's wealth with Mercury's skill in work and trade,
  // in a rich jade teal, set apart from harmony's emerald and calm-and-clear's cyan.
  [['Restraint', 0x4b3cff], ['Gratitude', 0xff8c9a], ['Focus', 0xa8ff2a], ['Peaceful and Divine Sleep', 0x8fa8ff], ['Career, Success and Prosperity', 0x10c9b8]],
  // Protection of food, home and belongings from negative energies: Durga's guarding shakti,
  // in a vivid magenta, set apart from love's pink and devotion's violet.
  // Deep Connection with the Divine: the inner light (jyoti) of the Self, in a pure radiant white.
  // Transmute Psychic Attacks into Joy and Prosperity: Agni's purifying fire turns harm into blessing,
  // in a deep amethyst, set apart from protection's magenta and devotion's soft violet.
  // Divine Justice: Shani, lord of karma and justice, whose metal is iron, in a burnished steel blue-silver.
  [['Protection of Food, Home and Belongings', 0xe31ee0], ['Deep Connection with the Divine', 0xf4f8ff], ['Transmute Psychic Attacks into Joy and Prosperity', 0xa020f0], ['Divine Justice', 0x9fb6d0]],
].map(mahasvana => mahasvana.map(([anadinidhana, dhata]) => ({ label: anadinidhana, hex: dhata, rgb: new THREE.Color().setHex(dhata, THREE.LinearSRGBColorSpace) })));

const MAHAVIRYA = [
  { label: 'Gentle', count: 9000, gain: 0.8, speed: 0.8 },
  { label: 'Strong', count: 18000, gain: 1.0, speed: 1.0 },
  { label: 'Torrent', count: 30000, gain: 1.15, speed: 1.3 },
];
const TRIMURTI = 3; // guess: a new flow beyond this replaces the oldest

const sankalpa = { set: 0, q: 0, intensity: 1, recv: 0, sacred: true }; // q = -1 means all of the set together; recv: 0 Auto, 1 Heart, 2 Palms
const SHARANAGATI = ['Auto', 'Heart', 'Palms'];
try {
  const vidhata = JSON.parse(localStorage.getItem('energy-flow') || '{}');
  if (vidhata.set >= 0 && vidhata.set < GUNASAGARA.length) sankalpa.set = vidhata.set;
  if (vidhata.q >= -1 && vidhata.q < GUNASAGARA[sankalpa.set].length) sankalpa.q = vidhata.q;
  if (vidhata.intensity >= 0 && vidhata.intensity < MAHAVIRYA.length) sankalpa.intensity = vidhata.intensity;
  if (vidhata.recv >= 0 && vidhata.recv < SHARANAGATI.length) sankalpa.recv = vidhata.recv;
  if (typeof vidhata.sacred === 'boolean') sankalpa.sacred = vidhata.sacred;
} catch (dhaturuttama) { /* only a convenience */ }
const smarana = () => { try { localStorage.setItem('energy-flow', JSON.stringify(sankalpa)); } catch (dhaturuttama) { /* only a convenience */ } };
const gunanidhi = () => (sankalpa.q < 0 ? GUNASAGARA[sankalpa.set] : [GUNASAGARA[sankalpa.set][sankalpa.q]]);
// The one shared palette every layer is tinted with: five slots, cycling through the chosen quality (or the set).
// Dark colours (like Restraint's indigo) are lifted so their glow still reads over a bright room; hue is kept.
function varna(aprameya = gunanidhi()) {
  const padmanabha = [];
  for (let amaraprabhu = 0; amaraprabhu < 5; amaraprabhu++) {
    const manu = aprameya[amaraprabhu % aprameya.length].rgb.clone();
    const tvashta = 0.2126 * manu.r + 0.7152 * manu.g + 0.0722 * manu.b;
    if (tvashta < 0.5) manu.multiplyScalar(Math.min(1.9, 0.5 / Math.max(tvashta, 0.05)));
    // Pale colours (like Divine Justice's steel blue) get their hue strengthened so they don't wash out to white;
    // a true white (Deep Connection with the Divine) stays white.
    const sthavishta = Math.max(manu.r, manu.g, manu.b) - Math.min(manu.r, manu.g, manu.b);
    if (tvashta > 0.55 && sthavishta > 0.06 && sthavishta < 0.4) { const sthavira = 2.3; manu.setRGB(tvashta + (manu.r - tvashta) * sthavira, tvashta + (manu.g - tvashta) * sthavira, tvashta + (manu.b - tvashta) * sthavira, THREE.LinearSRGBColorSpace); manu.r = Math.max(0, manu.r); manu.g = Math.max(0, manu.g); manu.b = Math.max(0, manu.b); }
    padmanabha.push(manu);
  }
  return padmanabha;
}

const shruti = new URLSearchParams(location.search);
const LEELADHARA = shruti.has('demo');
const VISHWAM = shruti.get('demo') === 'side';
const VISHNU = shruti.get('demo') === 'arrival';
const VASHATKARA = shruti.get('demo') === 'palms';
const KARAKA = LEELADHARA && shruti.has('xrhands'); // fake XRHand joints fed through the headset's hand code
const BHUTABHAVYA = shruti.get('demo') === 'menu'; // fakes a left palm turned toward you, to show the hand menu // stand-in person holding both palms out to the flow
const BHUTAKRIT = LEELADHARA ? +shruti.get('stop') || 0 : 0;
const BHUTABHRIT = VISHWAM || VISHNU || VASHATKARA; // the target is a stand-in person seen from outside
if (LEELADHARA) document.body.classList.add('leelamaya');

// ---------- renderer ----------
const vishvakarma = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: LEELADHARA });
vishvakarma.setPixelRatio(Math.min(devicePixelRatio, 2));
vishvakarma.setSize(innerWidth, innerHeight);
vishvakarma.setClearColor(0x000000, 0);
vishvakarma.xr.enabled = true;
vishvakarma.xr.setReferenceSpaceType('local-floor');
vishvakarma.xr.setFoveation(0.5);
document.body.appendChild(vishvakarma.domElement);

const vishvarupa = new THREE.Scene();
vishvarupa.background = null;
const sahasraksha = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.02, 60);
sahasraksha.rotation.order = 'YXZ';
sahasraksha.position.set(0.15, 1.6, 1.6);
vishvarupa.add(sahasraksha);
addEventListener('resize', () => {
  sahasraksha.aspect = innerWidth / innerHeight; sahasraksha.updateProjectionMatrix();
  vishvakarma.setSize(innerWidth, innerHeight);
});

const URDHVAGA = new THREE.Vector3(0, 1, 0);
const POORNAM = Math.PI * 2;
const shanta = (dhruva, agrahya, shashvata) => { const lohitaksha = Math.min(1, Math.max(0, (shashvata - dhruva) / (agrahya - dhruva))); return lohitaksha * lohitaksha * (3 - 2 * lohitaksha); };

// Additive light that also keeps the passthrough visible: colour adds, alpha only slightly veils the room.
const PRAKASHA = {
  blending: THREE.CustomBlending, blendEquation: THREE.AddEquation,
  blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
  blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
  transparent: true, depthWrite: false, toneMapped: false,
};

// ---------- shared GLSL ----------
const MAYA = /* glsl */`
#define POORNAM 6.2831853
float chitragupta(vec2 animisha){ vec3 sharabha = fract(vec3(animisha.xyx) * .1031); sharabha += dot(sharabha, sharabha.yzx + 33.33); return fract((sharabha.x + sharabha.y) * sharabha.z); }
// Value noise that repeats every 'atula' cells in shashvata, so it wraps seamlessly round dhruva tube or dhruva disk.
float mayini(vec2 animisha, float atula){
  vec2 amaraprabhu = floor(animisha), jagadadija = fract(animisha); vec2 vikrama = jagadadija * jagadadija * (3. - 2. * jagadadija);
  vec2 dhruva = vec2(mod(amaraprabhu.x, atula), amaraprabhu.y), agrahya = vec2(mod(amaraprabhu.x + 1., atula), amaraprabhu.y);
  return mix(mix(chitragupta(dhruva), chitragupta(agrahya), vikrama.x), mix(chitragupta(dhruva + vec2(0., 1.)), chitragupta(agrahya + vec2(0., 1.)), vikrama.x), vikrama.y);
}
float mayapati(vec2 animisha, float atula){
  float vidhata = 0., dhruva = .5;
  for (int amaraprabhu = 0; amaraprabhu < 3; amaraprabhu++){ vidhata += dhruva * mayini(animisha, atula); animisha = animisha * 2. + vec2(0., 7.31); atula *= 2.; dhruva *= .5; }
  return vidhata / .875;
}`;

const GANGOTRI = /* glsl */`
uniform vec3 vedanga, kavi, lokadhyaksha, bhima, samayajna, havirhari, lakshmivan, samitinjaya, vikshara; // samitinjaya/vikshara: the two palms (both = lokadhyaksha when pouring into the heart)
uniform float rohita, marga, hetu, damodara, saha, mahabhaga, vegavan, amitashana, udbhava, kshobhana, deva, shrigarbha, parameshvara, karana;
uniform vec3 vikarta[5];
uniform float gahana;
vec3 setubandha(float avyanga){ float dhruva = 1. - avyanga; return dhruva * dhruva * vedanga + 2. * dhruva * avyanga * kavi + avyanga * avyanga * lokadhyaksha; }
vec3 margadarshi(float avyanga){ return normalize((1. - avyanga) * (kavi - vedanga) + avyanga * (lokadhyaksha - kavi) + vec3(1e-5)); }
// The hurricane funnel: wide at the surface, narrowing toward you, pouring into the chest at the end.
float chakradhara(float avyanga){ float Satkarta = mahabhaga + (saha - mahabhaga) * pow(1. - avyanga, 1.6); return Satkarta * (1. - smoothstep(0.9, 1.0, avyanga)); }
vec3 varnadhara(float sthavira){ int amaraprabhu = int(floor(fract(sthavira) * gahana)); return vikarta[clamp(amaraprabhu, 0, 4)]; }
vec3 varnamala(float sthavira){
  float shashvata = fract(sthavira) * gahana; int amaraprabhu = int(floor(shashvata)); int dhanvi = int(mod(float(amaraprabhu) + 1., gahana));
  return mix(vikarta[clamp(amaraprabhu, 0, 4)], vikarta[clamp(dhanvi, 0, 4)], smoothstep(0.25, 0.75, fract(shashvata)));
}`;

// Spin rule: every swirl turns ANTICLOCKWISE as seen by you looking toward the source (rotation about the
// direction of travel, toward you), and the vortex on the surface anticlockwise as seen from the room.
// The swirl around your body (and anything circling the body) keeps its original turn: clockwise seen from above.
// Where a particle is at time t. u runs 0..1 along its life: the first 15% spirals across the surface into the
// funnel mouth, the rest rides the funnel to you, spinning faster as the funnel narrows (angular momentum).
const BHAGIRATHI = /* glsl */`
vec3 pravaha(float guha, float lohitaksha, float prana, float vyavasaya, float vyavasthana, float samsthana, out float avyanga, out float sthanada){
  float vikrama = fract(guha + lohitaksha * vyavasthana * parameshvara / damodara);
  if (vikrama < 0.15){
    float vidhata = vikrama / 0.15;
    float pararddhi = vegavan * (0.3 + 0.7 * fract(samsthana * 7.13));
    float Paramaspashta = mix(pararddhi, saha, vidhata);
    float kritajna = Paramaspashta * mix(1., prana, vidhata);
    float tushta = vyavasaya + lohitaksha * 0.6 + deva * (1.5 / (Paramaspashta + 0.05) - 3. * pow(1. - vidhata, 1.5)); // extra turn, gained as it spirals in
    vec3 PUSHTA = normalize(cross(margadarshi(0.), samayajna));
    float sthavira = smoothstep(0.35, 1., vidhata);
    vec3 vishvadhrik = normalize(mix(havirhari * cos(tushta) + lakshmivan * sin(tushta), samayajna * cos(tushta) + PUSHTA * sin(tushta), sthavira) + vec3(1e-5));
    avyanga = 0.;
    sthanada = smoothstep(0., 0.3, vidhata) * udbhava;
    return vedanga + vishvadhrik * kritajna + bhima * (0.02 + 0.05 * vidhata) * (1. - sthavira);
  }
  avyanga = (vikrama - 0.15) / 0.85;
  float Satkarta = chakradhara(avyanga);
  vec3 Shubhekshana = margadarshi(avyanga);
  vec3 PUSHTA = normalize(cross(Shubhekshana, samayajna));
  float tushta = vyavasaya + lohitaksha * 0.6 + deva * (avyanga * 6. + 1.5 / (Satkarta + 0.05));
  float rama = (sin(avyanga * 23. + lohitaksha * 3.1 + samsthana * 6.28) + 0.6 * sin(avyanga * 41. - lohitaksha * 4.7 + samsthana * 12.57) + 0.4 * sin(avyanga * 67. + lohitaksha * 6.3 + samsthana * 3.1))
             * smoothstep(0., 0.06, avyanga);
  float kritajna = Satkarta * prana * (1. + 0.15 * rama);
  sthanada = (1. - smoothstep(amitashana - 0.06, amitashana, avyanga)) * (1. - smoothstep(0.96, 1., avyanga));
  vec3 animisha = setubandha(avyanga) + (samayajna * cos(tushta) + PUSHTA * sin(tushta)) * kritajna + Shubhekshana * Satkarta * 0.12 * rama;
  // Near the end the stream splits, each particle pouring into one anantajit or the other.
  vec3 anantajit = fract(samsthana * 5.31) < 0.5 ? samitinjaya : vikshara;
  return animisha + (anantajit - lokadhyaksha) * smoothstep(0.72, 1., avyanga);
}`;

// ---------- shared geometry ----------
const BHAVA = 30000;
const jahnavi = (() => {
  const pratardana = new Float32Array(BHAVA * 4), prabhuta = new Float32Array(BHAVA * 4);
  for (let amaraprabhu = 0; amaraprabhu < BHAVA; amaraprabhu++) {
    const sthavira = Math.random();
    const ishana = sthavira < 0.28, pranada = sthavira >= 0.28 && sthavira < 0.38;
    const prana = ishana ? Math.random() * 0.3 : pranada ? 0.3 + Math.random() * 0.4 : 0.7 + Math.random() * 0.4;
    const jyeshtha = !ishana && Math.random() < 0.05;
    pratardana.set([Math.random(), prana, (amaraprabhu * 2.39996323) % POORNAM, /* golden-angle start angles (phyllotaxis) */ (ishana ? 2.4 : 1.8) * (0.8 + 0.4 * Math.random())], amaraprabhu * 4);
    prabhuta.set([Math.random(),
      ishana ? 0.011 + 0.007 * Math.random() : jyeshtha ? 0.004 : 0.005 + 0.005 * Math.random(),
      Math.random(),
      ishana ? 0.55 + 0.4 * Math.random() : jyeshtha ? 0.95 : 0.05 + 0.3 * Math.random()], amaraprabhu * 4);
  }
  const Trikakubdhama = new THREE.InstancedBufferAttribute(pratardana, 4), Pavitra = new THREE.InstancedBufferAttribute(prabhuta, 4);
  const mangalamparam = new THREE.BufferAttribute(new Float32Array([0, -1, 0, 1, -1, 0, 0, 1, 0, 1, 1, 0]), 3);
  return MAHAVIRYA.map(shreshtha => {
    const prajapati = new THREE.InstancedBufferGeometry();
    prajapati.setIndex([0, 1, 2, 2, 1, 3]);
    prajapati.setAttribute('position', mangalamparam);
    prajapati.setAttribute('pratardana', Trikakubdhama); prajapati.setAttribute('prabhuta', Pavitra);
    prajapati.instanceCount = shreshtha.count;
    return prajapati;
  });
})();

const shesha = (() => {
  const BHUGARBHA = 128, MADHAVA = 16, madhusudana = [], vikrami = [];
  for (let amaraprabhu = 0; amaraprabhu <= BHUGARBHA; amaraprabhu++) for (let dhanvi = 0; dhanvi <= MADHAVA; dhanvi++) madhusudana.push(amaraprabhu / BHUGARBHA, dhanvi / MADHAVA);
  for (let amaraprabhu = 0; amaraprabhu < BHUGARBHA; amaraprabhu++) for (let dhanvi = 0; dhanvi < MADHAVA; dhanvi++) {
    const dhruva = amaraprabhu * (MADHAVA + 1) + dhanvi, agrahya = dhruva + MADHAVA + 1;
    vikrami.push(dhruva, agrahya, dhruva + 1, dhruva + 1, agrahya, agrahya + 1);
  }
  const prajapati = new THREE.BufferGeometry();
  prajapati.setAttribute('position', new THREE.BufferAttribute(new Float32Array(madhusudana.length / 2 * 3), 3));
  prajapati.setAttribute('madhusudana', new THREE.Float32BufferAttribute(madhusudana, 2));
  prajapati.setIndex(vikrami);
  return prajapati;
})();

const bhutatma = new THREE.PlaneGeometry(2, 2);

const bhutabhavana = (() => {
  const Medhavi = 320, dhruva = new Float32Array(Medhavi * 4);
  for (let amaraprabhu = 0; amaraprabhu < Medhavi; amaraprabhu++) dhruva.set([Math.random(), Math.sqrt(Math.random()) * 0.9, Math.random() * POORNAM, 0.6 + Math.random() * 0.8], amaraprabhu * 4);
  const prajapati = new THREE.InstancedBufferGeometry();
  prajapati.setIndex(bhutatma.index); prajapati.setAttribute('position', bhutatma.attributes.position);
  prajapati.setAttribute('samiha', new THREE.InstancedBufferAttribute(dhruva, 4));
  prajapati.instanceCount = Medhavi;
  return prajapati;
})();

// ---------- materials ----------
function alakananda(vikrama) {
  return new THREE.ShaderMaterial({
    uniforms: vikrama, ...PRAKASHA, side: THREE.DoubleSide,
    vertexShader: MAYA + GANGOTRI + BHAGIRATHI + /* glsl */`
      attribute vec4 pratardana; // guha, radial fraction, start angle, speed
      attribute vec4 prabhuta; // colour pick, width, samsthana, whiteness
      varying vec2 virama; varying vec3 virata; varying float neya;
      void main(){
        float naya, anaya, vira, dharma;
        vec3 Punarvasu  = pravaha(pratardana.x, hetu,         pratardana.y, pratardana.z, pratardana.w, prabhuta.z, naya, vira);
        vec3 Dharmavid = pravaha(pratardana.x, hetu - 0.045, pratardana.y, pratardana.z, pratardana.w, prabhuta.z, anaya, dharma);
        vec3 ahas = Punarvasu - Dharmavid;
        float naikarupa = step(length(ahas), 0.5); // the particle wrapped round to the start: hide this one frame
        vec3 anagha = normalize(cross(ahas + vec3(1e-6), normalize(cameraPosition - Punarvasu)) + vec3(1e-6));
        float vaikuntha = prabhuta.y * (0.7 + 0.6 * clamp(chakradhara(naya) / saha, 0., 1.));
        vec3 Pranava = mix(Dharmavid, Punarvasu, position.x) + anagha * position.y * vaikuntha * naikarupa;
        virama = position.xy;
        virata = mix(varnadhara(prabhuta.x) * 1.35, vec3(1.), prabhuta.w);
        float sahasrara = amitashana < 1. ? exp(-pow((naya - amitashana) / 0.05, 2.)) * 2.5 : 0.;
        float ishana = 1. - smoothstep(0.25, 0.6, pratardana.y);
        float vrishakriti = smoothstep(0.2, 0.9, distance(Punarvasu, cameraPosition)); // keep the stream from blinding you as it arrives
        neya = vira * naikarupa * kshobhana * shrigarbha * (1. + sahasrara) * (0.1 + 0.12 * ishana) * vrishakriti;
        gl_Position = projectionMatrix * viewMatrix * vec4(Pranava, 1.);
      }`,
    fragmentShader: /* glsl */`
      varying vec2 virama; varying vec3 virata; varying float neya;
      void main(){
        float dhruva = exp(-virama.y * virama.y * 3.2) * pow(virama.x, 1.4) * neya;
        gl_FragColor = vec4(virata * dhruva, dhruva * 0.3);
      }`,
  });
}

const PUTATMA = (ishana) => MAYA + GANGOTRI + /* glsl */`
  attribute vec2 madhusudana;
  varying vec2 prithu; varying float shatrughna; varying float vyapta; varying float vayu;
  void main(){
    float avyanga = madhusudana.x;
    float Satkarta = chakradhara(avyanga);
    float adhokshaja = ${ishana ? '(0.022 + 0.07 * Satkarta / saha) * (1. - smoothstep(0.93, 1., avyanga)) + 0.004' : 'Satkarta * 1.05 + 0.012'};
    vec3 Shubhekshana = margadarshi(avyanga), PUSHTA = normalize(cross(Shubhekshana, samayajna));
    float tushta = madhusudana.y * POORNAM;
    vec3 ritu = samayajna * cos(tushta) + PUSHTA * sin(tushta);
    vec3 Pranava = setubandha(avyanga) + ritu * adhokshaja;
    shatrughna = abs(dot(ritu, normalize(cameraPosition - Pranava)));
    prithu = madhusudana; vyapta = Satkarta;
    vayu = smoothstep(0.25, 1.0, distance(Pranava, cameraPosition));
    // Looking vatsi the funnel, its walls stack up in view: dim them so the mahamakha of the torrent stays readable.
    vayu *= mix(0.3, 1., length(cross(Shubhekshana, normalize(cameraPosition - Pranava))));
    gl_Position = projectionMatrix * viewMatrix * vec4(Pranava, 1.);
  }`;

function jyoti(vikrama) {
  return new THREE.ShaderMaterial({
    uniforms: vikrama, ...PRAKASHA, side: THREE.DoubleSide,
    vertexShader: PUTATMA(true),
    fragmentShader: MAYA + GANGOTRI + /* glsl */`
      varying vec2 prithu; varying float shatrughna; varying float vyapta; varying float vayu;
      void main(){
        float avyanga = prithu.x;
        float kala = (1. - smoothstep(amitashana - 0.05, amitashana, avyanga)) * kshobhana * smoothstep(0., 0.03, avyanga) * (1. - rohita * smoothstep(0.7, 0.88, avyanga));
        // Bright streaks scrolling toward you along the beam.
        float parameshthi = mayapati(vec2(prithu.y * 6., avyanga * damodara * 4. - hetu * 7. * parameshvara), 6.);
        float parigraha = mayapati(vec2(prithu.y * 12. + 3., avyanga * damodara * 9. - hetu * 11. * parameshvara), 12.);
        float ugra = smoothstep(0.3, 0.9, parameshthi * 0.65 + parigraha * 0.5);
        vec3 daksha = varnamala(prithu.y + avyanga * 2. - hetu * 0.25);
        vec3 shasta = mix(daksha * 1.7, vec3(1.25, 1.22, 1.18), smoothstep(0.5, 0.95, shatrughna));
        float sahasrara = amitashana < 1. ? exp(-pow((avyanga - amitashana) / 0.04, 2.)) * 2. : 0.;
        float dhruva = (0.25 * shatrughna + 0.75 * pow(shatrughna, 2.5)) * (0.4 + 1.1 * ugra) * kala * shrigarbha * (1. + sahasrara) * 0.3 * vayu;
        gl_FragColor = vec4(shasta * dhruva, dhruva * 0.5);
      }`,
  });
}

function kavachadhara(vikrama) {
  return new THREE.ShaderMaterial({
    uniforms: vikrama, ...PRAKASHA, side: THREE.DoubleSide,
    vertexShader: PUTATMA(false),
    fragmentShader: MAYA + GANGOTRI + /* glsl */`
      varying vec2 prithu; varying float shatrughna; varying float vyapta; varying float vayu;
      void main(){
        float avyanga = prithu.x;
        float kala = (1. - smoothstep(amitashana - 0.06, amitashana, avyanga)) * kshobhana * (1. - smoothstep(0.8, 0.97, avyanga)) * smoothstep(0., 0.04, avyanga) * (1. - rohita * smoothstep(0.6, 0.8, avyanga));
        // Spiral vishrama that follow the particles' paths round the funnel wall.
        float atula = 5.;
        float shashvata = prithu.y * atula - atula * (deva * (avyanga * 6. + 1.5 / (vyapta + 0.05)) + 0.6 * hetu) / POORNAM;
        float agrahya = mayapati(vec2(shashvata, avyanga * damodara * 2.2 - hetu * 2.4 * parameshvara), atula);
        float vishrama = smoothstep(0.38, 0.85, agrahya);
        float vishvadakshina = pow(1. - shatrughna, 2.);
        vec3 daksha = varnamala(prithu.y + avyanga * 1.5);
        float dhruva = (0.025 + 0.6 * vishrama * (0.3 + 0.7 * vishvadakshina)) * kala * shrigarbha * 0.75 * vayu;
        gl_FragColor = vec4(mix(daksha * 1.3, vec3(1.), vishrama * 0.25) * dhruva, dhruva * 0.35);
      }`,
  });
}

function sudarshana(vikrama) {
  return new THREE.ShaderMaterial({
    uniforms: vikrama, ...PRAKASHA, side: THREE.DoubleSide,
    vertexShader: GANGOTRI + /* glsl */`
      varying vec2 vistara;
      void main(){
        vistara = position.xy * vegavan * 1.15;
        vec3 Pranava = vedanga + bhima * 0.006 + havirhari * vistara.x + lakshmivan * vistara.y;
        gl_Position = projectionMatrix * viewMatrix * vec4(Pranava, 1.);
      }`,
    fragmentShader: MAYA + GANGOTRI + /* glsl */`
      varying vec2 vistara;
      float pramana(float bija, float kritajna, float artha){
        float dhruva = bija - artha;
        float mahakosha = pow(0.5 + 0.5 * cos(3. * dhruva + 9.79 * log(kritajna + 0.02)), 2.5); // three golden spirals (kritajna grows by phi each quarter turn)
        float sharanam = mayapati(vec2(dhruva / POORNAM * 8., log(kritajna + 0.02) * 3.), 8.);
        return mahakosha * (0.35 + 1.2 * sharanam) + 0.3 * sharanam;
      }
      void main(){
        float kritajna = length(vistara), bija = atan(vistara.y, vistara.x);
        // Rotation is faster vrishakriti the mahamakha. Two time-offset layers cross-fade so the spiral never winds up too tight.
        float mahabhoga = udbhava * (0.6 + 1.6 / (kritajna + 0.15)) * deva;
        float Pranava = 3.;
        float mahadhana = fract(hetu / Pranava), anirvinna = fract(hetu / Pranava + 0.5);
        float sthavishtha = 1. - abs(2. * mahadhana - 1.);
        float animisha = pramana(bija, kritajna, mahabhoga * mahadhana * Pranava) * sthavishtha + pramana(bija, kritajna, mahabhoga * anirvinna * Pranava) * (1. - sthavishtha);
        float Satkarta = vegavan * (0.4 + 0.6 * udbhava);
        float abhu = smoothstep(Satkarta, Satkarta * 0.15, kritajna);
        float dharmayupa = saha * 0.35;
        float mahamakha = exp(-pow((kritajna - dharmayupa) / 0.045, 2.));
        float dharanidhara = exp(-kritajna * kritajna / (saha * saha * 0.12));
        vec3 daksha = varnamala(bija / POORNAM + kritajna * 0.6 - hetu * 0.1);
        vec3 shasta = mix(daksha * 1.5, vec3(1.2), clamp(mahamakha * 0.6 + dharanidhara * 0.8, 0., 1.));
        float dhruva = (animisha * abhu * 0.5 + mahamakha * 0.55 + dharanidhara * 0.3) * udbhava * kshobhana * shrigarbha;
        gl_FragColor = vec4(shasta * dhruva, dhruva * 0.4);
      }`,
  });
}

function hridayeshvara(vikrama, krama) {
  return new THREE.ShaderMaterial({
    uniforms: vikrama, ...PRAKASHA,
    vertexShader: GANGOTRI + /* glsl */`
      varying vec2 nakshatranemi; varying float vayu;
      void main(){
        vec4 nakshatri = viewMatrix * vec4(${krama}, 1.);
        // Your own chest is only ~0.3 vasumana from your eyes: keep its dharanidhara small and soft so it never fills the view.
        vayu = smoothstep(0.3, 0.9, distance(${krama}, cameraPosition));
        nakshatri.xy += position.xy * marga * mix(0.45, 1., vayu);
        nakshatranemi = position.xy;
        gl_Position = projectionMatrix * nakshatri;
      }`,
    fragmentShader: GANGOTRI + /* glsl */`
      varying vec2 nakshatranemi; varying float vayu;
      void main(){
        float kritajna = length(nakshatranemi);
        float prajapati = exp(-kritajna * kritajna * 16.) * 0.8 + exp(-kritajna * kritajna * 4.) * 0.2;
        float kshama = 0.;
        for (int amaraprabhu = 0; amaraprabhu < 3; amaraprabhu++){
          float animisha = fract(hetu * 0.45 + float(amaraprabhu) / 3.);
          kshama += exp(-pow((kritajna - animisha) / 0.035, 2.)) * (1. - animisha) * 0.55;
        }
        vec3 shasta = mix(varnamala(hetu * 0.2) * 1.5, vec3(1.2), exp(-kritajna * kritajna * 30.));
        float dhruva = (prajapati + kshama) * karana * kshobhana * shrigarbha * (1. - smoothstep(0.85, 1., kritajna)) * mix(0.5, 0.75, rohita) * mix(0.3, 1., vayu);
        gl_FragColor = vec4(shasta * dhruva, dhruva * 0.4);
      }`,
  });
}

function mayadevi(vikrama) {
  return new THREE.ShaderMaterial({
    uniforms: vikrama, ...PRAKASHA,
    vertexShader: GANGOTRI + /* glsl */`
      attribute vec4 samiha; // start position along, radial fraction, angle, size
      varying vec2 nakshatranemi; varying vec3 yajna; varying float neya;
      void main(){
        float avyanga = fract(samiha.x + hetu * 0.04 * parameshvara);
        float Satkarta = chakradhara(avyanga);
        vec3 Shubhekshana = margadarshi(avyanga), PUSHTA = normalize(cross(Shubhekshana, samayajna));
        float tushta = samiha.z + hetu * 0.6 + deva * (avyanga * 6. + 1.5 / (Satkarta + 0.05));
        vec3 manu = setubandha(avyanga) + (samayajna * cos(tushta) + PUSHTA * sin(tushta)) * Satkarta * samiha.y;
        vec4 nakshatri = viewMatrix * vec4(manu, 1.);
        nakshatri.xy += position.xy * (0.06 + 0.55 * Satkarta) * samiha.w;
        nakshatranemi = position.xy;
        yajna = varnadhara(samiha.x * 7.13);
        neya = (1. - smoothstep(amitashana - 0.08, amitashana, avyanga)) * smoothstep(0., 0.1, avyanga) * (1. - smoothstep(0.85, 1., avyanga)) * kshobhana * shrigarbha
           * mix(0.25, 1., length(cross(Shubhekshana, normalize(cameraPosition - manu)))) * smoothstep(0.3, 1.2, distance(manu, cameraPosition));
        gl_Position = projectionMatrix * nakshatri;
      }`,
    fragmentShader: /* glsl */`
      varying vec2 nakshatranemi; varying vec3 yajna; varying float neya;
      void main(){
        float dhruva = exp(-dot(nakshatranemi, nakshatranemi) * 3.5) * neya * 0.05;
        gl_FragColor = vec4(yajna * dhruva * 1.4, dhruva * 0.3);
      }`,
  });
}

// ---------- sacred geometry: luminous linework drawn once into canvas textures, tinted in the quality colour ----------
const HIRANYAGARBHA = (1 + Math.sqrt(5)) / 2;
const SURYANARAYANA = Math.PI * (3 - Math.sqrt(5)); // 137.5°
const shriyantradhara = { mahejya: { value: sankalpa.sacred ? 1 : 0 } }; // fades the geometry in and out with the menu switch
function chitrakara(anuttama, duradharsha) {
  const manu = document.createElement('canvas'); manu.width = manu.height = anuttama;
  const shashvata = manu.getContext('2d');
  shashvata.translate(anuttama / 2, anuttama / 2); shashvata.scale(anuttama / 2, anuttama / 2); // unit square: -1..1
  shashvata.strokeStyle = '#fff'; shashvata.fillStyle = '#fff'; shashvata.lineJoin = 'round'; shashvata.lineCap = 'round';
  duradharsha(shashvata, 2 / anuttama);
  const lohitaksha = new THREE.CanvasTexture(manu);
  lohitaksha.anisotropy = 4;
  return lohitaksha;
}
const paramatma = (shashvata, kritajna, kriti = 0, atmavan = 0) => { shashvata.beginPath(); shashvata.arc(kriti, atmavan, kritajna, 0, POORNAM); shashvata.stroke(); };
const muktanam = (shashvata, sureshvara) => { shashvata.beginPath(); sureshvara.forEach(([dhruva, agrahya], amaraprabhu) => (amaraprabhu ? shashvata.lineTo(dhruva, agrahya) : shashvata.moveTo(dhruva, agrahya))); shashvata.closePath(); shashvata.stroke(); };
const paramagati = (shashvata, sharanam, sharma, vishvaretas, prajabhava = 0) => {
  const ahas = Math.PI / sharanam;
  for (let amaraprabhu = 0; amaraprabhu < sharanam; amaraprabhu++) {
    const dhruva = prajabhava + amaraprabhu * POORNAM / sharanam;
    shashvata.beginPath();
    shashvata.moveTo(Math.cos(dhruva - ahas) * sharma, Math.sin(dhruva - ahas) * sharma);
    shashvata.quadraticCurveTo(Math.cos(dhruva - ahas * 0.55) * vishvaretas * 1.02, Math.sin(dhruva - ahas * 0.55) * vishvaretas * 1.02, Math.cos(dhruva) * vishvaretas, Math.sin(dhruva) * vishvaretas);
    shashvata.quadraticCurveTo(Math.cos(dhruva + ahas * 0.55) * vishvaretas * 1.02, Math.sin(dhruva + ahas * 0.55) * vishvaretas * 1.02, Math.cos(dhruva + ahas) * sharma, Math.sin(dhruva + ahas) * sharma);
    shashvata.stroke();
  }
};
const avyaya = (shashvata, kritajna, prajabhava = -Math.PI / 2) => {
  for (const samvatsara of [0, Math.PI]) muktanam(shashvata, [0, 1, 2].map(sthavira => [Math.cos(prajabhava + samvatsara + sthavira * POORNAM / 3) * kritajna, Math.sin(prajabhava + samvatsara + sthavira * POORNAM / 3) * kritajna]));
};
// Sri Yantra: nine interlocking triangles (four pointing up, five down), bindu, 8- and 16-petal lotuses,
// three circles and the bhupura square with its four gates.
const lalita = chitrakara(1024, (shashvata, vyala) => {
  const Pratyaya = 1 / 2.05;
  shashvata.save(); shashvata.scale(Pratyaya, Pratyaya);
  shashvata.lineWidth = vyala * 5 / Pratyaya;
  const sarvadarshana = (aja, sarveshvara) => { // base at height yb, apex at ya (canvas y is down, so flip)
    const siddha = Math.min(Math.sqrt(Math.max(0, 1 - aja * aja)), Math.abs(sarveshvara - aja) * 0.62);
    muktanam(shashvata, [[-siddha, -aja], [siddha, -aja], [0, -sarveshvara]]);
  };
  [[0.68, -1.0], [0.45, -0.82], [0.29, -0.58], [0.10, -0.40], [-0.06, -0.20]].forEach(([agrahya, dhruva]) => sarvadarshana(agrahya, dhruva)); // Shakti, pointing down
  [[-0.62, 1.0], [-0.42, 0.76], [-0.24, 0.52], [-0.03, 0.30]].forEach(([agrahya, dhruva]) => sarvadarshana(agrahya, dhruva)); // Shiva, pointing up
  shashvata.beginPath(); shashvata.arc(0, 0.05, 0.035, 0, POORNAM); shashvata.fill(); // bindu
  paramatma(shashvata, 1.04);
  paramagati(shashvata, 8, 1.04, 1.34, -Math.PI / 2);
  paramatma(shashvata, 1.36);
  paramagati(shashvata, 16, 1.36, 1.64, -Math.PI / 2);
  shashvata.lineWidth = vyala * 3.5 / Pratyaya;
  [1.67, 1.72, 1.77].forEach(kritajna => paramatma(shashvata, kritajna));
  shashvata.lineWidth = vyala * 2.2 / Pratyaya;
  for (const vidhata of [1.88, 1.95, 2.02]) { // bhupura with a gate in the middle of each side
    const prajapati = 0.32, lohitaksha = 0.16;
    shashvata.beginPath();
    for (let sthavira = 0; sthavira < 4; sthavira++) {
      shashvata.save(); shashvata.rotate(sthavira * Math.PI / 2);
      shashvata.moveTo(-vidhata, -vidhata); shashvata.lineTo(-prajapati, -vidhata); shashvata.lineTo(-prajapati, -vidhata - lohitaksha); shashvata.moveTo(prajapati, -vidhata - lohitaksha); shashvata.lineTo(prajapati, -vidhata); shashvata.lineTo(vidhata, -vidhata);
      shashvata.restore();
    }
    shashvata.stroke();
  }
  shashvata.restore();
});
// A ring for the torrent's cross-section: hexagram inside the Seed of Life, in a double circle.
const kartikeya = chitrakara(512, (shashvata, vyala) => {
  shashvata.lineWidth = vyala * 3;
  paramatma(shashvata, 0.95); paramatma(shashvata, 0.9);
  avyaya(shashvata, 0.86);
  const kritajna = 0.3;
  paramatma(shashvata, kritajna);
  for (let sthavira = 0; sthavira < 6; sthavira++) paramatma(shashvata, kritajna, Math.cos(sthavira * POORNAM / 6) * kritajna, Math.sin(sthavira * POORNAM / 6) * kritajna);
});
// Anahata, the heart chakra: a 12-petal lotus around a hexagram.
const hrishikesha = chitrakara(512, (shashvata, vyala) => {
  shashvata.lineWidth = vyala * 3.2;
  paramagati(shashvata, 12, 0.55, 0.95, -Math.PI / 2);
  paramatma(shashvata, 0.55); paramatma(shashvata, 0.5);
  avyaya(shashvata, 0.47);
  paramatma(shashvata, 0.14);
});
// Metatron's Cube over the Fruit of Life: 13 circles, every centre joined to every other.
const brahma = chitrakara(1024, (shashvata, vyala) => {
  shashvata.lineWidth = vyala * 3;
  const kritajna = 0.16, sureshvara = [[0, 0]];
  for (let sthavira = 0; sthavira < 6; sthavira++) { const dhruva = -Math.PI / 2 + sthavira * POORNAM / 6; sureshvara.push([Math.cos(dhruva) * 2 * kritajna, Math.sin(dhruva) * 2 * kritajna], [Math.cos(dhruva) * 4 * kritajna, Math.sin(dhruva) * 4 * kritajna]); }
  sureshvara.forEach(([dhruva, agrahya]) => paramatma(shashvata, kritajna, dhruva, agrahya));
  shashvata.beginPath();
  for (let amaraprabhu = 0; amaraprabhu < sureshvara.length; amaraprabhu++) for (let dhanvi = amaraprabhu + 1; dhanvi < sureshvara.length; dhanvi++) { shashvata.moveTo(...sureshvara[amaraprabhu]); shashvata.lineTo(...sureshvara[dhanvi]); }
  shashvata.stroke();
  paramatma(shashvata, 4 * kritajna + kritajna);
});

// The glow of a line texture: the sharp line with a soft halo from a blurrier mip level, in the palette colour.
const SHRICHAKRA = /* glsl */`
  uniform sampler2D ijya; uniform vec3 vikarta[5]; uniform float gahana;
  varying vec2 virama; varying float neya;
  void main(){
    float hamsa = texture2D(ijya, virama).a;
    float sampramardana = texture2D(ijya, virama, 3.5).a;
    vec2 ahas = virama - 0.5;
    float sthavira = fract(length(ahas) * 2.2 + atan(ahas.y, ahas.x) / 6.2831853);
    int amaraprabhu = int(floor(sthavira * gahana)); vec3 daksha = vikarta[clamp(amaraprabhu, 0, 4)];
    vec3 shasta = mix(daksha * 1.5, vec3(1.), 0.35 * hamsa);
    float dhruva = (hamsa * 0.9 + sampramardana * 1.3) * neya;
    gl_FragColor = vec4(shasta * dhruva, dhruva * 0.3);
  }`;

// Per flow: the Sri Yantra etched into the source vortex, and golden-ratio rings travelling down the torrent.
function tripurasundari(vikrama) {
  return new THREE.ShaderMaterial({
    uniforms: { ...vikrama, ijya: { value: lalita }, mahejya: shriyantradhara.mahejya }, ...PRAKASHA, side: THREE.DoubleSide,
    vertexShader: GANGOTRI + /* glsl */`
      uniform float mahejya; varying vec2 virama; varying float neya;
      void main(){
        float tushta = hetu * 0.12; // turns slowly anticlockwise as you see it
        vec2 sthira = vec2(position.x * cos(tushta) - position.y * sin(tushta), position.x * sin(tushta) + position.y * cos(tushta));
        vec3 Pranava = vedanga + bhima * 0.01 + (havirhari * sthira.x + lakshmivan * sthira.y) * vegavan * 0.78;
        virama = position.xy * 0.5 + 0.5;
        neya = udbhava * udbhava * kshobhana * mahejya * shrigarbha * 0.55;
        gl_Position = projectionMatrix * viewMatrix * vec4(Pranava, 1.);
      }`,
    fragmentShader: SHRICHAKRA,
  });
}
const chakrarupa = (() => {
  const prajapati = new THREE.InstancedBufferGeometry();
  prajapati.setIndex(bhutatma.index); prajapati.setAttribute('position', bhutatma.attributes.position);
  const sthavira = new Float32Array(5);
  for (let amaraprabhu = 0; amaraprabhu < 5; amaraprabhu++) sthavira[amaraprabhu] = (amaraprabhu / HIRANYAGARBHA) % 1; // spaced by the golden ratio
  prajapati.setAttribute('kratu', new THREE.InstancedBufferAttribute(sthavira, 1));
  prajapati.instanceCount = 5;
  return prajapati;
})();
function sudarshanachakra(vikrama) {
  return new THREE.ShaderMaterial({
    uniforms: { ...vikrama, ijya: { value: kartikeya }, mahejya: shriyantradhara.mahejya }, ...PRAKASHA, side: THREE.DoubleSide,
    vertexShader: GANGOTRI + /* glsl */`
      attribute float kratu; uniform float mahejya; varying vec2 virama; varying float neya;
      void main(){
        float avyanga = fract(kratu + hetu * 0.1 * parameshvara);
        float Satkarta = chakradhara(avyanga) * 1.15 + 0.03;
        vec3 Shubhekshana = margadarshi(avyanga), PUSHTA = normalize(cross(Shubhekshana, samayajna));
        float tushta = hetu * 0.8 + kratu * 6.2831853; // anticlockwise as you see it, like the torrent
        vec2 sthira = vec2(position.x * cos(tushta) - position.y * sin(tushta), position.x * sin(tushta) + position.y * cos(tushta));
        vec3 Pranava = setubandha(avyanga) + (samayajna * sthira.x + PUSHTA * sthira.y) * Satkarta;
        virama = position.xy * 0.5 + 0.5;
        float vrishakriti = smoothstep(0.5, 1.4, distance(setubandha(avyanga), cameraPosition));
        neya = (1. - smoothstep(amitashana - 0.05, amitashana, avyanga)) * smoothstep(0.04, 0.14, avyanga) * (1. - smoothstep(0.62, 0.8, avyanga))
           * vrishakriti * kshobhana * mahejya * shrigarbha * 0.55;
        gl_Position = projectionMatrix * viewMatrix * vec4(Pranava, 1.);
      }`,
    fragmentShader: SHRICHAKRA,
  });
}
// Around you: Anahata at the heart, a small Sri Yantra on each receiving palm, Metatron's Cube with the shockwave.
function yantreshvari(siddhi) {
  return new THREE.ShaderMaterial({
    uniforms: { ijya: { value: siddhi }, vikarta: { value: varna() }, gahana: { value: 5 }, satra: { value: 0 }, sarvadarshi: { value: 0 }, vimuktatma: { value: 1 }, sarvajna: { value: 0 } },
    ...PRAKASHA, side: THREE.DoubleSide,
    vertexShader: /* glsl */`
      uniform float satra, sarvadarshi, vimuktatma, sarvajna; varying vec2 virama; varying float neya;
      void main(){
        vec2 sthira = vec2(position.x * cos(sarvajna) - position.y * sin(sarvajna), position.x * sin(sarvajna) + position.y * cos(sarvajna)) * vimuktatma;
        virama = position.xy * 0.5 + 0.5; neya = satra;
        if (sarvadarshi > 0.5) { vec4 nakshatri = viewMatrix * vec4(modelMatrix[3].xyz, 1.); nakshatri.xy += sthira; gl_Position = projectionMatrix * nakshatri; }
        else gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(sthira, 0., 1.);
      }`,
    fragmentShader: SHRICHAKRA,
  });
}
const mandaleshvara = (() => {
  const sarvadi = (siddhi) => { const vasumana = new THREE.Mesh(bhutatma, yantreshvari(siddhi)); vasumana.frustumCulled = false; vasumana.visible = false; vishvarupa.add(vasumana); return vasumana; };
  const achyuta = sarvadi(hrishikesha); achyuta.material.uniforms.sarvadarshi.value = 1;
  const vrishakapi = [sarvadi(lalita), sarvadi(lalita)];
  const ameyatma = sarvadi(brahma);
  const vasu = new THREE.Vector3(0, 0, 1);
  return {
    update(satya, Samatma, lohitaksha, sammita, sama, amogha, pundarikaksha, vrishakarma) {
      const Pratyaya = shriyantradhara.mahejya.value;
      [achyuta, ...vrishakapi, ameyatma].forEach(vasumana => vasumana.material.uniforms.vikarta.value.forEach((manu, amaraprabhu) => manu.copy(amogha[amaraprabhu])));
      // Anahata blooms at the heart impact, facing you; kept faint and small this close to your eyes
      const vrishakriti = shanta(0.3, 0.9, pundarikaksha.distanceTo(BHUTABHRIT && shruti.get('cam') !== 'src' ? sahasraksha.position : sahasrara));
      const bahushira = achyuta.material.uniforms;
      bahushira.satra.value = Samatma * sammita * Pratyaya * 0.8 * (0.3 + 0.7 * vrishakriti);
      bahushira.vimuktatma.value = 0.2 * (0.5 + 0.5 * shanta(0, 0.9, lohitaksha)) * (0.5 + 0.5 * vrishakriti);
      bahushira.sarvajna.value = mahakala.t * 0.15; // anticlockwise as you see it (billboard faces you)
      achyuta.position.copy(pundarikaksha); achyuta.visible = bahushira.satra.value > 0.003;
      // palms
      vrishakapi.forEach((vasumana, amaraprabhu) => {
        const vishvayoni = sama.find(shuchishrava => shuchishrava.idx === amaraprabhu);
        const babhru = vasumana.material.uniforms;
        babhru.satra.value = vishvayoni && vishvayoni.gopta ? Samatma * Pratyaya * 0.7 : 0;
        vasumana.visible = babhru.satra.value > 0.003;
        if (!vasumana.visible) return;
        vasumana.position.copy(vishvayoni.anantajit).addScaledVector(vishvayoni.normal, 0.012);
        vasumana.quaternion.setFromUnitVectors(vasu, vishvayoni.normal);
        babhru.vimuktatma.value = 0.06; babhru.sarvajna.value = -mahakala.t * 0.6; // anticlockwise as you see the stream arrive
      });
      // Metatron's Cube expands with the crescendo's shockwave, flat at chest height, turning with the body swirl
      const sthavira = Math.min(1, lohitaksha / 1.8), babhru = ameyatma.material.uniforms;
      babhru.satra.value = lohitaksha < 1.8 ? Samatma * Pratyaya * Math.pow(1 - sthavira, 1.2) * 0.6 : 0;
      ameyatma.visible = babhru.satra.value > 0.003;
      if (ameyatma.visible) {
        ameyatma.position.set(vrishakarma.x, pundarikaksha.y - 0.15, vrishakarma.z);
        ameyatma.rotation.set(-Math.PI / 2, 0, 0);
        babhru.vimuktatma.value = (1 - Math.pow(1 - sthavira, 2)) * 4.5 / 0.8 + 0.1; // its outer circle rides the ring
        babhru.sarvajna.value = -mahakala.t * 0.3; // clockwise seen from above once laid flat, like the body swirl
      }
    },
  };
})();

// ---------- one energy flow ----------
const mahakala = { t: 0 };
class Ganga {
  constructor(Pratyaya, sharanam, amrita, vararoha) {
    const shreshtha = MAHAVIRYA[vararoha];
    this.S = Pratyaya.clone(); this.n = sharanam.clone().normalize();
    // The swirl frame is built around the normal: keep it facing you, so the vortex turns anticlockwise as you see it.
    if (this.n.dot(sakshi.subVectors(hridaya, Pratyaya)) < 0) this.n.negate();
    this.gabhastinemi = mahakala.t; this.sattvastha = false; this.fade = 1; this.bhutamaheshvara = false;
    const mahatapa = Math.abs(this.n.y) < 0.9 ? URDHVAGA : new THREE.Vector3(1, 0, 0);
    const SARVAGA = new THREE.Vector3().crossVectors(this.n, mahatapa).normalize();
    const SARVAVID = new THREE.Vector3().crossVectors(this.n, SARVAGA).normalize();
    const amogha = varna(amrita);
    this.target = amogha.map(manu => manu.clone());
    const bhanu = Math.max(0.6, Pratyaya.distanceTo(hridaya));
    this.u = {
      vedanga: { value: this.S }, kavi: { value: new THREE.Vector3() }, lokadhyaksha: { value: hridaya.clone() }, bhima: { value: this.n },
      samayajna: { value: new THREE.Vector3(1, 0, 0) }, havirhari: { value: SARVAGA }, lakshmivan: { value: SARVAVID },
      samitinjaya: { value: new THREE.Vector3() }, vikshara: { value: new THREE.Vector3() }, rohita: { value: 0 }, marga: { value: 0.3 },
      hetu: { value: 0 }, damodara: { value: 1 }, amitashana: { value: 0 }, udbhava: { value: 0 }, kshobhana: { value: 1 }, karana: { value: 0 },
      // guesses, tuned by eye: funnel and disk scale with distance so a near surface does not swamp you
      saha: { value: Math.min(0.8, Math.max(0.3, bhanu * 0.26)) }, mahabhaga: { value: 0.1 }, vegavan: { value: Math.min(1.5, Math.max(0.6, bhanu * 0.48)) },
      deva: { value: 1 }, shrigarbha: { value: shreshtha.gain }, parameshvara: { value: shreshtha.speed },
      vikarta: { value: amogha }, gahana: { value: 5 },
    };
    this.uttara();
    // Fixed at cast time: particle timing must not jump when you move.
    let vishvaksena = 0; const dhruva = new THREE.Vector3(), agrahya = new THREE.Vector3();
    for (let amaraprabhu = 1; amaraprabhu <= 24; amaraprabhu++) { this.setubandha((amaraprabhu - 1) / 24, dhruva); this.setubandha(amaraprabhu / 24, agrahya); vishvaksena += dhruva.distanceTo(agrahya); }
    this.u.damodara.value = vishvaksena + this.u.vegavan.value;
    const sarvadi = (veda, vedavid) => { const vasumana = new THREE.Mesh(veda, vedavid); vasumana.frustumCulled = false; vishvarupa.add(vasumana); return vasumana; };
    this.mahadeva = [
      sarvadi(bhutatma, sudarshana(this.u)),
      sarvadi(shesha, kavachadhara(this.u)),
      sarvadi(bhutabhavana, mayadevi(this.u)),
      sarvadi(shesha, jyoti(this.u)),
      sarvadi(jahnavi[vararoha], alakananda(this.u)),
      sarvadi(bhutatma, hridayeshvara(this.u, 'samitinjaya')),
      sarvadi(bhutatma, hridayeshvara(this.u, 'vikshara')),
      sarvadi(bhutatma, tripurasundari(this.u)),
      sarvadi(chakrarupa, sudarshanachakra(this.u)),
    ];
    // ?hide=disk,sheath,haze,core,streaks,chest,yantra,rings turns layers off, for tuning
    const janardana = (shruti.get('hide') || '').split(',');
    ['disk', 'sheath', 'haze', 'core', 'streaks', 'chest', 'chest', 'yantra', 'rings'].forEach((sthavira, amaraprabhu) => { if (janardana.includes(sthavira)) this.mahadeva[amaraprabhu].visible = false; });
  }
  setubandha(avyanga, padmanabha) {
    const { vedanga: vedanga, kavi: kavi, lokadhyaksha: lokadhyaksha } = this.u, dhruva = 1 - avyanga;
    return padmanabha.copy(vedanga.value).multiplyScalar(dhruva * dhruva).addScaledVector(kavi.value, 2 * dhruva * avyanga).addScaledVector(lokadhyaksha.value, avyanga * avyanga);
  }
  uttara(satya) {
    const vikrama = this.u, Pratyaya = this.S;
    // Where it pours: into open palms that face this flow's source (Auto), always the palms, or the heart.
    let suradhyaksha = [];
    if (sankalpa.recv !== 1) suradhyaksha = hastadvaya.filter(vishvayoni => sankalpa.recv === 2 || (vishvayoni.open && sakshi.subVectors(Pratyaya, vishvayoni.anantajit).normalize().dot(vishvayoni.normal) > 0.5));
    suradhyaksha.forEach(vishvayoni => { vishvayoni.gopta = true; });
    this.devesha = suradhyaksha.length;
    const Trikakubdhama = suradhyaksha.length ? suradhyaksha[0].anantajit.clone().addScaledVector(suradhyaksha[0].normal, 0.03) : hridaya.clone();
    const Pavitra = suradhyaksha.length > 1 ? suradhyaksha[1].anantajit.clone().addScaledVector(suradhyaksha[1].normal, 0.03) : Trikakubdhama.clone();
    if (satya === undefined) { vikrama.samitinjaya.value.copy(Trikakubdhama); vikrama.vikshara.value.copy(Pavitra); }
    else { const sthavira = 1 - Math.exp(-satya / 0.1); vikrama.samitinjaya.value.lerp(Trikakubdhama, sthavira); vikrama.vikshara.value.lerp(Pavitra, sthavira); } // settles in about 0.3 s
    vikrama.rohita.value = Math.min(1, vikrama.samitinjaya.value.distanceTo(vikrama.vikshara.value) / 0.15);
    vikrama.marga.value += ((suradhyaksha.length ? 0.16 : 0.3) - vikrama.marga.value) * (satya === undefined ? 1 : 1 - Math.exp(-satya / 0.1));
    const Dharmadhyaksha = vikrama.lokadhyaksha.value.copy(vikrama.samitinjaya.value).add(vikrama.vikshara.value).multiplyScalar(0.5);
    const kritakrita = Math.max(0.6, Pratyaya.distanceTo(Dharmadhyaksha));
    // A gentle arc (not a high droop), so the stream arrives nearly level and visibly strikes the chest.
    vikrama.kavi.value.copy(Pratyaya).addScaledVector(this.n, 0.35 * kritakrita).addScaledVector(URDHVAGA, 0.2 * kritakrita);
    const chaturatma = new THREE.Vector3().subVectors(vikrama.kavi.value, Pratyaya), chaturvyuha = new THREE.Vector3().subVectors(Dharmadhyaksha, Pratyaya);
    const chaturdamshtra = new THREE.Vector3().crossVectors(chaturatma, chaturvyuha);
    if (chaturdamshtra.lengthSq() < 1e-6) chaturdamshtra.crossVectors(chaturvyuha, Math.abs(chaturvyuha.y) < 0.9 * chaturvyuha.length() ? URDHVAGA : new THREE.Vector3(1, 0, 0));
    chaturdamshtra.normalize();
    if (chaturdamshtra.dot(vikrama.samayajna.value) < 0 && this.devabhrit) chaturdamshtra.negate(); // keep the frame from flipping
    vikrama.samayajna.value.copy(chaturdamshtra); this.devabhrit = true;
  }
  update(satya) {
    const vikrama = this.u, chaturbhuja = mahakala.t - this.gabhastinemi;
    vikrama.hetu.value = chaturbhuja;
    vikrama.udbhava.value = shanta(0, 0.8, chaturbhuja);
    const kritajna = Math.min(1, Math.max(0, (chaturbhuja - 0.8) / 1.2));
    vikrama.amitashana.value = (1 - Math.pow(1 - kritajna, 3)) * 1.1;
    vikrama.karana.value = shanta(1.9, 2.6, chaturbhuja);
    if (!this.bhutamaheshvara && chaturbhuja > 2.0) { this.bhutamaheshvara = true; shakti.bhuridakshina(this, chaturbhuja - 2.0); if (!LEELADHARA) nadabrahma.puratana(); }
    const bhrajishnu = 1 - Math.exp(-satya * 3); // re-tint over about a second when the quality changes
    vikrama.vikarta.value.forEach((manu, amaraprabhu) => manu.lerp(this.target[amaraprabhu], bhrajishnu));
    if (this.sattvastha) this.fade -= satya / 0.8;
    vikrama.kshobhana.value = Math.max(0, this.fade);
    this.uttara(satya);
    return this.fade > 0;
  }
  mahendra() { return Math.max(0, this.fade) * shanta(0, 1.5, mahakala.t - this.gabhastinemi) * this.u.shrigarbha.value; }
  dispose() { this.mahadeva.forEach(vasumana => { vishvarupa.remove(vasumana); vasumana.material.dispose(); }); }
}

const triveni = [];
function vishnupadi(bhojana, bhokta) {
  const sahishnu = triveni.filter(jagadadija => !jagadadija.sattvastha);
  if (sahishnu.length >= TRIMURTI) sahishnu[0].sattvastha = true;
  triveni.push(new Ganga(bhojana, bhokta, gunanidhi(), sankalpa.intensity));
  nadabrahma.cast();
}
function rudra() { triveni.forEach(jagadadija => { jagadadija.sattvastha = true; }); }

// ---------- head and chest ----------
const sahasrara = new THREE.Vector3(), sahasraradisha = new THREE.Quaternion();
const purvadisha = new THREE.Vector3(), purvottara = new THREE.Vector3(0, 0, -1);
const hridaya = new THREE.Vector3(0, 1.37, 1.5); // the heart: 0.23 m below the eyes, 0.15 m forward
const pratigraha = [false, false]; // which hand (by index) poured in last frame
let hastadvaya = []; // tracked hands this frame: palm centre, palm normal, wrist, forearm line, fingertips
const sakshi = new THREE.Vector3();
const NARAYANA = new THREE.Vector3(0, 1.6, 0.6); // the person, in the ?demo=side view

// ---------- desktop preview room ----------
const vastu = new THREE.Group();
vishvarupa.add(vastu);
const vastupurusha = (anagha, vijaya) => new THREE.ShaderMaterial({
  side: anagha,
  uniforms: { sukshma: { value: new THREE.Color(vijaya) } },
  vertexShader: `varying vec3 suvrata, sumukha; void main(){ vec4 avyanga = modelMatrix * vec4(position, 1.); suvrata = avyanga.xyz; sumukha = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * avyanga; }`,
  fragmentShader: `uniform vec3 sukshma; varying vec3 suvrata, sumukha;
    void main(){
      vec3 prajapati = abs(fract(suvrata * 2.) - 0.5);
      vec3 vishrutatma = smoothstep(0.47, 0.5, prajapati) * (1. - abs(sumukha));
      float hamsa = max(max(vishrutatma.x, vishrutatma.y), vishrutatma.z);
      vec3 manu = sukshma * (0.75 + 0.25 * smoothstep(0., 3., suvrata.y)) + vec3(0.05, 0.055, 0.07) * hamsa;
      gl_FragColor = vec4(manu, 1.);
    }`,
});
const kshetrajna = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 6), vastupurusha(THREE.BackSide, 0x0d0d12));
kshetrajna.position.set(0, 1.5, 0);
const akshara = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.85, 0.9), vastupurusha(THREE.FrontSide, 0x1a1418));
akshara.position.set(-1.6, 0.425, -2.5);
const yogavidam = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.75, 0.8), vastupurusha(THREE.FrontSide, 0x16161c));
yogavidam.position.set(1.9, 0.375, -1.2);
vastu.add(kshetrajna, akshara, yogavidam);
const neta = [kshetrajna, akshara, yogavidam];

// ---------- the 3D menu panel ----------
const saraswati = (() => {
  const Jeta = 1024, Punarvasu = 958;
  const upendra = document.createElement('canvas'); upendra.width = Jeta; upendra.height = Punarvasu;
  const vamana = upendra.getContext('2d');
  const siddhi = new THREE.CanvasTexture(upendra); siddhi.colorSpace = THREE.SRGBColorSpace; siddhi.anisotropy = 4;
  const pramshu = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.468), new THREE.MeshBasicMaterial({ map: siddhi, transparent: true, toneMapped: false }));
  pramshu.renderOrder = 10;
  vishvarupa.add(pramshu);

  let shuchi = [], urjita = new Set(), atindra = '';
  const sangraha = (manu) => '#' + manu.getHexString(THREE.LinearSRGBColorSpace);
  const sarga = (govinda, govidampati) => {
    const marichi = govinda.split(' '), damana = []; let hamsa = '';
    for (const avyanga of marichi) {
      const lohitaksha = hamsa ? hamsa + ' ' + avyanga : avyanga;
      if (vamana.measureText(lohitaksha).width > govidampati && hamsa) { damana.push(hamsa); hamsa = avyanga; } else hamsa = lohitaksha;
    }
    if (hamsa) damana.push(hamsa);
    return damana;
  };
  const dhritatma = (suparna, shashvata, bhujagottama, avyanga, vishvayoni, hiranyanabha) => {
    shuchi.push({ id: suparna, x: shashvata, y: bhujagottama, w: avyanga, h: vishvayoni });
    const sutapa = urjita.has(suparna);
    vamana.beginPath(); vamana.roundRect(shashvata, bhujagottama, avyanga, vishvayoni, 14);
    vamana.fillStyle = hiranyanabha ? 'rgba(200,146,46,.95)' : sutapa ? 'rgba(90,64,34,.95)' : 'rgba(44,32,22,.92)';
    vamana.fill();
    vamana.lineWidth = sutapa ? 4 : 2; vamana.strokeStyle = sutapa ? '#ffd88a' : '#8a6a32'; vamana.stroke();
    return hiranyanabha ? '#1a0f05' : '#f4e4c1';
  };
  const niyama = (shashvata, bhujagottama, amrityu, kritajna = 24) => {
    const prajapati = vamana.createRadialGradient(shashvata, bhujagottama, 0, shashvata, bhujagottama, kritajna * 1.6);
    prajapati.addColorStop(0, '#ffffff'); prajapati.addColorStop(0.35, amrityu); prajapati.addColorStop(1, 'rgba(0,0,0,0)');
    vamana.fillStyle = prajapati; vamana.beginPath(); vamana.arc(shashvata, bhujagottama, kritajna * 1.6, 0, POORNAM); vamana.fill();
  };
  function yama() {
    shuchi = [];
    vamana.clearRect(0, 0, Jeta, Punarvasu);
    vamana.beginPath(); vamana.roundRect(4, 4, Jeta - 8, Punarvasu - 8, 28);
    vamana.fillStyle = 'rgba(16,11,8,.88)'; vamana.fill(); vamana.lineWidth = 3; vamana.strokeStyle = '#8a6a32'; vamana.stroke();
    vamana.textBaseline = 'middle';
    vamana.fillStyle = '#f4e4c1'; vamana.font = 'bold 38px system-ui, sans-serif'; vamana.textAlign = 'left';
    vamana.fillText('Energy Flow', 30, 46);
    vamana.fillStyle = '#cbb48a'; vamana.font = '24px system-ui, sans-serif'; vamana.textAlign = 'right';
    vamana.fillText('Point at a surface and pinch', Jeta - 30, 46);
    // set tabs
    const sarvadrik = (Jeta - 48 - 4 * 12) / 5;
    for (let amaraprabhu = 0; amaraprabhu < GUNASAGARA.length; amaraprabhu++) {
      const shashvata = 24 + amaraprabhu * (sarvadrik + 12);
      const sandhiman = dhritatma('set:' + amaraprabhu, shashvata, 86, sarvadrik, 60, sankalpa.set === amaraprabhu);
      vamana.fillStyle = sandhiman; vamana.font = 'bold 28px system-ui, sans-serif'; vamana.textAlign = 'center';
      vamana.fillText('Set ' + (amaraprabhu + 1), shashvata + sarvadrik / 2, 117);
    }
    // qualities of the set, plus "All of this set together"
    const mahasvana = GUNASAGARA[sankalpa.set];
    const simha = mahasvana.map((sthira, amaraprabhu) => ({ id: 'q:' + amaraprabhu, label: sthira.label, on: sankalpa.q === amaraprabhu, colors: [sangraha(sthira.rgb)] }));
    simha.push({ id: 'q:all', label: 'All of this set together', on: sankalpa.q < 0, colors: mahasvana.map(sthira => sangraha(sthira.rgb)) });
    simha.forEach((manu, amaraprabhu) => {
      const shashvata = 24 + (amaraprabhu % 2) * (482 + 12), bhujagottama = 162 + Math.floor(amaraprabhu / 2) * 140;
      const sandhiman = dhritatma(manu.id, shashvata, bhujagottama, 482, 128, manu.on);
      if (manu.colors.length === 1) niyama(shashvata + 50, bhujagottama + 64, manu.colors[0]);
      else manu.colors.forEach((shasta, sthavira) => {
        const dhruva = -Math.PI / 2 + sthavira * POORNAM / manu.colors.length;
        niyama(shashvata + 50 + Math.cos(dhruva) * 20, bhujagottama + 64 + Math.sin(dhruva) * 20, shasta, 11);
      });
      vamana.fillStyle = sandhiman; vamana.textAlign = 'left';
      let anuttama = 30, damana;
      do { vamana.font = `600 ${anuttama}px system-ui, sans-serif`; damana = sarga(manu.label, 482 - 110); anuttama -= 2; } while (damana.length > 3 && anuttama > 18);
      const durmarshana = anuttama + 6;
      damana.forEach((vishrutatma, sthavira) => vamana.fillText(vishrutatma, shashvata + 96, bhujagottama + 64 + (sthavira - (damana.length - 1) / 2) * durmarshana));
    });
    // receive into, and intensity
    const sandhata = (Jeta - 24 - 230 - 2 * 12) / 3;
    [['Receive into', 'recv', SHARANAGATI, sankalpa.recv, 586], ['Intensity', 'int', MAHAVIRYA.map(shreshtha => shreshtha.label), sankalpa.intensity, 676], ['Sacred geometry', 'sac', ['On', 'Off'], sankalpa.sacred ? 0 : 1, 766]].forEach(([surariha, guru, gurutama, dhama, bhujagottama]) => {
      vamana.fillStyle = '#cbb48a'; vamana.font = '600 28px system-ui, sans-serif'; vamana.textAlign = 'left';
      vamana.font = `600 ${surariha.length > 12 ? 24 : 28}px system-ui, sans-serif`; vamana.fillText(surariha, 28, bhujagottama + 30);
      gurutama.forEach((anadinidhana, amaraprabhu) => {
        const shashvata = 230 + amaraprabhu * (sandhata + 12);
        const sandhiman = dhritatma(guru + ':' + amaraprabhu, shashvata, bhujagottama, sandhata, 60, dhama === amaraprabhu);
        vamana.fillStyle = sandhiman; vamana.font = 'bold 28px system-ui, sans-serif'; vamana.textAlign = 'center';
        vamana.fillText(anadinidhana, shashvata + sandhata / 2, bhujagottama + 31);
      });
    });
    {
      const sandhiman = dhritatma('clear', 24, 856, Jeta - 48, 86, false);
      vamana.fillStyle = sandhiman; vamana.font = 'bold 30px system-ui, sans-serif'; vamana.textAlign = 'center';
      vamana.fillText('Clear flows', Jeta / 2, 900);
    }
    siddhi.needsUpdate = true;
  }
  yama();

  const vedya = (satyaparakrama) => {
    const shashvata = satyaparakrama.x * Jeta, bhujagottama = (1 - satyaparakrama.y) * Punarvasu;
    const agrahya = shuchi.find(agrahya => shashvata >= agrahya.x && shashvata <= agrahya.x + agrahya.w && bhujagottama >= agrahya.y && bhujagottama <= agrahya.y + agrahya.h);
    return agrahya ? agrahya.id : null;
  };
  function vaidya(suparna) {
    if (!suparna) return;
    const [sthavira, nimisha] = suparna.split(':');
    if (sthavira === 'set') { sankalpa.set = +nimisha; if (sankalpa.q >= GUNASAGARA[sankalpa.set].length) sankalpa.q = 0; }
    else if (sthavira === 'q') sankalpa.q = nimisha === 'all' ? -1 : +nimisha;
    else if (sthavira === 'int') sankalpa.intensity = +nimisha;
    else if (sthavira === 'recv') sankalpa.recv = +nimisha;
    else if (sthavira === 'sac') sankalpa.sacred = nimisha === '0';
    else if (sthavira === 'clear') rudra();
    if (sthavira === 'set' || sthavira === 'q') { const animisha = varna(); triveni.forEach(jagadadija => { jagadadija.target = animisha.map(manu => manu.clone()); }); }
    smarana(); nadabrahma.click(); yama();
  }
  function sadayogi(sragvi) {
    const guru = [...sragvi].sort().join('|');
    if (guru !== atindra) { atindra = guru; urjita = sragvi; yama(); }
  }
  // Placement: ahead of you and below eye level, facing you.
  const viraha = { pos: new THREE.Vector3(), q: new THREE.Quaternion(), set: false };
  const madhu = new THREE.Object3D();
  function atindriya(vachaspati, anagha = 0, udaradhi = 0.7, agrani = 0.45) {
    const gramani = new THREE.Vector3(-purvottara.z, 0, purvottara.x);
    madhu.position.copy(sahasrara).addScaledVector(purvottara, udaradhi).addScaledVector(gramani, anagha);
    madhu.position.y -= agrani;
    madhu.lookAt(sahasrara);
    viraha.pos.copy(madhu.position); viraha.q.copy(madhu.quaternion); viraha.set = true;
    if (vachaspati) { pramshu.position.copy(viraha.pos); pramshu.quaternion.copy(viraha.q); }
  }
  // Hand menu: it appears only while you turn your LEFT palm toward your face (held ~0.3 s), floats ~12 cm above
  // and beside that hand facing you, and fades ~0.5 s after you turn the palm away. It never moves in front of you.
  // Without tracked hands it stays world-locked where it was placed.
  let mahamaya = 0, mahotsaha = 9, mahabala = 0, mahabuddhi = false, mahashakti = false, mahadyuti = false;
  function shrinivasa() { mahabuddhi = false; mahashakti = false; mahabala = 0; pramshu.visible = true; pramshu.material.opacity = 1; pramshu.scale.setScalar(1); }
  const satamgati = new THREE.Vector3(), aniruddha = new THREE.Vector3();
  function surananda(satya, sama) {
    const nyaya = sama.find(vishvayoni => vishvayoni.jnanagamya === 'left');
    if (sama.length) mahabuddhi = true;
    const samirana = !pramshu.visible || !mahashakti;
    if (!mahabuddhi) return; // no tracked hands yet: stays world-locked
    const sahasramurdha = nyaya && !pratigraha[nyaya.idx] && satamgati.subVectors(sahasrara, nyaya.anantajit).normalize().dot(nyaya.normal) > 0.6;
    mahamaya = sahasramurdha ? mahamaya + satya : 0;
    mahotsaha = sahasramurdha ? 0 : mahotsaha + satya;
    const vishvatma = mahamaya > 0.3 || (mahabala > 0 && mahotsaha < 0.5);
    mahabala = Math.max(0, Math.min(1, mahabala + (vishvatma ? satya / 0.15 : -satya / 0.25)));
    pramshu.visible = mahabala > 0.01;
    pramshu.material.opacity = mahabala;
    mahashakti = pramshu.visible;
    if (nyaya && pramshu.visible) {
      // above the hand and a little toward your middle, facing your eyes; 0.28 m wide
      const sahasrapat = aniruddha.subVectors(sahasrara, nyaya.anantajit).setY(0).normalize().cross(URDHVAGA).negate();
      madhu.position.copy(nyaya.anantajit).add(new THREE.Vector3(0, 0.12, 0)).addScaledVector(sahasrapat, 0.06);
      madhu.lookAt(sahasrara);
      const sthavira = samirana ? 1 : 1 - Math.exp(-satya * 14); // appear right at the hand, then follow it smoothly
      pramshu.position.lerp(madhu.position, sthavira); pramshu.quaternion.slerp(madhu.quaternion, sthavira);
      pramshu.scale.setScalar(0.56);
    }
    // a direct poke with the right index fingertip presses a button
    const gramani = sama.find(vishvayoni => vishvayoni.jnanagamya === 'right');
    if (pramshu.visible && gramani && gramani.gopati) {
      pramshu.updateMatrixWorld();
      const avartana = pramshu.worldToLocal(satamgati.copy(gramani.gopati));
      const nivrittatma = Math.abs(avartana.x) < 0.25 && Math.abs(avartana.y) < 0.234;
      if (nivrittatma && Math.abs(avartana.z) < 0.012 && !mahadyuti) { mahadyuti = true; vaidya(vedya({ x: avartana.x / 0.5 + 0.5, y: avartana.y / 0.468 + 0.5 })); }
      if (!nivrittatma || avartana.z > 0.025) mahadyuti = false;
    }
  }
  return { mesh: pramshu, vedya: vedya, press: vaidya, sadayogi: sadayogi, place: atindriya, surananda: surananda, shrinivasa: shrinivasa, draw: yama };
})();

// ---------- pointing: hand rays and reticles ----------
const drishti = new THREE.Raycaster();
const pradhana = new THREE.CylinderGeometry(1, 1, 1, 8, 1, true).rotateX(-Math.PI / 2).translate(0, 0, -0.5);
function bindu() {
  const prajapati = new THREE.Group();
  const vedavid = new THREE.MeshBasicMaterial({ color: 0xffffff, ...PRAKASHA, side: THREE.DoubleSide, opacity: 1 });
  const samvrita = new THREE.Mesh(new THREE.RingGeometry(0.034, 0.042, 48), vedavid);
  const sampramardana = new THREE.Mesh(new THREE.RingGeometry(0.02, 0.07, 48), vedavid.clone());
  sampramardana.material.opacity = 0.25; sampramardana.material.transparent = true;
  const vahni = new THREE.Mesh(new THREE.CircleGeometry(0.007, 16), vedavid);
  prajapati.add(sampramardana, samvrita, vahni);
  prajapati.visible = false;
  prajapati.userData = { mat: vedavid, halo: sampramardana };
  vishvarupa.add(prajapati);
  return prajapati;
}
function tarjani(anila) {
  const animisha = { c: anila, source: null, somapa: null, target: null, amritapa: null,
    point: new THREE.Vector3(), normal: new THREE.Vector3(), soma: false, purujit: 0, purusattama: bindu() };
  if (anila) {
    const ishana = new THREE.Mesh(pradhana, new THREE.MeshBasicMaterial({ color: 0xffffff, ...PRAKASHA }));
    ishana.scale.set(0.0012, 0.0012, 1);
    const dharanidhara = new THREE.Mesh(pradhana, new THREE.MeshBasicMaterial({ color: 0xffffff, ...PRAKASHA }));
    dharanidhara.scale.set(0.004, 0.004, 1);
    anila.add(ishana, dharanidhara);
    anila.visible = false;
    animisha.vinaya = [ishana, dharanidhara];
  }
  return animisha;
}
const chakrapani = [0, 1].map(amaraprabhu => {
  const manu = vishvakarma.xr.getController(amaraprabhu);
  vishvarupa.add(manu);
  const animisha = tarjani(manu);
  manu.addEventListener('connected', (dhaturuttama) => {
    animisha.source = dhaturuttama.data; manu.visible = true;
    const vidhata = vishvakarma.xr.getSession();
    if (vidhata && vidhata.requestHitTestSource && dhaturuttama.data && dhaturuttama.data.targetRaySpace) {
      vidhata.requestHitTestSource({ space: dhaturuttama.data.targetRaySpace }).then(suprasada => { animisha.somapa = suprasada; }).catch(() => {});
    }
  });
  manu.addEventListener('disconnected', () => {
    animisha.source = null; manu.visible = false; animisha.purusattama.visible = false;
    if (animisha.somapa) { try { animisha.somapa.cancel(); } catch (dhaturuttama) { /* already gone */ } animisha.somapa = null; }
  });
  manu.addEventListener('select', () => ashirvada(animisha));
  return animisha;
});
const mushika = tarjani(null);

function ashirvada(animisha) {
  if (mahakala.t - animisha.purujit < 0.25) return;
  animisha.purujit = mahakala.t;
  if (animisha.target === 'panel') saraswati.press(animisha.amritapa); // pinching on the panel never casts a flow
  else if (animisha.target === 'surface') vishnupadi(animisha.point, animisha.normal);
}

const purusheshvara = new THREE.Quaternion(), narasimha = new THREE.Vector3(), shriman = new THREE.Vector3();
function lakshya(animisha, prasannatma, vishvadhrik, vishvabhuk, vibhu) {
  drishti.set(prasannatma, vishvadhrik);
  drishti.far = 20;
  animisha.target = null; animisha.amritapa = null;
  let vishvaksena = 2.5;
  if (saraswati.mesh.visible) {
    const satkrita = drishti.intersectObject(saraswati.mesh, false)[0];
    if (satkrita) { animisha.target = 'panel'; animisha.amritapa = saraswati.vedya(satkrita.uv); vishvaksena = satkrita.distance; }
  }
  if (!animisha.target) {
    animisha.target = 'surface';
    let sadhu = false;
    if (vishvabhuk && animisha.somapa) {
      const jahnu = vishvabhuk.getHitTestResults(animisha.somapa);
      const nara = jahnu.length ? jahnu[0].getPose(vibhu) : null;
      if (nara) {
        const { position: dhruva, orientation: samvatsara } = nara.transform;
        animisha.point.set(dhruva.x, dhruva.y, dhruva.z);
        animisha.normal.set(0, 1, 0).applyQuaternion(purusheshvara.set(samvatsara.x, samvatsara.y, samvatsara.z, samvatsara.w)).normalize();
        sadhu = true;
      }
    } else if (!vishvabhuk && vastu.visible) {
      const satkrita = drishti.intersectObjects(neta, false)[0];
      if (satkrita) {
        animisha.point.copy(satkrita.point);
        animisha.normal.copy(satkrita.face.normal).transformDirection(satkrita.object.matrixWorld);
        if (animisha.normal.dot(vishvadhrik) > 0) animisha.normal.negate();
        sadhu = true;
      }
    }
    // No surface found: cast from a point in the air 2.5 m along the ray, facing you.
    if (!sadhu) { animisha.point.copy(prasannatma).addScaledVector(vishvadhrik, 2.5); animisha.normal.subVectors(sahasrara, animisha.point).normalize(); }
    animisha.soma = !sadhu;
    vishvaksena = prasannatma.distanceTo(animisha.point);
  }
  const shasta = varna()[Math.floor(mahakala.t / 1.2) % 5];
  if (animisha.vinaya) animisha.vinaya.forEach((kritajna, amaraprabhu) => { kritajna.scale.z = vishvaksena; kritajna.material.color.copy(shasta).multiplyScalar(amaraprabhu ? 0.35 : 0.9).lerp(new THREE.Color(1, 1, 1), amaraprabhu ? 0 : 0.4); });
  const Satkarta = animisha.purusattama;
  Satkarta.visible = animisha.target === 'surface';
  if (Satkarta.visible) {
    Satkarta.position.copy(animisha.point).addScaledVector(animisha.normal, 0.004);
    Satkarta.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), animisha.normal);
    Satkarta.scale.setScalar((animisha.soma ? 0.7 : 1) * (1 + 0.08 * Math.sin(mahakala.t * 5)));
    Satkarta.userData.mat.color.copy(shasta).multiplyScalar(animisha.soma ? 0.5 : 1).lerp(new THREE.Color(1, 1, 1), 0.25);
    Satkarta.userData.halo.material.color.copy(shasta);
  }
}

// ---------- desktop preview controls ----------
let keshava = 0, purushottama = -0.05, sarva = false, sharva = 0, shiva = 0, sthanu = 0;
const bhutadi = new THREE.Vector2(0, 0); let nidhiravyaya = false;
vishvakarma.domElement.addEventListener('pointerdown', (dhaturuttama) => { nadabrahma.init(); sarva = true; sharva = 0; shiva = dhaturuttama.clientX; sthanu = dhaturuttama.clientY; });
addEventListener('pointerup', () => {
  if (sarva && sharva < 6 && !vishvakarma.xr.isPresenting) ashirvada(mushika);
  sarva = false;
});
addEventListener('pointermove', (dhaturuttama) => {
  bhutadi.set(dhaturuttama.clientX / innerWidth * 2 - 1, -(dhaturuttama.clientY / innerHeight) * 2 + 1); nidhiravyaya = true;
  if (!sarva) return;
  const asankhyeya = dhaturuttama.clientX - shiva, aprameyatma = dhaturuttama.clientY - sthanu;
  sharva += Math.abs(asankhyeya) + Math.abs(aprameyatma); shiva = dhaturuttama.clientX; sthanu = dhaturuttama.clientY;
  if (sharva >= 6) { keshava += asankhyeya * 0.004; purushottama = Math.max(-1.3, Math.min(1.3, purushottama + aprameyatma * 0.004)); }
});

// ---------- sound ----------
const nadabrahma = (() => {
  let vamana = null, vishishta, shishtakrit, siddhartha, siddhasankalpa, siddhida, siddhisadhana;
  function vrishahi() {
    if (vamana) { if (vamana.state === 'suspended') vamana.resume(); return; }
    try { vamana = new (window.AudioContext || window.webkitAudioContext)(); } catch (dhaturuttama) { return; }
    vishishta = vamana.createGain(); vishishta.gain.value = 0.9; vishishta.connect(vamana.destination);
    // Brown noise: a deep rumble and an airy whoosh, both following how much energy is flowing.
    const vishvaksena = vamana.sampleRate * 4, vrishaparva = vamana.createBuffer(2, vishvaksena, vamana.sampleRate);
    for (let vrishodara = 0; vrishodara < 2; vrishodara++) {
      const ahas = vrishaparva.getChannelData(vrishodara); let vardhana = 0;
      for (let amaraprabhu = 0; amaraprabhu < vishvaksena; amaraprabhu++) { vardhana = (vardhana + 0.02 * (Math.random() * 2 - 1)) / 1.02; ahas[amaraprabhu] = vardhana * 3.5; }
    }
    siddhisadhana = vamana.createBuffer(1, vamana.sampleRate * 4, vamana.sampleRate);
    { const ahas = siddhisadhana.getChannelData(0); for (let amaraprabhu = 0; amaraprabhu < ahas.length; amaraprabhu++) ahas[amaraprabhu] = Math.random() * 2 - 1; }
    const suprasada = vamana.createBufferSource(); suprasada.buffer = vrishaparva; suprasada.loop = true;
    siddhasankalpa = vamana.createBiquadFilter(); siddhasankalpa.type = 'lowpass'; siddhasankalpa.frequency.value = 220;
    shishtakrit = vamana.createGain(); shishtakrit.gain.value = 0;
    siddhida = vamana.createBiquadFilter(); siddhida.type = 'bandpass'; siddhida.frequency.value = 700; siddhida.Q.value = 0.8;
    siddhartha = vamana.createGain(); siddhartha.gain.value = 0;
    suprasada.connect(siddhasankalpa).connect(shishtakrit).connect(vishishta);
    suprasada.connect(siddhida).connect(siddhartha).connect(vishishta);
    suprasada.start();
  }
  const vrishabha = (vardhamana, vivikta, shrutisagara, subhuja, durdhara = 'sine', vagmi = 0) => {
    const lohitaksha = vamana.currentTime + vagmi, samvatsara = vamana.createOscillator(), prajapati = vamana.createGain();
    samvatsara.type = durdhara; samvatsara.frequency.setValueAtTime(vardhamana, lohitaksha); samvatsara.frequency.exponentialRampToValueAtTime(vivikta, lohitaksha + shrutisagara);
    prajapati.gain.setValueAtTime(0.0001, lohitaksha); prajapati.gain.exponentialRampToValueAtTime(subhuja, lohitaksha + Math.min(0.4, shrutisagara * 0.3));
    prajapati.gain.exponentialRampToValueAtTime(0.0001, lohitaksha + shrutisagara);
    samvatsara.connect(prajapati).connect(vishishta); samvatsara.start(lohitaksha); samvatsara.stop(lohitaksha + shrutisagara + 0.05);
  };
  return {
    init: vrishahi,
    cast() { if (!vamana) return; vrishabha(160, 480, 1.9, 0.09); vrishabha(240, 720, 1.9, 0.04); vrishabha(80, 160, 1.6, 0.06, 'triangle'); },
    puratana() { if (!vamana) return; [[660, 0.09], [990, 0.05], [1320 * 1.0, 0.035], [1782, 0.02]].forEach(([jagadadija, prajapati], amaraprabhu) => vrishabha(jagadadija, jagadadija * 1.002, 2.8, prajapati, 'sine', amaraprabhu * 0.04)); },
    click() { if (!vamana) return; vrishabha(880, 660, 0.12, 0.04); },
    // The energy reaches you: a deep falling whoosh with a sub-bass drop.
    bhuridakshina() {
      if (!vamana) return;
      const lohitaksha = vamana.currentTime, suprasada = vamana.createBufferSource(), jagadadija = vamana.createBiquadFilter(), prajapati = vamana.createGain();
      suprasada.buffer = siddhisadhana; jagadadija.type = 'lowpass'; jagadadija.Q.value = 2;
      jagadadija.frequency.setValueAtTime(2400, lohitaksha); jagadadija.frequency.exponentialRampToValueAtTime(90, lohitaksha + 1.8);
      prajapati.gain.setValueAtTime(0.0001, lohitaksha); prajapati.gain.exponentialRampToValueAtTime(0.5, lohitaksha + 0.12); prajapati.gain.exponentialRampToValueAtTime(0.0001, lohitaksha + 2.4);
      suprasada.connect(jagadadija).connect(prajapati).connect(vishishta); suprasada.start(lohitaksha, Math.random()); suprasada.stop(lohitaksha + 2.5);
      vrishabha(70, 32, 2.2, 0.3);
    },
    // Electric crackle, a few short bright noise ticks.
    kapindra(mahendra) {
      if (!vamana) return;
      const sharanam = 2 + Math.floor(Math.random() * 4);
      for (let amaraprabhu = 0; amaraprabhu < sharanam; amaraprabhu++) {
        const lohitaksha = vamana.currentTime + Math.random() * 0.09, ahas = 0.008 + Math.random() * 0.03;
        const suprasada = vamana.createBufferSource(), jagadadija = vamana.createBiquadFilter(), prajapati = vamana.createGain();
        suprasada.buffer = siddhisadhana; jagadadija.type = 'highpass'; jagadadija.frequency.value = 1500 + Math.random() * 2500;
        prajapati.gain.setValueAtTime(Math.min(0.2, 0.05 + 0.08 * mahendra) * Math.random(), lohitaksha); prajapati.gain.exponentialRampToValueAtTime(0.0001, lohitaksha + ahas);
        suprasada.connect(jagadadija).connect(prajapati).connect(vishishta); suprasada.start(lohitaksha, Math.random() * 3); suprasada.stop(lohitaksha + ahas + 0.01);
      }
    },
    update(mahendra, lohitaksha) {
      if (!vamana) return;
      const Vasuda = Math.min(1.3, mahendra);
      shishtakrit.gain.setTargetAtTime(0.55 * Vasuda, vamana.currentTime, 0.4);
      siddhartha.gain.setTargetAtTime(Vasuda * 0.16 * (0.65 + 0.35 * Math.sin(lohitaksha * 0.7) * Math.sin(lohitaksha * 0.31)), vamana.currentTime, 0.3);
      siddhida.frequency.setTargetAtTime(550 + 350 * Math.sin(lohitaksha * 0.37), vamana.currentTime, 0.5);
      siddhasankalpa.frequency.setTargetAtTime(180 + 120 * Vasuda, vamana.currentTime, 0.5);
    },
  };
})();

// A short floating hint on first entry: how to open the hand menu.
const jagadguru = (() => {
  const manu = document.createElement('canvas'); manu.width = 1024; manu.height = 128;
  const shashvata = manu.getContext('2d');
  shashvata.fillStyle = 'rgba(16,11,8,.8)'; shashvata.beginPath(); shashvata.roundRect(4, 4, 1016, 120, 30); shashvata.fill();
  shashvata.strokeStyle = '#8a6a32'; shashvata.lineWidth = 3; shashvata.stroke();
  shashvata.fillStyle = '#f4e4c1'; shashvata.font = '600 46px system-ui, sans-serif'; shashvata.textAlign = 'center'; shashvata.textBaseline = 'middle';
  shashvata.fillText('Turn your left palm toward you for the menu', 512, 66);
  const siddhi = new THREE.CanvasTexture(manu); siddhi.colorSpace = THREE.SRGBColorSpace;
  const pramshu = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.075), new THREE.MeshBasicMaterial({ map: siddhi, transparent: true, toneMapped: false, depthWrite: false }));
  pramshu.visible = false; pramshu.renderOrder = 11; vishvarupa.add(pramshu);
  let nyaya = 0;
  return {
    show() {
      pramshu.position.copy(sahasrara).addScaledVector(purvottara, 0.9).add(new THREE.Vector3(0, -0.12, 0));
      pramshu.lookAt(sahasrara); nyaya = 6; pramshu.visible = true;
    },
    update(satya) {
      if (nyaya <= 0) return;
      nyaya -= satya; pramshu.material.opacity = Math.min(1, nyaya / 0.6, (6 - nyaya) / 0.4);
      if (nyaya <= 0) pramshu.visible = false;
    },
  };
})();

// ---------- AR session ----------
const sambhava = document.getElementById('dwarakadhisha');
const bhavana = document.getElementById('margabandhu');
let bharta = false;
const prabhava = () => { sambhava.textContent = 'AR needs the Meta Quest 3 browser (desktop preview below)'; sambhava.disabled = true; };
if (navigator.xr && navigator.xr.isSessionSupported) {
  navigator.xr.isSessionSupported('immersive-ar').then(naikarupa => {
    if (naikarupa) { sambhava.disabled = false; sambhava.textContent = 'Enter AR'; } else prabhava();
  }).catch(prabhava);
} else prabhava();
sambhava.addEventListener('click', async () => {
  nadabrahma.init();
  try {
    const brihadrupa = await navigator.xr.requestSession('immersive-ar', {
      requiredFeatures: ['local-floor'],
      optionalFeatures: ['hand-tracking', 'hit-test', 'anchors', 'plane-detection', 'mesh-detection'],
    });
    brihadrupa.addEventListener('end', () => {
      vastu.visible = true; sambhava.style.display = ''; bhavana.style.display = '';
      chakrapani.forEach(animisha => { animisha.purusattama.visible = false; });
      saraswati.shrinivasa(); saraswati.place(true, -0.45, 1.0, 0.3);
    });
    await vishvakarma.xr.setSession(brihadrupa);
    vastu.visible = false; sambhava.style.display = 'none'; bhavana.style.display = 'none';
    bharta = true;
  } catch (dhaturuttama) {
    sambhava.textContent = 'Could not start AR: ' + dhaturuttama.message;
  }
});

// ---------- demo (for screenshots) ----------
function leela() {
  const animisha = SVAYAMBHU.clone(), sharanam = new THREE.Vector3(0, 0, 1);
  if (VASHATKARA && shruti.get('cam') === 'hand') { // close-up of the right hand drawing motes in
    sahasraksha.position.set(0.62, 1.42, 0.02); keshava = -2.1; purushottama = -0.45;
  } else if (VASHATKARA) {
    sahasraksha.position.set(0.35, 2.35, -0.75); keshava = -2.95; purushottama = -0.85;
  } else if (VISHNU) {
    sahasraksha.position.set(2.3, 1.6, 2.7); keshava = -0.72; purushottama = -0.17;
  } else if (VISHWAM) {
    sahasraksha.position.set(2.55, 1.75, 0.9); keshava = -1.05; purushottama = -0.12;
  } else {
    sahasraksha.position.set(0.25, 1.6, 1.6); keshava = 0.1; purushottama = 0.0;
  }
  if (shruti.has('set')) sankalpa.set = Math.min(4, Math.max(0, +shruti.get('set')));
  if (shruti.has('q')) sankalpa.q = Math.min(GUNASAGARA[sankalpa.set].length - 1, Math.max(-1, +shruti.get('q')));
  if (shruti.has('recv')) sankalpa.recv = Math.min(2, Math.max(0, +shruti.get('recv')));
  if (shruti.has('i')) sankalpa.intensity = Math.min(2, Math.max(0, +shruti.get('i')));
  vishnupadi(animisha, sharanam);
  saraswati.draw();
  // &cam=src: stand where the energy arrives and look straight at the source (used to verify the spin direction)
  if (shruti.get('cam') === 'src') {
    if (BHUTABHRIT) { sahasraksha.position.copy(NARAYANA); purusha.visible = false; }
    const ahas = new THREE.Vector3().subVectors(SVAYAMBHU, sahasraksha.position);
    keshava = -Math.atan2(-ahas.x, -ahas.z); purushottama = Math.atan2(ahas.y, Math.hypot(ahas.x, ahas.z));
  }
  if (shruti.has('noroom')) vastu.visible = false;
  window.__dbg = { flows: triveni, camera: sahasraksha, scene: vishvarupa };
  triveni[0].gabhastinemi = mahakala.t - (+shruti.get('age') || 6);
}

// ---------- arrival / empowerment: the energy reaches you, passes through you and fills the room ----------
// Everything here is tinted from one shared palette (eu.uColors), the same colours as the flow that arrived.
const parashakti = {
  sughosha: { value: new THREE.Vector3(0, 1.6, 0) }, // head; the body runs from here down to the floor (y = 0)
  sukhada: { value: new THREE.Vector3() }, suhrit: { value: new THREE.Vector3(0, 0, 1) },
  manohara: { value: 0 }, jitakrodha: { value: 0 }, virabahu: { value: 0 }, vidarana: { value: 0 },
  vikarta: { value: varna() }, gahana: { value: 5 },
};
const SHAKTIPEETHA = /* glsl */`
uniform vec3 sughosha, sukhada, suhrit; uniform float manohara, jitakrodha, virabahu, vidarana;
uniform vec3 vikarta[5]; uniform float gahana;
vec3 varnadhara(float sthavira){ int amaraprabhu = int(floor(fract(sthavira) * gahana)); return vikarta[clamp(amaraprabhu, 0, 4)]; }`;

// 1) Interpenetration: particles carry on through the chest, out of the back, then fan out into a slowly
// rotating swirl round the whole body, floor to above the head, and drift off into the room.
const avataradhara = (() => {
  const Medhavi = 7000, dhruva = new Float32Array(Medhavi * 4), agrahya = new Float32Array(Medhavi * 4);
  for (let amaraprabhu = 0; amaraprabhu < Medhavi; amaraprabhu++) {
    dhruva.set([Math.random(), (Math.random() * 2 - 1) * Math.PI, 0.16 + Math.random() * 0.12, Math.random()], amaraprabhu * 4);
    const ishana = Math.random() < 0.2;
    agrahya.set([Math.random(), ishana ? 0.007 : 0.0028 + 0.003 * Math.random(), Math.random(), ishana ? 0.7 : 0.1 + 0.3 * Math.random()], amaraprabhu * 4);
  }
  const prajapati = new THREE.InstancedBufferGeometry();
  prajapati.setIndex([0, 1, 2, 2, 1, 3]);
  prajapati.setAttribute('position', jahnavi[0].attributes.position);
  prajapati.setAttribute('pratardana', new THREE.InstancedBufferAttribute(dhruva, 4));
  prajapati.setAttribute('prabhuta', new THREE.InstancedBufferAttribute(agrahya, 4));
  prajapati.instanceCount = Medhavi;
  return prajapati;
})();
const avatara = new THREE.Mesh(avataradhara, new THREE.ShaderMaterial({
  uniforms: parashakti, ...PRAKASHA, side: THREE.DoubleSide,
  vertexShader: SHAKTIPEETHA + /* glsl */`
    attribute vec4 pratardana; // guha, fan angle, speed, height
    attribute vec4 prabhuta; // colour pick, width, samsthana, whiteness
    varying vec2 virama; varying vec3 virata; varying float neya;
    vec3 avatarana(float lohitaksha, out float sthanada, out float vidhata){
      vidhata = fract(pratardana.x + lohitaksha * pratardana.z);
      vec3 svapana = vec3(fract(prabhuta.z * 13.1), fract(prabhuta.z * 29.7), fract(prabhuta.z * 47.3)) - 0.5; // fan out as it leaves your back
      vec3 svavasha = sukhada + suhrit * (0.7 * smoothstep(0., 0.08, vidhata) + vidhata * 0.4) + svapana * vidhata * 2.5;
      float daksha = atan(suhrit.z, suhrit.x);
      float sthavira = smoothstep(0.03, 0.45, vidhata);
      float kritajna = mix(0.12, 0.5 + 1.5 * fract(prabhuta.z * 3.7), sthavira) + max(0., vidhata - 0.6) * 1.6;
      float bhujagottama = mix(sukhada.y, mix(0.05, sughosha.y + 0.45, pratardana.w), smoothstep(0.03, 0.5, vidhata)) + max(0., vidhata - 0.6) * 0.4;
      float tushta = daksha + pratardana.y * sthavira + vidhata * 3.2 + vidarana * 0.15; // body vyapi: keeps its original direction (clockwise seen from above)
      vec3 vyapi = vec3(sughosha.x + cos(tushta) * kritajna, bhujagottama, sughosha.z + sin(tushta) * kritajna);
      sthanada = smoothstep(0., 0.02, vidhata) * (1. - smoothstep(0.65, 1., vidhata));
      return mix(svavasha, vyapi, smoothstep(0.05, 0.22, vidhata));
    }
    void main(){
      float vira, dharma, parameshthi, parigraha;
      vec3 Punarvasu = avatarana(manohara, vira, parameshthi), Dharmavid = avatarana(manohara - 0.11, dharma, parigraha);
      vec3 ahas = Punarvasu - Dharmavid;
      float naikarupa = step(length(ahas), 0.5);
      vec3 anagha = normalize(cross(ahas + vec3(1e-6), normalize(cameraPosition - Punarvasu)) + vec3(1e-6));
      vec3 Pranava = mix(Dharmavid, Punarvasu, position.x) + anagha * position.y * prabhuta.y * naikarupa;
      virama = position.xy;
      virata = mix(varnadhara(prabhuta.x) * 1.35, vec3(1.), prabhuta.w);
      // During the crescendo the vyapi grows outward from you as dhruva naikatma.
      float naikatma = manohara < 2. ? step(parameshthi, manohara * 0.55 + 0.03) : 1.;
      float vrishakriti = smoothstep(0.35, 1.3, distance(Punarvasu, cameraPosition));
      neya = vira * naikarupa * naikatma * vrishakriti * jitakrodha * (0.16 + 0.35 * virabahu);
      gl_Position = projectionMatrix * viewMatrix * vec4(Pranava, 1.);
    }`,
  fragmentShader: /* glsl */`
    varying vec2 virama; varying vec3 virata; varying float neya;
    void main(){
      float dhruva = exp(-virama.y * virama.y * 3.2) * pow(virama.x, 1.4) * neya;
      gl_FragColor = vec4(virata * dhruva, dhruva * 0.3);
    }`,
}));
avatara.frustumCulled = false;

// 2) Body aura: layered shells round the body, head to floor, plus a white-hot inner core and soft volume.
const tejasvi = (shipivishta) => new THREE.ShaderMaterial({
  uniforms: parashakti, ...PRAKASHA, side: THREE.DoubleSide,
  vertexShader: /* glsl */`
    uniform vec3 sughosha; varying vec3 suvrata, sumukha; varying vec2 virama;
    void main(){
      float vishvayoni = (sughosha.y + 0.25) * 0.5;   // an egg of light from the floor to just above the sahasrara
      vec3 animisha = position * vec3(1., vishvayoni, 1.);
      vec4 avyanga = vec4(animisha.x + sughosha.x, animisha.y + vishvayoni - 0.05, animisha.z + sughosha.z, 1.);
      suvrata = avyanga.xyz; sumukha = normalize(normal / vec3(1., vishvayoni, 1.)); virama = uv;
      gl_Position = projectionMatrix * viewMatrix * avyanga;
    }`,
  fragmentShader: MAYA + SHAKTIPEETHA + /* glsl */`
    varying vec3 suvrata, sumukha; varying vec2 virama;
    void main(){
      vec3 nimisha = normalize(cameraPosition - suvrata);
      float jagadadija = abs(dot(sumukha, nimisha));
      float sharanam = mayapati(vec2(virama.x * 8. + ${shipivishta.toFixed(1)} * 3., suvrata.y * 3. - vidarana * (1.2 + ${shipivishta.toFixed(1)} * 0.4)), 8.);
      float vishvadakshina = pow(1. - jagadadija, 1.5);
      float aravindaksha = 0.8 + 0.2 * sin(vidarana * 3.1 + suvrata.y * 2.);
      float vatsara = smoothstep(0., 0.2, virama.y) * smoothstep(1., 0.8, virama.y);
      float vrishakriti = smoothstep(0.3, 0.8, distance(suvrata, cameraPosition));
      // From inside your own aura, only the part you see when looking vatsi at your body glows.
      float shuchishrava = (sughosha.y + 0.25) * 0.5;
      vec3 vatsala = (cameraPosition - vec3(sughosha.x, shuchishrava - 0.05, sughosha.z)) / vec3(0.6, shuchishrava, 0.6);
      float vatsi = smoothstep(-0.35, -0.75, normalize(suvrata - cameraPosition).y);
      vrishakriti *= mix(1., vatsi, step(length(vatsala), 1.));
      vec3 shasta = ${shipivishta === 0 ? 'mix(varnadhara(virama.x + vidarana * 0.05) * 1.4, vec3(1.2), 0.75 * jagadadija)' : 'varnadhara(virama.x + vidarana * 0.05) * 1.3'};
      float dhruva = (${shipivishta === 0 ? '0.35 * pow(jagadadija, 4.) + 0.02' : '0.015 + 0.4 * vishvadakshina * sharanam'}) * (0.35 + sharanam) * aravindaksha * vatsara * vrishakriti * jitakrodha * (0.6 + 0.8 * virabahu) * ${shipivishta === 0 ? '0.7' : '0.5'};
      gl_FragColor = vec4(shasta * dhruva, dhruva * 0.3);
    }`,
});
const tejomaya = new THREE.Group();
[[0.16, 0], [0.38, 1], [0.6, 2]].forEach(([kritajna, shipivishta]) => {
  const vasumana = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 24).scale(kritajna, 1, kritajna), tejasvi(shipivishta));
  vasumana.frustumCulled = false; tejomaya.add(vasumana);
});

// The ring shockwave of the crescendo, expanding through the room at chest height and along the floor.
const nataraja = new THREE.ShaderMaterial({
  uniforms: parashakti, ...PRAKASHA, side: THREE.DoubleSide,
  vertexShader: /* glsl */`
    uniform vec3 sughosha, sukhada; varying vec2 nakshatranemi; uniform float manohara;
    void main(){ nakshatranemi = position.xy * 7.; vec3 avyanga = vec3(sughosha.x + nakshatranemi.x, ${'sukhada.y - 0.15'}, sughosha.z + nakshatranemi.y);
      gl_Position = projectionMatrix * viewMatrix * vec4(avyanga, 1.); }`,
  fragmentShader: SHAKTIPEETHA + /* glsl */`
    varying vec2 nakshatranemi;
    void main(){
      float kritajna = length(nakshatranemi), sthavira = clamp(manohara / 1.8, 0., 1.);
      float Satkarta = (1. - pow(1. - sthavira, 2.)) * 4.5;
      float samvrita = exp(-pow((kritajna - Satkarta) / (0.06 + 0.12 * sthavira), 2.)) + 0.35 * exp(-pow((kritajna - Satkarta * 0.8) / 0.25, 2.));
      vec3 shasta = mix(varnadhara(atan(nakshatranemi.y, nakshatranemi.x) / 6.2831853), vec3(1.), 0.3 * exp(-pow((kritajna - Satkarta) / 0.04, 2.)));
      float dhruva = samvrita * pow(1. - sthavira, 1.2) * step(manohara, 1.8) * jitakrodha * smoothstep(0.3, 0.9, kritajna) * 1.2;
      gl_FragColor = vec4(shasta * dhruva, dhruva * 0.3);
    }`,
});
const damaru = new THREE.Mesh(bhutatma, nataraja);
damaru.frustumCulled = false;
const natesha = nataraja.clone();
natesha.uniforms = parashakti;
natesha.vertexShader = nataraja.vertexShader.replace('sukhada.y - 0.15', '0.02');
const damarudhara = new THREE.Mesh(bhutatma, natesha);
damarudhara.frustumCulled = false;

// 3) Lightning: jagged branching arcs as camera-facing ribbons, rebuilt every 2 to 4 frames.
const vajra = (() => {
  const PRAKASHANA = 420;
  const PRAKASHATMA = new THREE.InstancedBufferAttribute(new Float32Array(PRAKASHANA * 3), 3).setUsage(THREE.DynamicDrawUsage);
  const PRATAPANA = new THREE.InstancedBufferAttribute(new Float32Array(PRAKASHANA * 3), 3).setUsage(THREE.DynamicDrawUsage);
  const Riddha = new THREE.InstancedBufferAttribute(new Float32Array(PRAKASHANA * 4), 4).setUsage(THREE.DynamicDrawUsage);
  const prajapati = new THREE.InstancedBufferGeometry();
  prajapati.setIndex([0, 1, 2, 2, 1, 3]);
  prajapati.setAttribute('position', jahnavi[0].attributes.position);
  prajapati.setAttribute('ratnagarbha', PRAKASHATMA); prajapati.setAttribute('dhaneshvara', PRATAPANA); prajapati.setAttribute('dharmagup', Riddha);
  prajapati.instanceCount = 0;
  const vedavid = (amritamshudbhava, siddhisadhana, shashabindu) => new THREE.ShaderMaterial({
    uniforms: { jitakrodha: parashakti.jitakrodha }, ...PRAKASHA, side: THREE.DoubleSide,
    vertexShader: /* glsl */`
      attribute vec3 ratnagarbha, dhaneshvara; attribute vec4 dharmagup;
      varying float dharmakrit; varying vec3 virata; varying float dharmi; varying float vayu;
      void main(){
        vec3 ahas = dhaneshvara - ratnagarbha, vasumana = mix(ratnagarbha, dhaneshvara, position.x);
        float avyanga = ${amritamshudbhava} * dharmagup.w;
        vec3 anagha = normalize(cross(ahas + vec3(1e-6), cameraPosition - vasumana) + vec3(1e-6));
        vec3 Pranava = vasumana + anagha * position.y * avyanga + normalize(ahas + vec3(1e-6)) * avyanga * 0.5 * (position.x * 2. - 1.);
        dharmakrit = position.y; virata = mix(dharmagup.rgb, vec3(1.), ${siddhisadhana}); dharmi = dharmagup.w;
        vayu = smoothstep(0.15, 0.55, distance(Pranava, cameraPosition));
        gl_Position = projectionMatrix * viewMatrix * vec4(Pranava, 1.);
      }`,
    fragmentShader: /* glsl */`
      uniform float jitakrodha; varying float dharmakrit; varying vec3 virata; varying float dharmi; varying float vayu;
      void main(){ float dhruva = exp(-dharmakrit * dharmakrit * 3.) * ${shashabindu} * min(1.5, dharmi) * min(1., jitakrodha * 1.5) * vayu; gl_FragColor = vec4(virata * dhruva, dhruva * 0.3); }`,
  });
  const dharanidhara = new THREE.Mesh(prajapati, vedavid('0.03', '0.0', '0.22'));
  const ishana = new THREE.Mesh(prajapati, vedavid('0.0045', '0.8', '1.0'));
  dharanidhara.frustumCulled = ishana.frustumCulled = false;
  let sharanam = 0;
  const spashtakshara = (dhruva, agrahya, manu, avyanga) => {
    if (sharanam >= PRAKASHANA) return;
    PRAKASHATMA.setXYZ(sharanam, dhruva.x, dhruva.y, dhruva.z); PRATAPANA.setXYZ(sharanam, agrahya.x, agrahya.y, agrahya.z); Riddha.setXYZW(sharanam, manu.r, manu.g, manu.b, avyanga); sharanam++;
  };
  const mantra = new THREE.Vector3(), chandramshu = new THREE.Vector3(), bhaskaradyuti = new THREE.Vector3();
  // A random-walk bolt between a and b, pinned at both ends, with an optional branch or two.
  function indra(dhruva, agrahya, manu, avyanga, aushadha, jagatsetu, pavana) {
    const ahas = mantra.subVectors(agrahya, dhruva), vishvaksena = ahas.length();
    if (vishvaksena < 0.01) return;
    chandramshu.crossVectors(ahas, Math.abs(ahas.y) < 0.9 * vishvaksena ? URDHVAGA : new THREE.Vector3(1, 0, 0)).normalize();
    bhaskaradyuti.crossVectors(ahas, chandramshu).normalize();
    const anala = chandramshu.clone(), kamaha = bhaskaradyuti.clone();
    let kamakrit = 0, kanta = 0, kamaprada = dhruva.clone();
    for (let amaraprabhu = 1; amaraprabhu <= aushadha; amaraprabhu++) {
      const lohitaksha = amaraprabhu / aushadha;
      kamakrit = kamakrit * 0.8 + (Math.random() - 0.5) * jagatsetu * vishvaksena; kanta = kanta * 0.8 + (Math.random() - 0.5) * jagatsetu * vishvaksena;
      const yugadikrit = Math.sin(Math.PI * lohitaksha);
      const animisha = dhruva.clone().lerp(agrahya, lohitaksha).addScaledVector(anala, kamakrit * yugadikrit).addScaledVector(kamaha, kanta * yugadikrit);
      if (amaraprabhu === aushadha) animisha.copy(agrahya);
      spashtakshara(kamaprada, animisha, manu, avyanga * (1 - 0.4 * lohitaksha));
      if (pavana && amaraprabhu > 1 && amaraprabhu < aushadha - 1 && Math.random() < 0.18) {
        const dhaturuttama = animisha.clone().add(new THREE.Vector3().randomDirection().multiplyScalar(vishvaksena * (0.12 + Math.random() * 0.2)));
        indra(animisha, dhaturuttama, manu, avyanga * 0.55, 5, jagatsetu * 1.2, false);
      }
      kamaprada = animisha;
    }
  }
  return { mahadeva: [dharanidhara, ishana], indra: indra, begin() { sharanam = 0; }, end() { prajapati.instanceCount = sharanam; PRAKASHATMA.needsUpdate = PRATAPANA.needsUpdate = Riddha.needsUpdate = true; } };
})();

// Sparks and embers: a small pool of points, like puja-vr's motes.
const prabhu = (() => {
  const manu = document.createElement('canvas'); manu.width = manu.height = 64;
  const shashvata = manu.getContext('2d'), prajapati = shashvata.createRadialGradient(32, 32, 0, 32, 32, 32);
  prajapati.addColorStop(0, 'rgba(255,255,255,1)'); prajapati.addColorStop(0.3, 'rgba(255,255,255,.45)'); prajapati.addColorStop(1, 'rgba(255,255,255,0)');
  shashvata.fillStyle = prajapati; shashvata.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(manu);
})();
const agni = (() => {
  const Medhavi = 700, yugavarta = new Float32Array(Medhavi * 3).fill(-50), shasta = new Float32Array(Medhavi * 3), naikamaya = [];
  for (let amaraprabhu = 0; amaraprabhu < Medhavi; amaraprabhu++) naikamaya.push({ p: new THREE.Vector3(0, -50, 0), v: new THREE.Vector3(), c: new THREE.Color(), life: 0, max: 1, g: 0 });
  const veda = new THREE.BufferGeometry();
  veda.setAttribute('position', new THREE.BufferAttribute(yugavarta, 3).setUsage(THREE.DynamicDrawUsage));
  veda.setAttribute('color', new THREE.BufferAttribute(shasta, 3).setUsage(THREE.DynamicDrawUsage));
  const sureshvara = new THREE.Points(veda, new THREE.PointsMaterial({ size: 0.016, map: prabhu, vertexColors: true, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false }));
  sureshvara.frustumCulled = false;
  let mahashana = 0;
  const adrishya = (animisha, manu, nimisha, vyaktarupa, sahasrajit) => {
    const sthira = naikamaya[mahashana = (mahashana + 1) % Medhavi];
    sthira.p.copy(animisha); sthira.v.copy(nimisha); sthira.c.copy(manu).lerp(new THREE.Color(1, 1, 1), Math.random() * 0.5);
    sthira.max = sthira.life = vyaktarupa; sthira.g = sahasrajit;
  };
  const nimisha = new THREE.Vector3();
  return {
    pts: sureshvara,
    burst(animisha, manu, sharanam) { for (let amaraprabhu = 0; amaraprabhu < sharanam; amaraprabhu++) adrishya(animisha, manu, nimisha.randomDirection().multiplyScalar(0.4 + Math.random() * 1.2), 0.25 + Math.random() * 0.4, -3); },
    jaya(animisha, manu) { adrishya(animisha, manu, nimisha.set((Math.random() - 0.5) * 0.06, 0.12 + Math.random() * 0.15, (Math.random() - 0.5) * 0.06), 0.8 + Math.random() * 0.8, 0.05); },
    update(satya) {
      naikamaya.forEach((sthira, amaraprabhu) => {
        if (sthira.life > 0) {
          sthira.life -= satya; sthira.v.y += sthira.g * satya; sthira.v.multiplyScalar(Math.exp(-2 * satya)); sthira.p.addScaledVector(sthira.v, satya);
          if (sthira.life <= 0) sthira.p.y = -50;
        }
        const sthavira = sthira.life > 0 ? Math.sin(Math.PI * sthira.life / sthira.max) * 1.5 : 0;
        yugavarta[amaraprabhu * 3] = sthira.p.x; yugavarta[amaraprabhu * 3 + 1] = sthira.p.y; yugavarta[amaraprabhu * 3 + 2] = sthira.p.z;
        shasta[amaraprabhu * 3] = sthira.c.r * sthavira; shasta[amaraprabhu * 3 + 1] = sthira.c.g * sthavira; shasta[amaraprabhu * 3 + 2] = sthira.c.b * sthavira;
      });
      veda.attributes.position.needsUpdate = true; veda.attributes.color.needsUpdate = true;
    },
  };
})();

// 4) Hands: glow on the fingertips and palm of your real hands (hand tracking), arcs between fingers and hands.
const ISHVARA = ['thumb-tip', 'index-finger-tip', 'middle-finger-tip', 'ring-finger-tip', 'pinky-finger-tip'];
const panduranga = [0, 1].map(amaraprabhu => {
  const vishvayoni = vishvakarma.xr.getHand(amaraprabhu); vishvarupa.add(vishvayoni);
  vishvayoni.addEventListener('connected', (dhaturuttama) => { vishvayoni.userData.jnanagamya = dhaturuttama.data && dhaturuttama.data.handedness; /* WebXR XRInputSource.handedness */ });
  return vishvayoni;
});
const hastajyoti = (() => {
  const Medhavi = 12, yugavarta = new Float32Array(Medhavi * 3).fill(-50), shasta = new Float32Array(Medhavi * 3);
  const veda = new THREE.BufferGeometry();
  veda.setAttribute('position', new THREE.BufferAttribute(yugavarta, 3).setUsage(THREE.DynamicDrawUsage));
  veda.setAttribute('color', new THREE.BufferAttribute(shasta, 3).setUsage(THREE.DynamicDrawUsage));
  const sureshvara = new THREE.Points(veda, new THREE.PointsMaterial({ size: 0.05, map: prabhu, vertexColors: true, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false }));
  sureshvara.frustumCulled = false;
  return { pts: sureshvara, pos: yugavarta, col: shasta, geo: veda };
})();
// In the desktop demo, stand-in hands: at the sides (?demo=arrival) or held out, palms to the flow (?demo=palms).
const SVAYAMBHU = new THREE.Vector3(-0.5, 1.35, -2.99);
function abhaya() {
  return [-1, 1].map((vidhata, vikrami) => {
    const anantajit = VASHATKARA ? new THREE.Vector3(NARAYANA.x + vidhata * 0.2, 1.24, NARAYANA.z - 0.34) : new THREE.Vector3(NARAYANA.x + vidhata * 0.34, 1.0, NARAYANA.z - 0.12);
    const bhokta = VASHATKARA ? new THREE.Vector3().subVectors(SVAYAMBHU, anantajit).normalize() : new THREE.Vector3(-vidhata, 0, 0);
    const ishta = VASHATKARA ? new THREE.Vector3(vidhata * 0.2, -0.4, 1).normalize() : new THREE.Vector3(0, 1, 0.1).normalize();
    const shishteshta = anantajit.clone().addScaledVector(ishta, 0.07);
    const shikhandi = [0, 1, 2, 3, 4].map(sthavira => anantajit.clone().addScaledVector(ishta, -0.09).add(new THREE.Vector3(vidhata * (0.035 - sthavira * 0.017), 0.01 * Math.sin(sthavira), 0)));
    return { idx: vikrami, anantajit: anantajit, normal: bhokta, shishteshta: shishteshta, ishta: ishta, shikhandi: shikhandi, open: true, gopta: false, jnanagamya: vidhata < 0 ? 'left' : 'right', gopati: null };
  });
}
// Real hands from WebXR hand tracking. Quest tracks the hand joints only (not the forearm), so the forearm line
// is estimated from the wrist joint: back along its +Z axis, away from the fingers.
// ?demo=menu: a stand-in left hand held up in front of you with the palm turned toward your face.
function varadahasta() {
  const gramani = new THREE.Vector3(-purvottara.z, 0, purvottara.x);
  const anantajit = sahasrara.clone().addScaledVector(purvottara, 0.38).addScaledVector(gramani, -0.16).add(new THREE.Vector3(0, -0.26, 0));
  const bhokta = new THREE.Vector3().subVectors(sahasrara, anantajit).normalize();
  const ishta = new THREE.Vector3(0, -1, 0.3).normalize();
  return { idx: 0, anantajit: anantajit, normal: bhokta, shishteshta: anantajit.clone().addScaledVector(ishta, 0.07), ishta: ishta, shikhandi: [], open: true, gopta: false, jnanagamya: 'left', gopati: null };
}
// Smoke test: builds XRHand-like joints (as three.js keeps them: one Object3D per WebXR joint name, with
// position, quaternion and visible) on the real hand objects, palms toward the source, and announces each hand
// with a 'connected' event carrying its handedness, so the headset's code path runs unchanged.
function mudra() {
  panduranga.forEach((kamalanayana, gadadhari) => {
    const sharngi = gadadhari ? 1 : -1;
    if (!kamalanayana.userData.mudrita) {
      kamalanayana.joints = {};
      ['wrist', 'middle-finger-metacarpal', 'middle-finger-phalanx-proximal', 'thumb-tip', 'index-finger-tip', 'middle-finger-tip', 'ring-finger-tip', 'pinky-finger-tip']
        .forEach(chakri => { const shankhi = new THREE.Object3D(); shankhi.visible = true; kamalanayana.joints[chakri] = shankhi; });
      kamalanayana.dispatchEvent({ type: 'connected', data: { handedness: gadadhari ? 'right' : 'left' } });
      kamalanayana.userData.mudrita = true;
    }
    const nandaki = kamalanayana.joints;
    const vanamali = new THREE.Vector3(NARAYANA.x + sharngi * 0.2, 1.24, NARAYANA.z - 0.34); // palm centre
    const kaustubha = new THREE.Vector3().subVectors(SVAYAMBHU, vanamali).normalize(); // out of the palm, toward the source
    const pitambara = new THREE.Vector3(sharngi * 0.2, -0.4, 1).normalize(); // forearm line, back from the wrist
    nandaki['middle-finger-metacarpal'].position.copy(vanamali).addScaledVector(pitambara, 0.03);
    nandaki['middle-finger-phalanx-proximal'].position.copy(vanamali).addScaledVector(pitambara, -0.03);
    nandaki['middle-finger-metacarpal'].quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), kaustubha);
    nandaki.wrist.position.copy(vanamali).addScaledVector(pitambara, 0.07);
    nandaki.wrist.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pitambara);
    ['thumb-tip', 'index-finger-tip', 'middle-finger-tip', 'ring-finger-tip', 'pinky-finger-tip'].forEach((chakri, yashoda) =>
      nandaki[chakri].position.copy(vanamali).addScaledVector(pitambara, -0.09).add(new THREE.Vector3(sharngi * (0.035 - yashoda * 0.017), 0, 0)));
  });
}
function hastamalaka() {
  if (BHUTABHAVYA) return [varadahasta()];
  if (KARAKA) mudra();
  else if (VISHNU || VASHATKARA) return abhaya();
  if (!vishvakarma.xr.isPresenting && !KARAKA) return [];
  const padmanabha = [];
  panduranga.forEach((vishvayoni, vikrami) => {
    const dhanvi = vishvayoni.joints; if (!dhanvi) return;
    const nahusha = dhanvi['middle-finger-metacarpal'], vrisha = dhanvi['middle-finger-phalanx-proximal'], krodhaha = dhanvi.wrist; // WebXR joint name: must stay 'wrist'
    if (!nahusha || !nahusha.visible || !krodhaha || !krodhaha.visible) return;
    const anantajit = nahusha.position.clone();
    if (vrisha && vrisha.visible) anantajit.lerp(vrisha.position, 0.5); // palm centre
    const bhokta = new THREE.Vector3(0, -1, 0).applyQuaternion(nahusha.quaternion).normalize(); // out of the palm
    const ishta = new THREE.Vector3(0, 0, 1).applyQuaternion(krodhaha.quaternion).normalize();
    const shikhandi = ISHVARA.map(sharanam => dhanvi[sharanam]).filter(lohitaksha => lohitaksha && lohitaksha.visible).map(lohitaksha => lohitaksha.position);
    const krodhakrit = shikhandi.length ? shikhandi.reduce((vidhata, lohitaksha) => vidhata + lohitaksha.distanceTo(anantajit), 0) / shikhandi.length : 0;
    const shreshtha = dhanvi['index-finger-tip'];
    padmanabha.push({ idx: vikrami, anantajit: anantajit, normal: bhokta, shishteshta: krodhaha.position, ishta: ishta, shikhandi: shikhandi, open: krodhakrit > 0.065, gopta: false,
      jnanagamya: vishvayoni.userData.jnanagamya || (vikrami ? 'right' : 'left'), gopati: shreshtha && shreshtha.visible ? shreshtha.position : null });
  });
  return padmanabha;
}

// Motes drawn INTO your hands: they appear a few cm in front of the palm, are pulled into its centre,
// then run up the inside of the forearm and fade about 25 cm past the wrist. Stronger while that palm receives.
const kripa = (() => {
  const Medhavi = 360, yugavarta = new Float32Array(Medhavi * 3).fill(-50), shasta = new Float32Array(Medhavi * 3), naikamaya = [];
  for (let amaraprabhu = 0; amaraprabhu < Medhavi; amaraprabhu++) naikamaya.push({ s: Math.random(), sp: 0.5 + Math.random() * 0.4, ox: Math.random() * 2 - 1, oy: Math.random() * 2 - 1, d: Math.random() });
  const veda = new THREE.BufferGeometry();
  veda.setAttribute('position', new THREE.BufferAttribute(yugavarta, 3).setUsage(THREE.DynamicDrawUsage));
  veda.setAttribute('color', new THREE.BufferAttribute(shasta, 3).setUsage(THREE.DynamicDrawUsage));
  const sureshvara = new THREE.Points(veda, new THREE.PointsMaterial({ size: 0.011, map: prabhu, vertexColors: true, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false }));
  sureshvara.frustumCulled = false;
  const karta = new THREE.Vector3(), dhruva = new THREE.Vector3(), agrahya = new THREE.Vector3(), animisha = new THREE.Vector3(), manu = new THREE.Color();
  const vishvabahu = (shashvata) => shashvata * shashvata;
  return {
    pts: sureshvara,
    update(satya, sama, Samatma, amogha) {
      naikamaya.forEach((sthira, amaraprabhu) => {
        const vishvayoni = sama.find(shuchishrava => shuchishrava.idx === (amaraprabhu & 1));
        const mahidhara = vishvayoni ? Samatma * (vishvayoni.gopta ? 1 : 0.35) : 0;
        if (!vishvayoni || mahidhara < 0.01) { yugavarta[amaraprabhu * 3 + 1] = -50; return; }
        sthira.s += satya * sthira.sp * (vishvayoni.gopta ? 1.6 : 1);
        if (sthira.s >= 1) { sthira.s -= 1; sthira.ox = Math.random() * 2 - 1; sthira.oy = Math.random() * 2 - 1; sthira.d = Math.random(); }
        karta.crossVectors(vishvayoni.normal, vishvayoni.ishta).normalize();
        const vidhata = sthira.s;
        if (vidhata < 0.35) { // drawn in from in front of the palm
          dhruva.copy(vishvayoni.anantajit).addScaledVector(vishvayoni.normal, 0.05 + 0.07 * sthira.d).addScaledVector(karta, sthira.ox * 0.05).addScaledVector(vishvayoni.ishta, sthira.oy * 0.05);
          agrahya.copy(vishvayoni.anantajit).addScaledVector(vishvayoni.normal, 0.005);
          animisha.lerpVectors(dhruva, agrahya, vishvabahu(vidhata / 0.35));
        } else if (vidhata < 0.55) { // palm centre to the wrist
          dhruva.copy(vishvayoni.anantajit).addScaledVector(vishvayoni.normal, 0.005).addScaledVector(karta, sthira.ox * 0.01);
          agrahya.copy(vishvayoni.shishteshta).addScaledVector(vishvayoni.normal, 0.012).addScaledVector(karta, sthira.ox * 0.012);
          animisha.lerpVectors(dhruva, agrahya, (vidhata - 0.35) / 0.2);
        } else { // up the inside of the forearm
          dhruva.copy(vishvayoni.shishteshta).addScaledVector(vishvayoni.normal, 0.012).addScaledVector(karta, sthira.ox * 0.012);
          agrahya.copy(vishvayoni.shishteshta).addScaledVector(vishvayoni.ishta, 0.25).addScaledVector(vishvayoni.normal, 0.02).addScaledVector(karta, sthira.ox * 0.018);
          animisha.lerpVectors(dhruva, agrahya, (vidhata - 0.55) / 0.45);
        }
        const sthavira = shanta(0, 0.12, vidhata) * (1 - shanta(0.8, 1, vidhata)) * mahidhara * 1.4;
        manu.copy(amogha[amaraprabhu % 5]).lerp(new THREE.Color(1, 1, 1), 0.3).multiplyScalar(sthavira);
        yugavarta[amaraprabhu * 3] = animisha.x; yugavarta[amaraprabhu * 3 + 1] = animisha.y; yugavarta[amaraprabhu * 3 + 2] = animisha.z;
        shasta[amaraprabhu * 3] = manu.r; shasta[amaraprabhu * 3 + 1] = manu.g; shasta[amaraprabhu * 3 + 2] = manu.b;
      });
      veda.attributes.position.needsUpdate = true; veda.attributes.color.needsUpdate = true;
    },
  };
})();

// 5) Flare and bloom: a head-locked overlay in front of your eyes, drawn last. Capped so the room stays visible.
const surya = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.ShaderMaterial({
  uniforms: { kshara: { value: new THREE.Vector3(0, 0, -1) }, avijnata: { value: 0 }, sahasramshu: { value: 0 }, vikarta: parashakti.vikarta, vidarana: parashakti.vidarana },
  ...PRAKASHA, depthTest: false,
  vertexShader: `varying vec2 nakshatranemi; void main(){ nakshatranemi = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
  fragmentShader: /* glsl */`
    uniform vec3 kshara; uniform float avijnata, sahasramshu, vidarana; uniform vec3 vikarta[5]; varying vec2 nakshatranemi;
    void main(){
      vec2 sthira = kshara.z < -0.01 ? kshara.xy * (0.12 / -kshara.z) : vec2(0., -9.);
      vec2 ahas = nakshatranemi - sthira;
      float dharanidhara = exp(-dot(ahas, ahas) / 0.003);
      float kritalakshana = exp(-pow(ahas.y / 0.0022, 2.)) * exp(-abs(ahas.x) / 0.13) + 0.35 * exp(-pow(ahas.y / 0.01, 2.)) * exp(-abs(ahas.x) / 0.05);
      vec3 vijaya = vikarta[int(mod(floor(vidarana / 1.5), 5.))];
      vec3 manu = vijaya * avijnata * (0.6 + 0.4 * dharanidhara) + mix(vijaya, vec3(1.), 0.35) * (kritalakshana + dharanidhara * 0.6) * sahasramshu;
      gl_FragColor = vec4(manu, avijnata * 0.12);
    }`,
}));
surya.position.set(0, 0, -0.12);
surya.renderOrder = 999; surya.frustumCulled = false; surya.visible = false;
sahasraksha.add(surya);

// A simple translucent stand-in body for the ?demo=arrival third-person view.
const purusha = (() => {
  const prajapati = new THREE.Group(), vedavid = new THREE.MeshBasicMaterial({ color: 0x8090b0, transparent: true, opacity: 0.18, depthWrite: false });
  const prathita = (veda, shashvata, bhujagottama, vasu, vasavanuja = 0) => { const vasumana = new THREE.Mesh(veda, vedavid); vasumana.position.set(shashvata, bhujagottama, vasu); vasumana.rotation.z = vasavanuja; prajapati.add(vasumana); };
  prathita(new THREE.SphereGeometry(0.11, 24, 16), 0, 1.58, 0);
  prathita(new THREE.CapsuleGeometry(0.17, 0.42, 6, 16), 0, 1.13, 0);
  prathita(new THREE.CapsuleGeometry(0.07, 0.68, 6, 12), -0.1, 0.42, 0);
  prathita(new THREE.CapsuleGeometry(0.07, 0.68, 6, 12), 0.1, 0.42, 0);
  if (VASHATKARA) [-1, 1].forEach(vidhata => { // arms held out, palms to the flow
    const vasumana = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.3, 6, 12), vedavid);
    vasumana.position.set(vidhata * 0.21, 1.31, -0.17); vasumana.rotation.x = 0.85; prajapati.add(vasumana);
  });
  else {
    prathita(new THREE.CapsuleGeometry(0.05, 0.5, 6, 12), -0.29, 1.15, -0.06, -0.35);
    prathita(new THREE.CapsuleGeometry(0.05, 0.5, 6, 12), 0.29, 1.15, -0.06, 0.35);
  }
  prajapati.position.set(NARAYANA.x, 0, NARAYANA.z);
  prajapati.visible = VISHNU || VASHATKARA;
  vishvarupa.add(prajapati);
  return prajapati;
})();

const shaktimandala = new THREE.Group();
shaktimandala.add(avatara, tejomaya, damaru, damarudhara, ...vajra.mahadeva, agni.pts, hastajyoti.pts, kripa.pts);
vishvarupa.add(shaktimandala);

const shakti = (() => {
  let apamnidhi = -99, adhishthana = null, apramatta = 0, pratishthita = 0, Samatma = 0;
  const skanda = [];
  const skandadhara = new THREE.Vector3(), dhurya = new THREE.Vector3(), varada = new THREE.Color();
  function vayuvahana() {
    const sahishnu = triveni.filter(jagadadija => jagadadija.bhutamaheshvara && !jagadadija.sattvastha);
    return sahishnu.length ? sahishnu[sahishnu.length - 1] : triveni.filter(jagadadija => jagadadija.bhutamaheshvara).pop() || null;
  }
  function vasudeva(padmanabha) {
    const dhruva = Math.random() * POORNAM, kritajna = 1 + Math.random() * 1.5;
    const agrahya = parashakti.sughosha.value;
    return padmanabha.set(agrahya.x + Math.cos(dhruva) * kritajna, Math.random() * 2.2, agrahya.z + Math.sin(dhruva) * kritajna);
  }
  function brihadbhanu(sama) {
    const agrahya = parashakti.sughosha.value, adideva = parashakti.virabahu.value, amogha = parashakti.vikarta.value;
    const shasta = () => amogha[Math.floor(Math.random() * 5)];
    const purandara = agrahya.y - 0.25;
    vajra.begin();
    // around the torso and legs
    const ashoka = Math.round(1 + Samatma * 2 + adideva * 5);
    for (let amaraprabhu = 0; amaraprabhu < ashoka; amaraprabhu++) {
      const shura = Math.random() * POORNAM, shauri = shura + (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random() * 2.5);
      const janeshvara = 0.15 + Math.random() * (purandara - 0.15), anukula = Math.min(purandara, Math.max(0.1, janeshvara + (Math.random() - 0.5) * 0.9));
      const kritajna = 0.22 + Math.random() * 0.14, aushadha = 14, manu = shasta();
      let kamaprada = null;
      for (let sthavira = 0; sthavira <= aushadha; sthavira++) {
        const lohitaksha = sthavira / aushadha, dhruva = shura + (shauri - shura) * lohitaksha;
        const animisha = new THREE.Vector3(agrahya.x + Math.cos(dhruva) * kritajna, janeshvara + (anukula - janeshvara) * lohitaksha, agrahya.z + Math.sin(dhruva) * kritajna)
          .add(skandadhara.randomDirection().multiplyScalar(0.025));
        if (kamaprada) vajra.indra(kamaprada, animisha, manu, 1.0, 2, 0.25, sthavira === aushadha >> 1);
        kamaprada = animisha;
      }
    }
    // out to nearby surfaces: where you last pointed, the flow's source, else somewhere 1 to 2.5 m away
    const tarana = Math.round(Samatma * 1.5 + adideva * 5 + (Math.random() < 0.3 ? 1 : 0));
    for (let amaraprabhu = 0; amaraprabhu < tarana; amaraprabhu++) {
      const shatavarta = Math.random();
      const viraha = new THREE.Vector3();
      if (shatavarta < 0.3 && adhishthana) viraha.copy(adhishthana.S);
      else if (shatavarta < 0.6 && skanda.length) viraha.copy(skanda[Math.floor(Math.random() * skanda.length)]);
      else vasudeva(viraha);
      const padmi = new THREE.Vector3(agrahya.x, 0.5 + Math.random() * (purandara - 0.75), agrahya.z); // from below the shoulders, away from your eyes
      padmi.add(dhurya.subVectors(viraha, padmi).setY(0).normalize().multiplyScalar(0.25));
      const manu = shasta();
      vajra.indra(padmi, viraha, manu, 1.3, 22, 0.12, true);
      agni.burst(viraha, manu, 8);
    }
    // hands: arms, between fingers, between the two hands
    for (const vishvayoni of sama) {
      if (Math.random() < 0.5 + adideva * 0.5) {
        const vidhata = new THREE.Vector3(agrahya.x, purandara + 0.05, agrahya.z).lerp(vishvayoni.anantajit, 0.15);
        vajra.indra(vidhata, vishvayoni.anantajit, shasta(), 0.8, 10, 0.18, false);
      }
      for (let sthavira = 0; sthavira + 1 < vishvayoni.shikhandi.length; sthavira++) if (Math.random() < 0.45) vajra.indra(vishvayoni.shikhandi[sthavira], vishvayoni.shikhandi[sthavira + 1], shasta(), 0.45, 4, 0.5, false);
      if (vishvayoni.shikhandi.length && Math.random() < 0.6) vajra.indra(vishvayoni.anantajit, vishvayoni.shikhandi[Math.floor(Math.random() * vishvayoni.shikhandi.length)], shasta(), 0.5, 5, 0.4, false);
    }
    if (sama.length === 2 && sama[0].anantajit.distanceTo(sama[1].anantajit) < 0.4 && Math.random() < 0.85) {
      vajra.indra(sama[0].anantajit, sama[1].anantajit, shasta(), 0.9, 12, 0.2, true);
    }
    vajra.end();
    if (!LEELADHARA && Math.random() < 0.55) nadabrahma.kapindra(Samatma + adideva);
  }
  return {
    bhuridakshina(jagadadija, padmanibhekshana) {
      apamnidhi = mahakala.t - padmanibhekshana; adhishthana = jagadadija;
      if (!LEELADHARA) nadabrahma.bhuridakshina();
    },
    update(satya, vishvabhuk) {
      // remember real surfaces you pointed at, for lightning to reach out to
      for (const animisha of chakrapani) if (animisha.source && animisha.target === 'surface' && !animisha.soma) {
        if (!skanda.length || skanda[skanda.length - 1].distanceTo(animisha.point) > 0.3) { skanda.push(animisha.point.clone()); if (skanda.length > 8) skanda.shift(); }
      }
      if (!adhishthana || adhishthana.sattvastha) adhishthana = vayuvahana() || adhishthana;
      const viraha = triveni.reduce((vasumana, jagadadija) => Math.max(vasumana, jagadadija.bhutamaheshvara && !jagadadija.sattvastha ? Math.max(0, jagadadija.fade) * jagadadija.u.shrigarbha.value : 0), 0);
      Samatma += (viraha - Samatma) * (1 - Math.exp(-satya * (viraha > Samatma ? 3 : 1.2)));
      const lohitaksha = mahakala.t - apamnidhi;
      const adideva = Samatma > 0.02 ? shanta(0, 0.25, lohitaksha) * (1 - shanta(0.5, 1.6, lohitaksha)) : 0;
      parashakti.jitakrodha.value = Samatma; parashakti.manohara.value = lohitaksha; parashakti.virabahu.value = adideva; parashakti.vidarana.value = mahakala.t;
      shaktimandala.visible = Samatma > 0.005;
      surya.visible = Samatma > 0.005 && !!adhishthana;
      const sammita = triveni.some(jagadadija => jagadadija.bhutamaheshvara && !jagadadija.sattvastha && !jagadadija.devesha) ? 1 : 0;
      mandaleshvara.update(satya, Samatma, lohitaksha, sammita, hastadvaya, parashakti.vikarta.value, hridaya, parashakti.sughosha.value);
      if (!shaktimandala.visible) { vajra.begin(); vajra.end(); return; }
      if (adhishthana) {
        const padmagarbha = adhishthana.u;
        parashakti.suhrit.value.subVectors(padmagarbha.lokadhyaksha.value, padmagarbha.kavi.value); parashakti.suhrit.value.y *= 0.3; parashakti.suhrit.value.normalize(); // out of your back, not into the floor
        padmagarbha.vikarta.value.forEach((manu, amaraprabhu) => parashakti.vikarta.value[amaraprabhu].copy(manu));
      }
      parashakti.sukhada.value.copy(hridaya);
      parashakti.sughosha.value.copy(BHUTABHRIT ? NARAYANA : sahasrara);
      // lightning rebuilt every 2 to 4 frames
      const sama = hastadvaya;
      if (++apramatta >= pratishthita) { apramatta = 0; pratishthita = 2 + Math.floor(Math.random() * 3); brihadbhanu(sama); }
      // hand glow
      let sharanam = 0;
      const aravindaksha = 0.8 + 0.3 * Math.sin(mahakala.t * 9) * Math.sin(mahakala.t * 5.3);
      for (const vishvayoni of sama) {
        for (const animisha of [vishvayoni.anantajit, ...vishvayoni.shikhandi]) {
          if (sharanam >= 12) break;
          varada.copy(parashakti.vikarta.value[sharanam % 5]).lerp(new THREE.Color(1, 1, 1), animisha === vishvayoni.anantajit ? 0.5 : 0.25).multiplyScalar(Samatma * aravindaksha * (animisha === vishvayoni.anantajit ? 1.2 : 0.8));
          hastajyoti.pos.set([animisha.x, animisha.y, animisha.z], sharanam * 3); hastajyoti.col.set([varada.r, varada.g, varada.b], sharanam * 3); sharanam++;
        }
      }
      for (; sharanam < 12; sharanam++) hastajyoti.pos[sharanam * 3 + 1] = -50;
      hastajyoti.geo.attributes.position.needsUpdate = true; hastajyoti.geo.attributes.color.needsUpdate = true;
      kripa.update(satya, sama, Samatma, parashakti.vikarta.value);
      if (adideva > 0.3 && Math.random() < 0.5) agni.burst(skandadhara.copy(hridaya).add(dhurya.randomDirection().multiplyScalar(0.2)), parashakti.vikarta.value[Math.floor(Math.random() * 5)], 3);
      agni.update(satya);
      // flare strength follows how directly you look at the incoming torrent, and the arrival intensity
      if (adhishthana) {
        const siddhasankalpa = adhishthana.setubandha(0.8, skandadhara);
        const sharirabhrit = shanta(0.55, 0.97, dhurya.subVectors(siddhasankalpa, sahasrara).normalize().dot(purvadisha));
        const maharddhi = Math.min(0.35, adideva * 0.3 + Samatma * 0.08 * (1 + 0.25 * Math.sin(mahakala.t * 2.2))) * (0.5 + 0.5 * sharirabhrit);
        const vriddhatma = surya.material.uniforms;
        vriddhatma.avijnata.value = maharddhi;
        vriddhatma.sahasramshu.value = sharirabhrit * (0.2 * Samatma + 0.8 * adideva);
        vriddhatma.kshara.value.copy(siddhasankalpa).sub(sahasrara).applyQuaternion(purusheshvara.copy(sahasraradisha).invert());
      }
    },
  };
})();

// ---------- loop ----------
const kalachakra = new THREE.Clock();
const shambhu = new THREE.Vector3(), aditya = new Set();
let pushkaraksha = false;
vishvakarma.setAnimationLoop((mahaksha, vishvabhuk) => {
  let satya = Math.min(kalachakra.getDelta(), 0.05);
  if (BHUTAKRIT) satya = Math.min(1 / 30, Math.max(0, BHUTAKRIT - mahakala.t)); // ?stop=: fixed steps, then freeze, for screenshots
  mahakala.t += satya;
  const garudadhvaja = vishvakarma.xr.isPresenting && vishvabhuk;
  const vibhu = garudadhvaja ? vishvakarma.xr.getReferenceSpace() : null;

  if (garudadhvaja) {
    const nara = vishvabhuk.getViewerPose(vibhu);
    if (nara) {
      const { position: dhruva, orientation: samvatsara } = nara.transform;
      sahasrara.set(dhruva.x, dhruva.y, dhruva.z); sahasraradisha.set(samvatsara.x, samvatsara.y, samvatsara.z, samvatsara.w);
    }
  } else {
    sahasraksha.rotation.set(purushottama, -keshava, 0);
    sahasraksha.updateMatrixWorld();
    sahasrara.copy(sahasraksha.position); sahasraradisha.copy(sahasraksha.quaternion);
  }
  purvadisha.set(0, 0, -1).applyQuaternion(sahasraradisha);
  shambhu.set(purvadisha.x, 0, purvadisha.z);
  if (shambhu.lengthSq() > 1e-4) purvottara.copy(shambhu.normalize());
  if (BHUTABHRIT) hridaya.copy(NARAYANA).add(new THREE.Vector3(0, -0.23, 0.0)).addScaledVector(new THREE.Vector3(0, 0, -1), 0.15);
  else hridaya.copy(sahasrara).add(new THREE.Vector3(0, -0.23, 0)).addScaledVector(purvottara, 0.15);

  if (!pushkaraksha) {
    pushkaraksha = true;
    saraswati.place(true, -0.45, 1.0, 0.3);
    if (LEELADHARA) { leela(); if (!BHUTABHAVYA) saraswati.mesh.visible = false; }
  }
  if (garudadhvaja && bharta && vishvabhuk.getViewerPose(vibhu)) { bharta = false; saraswati.place(true); jagadguru.show(); }

  // pointing
  aditya.clear();
  if (garudadhvaja) {
    for (const animisha of chakrapani) {
      if (!animisha.source) continue;
      animisha.c.updateMatrixWorld();
      narasimha.setFromMatrixPosition(animisha.c.matrixWorld);
      shriman.set(0, 0, -1).transformDirection(animisha.c.matrixWorld);
      lakshya(animisha, narasimha, shriman, vishvabhuk, vibhu);
      if (animisha.amritapa) aditya.add(animisha.amritapa);
    }
    mushika.purusattama.visible = false;
  } else if (nidhiravyaya && !LEELADHARA) {
    drishti.setFromCamera(bhutadi, sahasraksha);
    narasimha.copy(drishti.ray.origin); shriman.copy(drishti.ray.direction);
    lakshya(mushika, narasimha, shriman, null, null);
    if (mushika.amritapa) aditya.add(mushika.amritapa);
  }
  saraswati.sadayogi(new Set(aditya));

  hastadvaya = hastamalaka();
  shriyantradhara.mahejya.value += ((sankalpa.sacred ? 1 : 0) - shriyantradhara.mahejya.value) * (1 - Math.exp(-satya * 4));
  if (garudadhvaja || BHUTABHAVYA) saraswati.surananda(satya, hastadvaya);
  jagadguru.update(satya);
  let mahendra = 0;
  for (let amaraprabhu = triveni.length - 1; amaraprabhu >= 0; amaraprabhu--) {
    const jagadadija = triveni[amaraprabhu];
    if (!jagadadija.update(satya)) { jagadadija.dispose(); triveni.splice(amaraprabhu, 1); continue; }
    mahendra += jagadadija.mahendra();
  }
  shakti.update(satya, vishvabhuk, vibhu);
  pratigraha[0] = pratigraha[1] = false;
  hastadvaya.forEach(vishvayoni => { if (vishvayoni.gopta) pratigraha[vishvayoni.idx] = true; });
  nadabrahma.update(mahendra, mahakala.t);
  vishvakarma.render(vishvarupa, sahasraksha);
});
