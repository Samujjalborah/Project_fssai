"""
QR Code Generator for Oyster Mushroom Website
Target URL: https://projectfssai.netlify.app
Generates:
  1. Vector SVG (qr_code.svg) - ideal for packaging design / Adobe Illustrator
  2. High-Res Green PNG (qr_code.png, 1184x1184px, 300+ DPI equivalent)
  3. Standard Monochrome Black PNG (qr_code_black.png, 1184x1184px)
"""

import zlib
import struct

# Galois Field GF(256) with primitive polynomial 0x11D (285)
EXP = [0] * 512
LOG = [0] * 256
x = 1
for i in range(255):
    EXP[i] = x
    EXP[i + 255] = x
    LOG[x] = i
    x = (x << 1) ^ (0x11D if (x & 0x80) else 0)

def gf_mul(x, y):
    if x == 0 or y == 0:
        return 0
    return EXP[LOG[x] + LOG[y]]

def rs_generator_poly(degree):
    g = [1]
    for i in range(degree):
        root = EXP[i]
        next_g = [0] * (len(g) + 1)
        for j in range(len(g)):
            next_g[j] ^= gf_mul(g[j], root)
            next_g[j + 1] ^= g[j]
        g = next_g
    return g

def rs_encode(data, num_ec):
    gen = rs_generator_poly(num_ec)
    msg = list(data) + [0] * num_ec
    for i in range(len(data)):
        coef = msg[i]
        if coef != 0:
            for j in range(len(gen)):
                msg[i + j] ^= gf_mul(gen[j], coef)
    return msg[len(data):]

# Version 3, Error Correction Level M (15% recovery)
# Size: 29 x 29
def encode_qr_v3_m(text):
    bits = "0100"  # Byte mode indicator
    bits += f"{len(text):08b}"
    for c in text:
        bits += f"{ord(c):08b}"
    bits += "0000"
    rem = len(bits) % 8
    if rem != 0:
        bits += "0" * (8 - rem)
    data_bytes = [int(bits[i:i+8], 2) for i in range(0, len(bits), 8)]
    pad_bytes = [0xEC, 0x11]
    pad_idx = 0
    while len(data_bytes) < 44:
        data_bytes.append(pad_bytes[pad_idx % 2])
        pad_idx += 1
    ec_bytes = rs_encode(data_bytes, 26)
    all_codewords = data_bytes + ec_bytes
    all_bits = "".join(f"{b:08b}" for b in all_codewords)
    all_bits += "0000000"
    return all_bits

def create_v3_matrix(bitstream):
    N = 29
    grid = [[None] * N for _ in range(N)]
    is_function = [[False] * N for _ in range(N)]
    
    def place_finder(r, c):
        for dr in range(7):
            for dc in range(7):
                if dr in (0, 6) or dc in (0, 6) or (2 <= dr <= 4 and 2 <= dc <= 4):
                    grid[r + dr][c + dc] = True
                else:
                    grid[r + dr][c + dc] = False
                is_function[r + dr][c + dc] = True
    
    place_finder(0, 0)
    place_finder(0, N - 7)
    place_finder(N - 7, 0)
    
    for i in range(8):
        for (r, c) in [(7, i), (i, 7)]:
            if r < N and c < N:
                grid[r][c] = False
                is_function[r][c] = True
        for (r, c) in [(7, N - 1 - i), (i, N - 8)]:
            if r < N and 0 <= c < N:
                grid[r][c] = False
                is_function[r][c] = True
        for (r, c) in [(N - 8, i), (N - 1 - i, 7)]:
            if 0 <= r < N and c < N:
                grid[r][c] = False
                is_function[r][c] = True

    def place_alignment(r, c):
        for dr in range(-2, 3):
            for dc in range(-2, 3):
                if max(abs(dr), abs(dc)) in (0, 2):
                    grid[r + dr][c + dc] = True
                else:
                    grid[r + dr][c + dc] = False
                is_function[r + dr][c + dc] = True
    place_alignment(22, 22)
    
    for i in range(8, N - 8):
        val = (i % 2 == 0)
        if not is_function[6][i]:
            grid[6][i] = val
            is_function[6][i] = True
        if not is_function[i][6]:
            grid[i][6] = val
            is_function[i][6] = True

    grid[21][8] = True
    is_function[21][8] = True

    for i in range(9):
        if not is_function[8][i]: is_function[8][i] = True
        if not is_function[i][8]: is_function[i][8] = True
    for i in range(8):
        if not is_function[8][N - 1 - i]: is_function[8][N - 1 - i] = True
        if not is_function[N - 1 - i][8]: is_function[N - 1 - i][8] = True

    bit_idx = 0
    right = N - 1
    upward = True
    while right > 0:
        if right == 6:
            right -= 1
        rows = range(N - 1, -1, -1) if upward else range(0, N)
        for r in rows:
            for c in (right, right - 1):
                if not is_function[r][c]:
                    if bit_idx < len(bitstream):
                        grid[r][c] = (bitstream[bit_idx] == "1")
                        bit_idx += 1
                    else:
                        grid[r][c] = False
        upward = not upward
        right -= 2

    return grid, is_function

FORMAT_BITS = {}
for mask in range(8):
    raw = (0 << 3) | mask
    rem = raw << 10
    gen = 0x537 << 4
    for i in range(4, -1, -1):
        if (rem >> (i + 10)) & 1:
            rem ^= (0x537 << i)
    fmt = ((raw << 10) | rem) ^ 0x5412
    FORMAT_BITS[mask] = fmt

