import { css } from '@emotion/react';

export const globalStyles = css`
  body {
    overflow: hidden;
    color: #2d3748;
  }
  .swiper-container {
    margin-left: auto;
    margin-right: auto;
    position: relative;
    overflow: hidden;
    list-style: none;
    padding: 0;
    /* Fix of Webkit flickering */
    z-index: 1;
  }
  .swiper-container-vertical > .swiper-wrapper {
    flex-direction: column;
  }
  .swiper-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: flex;
    transition-property: transform;
    box-sizing: content-box;
  }
  .swiper-container-android .swiper-slide,
  .swiper-wrapper {
    transform: translate3d(0px, 0, 0);
  }
  .swiper-container-multirow > .swiper-wrapper {
    flex-wrap: wrap;
  }
  .swiper-container-multirow-column > .swiper-wrapper {
    flex-wrap: wrap;
    flex-direction: column;
  }
  .swiper-container-free-mode > .swiper-wrapper {
    transition-timing-function: ease-out;
    margin: 0 auto;
  }
  .swiper-slide {
    flex-shrink: 0;
    width: 100%;
    height: 100%;
    position: relative;
    transition-property: transform;
  }
  .swiper-slide-invisible-blank {
    visibility: hidden;
  }
  /* Auto Height */
  .swiper-container-autoheight {
    &,
    .swiper-slide {
      height: auto;
    }

    .swiper-wrapper {
      align-items: flex-start;
      transition-property: transform, height;
    }
  }

  .swiper-button-prev,
  .swiper-button-next {
    position: absolute;
    top: 50%;
    width: 27px;
    height: 44px;
    margin-top: -22px;
    z-index: 10;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    &.swiper-button-disabled {
      opacity: 0.35;
      cursor: auto;
      pointer-events: none;
    }
    &:after {
      text-transform: none !important;
      letter-spacing: 0;
      text-transform: none;
      font-variant: initial;
      line-height: 1;
    }
  }
  .swiper-button-prev,
  .swiper-container-rtl .swiper-button-next {
    &:after {
      content: 'prev';
    }
    left: 10px;
    right: auto;
  }
  .swiper-button-next,
  .swiper-container-rtl .swiper-button-prev {
    &:after {
      content: 'next';
    }
    right: 10px;
    left: auto;
  }
`;
