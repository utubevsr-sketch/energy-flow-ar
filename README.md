# Energy Flow AR

A mixed-reality (passthrough) web app for **Meta Quest 3**. You see your own room. Point at any wall or piece of furniture with your hand, pinch, and a larger-than-life torrent of luminous energy swirls out of that spot like a hurricane and pours into your chest. When it reaches you it passes through your body, wraps you in an aura and crackling lightning, and fills the room around you.

Hands only, no controllers. The qualities and their colours come from Puja VR.

**Open it:** https://utubevsr-sketch.github.io/energy-flow-ar/

![First-person view](screenshots/preview.png)

## How to use it on Quest 3

1. Put on the headset and open the **Meta Quest Browser**.
2. Go to the address above and tap **Enter AR**. Allow the permissions it asks for: hand tracking and spatial data (the spatial data lets it find your walls).
3. Put the controllers down. Hand tracking turns on by itself.
4. A thin glowing ray comes out of each hand. Where it touches a real surface you see a glowing ring.
5. **Pinch** (thumb and index finger) to cast a flow from that spot. The vortex spins up on the surface for about a second, then the torrent races to you and keeps flowing.
6. The flow follows you as you move. It keeps going until you press **Clear flows**.

### The menu panel

It floats about 0.7 m in front of you, a little below eye level. Point at it and pinch to press a button. A pinch on the panel never casts a flow.

- **Set 1 to Set 5**: the five quality sets (24 qualities) from Puja VR.
- The qualities of the set, each with its colour, and **All of this set together** (a flow in all the set's colours).
- **Intensity**: Gentle, Strong (the default) or Torrent.
- **Clear flows**: fades out every flow.
- **Hide menu**: hides the panel and leaves a small glowing orb. Pinch the orb to bring the menu back.

If you turn away, the panel follows you after about 2 seconds. Your choices are saved for next time.

### Room setup (for surface hit-tests)

The app uses the Quest's knowledge of your room to find walls and furniture. If you have not done so, run **Settings → Physical space → Space setup** and mark your walls and furniture. Without it, a pinch casts the flow from a point in the air 2.5 m along your ray (the ring then looks dimmer).

## When the energy reaches you (the arrival)

- **Through you:** the torrent does not stop at your chest. It carries on out of your back and sides and fans out into a slowly turning swirl around your whole body, from the floor to above your head, then drifts out into the room and fades.
- **Aura:** layered shells of light around your body, from your head to the floor, with a white-hot core, pulsing.
- **Lightning:** jagged, branching arcs, rebuilt every 2 to 4 frames, wrap your torso and arms. Some reach out to the flow's source, to the surfaces you pointed at, or to points 1 to 2.5 m away. Sparks fly where they strike.
- **Your hands crackle:** with hand tracking your fingertips and palms glow, small arcs jump between your fingers, an arc jumps between your hands when they are within 40 cm of each other, and embers rise off them.
- **Flare and bloom:** a soft wash of the quality's colour and a horizontal lens-flare streak across the incoming torrent. It gets stronger when you look straight at the flow. It is capped so you can always see your room (about 35% at the peak, then a gentle pulse around 10%).
- **Crescendo:** for about 1.5 s on arrival there is a big burst, with ring shockwaves expanding through the room at chest height and along the floor and a deep whoosh. Then it settles into a calmer, sustained state with electric crackle for as long as the flow runs.

**One colour for everything:** every layer is tinted in the selected quality's colour. That covers the torrent, vortex, beam, aura, lightning, sparks, hand glow, flare, shockwave and the pointing ray. Cores can go white-hot. "All of this set together" uses the set's colours on every layer. When you choose a different quality, flows that are already running change to the new colour over about a second. Dark colours (for example Restraint) are lifted, and pale ones (for example Divine Justice) get a stronger tint, so they still read clearly. Deep Connection with the Divine stays pure white.

## Sound

There is a rumble and whoosh that follows how much energy is flowing, a rising tone when you cast, a chime when the energy reaches you, a deep whoosh on arrival and electric crackle with the lightning. Sound starts when you tap Enter AR.

## Desktop preview

Open the page in a normal browser. You get a dim stand-in room. Drag to look around, click a wall or the furniture to cast a flow, and click the panel to choose.

For screenshots and checks:

| URL | Shows |
| --- | --- |
| `?demo` | First-person view of a flow from the front wall |
| `?demo=side` | Third-person view of the flow going to a stand-in person |
| `?demo=arrival` | Third-person view of the arrival, with a translucent stand-in body and stand-in hands |
| `&set=0..4&q=0..4` (`q=-1` is all together), `&i=0..2` | Quality and intensity for the demo |
| `&stop=2.4` | Runs in fixed steps to that many seconds after the cast, then freezes (2 s is about when the energy arrives) |
| `&hide=disk,sheath,haze,core,streaks,chest` | Turns flow layers off, for tuning |

Screenshots are in [`screenshots/`](screenshots/).

## Guesses to confirm

- Up to **3 flows** at once. A fourth replaces the oldest.
- A flow keeps going **until you clear it**.
- Timings: the vortex spins up in about 0.8 s, the torrent takes about 1.2 s to reach you, and the arrival crescendo lasts about 1.5 s.
- The funnel and vortex sizes scale with distance (funnel mouth 0.3 to 0.8 m, swirl on the surface 0.6 to 1.5 m), so a nearby surface does not swamp you.
- The flow aims at your chest: 42 cm below and 12 cm in front of your eyes.
- A new quality choice re-tints flows that are already running.
- The flare peaks at about 35% wash and settles to about 10%.

## Technical notes

- WebXR `immersive-ar` session with Three.js r160 (vendored in `vendor/three/`). There is no build step, only `index.html` and `main.js`. `main.js` is loaded with a timestamp so the headset never runs a stale copy.
- Everything moves on the GPU: the torrent (9k, 18k or 30k streaks depending on intensity), the arrival swirl (7k streaks), the core beam, the sheath, the vortex and the haze are positioned analytically in shaders. Only the lightning (at most 420 segments), sparks and hand glow are updated on the CPU.
- Hit-test sources come from each hand's target-ray space. Hand joints come from `renderer.xr.getHand()`. Foveation is set to 0.5.
- Glow blending adds colour while keeping alpha low (colour One/One, alpha One/OneMinusSrcAlpha), so the passthrough stays visible.
- Hosted on GitHub Pages from the `main` branch root.
