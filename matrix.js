import {Vector4} from './vector';
export class Matrix4 {

    constructor() {
        this.arr = new Float32Array(16);
        /* 
         * [0  4  8  12
         *  1  5  9  13
         *  2  6  10 14
         *  3  7  11 15]
         */ 
    }

    static fovPerspective(fov, aspectRatio, near, far) {

        let radFOV = fov * (Math.PI / 180);
        let top = Math.tan(radFOV / 2) * near;
        let right = aspectRatio * top;

        let result = new Matrix4();

        result.set(0, 0, near/right);
        result.set(0, 1, 0);
        result.set(0, 2, 0);
        result.set(0, 3, 0);

        result.set(1, 0, 0);
        result.set(1, 1, near/top);
        result.set(1, 2, 0);
        result.set(1, 3, 0);

        result.set(2, 0, 0);
        result.set(2, 1, 0);
        result.set(2, 2, (near + far) / (near - far));
        result.set(2, 3, (2 * near * far) / (near - far));

        result.set(3, 0, 0);
        result.set(3, 1, 0);
        result.set(3, 2, -1);
        result.set(3, 3, 0);

        return result;
    }

    get(row, column) {
        return this.arr[(4 * column) + row];
    }

    set(row, column, value) {
        this.arr[(4 * column) + row] = value;
    }

    toBuffer() {
        return this.arr;
    }

    static identity() {
        let result = new Matrix4();

        result.set(0, 0, 1);
        result.set(0, 1, 0);
        result.set(0, 2, 0);
        result.set(0, 3, 0);
        result.set(1, 0, 0);
        result.set(1, 1, 1);
        result.set(1, 2, 0);
        result.set(1, 3, 0);
        result.set(2, 0, 0);
        result.set(2, 1, 0);
        result.set(2, 2, 1);
        result.set(2, 3, 0);
        result.set(3, 0, 0);
        result.set(3, 1, 0);
        result.set(3, 2, 0);
        result.set(3, 3, 1);

        return result;
    }

    static scale(factorX, factorY, factorZ) {

        let scaleMatrix = new Matrix4();

        scaleMatrix.set(0, 0, factorX);
        scaleMatrix.set(0, 1, 0);
        scaleMatrix.set(0, 2, 0);
        scaleMatrix.set(0, 3, 0);
        scaleMatrix.set(1, 0, 0);
        scaleMatrix.set(1, 1, factorY);
        scaleMatrix.set(1, 2, 0);
        scaleMatrix.set(1, 3, 0);
        scaleMatrix.set(2, 0, 0);
        scaleMatrix.set(2, 1, 0);
        scaleMatrix.set(2, 2, factorZ);
        scaleMatrix.set(2, 3, 0);
        scaleMatrix.set(3, 0, 0);
        scaleMatrix.set(3, 1, 0);
        scaleMatrix.set(3, 2, 0);
        scaleMatrix.set(3, 3, 1);

        return scaleMatrix;
    }

    static translate(offsetX, offsetY, offsetZ) {

        let translateMatrix = new Matrix4();

        translateMatrix.set(0, 0, 1);
        translateMatrix.set(0, 1, 0);
        translateMatrix.set(0, 2, 0);
        translateMatrix.set(0, 3, offsetX);
        translateMatrix.set(1, 0, 0);
        translateMatrix.set(1, 1, 1);
        translateMatrix.set(1, 2, 0);
        translateMatrix.set(1, 3, offsetY);
        translateMatrix.set(2, 0, 0);
        translateMatrix.set(2, 1, 0);
        translateMatrix.set(2, 2, 1);
        translateMatrix.set(2, 3, offsetZ);
        translateMatrix.set(3, 0, 0);
        translateMatrix.set(3, 1, 0);
        translateMatrix.set(3, 2, 0);
        translateMatrix.set(3, 3, 1);

        return translateMatrix;
    }

    static rotateX(degrees) {

        let rad = degrees * (Math.PI/180);
        let rotate = new Matrix4();
        
        rotate.set(0, 0, 1);
        rotate.set(0, 1, 0);
        rotate.set(0, 2, 0);
        rotate.set(0, 3, 0);
        rotate.set(1, 0, 0);
        rotate.set(1, 1, Math.cos(rad));
        rotate.set(1, 2, -Math.sin(rad));
        rotate.set(1, 3, 0);
        rotate.set(2, 0, 0);
        rotate.set(2, 1, Math.sin(rad));
        rotate.set(2, 2, Math.cos(rad));
        rotate.set(2, 3, 0);
        rotate.set(3, 0, 0);
        rotate.set(3, 1, 0);
        rotate.set(3, 2, 0);
        rotate.set(3, 3, 1);

        return rotate;
    }

