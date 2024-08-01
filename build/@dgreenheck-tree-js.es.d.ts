export declare namespace Billboard {
    let Single: string;
    let Double: string;
}

export declare namespace LeafType {
    let Ash: string;
    let Aspen: string;
    let Beech: string;
    let Evergreen: string;
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
        };
        branch: {
            levels: number;
            children: number;
            start: number;
            stop: number;
            angle: number;
            angleVariance: number;
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
            billboard: string;
            type: string;
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
        };
        branch: {
            levels: number;
            children: number;
            start: number;
            stop: number;
            angle: number;
            angleVariance: number;
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
            billboard: string;
            type: string;
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

export namespace Billboard {
    let Single: string;
    let Double: string;
}


export namespace LeafType {
    let Ash: string;
    let Aspen: string;
    let Beech: string;
    let Evergreen: string;
}

