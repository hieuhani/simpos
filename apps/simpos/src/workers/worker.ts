import dayjs from 'dayjs';
import { orderChannel } from '../channels';
import { ProductVariant, productVariantRepository } from '../services/db';
import { preferenceRepository } from '../services/db/preference';
import { SizedImages } from '../types';

const sizes = [128]; // 256, 512, 1024
const perChunk = 10;

const downloadProductImages = async (productVariants: ProductVariant[]) => {
  const currentPreference = await preferenceRepository.get();
  if (currentPreference && currentPreference.lastImagesDownloaded) {
    const diffHour = dayjs().diff(
      dayjs(currentPreference.lastImagesDownloaded),
      'hour',
    );
    if (diffHour < 24) {
      return null;
    }
  }
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
              `https://odoo13.fibotree.com/web/image?model=product.product&field=image_${size}&id=${productId}`,
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
  await preferenceRepository.update({
    lastImagesDownloaded: new Date(),
  });

  postMessage({ type: 'PRODUCT_IMAGES_SAVED' });
};

onmessage = async function (e) {
  switch (e.data.type) {
    case 'DATA_INITIALIZED': {
      const productVariants = await productVariantRepository.all();
      downloadProductImages(productVariants);
      break;
    }
    case 'ACTIVE_ORDER_CHANGED': {
      orderChannel.postMessage({
        type: 'ACTIVE_ORDER_CHANGED',
        payload: e.data.payload,
      });

      break;
    }
    case 'PRODUCT_TEMPLATE_CHANGED': {
      if (Array.isArray(e.data.payload) && e.data.payload.length > 0) {
        const templateIds = e.data.payload.map(({ id }: any) => id);
        const productVariants =
          await productVariantRepository.findByTemplateIds(templateIds);
        if (productVariants.length > 0) {
          downloadProductImages(productVariants);
        }
      }
      break;
    }
    default:
      break;
  }
};