def apply_mask_and_penalty(grid, is_func, mask_id):
    N = len(grid)
    masked = [row[:] for row in grid]
    mask_fn = [
        lambda r, c: (r + c) % 2 == 0,
        lambda r, c: r % 2 == 0,
        lambda r, c: c % 3 == 0,
        lambda r, c: (r + c) % 3 == 0,
        lambda r, c: (r // 2 + c // 3) % 2 == 0,
        lambda r, c: (r * c) % 2 + (r * c) % 3 == 0,
        lambda r, c: ((r * c) % 2 + (r * c) % 3) % 2 == 0,
        lambda r, c: ((r + c) % 2 + (r * c) % 3) % 2 == 0,
    ][mask_id]

    for r in range(N):
        for c in range(N):
            if not is_func[r][c]:
                if mask_fn(r, c):
                    masked[r][c] = not masked[r][c]

    fmt = FORMAT_BITS[mask_id]
    fmt_str = f"{fmt:015b}"
    coords1 = [(8, 0), (8, 1), (8, 2), (8, 3), (8, 4), (8, 5), (8, 7), (8, 8),
               (7, 8), (5, 8), (4, 8), (3, 8), (2, 8), (1, 8), (0, 8)]
    for i, (r, c) in enumerate(coords1):
        masked[r][c] = (fmt_str[14 - i] == "1")

    coords2 = [(N - 1 - i, 8) for i in range(7)] + [(8, N - 8 + i) for i in range(8)]
    for i, (r, c) in enumerate(coords2):
        masked[r][c] = (fmt_str[14 - i] == "1")

    penalty = 0
    for r in range(N):
        run_len = 1
        for c in range(1, N):
            if masked[r][c] == masked[r][c - 1]: run_len += 1
            else:
                if run_len >= 5: penalty += 3 + (run_len - 5)
                run_len = 1
        if run_len >= 5: penalty += 3 + (run_len - 5)

    for c in range(N):
        run_len = 1
        for r in range(1, N):
            if masked[r][c] == masked[r - 1][c]: run_len += 1
            else:
                if run_len >= 5: penalty += 3 + (run_len - 5)
                run_len = 1
        if run_len >= 5: penalty += 3 + (run_len - 5)

    for r in range(N - 1):
        for c in range(N - 1):
            if masked[r][c] == masked[r + 1][c] == masked[r][c + 1] == masked[r + 1][c + 1]:
                penalty += 3

    patt1 = [True, False, True, True, True, False, True, False, False, False, False]
    patt2 = [False, False, False, False, True, False, True, True, True, False, True]
    for r in range(N):
        for c in range(N - 10):
            sub = [masked[r][c + k] for k in range(11)]
            if sub == patt1 or sub == patt2: penalty += 40
    for c in range(N):
        for r in range(N - 10):
            sub = [masked[r + k][c] for k in range(11)]
            if sub == patt1 or sub == patt2: penalty += 40

    dark_count = sum(row.count(True) for row in masked)
    ratio = (dark_count * 100) // (N * N)
    k = abs(ratio - 50) // 5
    penalty += k * 10
    return masked, penalty

def generate_svg(matrix, filename, color="#1E3F2D", margin=4, scale=16):
    N = len(matrix)
    total_size = (N + 2 * margin) * scale
    svg = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total_size} {total_size}" width="{total_size}" height="{total_size}" shape-rendering="crispEdges">',
        f'  <rect width="{total_size}" height="{total_size}" fill="#FFFFFF"/>'
    ]
    for r in range(N):
        for c in range(N):
            if matrix[r][c]:
                x = (c + margin) * scale
                y = (r + margin) * scale
                svg.append(f'  <rect x="{x}" y="{y}" width="{scale}" height="{scale}" fill="{color}"/>')
    svg.append('</svg>')
    with open(filename, "w") as f:
        f.write("\n".join(svg))
    print(f"Saved vector SVG to {filename}")

def write_png(matrix, filename, dark_rgb=b'\x1E\x3F\x2D', scale=32, margin=4):
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
    print(f"Saved {width}x{height} high-res PNG to {filename}")

def main():
    url = "https://projectfssai.netlify.app"
    print(f"Generating print-ready QR codes for: {url}")
    bitstream = encode_qr_v3_m(url)
    grid, is_func = create_v3_matrix(bitstream)
    
    best_grid = None
    best_penalty = float("inf")
    best_mask = 0
    for mask_id in range(8):
        m_grid, penalty = apply_mask_and_penalty(grid, is_func, mask_id)
        if penalty < best_penalty:
            best_penalty = penalty
            best_grid = m_grid
            best_mask = mask_id

    # 1. Forest Green Vector SVG (Infinite scalability for Illustrator/Corel/InDesign)
    generate_svg(best_grid, "qr_code.svg", color="#1E3F2D", margin=4, scale=16)
    
    # 2. Pure Black Vector SVG
    generate_svg(best_grid, "qr_code_black.svg", color="#000000", margin=4, scale=16)
    
    # 3. Forest Green High-Res PNG (1184x1184px, 300 DPI ready)
    write_png(best_grid, "qr_code.png", dark_rgb=b'\x1E\x3F\x2D', scale=32, margin=4)
    
    # 4. Monochrome Black High-Res PNG (1184x1184px)
    write_png(best_grid, "qr_code_black.png", dark_rgb=b'\x00\x00\x00', scale=32, margin=4)

if __name__ == "__main__":
    main()
