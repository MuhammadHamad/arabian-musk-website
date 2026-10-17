"""
Arabian Musk product photography, rendered in Blender (Cycles).

    blender -b --factory-startup --python scripts/render/scene.py -- <shot> <out.png> [scale] [samples] [setting]

Shots: perfume, attar, hero, hero_tall, duo.
Settings: plaster (jaali wall, default), marble, wood (amber wall), sand (desert at dusk), amber (hero). The perfume label is left blank on purpose:
the website sets each scent's name on it, so one render serves every scent.
Prints the label's position in the frame (as % of width/height) for the site's CSS.
"""
import math
import sys

import bpy
import numpy as np
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
SHOT = argv[0] if argv else "perfume"
OUT = argv[1] if len(argv) > 1 else f"/tmp/{SHOT}.png"
SCALE = float(argv[2]) if len(argv) > 2 else 1.0
SAMPLES = int(argv[3]) if len(argv) > 3 else 256
# Setting: plaster (jaali wall), marble, wood (amber glow), sand (desert at dusk), amber (hero).
ENV = argv[4] if len(argv) > 4 else "plaster"

# Palette (linear-ish sRGB values picked to match the site).
PLASTER = (0.78, 0.63, 0.48)
STONE = (0.55, 0.45, 0.35)
GOLD = (0.80, 0.58, 0.30)
PAPER = (0.90, 0.85, 0.76)
INK = (0.33, 0.24, 0.15)
AMBER = (0.97, 0.88, 0.55)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
prefs = bpy.context.preferences.addons["cycles"].preferences
try:
    prefs.compute_device_type = "METAL"
    prefs.get_devices()
    for d in prefs.devices:
        d.use = d.type == "METAL"
    scene.cycles.device = "GPU"
except Exception:
    scene.cycles.device = "CPU"
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 16
scene.cycles.transmission_bounces = 16
scene.cycles.transparent_max_bounces = 16
scene.cycles.caustics_reflective = False
scene.cycles.caustics_refractive = False
scene.cycles.blur_glossy = 0.5
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Medium High Contrast"
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_depth = "8"
scene.render.filepath = OUT


# ---------------------------------------------------------------- materials
def mat(name, build):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    build(nt, out)
    return m


def principled(nt, **kw):
    p = nt.nodes.new("ShaderNodeBsdfPrincipled")
    for k, v in kw.items():
        p.inputs[k].default_value = v
    return p


def glass_mat():
    def b(nt, out):
        g = nt.nodes.new("ShaderNodeBsdfGlass")
        g.inputs["IOR"].default_value = 1.5
        g.inputs["Roughness"].default_value = 0.0
        g.inputs["Color"].default_value = (0.97, 0.98, 0.97, 1)
        nt.links.new(g.outputs[0], out.inputs["Surface"])
    return mat("Glass", b)


def oil_mat(density=120.0, color=None):
    color = color or AMBER
    def b(nt, out):
        g = nt.nodes.new("ShaderNodeBsdfGlass")
        g.inputs["IOR"].default_value = 1.36
        g.inputs["Roughness"].default_value = 0.0
        v = nt.nodes.new("ShaderNodeVolumeAbsorption")
        v.inputs["Color"].default_value = (*color, 1)
        v.inputs["Density"].default_value = density
        nt.links.new(g.outputs[0], out.inputs["Surface"])
        nt.links.new(v.outputs[0], out.inputs["Volume"])
    return mat(f"Oil{density:.0f}", b)


def gold_mat():
    def b(nt, out):
        p = principled(nt, **{"Base Color": (*GOLD, 1), "Metallic": 1.0, "Roughness": 0.2})
        nt.links.new(p.outputs[0], out.inputs["Surface"])
    return mat("Gold", b)


def onyx_mat():
    def b(nt, out):
        p = principled(nt, **{"Base Color": (0.012, 0.010, 0.009, 1), "Roughness": 0.45, "Coat Weight": 0.12, "Coat Roughness": 0.35})
        nt.links.new(p.outputs[0], out.inputs["Surface"])
    return mat("Onyx", b)


