import * as THREE_2 from 'three';

export declare namespace BarkType {
    let Birch: string;
    let Oak: string;
    let Pine: string;
    let Willow: string;
}

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
    let Pine_1: string;
        { Pine_1 as Pine };
    let Oak_1: string;
        { Oak_1 as Oak };
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

export declare class Tree extends THREE_2.Group<THREE_2.Object3DEventMap> {
    /**
     * @param {TreeOptions} params
     */
    constructor(options?: TreeOptions);
    /**
     * @type {RNG}
     */
    rng: RNG;
    /**
     * @type {TreeOptions}
     */
    options: TreeOptions;
    /**
     * @type {Branch[]}
     */
    branchQueue: Branch[];
    branchesMesh: THREE_2.Mesh<THREE_2.BufferGeometry<THREE_2.NormalBufferAttributes>, THREE_2.Material | THREE_2.Material[], THREE_2.Object3DEventMap>;
    leavesMesh: THREE_2.Mesh<THREE_2.BufferGeometry<THREE_2.NormalBufferAttributes>, THREE_2.Material | THREE_2.Material[], THREE_2.Object3DEventMap>;
    /**
     * Loads a preset tree from JSON
     * @param {string} preset
     */
    loadPreset(name: any): void;
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
    /**
     * Generates a new branch
     * @param {Branch} branch
     * @returns
     */
    generateBranch(branch: Branch): void;
    /**
     * Generate branches from a parent branch
     * @param {number} count The number of child branches to generate
     * @param {number} level The level of the child branches
     * @param {{
             *  origin: THREE.Vector3,
             *  orientation: THREE.Euler,
             *  radius: number
             * }[]} sections The parent branch's sections
     * @returns
     */
    generateChildBranches(count: number, level: number, sections: {
        origin: THREE_2.Vector3;
        orientation: THREE_2.Euler;
        radius: number;
    }[]): void;
    /**
     * Logic for spawning child branches from a parent branch's section
     * @param {{
             *  origin: THREE.Vector3,
             *  orientation: THREE.Euler,
             *  radius: number
             * }[]} sections The parent branch's sections
     * @returns
     */
    generateLeaves(sections: {
        origin: THREE_2.Vector3;
        orientation: THREE_2.Euler;
        radius: number;
    }[]): void;
    /**
     * Generates a leaves
     * @param {THREE.Vector3} origin The starting point of the branch
     * @param {THREE.Euler} orientation The starting orientation of the branch
     */
    generateLeaf(origin: THREE_2.Vector3, orientation: THREE_2.Euler): void;
    /**
     * Generates the indices for branch geometry
     * @param {Branch} branch
     */
    generateBranchIndices(indexOffset: any, branch: Branch): void;
    /**
     * Generates the geometry for the branches
     */
    createBranchesGeometry(): void;
    /**
     * Generates the geometry for the leaves
     */
    createLeavesGeometry(): void;
}

declare class TreeOptions {
    seed: number;
    type: string;
    bark: {
        type: string;
        tint: number;
        flatShading: boolean;
        textured: boolean;
        textureScale: {
            x: number;
            y: number;
        };
    };
    branch: {
        levels: number;
        angle: {
            1: number;
            2: number;
            3: number;
        };
        children: {
            0: number;
            1: number;
            2: number;
        };
        force: {
            direction: {
                x: number;
                y: number;
                z: number;
            };
            strength: number;
        };
        gnarliness: {
            0: number;
            1: number;
            2: number;
            3: number;
        };
        length: {
            0: number;
            1: number;
            2: number;
            3: number;
        };
        radius: {
            0: number;
            1: number;
            2: number;
            3: number;
        };
        sections: {
            0: number;
            1: number;
            2: number;
            3: number;
        };
        segments: {
            0: number;
            1: number;
            2: number;
            3: number;
        };
        start: {
            1: number;
            2: number;
            3: number;
        };
        taper: {
            0: number;
            1: number;
            2: number;
            3: number;
        };
        twist: {
            0: number;
            1: number;
            2: number;
            3: number;
        };
    };
    leaves: {
        type: string;
        billboard: string;
        angle: number;
        count: number;
        start: number;
        size: number;
        sizeVariance: number;
        tint: number;
        alphaTest: number;
    };
}

export declare namespace TreePreset {
    let Ash_1: number;
        { Ash_1 as Ash };
    let Aspen_1: number;
        { Aspen_1 as Aspen };
    let Pine_2: number;
        { Pine_2 as Pine };
    let Oak_2: number;
        { Oak_2 as Oak };
}

export declare namespace TreeType {
    let Deciduous: string;
    let Evergreen: string;
}

export { }

export namespace BarkType {
    let Birch: string;
    let Oak: string;
    let Pine: string;
    let Willow: string;
}


export namespace Billboard {
    let Single: string;
    let Double: string;
}


export namespace TreeType {
    let Deciduous: string;
    let Evergreen: string;
}

