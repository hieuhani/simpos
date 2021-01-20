/* eslint-disable import/no-webpack-loader-syntax */
import Worker from 'worker-loader!./worker';

export const worker = new Worker();