def textured_mat(name, color, roughness, bump=0.04, scale=60.0, veins=False):
    def b(nt, out):
        p = principled(nt, **{"Base Color": (*color, 1), "Roughness": roughness})
        tex = nt.nodes.new("ShaderNodeTexNoise")
        tex.inputs["Scale"].default_value = scale
        tex.inputs["Detail"].default_value = 8.0
        bm = nt.nodes.new("ShaderNodeBump")
        bm.inputs["Strength"].default_value = bump
        nt.links.new(tex.outputs["Fac"], bm.inputs["Height"])
        nt.links.new(bm.outputs["Normal"], p.inputs["Normal"])
        # Slight colour variation, like lime plaster or travertine.
        ramp = nt.nodes.new("ShaderNodeValToRGB")
        ramp.color_ramp.elements[0].color = tuple(c * 0.93 for c in color) + (1,)
        ramp.color_ramp.elements[1].color = tuple(min(1, c * 1.05) for c in color) + (1,)
        big = nt.nodes.new("ShaderNodeTexNoise")
        big.inputs["Scale"].default_value = 3.0 if not veins else 1.2
        big.inputs["Detail"].default_value = 4.0
        if veins:
            w = nt.nodes.new("ShaderNodeTexWave")
            w.inputs["Scale"].default_value = 4.0
            w.inputs["Distortion"].default_value = 9.0
            nt.links.new(w.outputs["Fac"], ramp.inputs["Fac"])
        else:
            nt.links.new(big.outputs["Fac"], ramp.inputs["Fac"])
        nt.links.new(ramp.outputs["Color"], p.inputs["Base Color"])
        nt.links.new(p.outputs[0], out.inputs["Surface"])
    return mat(name, b)


def image_mat(name, img, roughness=0.55, glow=0.0):
    def b(nt, out):
        t = nt.nodes.new("ShaderNodeTexImage")
        t.image = img
        p = principled(nt, Roughness=roughness)
        nt.links.new(t.outputs["Color"], p.inputs["Base Color"])
        if glow:
            # A little self-light keeps printed paper reading as paper under studio light.
            nt.links.new(t.outputs["Color"], p.inputs["Emission Color"])
            p.inputs["Emission Strength"].default_value = glow
        nt.links.new(p.outputs[0], out.inputs["Surface"])
    return mat(name, b)


def screen_mat(img):
    """Opaque where the lattice is solid, see-through where it is cut."""
    def b(nt, out):
        t = nt.nodes.new("ShaderNodeTexImage")
        t.image = img
        mix = nt.nodes.new("ShaderNodeMixShader")
        tr = nt.nodes.new("ShaderNodeBsdfTransparent")
        dif = nt.nodes.new("ShaderNodeBsdfDiffuse")
        dif.inputs["Color"].default_value = (0.05, 0.04, 0.03, 1)
        nt.links.new(t.outputs["Alpha"], mix.inputs["Fac"])
        nt.links.new(tr.outputs[0], mix.inputs[1])
        nt.links.new(dif.outputs[0], mix.inputs[2])
        nt.links.new(mix.outputs[0], out.inputs["Surface"])
    m = mat("Screen", b)
    m.blend_method = "CLIP"
    return m


# ---------------------------------------------------------------- textures
def lattice_image(px=2048, tiles=22):
    """Eight-pointed stars with small crosses between them: a jaali screen. Alpha 1 = solid."""
    y, x = np.mgrid[0:px, 0:px].astype(np.float32)
    t = px / tiles
    u = (x % t) / t - 0.5
    v = (y % t) / t - 0.5
    s = 0.27
    star = (np.maximum(abs(u), abs(v)) < s) | (np.maximum(abs(u + v), abs(u - v)) / math.sqrt(2) < s)
    cu = abs(abs(u) - 0.5)
    cv = abs(abs(v) - 0.5)
    cross = ((cu < 0.035) & (cv < 0.13)) | ((cv < 0.035) & (cu < 0.13))
    # Pointed arch in texture space (0..1); image rows run bottom to top.
    X = x / px
    Y = y / px
    cx, half, spring = 0.5, 0.17, 0.52
    r = half * 1.6
    in_rect = (abs(X - cx) <= half) & (Y >= 0.08) & (Y <= spring)
    left_c = (cx + half - r, spring)
    right_c = (cx - half + r, spring)
    in_point = (Y > spring) & (((X - left_c[0]) ** 2 + (Y - left_c[1]) ** 2) <= r * r) & (((X - right_c[0]) ** 2 + (Y - right_c[1]) ** 2) <= r * r)
    arch = in_rect | in_point
    hole = (star | cross) & arch
    rgba = np.ones((px, px, 4), dtype=np.float32)
    rgba[..., :3] = 0.05
    rgba[..., 3] = np.where(hole, 0.0, 1.0)
    img = bpy.data.images.new("lattice", px, px, alpha=True)
    img.pixels.foreach_set(rgba.ravel())
    img.pack()
    return img


