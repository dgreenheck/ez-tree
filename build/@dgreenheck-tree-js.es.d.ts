import * as THREE_2 from 'three';

export declare namespace Billboard {
    let Single: string;
    let Double: string;
}

declare class Branch {
    /**
     * Generates a new branch
     * @param {THREE.Vector3} origin The starting point of the branch
     * @param {THREE.Euler} orientation The starting orientation of the branch
     * @param {number} length The length of the branch
     * @param {number} radius The radius of the branch at its starting point
     */
    constructor(origin?: THREE_2.Vector3, orientation?: THREE_2.Euler, length?: number, radius?: number, level?: number, sectionCount?: number, segmentCount?: number);
    origin: THREE_2.Vector3;
    orientation: THREE_2.Euler;
    length: number;
    radius: number;
    level: number;
    sectionCount: number;
    segmentCount: number;
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

export declare class Tree extends THREE_2.Group {
    /**
     * @param {TreeParams} params
     */
    constructor(params?: {
        seed: number;
        type: string;
        trunk: {
            color: number;
            flatShading: boolean;
            textured: boolean;
            length: number;
            radius: number;
        };
        branch: {
            sections: {
                1: number;
                2: number;
                3: number;
                4: number;
            };
            segments: {
                1: number;
                2: number;
                3: number;
                4: number;
            };
            levels: number;
            children: number;
            start: number;
            angle: number;
            lengthMultiplier: number;
            radiusMultiplier: number;
            taper: number;
            gnarliness: number;
            twist: number;
            force: {
                direction: THREE_2.Vector3;
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
        type: string;
        trunk: {
            color: number;
            flatShading: boolean;
            textured: boolean;
            length: number;
            radius: number;
        };
        branch: {
            sections: {
                1: number;
                2: number;
                3: number;
                4: number;
            };
            segments: {
                1: number;
                2: number;
                3: number;
                4: number;
            };
            levels: number;
            children: number;
            start: number;
            angle: number;
            lengthMultiplier: number;
            radiusMultiplier: number;
            taper: number;
            gnarliness: number;
            twist: number;
            force: {
                direction: THREE_2.Vector3;
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
    /**
     * @type {Branch[]}
     */
    branchQueue: Branch[];
    branchesMesh: THREE_2.Mesh<THREE_2.BufferGeometry<THREE_2.NormalBufferAttributes>, THREE_2.Material | THREE_2.Material[]>;
    leavesMesh: THREE_2.Mesh<THREE_2.BufferGeometry<THREE_2.NormalBufferAttributes>, THREE_2.Material | THREE_2.Material[]>;
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

export declare namespace TreeType {
    let Deciduous: string;
    let Evergreen_1: string;
        { Evergreen_1 as Evergreen };
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

