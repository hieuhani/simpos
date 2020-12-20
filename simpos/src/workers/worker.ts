import { orderChannel } from '../channels';
import { productVariantRepository } from '../services/db';
import { SizedImages } from '../types';

const sizes = [128, 256, 512, 1024];
const perChunk = 10;

onmessage = async function (e) {
  switch (e.data.type) {
    case 'DATA_INITIALIZED': {
      const productVariants = await productVariantRepository.all();
      const productIds = productVariants.map(({ id }) => id);

      const totalChunks = Math.ceil(productIds.length / perChunk);
      for (let chunkIdx = 0; chunkIdx < totalChunks; chunkIdx += 1) {
        const productIdsChunks = productIds.slice(
          chunkIdx * perChunk,
          chunkIdx * perChunk + perChunk,
        );
        // Download images
        const chunkDownloadedImages = await Promise.all(
          productIdsChunks.map(async (productId) => {
            const images = await Promise.all(
              sizes.map(async (size) => {
                const res = await fetch(
                  `/web/image?model=product.product&field=image_${size}&id=${productId}`,
                );
                if (res.status !== 200) {
                  return {
                    size,
                    blob: undefined,
                  };
                }
                const blob = await res.blob();
                return {
                  size,
                  blob,
                };
              }),
            );
            return {
              id: productId,
              images: images.reduce((accumulator, image) => {
                return {
                  ...accumulator,
                  [image.size]: image.blob,
                };
              }, {}) as SizedImages,
            };
          }),
        );
        // Save images to the product variant
        await Promise.all(
          chunkDownloadedImages.map(async (product) => {
            return productVariantRepository.update(product.id, {
              images: product.images,
            });
          }),
        );
      }

      postMessage({ type: 'PRODUCT_IMAGES_SAVED' });

      break;
    }
    case 'ACTIVE_ORDER_CHANGED': {
      orderChannel.postMessage({
        type: 'ACTIVE_ORDER_CHANGED',
        payload: e.data.payload,
      });

      break;
    }
    default:
      break;
  }
  // const result = e.data[0] * e.data[1];
  // if (isNaN(result)) {
  //   postMessage('Please write two numbers');
  // } else {
  //   const workerResult = 'Result: ' + result;
  //   console.log('Worker: Posting message back to main script');
  //   postMessage(workerResult);
  // }
};
