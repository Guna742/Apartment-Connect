from PIL import Image
import math

def remove_white(in_path, out_path):
    try:
        img = Image.open(in_path).convert("RGBA")
        datas = img.getdata()
        newData = []
        for r, g, b, a in datas:
            dist = math.sqrt((255-r)**2 + (255-g)**2 + (255-b)**2)
            if dist < 40:
                newData.append((r, g, b, 0))
            elif dist < 120:
                alpha_factor = (dist - 40) / 80.0
                alpha = int(255 * alpha_factor)
                newData.append((r, g, b, min(a, alpha)))
            else:
                newData.append((r, g, b, a))
        img.putdata(newData)
        img.save(out_path, "PNG")
        print(f"Processed {in_path}")
    except Exception as e:
        print(f"Error processing {in_path}: {e}")

remove_white('logos/meta.png', 'logos/meta.png')
remove_white('logos/openai.png', 'logos/openai.png')
