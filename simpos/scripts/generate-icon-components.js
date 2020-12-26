const path = require('path');
const glob = require('glob-promise');
const fs = require('fs');
const { promisify } = require('util');
const cheerio = require('cheerio');
const camelcase = require('camelcase');
const writeFile = promisify(fs.writeFile);
const exec = promisify(require('child_process').exec);
const mkdir = promisify(fs.mkdir);
const appendFile = promisify(fs.appendFile);
const rmdir = promisify(fs.rmdir);
const rootDir = path.resolve(__dirname, '../');

const writeComponent = (filePath, content) =>
  writeFile(path.resolve(rootDir, filePath), content, 'utf8');

const appendComponent = (filePath, content) =>
  appendFile(path.resolve(rootDir, filePath), content, 'utf8');

async function generate() {
  const iconSvgPaths = await glob(
    path.resolve(rootDir, 'src/components/icons/**/*.svg'),
  );
  const rootComponentsDir = path.resolve(
    rootDir,
    'src/components/icons/output',
  );
  await rmdir(rootComponentsDir, { recursive: true });
  await mkdir(rootComponentsDir);
  await writeComponent(
    `src/components/icons/index.ts`,
    `// THIS FILE IS AUTO GENERATED. DO NOT MODIFY!
`,
  );

  for (svgPath of iconSvgPaths) {
    const svgContent = await promisify(fs.readFile)(svgPath, 'utf8');

    const $svg = cheerio.load(svgContent, { xmlMode: true })('svg');
    const attrConverter = (attribs, tagName) =>
      attribs &&
      Object.keys(attribs)
        .filter(
          (name) =>
            ![
              'class',
              ...(tagName === 'svg'
                ? ['xmlns', 'xmlns:xlink', 'xml:space', 'width', 'height']
                : []),
            ].includes(name),
        )
        .reduce((obj, name) => {
          const newName = camelcase(name);
          switch (newName) {
            case 'fill':
              obj[newName] = 'currentColor';
              break;
            default:
              obj[newName] = attribs[name];
              break;
          }
          return obj;
        }, {});

    const elementToTree = (element) =>
      element
        .filter((_, e) => e.tagName && !['style'].includes(e.tagName))
        .map((_, e) => ({
          tag: e.tagName,
          attr: attrConverter(e.attribs, e.tagName),
          child:
            e.children && e.children.length
              ? elementToTree(cheerio(e.children))
              : undefined,
        }))
        .get();

    const tree = elementToTree($svg);
    const iconData = tree[0];
    const rawName = path.basename(svgPath, path.extname(svgPath));
    const pascalName = camelcase(rawName, { pascalCase: true });
    await writeComponent(
      `src/components/icons/output/Icon${pascalName}.tsx`,
      `// THIS FILE IS AUTO GENERATED. DO NOT MODIFY!
import React from 'react';
import { GenIcon, IconBaseProps } from '../support/IconBase';

export const Icon${pascalName}: React.FunctionComponent<IconBaseProps> = (props: IconBaseProps) => {
  return GenIcon(${JSON.stringify(iconData)})(props);
}
`,
    );
    await appendComponent(
      `src/components/icons/index.ts`,
      `export * from './output/Icon${pascalName}';
    `,
    );
  }

  // await exec(
  //   'node_modules/.bin/eslint --ext .ts,.tsx ./src/components/icons --fix',
  // );
}

generate();