def label_image(w=600, h=900):
    """Black label with a fine gold double rule; the words are set by the website."""
    rgba = np.ones((h, w, 4), dtype=np.float32)
    rgba[..., :3] = (0.035, 0.031, 0.028)
    y, x = np.mgrid[0:h, 0:w]
    def frame(m, th):
        inside = (x >= m) & (x < w - m) & (y >= m) & (y < h - m)
        inner = (x >= m + th) & (x < w - m - th) & (y >= m + th) & (y < h - m - th)
        return inside & ~inner
    rule = frame(22, 3) | frame(34, 1)
    rgba[rule, :3] = (0.78, 0.60, 0.34)
    img = bpy.data.images.new("label", w, h, alpha=True)
    img.pixels.foreach_set(rgba.ravel())
    img.pack()
    return img


# ---------------------------------------------------------------- geometry
def add(obj, m):
    obj.data.materials.append(m)
    return obj


def box(name, size, loc, m, bevel=0.0, segs=6):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.object
    o.name = name
    o.scale = size
    bpy.ops.object.transform_apply(scale=True)
    if bevel:
        md = o.modifiers.new("bevel", "BEVEL")
        md.width = bevel
        md.segments = segs
        md.limit_method = "NONE"
    bpy.ops.object.shade_smooth()
    return add(o, m)


def lathe(name, profile, m, steps=64, loc=(0, 0, 0), smooth=True):
    """Spin a (radius, height) profile around Z."""
    me = bpy.data.meshes.new(name)
    verts = [(r, 0, z) for r, z in profile]
    edges = [(i, i + 1) for i in range(len(verts) - 1)]
    me.from_pydata(verts, edges, [])
    o = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(o)
    o.location = loc
    sc = o.modifiers.new("screw", "SCREW")
    sc.steps = steps
    sc.render_steps = steps
    sc.use_merge_vertices = True
    sc.merge_threshold = 0.00005  # the default 1 cm would collapse necks and stoppers
    sc.use_smooth_shade = smooth
    sc.use_normal_calculate = True
    return add(o, m)


def perfume_bottle(x=0.0, y=0.0, z0=0.0, label=True):
    G, O, Au, Ox = MATS["glass"], MATS["oil"], MATS["gold"], MATS["onyx"]
    w, d, h, wall, base = 0.056, 0.032, 0.088, 0.0035, 0.012
    # Thick glass: outer block, hollow cavity, heavy base.
    outer = box("Bottle", (w, d, h), (x, y, z0 + h / 2), G, bevel=0.006)
    inner = box("Cavity", (w - 2 * wall, d - 2 * wall, h - base - wall), (x, y, z0 + base + (h - base - wall) / 2), G, bevel=0.004)
    bo = outer.modifiers.new("hollow", "BOOLEAN")
    bo.object = inner
    bo.operation = "DIFFERENCE"
    bo.solver = "EXACT"
    inner.hide_render = True
    inner.hide_viewport = True
    fill = 0.78
    lh = (h - base - wall) * fill
    box("Oil", (w - 2 * wall - 0.0006, d - 2 * wall - 0.0006, lh), (x, y, z0 + base + 0.0003 + lh / 2), O, bevel=0.0035)
    # Collar, gold band and onyx cap.
    lathe("Neck", [(0.0001, z0 + h - 0.001), (0.007, z0 + h - 0.001), (0.007, z0 + h + 0.006), (0.0001, z0 + h + 0.006)], Au, steps=48)
    box("Band", (0.026, 0.026, 0.004), (x, y, z0 + h + 0.008), Au, bevel=0.0008)
    box("Cap", (0.024, 0.024, 0.034), (x, y, z0 + h + 0.010 + 0.017), Ox, bevel=0.0025)
    if label:
        lw, lhh = 0.031, 0.043
        lab = box("Label", (lw, 0.0004, lhh), (x, y - d / 2 - 0.0003, z0 + base + 0.033), MATS["label"], bevel=0.0)
        # Map the label texture onto the front face.
        bpy.context.view_layer.objects.active = lab
        bpy.ops.object.mode_set(mode="EDIT")
        bpy.ops.mesh.select_all(action="SELECT")
        bpy.ops.uv.cube_project(cube_size=1.0)
        bpy.ops.object.mode_set(mode="OBJECT")
        uv = lab.data.uv_layers.active.data
        for poly in lab.data.polygons:
            for li in poly.loop_indices:
                vi = lab.data.loops[li].vertex_index
                co = lab.data.vertices[vi].co
                uv[li].uv = ((co.x + lw / 2) / lw, (co.z + lhh / 2) / lhh)
        return outer, lab
    return outer, None


