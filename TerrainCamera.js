import { Camera } from "./camera";

export class TerrainCamera extends Camera {
    constructor(from, to, worldUp, terrain, eyeLevel) {
        super(from, to, worldUp);
        this.terrain = terrain;
        this.eyeLevel = eyeLevel;
        this.buoy();
        this.reorient();
    }

    buoy() {
        this.from.y = this.terrain.blerp(this.from.x, this.from.z) + this.eyeLevel;
    }

    advance(delta) {
        super.advance(delta);
        if (this.from.x < 0) {
            this.from.x = 0;
        } 
        if (this.from.x > this.terrain.width) {
            this.from.x -= delta;
        }
        if (this.from.z < 0) {
            this.from.z = 0;
        }
        if (this.from.z > this.terrain.depth) {
            this.from.z -= delta;
        }
        this.buoy();
        this.reorient();
    }

    strafe(delta) {
        super.strafe(delta);
        if (this.from.x < 0) {
            this.from.x = 0;
        } 
        if (this.from.x >= this.terrain.width) {
            this.from.x -= delta;
        }
        if (this.from.z < 0) {
            this.from.z = 0;
        }
        if (this.from.z >= this.terrain.depth) {
            this.from.z -= delta;
        }
        this.buoy();
        this.reorient();
    }
}