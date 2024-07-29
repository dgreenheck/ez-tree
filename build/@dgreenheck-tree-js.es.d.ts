export declare namespace LeafStyle {
    let Single: number;
    let Double: number;
}

export declare namespace LeafType {
    let Ash: number;
    let Aspen: number;
    let Oak: number;
}

export declare class Tree {
    /**
     * @param {TreeParams} params
     */
    constructor(params?: {
        seed: number;
        trunk: {
            color: number;
            flatShading: boolean;
            textured: boolean;
            length: number;
            radius: number;
            flare: number;
        };
        branch: {
            levels: number;
            children: number;
            start: number;
            stop: number;
            angle: number;
            lengthVariance: number;
            lengthMultiplier: number;
            radiusMultiplier: number;
            taper: number;
            gnarliness: number;
            twist: number;
            force: {
                direction: any;
                strength: number;
            };
        };
        geometry: {
            sections: number;
            segments: number;
            lengthVariance: number;
            radiusVariance: number;
            randomization: number;
        };
        leaves: {
            style: number;
            type: number;
            count: number;
            size: number;
            sizeVariance: number;
            color: number;
            emissive: number;
            opacity: number;
            alphaTest: number;
        };
    });
    /**
     * @type {TreeParams}
     */
    params: {
        seed: number;
        trunk: {
            color: number;
            flatShading: boolean;
            textured: boolean;
            length: number;
            radius: number;
            flare: number;
        };
        branch: {
            levels: number;
            children: number;
            start: number;
            stop: number;
            angle: number;
            lengthVariance: number;
            lengthMultiplier: number;
            radiusMultiplier: number;
            taper: number;
            gnarliness: number;
            twist: number;
            force: {
                direction: any;
                strength: number;
            };
        };
        geometry: {
            sections: number;
            segments: number;
            lengthVariance: number;
            radiusVariance: number;
            randomization: number;
        };
        leaves: {
            style: number;
            type: number;
            count: number;
            size: number;
            sizeVariance: number;
            color: number;
            emissive: number;
            opacity: number;
            alphaTest: number;
        };
    };
    branchesMesh: any;
    leavesMesh: any;
    /**
     * Generate a new tree
     */
    generate(): void;
    branches: {
        verts: any[];
        normals: any[];
        indices: any[];
        uvs: any[];
    };
    leaves: {
        verts: any[];
        normals: any[];
        indices: any[];
        uvs: any[];
    };
    trunk: void;
    #private;
}

export { }

export namespace LeafStyle {
    let Single: number;
    let Double: number;
}


export namespace LeafType {
    let Ash: number;
    let Aspen: number;
    let Oak: number;
}

