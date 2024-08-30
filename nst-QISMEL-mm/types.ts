
/**
 * @file types.ts
 * @module Types
 * @description This file defines core types and interfaces used throughout the AGI system,
 * including the Neuro-Symbolic Tensor (NST) which is central to the system's
 * information processing capabilities.
 */

/**
 * Represents the possible typed arrays that can be used in the NST.
 */
export type TypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;

/**
 * Represents a feature map in the NST.
 */
export interface FeatureMap {
    /** The name of the feature */
    name: string;
    /** The coordinates of the feature in the tensor */
    coordinates: number[];
    /** The type of the feature */
    type: string;
}

/**
 * Represents metadata associated with an NST.
 */
export interface Metadata {
    /** The source of the data */
    source: string;
    /** The processing steps applied to the data */
    processingSteps: string[];
    /** Additional custom fields */
    customFields: { [key: string]: any };
}

/**
 * Represents a Neuro-Symbolic Tensor (NST), which combines numerical and symbolic data.
 * @template T The type of TypedArray used to store the numerical data.
 */
export class NST<T extends TypedArray> {
    /** The numerical data of the tensor */
    data: T;
    /** The shape of the tensor */
    shape: number[];
    /** The datatype of the tensor */
    datatype: string;
    /** The features associated with the tensor */
    features: FeatureMap[];
    /** Metadata associated with the tensor */
    metadata: Metadata;
    /** Whether GPU acceleration is enabled */
    private gpuAccelerated: boolean;
    /** Image embeddings associated with the tensor */
    imageEmbeddings?: Float32Array;
    /** Audio embeddings associated with the tensor */
    audioEmbeddings?: Float32Array;
    /** Additional sensor data associated with the tensor */
    sensorData?: { [key: string]: number };
    /** The task context associated with the tensor */
    taskContext?: string;
    /** The environmental context associated with the tensor */
    environmentContext?: string;

    /**
     * Creates a new NST instance.
     * @param {T} data - The numerical data of the tensor.
     * @param {number[]} shape - The shape of the tensor.
     * @param {string} datatype - The datatype of the tensor.
     * @param {FeatureMap[]} [features=[]] - The features associated with the tensor.
     */
    constructor(data: T, shape: number[], datatype: string, features: FeatureMap[] = []) {
        this.data = data;
        this.shape = shape;
        this.datatype = datatype;
        this.features = features;
        this.metadata = { source: '', processingSteps: [], customFields: {} };
        this.gpuAccelerated = false;
    }

    /**
     * Gets the value at the specified coordinates in the tensor.
     * @param {number[]} coordinates - The coordinates to get the value from.
     * @returns {number} The value at the specified coordinates.
     */
    get(coordinates: number[]): number {
        const index = this.coordinatesToIndex(coordinates);
        return this.data[index];
    }

    /**
     * Sets the value at the specified coordinates in the tensor.
     * @param {number[]} coordinates - The coordinates to set the value at.
     * @param {number} value - The value to set.
     */
    set(coordinates: number[], value: number): void {
        const index = this.coordinatesToIndex(coordinates);
        this.data[index] = value;
    }

    /**
     * Transposes the tensor.
     * @returns {NST<T>} A new NST representing the transposed tensor.
     */
    transpose(): NST<T> {
        // Implementation details...
    }

    /**
     * Normalizes the tensor.
     * @returns {NST<T>} A new NST representing the normalized tensor.
     */
    normalize(): NST<T> {
        // Implementation details...
    }

    /**
     * Adds another NST to this one.
     * @param {NST<T>} other - The NST to add.
     * @returns {NST<T>} A new NST representing the sum.
     */
    add(other: NST<T>): NST<T> {
        // Implementation details...
    }

    /**
     * Multiplies this NST with another element-wise.
     * @param {NST<T>} other - The NST to multiply with.
     * @returns {NST<T>} A new NST representing the product.
     */
    multiply(other: NST<T>): NST<T> {
        // Implementation details...
    }

    /**
     * Enables GPU acceleration for tensor operations.
     */
    enableGPUAcceleration(): void {
        // Implementation details...
    }

    /**
     * Adds metadata to the tensor.
     * @param {string} key - The key for the metadata.
     * @param {any} value - The value of the metadata.
     */
    addMetadata(key: string, value: any): void {
        this.metadata.customFields[key] = value;
    }

    /**
     * Converts coordinates to a flat index.
     * @private
     * @param {number[]} coordinates - The coordinates to convert.
     * @returns {number} The flat index.
     */
    private coordinatesToIndex(coordinates: number[]): number {
        return coordinates.reduce((acc, val, idx) => acc * this.shape[idx] + val, 0);
    }

    /**
     * Checks if this NST has the same shape as another.
     * @private
     * @param {NST<T>} other - The other NST to compare with.
     * @returns {boolean} True if the shapes are the same, false otherwise.
     */
    private isSameShape(other: NST<T>): boolean {
        return this.shape.length === other.shape.length &&
               this.shape.every((dim, i) => dim === other.shape[i]);
    }
}