def attar_flacon(x=0.0, y=0.0, z0=0.0, scale=1.0):
    G, O, Au = MATS["glass"], MATS["oil"], MATS["gold"]
    s = scale
    body = [
        (0.0001, 0.000), (0.013, 0.000), (0.018, 0.003), (0.025, 0.013), (0.029, 0.027),
        (0.0295, 0.037), (0.027, 0.050), (0.020, 0.061), (0.011, 0.069), (0.0080, 0.073), (0.0080, 0.086), (0.0001, 0.086),
    ]
    lathe("Flacon", [(r * s, z0 + z * s) for r, z in body], G, steps=16, loc=(x, y, 0), smooth=False)
    oil = [(0.0001, 0.004), (0.015, 0.004), (0.021, 0.011), (0.0255, 0.024), (0.026, 0.034), (0.0001, 0.034)]
    lathe("FlaconOil", [(r * s, z0 + z * s) for r, z in oil], MATS["attar_oil"], steps=16, loc=(x, y, 0), smooth=False)
    # Gold collar seated on the shoulder, then a teardrop finial.
    stopper = [
        (0.0001, 0.0675), (0.0112, 0.0675), (0.0112, 0.0790), (0.0128, 0.0805), (0.0128, 0.0840),
        (0.0062, 0.0870), (0.0108, 0.0990), (0.0142, 0.1110), (0.0134, 0.1220), (0.0094, 0.1330),
        (0.0047, 0.1430), (0.0001, 0.1510),
    ]
    lathe("Stopper", [(r * s, z0 + z * s) for r, z in stopper], Au, steps=16, loc=(x, y, 0), smooth=False)


# ---------------------------------------------------------------- set
def build_set(width=1.6):
    # Plaster sweep: floor curving up into the wall behind.
    me = bpy.data.meshes.new("Sweep")
    prof = []
    for i in range(41):
        a = i / 40
        if a < 0.5:
            prof.append((0.0, -0.6 + a * 2 * 0.75))
        else:
            t = (a - 0.5) * 2 * math.pi / 2
            prof.append((0.25 - 0.25 * math.cos(t), 0.15 + 0.25 * math.sin(t)))
    prof.append((1.2, 0.40))
    verts, faces = [], []
    for side in (-width / 2, width / 2):
        for zz, yy in prof:
            verts.append((side, yy, zz))
    n = len(prof)
    for i in range(n - 1):
        faces.append((i, i + 1, n + i + 1, n + i))
    me.from_pydata(verts, [], faces)
    o = bpy.data.objects.new("Sweep", me)
    bpy.context.collection.objects.link(o)
    o.location = (0, 0.05, -0.09)
    for p in me.polygons:
        p.use_smooth = True
    add(o, MATS["plaster"])
    # Travertine plinth.
    box("Plinth", (0.30, 0.20, 0.09), (0, 0.02, -0.045), MATS["stone"], bevel=0.002)


