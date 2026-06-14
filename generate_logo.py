#!/usr/bin/env python3
"""
NeoGuard Neonatal Monitoring Logo Generator
Generates a 512x512 PNG logo with medical/trustworthy theme
"""

from PIL import Image, ImageDraw
import math
import os

# Create output directory if it doesn't exist
output_dir = r"d:\NEONATAL MONITORING SYSTEM\neonateral-main\public"
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "logo.png")

# Color palette
NAVY = (10, 22, 40, 255)  # #0A1628
CYAN = (0, 255, 231, 255)  # #00FFE7
WHITE = (255, 255, 255, 255)  # #FFFFFF
SOFT_BLUE = (79, 195, 247, 255)  # #4FC3F7
CYAN_SEMI = (0, 255, 231, 16)  # #00FFE710 - semi-transparent
CYAN_GLOW = (0, 255, 231, 48)  # #00FFE730 - for glow

# Canvas setup
SIZE = 512
canvas = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
draw = ImageDraw.Draw(canvas)

center_x, center_y = SIZE // 2, SIZE // 2

# 1. Draw deep navy background circle
bg_radius = 230
draw.ellipse(
    [center_x - bg_radius, center_y - bg_radius, 
     center_x + bg_radius, center_y + bg_radius],
    fill=NAVY
)

# 2. Draw glowing outer ring on main circle
ring_radius = bg_radius + 8
draw.ellipse(
    [center_x - ring_radius, center_y - ring_radius,
     center_x + ring_radius, center_y + ring_radius],
    outline=CYAN_GLOW,
    width=3
)

# 3. Draw shield outline
# Shield shape: polygon with top flat, curved sides, point at bottom
shield_top = center_y - 120
shield_bottom = center_y + 140
shield_left = center_x - 100
shield_right = center_x + 100

shield_points = [
    (shield_left, shield_top),  # Top-left
    (shield_right, shield_top),  # Top-right
    (shield_right, center_y),  # Right side middle
    (center_x, shield_bottom),  # Bottom point (center)
    (shield_left, center_y),  # Left side middle
]

draw.polygon(shield_points, fill=CYAN_SEMI, outline=CYAN, width=4)

# 4. Draw baby silhouette (white)
# Head - circle
head_radius = 45
head_y = center_y - 50
draw.ellipse(
    [center_x - head_radius, head_y - head_radius,
     center_x + head_radius, head_y + head_radius],
    fill=WHITE
)

# Body - rounded rectangle (ellipse)
body_top = head_y + head_radius - 10
body_bottom = center_y + 60
body_left = center_x - 35
body_right = center_x + 35
draw.ellipse(
    [body_left, body_top, body_right, body_bottom],
    fill=WHITE
)

# 5. Draw ECG heartbeat line in cyan (3px thick)
ecg_y = center_y
ecg_left = shield_left + 20
ecg_right = shield_right - 20
ecg_width = ecg_right - ecg_left

# ECG pattern: flat -> spike up -> spike down -> flat -> blip -> flat
segments = [
    # Flat line (20% of width)
    [(ecg_left, ecg_y), 
     (ecg_left + ecg_width * 0.2, ecg_y)],
    
    # Sharp spike up
    [(ecg_left + ecg_width * 0.2, ecg_y),
     (ecg_left + ecg_width * 0.3, ecg_y - 25)],
    
    # Sharp spike down
    [(ecg_left + ecg_width * 0.3, ecg_y - 25),
     (ecg_left + ecg_width * 0.4, ecg_y + 25)],
    
    # Return to flat
    [(ecg_left + ecg_width * 0.4, ecg_y + 25),
     (ecg_left + ecg_width * 0.6, ecg_y)],
    
    # Small blip up
    [(ecg_left + ecg_width * 0.6, ecg_y),
     (ecg_left + ecg_width * 0.7, ecg_y - 10)],
    
    # Return to flat
    [(ecg_left + ecg_width * 0.7, ecg_y - 10),
     (ecg_right, ecg_y)],
]

for segment in segments:
    draw.line(segment, fill=CYAN, width=3)

# 6. Draw small heart shape in cyan (top-right area)
heart_center_x = shield_right - 35
heart_center_y = shield_top + 40
heart_size = 12

# Heart made from two circles + triangle
# Left lobe
draw.ellipse(
    [heart_center_x - heart_size - 5, heart_center_y - heart_size,
     heart_center_x - heart_size + 5, heart_center_y],
    fill=CYAN
)

# Right lobe
draw.ellipse(
    [heart_center_x + heart_size - 5, heart_center_y - heart_size,
     heart_center_x + heart_size + 5, heart_center_y],
    fill=CYAN
)

# Bottom triangle point
triangle = [
    (heart_center_x - heart_size, heart_center_y),
    (heart_center_x + heart_size, heart_center_y),
    (heart_center_x, heart_center_y + heart_size + 5),
]
draw.polygon(triangle, fill=CYAN)

# Save the image
canvas.save(output_path, 'PNG')

# Verify file exists and print size
if os.path.exists(output_path):
    file_size = os.path.getsize(output_path)
    print(f"✓ Logo saved successfully to: {output_path}")
    print(f"✓ File size: {file_size} bytes")
else:
    print(f"✗ Error: File was not created at {output_path}")
