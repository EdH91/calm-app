"""Generate placeholder app icons echoing the breathing creature.
Run once at build time; not shipped as part of the app itself."""
from PIL import Image, ImageDraw
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "icons")
os.makedirs(OUT_DIR, exist_ok=True)

BG = (245, 241, 232, 255)       # var(--bg)
ACCENT = (107, 144, 128, 255)   # var(--accent)
ACCENT_TINT = (220, 232, 225, 255)
INK_SOFT = (85, 122, 103, 255)


def draw_creature(size, pad_ratio=0.0):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    pad = int(size * pad_ratio)
    s = size - 2 * pad

    # background
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * 0.22), fill=BG)

    cx = size / 2
    torso_cy = pad + s * 0.60
    torso_rx = s * 0.34
    torso_ry = s * 0.36
    belly_rx = s * 0.21
    belly_ry = s * 0.20
    belly_cy = torso_cy + s * 0.10
    head_cy = pad + s * 0.24
    head_r = s * 0.19

    # torso
    d.ellipse([cx - torso_rx, torso_cy - torso_ry, cx + torso_rx, torso_cy + torso_ry], fill=ACCENT)
    # belly
    d.ellipse([cx - belly_rx, belly_cy - belly_ry, cx + belly_rx, belly_cy + belly_ry], fill=ACCENT_TINT)
    # head
    d.ellipse([cx - head_r, head_cy - head_r, cx + head_r, head_cy + head_r], fill=ACCENT)
    # eyes
    eye_dx = head_r * 0.42
    eye_r = head_r * 0.20
    for sign in (-1, 1):
        ex = cx + sign * eye_dx
        ey = head_cy - head_r * 0.05
        d.ellipse([ex - eye_r, ey - eye_r * 1.2, ex + eye_r, ey + eye_r * 1.2], fill=(255, 255, 255, 255))
        pr = eye_r * 0.5
        d.ellipse([ex - pr, ey - pr, ex + pr, ey + pr], fill=(47, 62, 58, 255))
    # smile
    smile_w = head_r * 0.7
    d.arc([cx - smile_w, head_cy - head_r * 0.1, cx + smile_w, head_cy + head_r * 0.9], start=20, end=160, fill=(47, 62, 58, 255), width=max(2, int(size * 0.012)))

    return img


for name, size, pad_ratio in [
    ("icon-192.png", 192, 0.0),
    ("icon-512.png", 512, 0.0),
    ("icon-maskable-512.png", 512, 0.14),  # extra safe-zone padding for maskable
]:
    draw_creature(size, pad_ratio).save(os.path.join(OUT_DIR, name))

print("icons written to", OUT_DIR)
