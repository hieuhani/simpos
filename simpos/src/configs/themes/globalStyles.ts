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

  .react-datepicker {
    font-family: unset;
    font-size: 0.9rem;
  }

  .react-datepicker-wrapper,
  .react-datepicker__input-container {
    display: block;
  }

  .react-datepicker__input-container {
    font-size: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    height: 2.5rem;
    border-radius: 0.25rem;
    border: 1px solid;
    border-color: #cbd5e0;
  }

  .react-datepicker__input-container:hover {
    border-color: hsl(0, 0%, 70%);
  }
  .react-datepicker__input-container:focus-within {
    z-index: 1;
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }

  .react-datepicker__input-container > input {
    width: 100%;
    height: 100%;
    outline: 0;
  }

  .react-datepicker__navigation--next--with-time:not(.react-datepicker__navigation--next--with-today-button) {
    right: 90px;
  }

  .react-datepicker__navigation--previous,
  .react-datepicker__navigation--next {
    height: 8px;
  }

  .react-datepicker__navigation--previous {
    border-right-color: #cbd5e0;
  }

  .react-datepicker__navigation--previous:hover {
    border-right-color: #a0aec0;
  }

  .react-datepicker__navigation--next {
    border-left-color: #cbd5e0;
  }

  .react-datepicker__navigation--next:hover {
    border-left-color: #a0aec0;
  }

  .react-datepicker__header {
    background: #f7fafc;
  }

  .react-datepicker__header,
  .react-datepicker__time-container {
    border-color: #e2e8f0;
  }

  .react-datepicker__current-month,
  .react-datepicker-time__header,
  .react-datepicker-year-header {
    font-size: inherit;
    font-weight: 600;
  }

  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item {
    margin: 0 1px 0 0;
    height: auto;
    padding: 7px 10px;
  }

  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item:hover {
    background: #edf2f7;
  }

  .react-datepicker__day:hover {
    background: #edf2f7;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range,
  .react-datepicker__month-text--selected,
  .react-datepicker__month-text--in-selecting-range,
  .react-datepicker__month-text--in-range,
  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item--selected {
    background: #3182ce;
    font-weight: normal;
  }

  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item--selected:hover {
    background: #2a69ac;
  }

  .react-datepicker__close-icon::after {
    background-color: unset;
    border-radius: unset;
    font-size: 1.5rem;
    font-weight: bold;
    color: hsl(0, 0%, 80%);
    height: 20px;
    width: 20px;
  }

  .react-datepicker__close-icon::after:hover {
    color: hsl(0, 0%, 70%);
  }
`;
