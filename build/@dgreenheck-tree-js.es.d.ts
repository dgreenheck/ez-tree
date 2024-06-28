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
        maturity: number;
        animateGrowth: boolean;
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
            start: number;
            stop: number;
            sweepAngle: number;
            minChildren: number;
            maxChildren: number;
            lengthVariance: number;
            lengthMultiplier: number;
            radiusMultiplier: number;
            taper: number;
            gnarliness: number;
            gnarliness1_R: number;
            twist: number;
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
            minCount: number;
            maxCount: number;
            size: number;
            sizeVariance: number;
            color: number;
            emissive: number;
            opacity: number;
            alphaTest: number;
        };
        sun: {
            direction: any;
            strength: number;
        };
    });
    /**
     * @type {TreeParams}
     */
    params: {
        seed: number;
        maturity: number;
        animateGrowth: boolean;
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
            start: number;
            stop: number;
            sweepAngle: number;
            minChildren: number;
            maxChildren: number;
            lengthVariance: number;
            lengthMultiplier: number;
            radiusMultiplier: number;
            taper: number;
            gnarliness: number;
            gnarliness1_R: number;
            twist: number;
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
            minCount: number;
            maxCount: number;
            size: number;
            sizeVariance: number;
            color: number;
            emissive: number;
            opacity: number;
            alphaTest: number;
        };
        sun: {
            direction: any;
            strength: number;
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

