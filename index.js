/* copyright 2019, stefano bovio @allyoucanmap. */

import {
    create,
    mapFeatures,
    scan
} from './utils';
import * as turf from '@turf/turf';

const getColor = (color) => `background: ${color}; color: #fff;`;

const width = 64;
const height = 32;

const canvas = create('canvas',
    { width, height },
    { position: 'absolute', 'width': `${width}px`, 'height': `${height}px`, 'font-size': 0 }, document.body);

const range = Object.keys([...Array(width * height)]);


fetch('countries.geo.json')
    .then(function (res) {
        res.json()
            .then(function (featureCollection) {
                const features = mapFeatures(
                    turf.flatten(featureCollection),
                    { width, height, centered: true },
                    undefined,
                    true
                );

                const ctx = canvas().getContext('2d');

                const drawPath = (coordinates) =>
                    coordinates.forEach((p, i) => {
                        const x = p[0];
                        const y = height - p[1];
                        if (i === 0) {
                            ctx.moveTo(x, y);
                        } else if (i === coordinates.length - 1) {
                            ctx.lineTo(x, y);
                        } else {
                            ctx.lineTo(x, y);
                        }
                    });

                scan(features, (coords) => {
                    ctx.fillStyle = '#000';
                    drawPath(coords);
                    ctx.fill('evenodd');
                    return coords;
                });

                let grid = [];
                range.forEach((idx) => {
                    const x = idx % width;
                    const y = Math.floor(idx / width);
                    if (!grid[y]) grid[y] = [];
                    const color = ctx.getImageData(x, y, 1, 1).data;
                    grid[y][x] = color[3] === 0 ? 0 : 1;
                });
                
                const animate = () => {
                    setTimeout(() => {
                        requestAnimationFrame(animate);
                    }, 1000 / 30);
                
                    console.log('_____');

                    const color = `hsl(${Math.floor(Math.random() * 360)}, 90%, 60%)`;
                    document.body.style.backgroundColor = color;
                    const widthString = Object.keys([...Array(width)]).map(() => '%c_~').join('');
                    grid.forEach((row) => {
                        console.log(
                            widthString,
                            ...row.map(val => val === 1 ? getColor(color) : '#fff')
                        );
                    });
                
                    console.log('_____');
                };
                animate();
            })
    });