def lights(pattern=True, target_x=0.045):
    def area(name, loc, rot, size, energy, color=(1, 0.93, 0.85), shape="RECTANGLE", size_y=None):
        bpy.ops.object.light_add(type="AREA", location=loc, rotation=rot)
        l = bpy.context.object
        l.name = name
        l.data.shape = shape
        l.data.size = size
        if size_y:
            l.data.size_y = size_y
        l.data.energy = energy
        l.data.color = color
        return l

    # Soft key from front-left, rim strips behind for the glass edges, faint fill right.
    key = area("Key", (-0.55, -0.55, 0.42), (0, 0, 0), 0.6, 5.5)
    key.rotation_euler = (Vector((0, 0, 0.05)) - key.location).to_track_quat("-Z", "Y").to_euler()
    for side in (-1, 1):
        r = area(f"Rim{side}", (0.20 * side, 0.30, 0.10), (0, 0, 0), 0.04, 5, size_y=0.5)
        r.rotation_euler = (Vector((0, 0, 0.05)) - r.location).to_track_quat("-Z", "Y").to_euler()
    front = area("Front", (0.0, -0.9, 0.12), (0, 0, 0), 0.35, 8.0)
    front.rotation_euler = (Vector((0, 0, 0.05)) - front.location).to_track_quat("-Z", "Y").to_euler()
    fill = area("Fill", (0.6, -0.4, 0.2), (0, 0, 0), 0.8, 2.5, color=(0.95, 0.95, 1.0))
    fill.rotation_euler = (Vector((0, 0, 0.05)) - fill.location).to_track_quat("-Z", "Y").to_euler()
    if pattern:
        # Late-afternoon sun through a carved screen, landing on the wall.
        bpy.ops.object.light_add(type="SPOT", location=(0.42, -0.72, 0.92))
        sun = bpy.context.object
        sun.data.energy = 650
        sun.data.spot_size = math.radians(13.5)
        sun.data.spot_blend = 0.08
        sun.data.shadow_soft_size = 0.004
        sun.data.color = (1.0, 0.80, 0.58)
        target = Vector((target_x, 0.45, 0.15))
        sun.rotation_euler = (target - sun.location).to_track_quat("-Z", "Y").to_euler()
        mid = sun.location.lerp(target, 0.78)
        bpy.ops.mesh.primitive_plane_add(size=0.27, location=mid)
        scr = bpy.context.object
        scr.name = "Jaali"
        scr.rotation_euler = (target - sun.location).to_track_quat("Z", "Y").to_euler()
        add(scr, MATS["screen"])
        scr.visible_camera = False
        scr.visible_glossy = False
        scr.visible_transmission = False

    w = bpy.data.worlds.new("World")
    w.use_nodes = True
    bg = w.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (0.55, 0.47, 0.38, 1)
    bg.inputs["Strength"].default_value = 0.08
    scene.world = w


