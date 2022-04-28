import { Matrix4 } from "./matrix";
import { Vector3 } from "./vector";
import { Vector4 } from "./vector";

export class Camera {

    constructor(from, to, worldUp) {
        this.from = from;
        this.worldUp = worldUp;
        

        this.forward = new Vector3(to.x - this.from.x, to.y - this.from.y, to.z - this.from.z);
        this.forward = this.forward.normalize();
        this.reorient();
    }

    reorient() {
        this.right = this.forward.cross(this.worldUp).normalize();
        let up = this.right.cross(this.forward).normalize();
        this.translater = Matrix4.translate(-this.from.x, -this.from.y, -this.from.z);

        let rotater = new Matrix4();

        rotater.set(0, 0, this.right.x);
        rotater.set(0, 1, this.right.y);
        rotater.set(0, 2, this.right.z);
        rotater.set(0, 3, 0);
        rotater.set(1, 0, up.x);
        rotater.set(1, 1, up.y);
        rotater.set(1, 2, up.z);
        rotater.set(1, 3, 0);
        rotater.set(2, 0, -this.forward.x);
        rotater.set(2, 1, -this.forward.y);
        rotater.set(2, 2, -this.forward.z);
        rotater.set(2, 3, 0);
        rotater.set(3, 0, 0);
        rotater.set(3, 1, 0);
        rotater.set(3, 2, 0);
        rotater.set(3, 3, 1);

        this.eyeFromWorld = rotater.multiplyMatrix(this.translater);
    }

    strafe(distance) {
        let temp = new Vector3(this.right.x * distance, this.right.y * distance, this.right.z * distance);
        this.from.x += temp.x;
        this.from.y += temp.y;
        this.from.z += temp.z;
        this.reorient();
    }

    advance(distance) {
        let temp = new Vector3(this.forward.x * distance, this.forward.y * distance, this.forward.z * distance);
        this.from.x += temp.x;
        this.from.y += temp.y;
        this.from.z += temp.z;
        this.reorient();
    }

    elevate(distance) {
        let temp = new Vector3(this.worldUp.x * distance, this.worldUp.y * distance, this.worldUp.z * distance);
        this.from.x += temp.x;
        this.from.y += temp.y;
        this.from.z += temp.z;
        this.reorient();
    }

    yaw(degrees) {
        let temp = new Vector4(this.forward.x, this.forward.y, this.forward.z, 1.0);
        temp = Matrix4.rotateAroundAxis(this.worldUp, degrees).multiplyVector(temp);
        this.forward.x = temp.x;
        this.forward.y = temp.y;
        this.forward.z = temp.z;
        this.reorient();
    }

    pitch(degrees) {
        let temp = new Vector4(this.forward.x, this.forward.y, this.forward.z, 1.0);
        temp = Matrix4.rotateAroundAxis(this.right, degrees).multiplyVector(temp);
        this.forward.x = temp.x;
        this.forward.y = temp.y;
        this.forward.z = temp.z;
        this.reorient();
    }

}