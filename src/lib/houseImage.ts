import type { HouseListing } from '@/types/house';

const DECO_PROMPT: Record<string, string> = {
  毛坯: 'empty raw concrete apartment room, bright daylight, no furniture, minimalist',
  简装: 'simple furnished apartment living room, white walls, basic sofa, daylight',
  精装: 'modern cozy apartment living room, warm wood floor, sofa, plants, bright',
  豪装: 'luxury apartment living room, designer furniture, marble floor, golden light',
};

/** 房源封面图：按装修风格/租型生成示意图 */
export function houseImageUrl(listing: HouseListing): string {
  const prompt = encodeURIComponent(
    `Real estate listing photo, ${DECO_PROMPT[listing.decoration]}, ${
      listing.rentType === 'shared' ? 'single bedroom' : 'living room'
    }, ${listing.areaSize} sqm, photorealistic, interior design`,
  );
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${prompt}&image_size=landscape_4_3`;
}