def camera(loc, look, lens=90, shift_y=0.0, res=(1200, 1500)):
    bpy.ops.object.camera_add(location=loc)
    cam = bpy.context.object
    cam.data.lens = lens
    cam.data.shift_y = shift_y
    cam.rotation_euler = (Vector(look) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    scene.camera = cam
    scene.render.resolution_x = int(res[0] * SCALE)
    scene.render.resolution_y = int(res[1] * SCALE)
    scene.render.resolution_percentage = 100
    return cam


# ---------------------------------------------------------------- other settings
def marble_mat():
    def b(nt, out):
        p = principled(nt, **{"Roughness": 0.14, "Coat Weight": 0.35})
        n = nt.nodes.new("ShaderNodeTexNoise")
        n.inputs["Scale"].default_value = 3.0
        n.inputs["Detail"].default_value = 10.0
        w = nt.nodes.new("ShaderNodeTexWave")
        w.inputs["Scale"].default_value = 2.2
        w.inputs["Distortion"].default_value = 14.0
        w.inputs["Detail"].default_value = 10.0
        nt.links.new(n.outputs["Color"], w.inputs["Vector"])
        r = nt.nodes.new("ShaderNodeValToRGB")
        r.color_ramp.elements[0].position = 0.0
        r.color_ramp.elements[0].color = (0.93, 0.92, 0.90, 1)
        r.color_ramp.elements[1].position = 0.9
        r.color_ramp.elements[1].color = (0.90, 0.89, 0.87, 1)
        e = r.color_ramp.elements.new(1.0)
        e.color = (0.52, 0.50, 0.48, 1)
        nt.links.new(w.outputs["Fac"], r.inputs["Fac"])
        nt.links.new(r.outputs["Color"], p.inputs["Base Color"])
        nt.links.new(p.outputs[0], out.inputs["Surface"])
    return mat("Marble", b)


def wood_mat():
    def b(nt, out):
        p = principled(nt, **{"Roughness": 0.55, "Coat Weight": 0.08})
        tc = nt.nodes.new("ShaderNodeTexCoord")
        mp = nt.nodes.new("ShaderNodeMapping")
        mp.inputs["Scale"].default_value = (2.0, 60.0, 60.0)
        nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
        w = nt.nodes.new("ShaderNodeTexNoise")
        w.inputs["Scale"].default_value = 3.0
        w.inputs["Detail"].default_value = 12.0
        w.inputs["Roughness"].default_value = 0.6
        nt.links.new(mp.outputs["Vector"], w.inputs["Vector"])
        r = nt.nodes.new("ShaderNodeValToRGB")
        r.color_ramp.elements[0].position = 0.3
        r.color_ramp.elements[0].color = (0.035, 0.016, 0.008, 1)
        r.color_ramp.elements[1].position = 0.7
        r.color_ramp.elements[1].color = (0.20, 0.095, 0.04, 1)
        nt.links.new(w.outputs["Fac"], r.inputs["Fac"])
        nt.links.new(r.outputs["Color"], p.inputs["Base Color"])
        bm = nt.nodes.new("ShaderNodeBump")
        bm.inputs["Strength"].default_value = 0.05
        nt.links.new(w.outputs["Fac"], bm.inputs["Height"])
        nt.links.new(bm.outputs["Normal"], p.inputs["Normal"])
        nt.links.new(p.outputs[0], out.inputs["Surface"])
    return mat("Wood", b)


def sand_mat():
    def b(nt, out):
        p = principled(nt, **{"Base Color": (0.86, 0.60, 0.34, 1), "Roughness": 0.96})
        w = nt.nodes.new("ShaderNodeTexWave")
        w.bands_direction = "Y"
        w.inputs["Scale"].default_value = 26.0
        w.inputs["Distortion"].default_value = 3.0
        w.inputs["Detail"].default_value = 3.0
        g = nt.nodes.new("ShaderNodeTexNoise")
        g.inputs["Scale"].default_value = 900.0
        mix = nt.nodes.new("ShaderNodeMath")
        mix.operation = "ADD"
        nt.links.new(w.outputs["Fac"], mix.inputs[0])
        nt.links.new(g.outputs["Fac"], mix.inputs[1])
        bm = nt.nodes.new("ShaderNodeBump")
        bm.inputs["Strength"].default_value = 0.35
        nt.links.new(mix.outputs[0], bm.inputs["Height"])
        nt.links.new(bm.outputs["Normal"], p.inputs["Normal"])
        nt.links.new(p.outputs[0], out.inputs["Surface"])
    return mat("Sand", b)


def sky_mat():
    def b(nt, out):
        tc = nt.nodes.new("ShaderNodeTexCoord")
        sep = nt.nodes.new("ShaderNodeSeparateXYZ")
        nt.links.new(tc.outputs["Generated"], sep.inputs[0])
        r = nt.nodes.new("ShaderNodeValToRGB")
        r.color_ramp.elements[0].position = 0.0
        r.color_ramp.elements[0].color = (1.0, 0.50, 0.24, 1)
        mid = r.color_ramp.elements.new(0.32)
        mid.color = (0.80, 0.38, 0.36, 1)
        r.color_ramp.elements[-1].position = 1.0
        r.color_ramp.elements[-1].color = (0.13, 0.13, 0.30, 1)
        nt.links.new(sep.outputs["Y"], r.inputs["Fac"])
        em = nt.nodes.new("ShaderNodeEmission")
        em.inputs["Strength"].default_value = 1.6
        nt.links.new(r.outputs["Color"], em.inputs["Color"])
        nt.links.new(em.outputs[0], out.inputs["Surface"])
    return mat("Sky", b)


def area_at(name, loc, target, size, energy, color=(1, 0.93, 0.85), size_y=None):
    bpy.ops.object.light_add(type="AREA", location=loc)
    l = bpy.context.object
    l.name = name
    l.data.shape = "RECTANGLE"
    l.data.size = size
    l.data.size_y = size_y or size
    l.data.energy = energy
    l.data.color = color
    l.rotation_euler = (Vector(target) - l.location).to_track_quat("-Z", "Y").to_euler()
    return l


def world(color, strength):
    w = bpy.data.worlds.new("World")
    w.use_nodes = True
    bg = w.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (*color, 1)
    bg.inputs["Strength"].default_value = strength
    scene.world = w


def glass_rims(front=8.0):
    for side in (-1, 1):
        area_at(f"Rim{side}", (0.20 * side, 0.30, 0.10), (0, 0, 0.05), 0.04, 5, size_y=0.5)
    area_at("Front", (0.0, -0.9, 0.12), (0, 0, 0.05), 0.35, front)


def set_marble():
    # Pale plaster wall, marble slab, soft daylight from a window on the left.
    MATS["plaster"] = textured_mat("PalePlaster", (0.86, 0.84, 0.81), 0.9, bump=0.04, scale=90)
    build_set()
    bpy.data.objects["Plinth"].data.materials[0] = MATS["marble"]
    area_at("Window", (-0.7, -0.25, 0.45), (0, 0.1, 0.05), 0.9, 42, color=(1.0, 0.97, 0.92))
    area_at("Fill", (0.6, -0.5, 0.2), (0, 0, 0.05), 0.8, 5, color=(0.95, 0.96, 1.0))
    glass_rims()
    world((0.8, 0.8, 0.82), 0.22)


def set_wood(jaali=False, target_x=0.045):
    # Dark wood block against a warm amber wall glowing behind the bottle.
    MATS["plaster"] = textured_mat("AmberWall", (0.22, 0.08, 0.02), 0.92, bump=0.05, scale=90)
    build_set(width=2.4)
    bpy.data.objects["Plinth"].data.materials[0] = MATS["wood"]
    area_at("Glow", (target_x, 0.12, 0.26), (target_x, 0.45, 0.10), 0.22, 8, color=(1.0, 0.52, 0.16))
    area_at("Key", (-0.55, -0.5, 0.42), (0, 0, 0.05), 0.5, 4.5, color=(1.0, 0.85, 0.65))
    glass_rims()
    world((0.25, 0.10, 0.04), 0.05)
    if jaali:
        lights_jaali_only(target_x)


def lights_jaali_only(target_x):
    bpy.ops.object.light_add(type="SPOT", location=(0.42, -0.72, 0.92))
    sun = bpy.context.object
    sun.data.energy = 520
    sun.data.spot_size = math.radians(13.5)
    sun.data.spot_blend = 0.08
    sun.data.shadow_soft_size = 0.004
    sun.data.color = (1.0, 0.72, 0.42)
    target = Vector((target_x, 0.45, 0.15))
    sun.rotation_euler = (target - sun.location).to_track_quat("-Z", "Y").to_euler()
    mid = sun.location.lerp(target, 0.78)
    bpy.ops.mesh.primitive_plane_add(size=0.27, location=mid)
    scr = bpy.context.object
    scr.rotation_euler = (target - sun.location).to_track_quat("Z", "Y").to_euler()
    add(scr, MATS["screen"])
    scr.visible_camera = False
    scr.visible_glossy = False
    scr.visible_transmission = False


def set_sand():
    # Rippled sand to the horizon under a dusk sky; low sun from behind.
    bpy.ops.mesh.primitive_plane_add(size=8, location=(0, 3.5, 0))
    floor = bpy.context.object
    add(floor, MATS["sand"])
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 7.4, 1.2))
    sky = bpy.context.object
    sky.scale = (14, 5, 1)
    sky.rotation_euler = (math.radians(90), 0, 0)
    add(sky, MATS["sky"])
    bpy.ops.object.light_add(type="SUN")
    sun = bpy.context.object
    sun.data.energy = 2.6
    sun.data.angle = math.radians(1.5)
    sun.data.color = (1.0, 0.70, 0.45)
    sun.rotation_euler = (Vector((0, 0, 0)) - Vector((-1.6, -0.9, 0.7))).to_track_quat("-Z", "Y").to_euler()
    area_at("Fill", (0.3, -0.8, 0.25), (0, 0, 0.05), 0.8, 4, color=(0.95, 0.9, 1.0))
    glass_rims(front=3.5)
    world((0.75, 0.52, 0.45), 0.45)


