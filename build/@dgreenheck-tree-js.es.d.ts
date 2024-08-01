export declare namespace Billboard {
    let Single: string;
    let Double: string;
}

export declare namespace LeafType {
    let Ash: string;
    let Aspen: string;
    let Beech: string;
    let Evergreen: string;
    let Oak: string;
}

declare class RNG {
    constructor(seed: any);
    m_w: number;
    m_z: number;
    mask: number;
    /**
     * Returns a random number between min and max
     */
    random(max?: number, min?: number): number;
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
            sections: number;
            segments: number;
            levels: number;
            children: number;
            start: number;
            stop: number;
            angle: number;
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
        leaves: {
            billboard: string;
            type: string;
            count: number;
            start: number;
            size: number;
            sizeVariance: number;
            color: number;
            alphaTest: number;
        };
    });
    /**
     * @type {RNG}
     */
    rng: RNG;
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
            sections: number;
            segments: number;
            levels: number;
            children: number;
            start: number;
            stop: number;
            angle: number;
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
        leaves: {
            billboard: string;
            type: string;
            count: number;
            start: number;
            size: number;
            sizeVariance: number;
            color: number;
            alphaTest: number;
        };
    };
    branchesMesh: any;
    leavesMesh: any;
    branchQueue: any[];
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
    let Oak: string;
}