    static rotateY(degrees) {

        let rad = degrees * (Math.PI/180);
        let rotate = new Matrix4();
        
        rotate.set(0, 0, Math.cos(rad));
        rotate.set(0, 1, 0);
        rotate.set(0, 2, -Math.sin(rad));
        rotate.set(0, 3, 0);
        rotate.set(1, 0, 0);
        rotate.set(1, 1, 1);
        rotate.set(1, 2, 0);
        rotate.set(1, 3, 0);
        rotate.set(2, 0, Math.sin(rad));
        rotate.set(2, 1, 0);
        rotate.set(2, 2, Math.cos(rad));
        rotate.set(2, 3, 0);
        rotate.set(3, 0, 0);
        rotate.set(3, 1, 0);
        rotate.set(3, 2, 0);
        rotate.set(3, 3, 1);

        return rotate;
    }

    static rotateZ(degrees) {

        let rad = degrees * (Math.PI/180);
        let rotate = new Matrix4();
        
        rotate.set(0, 0, Math.cos(rad));
        rotate.set(0, 1, -Math.sin(rad));
        rotate.set(0, 2, 0);
        rotate.set(0, 3, 0);
        rotate.set(1, 0, Math.sin(rad));
        rotate.set(1, 1, Math.cos(rad));
        rotate.set(1, 2, 0);
        rotate.set(1, 3, 0);
        rotate.set(2, 0, 0);
        rotate.set(2, 1, 0);
        rotate.set(2, 2, 1);
        rotate.set(2, 3, 0);
        rotate.set(3, 0, 0);
        rotate.set(3, 1, 0);
        rotate.set(3, 2, 0);
        rotate.set(3, 3, 1);

        return rotate;
    }

    multiplyVector(vector) {
        let result = new Vector4();

        result.set(0, this.get(0, 0) * vector.get(0) + this.get(0, 1) * vector.get(1) + this.get(0, 2) * vector.get(2) + this.get(0, 3) * vector.get(3));
        result.set(1, this.get(1, 0) * vector.get(0) + this.get(1, 1) * vector.get(1) + this.get(1, 2) * vector.get(2) + this.get(1, 3) * vector.get(3));
        result.set(2, this.get(2, 0) * vector.get(0) + this.get(2, 1) * vector.get(1) + this.get(2, 2) * vector.get(2) + this.get(2, 3) * vector.get(3));
        result.set(3, this.get(3, 0) * vector.get(0) + this.get(3, 1) * vector.get(1) + this.get(3, 2) * vector.get(2) + this.get(3, 3) * vector.get(3));

        return result;
    }

    multiplyMatrix(matrix) {
        let result = new Matrix4();

        for(let i = 0; i < 4; i++)
        {
            for(let j = 0; j < 4; j++)
            {
                let sum = 0;
                for(let k = 0; k < 4; k++)
                {
                    sum += this.get(i, k) * matrix.get(k, j);
                }
                result.set(i, j, sum);
            }
        }

        return result;
    }

    static rotateAroundAxis(axis, degrees) {
        let a = degrees;
        let s = Math.sin(a);
        let c = Math.cos(a);
        let d = 1 - c;
        let vx = axis.x;
        let vy = axis.y;
        let vz = axis.z;

        let result = new Matrix4();

        result.set(0, 0, d*vx*vx + c);
        result.set(0, 1, d*vx*vy - s*vz);
        result.set(0, 2, d*vx*vz + s*vy);
        result.set(0, 3, 0);
        result.set(1, 0, d*vy*vx + s*vz);
        result.set(1, 1, d*vy*vy + c);
        result.set(1, 2, d*vy*vz - s*vz);
        result.set(1, 3, 0);
        result.set(2, 0, d*vz*vx - s*vy);
        result.set(2, 1, d*vz*vy + s*vz);
        result.set(2, 2, d*vz*vz + c);
        result.set(2, 3, 0);
        result.set(3, 0, 0);
        result.set(3, 1, 0);
        result.set(3, 2, 0);
        result.set(3, 3, 1);

        return result;
    }
}        