# ---------------------------------------------------------------- shots
MATS = {
    "glass": glass_mat(),
    "oil": oil_mat(190.0),
    "attar_oil": oil_mat(22.0, (0.97, 0.86, 0.45)),
    "gold": gold_mat(),
    "onyx": onyx_mat(),
    "plaster": textured_mat("Plaster", PLASTER, 0.92, bump=0.06, scale=90),
    "stone": textured_mat("Stone", STONE, 0.75, bump=0.03, scale=140, veins=True),
    "label": image_mat("Label", label_image(), roughness=0.78),
    "screen": screen_mat(lattice_image()),
    "marble": marble_mat(),
    "wood": wood_mat(),
    "sand": sand_mat(),
    "sky": sky_mat(),
}
HERO_DX = 0.095  # the wide hero keeps the left of the frame clear for the headline
if ENV == "marble":
    set_marble()
elif ENV == "wood":
    set_wood()
elif ENV == "sand":
    set_sand()
elif ENV == "amber":
    tx = HERO_DX + 0.03 if SHOT == "hero" else 0.03
    set_wood(jaali=True, target_x=tx)
    if SHOT == "hero":
        bpy.data.objects["Plinth"].location.x = HERO_DX
        bpy.data.objects["Plinth"].scale.x = 1.3
