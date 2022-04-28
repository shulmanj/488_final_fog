export class Trimesh {

    constructor(positions, normals, indices) {
        this.positions = positions;
        this.normals = normals;
        this.indices = indices;
    }

    getPositions() {
        return this.positions;
    }

    getNormals() {
        return this.normals;
    }

    getIndices() {
        return this.indices.flat();
    }

    /**
     * Reads in an object file and returns it to you in X format
     */
    static async fromObj(name) {

        var tmpPositions = [];
        var tmpNormals   = [];
        var tmpIndices   = [];

        const response = (await fetch(name).then(response => response.text()));

        /* Read in the values as arrays for easier processing */
        let lines = response.trim().split('\n');
        for(let i = 0; i < lines.length; i++) {
            let tokens = lines[i].trim().split(/\s+/);

            if(tokens[0] == "v") {

                tmpPositions.push( [ parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]) ] );

            } else if(tokens[0] == "vn") {

                tmpNormals.push( [ parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]) ] );

            } else if(tokens[0] == "f") {
                
                let slashTokens;
                for(let j = 1; j < tokens.length; j++) {
                    slashTokens = tokens[j].split("//");
                    tmpIndices.push( [ parseInt(slashTokens[0]) - 1, parseInt(slashTokens[1]) - 1 ] )
                }
            }
        }


        /* Perform vertex expansion */
        let positions = []
        let normals = []
        let indices = []
        let slashTokenToIndex = new Map();

        for(let i = 0; i < tmpIndices.length; i += 3) {

        for(let j = 0; j < 3; j++) {
                let slashToken = tmpIndices[i + j];
                console.log(slashToken);

        if(!slashTokenToIndex.has( slashToken.toString() )) {

            slashTokenToIndex.set(slashToken.toString(), positions.length / 3);
            positions.push( ...tmpPositions[ slashToken[0] ] );
                    normals.push(  ...tmpNormals[ slashToken[1] ]  );

        }

                indices.push( slashTokenToIndex.get(slashToken.toString()) );

        }
        }

        // return {'positions': positions, 'normals': normals, 'indices': indices};
        return new Trimesh(positions, normals, indices);
    }

}