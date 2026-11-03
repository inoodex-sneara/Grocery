export function removeLightImageBackground(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const maxDimension = 384;
      const scale = Math.min(
        1,
        maxDimension / Math.max(image.naturalWidth, image.naturalHeight),
      );
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        reject(new Error("Could not create a canvas context for cart animation"));
        return;
      }

      try {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        );
        const { data } = imageData;
        const width = canvas.width;
        const height = canvas.height;
        const pixelCount = width * height;
        const visited = new Uint8Array(pixelCount);
        const queue = new Int32Array(pixelCount);
        let queueStart = 0;
        let queueEnd = 0;

        const isBackgroundPixel = (pixelIndex: number) => {
          const offset = pixelIndex * 4;
          if (data[offset + 3] < 8) return true;

          const red = data[offset];
          const green = data[offset + 1];
          const blue = data[offset + 2];
          return (
            Math.min(red, green, blue) >= 190 &&
            Math.max(red, green, blue) - Math.min(red, green, blue) <= 68
          );
        };

        const enqueue = (pixelIndex: number) => {
          if (visited[pixelIndex] || !isBackgroundPixel(pixelIndex)) return;
          visited[pixelIndex] = 1;
          queue[queueEnd++] = pixelIndex;
        };

        for (let x = 0; x < width; x += 1) {
          enqueue(x);
          enqueue((height - 1) * width + x);
        }
        for (let y = 1; y < height - 1; y += 1) {
          enqueue(y * width);
          enqueue(y * width + width - 1);
        }

        while (queueStart < queueEnd) {
          const pixelIndex = queue[queueStart++];
          data[pixelIndex * 4 + 3] = 0;
          const x = pixelIndex % width;
          const y = Math.floor(pixelIndex / width);

          if (x > 0) enqueue(pixelIndex - 1);
          if (x < width - 1) enqueue(pixelIndex + 1);
          if (y > 0) enqueue(pixelIndex - width);
          if (y < height - 1) enqueue(pixelIndex + width);
        }

        context.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = () => {
      reject(new Error(`Could not load cart animation image: ${src}`));
    };
    image.src = src;
  });
}
