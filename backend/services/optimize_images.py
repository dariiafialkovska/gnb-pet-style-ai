from PIL import Image
import io
from io import BytesIO
import time
def optimize_input_image(image_bytes, max_size=512, quality=85):
    """
    Optimize image for faster OpenAI processing
    - Resize to max_size if larger
    - Convert to RGB
    - Compress with specified quality
    """
    compression_start = time.time()
    
    try:
        original_size = len(image_bytes)
        
        with Image.open(BytesIO(image_bytes)) as img:
            print(f"📐 Original dimensions: {img.size}")
            print(f"📊 Original file size: {original_size:,} bytes ({original_size/1024:.1f} KB)")
            
            # Resize if too large
            resize_start = time.time()
            if max(img.size) > max_size:
                img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
                print(f"📏 Resized to: {img.size}")
            resize_time = time.time() - resize_start
            
            # Convert to RGB if needed
            convert_start = time.time()
            if img.mode != 'RGB':
                img = img.convert('RGB')
                print(f"🎨 Converted to RGB")
            convert_time = time.time() - convert_start
            
            # Compress and save to buffer
            compress_start = time.time()
            buffer = BytesIO()
            img.save(buffer, format='JPEG', quality=quality, optimize=True)
            buffer.seek(0)
            compress_time = time.time() - compress_start
            
            compressed_size = len(buffer.getvalue())
            compression_ratio = (1 - compressed_size/original_size) * 100
            
            total_compression_time = time.time() - compression_start
            
            print(f"📦 Compressed size: {compressed_size:,} bytes ({compressed_size/1024:.1f} KB)")
            print(f"📉 Compression ratio: {compression_ratio:.1f}% reduction")
            print(f"⏱️ Compression breakdown:")
            print(f"   - Resize: {resize_time:.3f}s")
            print(f"   - Convert: {convert_time:.3f}s") 
            print(f"   - Compress: {compress_time:.3f}s")
            print(f"   - Total compression: {total_compression_time:.3f}s")
            
            return buffer, {
                'original_size': original_size,
                'compressed_size': compressed_size,
                'compression_ratio': compression_ratio,
                'compression_time': total_compression_time,
                'resize_time': resize_time,
                'convert_time': convert_time,
                'compress_time': compress_time
            }
            
    except Exception as e:
        print(f"❌ Image optimization error: {e}")
        compression_time = time.time() - compression_start
        # Fallback to original image
        return BytesIO(image_bytes), {
            'original_size': len(image_bytes),
            'compressed_size': len(image_bytes), 
            'compression_ratio': 0,
            'compression_time': compression_time,
            'error': str(e)
        }