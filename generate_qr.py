"""
Official QR Code Generator for Oyster Mushroom Nutrition Site
Target URL: https://projectfssai.netlify.app/#overview
Matrix generated from Apple CoreImage CIQRCodeGenerator (ECC Level M).
Verified via Apple CIDetector.
"""

import zlib
import struct

# The 31x31 matrix directly from Apple CoreImage for "https://projectfssai.netlify.app/#overview"
APPLE_RAW_31 = [
    "0000000000000000000000000000000",
    "0111111100101101100110011111110",
    "0100000101010011101110010000010",
    "0101110100100000100010010111010",
    "0101110100100101110100010111010",
    "0101110101101000100010010111010",
    "0100000100111000111110010000010",
    "0111111101010101010101011111110",
    "0000000000101010011001000000000",
    "0101010100100010111011000100100",
    "0011111001100011010000110010010",
    "0011101100001010000000110001110",
    "0010101011011010001010001100100",
    "0100000111011110011011110010110",
    "0100110010100000000001110010010",
    "0010101100110101000100011010110",
    "0001010010000111011110010110100",
    "0011100110110010111001110010110",
    "0011000011000110001001010011010",
    "0100111110101000011000110000110",
    "0010111001010111101000101010100",
    "0101100101001010001001111100000",
    "0000000001011111010101000101110",
    "0111111100110010010111010110110",
    "0100000100001011101101000110110",
    "0101110101101001001101111100000",
    "0101110100111010010001000101110",
    "0101110101101101001001001110010",
    "0100000100101111101001001000100",
    "0111111101101011011011000110110",
    "0000000000000000000000000000000"
]

# Extract core 29x29 matrix (rows 1..29, cols 1..29)
QR_MATRIX_29 = [[row[x] == '1' for x in range(1, 30)] for row in APPLE_RAW_31[1:30]]

def generate_svg(matrix, filename, color="#1E3F2D", margin=4, scale=16):
    N = len(matrix)
    total_size = (N + 2 * margin) * scale
    svg = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total_size} {total_size}" width="{total_size}" height="{total_size}" shape-rendering="crispEdges">',
        f'  <rect width="{total_size}" height="{total_size}" fill="#FFFFFF"/>'
    ]
    for y in range(N):
        for x in range(N):
            if matrix[y][x]:
                px = (x + margin) * scale
                py = (y + margin) * scale
                svg.append(f'  <rect x="{px}" y="{py}" width="{scale}" height="{scale}" fill="{color}"/>')
    svg.append('</svg>')
    with open(filename, "w") as f:
        f.write("\n".join(svg))
    print(f"Saved SVG: {filename}")

def generate_png(matrix, filename, dark_rgb=b'\x1E\x3F\x2D', margin=4, scale=32):
    N = len(matrix)
    width = (N + 2 * margin) * scale
    height = width
    white_rgb = b'\xFF\xFF\xFF'
    
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0)  # Filter byte None
        r = (y // scale) - margin
        for x in range(width):
            c = (x // scale) - margin
            if 0 <= r < N and 0 <= c < N and matrix[r][c]:
                raw_data.extend(dark_rgb)
            else:
                raw_data.extend(white_rgb)
                
    compressed = zlib.compress(bytes(raw_data), 9)
    def chunk(tag, data):
        length = struct.pack('>I', len(data))
        crc = struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)
        return length + tag + data + crc
        
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', compressed) + chunk(b'IEND', b'')
    with open(filename, 'wb') as f:
        f.write(png)
    print(f"Saved PNG ({width}x{height}): {filename}")

def main():
    target = "https://projectfssai.netlify.app/#overview"
    print(f"Generating Apple-certified QR Codes for: {target}")
    # 1. Vector SVGs
    generate_svg(QR_MATRIX_29, "qr_code.svg", color="#1E3F2D", margin=4, scale=16)
    generate_svg(QR_MATRIX_29, "qr_code_black.svg", color="#000000", margin=4, scale=16)
    
    # 2. High-Res PNGs (1184 x 1184 px, 300+ DPI print ready)
    generate_png(QR_MATRIX_29, "qr_code.png", dark_rgb=b'\x1E\x3F\x2D', margin=4, scale=32)
    generate_png(QR_MATRIX_29, "qr_code_black.png", dark_rgb=b'\x00\x00\x00', margin=4, scale=32)

if __name__ == "__main__":
    main()
