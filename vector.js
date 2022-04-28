export class Vector4 {
    constructor(x, y, z, w) {
        this.coordinates = [x, y, z, w];
    }

    get(index) {
        return this.coordinates[index];
    }

    set(index, value) {
        this.coordinates[index] = value;
    }

    normalize() {
        let mag = this.magnitude();
        let result = new Vector4(this.x / mag, this.y / mag, this.z / mag, this.w / mag);
        return result;
    }

    magnitude() {
        let result = 0.0;
        result = Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w));
        result = Math.abs(result);
        return result;
    }

    dot(vec) {
        let result = this.x * vec.x + this.y * vec.y + this.z * vec.z + this.w * vec.w;
        return result;
    }


    get x() {
        return this.coordinates[0];
    }
      
    get y() {
        return this.coordinates[1];
    }
      
    get z() {
        return this.coordinates[2];
    }

    get w() {
        return this.coordinates[3];
    }
      
    set x(value) {
        this.coordinates[0] = value;
    }
      
    set y(value) {
        this.coordinates[1] = value;
    }
      
    set z(value) {
        this.coordinates[2] = value;
    }

    set w(value) {
        this.coordinates[3] = value;
    }
}

export class Vector3 {
    constructor(x, y, z) {
      this.coordinates = [x, y, z];
    }
  
    toString() {
      return `[${this.coordinates[0]}, ${this.coordinates[1]}, ${this.coordinates[2]}]`;
    }

    normalize() {
        let mag = this.magnitude();
        let result = new Vector3(this.x / mag, this.y / mag, this.z / mag);
        return result;
    }

    magnitude() {
        let result = 0.0;
        result = Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
        result = Math.abs(result);
        return result;
    }

    cross(vec) {
        let result = new Vector3((this.y * vec.z - this.z * vec.y), (this.z * vec.x - this.x * vec.z), (this.x * vec.y - this.y * vec.x));
        return result;
    }

	add(vec) {
		return new Vector3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
	}

	subtract(vec) {
		return new Vector3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
	}

    dot(vec) {
        let result = this.x * vec.x + this.y * vec.y + this.z * vec.z;
        return result;
    }

    get x() {
        return this.coordinates[0];
    }
      
    get y() {
        return this.coordinates[1];
    }
      
    get z() {
        return this.coordinates[2];
    }
      
    set x(value) {
        this.coordinates[0] = value;
    }
      
    set y(value) {
        this.coordinates[1] = value;
    }
      
    set z(value) {
        this.coordinates[2] = value;
    }
}