elif SHOT == "hero":
    build_set(width=2.2)
    box("Plinth2", (0.36, 0.20, 0.09), (HERO_DX, 0.02, -0.045), MATS["stone"], bevel=0.002)
    bpy.data.objects["Plinth"].hide_render = True
    lights(pattern=True, target_x=HERO_DX + 0.03)
elif SHOT == "hero_tall":
    build_set()
    lights(pattern=True, target_x=0.03)
else:
    build_set()
    lights(pattern=True)

label = None
if SHOT == "perfume":
    _, label = perfume_bottle()
    camera((0, -0.62, 0.062), (0, 0, 0.062), lens=85, shift_y=0.0)
elif SHOT == "attar":
    attar_flacon(scale=1.0)
    camera((0, -0.62, 0.070), (0, 0, 0.070), lens=85)
elif SHOT == "duo":
    _, label = perfume_bottle(x=-0.036)
    attar_flacon(x=0.045, y=0.02, scale=0.9)
    camera((0, -0.75, 0.065), (0, 0, 0.065), lens=85, res=(1600, 1200))
elif SHOT in ("hero", "hero_tall"):
    dx = HERO_DX if SHOT == "hero" else 0.0
    _, label = perfume_bottle(x=-0.03 + dx)
    attar_flacon(x=0.05 + dx, y=0.025, scale=0.95)
    attar_flacon(x=-0.095 + dx, y=0.06, scale=0.7)
    if SHOT == "hero":
        camera((0.0, -0.85, 0.075), (0.0, 0, 0.075), lens=62, res=(2400, 1350))
    else:
        camera((-0.01, -0.95, 0.075), (-0.01, 0, 0.075), lens=80, res=(1200, 1600))

bpy.context.view_layer.update()
if SHOT == "attar":
    for z in (0.0, 0.037, 0.069, 0.073, 0.086, 0.092, 0.16):
        p = world_to_camera_view(scene, scene.camera, Vector((0, 0, z)))
        print(f"PROBE z={z:.3f} -> {(1 - p.y) * 100:.1f}% from top")
    for o in bpy.data.objects:
        if o.type == "MESH" and o.name.startswith(("Flacon", "Stopper")):
            ev = o.evaluated_get(bpy.context.evaluated_depsgraph_get())
            zs = [(o.matrix_world @ v.co).z for v in ev.data.vertices]
            print(f"PROBE {o.name}: z {min(zs):.3f}..{max(zs):.3f}, verts {len(zs)}")
if label is not None:
    # Where the label's front face lands in the frame, for the site's CSS.
    xs, ys = [], []
    for v in label.data.vertices:
        co = label.matrix_world @ v.co
        if co.y < label.matrix_world.translation.y:
            p = world_to_camera_view(scene, scene.camera, co)
            xs.append(p.x)
            ys.append(1 - p.y)
    print(f"LABEL left={min(xs)*100:.2f}% top={min(ys)*100:.2f}% width={(max(xs)-min(xs))*100:.2f}% height={(max(ys)-min(ys))*100:.2f}%")

bpy.ops.render.render(write_still=True)
print("WROTE", OUT)
