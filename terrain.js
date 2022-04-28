import {Trimesh} from './trimesh';
import {Vector3} from './vector';

export class Terrain {
    
    constructor(elevations, width, height, squash=0.3) {
        this.elevations = elevations;
        this.width = width;
        this.depth = height;
        this.squash = squash;
    }

    get(x, z) {
        return this.elevations[z * this.width + x];
    }

    set(x, z, elevation) {
        this.elevations[z * this.width + x] = elevation;
    }

    toTrimesh() {
        let positions = [];
        let vecPositions = [];

                /* Compute positions from the heightmap */
        for(let z = 0; z < this.depth; z++) {
            for(let x = 0; x < this.width; x++) {
                let y = this.get(x, z) * this.squash;
                this.set(x, z, y);
                positions.push(x, y, z);
                vecPositions.push(new Vector3(x, y, z));
            }
        }


                /* Compute faces from the heightmap */
        let faces = [];
        for(let z = 0; z < this.depth - 1; z++) {
            let nextZ = z + 1;

            for(let x = 0; x < this.width - 1; x++) {
                let nextX = x + 1;

                faces.push([
                    z * this.width + x,
                    nextZ * this.width + x,
                    z * this.width + nextX
                ]);

                faces.push([
                    nextZ * this.width + x,
                    nextZ * this.width + nextX,
                    z * this.width + nextX
                ]);
            }
        }

                let normals = [];

                for (let i = 0; i < positions.length / 3; i++) {
                    normals[i] = new Vector3(0, 0, 0);
                }

                for (let face of faces) {
                    let posA = vecPositions[face[0]];
                    let posB = vecPositions[face[1]];
                    let posC = vecPositions[face[2]];

                    let vecAB = posB.subtract(posA);
                    let vecAC = posC.subtract(posA);

                    let faceNormal = vecAB.cross(vecAC);
                    faceNormal = faceNormal.normalize();

                    for (let i = 0; i < 3; i++) {
                        normals[face[i]] = normals[face[i]].add(faceNormal);
                    }

                }

                for (let i = 0; i < positions.length / 3; i++) {
                    normals[i] = normals[i].normalize();
                }
        
        return new Trimesh(vecPositions, normals, faces);
    }

    lerp(t, start, end) {
        return (1 - t) * start + t * end;
    }

    blerp(x, z) {
        let floorX = Math.floor(x);
        let floorZ = Math.floor(z);
        let fractionX = x - floorX;
        let fractionZ = z - floorZ;

        let nearLeft = this.get(floorX, floorZ);
        let nearRight = this.get(floorX + 1, floorZ);
        let nearMix = this.lerp(fractionX, nearLeft, nearRight);

        let farLeft = this.get(floorX, floorZ + 1);
        let farRight = this.get(floorX + 1, floorZ + 1);
        let farMix = this.lerp(fractionX, farLeft, farRight);

        return this.lerp(fractionZ, nearMix, farMix);
    }
}