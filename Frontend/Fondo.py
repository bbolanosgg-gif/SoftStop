from PIL import Image
import base64, io

img = Image.open('img/Fondo.webp').convert('RGB')
w = 32
h = round(img.height * w / img.width)
img = img.resize((w, h), Image.LANCZOS)

buf = io.BytesIO()
img.save(buf, 'JPEG', quality=70)
datos = base64.b64encode(buf.getvalue()).decode()

print(f'url("data:image/jpeg;base64,{datos}")')
